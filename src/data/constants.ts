//api endpoints

export const MEDIA_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";
export const USERS_ENDPOINT = "/api/users";
export const CUSTOMERS_ENDPOINT = "/api/customers";
export const CATEGORIES_ENDPOINT = "/api/categories";
export const SONGS_ENDPOINT = "/api/songs";
export const NOTATIONS_ENDPOINT = "/api/notations";
export const LANGUAGES_ENDPOINT = "/api/languages";
export const LOGIN_ENDPOINT = "/api/auth";
export const MEDIA_FILES_ENDPOINT = "/api/media_files";
export const AUDIOS_ENDPOINT = "/api/audios";
export const IMAGES_ENDPOINT = "/api/images";
export const CURRENT_USER_ENDPOINT = "/api/users/me";
export const CHANGE_PASSWORD_ENDPOINT = "/api/auth/change_password";
export const RESET_PASSWORD_ENDPOINT =
  "/api/auth/password-reset/reset-password";
export const REQUEST_RESET_ENDPOINT = "/api/auth/password-reset/request-reset";
export const CONTACT_ENDPOINT = "/api/contact";

//validation constants

export const NAME_REGEX = /^[A-z][A-z\s_-]{2,74}$/;
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const PHONE_NUMBER_REGEX = /^(\+|00)[1-9][0-9]{1,14}$/;
export const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%?&*^]).{8,50}$/;

// Replace direct values with environment variables
export const GOOGLE_OAUTH_CLIENT_ID = import.meta.env
  .VITE_GOOGLE_OAUTH_CLIENT_ID;
export const GOOGLE_OAUTH_CLIENT_SECRET = import.meta.env
  .VITE_GOOGLE_OAUTH_CLIENT_SECRET;

// Note: In Vite, environment variables must be prefixed with VITE_
