import React from "react";
import { Button, Text, Heading, Container, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const UploadSong = () => {
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading
          as="h1"
          fontSize={{ base: "clamp(2rem, 8vw, 4rem)", md: "clamp(2.5rem, 6vw, 5rem)", lg: "clamp(3rem, 5vw, 6rem)" }}
          textAlign="center"
          fontWeight="800"
          letterSpacing="-0.03em"
          lineHeight="1.1"
          mb={6}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          Upload Your Song
        </Heading>
        
        <Text
          fontSize="lg"
          lineHeight="1.7"
          color="gray.300"
          textAlign="justify"
        >
          If you intend to have your song uploaded, you'll need to do the
          following:
          <br />
          <li>Have a pdf of the music score in your prefered notation system</li>
          <li>Have a pdf copy of the song lyrics</li>
          <li>
            Have a pdf document containing any relevant information about the
            song, including details for rendition and backgroung
          </li>
          <li>
            For first time composers, you need to give some information about
            yourself that will be made public (this is for those who desire)
          </li>
          Send these in an email to the songs resource coodinator (Contact us
          page) after discussing the terms of submission.
          <br />
          Note: Your composition will be submitted to a review board, and will
          only be uploaded upon their approval.
        </Text>

        <Link to="/contact">
          <Button colorScheme="blue" size="lg">
            Contact Us
          </Button>
        </Link>
      </VStack>
    </Container>
  );
};

export default UploadSong;
