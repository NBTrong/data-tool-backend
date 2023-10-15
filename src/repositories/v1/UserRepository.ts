import { IUserRepository } from '@n-repositories/interfaces/v1';
import Repository, { BaseTransaction } from '@n-repositories/Repository';
import User from '@n-models/User';
import { injectable } from 'inversify';
import { UserListFilter } from '@n-types/filters';
import { AnyQueryBuilder, Page, OrderByDirection } from 'objection';

const DEFAULT_LIMIT = 10;

@injectable()
export class UserRepository
  extends Repository<typeof User>
  implements IUserRepository {
  initializeModel(): typeof User {
    return User;
  }

  transacting(trx: BaseTransaction): IUserRepository {
    const repositoryTransaction = new UserRepository(trx.transaction);
    return repositoryTransaction;
  }

  static queryFilter(
    query: AnyQueryBuilder,
    filter: UserListFilter,
  ): AnyQueryBuilder {
    query
      .select('users.*')
      .distinctOn('users.id');
    if (filter?.archived !== undefined) {
      query.where('users.archived', filter.archived);
    }
    if (filter?.search) {
      query.where((builder) => {
        builder
          .where('users.username', 'ilike', `%${filter.search}%`)
          .orWhere('users.email', 'ilike', `%${filter.search}%`);
      });
    }
    return query;
  }

  async getListUsers(
    filter: UserListFilter,
  ): Promise<Page<typeof User['prototype']>> {
    const sortBy = 'DESC' as OrderByDirection;
    const orderBy = 'id';
    const { page = 1, limit = DEFAULT_LIMIT } = filter;
    const listUsers = await UserRepository.queryFilter(
      this.model.query(),
      filter,
    )
      .orderBy(orderBy, sortBy)
      .page(page - 1, limit);
    return listUsers;
  }

  async getArchivedUsers(): Promise<typeof User['prototype'][]> {
    const archivedUsers = await this.model
      .query()
      .select(
        'users.id',
        'users.avatar_url',
        'users.username',
        'users.archived_at',
        'archiver.username as archiver_username',
      )
      .joinRaw(
        'LEFT JOIN "users" as "archiver" ON "archiver"."id" = "users"."archiver_id"',
      )
      .where('users.archived', true)
      .orderBy('users.id', 'DESC');
    return archivedUsers;
  }

  async findByEmail(email: string): Promise<typeof User['prototype']> {
    const user = await this.model
      .query()
      .select('users.*')
      .where('users.email', email)
      .first();
    return user;
  }

  async findById(id: number): Promise<typeof User['prototype']> {
    const user = await this.model
      .query()
      .select('users.*')
      .where('users.id', id)
      .first();
    return user;
  }

  async checkUserExist(id: number): Promise<boolean> {
    const count = await this.model
      .query()
      .where('id', id)
      .countDistinct({ count: 'id' });
    if (count.length > 0) {
      return true;
    }
    return false;
  }

  async checkUsernameOrEmail(
    id: number,
    username: string,
    email: string,
  ): Promise<boolean> {
    const count: any = await this.model
      .query()
      .where((builder) => {
        builder.where('username', username).orWhere('email', email);
      })
      .whereNot('id', id)
      .countDistinct({ count: 'id' });
    return Number(count[0].count) === 0;
  }
}
