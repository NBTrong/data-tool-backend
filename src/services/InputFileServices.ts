import { InputFileFilter } from '@n-types/filters';
import { IInputFileRepository } from '@n-repositories/interfaces/v1';
import { REPOSITORIES } from '@n-types/injections/repositories';
import { inject, injectable } from 'inversify';

import { handleDatabaseError } from '@n-errors/DatabaseError';
import { InternalError } from '@n-errors/HttpError';
import { IInputFileServices } from '@n-services/interface/IInputFileServices';
import { uploadToGCS } from '@n-utils/fileUpload';
import { getTabModel } from "@n-utils/modelExport";


@injectable()
export class InputFileServices implements IInputFileServices {
    @inject(REPOSITORIES.InputFileRepository)
    private readonly inputFileRepository: IInputFileRepository;

    isValidFileName(fileName) {
        // Define a regular expression pattern for a valid file name
        // This example allows alphanumeric characters, underscores, hyphens, and periods.
        // You can customize this pattern to fit your specific requirements.
        var pattern = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)*$/;

        // Use the test method of the regular expression to check if the fileName matches the pattern
        return pattern.test(fileName);
    }

    validExcelFile(file, maxSize = 50 * 1024 * 1024, fileName = '') {
        const validType = true;
        // const validType = file.mimetype ===
        // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const validSize = true;

        const validFileName = fileName ? this.isValidFileName(fileName) : true;
        if (!validType) {
            throw new InternalError('File type is not supported');
        }
        if (!validSize) {
            throw new InternalError('File size is too large');
        }
        if (!validFileName) {
            throw new InternalError('The file name is not in the correct format. File names cannot contain special characters');
        }
        return file && validSize && validType && maxSize;
    }

    getFileNameNoSpacing(fileName) {
        return fileName.replace(/ /g, '') ? fileName.replace(/ /g, '-') : '';
    }

    public async uploadFile(file: any, path?: string, fileName = '') {
        const fileNameNoSpace = this.getFileNameNoSpacing(fileName);
        if (!this.validExcelFile(file, 100, fileNameNoSpace)) {
            throw new InternalError('File uploaded is not valid');
        }
        return uploadToGCS(file, `xdata-file/${path}`, fileNameNoSpace);
    }


    //
    // async splitFileAndUploadFile(file,tab,rowsPerFile=100000){
    //   const urls = [];
    //   const data = await this.readExcelFile(file)
    //   let currentRow = 0;
    //   let fileIndex = 1;
    //
    //   let currentData: any[] = [data[0]]; // Lưu dòng tiêu đề
    //
    //   for (let i = 1; i < data.length; i++) {
    //     currentData.push(data[i]);
    //     currentRow++;
    //
    //     if (currentRow % rowsPerFile === 0) {
    //       // Nếu đến đúng ngưỡng, xử lý dữ liệu và tạo tệp mới
    //       const url = await this.makeFileThenUpload(currentData, tab, fileIndex);
    //       urls.push(url)
    //       // currentData = [data[0]]; // Reset với dòng tiêu đề mới
    //       currentData = []; // Reset với dòng tiêu đề mới
    //       fileIndex++;
    //     }
    //   }
    //
    //   if (currentData.length > 1) {
    //     // Xử lý dữ liệu cuối cùng nếu có
    //     const url = await this.makeFileThenUpload(currentData, tab, fileIndex);
    //     urls.push(url)
    //   }
    //
    //   return urls;
    // }
    //
    // private async makeFileThenUpload(data: any[][], tab: string, fileIndex: number): Promise<void> {
    //   // Tạo tên tệp dựa trên tab và chỉ số
    //   const fileName = `${tab}_${fileIndex}.xlsx`;
    //
    //   // Tạo một workbook mới và thêm dữ liệu vào sheet mới
    //   const workbook = new ExcelJS.Workbook();
    //   const sheet = workbook.addWorksheet('Sheet 1');
    //   sheet.addRows(data);
    //
    //   // Lưu workbook vào tệp tin
    //   // after save, use upload to gcs function to get url then save to table
    //   await workbook.xlsx.writeFile(fileName);
    //   fs.unlinkSync(fileName);
    // }

    public async createInputFile(file: any, tab = '', row_count = 0, query = '', userId = 0): Promise<any> {
        try {
            if (!this.validExcelFile(file)) {
                throw new InternalError('File uploaded is not valid');
            }
            const url = await this.uploadFile(file, `${tab}`);
            if (url) {
                const name = file.originalname;
                const { size } = file;
                const inputFile = this.inputFileRepository.create(
                    {
                        name,
                        tab,
                        size,
                        url,
                        row_count,
                        query,
                        status: 'created',
                        user_id: Number(userId),
                    },
                );
                return await inputFile;
            }
            throw new InternalError('Upload file failed');
        } catch (error: any) {
            handleDatabaseError(error);
            throw new InternalError(error.message);
        }
    }

    public async listInputFile(filter: InputFileFilter): Promise<any> {
        try {
            const { results: inputFiles, total } = await this
                .inputFileRepository.getListInputFile(filter);
            const totalPage = Math.ceil(total / filter.limit);
            return {
                inputFiles,
                pagination: {
                    total,
                    totalPage,
                    currentPage: filter.page,
                    limit: filter.limit,
                },
            };
        } catch (error: any) {
            handleDatabaseError(error);
            throw new InternalError(error.message);
        }
    }

    public async getInputFileInQueue(): Promise<any> {
        try {
            return await this.inputFileRepository.getInputFilesInQueue();
        } catch (error: any) {
            handleDatabaseError(error);
            throw new InternalError(error.message);
        }
    }

    async handleUpdateCreate(inputFile) {
        const tab = inputFile.tab;
        const fileId = inputFile.id;

        const ModelQ: any = getTabModel(tab);
        await ModelQ.query().del().where("input_file_id", fileId)
        return this.inputFileRepository.updateById(fileId, { index_processed: 0 });
    }

    async countSuccess(inputFile) {
        const tab = inputFile.tab;
        const fileId = inputFile.id;

        const ModelQ: any = getTabModel(tab);

        let counters;
        if (tab.includes("explore")) {
            counters = await ModelQ.query()
                .countDistinct('keyword as count')
                .where('input_file_id', fileId)
                .andWhere('status', 1)

            return counters[0].count
        } else {
            counters = await ModelQ.query()
                .where('input_file_id', fileId)
                .andWhere('status', 1)
                .count();
        }
        console.log("counters", counters)
        return counters[0].count <= inputFile.row_count ? counters[0].count : inputFile.row_count;
    }

    async handleUpdateFinished(inputFile) {
        const fileId = inputFile.id;
        const count = await this.countSuccess(inputFile);
        console.log("count: ", count)
        return this.inputFileRepository.updateById(fileId, {
            total_success: parseInt(count, 10),
            end_time: new Date()
        });
    }

    public async updateProgressByStatusHandle(inputFile) {
        const status = inputFile?.status;
        if (status === "created") {
            return await this.handleUpdateCreate(inputFile);
        }
        if (status === "finished" || status === "stop") {
            return await this.handleUpdateFinished(inputFile);
        }
        return inputFile;
    }

    public async updateProgress(id: number, body:
        {
            status?: string,
            progress?: number,
            result_url?: string,
            start_time?: string,
            index_processed?: number,
            total_success?: number
        }): Promise<any> {
        try {
            let inputFile: any = this.inputFileRepository.findById(id);
            if (inputFile) {
                inputFile = await this.inputFileRepository.updateById(id, body);
                return await this.updateProgressByStatusHandle(inputFile);
            } else throw new InternalError('Cannot find input file');
        } catch (error: any) {
            handleDatabaseError(error);
            throw new InternalError(error.message);
        }
    }

    public async getInputFile(id: number): Promise<any> {
        try {
            const inputFile = await this.inputFileRepository.findById(id);
            return inputFile;
        } catch (error: any) {
            handleDatabaseError(error);
            throw new InternalError(error.message);
        }
    }
}
