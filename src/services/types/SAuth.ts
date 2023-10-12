import { SUser } from './SUser';

export type STokens = {
  accessToken: string;
  refreshToken: string;
};

export type SLoginResult = {
  user: SUser;
  accessToken: string;
  refreshToken: string;
};
