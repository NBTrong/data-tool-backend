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
}
