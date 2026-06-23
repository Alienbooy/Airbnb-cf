const path = require('path');
const { z } = require('zod');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const rawEnv = {
  ...process.env,
  JWT_SECRET: process.env.JWT_SECRET || process.env.DJANGO_SECRET_KEY,
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4002),
  DB_HOST: z.string().min(1).default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().min(1).default('reservations_db'),
  DB_USER: z.string().min(1).default('postgres'),
  DB_PASSWORD: z.string().min(1).default('postgres'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET or DJANGO_SECRET_KEY is required'),
});

const parsedEnv = envSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');
  throw new Error(`Invalid reservations-service environment: ${details}`);
}

module.exports = parsedEnv.data;
