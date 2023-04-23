import { Heading } from "@chakra-ui/react";
import React from "react";
import { SongQuery } from "./common/HomePage";
import useCategories from "../hooks/useCategories";
import useNotations from "../hooks/useNotations";

interface Props {
  songQuery: SongQuery;
}

const SongHeading = ({ songQuery }: Props) => {
  const { data: categories } = useCategories();
  const category = categories.find((c) => c.id === songQuery.categoryId);

  const { data: notations } = useNotations();
  const notation = notations.find((n) => n.id === songQuery.notationId);

  const heading = `${notation?.title || ""} ${category?.title || ""} Songs`;
  return (
    <Heading textAlign="left" marginY={5} fontSize="5xl" as="h1">
      {heading}
    </Heading>
  );
};

export default SongHeading;
