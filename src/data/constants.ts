//api endpoints

export const REGISTER_ENDPOINT = "/user/users/";
export const CUSTOMERS_ENDPOINT = "/library/customers/";
export const CATEGORIES_ENDPOINT = "/library/categories/";
export const SONGS_ENDPOINT = "/library/songs/";
export const NOTATIONS_ENDPOINT = "/library/notations/";
export const LANGUAGES_ENDPOINT = "/library/languages/";
export const LOGIN_ENDPOINT = "/user/login/";
export const REFRESH_TOKEN_ENDPOINT = "/auth/jwt/refresh/";
export const ACCESS_TOKEN_ENDPOINT = "/%5Eapi-token-auth/";
export const CURRENT_USER_ENDPOINT = "/auth/users/me/";
export const CHANGE_PASSWORD_ENDPOINT = "/user/change_password/";

//validation constants
export const NAME_REGEX = /^[A-z][A-z0-9-_]{4,50}$/;
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,50}$/;
