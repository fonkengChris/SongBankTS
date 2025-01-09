export default interface User {
  _id: string;
  name: string;
  password: string;
  email: string;
  role: "regular" | "admin" | "superAdmin";
}

export interface ResetPasswordUser {
  _id: string;
  name?: string;
  email?: string;
}
