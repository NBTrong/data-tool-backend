export type SCampaign = {
  id: number;
  platform: string;
  on_platform_id: string;
  owner_id: string;
  title?: string;
  description?: string;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  view_count?: number;
  save_count?: number;
  cover_image_url?: string;
  create_time?: Date;
  embed_html?: string;
  embed_link?: string;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export type SCampaignList = {
  campaigns: SCampaign[];
  statistics: {
    total_view: number;
    total_like: number;
    total_comment: number;
    total_share: number;
    total_save: number;
  };
  pagination: {
    total: number;
    currentPage: number;
    totalPage: number;
    limit: number;
  };
};

export type SExportCampaign = {
  KOC: string;
  Tier: string;
  Product: string;
  Post: string;
  Platform: string;
  Create_time: string;
  Category: string;
  View: number;
  Like: number;
  Save: number;
  Share: number;
};
