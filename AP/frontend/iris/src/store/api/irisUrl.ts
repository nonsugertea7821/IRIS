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
} as const;
