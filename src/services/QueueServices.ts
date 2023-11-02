import {IInputFileServices, IQueueServices} from '@n-services/interface';
import {uploadLocalFile} from '@n-utils/fileUpload';
import {
    createExcelFileByColumn,
    getTabModel,
} from '@n-utils/modelExport';
import {inject, injectable} from 'inversify';
import {SERVICES} from "@n-types/injections/services";
import sleep from "../utils/sleep";
import {readExcelFile, timestampToDate, downloadExcelFile, findDifferenceArray} from "../utils/helper";
import InputFile from '@n-models/InputFile';

@injectable()
export class QueueServices implements IQueueServices {
    @inject(SERVICES.InputFileServices)
    private readonly inputFileService: IInputFileServices;

    private matchData(rows, allowedFields) {
        const filteredArray = rows.map((inputData) => Object.keys(inputData)
            .filter((key) => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = inputData[key];
                return obj;
            }, {}));

        return filteredArray;
    }

    parseRowsData(rows,input_file_id = 0){
        if (input_file_id){
            return rows.map((row)=>({...row,input_file_id}))
        }
        return rows
    }

    public async importRows(rows: any, tab: string,input_file_id?: number): Promise<any> {
        const ModelQ: any = getTabModel(tab);

        const parseRows = this.parseRowsData(rows,input_file_id);
        console.log(parseRows,parseRows)
        const body = this.matchData(parseRows, ModelQ.fillAbles);
        console.log(body)
        const data = await ModelQ.query().insert(body);

        return data;
    }

    public async exportExcel(fileId: any, tab: string, batchSize=100000): Promise<any> {
        try {
            const inputFile = await this.inputFileService.getInputFile(fileId);
            const {status: oldStatus, name: fileName} = inputFile;

            const ModelQ: any = getTabModel(tab);

            const counts = await ModelQ.query().where('input_file_id', fileId).count();

            const rowsLength = counts[0]?.count;

            const handleNoPromise = async () => {
                const listFileUrls = await this.exportModelToExcelFiles(rowsLength,fileId, tab, fileName.replace(".xlsx", ""),batchSize);

                await this.updateFileData(fileId, oldStatus, JSON.stringify(listFileUrls));
            }

            handleNoPromise();

            return `Tab: ${tab}, file: ${fileId}, exporting total: ${rowsLength},batchSize: ${batchSize}`;
        } catch (e) {
            console.log("err: ",e)
            throw new TypeError('Could not upload to gcs');
        }
    }

    private async updateFileData(id, oldStatus, url) {
        const inputFile = await this.inputFileService.getInputFile(id);
        const {progress} = inputFile;

        let status;
        if (progress === 100) {
            status = "finished";
        } else status = oldStatus;

        return await this.inputFileService.updateProgress(id, {status: status, result_url: url})
    }

    async exportModelToExcelFiles(rows,fileId, tab, fileName,batchSize) {
        switch (tab) {
            case 'comments-extract-data':
                return this.processFileBatches(rows, fileId,tab, fileName,batchSize);

            default:
                return this.processFileBatches(rows, fileId, tab, fileName,batchSize);
        }
    }

    getCommentData(post,comment){
        return {
            post_url: post.post_url,
            commenter: comment.user.unique_id,
            text: comment.text,
            commented_at: timestampToDate(comment?.create_time)
        }
    }

    getCommentBatchs(batch){
        const MAX_ROWS = 150000;

        let overflow = true;
        const rows = [];
        batch.forEach((item)=>{
            const comments = JSON.parse(item.comments);
            if (comments && comments.length){
                comments.forEach(comment=>{
                    const commentData = this.getCommentData(item,comment);
                    rows.push(commentData);
                    const replies = comment.replies;
                    if (replies && replies.length){
                        replies?.forEach(reply=>{
                            const commentData = this.getCommentData(item,reply);
                            rows.push(commentData);
                        })
                    }
                })
            }
        });
        console.log("rows.length",rows.length)
        if (rows.length > MAX_ROWS){
            let start = 0;
            let results = [];
            while (overflow) {
                const batchRow = rows.slice(start,start + MAX_ROWS);
                if (batchRow && batchRow?.length){
                    results.push(batchRow);
                    start += MAX_ROWS;
                } else {
                    console.log("else")
                    overflow = false
                }
                if (start >= rows.length){
                    console.log(">=")
                    overflow = false;
                }
            }
            console.log("results",results.length)
            return results;
        }
        return [rows];
    }

    formatBatchToRow(batch,tab){
        let batchs = [batch];
        if (tab==="comments-extract-data"){
            batchs = this.getCommentBatchs(batch)
        }
        return batchs
    }

    async processFileBatches(rowLength, fileId,tab, fileName,batchSize, callback = createExcelFileByColumn) {
        const listFileUrls = [];

        await this.inputFileService.updateProgress(fileId, {status: `exporting`})

        const ModelQ: any = getTabModel(tab);

        // Calculate the number of batches needed
        if (rowLength > batchSize) {
            let numBatches = Math.ceil(rowLength / batchSize);

            // Add data to the worksheet in batches
            if (numBatches) {
                await this.inputFileService.updateProgress(fileId, {status: `exporting`})

                for (let i = 0; i < numBatches; i++) {
                    console.log("Export batches: ", i)
                    await sleep(3000);
                    const startIndex = i * batchSize;
                    const endIndex = Math.min((i + 1) * batchSize, rowLength);
                    const batchResults = await ModelQ.query().where('input_file_id',fileId).offset(startIndex).limit(batchSize);
                    const formatBatchResults = this.formatBatchToRow(batchResults,tab);
                    console.log(`Batches ${i} have ${formatBatchResults.length} batch: `)
                    for (let j = 0; j < formatBatchResults.length; j++){
                        const batchRows = formatBatchResults[j];
                        if (batchRows){
                            const filePath = await callback(batchRows, tab, `${fileName}-[part-${i + 1}](${startIndex}-${endIndex})`)
                            const fileUrl = await uploadLocalFile(filePath);
                            listFileUrls.push(fileUrl);
                            if (j) numBatches += 1;
                        }
                    }
                    await this.inputFileService.updateProgress(fileId, {status: `exporting`, result_url: JSON.stringify(listFileUrls)})
                }
            }
        } else {
            console.log("Export full: ", rowLength)
            const rows = await ModelQ.query().where('input_file_id',fileId);
            const formatBatchResults = this.formatBatchToRow(rows,tab);
            const numBatches = formatBatchResults.length;
            let startIndex = 0;
            for (let j = 0; j < formatBatchResults.length; j++){
                const batchRows = formatBatchResults[j];
                if (batchRows){
                    const part = formatBatchResults.length > 1 ? j+1 : "full";
                    const filePath = await callback(batchRows, tab, `${fileName}-[part-${part}](${startIndex}-${startIndex+batchRows.length})`)
                    const fileUrl = await uploadLocalFile(filePath);
                    listFileUrls.push(fileUrl);
                    startIndex += batchRows.length;
                    await this.inputFileService.updateProgress(fileId, {status: `exporting`, result_url: JSON.stringify(listFileUrls)})
                }
            }
        }

        return listFileUrls;
    }

    async clearRows(tab: string, fileId: number){
        const ModelQ: any = getTabModel(tab);

        return await ModelQ.query().del().where("input_file_id",fileId)
    }

    async getInputFileAllRows(fileId){
        const inputFile = await InputFile.query().findById(fileId);
        if (inputFile){
            const fileUrl = inputFile.url;
            const fileData = await downloadExcelFile(fileUrl);
            return readExcelFile(fileData);
        } else throw new TypeError('Could not find input file id: '+fileId);
    }

    async getRowExists(tab,fileId){
        const ModelQ:any = getTabModel(tab);
        let field = "keyword";
        if (tab.includes("extract-data")){
            field = "post_url";
        }
        const dataExists = await ModelQ.query().select(field).where("input_file_id",fileId).andWhere("status",1);
        return dataExists.map(dataExist=>dataExist[field]);
    }

    async getFailedRows(tab: string, fileId: number): Promise<any>{
        try{
            const inputFile = await InputFile.query().findById(fileId);
            if (inputFile.row_count == inputFile.total_success){
                return [];
            }
            const rowExists = await this.getRowExists(tab,fileId);
            const allRows = await this.getInputFileAllRows(fileId);

            const failedRows = findDifferenceArray(rowExists,allRows);

            return failedRows;
        } catch (e) {
            throw new TypeError('Could not find failed rows');
        }
    }
}
