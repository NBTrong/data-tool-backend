/* eslint-disable import/no-cycle */
import { db } from '@n-configs/queue';
import InputFile from '@n-models/InputFile';
import { ExtendedModel } from './ExtendedModel';

class KeywordChannelExplore extends ExtendedModel {
  id!: number;

  input_file_id!: number;

  keyword?: string;

  post_url?: string;

  koc?: string;

  platform!: string;

  description!: string;

  thumb_url!: string;

  tags!: string;

  total_views?: number;

  total_likes?: number;

  total_shares?: number;

  total_comments?: number;

  total_saves?: number;

  koc_follower_count?: number;

  status?: number;

  uploaded_time?: string;

  static tableName = 'keyword_channel_explores';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      input_file_id: { type: 'integer' },
      keyword: { type: 'string' },
      post_url: { type: 'string' },
      koc: { type: 'string', maxLength: 128 },
      platform: { type: 'string', maxLength: 128 },
      description: { type: 'string' },
      thumb_url: { type: 'string' },
      tags: { type: 'string' },
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

  // Define fillAble fields
  static fillAbles = [
    'input_file_id',
    'keyword',
    'post_url',
    'koc',
    'platform',
    'description',
    'thumb_url',
    'tags',
    'total_views',
    'total_likes',
    'total_shares',
    'total_comments',
    'total_saves',
    'koc_follower_count',
    'uploaded_time',
    'status',
  ];

  // Export fillAbles
  static get fillAble() {
    return KeywordChannelExplore.fillAbles;
  }
}

const KeywordChannelExploreModel = KeywordChannelExplore.bindKnex(db);
export default KeywordChannelExploreModel;

KeywordChannelExploreModel.relationMappings = {
  input_file: {
    relation: ExtendedModel.HasOneRelation,
    modelClass: () => InputFile,
    join: {
      from: 'keyword_channel_explores.input_file_id',
      to: 'input_files.id',
    },
  },
};
