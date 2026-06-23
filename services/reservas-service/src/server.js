const app = require('./app');
const db = require('./config/db');
const env = require('./config/env');

async function start() {
  try {
    await db.query('SELECT 1');

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
