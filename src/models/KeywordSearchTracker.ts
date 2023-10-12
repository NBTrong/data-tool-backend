/* eslint-disable import/no-cycle */
import { db } from '@n-configs/queue';
import InputFile from '@n-models/InputFile';
import { ExtendedModel } from './ExtendedModel';

class KeywordSearchTracker extends ExtendedModel {
  id!: number;

  input_file_id!: number;

  keyword?: string;

  labels?: string;

  similar_keywords?: string;

  search_volume?: number;

  bid_price?: number;

  min_price?: number;

  max_price?: number;

  status?: number;

  trend?: string;

  static tableName = 'keyword_search_trackers';

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

  // Define fillAble fields specific to KeywordSearchTracker
  static fillAbles = [
    'input_file_id',
    'keyword',
    'labels',
    'similar_keywords',
    'search_volume',
    'bid_price',
    'min_price',
    'max_price',
    'trend',
    'status',
  ];

  // Export fillAbles
  static get fillAble() {
    return KeywordSearchTracker.fillAbles;
  }
}

const KeywordSearchTrackerModel = KeywordSearchTracker.bindKnex(db);
export default KeywordSearchTrackerModel;

KeywordSearchTrackerModel.relationMappings = {
  input_file: {
    relation: ExtendedModel.HasOneRelation,
    modelClass: () => InputFile,
    join: {
      from: 'keyword_search_trackers.input_file_id',
      to: 'input_files.id',
    },
  },
};
