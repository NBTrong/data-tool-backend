/* eslint-disable import/no-cycle */
import { db } from '@n-configs/database';
import content from '@n-models/Content';
import { ExtendedModel } from './ExtendedModel';

class Campaign extends ExtendedModel {
  id!: number;

  name?: string;

  platforms!: string;

  total_contents?: number;

  total_views?: number;

  total_saves?: number;

  total_likes?: number;

  total_shares?: number;

  total_comments?: number;

  created_at?: Date | null;

  updated_at?: Date | null;

  static tableName = 'campaigns';

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
      platforms: { type: 'string', maxLength: 128 },
      total_campaigns: { type: 'integer' },
      total_views: { type: 'integer' },
      total_saves: { type: 'integer' },
      total_likes: { type: 'integer' },
      total_shares: { type: 'integer' },
      total_comments: { type: 'integer' },
    },
  };
}

const CampaignModel = Campaign.bindKnex(db);
export default CampaignModel;

CampaignModel.relationMappings = {
  campaign_contents: {
    relation: ExtendedModel.HasManyRelation,
    modelClass: () => content,
    join: {
      from: 'campaigns.id',
      to: 'contents.campaign_id',
    },
  },
};
