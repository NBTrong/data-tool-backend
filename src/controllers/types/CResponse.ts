export type CResponse<T = any> = {
  message: string;
  status: 'success' | 'error';
  data?: T;
};
