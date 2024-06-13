import React, { useEffect, useState } from "react";

interface ExtractUrlProps {
  onUrlExtracted: (url: string) => void;
}

const ExtractUrl: React.FC<ExtractUrlProps> = ({ onUrlExtracted }) => {
  useEffect(() => {
    const pathname = window.location.pathname;
    console.log(pathname);
    if (pathname && pathname.length > 0) {
      onUrlExtracted(pathname);
    }
  }, [onUrlExtracted]);

  return null;
};

export default ExtractUrl;
