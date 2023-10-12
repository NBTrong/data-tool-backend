/* eslint-disable import/no-cycle */
import { db } from '@n-configs/database';
import Keyword from './Keyword';
import { ExtendedModel } from './ExtendedModel';

class TrainingFile extends ExtendedModel {
  id!: number;

  name!: string;

  finetune_id?: string;

  url?: string;

  type?: string;

  status?: string;

  offset?: number;

  size?: number;

  model_id!: number;

  created_at?: Date | null;

  updated_at?: Date | null;

  static tableName = 'training_files';

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
      finetune_id: { type: 'string', maxLength: 512 },
      url: { type: 'string', maxLength: 512 },
      type: { type: 'string', maxLength: 512 },
      status: { type: 'string', maxLength: 512 },
      offset: { type: 'integer' },
      size: { type: 'integer' },
      model_id: { type: 'integer' },
    },
  };
}

const TrainingFileModel = TrainingFile.bindKnex(db);
export default TrainingFileModel;

TrainingFileModel.relationMappings = {
  keywords: {
    relation: ExtendedModel.HasManyRelation,
    modelClass: () => Keyword,
    join: {
      from: 'training_files.id',
      to: 'keywords.training_file_id',
    },
  },
};
