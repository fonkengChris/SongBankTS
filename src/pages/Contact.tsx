import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Th,
  Tr,
  Td,
  Thead,
} from "@chakra-ui/react";

const Contact = () => {
  return (
    <div>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Role:</Th>
              <Td>System Administrator</Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Th>Full Name:</Th>
              <Td>Christian Fonkeng</Td>
            </Tr>

            <Tr>
              <Th>Email Address:</Th>
              <Td>echristianfonkeng@gmail.com</Td>
            </Tr>

            <Tr>
              <Th>Phone Number:</Th>
              <Td>+44 7735086910</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <br /> <br />
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Role:</Th>
              <Td>Music Consultant</Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Th>Full Name:</Th>
              <Td>Aloysius Tindong</Td>
            </Tr>

            <Tr>
              <Th>Email Address:</Th>
              <Td>alofonkeng@gmail.com</Td>
            </Tr>

            <Tr>
              <Th>Phone Number:</Th>
              <Td>+237 677350869</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <br /> <br />
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Role:</Th>
              <Td>Song Resource Coordinator</Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Th>Full Name:</Th>
              <Td>Wanji Martial</Td>
            </Tr>

            <Tr>
              <Th>Email Address:</Th>
              <Td>wanjimartial@gmail.com</Td>
            </Tr>

            <Tr>
              <Th>Phone Number:</Th>
              <Td>+237 672345654</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Contact;
