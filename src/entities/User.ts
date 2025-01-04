export default interface User {
  _id: string;
  name: string;
  password: string;
  email: string;
  role: "regular" | "admin" | "superAdmin";
}
