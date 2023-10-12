export interface IQueueServices{
  importRows(rows: any, tab: string, input_file_id?: number): Promise<any>;
  clearRows(tab: string, fileId: number): Promise<any>;
  getFailedRows(tab: string, fileId: number): Promise<any>;
  exportExcel(fileId: any, tab: string, batchSize?: number): Promise<any>
}
