import React, { useEffect, useState } from "react";
import { Box, Button, Text, useToast, Image, HStack, VStack } from "@chakra-ui/react";

interface PWAUpdatePromptProps {
  onUpdate?: () => void;
}

const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({ onUpdate }) => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    const initPWA = async () => {
      try {
        // Dynamic import to avoid build issues
        const { registerSW } = await import("virtual:pwa-register");

        const updateSW = registerSW({
          onNeedRefresh() {
            setNeedRefresh(true);
            toast({
              title: "Update Available",
              description:
                "A new version of SongLibrary is available. Click to update.",
              status: "info",
              duration: 10000,
              isClosable: true,
              position: "top",
            });
          },
          onOfflineReady() {
            setOfflineReady(true);
            toast({
              title: "App Ready",
              description: "SongLibrary is now available offline.",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
          },
          onRegistered(swRegistration?: ServiceWorkerRegistration) {
            console.log("SW registered: ", swRegistration);
          },
          onRegisterError(error?: any) {
            console.log("SW registration error", error);
          },
        });

        return updateSW;
      } catch (error) {
        console.warn("PWA register not available:", error);
        return null;
      }
    };

    initPWA();
  }, [toast]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const update = () => {
    setNeedRefresh(false);
    window.location.reload();
    onUpdate?.();
  };

  if (!needRefresh && !offlineReady) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top="4"
      right="4"
      zIndex={9999}
      bg="gray.800"
      color="white"
      p={4}
      borderRadius="md"
      boxShadow="lg"
      maxW="320px"
    >
      <HStack spacing={3} mb={3}>
        <Image
          src="/songBankLogo.png"
          alt="SongLibrary Logo"
          boxSize="24px"
          objectFit="contain"
        />
        <VStack spacing={0} align="start" flex="1">
          <Text fontSize="sm" fontWeight="semibold">
            SongLibrary
          </Text>
          <Text fontSize="xs" color="gray.300">
            {needRefresh ? "New content available" : "App ready to work offline"}
          </Text>
        </VStack>
      </HStack>
      <Box display="flex" gap={2}>
        {needRefresh && (
          <Button size="sm" colorScheme="blue" onClick={update}>
            Reload
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={close}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default PWAUpdatePrompt;
