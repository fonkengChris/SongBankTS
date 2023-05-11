import { Icon } from "@chakra-ui/react";
import { BsEye, BsEyeFill } from "react-icons/bs";

interface Props {
  onView: () => void;
}

const Views = ({ onView }: Props) => {
  return (
    <Icon
      as={BsEyeFill}
      onClick={onView}
      style={{ cursor: "pointer" }}
      aria-hidden="true"
    />
  );
};

export default Views;
