import {
} from '@n-services/types';
import { InputFileFilter } from '@n-types/filters';

export interface IInputFileServices {
  uploadFile(file: any, path?: string, fileName?: string): Promise<any>;
  createInputFile(file: any, tab?: string, row_count?: number, query?: string): Promise<any>;
  listInputFile(filter: InputFileFilter): Promise<any>;
  getInputFileInQueue(): Promise<any>;
  updateProgress(id: number, body:
  { status?: string, progress?: number, result_url?: string, start_time?: string,index_processed?: number, total_success?: number }
  ): Promise<any>;
  getInputFile(id: number): Promise<any>;
}
