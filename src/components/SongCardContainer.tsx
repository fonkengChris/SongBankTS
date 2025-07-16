import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const SongCardContainer = ({ children }: Props) => {
  return (
    <Box
      _hover={{
        transform: "scale(1.02)",
        transition: "transform .15s ease-in",
        boxShadow: "lg",
      }}
      borderRadius={10}
      overflow="hidden"
      height="100%"
      width="100%"
      boxShadow="md"
    >
      {children}
    </Box>
  );
};

export default SongCardContainer;
