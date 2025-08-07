import { useState } from "react";
import { Link, useLocation } from "react-router";
import { HomeIcon, UsersIcon, Settings, X, Menu, LogOutIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";

const MobileSidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const [open, setOpen] = useState(false);

  const { logoutMutation } = useLogout();

  return (
    <>
      {/* Hamburger Icon (bottom left) */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-base-200 p-2 rounded-lg shadow-md"
      >
        <Menu className="w-8 h-8 text-base-content" />
      </button>

      {/* Overlay Sidebar Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay background */}
          <div
            className="bg-black bg-opacity-50 w-full"
            onClick={() => setOpen(false)}
          ></div>

          {/* Sidebar drawer */}
          <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col h-full shadow-lg">
            {/* Close button */}
            <button
              className="self-end p-3"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5 text-base-content opacity-70" />
            </button>

            <nav className="flex-1 p-4 space-y-1">
              <Link
                to="/"
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/" ? "btn-active" : ""
                }`}
              >
                <HomeIcon className="size-5 text-base-content opacity-70" />
                <span>Home</span>
              </Link>

              <Link
                to="/allchats"
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/friends" ? "btn-active" : ""
                }`}
              >
                <UsersIcon className="size-5 text-base-content opacity-70" />
                <span>Chats</span>
              </Link>

              <Link
                to="/settings"
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/settings" ? "btn-active" : ""
                }`}
              >
                <Settings className="size-5 text-base-content opacity-70" />
                <span>Settings</span>
              </Link>
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-base-300 mt-auto">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src={authUser?.profilePic || "/user.png"} alt="User Avatar" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{authUser?.fullName}</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="size-2 rounded-full bg-success inline-block" />
                    Online
                  </p>
                </div>
              </div>
            </div>
            {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
          </aside>
        </div>
      )}
    </>
  );
};

export default MobileSidebar;
