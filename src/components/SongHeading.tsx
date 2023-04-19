import { Heading } from "@chakra-ui/react";
import React from "react";
import { SongQuery } from "../App";

interface Props {
  songQuery: SongQuery;
}

const SongHeading = ({ songQuery }: Props) => {
  const heading = `${songQuery.notation?.title || ""} ${
    songQuery.category?.title || ""
  } Songs`;
  return (
    <Heading textAlign="left" marginY={5} fontSize="5xl" as="h1">
      {heading}
    </Heading>
  );
};

export default SongHeading;
