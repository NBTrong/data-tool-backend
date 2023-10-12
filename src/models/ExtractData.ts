/* eslint-disable import/no-cycle */
import { db } from '@n-configs/queue';
import InputFile from '@n-models/InputFile';
import { ExtendedModel } from './ExtendedModel';

class ExtractData extends ExtendedModel {
  id!: number;

  input_file_id!: number;

  post_url?: string;

  koc?: string;

  platform!: string;

  description!: string;

  thumb_url!: string;

  tags!: string;

  transcript!: string;

  match_keywords!: string;

  comments!: string;

  is_detect_voice!: Boolean;

  total_views?: number;

  total_likes?: number;

  total_shares?: number;

  total_comments?: number;

  total_saves?: number;

  koc_follower_count?: number;

  status?: number;

  uploaded_time?: string;

  static tableName = 'extract_data';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      input_file_id: { type: 'integer' },
      post_url: { type: 'string' },
      koc: { type: 'string', maxLength: 128 },
      platform: { type: 'string', maxLength: 128 },
      description: { type: 'string' },
      thumb_url: { type: 'string' },
      tags: { type: 'string' },
      transcript: { type: 'string' },
      match_keywords: { type: 'string' },
      comments: { type: 'string' },
      is_detect_voice: { type: 'integer' },
      total_views: { type: 'integer' },
      total_likes: { type: 'integer' },
      total_shares: { type: 'integer' },
      total_comments: { type: 'integer' },
      total_saves: { type: 'integer' },
      koc_follower_count: { type: 'integer' },
      status: { type: 'integer' },
      uploaded_time: { type: 'string' },
    },
  };

  // Define fillable fields
  static fillAbles = [
    'input_file_id',
    'post_url',
    'koc',
    'platform',
    'description',
    'thumb_url',
    'tags',
    'transcript',
    'match_keywords',
    'comments',
    'is_detect_voice',
    'total_views',
    'total_likes',
    'total_shares',
    'total_comments',
    'status',
    'total_saves',
    'koc_follower_count',
    'uploaded_time',
  ];

  // Export fillAbles
  static get fillAble() {
    return ExtractData.fillAbles;
  }
}

const ExtractDataModel = ExtractData.bindKnex(db);
export default ExtractDataModel;

ExtractDataModel.relationMappings = {
  input_file: {
    relation: ExtendedModel.HasOneRelation,
    modelClass: () => InputFile,
    join: {
      from: 'extract_data.input_file_id',
      to: 'input_files.id',
    },
  },
};
