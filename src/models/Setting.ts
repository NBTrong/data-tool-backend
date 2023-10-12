import { db } from '@n-configs/database';
import { ExtendedModel } from './ExtendedModel';

class Setting extends ExtendedModel {
  id!: number;

  name?: string;

  value!: string;

  type!: string;

  created_at?: Date | null;

  updated_at?: Date | null;

  static tableName = 'settings';

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
      name: { type: 'string', maxLength: 512 },
      type: { type: 'string', maxLength: 128 },
      value: { type: 'string' },
    },
  };
}

const SettingModel = Setting.bindKnex(db);
export default SettingModel;

SettingModel.relationMappings = {

};
