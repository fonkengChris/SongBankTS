export default interface JWT_User {
  token_type: string;
  exp: number;
  jti: string;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
}
