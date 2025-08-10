import React, { useEffect, useState } from "react";
import { Box, Image, Spinner, Text, VStack } from "@chakra-ui/react";

interface PWASplashScreenProps {
  onComplete?: () => void;
}

const PWASplashScreen: React.FC<PWASplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex={9999}
      bg="black"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <VStack spacing={6}>
        <Image
          src="/songBankLogo.png"
          alt="SongLibrary Logo"
          boxSize="120px"
          objectFit="contain"
        />
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="white"
          textAlign="center"
        >
          SongLibrary
        </Text>
        <Text fontSize="md" color="gray.400" textAlign="center">
          Sheet Music Library
        </Text>
        <Spinner size="lg" color="blue.400" thickness="3px" />
      </VStack>
    </Box>
  );
};

export default PWASplashScreen;
