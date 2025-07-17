import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, MessageCircle, Search } from "lucide-react";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";
import { useState } from "react";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const [isModalOpen, setIsModalOpen] = useState(false);


  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <MessageCircle className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  {import.meta.env.VITE_APP_NAME}
                </span>
              </Link>
            </div>
          )}

          {/* Search Bar for users by username */}
          <div className="hidden md:flex items-center gap-2 px-4">
            <Search className="w-5 h-5 text-base-content opacity-70" />
            <input
              type="text"
              placeholder="Search language partners..."
              className="input input-bordered input-sm w-48 focus:outline-none"
            />
          </div>

          {/* add static image(s) for feel of app , connecting people with languages */}


          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full  hover:opacity-70"
              onClick={() => setIsModalOpen(true)}>
              <img src={authUser?.profilePic || (authUser?.gender === "male" ? "/man.png" : "/woman.png")} alt="User Avatar" rel="noreferrer" />
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={authUser?.profilePic || (authUser?.gender === "male" ? "/man.png" : "/woman.png")}
            alt="User Avatar Large"
            className="max-w-full max-h-full rounded-lg "
            onClick={(e) => e.stopPropagation()} // prevents closing on image click
          />
        </div>
      )}

    </nav>
  );
};
export default Navbar;
