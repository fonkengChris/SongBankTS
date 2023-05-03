import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Customer from "../entities/Customer";
import useCustomer from "../hooks/useCustomer";
import useUserProfile from "../hooks/useUserProfile";

const UserProfile = () => {
  const user = useUserProfile();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    useCustomer(user.user_id).then((cus) => {
      setCustomer(cus[0]);
    });
  }, []);

  // if (customerRes === null) throw console.error();

  // const customer = customerRes[0];
  // console.log(customer);
  return (
    <div>
      <Heading>UserProfile</Heading>
      <p>
        {user.first_name} {user.last_name}
      </p>
      <p>{user.email}</p>
      <p>{user.user_id}</p>
      <p>{customer?.country}</p>
      <p>{customer?.birth_date}</p>
      <p>{customer?.membership}</p>
      <p>{customer?.phone}</p>
    </div>
  );
};

export default UserProfile;
