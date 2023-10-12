// Update with your config settings.

import Knex, { Knex as K } from 'knex';
import objectionSoftDelete from 'objection-js-soft-delete';
import path from 'path';
import KnexLogger from './knexLogging';

if (!process.env.DB_HOST) {
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

const config: { [key: string]: K.Config } = {
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
      extension: 'ts',
      directory: '../database/migrations/production',
    },
    seeds: {
      extension: 'ts',
      directory: '../database/seeders/production',
    },
  },
};

const db = process.env.APP_ENV !== 'production'
  ? KnexLogger(Knex(config.production))
  : Knex(config.production);

export async function checkDatabaseConnection() {
  try {
    await db.raw('select 1+1 as result');
    // eslint-disable-next-line no-console
    console.log(
      'Connection has been established successfully.  (main database)',
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:  (main database)', error);
  }
}

// Specify the options for this plugin. This are the defaults.
const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});

export { db, softDelete };

export default config;
