/* eslint-disable no-console */
import { inject, injectable } from 'inversify';
import { InternalError, NotFoundError } from '@n-errors/HttpError';
import axios, { AxiosRequestConfig } from 'axios';
import { sleepEach50Requests, sleepIfTooManyRequest } from '@n-utils/sleep';
import { ITikTokServices } from './interface/ITikTokServices';
import { timestampToDate } from "@n-utils/helper";

@injectable()
export class TikTokServices implements ITikTokServices {
  private countNumberUserPostPerRes = 20;

  private countNumberSearchPostPerRes = 30;

  private countNumberPostCommentsPerRes = 20;

  private defaultRegion = 'GB';

  tiktokRapidApi = axios.create({
    baseURL: 'https://tokapi-mobile-version.p.rapidapi.com/v1',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'tokapi-mobile-version.p.rapidapi.com',
    },
  });

  parseDataPosts(data) {
    const awemeList = data.aweme_list?.map((item) => {
      const koc_follower_count = item?.author?.follower_count ?? 0;
      const description = item?.desc;
      const post_url = `https://www.tiktok.com/@${item?.author?.unique_id}/video/${item?.aweme_id}`;
      const koc = item?.author?.unique_id;
      return {
        id: item?.aweme_id,
        name: description,
        desc: description,
        description,
        koc_follower_count,
        post_url,
        koc,
        video: {
          thumb: item?.video?.cover?.url_list[0],
          url: post_url,
        },
        author: {
          name: item?.author?.nickname,
          avatar_url: item?.author?.avatar_thumb?.url_list[0],
          unique_id: koc,
          follower_count: koc_follower_count
        },
        total_comments: item?.statistics?.comment_count ?? 0,
        total_likes: item?.statistics?.digg_count ?? 0,
        total_saves: item?.statistics?.collect_count ?? 0,
        total_shares: item?.statistics?.share_count ?? 0,
        total_views: item?.statistics?.play_count ?? 0,
        created_at: item?.create_time,
        uploaded_time: timestampToDate(item?.create_time),
      }
    }) || [];
    const cursor = data?.cursor;
    const hasMore = data?.has_more;
    const maxCursor = data?.max_cursor;

    return {
      aweme_list: awemeList,
      cursor,
      has_more: hasMore,
      count: this.countNumberSearchPostPerRes,
      max_cursor: maxCursor,
      next_page: maxCursor,
    };
  }
}
