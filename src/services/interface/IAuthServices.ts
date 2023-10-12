import { SLoginResult } from '@n-services/types';

export interface IAuthServices {
  login(email: string, password: string): Promise<SLoginResult>;
  logout(id: number): Promise<void>;
  refresh(refreshToken: string): Promise<SLoginResult>;
  forgotPassword(email: string): Promise<void>;
  updatePassword(id: number, password: string): Promise<void>;
}
