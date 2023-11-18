import {
  Route,
  Get,
  Controller,
  Tags,
  OperationId,
  TsoaResponse,
  Res, Body, Path, Put, Query,
} from 'tsoa';
import { ISettingServices } from '@n-services/interface';
import { lazyInject } from '@n-configs/container';
import { SERVICES } from '@n-types/injections/services';
import { injectable } from 'inversify';
import { CSettingCreate, CResponse } from '../types';

@injectable()
@Tags('Settings')
@Route('api/v1/settings')
export class SettingController extends Controller {
  @lazyInject(SERVICES.SettingServices)
  private settingService: ISettingServices;

  @Get('/type')
  @OperationId('getSettingByType')
  public async getSettingByType(
    @Res() res: TsoaResponse<200, CResponse>,
      @Query() type: string,
  ): Promise<void> {
    try {
      const settings = await this.settingService.getSettingByType(type);
      return res(200, {
        message: 'Get setting successfully.',
        status: 'success',
        data: settings,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Put('/{settingId}/update')
  @OperationId('updateSetting')
  public async updateSetting(
    @Res() res: TsoaResponse<200, CResponse>,
      @Path() settingId,
      @Body() body: CSettingCreate,
  ): Promise<void> {
    try {
      const settings = await this.settingService.updateSetting(settingId, body);
      return res(200, {
        message: 'Update setting successfully.',
        status: 'success',
        data: settings,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }
}
