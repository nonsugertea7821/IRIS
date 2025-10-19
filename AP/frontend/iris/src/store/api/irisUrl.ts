/** 認証URL */
export const IrisAuthUrl = {
  IRIS_API_GET_AUTH_GET_USER_ID: '/api/auth/get-userId',
  IRIS_API_GET_AUTH_CHALLENGE: '/api/auth/get-challenge',
  IRIS_API_POST_AUTH_LOGIN: '/api/auth/login',
  IRIS_API_POST_AUTH_REFRESH: '/api/auth/refresh',
} as const;

/** 通常URL */
export const IrisUrl = {
  ...IrisAuthUrl,
  IRIS_API_POST_LOGOUT: '/api/auth/logout',
  IRIS_API_POST_SQAS_PARSE_STOCK_SCREENER_CSV: '/api/sqas/parse-stock-screener-csv',
  IRIS_API_PUT_SQAS_PUT_STOCK_INFO: '/api/sqas/put-stock-info',
} as const;
