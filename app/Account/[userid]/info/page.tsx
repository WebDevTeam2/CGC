import AccountInfo from "@/app/Components/Account-components/AccountInfo";

const Account = ({ params }: { params: any }) => {
  return (
    <div>
      <AccountInfo userid={params.userid} />
    </div>
  );
};

export default Account;
