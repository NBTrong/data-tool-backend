/* eslint-disable import/no-cycle */
import { db } from '@n-configs/database';
import { ExtendedModel } from './ExtendedModel';

class Cookie extends ExtendedModel {
  id!: number;

  value!: string;

  expired!: boolean;

  type!: string;

  created_at?: Date | null;

  updated_at?: Date | null;

  static tableName = 'cookies';

  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      value: { type: 'string' },
      expired: { type: 'boolean' },
      type: { type: 'string' },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' },
    },
  };
}

const CookieModel = Cookie.bindKnex(db);
export default CookieModel;
