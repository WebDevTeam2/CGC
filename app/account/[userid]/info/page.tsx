"use client";
//components
import UserOptions from "@/app/Components/Account-components/UserOptions";

//utills
import bcrypt from "bcryptjs";
import { useEffect, useState, FormEvent, MouseEvent } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { UploadButton } from "@/app/Game Collection/uploadthing";
import Link from "next/link";
import Popup from "@/app/Components/Popup";
import Footer from "@/app/Components/Footer";

const Account = ({ params }: { params: { userid: string } }) => {
  const { data: session } = useSession();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [hasProvider, setHasProvider] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess && user) setIsLoaded(true);
  }, [isSuccess, user]);

  const handleDeleteAccount = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true); // Indicate that the deletion process is starting

    try {
      const response = await fetch(`/api/users/${userid}/deleteAccount`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: userId }), // Ensure you are passing the correct userId
      });

      if (response.ok) {
        // Delay for 2 seconds before signing out
        setTimeout(() => {
          signOut({ callbackUrl: "/" });
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`); // You might want to handle this in a more user-friendly way
        setIsDeleting(false); // Reset deleting state if there's an error
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("An error occurred while deleting the account."); // Handle this error gracefully
      setIsDeleting(false); // Reset deleting state on error
    }
  };

  const cancelDelete = () => {
    setShowPopup(false);
    setIsDeleting(false); // Reset deleting state if user cancels
  };

  // Store initial data for comparison
  const [initialData, setInitialData] = useState({
    username: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordre: "",
  });
  const { userid } = params;

  useEffect(() => {
    const fetchUser = async (userid: String) => {
      try {
        const response = await fetch(`/api/users/${userid}`, {
          method: "GET",
        });
        const responseData = await response.json();
        setUser(responseData.data);
        setUserId(responseData.data._id);
        setImageUrl(responseData.data.profilePicture);
        setIsSuccess(responseData.success);

        // Check if user has a provider
        if (responseData.data.provider !== "credentials") {
          setHasProvider(true);
        } else {
          setHasProvider(false);
        }
        // Set both the initial and current form data with the fetched data
        const fetchedData = {
          username: responseData.data.username,
          email: responseData.data.email,
          password: "",
          passwordre: "",
        };

        setInitialData(fetchedData);
        setFormData(fetchedData);
        console.log(responseData.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setIsSuccess(false);
      }
    };
    if (userid) {
      fetchUser(userid);
    }
  }, [userid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: string[] = [];

    if (
      formData.username === initialData.username &&
      !formData.password.trim() &&
      !formData.passwordre.trim()
    ) {
      alert("Nothing to update");
      return; // No need to proceed further
    }

    const usernameRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{10,}$/;
    if (formData.username.trim() && !usernameRegex.test(formData.username)) {
      errors.push(
        "Username must be at least 10 characters long, contain at least one capital letter, one number, and may include symbols."
      );
    }

    // Password validation
    if (formData.password.trim() || formData.passwordre.trim()) {
      const passwordRegex = /^(?=.*[A-Z])[A-Za-z\d\W]{10,}$/;
      if (!passwordRegex.test(formData.password)) {
        errors.push(
          "Password must be at least 10 characters long, contain at least one capital letter, and may include symbols."
        );
      }

      if (formData.password !== formData.passwordre) {
        errors.push("Passwords do not match");
      }
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    // Prepare the data object to be sent in the update
    const updatedData: any = {
      username: formData.username,
      email: formData.email,
    };

    // Only include password if it is not empty and valid
    if (formData.password.trim()) {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      updatedData.password = hashedPassword;
    }

    const response = await fetch(`/api/users/${userid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      setErrorMessages([]);
      alert("User info updated successfully!");
    } else {
      alert("Error updating user info");
    }
  };

  return (
    <div className="back-img fixed overflow-hidden overflow-y-auto bg-cover items-center w-full h-screen flex flex-col text-center">
      <Link href={`/`} className="w-full pointer-events-none">
        <h2 className="ml-4 mt-4 text-white pointer-events-auto text-2xl transition duration-100 p-1 rounded-full hover:scale-110">
          &#8618; Home
        </h2>
      </Link>
      {isSuccess && user && (
        <div className="flex sm:flex-row flex-col grow sm:mx-10 mx-4 rounded-2xl shadow-lg mt-12 mb-[5.1rem] flex-1 relative bg-slate-300">
          <UserOptions />
          <div className="flex flex-col text-md items-center sm:mx-10 mx-0 gap-0 sm:mt-12 sm:mb-24 mb-8 mt-8">
            {hasProvider ? (
              <>
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <img
                    src={imageUrl || "/assets/images/default_avatar.jpg"}
                    alt="User Avatar"
                    className="object-cover"
                  />
                </div>
                <form className="flex flex-col gap-4 mt-8 sm:w-80 w-60">
                  <div className="flex sm:flex-row flex-col gap-2 items-center justify-between">
                    <label htmlFor="name" className="text-blue-950 font-black">
                      Username:{" "}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={session?.user?.name || "No user name found"}
                      className="text-blue-900 border border-blue-400 rounded-md p-1"
                      autoComplete="off"
                      disabled
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 items-center justify-between">
                    <label htmlFor="mail" className="text-blue-950 font-black">
                      Email:{" "}
                    </label>
                    <input
                      type="email"
                      name="mail"
                      value={session?.user?.email || "No email found"}
                      className="text-blue-900 border border-blue-400 rounded-md p-1"
                      disabled
                    />
                  </div>
                  <div className="text-slate-200 flex justify-center sm:my-0 my-4">
                    <div className="bg-slate-400 sm:w-full w-56 text-center p-4 rounded-lg">
                      Nothing can be edited as you are connected with a
                      provider.
                    </div>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-800 transition duration-200 text-white rounded-md sm:px-4 px-2 sm:py-2 py-4 mb-4"
                  >
                    Delete Account
                  </button>
                  {showPopup && (
                    <Popup
                      onConfirm={confirmDelete}
                      onCancel={cancelDelete}
                      isDeleting={isDeleting}
                    />
                  )}
                </form>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={imageUrl || "/assets/images/default_avatar.jpg"}
                      alt="User Avatar"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <UploadButton
                      className="ut-button:bg-slate-600 ut-button:hover:bg-slate-700"
                      endpoint="imageUploader"
                      onClientUploadComplete={async (res) => {
                        const imageUrl = res[0].url;
                        setImageUrl(imageUrl);

                        // Save the image URL to the backend (associate with user ID)
                        await fetch("/api/saveImage", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            email: session?.user?.email, // Assuming you're using email as the identifier
                            profilePicture: imageUrl,
                          }),
                        });
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 mt-8"
                >
                  <div className="flex sm:flex-row flex-col gap-2 items-center justify-between">
                    <label
                      htmlFor="username"
                      className="text-blue-950 font-black"
                    >
                      Username:{" "}
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="text-blue-900 border border-blue-400 rounded-md p-1"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 items-center justify-between">
                    <label htmlFor="email" className="text-blue-950 font-black">
                      Email:{" "}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="text-blue-900 border border-blue-400 rounded-md p-1"
                      disabled
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 items-center text-start justify-between">
                    <label
                      htmlFor="password"
                      className="text-blue-950 font-black"
                    >
                      New Password:{" "}
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleChange}
                      className="text-blue-900 border border-blue-400 rounded-md p-1"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 items-center text-start justify-between">
                    <label
                      htmlFor="passwordre"
                      className="text-blue-950 font-black"
                    >
                      Re-enter Password:{" "}
                    </label>
                    <input
                      type="password"
                      name="passwordre"
                      placeholder="Re-enter password"
                      value={formData.passwordre}
                      onChange={handleChange}
                      className="text-blue-900 border border-blue-400 rounded-md p-1"
                      autoComplete="off"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-800 transition duration-200 text-white rounded-md px-4 sm:py-2 py-4 mt-4"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-800 transition duration-200 text-white rounded-md sm:px-4 px-2 sm:py-2 py-4 mb-4"
                  >
                    Delete Account
                  </button>
                  {showPopup && (
                    <Popup
                      onConfirm={confirmDelete}
                      onCancel={cancelDelete}
                      isDeleting={isDeleting}
                    />
                  )}
                </form>
              </>
            )}
            {errorMessages.length > 0 && (
              <div className="text-red-600 flex justify-center">
                <ul className="bg-red-200 w-full text-center p-4">
                  {errorMessages.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      {isLoaded && <Footer />}
    </div>
  );
};

export default Account;
