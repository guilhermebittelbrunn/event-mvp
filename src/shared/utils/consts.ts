export const SALT_ROUNDS = 2;

export const ACCESS_TOKEN_EXPIRE_DAYS = 7;
export const REFRESH_TOKEN_EXPIRE_DAYS = 30;

/** Refers to the access_token (ACCESS_TOKEN_EXPIRE_DAYS in milliseconds) */
export const EXPIRE_TOKEN_TIME = ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000;

export const MAX_EVENT_DAYS_RANGE = 7;
