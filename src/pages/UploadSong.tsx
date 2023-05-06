import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const UploadSong = () => {
  return (
    <div>
      <Text>
        If you intend to have your song uploaded, you'll need to do the
        following:
        <br />
        <li>Have a pdf of the music score in your prefered notation system</li>
        <li>Have a pdf copy of the song lyrics</li>
        <li>
          Have a pdf document containing any relevant information about the
          song, including details for rendition and backgroung
        </li>
        <li>
          For first time composers, you need to give some information about
          yourself that will be made public (this is for those who desire)
        </li>
        Send these in an email to the songs resource coodinator (Contact us
        page) after discussing the terms of submission.
        <br />
        Note: Your composition will be submitted to a review board, and will
        only be uploaded upon their approval.
      </Text>

      <Link to="/contact">
        <Button>Contact Us</Button>
      </Link>
    </div>
  );
};

export default UploadSong;
