export type CUserCreateUpdate = {
  email: string;
  username: string;
  password?: string;
  phone?: string;
  address?: string;
  bio?: string;
  color?: string;
  avatar?: string;
  tier?: string | null;
  category?: string | null;
};
