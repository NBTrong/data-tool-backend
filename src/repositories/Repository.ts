import { injectable, unmanaged } from 'inversify';
import { Knex } from 'knex';
import { Model } from 'objection';
import IRepository from './interfaces/IRepository';

export class BaseTransaction {
  constructor(readonly transaction: Knex.Transaction<any, any[]>) {}

  rollback() {
    return this.transaction.rollback();
  }

  commit() {
    return this.transaction.commit();
  }
}

@injectable()
export default abstract class Repository<T extends typeof Model>
implements IRepository<T> {
  private _model: T;

  constructor(@unmanaged() protected readonly knex: Knex) {
    this.makeModel();
  }

  get model(): T {
    if (this.knex) {
      return this._model.bindKnex(this.knex);
    }
    return this._model;
  }

  abstract initializeModel(): T;

  async transaction<M>(callback: (trx: BaseTransaction) => Promise<M>) {
    return this.model.transaction(async (trx) => callback(new BaseTransaction(trx)));
  }

  abstract transacting(trx: BaseTransaction): IRepository<T>;

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  static queryFilter(query: any, filter: any): any {
    return query;
  }

  public makeModel() {
    this._model = this.initializeModel();
    if (!this._model) {
      throw new Error('Not found model. Please set model by setModel method');
    }
  }

  async create(data: any): Promise<T['prototype']> {
    return this.model.query().insert(data);
  }

  async deleteById(id: number | string): Promise<boolean> {
    const number = await this.model.query().deleteById(id);
    return number > 0;
  }

  async findById(id: number | string): Promise<T['prototype']> {
    return this.model.query().findById(id);
  }

  async updateById(id: number | string, data: any): Promise<T['prototype']> {
    return this.model.query().updateAndFetchById(id, data);
  }

  async findOne(data: any): Promise<T['prototype']> {
    return this.model.query().findOne(data);
  }

  async deleteByIds(ids: number[] | string[]): Promise<boolean> {
    const number = await this.model.query().delete().whereIn('id', ids);
    return number > 0;
  }
}
