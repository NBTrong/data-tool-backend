import { Model } from 'objection';

export default interface IRepository<T extends typeof Model> {
  transaction<M>(callback: (trx: any) => Promise<M>): Promise<M>;
  transacting(trx: any): any;
  create(data: any): Promise<T['prototype']>;
  updateById(id: number | string, data: any): Promise<T['prototype']>;
  findById(id: number | string): Promise<T['prototype']>;
  deleteById(id: number | string): Promise<boolean>;
  findOne(data: any): Promise<T['prototype']>;
  deleteByIds(ids: number[] | string[]): Promise<boolean>;
}
