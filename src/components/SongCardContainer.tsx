import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const SongCardContainer = ({ children }: Props) => {
  return (
    <Box
      _hover={{
        transform: "scale(1.05)",
        transition: "transform .15s ease-in",
      }}
      height="400px"
      width="300px"
      borderRadius={10}
      overflow="hidden"
    >
      {children}
    </Box>
  );
};

export default SongCardContainer;
