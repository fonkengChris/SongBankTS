import { Icon } from "@chakra-ui/react";
import { BsHeart, BsHeartFill } from "react-icons/bs";

interface Props {
  liked: boolean;
  onLike: () => void;
}

const Like = ({ liked, onLike }: Props) => {
  let classes = liked === true ? BsHeartFill : BsHeart;

  return (
    <Icon
      as={classes}
      onClick={onLike}
      style={{ cursor: "pointer" }}
      aria-hidden="true"
    />
  );
};

export default Like;
