import { IInputFileRepository } from '@n-repositories/interfaces/v1';
import Repository, { BaseTransaction } from '@n-repositories/Repository';
import InputFile from '@n-models/InputFile';
import { injectable } from 'inversify';
import { InputFileFilter } from '@n-types/filters';
import { AnyQueryBuilder, OrderByDirection, Page } from 'objection';

@injectable()
export class InputFileRepository
  extends Repository<typeof InputFile>
  implements IInputFileRepository {
  initializeModel(): typeof InputFile {
    return InputFile;
  }

  transacting(trx: BaseTransaction): IInputFileRepository {
    const repositoryTransaction = new InputFileRepository(trx.transaction);
    return repositoryTransaction;
  }

  static queryFilter(
    query: AnyQueryBuilder,
    filter: InputFileFilter,
    sumOnly = false,
  ): AnyQueryBuilder {
    if (filter?.userId) {
      query.where('user_id', filter?.userId);
    }

    if (filter?.search) {
      const search = filter.search.replace(/#/g, '').trim().toLowerCase();
      query
        .where('input_files.name', 'like', `%${search}%`)
        .orWhere('input_files.tab', 'like', `%${search}%`)
        .orWhere('input_files.query', 'like', `%${search}%`);
    }

    if (filter?.from) {
      query.where('input_files.created_at', '>=', filter.from);
    }

    if (filter?.to) {
      query.where('input_files.created_at', '<=', filter.to);
    }

    if (filter?.tab) {
      query.where('input_files.tab', filter.tab);
    }

    if (sumOnly) return query;

    if (filter?.sortBy && filter?.orderBy) {
      query.orderBy(filter.orderBy, filter.sortBy as OrderByDirection);
    } else {
      query.orderBy('input_files.created_at', 'asc');
    }

    return query;
  }

  async getInputFilesInQueue(): Promise<any> {
    const inputFiles = await this.model.query().whereIn('input_files.status', ['created', 'queue', 'inqueue', 'continue', 'processing', 'recheck']);
    return inputFiles;
  }

  async getListInputFile(
    filter: any,
  ): Promise<Page<typeof InputFile['prototype']>> {
    const { page = 1, limit = 10 } = filter;
    const listInputFile = await InputFileRepository.queryFilter(
      this.model.query().orderBy('created_at', 'desc'),
      filter,
    ).page(page - 1, limit < 100 ? limit : 100);
    return listInputFile;
  }
}
