"use client";

import { useEffect, useState } from "react";

const ViewSingleUser = ({ params }: { params: { userid: string } }) => {
  const [user, setUser] = useState<any>(null); // Initialize user as null, assuming user is an object
  const [isSuccess, setIsSuccess] = useState(true);
  const { userid } = params; // Destructure params to get userid

  useEffect(() => {
    const fetchUser = async (userid: string) => {
      try {
        const response = await fetch(`/api/users/${userid}`, {
          cache: "no-store",
          method: "GET",
        });

        const data = await response.json();
        setUser(data.data); // Update with the correct user object from the API
        setIsSuccess(data.success); // Ensure success flag or check if user exists
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setIsSuccess(false); // Set to false if there's an error
      }
    };
    if (userid) {
      fetchUser(userid); // Call the function with userid
    }
  }, [userid]); // Add userid as a dependency to run when it is available

  return (
    <div>
      <h1>User Information</h1>
      {isSuccess && user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          {/* Add more user information as needed */}
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default ViewSingleUser;
