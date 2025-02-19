import {
  Box,
  Container,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Link,
} from "@chakra-ui/react";

const Terms = () => {
  return (
    <Container maxW="4xl" py={8}>
      <Box className="terms-container">
        <Heading as="h1" size="xl" mb={6}>
          Terms and Conditions
        </Heading>
        <Text mb={4}>Last Updated: March 19, 2024</Text>

        <Text mb={6}>
          Welcome to SheetMusicLibrary ("Website" or "Service"). These Terms and
          Conditions ("Terms") govern your use of our website, including
          browsing, downloading, and uploading content. By accessing or using
          our Service, you agree to comply with these Terms.
        </Text>

        <Heading as="h2" size="lg" mb={4}>
          1. Acceptance of Terms
        </Heading>
        <Text mb={6}>
          By using SheetMusicLibrary, you agree to be bound by these Terms. If
          you do not agree, please do not use our Service.
        </Text>

        <Heading as="h2" size="lg" mb={4}>
          2. Copyright & Intellectual Property
        </Heading>

        <Heading as="h3" size="md" mb={3}>
          2.1 Public Domain and Licensed Content
        </Heading>
        <UnorderedList mb={4}>
          <ListItem>
            We provide access to public domain and Creative Commons-licensed
            sheet music.
          </ListItem>
          <ListItem>
            Users must verify a song's copyright status before uploading or
            sharing any material.
          </ListItem>
        </UnorderedList>

        <Heading as="h3" size="md" mb={3}>
          2.2 Copyrighted Content
        </Heading>
        <UnorderedList mb={4}>
          <ListItem>
            You may not upload copyrighted content unless you have the legal
            right to do so.
          </ListItem>
          <ListItem>
            If you are a copyright owner and believe content infringes your
            rights, you may submit a Takedown Request by contacting us at
            librarysheetmusic@gmail.com.
          </ListItem>
        </UnorderedList>

        <Heading as="h3" size="md" mb={3}>
          2.3 License to Use
        </Heading>
        <UnorderedList mb={6}>
          <ListItem>
            By uploading content, you grant SheetMusicLibrary a non-exclusive,
            worldwide license to display and distribute it.
          </ListItem>
          <ListItem>
            You retain ownership of your content but must ensure you have the
            rights to share it.
          </ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mb={4}>
          3. User Conduct & Responsibilities
        </Heading>
        <Text mb={3}>You agree not to:</Text>
        <UnorderedList mb={6}>
          <ListItem>Upload copyrighted material without permission</ListItem>
          <ListItem>Post false, misleading, or unlawful content</ListItem>
          <ListItem>Use automated bots or scripts to scrape our data</ListItem>
          <ListItem>Attempt to hack, exploit, or disrupt our Service</ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mb={4}>
          4. User-Generated Content & Copyright Compliance
        </Heading>
        <UnorderedList mb={6}>
          <ListItem>
            If we receive a valid copyright infringement complaint, we may
            remove the disputed content without notice.
          </ListItem>
          <ListItem>
            Repeated copyright violations may lead to account termination.
          </ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mb={4}>
          5. Privacy & Data Protection
        </Heading>

        <Heading as="h3" size="md" mb={3}>
          5.1 Data Collection & Usage
        </Heading>
        <UnorderedList mb={4}>
          <ListItem>
            We collect minimal personal data, such as emails for account
            registration and analytics for site improvements.
          </ListItem>
          <ListItem>We do not sell user data to third parties.</ListItem>
        </UnorderedList>

        <Heading as="h3" size="md" mb={3}>
          5.2 Compliance with African, European, and American Data Protection
          Laws
        </Heading>
        <Text mb={3}>
          Users from Cameroon, Nigeria, Ghana, Europe, and America have rights
          to:
        </Text>
        <UnorderedList mb={4}>
          <ListItem>Request access to personal data</ListItem>
          <ListItem>Request deletion of their data</ListItem>
          <ListItem>Opt-out of data collection</ListItem>
        </UnorderedList>
        <Text mb={4}>
          We comply with African Union Convention on Cyber Security and Personal
          Data Protection, GDPR (Europe & UK), and CCPA (California, USA).
        </Text>
        <Text mb={4}>
          To request data deletion, contact{" "}
          <Link href="mailto:librarysheetmusic@gmail.com" color="blue.500">
            librarysheetmusic@gmail.com
          </Link>
        </Text>

        <Heading as="h3" size="md" mb={3}>
          5.3 Cookies & Tracking
        </Heading>
        <UnorderedList mb={6}>
          <ListItem>
            We use cookies for essential website functions and analytics.
          </ListItem>
          <ListItem>
            Users can manage cookie preferences via their browser settings.
          </ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mb={4}>
          6. Security & Account Responsibility
        </Heading>
        <UnorderedList mb={6}>
          <ListItem>
            You are responsible for maintaining the security of your account.
          </ListItem>
          <ListItem>
            We employ encryption, secure storage, and periodic security audits
            to protect user data.
          </ListItem>
          <ListItem>
            We are not liable for any data breaches caused by third-party
            actions.
          </ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mb={4}>
          7. Disclaimers & Limitation of Liability
        </Heading>
        <UnorderedList mb={6}>
          <ListItem>
            Our Service is provided "as is", without guarantees of availability
            or accuracy.
          </ListItem>
          <ListItem>
            We are not liable for any damages resulting from your use of the
            website.
          </ListItem>
          <ListItem>
            We do not guarantee the legality or accuracy of user-uploaded
            content.
          </ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mb={4}>
          8. Termination & Account Suspension
        </Heading>
        <UnorderedList mb={6}>
          <ListItem>
            We may suspend or terminate accounts for violations of these Terms.
          </ListItem>
          <ListItem>
            Users may request account deletion by contacting{" "}
            <Link href="mailto:librarysheetmusic@gmail.com" color="blue.500">
              librarysheetmusic@gmail.com
            </Link>
          </ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mb={4}>
          9. Changes to Terms
        </Heading>
        <UnorderedList mb={6}>
          <ListItem>
            We reserve the right to modify these Terms at any time.
          </ListItem>
          <ListItem>
            Continued use of the website after updates constitutes acceptance of
            the new Terms.
          </ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mb={4}>
          10. Governing Law
        </Heading>
        <Text mb={6}>
          These Terms are governed by the laws of Cameroon, Nigeria, Ghana, and
          relevant international regulations.
        </Text>

        <Heading as="h2" size="lg" mb={4}>
          11. Contact Information
        </Heading>
        <Text mb={6}>
          For questions or legal concerns, contact us at{" "}
          <Link href="mailto:librarysheetmusic@gmail.com" color="blue.500">
            librarysheetmusic@gmail.com
          </Link>
        </Text>
      </Box>
    </Container>
  );
};

export default Terms;
