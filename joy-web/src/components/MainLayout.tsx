import { Outlet } from "react-router-dom";
import { AppNavbar } from "./AppNavbar";

const MainLayout = () => {
  return (
    <>
      <AppNavbar />
      <div className="container mx-auto px-3 w-100">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
