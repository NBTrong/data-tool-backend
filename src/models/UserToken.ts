/* eslint-disable import/no-cycle */
import { db } from '@n-configs/database';
import { ExtendedModel } from './ExtendedModel';
import User from './User';

class UserToken extends ExtendedModel {
  id!: number;

  user_id!: number;

  token!: string;

  created_at?: Date | null;

  updated_at?: Date | null;

  static tableName = 'user_tokens';

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
      user_id: { type: 'integer' },
      token: { type: 'string', maxLength: 255 },
    },
  };
}

const UserTokenModel = UserToken.bindKnex(db);
export default UserTokenModel;

UserTokenModel.relationMappings = {
  user: {
    relation: ExtendedModel.BelongsToOneRelation,
    modelClass: () => User,
    join: {
      from: 'user_tokens.user_id',
      to: 'users.id',
    },
  },
};
