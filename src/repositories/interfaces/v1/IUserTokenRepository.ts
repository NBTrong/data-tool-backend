import UserToken from '@n-models/UserToken';
import IRepository from '../IRepository';

export interface IUserTokenRepository extends IRepository<typeof UserToken> {
  findByUserId(id: number): Promise<typeof UserToken['prototype']>;
  findByRefreshToken(refreshToken: string): Promise<typeof UserToken['prototype']>;
}
