import React, { Component } from "react";

interface Props {
  liked: boolean;
  onLike: () => void;
}

const Like = ({ liked, onLike }: Props) => {
  let classes = "fa fa-heart";
  if (!liked) classes += "-o";
  return (
    <i
      className={classes}
      onClick={onLike}
      style={{ cursor: "pointer" }}
      aria-hidden="true"
    />
  );
};

export default Like;
