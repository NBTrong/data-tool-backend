import {
  Route,
  Post,
  Put,
  Body,
  Controller,
  Tags,
  OperationId,
  Response,
  Security,
  Request,
  Res,
  TsoaResponse,
} from 'tsoa';
import { IAuthServices } from '@n-services/interface';
import { lazyInject } from '@n-configs/container';
import { SERVICES } from '@n-types/injections/services';
import { injectable } from 'inversify';
import { CResponse } from '../types';

@injectable()
@Tags('Auth')
@Route('api/v1')
export class AuthController extends Controller {
  @lazyInject(SERVICES.AuthServices)
  private authServices: IAuthServices;

  @Post('login')
  @OperationId('login')
  @Response<{ status: number; message: string }>(400, 'Bad Request')
  public async login(
    @Body() body: { password: string; email: string },
    @Res() res: TsoaResponse<200, CResponse>,
  ): Promise<void> {
    try {
      const tokens = await this.authServices.login(body.email, body.password);
      return res(200, {
        message: 'User logged in successfully',
        status: 'success',
        data: tokens,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Post('logout')
  @OperationId('logout')
  @Security('jwt')
  @Response<{ status: number; message: string }>(400, 'Bad Request')
  public async logout(
    @Request() request,
    @Res() res: TsoaResponse<200, CResponse>,
  ): Promise<void> {
    try {
      await this.authServices.logout(request.user.id);
      return res(200, {
        message: 'User logged out successfully.',
        status: 'success',
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Post('refreshToken')
  @OperationId('refreshToken')
  @Response<{ status: number; message: string }>(400, 'Bad Request')
  // eslint-disable-next-line consistent-return
  public async refresh(
    @Body() body: { refreshToken: string },
    @Res() res: TsoaResponse<200, CResponse>,
  ): Promise<void> {
    try {
      const data = await this.authServices.refresh(body.refreshToken);
      return res(200, {
        message: 'Token refreshed successfully.',
        status: 'success',
        data,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.toString(),
        status: 'error',
      });
    }
  }

  @Post('forgotPassword')
  @OperationId('forgotPassword')
  @Response<{ status: number; message: string }>(400, 'Bad Request')
  public async forgotPassword(
    @Body() body: { email: string },
    @Res() res: TsoaResponse<200, CResponse>,
  ): Promise<void> {
    try {
      await this.authServices.forgotPassword(body.email);
      return res(200, {
        message: 'A password reset link has been sent to your email.',
        status: 'success',
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Put('updatePassword')
  @OperationId('updatePassword')
  @Security('jwt')
  @Response<{ status: number; message: string }>(400, 'Bad Request')
  public async updatePassword(
    @Body() body: { password: string },
    @Request() request,
    @Res() res: TsoaResponse<200, CResponse>,
  ): Promise<void> {
    try {
      await this.authServices.updatePassword(request.user.id, body.password);
      return res(200, {
        message: 'Password updated successfully',
        status: 'success',
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.toString(),
        status: 'error',
      });
    }
  }
}
