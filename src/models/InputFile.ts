/* eslint-disable import/no-cycle */
import { db } from '@n-configs/queue';
import { ExtendedModel } from './ExtendedModel';

class InputFile extends ExtendedModel {
  id!: number;

  name?: string;

  url!: string;

  tab?: string;

  query?: string;

  row_count?: number;

  size?: number;

  total_success?: number;

  progress?: number;

  status?: string;

  result_url?: string;

  created_at?: Date | null;

  updated_at?: Date | null;

  start_time?: Date | null;

  static tableName = 'input_files';

  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', maxLength: 512 },
      url: { type: 'string', maxLength: 512 },
      query: { type: 'string', maxLength: 1024 },
      tab: { type: 'string', maxLength: 128 },
      status: { type: 'string', maxLength: 128 },
      result_url: { type: 'string' },
      row_count: { type: 'integer' },
      total_success: { type: 'integer' },
      progress: { type: 'integer' },
      start_time: { type: 'string', format: 'date-time' },
      size: { type: 'integer' },
    },
  };
}

const InputFileModel = InputFile.bindKnex(db);
export default InputFileModel;

InputFileModel.relationMappings = {

};
