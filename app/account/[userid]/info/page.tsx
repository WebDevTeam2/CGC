"use client";
//components
import UserOptions from "@/app/components/Account-components/UserOptions";

//utills
import { useEffect, useState } from "react";
import Image from "next/legacy/image";

const Account = ({ params }: { params: { userid: string } }) => {
  const [user, setUser] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const { userid } = params;

  useEffect(() => {
    const fetchUser = async (userid: String) => {
      try {
        const response = await fetch(`/api/users/${userid}`, {
          method: "GET",
        });
        const data = await response.json();
        setUser(data.data);
        setIsSuccess(data.success);
        setFormData({
          username: data.data.username,
          email: data.data.email,
        });
        console.log(data);
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
    const response = await fetch(`/api/users/${userid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("User info updated successfully!");
    } else {
      alert("Error updating user info");
    }
  };

  return (
    <div className="back-img h-screen flex text-center justify-center">
      {isSuccess && user ? (
        <div className="flex justify-center rounded-2xl items-center shadow-lg my-28 bg-slate-300">
          <UserOptions />
          <div className="flex flex-col h-full items-center mr-10 gap-0 mt-12">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={user.profilePicture || "/assets/images/default_avatar.jpg"}
                alt="User Avatar"
                layout="fill"
                className="object-cover"
              />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
              <div className="flex flex-row gap-2 items-center justify-between">
                <label htmlFor="username" className="text-blue-950">
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
              <div className="flex flex-row gap-2 items-center justify-between">
                <label htmlFor="email" className="text-blue-950">
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
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-md px-4 py-2 mt-4"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      ) : (
        "No data found"
      )}
    </div>
  );
};

export default Account;
