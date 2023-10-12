import { Page } from 'objection';
import User from '@n-models/User';
import { UserListFilter } from '@n-types/filters';
import IRepository from '../IRepository';

export interface IUserRepository extends IRepository<typeof User> {
  findByEmail(email: string): Promise<typeof User['prototype']>;
  getListUsers(filter: UserListFilter): Promise<Page<typeof User['prototype']>>;
  getArchivedUsers(): Promise<typeof User['prototype'][]>;
  checkUserExist(id: number): Promise<boolean>;
  checkUsernameOrEmail(id: number, username: string, email: string): Promise<boolean>;
}
