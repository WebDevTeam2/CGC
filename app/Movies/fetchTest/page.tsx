"use client"
import { useState, useEffect } from "react";
import Image from "next/image";

interface photos {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

const Fetch = () => {
  const [photos, setPhotos] = useState<photos[]>([]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setPhotos(data);
      });
  }, []);
  return (
    <div className="ml-[50rem]">
      {photos.map((photo) => (
        <Image key={photo.id} src={photo.thumbnailUrl} alt={photo.title} layout="fill"/>
      ))}
    </div>
  );
};

export default Fetch;
