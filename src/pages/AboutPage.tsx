import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Link,
  Divider,
} from "@chakra-ui/react";

const AboutPage = () => {
  return (
    <Container maxW="4xl" py={12}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading
            as="h1"
            size="xl"
            mb={6}
            fontWeight="800"
            letterSpacing="-0.03em"
            lineHeight="1.1"
          >
            About SheetMusicLibrary
          </Heading>
          <Text
            fontSize="xl"
            color="gray.400"
            mb={8}
            fontWeight="500"
            letterSpacing="0.01em"
            maxW="600px"
            mx="auto"
          >
            Welcome to your digital sheet music destination!
          </Text>
        </Box>

        <Box>
          <Text
            mb={6}
            fontSize="lg"
            lineHeight="1.7"
            color="gray.300"
            textAlign="justify"
          >
            At SheetMusicLibrary, we believe that music should be easy to find,
            share, and play. Our platform is designed for{" "}
            <strong>
              musicians, choirs, teachers, students, and music lovers
            </strong>{" "}
            who need access to a <strong>wide variety of sheet music</strong>{" "}
            from different genres and traditions. Whether you're looking for{" "}
            <strong>
              hymns, gospel songs, African traditional music, classical pieces,
              or contemporary tunes
            </strong>
            , you'll find a growing collection here.
          </Text>

          <Text
            mb={8}
            fontSize="lg"
            lineHeight="1.7"
            color="gray.300"
            textAlign="justify"
          >
            We are inspired by platforms like{" "}
            <strong>IMSLP.org and Hymnary.org</strong>, but we focus on making
            sheet music{" "}
            <strong>
              more accessible to people in Africa, Europe, and America
            </strong>
            . Our goal is to{" "}
            <strong>
              preserve, promote, and distribute music in a legal and
              user-friendly way
            </strong>{" "}
            so that musicians around the world can continue to create and
            perform.
          </Text>
        </Box>

        <Box>
          <Heading
            as="h2"
            size="lg"
            mb={6}
            fontWeight="700"
            letterSpacing="-0.02em"
            color="blue.400"
          >
            What We Do
          </Heading>
          <UnorderedList spacing={3} pl={6}>
            <ListItem fontSize="lg" lineHeight="1.7" color="gray.300">
              Provide an <strong>organized library of sheet music</strong> that
              is easy to search and download.
            </ListItem>
            <ListItem fontSize="lg" lineHeight="1.7" color="gray.300">
              Allow users to <strong>upload their own sheet music</strong>,
              helping to build a shared musical resource.
            </ListItem>
            <ListItem fontSize="lg" lineHeight="1.7" color="gray.300">
              Ensure that all content <strong>respects copyright laws</strong>,
              protecting the rights of creators and contributors.
            </ListItem>
            <ListItem fontSize="lg" lineHeight="1.7" color="gray.300">
              Support <strong>musical education and collaboration</strong> by
              giving musicians access to high-quality sheet music.
            </ListItem>
            <ListItem fontSize="lg" lineHeight="1.7" color="gray.300">
              Offer sheet music in various notation forms like{" "}
              <strong>Staff, Sol-fa, Gregorian</strong>, and others to cater to
              diverse musical needs.
            </ListItem>
            <ListItem fontSize="lg" lineHeight="1.7" color="gray.300">
              Make copyrighted songs available for African audiences by
              including <strong>locally accessible payment platforms</strong>{" "}
              for easy purchases.
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider borderColor="gray.600" />

        <Box>
          <Heading
            as="h2"
            size="lg"
            mb={6}
            fontWeight="700"
            letterSpacing="-0.02em"
            color="blue.400"
          >
            Why We Created This Website
          </Heading>
          <Text
            mb={8}
            fontSize="lg"
            lineHeight="1.7"
            color="gray.300"
            textAlign="justify"
          >
            Many musicians and choirs struggle to find high-quality sheet music,
            especially for <strong>traditional and African music</strong>. Some
            pieces are rare, difficult to access, or scattered across different
            sources. Our mission is to{" "}
            <strong>bring all these resources together in one place</strong>,
            where musicians of all backgrounds can{" "}
            <strong>discover, contribute, and share</strong> freely.
          </Text>
        </Box>

        <Box>
          <Heading
            as="h2"
            size="lg"
            mb={6}
            fontWeight="700"
            letterSpacing="-0.02em"
            color="blue.400"
          >
            Our Vision
          </Heading>
          <Text
            mb={8}
            fontSize="lg"
            lineHeight="1.7"
            color="gray.300"
            textAlign="justify"
          >
            We want to create a{" "}
            <strong>global community of music lovers</strong> where people can
            learn from each other, inspire creativity, and keep musical
            traditions alive. Whether you are a beginner learning your first
            song or a professional performer, our website is here to support
            your musical journey.
          </Text>
        </Box>

        <Box>
          <Heading
            as="h2"
            size="lg"
            mb={6}
            fontWeight="700"
            letterSpacing="-0.02em"
            color="blue.400"
          >
            Join Us!
          </Heading>
          <UnorderedList spacing={3} pl={6} mb={8}>
            <ListItem fontSize="lg" lineHeight="1.7" color="gray.300">
              <strong>Browse</strong> our collection and find the sheet music
              you need.
            </ListItem>
            <ListItem fontSize="lg" lineHeight="1.7" color="gray.300">
              <strong>Upload</strong> your own sheet music to share with others
              and preserve musical heritage.
            </ListItem>
            <ListItem fontSize="lg" lineHeight="1.7" color="gray.300">
              <strong>Connect</strong> with fellow musicians and become part of
              a thriving musical community.
            </ListItem>
            <ListItem fontSize="lg" lineHeight="1.7" color="gray.300">
              <strong>Stay updated</strong> as we continue to expand our
              collection and improve the platform.
            </ListItem>
          </UnorderedList>

          <Text
            mb={6}
            fontSize="lg"
            lineHeight="1.7"
            color="gray.300"
            textAlign="center"
          >
            If you have any questions, suggestions, or requests, feel free to
            contact us at{" "}
            <Link
              href="mailto:librarysheetmusic@gmail.com"
              color="blue.400"
              fontWeight="600"
              _hover={{ color: "blue.300", textDecoration: "underline" }}
              transition="color 0.2s ease"
            >
              librarysheetmusic@gmail.com
            </Link>
            . We'd love to hear from you!
          </Text>

          <Text
            fontSize="2xl"
            fontWeight="800"
            color="blue.400"
            textAlign="center"
            letterSpacing="-0.02em"
          >
            Happy Music-Making! 🎶
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default AboutPage;
