import React from "react";
import useUserProfile from "../hooks/useUserProfile";
import useCustomer from "../hooks/useCustomers";

const UserProfile = () => {
  const user = useUserProfile();
  const customer = useCustomer(user.user_id);
  console.log(user.user_id);
  return (
    <div>
      <p>UserProfile</p>
      <p>{user.email}</p>
      {/* <p>{customer.phone}</p> */}
    </div>
  );
};

export default UserProfile;
