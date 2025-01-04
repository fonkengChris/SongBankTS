//api endpoints

export const MEDIA_BASE_URL = "http://localhost:3000";
export const USERS_ENDPOINT = "/api/users/";
export const CUSTOMERS_ENDPOINT = "/api/customers/";
export const CATEGORIES_ENDPOINT = "/api/categories/";
export const SONGS_ENDPOINT = "/api/songs/";
export const NOTATIONS_ENDPOINT = "/api/notations/";
export const LANGUAGES_ENDPOINT = "/api/languages/";
export const LOGIN_ENDPOINT = "/api/auth/";
export const MEDIA_FILES_ENDPOINT = "/api/media_files/";
export const AUDIOS_ENDPOINT = "/api/audios/";
export const IMAGES_ENDPOINT = "/api/images/";
export const REFRESH_TOKEN_ENDPOINT = "/auth/jwt/refresh/";
export const ACCESS_TOKEN_ENDPOINT = "/%5Eapi-token-auth/";
export const CURRENT_USER_ENDPOINT = "/api/users/me/";
export const CHANGE_PASSWORD_ENDPOINT = "/api/change_password/";

//validation constants

export const NAME_REGEX = /^[A-z][A-z0-9-_ ]{3,50}$/;
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const PHONE_NUMBER_REGEX =
  /^\\+[1-9]{1}[0-9]{0,2}-[2-9]{1}[0-9]{2}-[2-9]{1}[0-9]{2}-[0-9]{4}$/;
export const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,50}$/;
