import { IUserTokenRepository } from '@n-repositories/interfaces/v1';
import Repository, { BaseTransaction } from '@n-repositories/Repository';
import UserToken from '@n-models/UserToken';
import { injectable } from 'inversify';

@injectable()
export class UserTokenRepository
  extends Repository<typeof UserToken>
  implements IUserTokenRepository {
  initializeModel(): typeof UserToken {
    return UserToken;
  }

  transacting(trx: BaseTransaction): IUserTokenRepository {
    const repositoryTransaction = new UserTokenRepository(trx.transaction);
    return repositoryTransaction;
  }

  async findByUserId(id: number): Promise<typeof UserToken['prototype']> {
    const tokens = await this.model
      .query()
      .select('user_tokens.*')
      .join('users', 'users.id', 'user_tokens.user_id')
      .where('user_tokens.user_id', id)
      .first();
    return tokens;
  }

  async findByRefreshToken(
    refreshToken: string,
  ): Promise<typeof UserToken['prototype']> {
    const token = await this.model
      .query()
      .select('user_tokens.*')
      .where('user_tokens.token', refreshToken)
      .first();
    return token;
  }
}
