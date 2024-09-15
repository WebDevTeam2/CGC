"use client";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";

const View = () => {
  const [users, setUsers] = useState([]);
  const [isSuccess, setIsSuccess] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`http://localhost:3000/api/users`, {
        cache: "no-store",
      });
      const data = await response.json();
      console.log(data);
      setIsSuccess(data.success);
      setUsers(data.data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      {isSuccess ? (
        <div className="py-5">
          <table>
            <thead>
              <tr>
                <th>_id</th>
                <th>username</th>
                <th>email</th>
                <th>profilePicture</th>
                <th>isVerified</th>
                <th>provider</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id} className="mb-8 p-8">
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Image
                      className="rounded-full"
                      src={user.profilePicture}
                      width={30}
                      height={30}
                    ></Image>
                  </td>
                  <td>{user.isVerified ? "true" : "false"}</td>
                  <td>{user.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        "BLYYYAATT"
      )}
    </div>
  );
};

export default View;
