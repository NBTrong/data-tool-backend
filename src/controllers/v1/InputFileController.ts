import {
  Route,
  Get,
  Controller,
  Tags,
  OperationId,
  TsoaResponse,
  Res,
  Query,
  Path, Post, UploadedFile, Put,
} from 'tsoa';
import { IInputFileServices } from '@n-services/interface';
import { lazyInject } from '@n-configs/container';
import { SERVICES } from '@n-types/injections/services';
import { injectable } from 'inversify';
import InputFile from '@n-models/InputFile';
import { CResponse } from '../types';


@injectable()
@Tags('InputFile')
@Route('api/v1/input-file')
export class InputFileController extends Controller {
  @lazyInject(SERVICES.InputFileServices)
  private inputFileService: IInputFileServices;

  @Post('/')
  @OperationId('createInputFile')
  public async createInputFile(
    @Res() res: TsoaResponse<200, CResponse>,
    @UploadedFile() file: Express.Multer.File,
    @Query() tab?: string,
    @Query() row_count?: number,
    @Query() query?: string,
  ): Promise<void> {
    try {
      const files = await this.inputFileService
        .createInputFile(file, tab, row_count, decodeURIComponent(query));
      return res(200, {
        message: 'Create input file successfully.',
        status: 'success',
        data: files,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Get('/')
  @OperationId('listInputFile')
  public async listInputFile(
    @Res() res: TsoaResponse<200, CResponse>,
    @Query() page: number,
    @Query() limit: number,
    @Query() search?: string,
  ): Promise<void> {
    try {
      const inputFiles = await this.inputFileService.listInputFile({
        search,
        page,
        limit,
      });
      return res(200, {
        message: 'Get list input file successfully.',
        status: 'success',
        data: inputFiles,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Get('/count')
  @OperationId('countInputFiles')
  public async countInputFiles(
    @Res() res: TsoaResponse<200, CResponse>,
  ): Promise<void> {
    try {
      const count = await InputFile.query().whereIn('status', ['created', 'processing']).count();
      return res(200, {
        message: 'Count list input file successfully.',
        status: 'success',
        data: count,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Post('/upload-file')
  @OperationId('uploadExcelFile')
  public async uploadExcelFile(
    @Res() res: TsoaResponse<200, CResponse>,
    @UploadedFile() file: Express.Multer.File,
    @Query() path?: string,
    @Query() file_name?: string,
  ): Promise<void> {
    try {
      const url = await this.inputFileService.uploadFile(file, `${path}/data-crawled`, file_name);
      return res(200, {
        message: 'Upload file input file successfully.',
        status: 'success',
        data: url,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Put('/{fileInputId}/update-progress')
  @OperationId('updateProgress')
  public async updateProgress(
    @Res() res: TsoaResponse<200, CResponse>,
    @Path() fileInputId,
    @Query() progress?: number,
    @Query() status?: string,
    @Query() result_url?: string,
    @Query() start_time?: string,
    @Query() index_processed?: number,
    @Query() total_success?: number,
  ): Promise<void> {
    try {
      const url = await this.inputFileService.updateProgress(fileInputId, {
        progress, status, result_url, start_time, index_processed, total_success
      });
      return res(200, {
        message: 'Update file input file successfully.',
        status: 'success',
        data: url,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Get('/queue')
  @OperationId('getInputFileInQueue')
  public async getInputFileInQueue(
    @Res() res: TsoaResponse<200, CResponse>,
  ): Promise<void> {
    try {
      const fileData = await this.inputFileService.getInputFileInQueue();
      return res(200, {
        message: 'Get input files in queue successfully.',
        status: 'success',
        data: fileData,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }

  @Get('/{fileInputId}')
  @OperationId('getInputFile')
  public async getInputFile(
    @Res() res: TsoaResponse<200, CResponse>,
    @Path() fileInputId,
  ): Promise<void> {
    try {
      const url = await this.inputFileService.getInputFile(fileInputId);
      return res(200, {
        message: 'Get file input file successfully.',
        status: 'success',
        data: url,
      });
    } catch (error: any) {
      return res(error.code || 500, {
        message: error.message,
        status: 'error',
      });
    }
  }
}
