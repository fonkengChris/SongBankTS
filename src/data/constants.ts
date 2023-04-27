export const REGISTER_ENDPOINT = "/auth/users/";
export const CUSTOMERS_ENDPOINT = "/library/customers/";
export const CATEGORIES_ENDPOINT = "/library/categories/";
export const SONGS_ENDPOINT = "/library/songs/";
export const NOTATIONS_ENDPOINT = "/library/notations/";
export const LOGIN_ENDPOINT = "/auth/jwt/create";

export const NAME_REGEX = /^[A-z][A-z0-9-_]{4,50}$/;
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,50}$/;
