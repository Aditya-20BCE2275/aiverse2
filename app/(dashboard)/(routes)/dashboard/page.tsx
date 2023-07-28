// import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

const DashBoard = () => {
  return (
    <div>
    <p>DashBoard Page (Protected)</p>
    <UserButton afterSignOutUrl="/"/>
    </div>
  );
};

export default DashBoard;
