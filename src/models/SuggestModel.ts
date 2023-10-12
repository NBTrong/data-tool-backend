/* eslint-disable import/no-cycle */
import { db } from '@n-configs/database';
import SuggestProperty from './SuggestProperty';
import { ExtendedModel } from './ExtendedModel';

class SuggestModel extends ExtendedModel {
  id!: number;

  name!: string;

  openai_name?: string;

  finetune_id?: string;

  pricing?: string;

  status?: string;

  learning_rate?: number;

  archived?: boolean;

  created_at?: Date | null;

  updated_at?: Date | null;

  static tableName = 'suggest_models';

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
      project_id: { type: 'integer' },
    },
  };
}

const SuggestModelModel = SuggestModel.bindKnex(db);
export default SuggestModelModel;

SuggestModelModel.relationMappings = {
  suggest_properties: {
    relation: ExtendedModel.HasManyRelation,
    modelClass: () => SuggestProperty,
    join: {
      from: 'suggest_models.id',
      to: 'suggest_properties.model_id',
    },
  },
};
