import "./MainLayout.css";
import { Outlet } from "react-router-dom";
import AppNavbar from "../appNavbar/AppNavbar";
import PostStatus from "../postStatus/PostStatus";
import UserInfo from "../userInfo/UserInfoComponent";

const MainLayout = () => {
  return (
    <>
      <AppNavbar />
      <div className="container mx-auto px-3 w-100">
        <div className="row gx-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
