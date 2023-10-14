/* eslint-disable import/no-cycle */
import { db } from '@n-configs/database';
import { Pojo } from 'objection';
import { ExtendedModel } from './ExtendedModel';
import UserToken from './UserToken';

class User extends ExtendedModel {
  id!: number;

  email!: string;

  username!: string;

  password!: string;

  phone?: string;

  address?: string;

  bio?: string;

  color?: string;

  avatar_url?: string;

  archived?: boolean;

  archiver_id?: number;

  archived_at?: Date;

  created_at?: Date | null;

  updated_at?: Date | null;

  static tableName = 'users';

  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }

  $formatJson(json: Pojo): Pojo {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      email: { type: 'string', maxLength: 255, format: 'email' },
      username: { type: 'string', maxLength: 255 },
      password: { type: 'string', maxLength: 255 },
      phone: { type: ['string', 'null'], maxLength: 255 },
      address: { type: ['string', 'null'] },
      bio: { type: ['string', 'null'] },
      color: { type: ['string', 'null'], maxLength: 7 },
      avatar_url: { type: ['string', 'null'] },
      tiktok_metadata: { type: ['object', 'null'] },
      instagram_metadata: { type: ['object', 'null'] },
      facebook_metadata: { type: ['object', 'null'] },
      youtube_metadata: { type: ['object', 'null'] },
      archived: { type: 'boolean' },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' },
    },
  };
}

const UserModel = User.bindKnex(db);

export default UserModel;

UserModel.relationMappings = {
  user_tokens: {
    relation: ExtendedModel.HasManyRelation,
    modelClass: () => UserToken,
    join: {
      from: 'users.id',
      to: 'user_tokens.user_id',
    },
  },
};
