import { Page } from 'objection';
import InputFile from '@n-models/InputFile';
import { InputFileFilter } from '@n-types/filters';
import IRepository from '../IRepository';

export interface IInputFileRepository extends IRepository<typeof InputFile> {
  getInputFilesInQueue(): Promise<any>;
  getListInputFile(filter: InputFileFilter): Promise<Page<typeof InputFile['prototype']>>
}
