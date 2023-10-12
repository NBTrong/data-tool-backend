/* eslint-disable import/no-cycle */
import { db } from '@n-configs/database';
import TrainingFile from './TrainingFile';
import { ExtendedModel } from './ExtendedModel';

class Keyword extends ExtendedModel {
  id!: number;

  name!: string;

  data?: object;

  training_file_id!: number;

  created_at?: Date | null;

  updated_at?: Date | null;

  static tableName = 'keywords';

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
      data: { type: 'object' },
      training_file_id: { type: 'integer' },
    },
  };
}

const KeywordModel = Keyword.bindKnex(db);
export default KeywordModel;

KeywordModel.relationMappings = {
  training_file: {
    relation: ExtendedModel.BelongsToOneRelation,
    modelClass: () => TrainingFile,
    join: {
      from: 'keywords.training_file_id',
      to: 'training_files.id',
    },
  },
};
