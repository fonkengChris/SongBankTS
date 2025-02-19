import {
  Box,
  Container,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Link,
  VStack,
  Divider,
} from "@chakra-ui/react";

const CopyrightPage = () => {
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={4}>
            Copyright Policy
          </Heading>
          <Text color="gray.600" mb={2}>
            Last Updated: March 19, 2024
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            1. Introduction
          </Heading>
          <Text mb={4}>
            Welcome to SheetMusicLibrary ("we," "our," or "us"). This Copyright
            Policy outlines the rules governing the use, distribution, and
            ownership of content on our website, including sheet music and
            related materials.
          </Text>
          <Text mb={4}>
            By using our services, you agree to comply with this policy.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            2. Ownership of Content
          </Heading>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              All original content created and uploaded by users remains the
              intellectual property of its respective owners.
            </ListItem>
            <ListItem>
              Any copyrighted material used or uploaded must comply with
              applicable copyright laws, including but not limited to:
              <UnorderedList mt={2} spacing={1}>
                <ListItem>
                  <strong>
                    Berne Convention for the Protection of Literary and Artistic
                    Works
                  </strong>{" "}
                  (International)
                </ListItem>
                <ListItem>
                  <strong>U.S. Copyright Act</strong> (United States)
                </ListItem>
                <ListItem>
                  <strong>EU Copyright Directive (DSM Directive)</strong>{" "}
                  (European Union)
                </ListItem>
                <ListItem>
                  <strong>Nigeria Copyright Act</strong> (Nigeria)
                </ListItem>
                <ListItem>
                  <strong>Ghana Copyright Act</strong> (Ghana)
                </ListItem>
                <ListItem>
                  <strong>Cameroon Copyright Law</strong> (Cameroon)
                </ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            3. Acceptable Use of Content
          </Heading>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              Users may only upload, share, or distribute sheet music and other
              materials if:
              <UnorderedList mt={2} spacing={1}>
                <ListItem>
                  They own the copyright or have the legal right to distribute
                  the content.
                </ListItem>
                <ListItem>
                  The content is in the <strong>public domain</strong> or falls
                  under <strong>fair use/fair dealing</strong> exceptions.
                </ListItem>
                <ListItem>
                  They have obtained proper licensing or permissions from the
                  copyright holder.
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              Unauthorized reproduction, redistribution, or commercial
              exploitation of copyrighted material is strictly prohibited.
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            4. Copyright Infringement & DMCA Compliance
          </Heading>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              We respect intellectual property rights and comply with the{" "}
              <strong>Digital Millennium Copyright Act (DMCA)</strong>.
            </ListItem>
            <ListItem>
              If you believe that your copyrighted work has been used or
              uploaded without permission, you may submit a
              <strong> Copyright Infringement Notice</strong> by providing the
              following details:
              <UnorderedList mt={2} spacing={1}>
                <ListItem>Your full name and contact information.</ListItem>
                <ListItem>
                  A detailed description of the copyrighted work.
                </ListItem>
                <ListItem>
                  The URL or location of the infringing content.
                </ListItem>
                <ListItem>
                  A statement affirming that you have a good-faith belief that
                  the use of the content is unauthorized.
                </ListItem>
                <ListItem>Your signature (physical or electronic).</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              Please send copyright complaints to{" "}
              <Link href="mailto:librarysheetmusic@gmail.com" color="blue.500">
                librarysheetmusic@gmail.com
              </Link>
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            5. Removal of Infringing Content
          </Heading>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              Upon receiving a valid copyright complaint, we will:
              <UnorderedList mt={2} spacing={1}>
                <ListItem>Review and investigate the claim.</ListItem>
                <ListItem>
                  Remove or restrict access to the infringing content if
                  necessary.
                </ListItem>
                <ListItem>
                  Notify the user responsible for the content.
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              Users who repeatedly violate copyright policies may have their
              accounts suspended or terminated.
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            6. Licensing & Permissions
          </Heading>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              If you wish to use any content from our website beyond personal or
              educational purposes, you must obtain explicit permission from the
              respective copyright owner.
            </ListItem>
            <ListItem>
              For licensing inquiries, please contact us at{" "}
              <Link href="mailto:librarysheetmusic@gmail.com" color="blue.500">
                librarysheetmusic@gmail.com
              </Link>
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            7. Policy Updates
          </Heading>
          <Text>
            We reserve the right to update this policy at any time. Changes will
            be posted on this page with the latest revision date.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            8. Contact Information
          </Heading>
          <Text>
            For any questions or copyright-related concerns, please contact us
            at:{" "}
            <Link href="mailto:librarysheetmusic@gmail.com" color="blue.500">
              librarysheetmusic@gmail.com
            </Link>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default CopyrightPage;
