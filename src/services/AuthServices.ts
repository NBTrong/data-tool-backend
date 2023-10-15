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

    return {
      user,
    };
  }
}
