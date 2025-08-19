import { Box, Heading, Text, VStack, Button, Image, useBreakpointValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  // Responsive logo size
  const logoSize = useBreakpointValue({ 
    base: "200px", 
    sm: "240px", 
    md: "280px", 
    lg: "320px" 
  });

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box flex="1" p={8}>
        <VStack spacing={8} align="center">
          {/* Logo Section */}
          <VStack spacing={6} align="center" mb={4}>
            <Image
              src="/songBankLogo.png"
              alt="SheetMusicLibrary Logo"
              boxSize={logoSize}
              objectFit="contain"
              fallbackSrc="https://via.placeholder.com/320x320?text=Logo"
            />
          </VStack>

          <Heading
            as="h1"
            fontSize={{ base: "clamp(2rem, 8vw, 4rem)", md: "clamp(2.5rem, 6vw, 5rem)", lg: "clamp(3rem, 5vw, 6rem)" }}
            mb={6}
            fontWeight="800"
            letterSpacing="-0.03em"
            lineHeight="1.2"
            textAlign="center"
            maxW="100%"
            px={4}
          >
            Welcome to SheetMusicLibrary
          </Heading>
          
          <Text
            fontSize="xl"
            color="gray.400"
            mb={8}
            textAlign="center"
            fontWeight="500"
            letterSpacing="0.01em"
            maxW="600px"
            mx="auto"
          >
            Your digital destination for a wide variety of sheet music.
          </Text>

          <Text
            mb={6}
            fontSize="lg"
            lineHeight="1.7"
            color="gray.300"
            maxW="800px"
            mx="auto"
            textAlign="center"
          >
            At SheetMusicLibrary, we believe that music should be easy to find,
            share, and play. Our platform is designed for{" "}
            <strong>
              musicians, choirs, teachers, students, and music lovers
            </strong>
            who need access to a <strong>wide variety of sheet music</strong>{" "}
            from different genres and traditions.
          </Text>

          <Text
            mb={6}
            fontSize="lg"
            lineHeight="1.7"
            color="gray.300"
            maxW="800px"
            mx="auto"
            textAlign="center"
          >
            Whether you're looking for{" "}
            <strong>
              hymns, gospel songs, African traditional music, classical pieces,
              or contemporary tunes
            </strong>
            , you'll find a growing collection here. We offer sheet music in
            various notation forms like{" "}
            <strong>Staff, Sol-fa, Gregorian</strong>, and others to cater to
            diverse musical needs.
          </Text>

          <Text
            mb={6}
            fontSize="lg"
            lineHeight="1.7"
            color="gray.300"
            maxW="800px"
            mx="auto"
            textAlign="center"
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

          <Text
            mb={8}
            fontSize="lg"
            lineHeight="1.7"
            color="gray.300"
            maxW="800px"
            mx="auto"
            textAlign="center"
          >
            We also aim to make copyrighted songs available for African
            audiences by including{" "}
            <strong> locally accessible payment platforms</strong> for easy
            purchases.
          </Text>

          <VStack spacing={6} align="center">
            <Button
              as={RouterLink}
              to="/about"
              colorScheme="blue"
              size="lg"
              fontSize="lg"
              fontWeight="600"
              px={8}
              py={4}
              borderRadius="full"
              letterSpacing="0.01em"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(49, 130, 206, 0.3)",
              }}
              transition="all 0.2s ease"
            >
              Learn More About Us
            </Button>
            <Button
              as={RouterLink}
              to="/songs"
              colorScheme="teal"
              size="lg"
              fontSize="lg"
              fontWeight="600"
              px={8}
              py={4}
              borderRadius="full"
              letterSpacing="0.01em"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(20, 184, 166, 0.3)",
              }}
              transition="all 0.2s ease"
            >
              Browse Our Collection
            </Button>
            <Button
              as={RouterLink}
              to="/tutorials"
              colorScheme="orange"
              size="lg"
              fontSize="lg"
              fontWeight="600"
              px={8}
              py={4}
              borderRadius="full"
              letterSpacing="0.01em"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(251, 146, 60, 0.3)",
              }}
              transition="all 0.2s ease"
            >
              Watch Tutorials
            </Button>
            {!isAuthenticated && (
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="green"
                size="lg"
                fontSize="lg"
                fontWeight="600"
                px={8}
                py={4}
                borderRadius="full"
                letterSpacing="0.01em"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)",
                }}
                transition="all 0.2s ease"
              >
                Join Our Community
              </Button>
            )}
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default HomePage;
