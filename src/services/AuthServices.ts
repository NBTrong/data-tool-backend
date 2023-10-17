import { SLoginResult, SUser } from '@n-services/types';
import { inject, injectable } from 'inversify';
import { REPOSITORIES } from '@n-types/injections/repositories';
import { IAuthServices } from '@n-services/interface';
import {
  IUserRepository,
  IUserTokenRepository,
} from '@n-repositories/interfaces/v1';
import bcrypt from 'bcrypt';
import { generateTokens } from '@n-utils/generateTokens';
import { sendEmail } from '@n-utils/sendEmail';
import jwt from 'jsonwebtoken';
import { NotFoundError } from '@n-errors/HttpError';

@injectable()
export class AuthServices implements IAuthServices {
  @inject(REPOSITORIES.UserRepository)
  private userRepository: IUserRepository;

  @inject(REPOSITORIES.UserTokenRepository)
  private userTokenRepository: IUserTokenRepository;

  public async login(email: string, password: string): Promise<SLoginResult> {
    const user: SUser = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid email or password');
    }
    const tokens = await generateTokens(user.id);
    const userToken = await this.userTokenRepository.findByUserId(user.id);
    if (!userToken) {
      await this.userTokenRepository.create({
        user_id: Number(user.id),
        token: tokens.refreshToken,
      });
    } else {
      tokens.refreshToken = userToken.token;
    }
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  public async logout(id: number): Promise<void> {
    const userToken = await this.userTokenRepository.findByUserId(id);
    if (!userToken) {
      throw new Error('Unauthorized!');
    }
    await this.userTokenRepository.deleteById(userToken.id);
  }

  public async refresh(refreshToken: string): Promise<SLoginResult> {
    const userToken = await this.userTokenRepository.findByRefreshToken(refreshToken);
    if (!userToken) {
      throw new Error('Unauthorized!');
    }
    const user: SUser = await this.userRepository.findById(userToken.user_id);
    if (!user) {
      throw new NotFoundError('User not found!');
    }
    const tokens = await generateTokens(user.id);
    tokens.refreshToken = userToken.token;
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
