export type SLogger = {
  id: number;
  user_id?: number;
  endpoint: string;
  method: string;
  response_status: number;
  latency: string;
  time: string;
  error_message: string;
};

export type LoggerSummary = { success_api_calls: string, total_api_calls: string };

export type LoggerByDay = { date: string, total_api_calls: string, total_success_api_calls: string };

export type SLoggerList = {
  loggers: SLogger[];
  pagination: {
    total: number;
    currentPage: number;
    totalPage: number;
    limit: number;
  };
};
