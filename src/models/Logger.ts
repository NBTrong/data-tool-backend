/* eslint-disable import/no-cycle */
import { db } from '@n-configs/database';
import { ExtendedModel } from './ExtendedModel';
import User from './User';

class Logger extends ExtendedModel {
  static tableName = 'loggers';

  id!: number;

  user_id?: number;

  endpoint!: string;

  method!: string;

  response_status!: number;

  latency!: string;

  time!: string;

  error_message!: string;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      user_id: { type: 'integer', nullable: true },
      endpoint: { type: 'string' },
      method: { type: 'string' },
      response_status: { type: 'integer' },
      latency: { type: 'string' },
      time: { type: 'string' },
      error_message: { type: 'string' },
    },
  };
}

const LoggerModel = Logger.bindKnex(db);

export default LoggerModel;

LoggerModel.relationMappings = {
  users: {
    relation: ExtendedModel.BelongsToOneRelation,
    modelClass: () => User,
    join: {
      from: 'loggers.user_id',
      to: 'users.id',
    },
  },
};
