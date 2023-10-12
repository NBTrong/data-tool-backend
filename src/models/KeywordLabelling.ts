/* eslint-disable import/no-cycle */
import { db } from '@n-configs/queue';
import InputFile from '@n-models/InputFile';
import { ExtendedModel } from './ExtendedModel';

class KeywordLabelling extends ExtendedModel {
  id!: number;

  input_file_id!: number;

  keyword?: string;

  labels?: string;

  similar_keywords?: string;

  confident_rate?: number;

  status?: number;

  static tableName = 'keyword_labellings';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      input_file_id: { type: 'integer' },
      keyword: { type: 'string' },
      labels: { type: 'string' },
      similar_keywords: { type: 'string' },
      confident_rate: { type: 'integer' },
      status: { type: 'integer' },
    },
  };

  static fillAbles = [
    'input_file_id',
    'keyword',
    'labels',
    'status',
    'similar_keywords',
    'confident_rate',
  ];

  // Export fillAbles
  static get fillAble() {
    return KeywordLabelling.fillAbles;
  }
}

const KeywordLabellingModel = KeywordLabelling.bindKnex(db);
export default KeywordLabellingModel;

KeywordLabellingModel.relationMappings = {
  input_file: {
    relation: ExtendedModel.HasOneRelation,
    modelClass: () => InputFile,
    join: {
      from: 'keyword_labellings.input_file_id',
      to: 'input_files.id',
    },
  },
};
