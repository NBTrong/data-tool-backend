import {
    Route,
    Post,
    Get,
    Query,
    Controller,
    Tags,
    OperationId,
    Res,
    Path,
    TsoaResponse, Body,
} from 'tsoa';
import {IQueueServices} from '@n-services/interface';
import {lazyInject} from '@n-configs/container';
import {SERVICES} from '@n-types/injections/services';
import {injectable} from 'inversify';
import {CQueueImport, CResponse} from '../types';

@injectable()
@Tags('queue')
@Route('api/v1/queue')
export class QueueController extends Controller {
    @lazyInject(SERVICES.QueueServices)
    private queueServices: IQueueServices;

    @Post('/import')
    @OperationId('importRowToQueue')
    public async importRowToQueue(
        @Body() rows: CQueueImport[],
        @Query() tab: string,
        @Res() res: TsoaResponse<200, CResponse>,
        @Query() input_file_id?: number,
    ): Promise<CResponse> {
        try {
            const data = await this.queueServices.importRows(rows, tab, input_file_id);
            return res(200, {
                status: 'success',
                message: 'Import rows successfully',
                data,
            });
        } catch (error: any) {
            return res(error.code || 500, {
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/export')
    @OperationId('exportExcel')
    public async exportExcel(
        @Query() file_id: number,
        @Query() tab: string,
        @Res() res: TsoaResponse<200, CResponse>,
        @Query() batch_size?: number,
    ): Promise<CResponse> {
        try {
            const data = await this.queueServices.exportExcel(file_id, tab, batch_size);
            return res(200, {
                status: 'success',
                message: 'Export file successfully',
                data,
            });
        } catch (error: any) {
            return res(error.code || 500, {
                status: 'error',
                message: error.message,
            });
        }
    }


    @Get('/{fileId}/failed-rows')
    @OperationId('getFailedRows')
    public async getFailedRows(
        @Path() fileId,
        @Query() tab: string,
        @Res() res: TsoaResponse<200, CResponse>,
    ): Promise<CResponse> {
        try {
            const data = await this.queueServices.getFailedRows(tab, fileId);
            return res(200, {
                status: 'success',
                message: 'Get failed rows successfully',
                data,
            });
        } catch (error: any) {
            return res(error.code || 500, {
                status: 'error',
                message: error.message,
            });
        }
    }
}
