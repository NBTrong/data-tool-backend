/* eslint-disable import/no-cycle */
import { db } from '@n-configs/database';
import { ExtendedModel } from './ExtendedModel';

class Campaign extends ExtendedModel {
  id!: number;

  campaign_id!: number;

  post_url?: string;

  title!: string;

  platform!: string;

  total_views?: number;

  total_saves?: number;

  total_likes?: number;

  total_shares?: number;

  total_comments?: number;

  uploaded_time?: number;

  created_at?: Date | null;

  updated_at?: Date | null;

  static tableName = 'contents';

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
      campaign_id: { type: 'integer' },
      post_url: { type: 'string', maxLength: 1024 },
      title: { type: 'string', maxLength: 512 },
      platform: { type: 'string', maxLength: 128 },
      total_campaigns: { type: 'integer' },
      total_views: { type: 'integer' },
      total_saves: { type: 'integer' },
      total_likes: { type: 'integer' },
      total_shares: { type: 'integer' },
      total_comments: { type: 'integer' },
      uploaded_time: { type: 'integer' },
    },
  };
}

const CampaignModel = Campaign.bindKnex(db);
export default CampaignModel;

CampaignModel.relationMappings = {

};
