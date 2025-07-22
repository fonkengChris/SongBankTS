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

const PrivacyPage = () => {
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading 
            as="h1" 
            fontSize={{ base: "clamp(2rem, 8vw, 4rem)", md: "clamp(2.5rem, 6vw, 5rem)", lg: "clamp(3rem, 5vw, 6rem)" }}
            mb={4}
            fontWeight="800"
            letterSpacing="-0.03em"
            lineHeight="1.1"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            Data Privacy Policy
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
            Welcome to SheetMusicLibrary ("we," "our," or "us"). Your privacy is
            important to us. This Privacy Policy explains how we collect, use,
            store, and protect your personal data when you use our website.
          </Text>
          <Text mb={4}>
            By using our services, you consent to the data practices described
            in this policy.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            2. Data We Collect
          </Heading>
          <Text mb={3}>We collect the following types of information:</Text>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              <strong>Personal Information:</strong> Name, email address,
              account credentials, and contact details.
            </ListItem>
            <ListItem>
              <strong>User-Generated Content:</strong> Any songs, sheet music,
              or other materials you upload.
            </ListItem>
            <ListItem>
              <strong>Technical Data:</strong> IP address, browser type, and
              usage statistics.
            </ListItem>
            <ListItem>
              <strong>Payment Information:</strong> If applicable, we process
              payments via third-party payment processors and do not store
              credit card details.
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            3. How We Use Your Data
          </Heading>
          <Text mb={3}>We use your data for the following purposes:</Text>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>To provide and improve our services.</ListItem>
            <ListItem>To manage user accounts and authentication.</ListItem>
            <ListItem>To ensure website security and prevent fraud.</ListItem>
            <ListItem>To comply with legal obligations.</ListItem>
            <ListItem>To send service-related communications.</ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            4. Legal Basis for Processing
          </Heading>
          <Text mb={3}>
            We process personal data under the following legal bases:
          </Text>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              <strong>Consent:</strong> When you sign up and agree to our terms.
            </ListItem>
            <ListItem>
              <strong>Legitimate Interest:</strong> To enhance user experience
              and improve security.
            </ListItem>
            <ListItem>
              <strong>Legal Compliance:</strong> To comply with regulations such
              as GDPR (Europe), NDPA (Nigeria), and DPA (Ghana).
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            5. Data Sharing & Third Parties
          </Heading>
          <Text mb={3}>
            We do not sell your personal data. However, we may share information
            with:
          </Text>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              <strong>Service Providers:</strong> Hosting services, payment
              processors, and analytics providers.
            </ListItem>
            <ListItem>
              <strong>Legal Authorities:</strong> If required by law or to
              protect our rights.
            </ListItem>
            <ListItem>
              <strong>Business Transfers:</strong> In case of mergers,
              acquisitions, or asset sales.
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            6. Data Storage & Security
          </Heading>
          <Text>
            We implement security measures to protect your data, including
            encryption and access controls. However, no method of transmission
            over the internet is 100% secure.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            7. Your Rights
          </Heading>
          <Text mb={3}>
            Depending on your location, you may have the right to:
          </Text>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>Access, correct, or delete your personal data.</ListItem>
            <ListItem>Object to data processing or withdraw consent.</ListItem>
            <ListItem>Request data portability.</ListItem>
            <ListItem>
              Lodge a complaint with a data protection authority (e.g., GDPR
              regulators in the EU, NDPA in Nigeria, DPA in Ghana, or CCPA
              authorities in California, USA).
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            8. Cookies & Tracking Technologies
          </Heading>
          <Text>
            We use cookies to enhance your experience. You can manage cookie
            preferences through your browser settings.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            9. Data Retention
          </Heading>
          <Text>
            We retain personal data only as long as necessary to fulfill the
            purposes outlined in this policy or as required by law.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            10. Updates to This Policy
          </Heading>
          <Text>
            We may update this policy from time to time. Changes will be posted
            on this page with an updated revision date.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            11. Contact Us
          </Heading>
          <Text>
            If you have any questions or requests regarding your privacy rights,
            please contact us at:{" "}
            <Link href="mailto:librarysheetmusic@gmail.com" color="blue.500">
              librarysheetmusic@gmail.com
            </Link>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default PrivacyPage;
