import { registerAs } from '@nestjs/config';

export const EnvConstants = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

export const envConfiguration = registerAs('env', () => EnvConstants);