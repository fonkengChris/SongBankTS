import { Icon } from "@chakra-ui/react";
import { BsHeart, BsHeartFill } from "react-icons/bs";

interface Props {
  liked: boolean;
  onLike?: () => void;
}

const Like = ({ liked, onLike }: Props) => {
  let classes = liked === true ? BsHeartFill : BsHeart;

  return (
    <Icon
      as={classes}
      onClick={onLike}
      cursor={onLike ? "pointer" : "not-allowed"}
      opacity={onLike ? 1 : 0.5}
      transition="all 0.2s ease-in-out"
      _hover={onLike ? { transform: "scale(1.1)" } : {}}
      aria-hidden="true"
    />
  );
};

export default Like;
