"use client"
import Logout from "@/app/components/Movie-components/Nav-items/Logout";
import { useSession } from "next-auth/react";

const UserProfile = () => {
    return (
        <div>
            <Logout />
        </div>
    )
}

export default UserProfile;

