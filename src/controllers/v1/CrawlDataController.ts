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
}