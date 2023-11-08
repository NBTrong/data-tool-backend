import {
  Route,
  Controller,
  Tags,
  OperationId,
  TsoaResponse,
  Res,
  Query,
  Get,
} from 'tsoa';
import { injectable } from 'inversify';

import { lazyInject } from '@n-configs/container';
import { SERVICES } from '@n-types/injections/services';
import { ITikTokServices } from '@n-services/interface/ITikTokServices';
import { InternalError } from '@n-errors/HttpError';
import { CResponse } from '../types';

@injectable()
@Tags('Crawl')
@Route('api/v1/crawl')
export class CrawlDataController extends Controller {
  @lazyInject(SERVICES.TikTokServices)
  private tiktokServices: ITikTokServices;

  @Get('/tiktok')
  @OperationId('crawlTiktokData')
  public async crawlTiktokData(
    @Res() res: TsoaResponse<200, CResponse>,
    @Query() post_id: string,
    @Query() region?: string,
  ): Promise<CResponse> {
    try {
      const post = await this.tiktokServices.getPostById(post_id, region);
      return {
        message: `Crawl tiktok post: ${post_id} successfully`,
        status: 'success',
        data: post,
      };
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Get('/tiktok/hashtag-posts')
  @OperationId('crawlTiktokSearchHashtagPosts')
  public async crawlTiktokSearchHashtagPosts(
    @Res() res: TsoaResponse<200, CResponse>,
    @Query() cid: string,
    @Query() cursor?: string,
    @Query() region?: string,
  ): Promise<CResponse> {
    try {
      const response = await this.tiktokServices.searchPostsByHashtag(cid, cursor, region);
      return {
        message: `Get posts by cid '${cid}' successfully`,
        status: 'success',
        data: response,
      };
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Get('/tiktok/hashtag-id')
  @OperationId('crawlTiktokGetHashtagId')
  public async crawlTiktokGetHashtagId(
    @Res() res: TsoaResponse<200, CResponse>,
    @Query() hashtag: string,
  ): Promise<CResponse> {
    try {
      const response = await this.tiktokServices.getHashtagId(hashtag);
      return {
        message: `Get hashtag id: '${hashtag}' successfully`,
        status: 'success',
        data: response,
      };
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Get('/tiktok/user-info')
  @OperationId('crawlTiktokGetUserInfo')
  async crawlTiktokGetUserInfo(
    @Res() res: TsoaResponse<200, CResponse>,
    @Query() username: string,
  ) {
    const ui = await this.tiktokServices.getUserInfo(username);
    return {
      message: `Get id of user: '${username}' successfully`,
      status: 'success',
      data: ui,
    };
  }

  @Get('/tiktok/user-posts')
  @OperationId('crawlTiktokUserPosts')
  public async crawlTiktokUserPosts(
    @Res() res: TsoaResponse<200, CResponse>,
    @Query() search: any,
    @Query() maxCursor?: string,
    @Query() count?: string,
  ): Promise<CResponse> {
    try {
      const response = await this.tiktokServices.getUserPosts(search, maxCursor, count);
      return {
        message: `Get all posts from user: '${search}' successfully`,
        status: 'success',
        data: response,
      };
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }
  @Get('/tiktok/post-comments')
  @OperationId('crawlTiktokPostComments')
  public async crawlTiktokPostComments(
    @Res() res: TsoaResponse<200, CResponse>,
    @Query() aweme_id: string,
    @Query() cursor: string,
  ): Promise<CResponse> {
    try {
      const response = await this.tiktokServices.getPostComments(aweme_id, cursor);
      return {
        message: `Get comments from post: '${aweme_id}' successfully`,
        status: 'success',
        data: response,
      };
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Get('/tiktok/post-comment-replies')
  @OperationId('crawlTiktokPostCommentReplies')
  public async crawlTiktokPostCommentReplies(
    @Res() res: TsoaResponse<200, CResponse>,
    @Query() aweme_id: string,
    @Query() comment_id: string,
    @Query() cursor: string,
  ): Promise<CResponse> {
    try {
      const response = await this.tiktokServices.getPostCommentReplies(
        aweme_id,
        comment_id,
        cursor,
      );
      return {
        message: `Get comment's replies from comment: '${comment_id}' successfully`,
        status: 'success',
        data: response,
      };
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Get('/tiktok/search/post')
  @OperationId('crawlTiktokSearchPost')
  public async crawlTiktokSearchPost(
    @Res() res: TsoaResponse<200, CResponse>,
    @Query() keyword: string,
    @Query() offset?: number,
    @Query() sort_type?: number,
    @Query() publish_time?: number,
  ): Promise<CResponse> {
    try {
      const response = await this.tiktokServices.searchPostsByKeyword(
        keyword,
        offset,
        sort_type,
        publish_time,
      );
      return {
        message: `Search post by keyword: '${keyword}' successfully`,
        status: 'success',
        data: response,
      };
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }

  }
}