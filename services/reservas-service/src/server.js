const app = require('./app');
const db = require('./config/db');
const env = require('./config/env');

const STARTUP_RETRIES = Number(process.env.DB_STARTUP_RETRIES || 30);
const STARTUP_RETRY_DELAY_MS = Number(process.env.DB_STARTUP_RETRY_DELAY_MS || 2000);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForDatabase() {
  for (let attempt = 1; attempt <= STARTUP_RETRIES; attempt += 1) {
    try {
      await db.query('SELECT 1');
      return;
    } catch (error) {
      if (attempt === STARTUP_RETRIES) {
        throw error;
      }

      console.log(`Waiting for reservations database (${attempt}/${STARTUP_RETRIES})...`);
      await sleep(STARTUP_RETRY_DELAY_MS);
    }
  }
}

async function start() {
  try {
    await waitForDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`Reservations service listening on port ${env.PORT}`);
    });

    async function shutdown() {
      server.close(async () => {
        await db.close();
        process.exit(0);
      });
    }

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Reservations service failed to start', error);
    process.exit(1);
  }
}

start();
