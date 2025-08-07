import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, Search } from "lucide-react";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {  getFriendRequests } from "../lib/api";
import SearchUsers from "./SearchUsers";

const Navbar = () => {

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
     refetchInterval: 5000, // every 5 seconds
  });
  

  const x = friendRequests?.incomingReqs.length || 0;
  const y = friendRequests?.acceptedReqs.length || 0;
  const { authUser } = useAuthUser();

  const [isModalOpen, setIsModalOpen] = useState(false);


  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-20 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
         

          {/* Search Bar for users by username */}
          <SearchUsers/>

          {/* add static image(s) for feel of app , connecting people with languages */}

          <div className="hidden md:flex items-center gap-5 sm:gap-4 ml-auto">
            <img src="/japanese.png" alt="Connecting People" className="w-8 h-8" />
            <img src="/english.png" alt="Connecting People" className="w-8 h-8" />
            <img src="/hindi.png" alt="Connecting People" className="w-8 h-8" />
            <img src="/spanish.png" alt="Connecting People" className="w-8 h-8" />
            <img src="/french.png" alt="Connecting People" className="w-8 h-8" />
            <img src="/german.png" alt="Connecting People" className="w-8 h-8" />

            <img src="/chinese.png" alt="Connecting People" className="w-8 h-8" />
            <img src="/portuguese.png" alt="Connecting People" className="w-8 h-8" />
            <img src="/korean.png" alt="Connecting People" className="w-8 h-8" />
            <img src="/russian.png" alt="Connecting People" className="w-8 h-8" />
            <img src="/arabic.png" alt="Connecting People" className="w-8 h-8" />

          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to="/notifications">
              <div className="indicator">
                <button className="btn btn-ghost btn-circle">
                  <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                </button>
                {!isLoading && (x + y > 0) && (
                  <span className="badge badge-primary ml-2 -translate-x-8 translate-y-0">{x+y}</span>
                )}
              </div>
            </Link>

          </div>

          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full  hover:scale-110 "
              onClick={() => setIsModalOpen(true)}>
              <img src={authUser?.profilePic || "/user.png"} alt="User Avatar" rel="noreferrer" />
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
            className="h-96 w-96 rounded-full "
            onClick={(e) => e.stopPropagation()} // prevents closing on image click
          />
        </div>
      )}

    </nav>
  );
};
export default Navbar;
