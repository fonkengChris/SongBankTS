export default interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  role: "regular" | "admin" | "superAdmin";
  token_type: string;
}
