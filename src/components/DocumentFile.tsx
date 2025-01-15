import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";

interface Props {
  url: URL;
}

const DocumentFile = ({ url }: Props) => {
  const [numPages, setNumPages] = useState(2);
  const [pageNumber, setPageNumber] = useState(1);

  //   function onDocumentLoadSuccess({numPages} ) {
  //     setNumPages(numPages);
  //   }

  return (
    <div>
      <Document file={url}>
        <Page pageNumber={pageNumber} />
      </Document>
      {/* <p>
        Page {pageNumber} of {numPages}
      </p> */}
    </div>
  );
};

export default DocumentFile;
