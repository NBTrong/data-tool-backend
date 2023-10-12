export const INVALID_REQUEST_ERROR = 'Invalid Request';
export const INVALID_ACCESS_TOKEN = 'Invalid access token';
export const INVALID_REFRESH_TOKEN = 'Invalid refresh token';
export const UNKNOWN_ERROR_TRY_AGAIN = 'Unknown error occured. Please try again.';
export const INVALID_CREDENTIAL_ERROR = 'Invalid credential';
export const ADD_NETWORK_MESSAGE = 'Add network';
export const NETWORK_LIST = ['SOL', 'BSC', 'ETH'];
export const PREFIX_REDIS = 'api-express';
export const REDIS_OPTIONS = {
  attempts: 3,
  backoff: 3000,
};
export const ALL_THRESHOLD = 100;
export const YEAR_THRESHOLD = 180;
export const MONTH_THRESHOLD = 100;
export const WEEK_THRESHOLD = 100;
export const RANGE_ORDER = {
  all: 6,
  '1y': 5,
  '1m': 4,
  '1w': 3,
  '1d': 2,
  '1h': 1,
};