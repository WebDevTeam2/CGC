"use client";
import AccountGames from "@/app/Components/Account-components/AccountGames";

const Account = ({ params }: { params: { userid: string } }) => {
  return (
    <div>
      <AccountGames userid={params.userid} />
    </div>
  );
};

export default Account;
