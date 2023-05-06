import {
  Button,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Tr
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  return (
    <div>
      <Heading>UserProfile</Heading>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Profile details for {user.first_name}</TableCaption>
          <Tbody>
            <Tr>
              <Th>Full Name:</Th>
              <Td>
                {user.first_name} {user.last_name}
              </Td>
            </Tr>
            <Tr>
              <Th>Email Address:</Th>
              <Td>{user.email}</Td>
            </Tr>
            <Tr>
              <Th>Nationality:</Th>
              <Td>{customer?.country}</Td>
            </Tr>
            <Tr>
              <Th>Date of Birth: </Th>
              <Td>{customer?.birth_date}</Td>
            </Tr>
            <Tr>
              <Th>Phone Number:</Th>
              <Td>{customer?.phone}</Td>
            </Tr>
            <Tr>
              <Th>Membership status:</Th>
              <Td>{customer?.membership}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Link to="/edit_profile"><Button>Edit Profile</Button></Link>
    </div>
  );
};

export default UserProfile;
