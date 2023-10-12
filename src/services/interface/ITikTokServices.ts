export interface ITikTokServices {
  // searchPostsByKeyword(keyword: string, offset: number): Promise<any>;
  searchPostsByHashtag(cid: string, cursor: string, region?:string): Promise<any>;
  getHashtagId(hashtag: string): Promise<any>;
  getUserInfo(username: string): Promise<any>;
  getUserPosts(search: any, maxCursor: string,
    count: string,
    region?: string,
    with_pinned_posts?: string): Promise<any>;
  getPostComments(aweme_id: string, cursor:string): Promise<any>;
  getPostCommentReplies(aweme_id: string, comment_id: string, cursor:string): Promise<any>;
  getPostById(post_id: string, region?: string): Promise<any>;
  searchPostsByKeyword(
    keyword: string,
    offset: number,
    sort_type: number,
    publish_time: number,
  ): Promise<any>;
}
