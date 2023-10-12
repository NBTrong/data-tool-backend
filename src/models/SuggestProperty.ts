/* eslint-disable import/no-cycle */
import { db } from '@n-configs/database';
import SuggestModel from './SuggestModel';
import { ExtendedModel } from './ExtendedModel';

class SuggestProperty extends ExtendedModel {
  id!: number;

  name?: string;

  model_id?: number;

  created_at?: Date | null;

  updated_at?: Date | null;

  static tableName = 'suggest_properties';

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
      model_id: { type: 'integer' },
    },
  };
}

const SuggestPropertyModel = SuggestProperty.bindKnex(db);
export default SuggestPropertyModel;

SuggestPropertyModel.relationMappings = {
  suggest_models: {
    relation: ExtendedModel.BelongsToOneRelation,
    modelClass: () => SuggestModel,
    join: {
      from: 'suggest_properties.model_id',
      to: 'suggest_models.id',
    },
  },
};
