"use client";
//components
import UserOptions from "@/app/components/Account-components/UserOptions";

//utils
import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useRef, useState } from "react";

const Account = () => {
  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Store the selected image temporarily
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to the hidden file input

  const handleImageClick = () => {
    // Trigger the hidden input file click when image container is clicked
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // Field name must match the server expectation

      try {
        const response = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Upload failed:", errorText);
          return;
        }

        const data = await response.json();
        console.log("File uploaded successfully:", data);
        setSelectedImage(data.filePath); // Set the uploaded image as preview
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div className="back-img h-screen flex text-center justify-center">
      <div className="flex justify-center rounded-2xl items-center shadow-lg my-28 bg-slate-300">
        <UserOptions />
        {/* option content */}
        <div className="flex flex-col h-full items-center mr-10 gap-0 mt-12">
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleImageClick} // Trigger input click when container is clicked
          >
            <Image
              src={
                selectedImage ||
                session?.user?.image ||
                "/assets/images/default_avatar.jpg"
              }
              alt="User Avatar"
              layout="fill"
              priority={true}
              className="object-cover"
              key={selectedImage} // Add a key to force re-render when image source changes
            />
            {/* Hidden input for file upload */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Upload Image</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-stretch justify-between mt-8">
              <span className="text-blue-950">Username: </span>
              <span className="text-blue-900 text-end">
                {session?.user?.name || "No name available"}
              </span>
            </div>
            <div className="flex flex-row gap-2 items-stretch justify-between">
              <span className="text-blue-950">Email: </span>
              <span className="text-blue-900 text-end">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
