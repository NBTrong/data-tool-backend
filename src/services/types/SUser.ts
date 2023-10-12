export type SUser = {
  id: number;
  email: string;
  username: string;
  password?: string;
  phone?: string;
  address?: string;
  bio?: string;
  color?: string;
  avatar_url?: string;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export type SUserRequest = {
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

export type SUserResponse = {
  id: number;
  email: string;
  username: string;
  phone?: string;
  address?: string;
  bio?: string;
  color?: string;
};

export type SUserList = {
  users: SUser[];
  pagination: {
    total: number;
    currentPage: number;
    totalPage: number;
    limit: number;
  };
};
