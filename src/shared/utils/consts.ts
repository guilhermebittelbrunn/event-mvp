export const SALT_ROUNDS = 2;

export const ACCESS_TOKEN_EXPIRE_DAYS = 1;
export const REFRESH_TOKEN_EXPIRE_DAYS = 14;

/** Refers to the access_token (1 day in milliseconds) */
export const EXPIRE_TOKEN_TIME = ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000;
