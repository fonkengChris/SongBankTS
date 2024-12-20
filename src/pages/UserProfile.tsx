import {
  Button,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useCustomer from "../hooks/useCustomer";
import jwtDecode from "jwt-decode";

const UserProfile = () => {
  // Decode token and extract user ID
  const userToken = localStorage.getItem("token");

  // Define the shape of the decoded token
  interface DecodedToken {
    _id: string;
    name?: string;
    email?: string;
  }

  // Initialize user attributes
  let userId: string | null = null;
  let userName: string | null = null;
  let userEmail: string | null = null;

  if (userToken) {
    try {
      const decodedToken: DecodedToken = jwtDecode(userToken);
      userId = decodedToken._id;
      userName = decodedToken.name || null;
      userEmail = decodedToken.email || null;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  // Fetch the customer using the useCustomer hook
  const { data: customer, error, isLoading } = useCustomer(userId!);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching customer data: {error.message}</p>;

  return (
    <div>
      <Heading>UserProfile</Heading>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Profile details for {userName}</TableCaption>
          <Tbody>
            <Tr>
              <Th>Full Name:</Th>
              <Td>{userName}</Td>
            </Tr>
            <Tr>
              <Th>Email Address:</Th>
              <Td>{userEmail}</Td>
            </Tr>
            <Tr>
              <Th>Nationality:</Th>
              <Td>{customer?.country || "N/A"}</Td>
            </Tr>
            <Tr>
              <Th>Date of Birth:</Th>
              <Td>{customer?.birth_date || "N/A"}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Link to="/edit_profile">
        <Button>Edit Profile</Button>
      </Link>
    </div>
  );
};

export default UserProfile;
