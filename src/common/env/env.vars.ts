import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { NodeEnv } from '../enum';

dotenv.config();

const config = new ConfigService();

const envVars = {
  NODE_ENV: config.get('NODE_ENV'),

  PORT: config.get('PORT'),

  DOCS_USERNAME: config.get('DOCS_USERNAME'),
  DOCS_PASS: config.get('DOCS_PASS'),

  POSTGRES_URL: config.get('POSTGRES_URL'),

  isDev: (() => config.get('NODE_ENV') === NodeEnv.DEV)(),

  isProd: (() => config.get('NODE_ENV') === NodeEnv.PROD)(),
};

export default Object.freeze(envVars);

export const validateEnv = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isDev, isProd, ...fields } = envVars;
  const missingValues = Object.keys(fields).filter(
    (field) => fields[field] === undefined,
  );

  if (missingValues.length) {
    const commaSeparatedValues = missingValues.join(', ');

    Logger.error(
      `Missing Env values for the following: ${commaSeparatedValues}`,
      'EnvValidator',
    );
  }
};
