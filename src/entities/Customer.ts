import User from "./User";

export default interface Customer {
  _id?: string;
  user: User;
  country: string;
  birth_date: string;
  phone_number: string;
}
