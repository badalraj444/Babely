import { Link } from "react-router";
import { BellIcon } from "lucide-react";
import ThemeSwitch from "./ThemeSwitch";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import SearchUsers from "./SearchUsers";
import NavIcon from "./NavIcon";

const Navbar = () => {

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 5000, // every 5 seconds
  });


  const x = friendRequests?.incomingReqs.length || 0;
  const y = friendRequests?.acceptedReqs.length || 0;



  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-20 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full">
          {/* logo */}
          <div className="block [@media(min-width:1300px)]:hidden mr-5">
            <Link to="/" className="flex items-center gap-1">
              <img src="/chat.png" alt="App Logo" className="size-8" />
            </Link>
          </div>
          {/* Search Bar for users by username */}
          <SearchUsers />

          {/* NavIcon: already hidden on mobile, no changes needed */}
          <NavIcon />

          {/* Notification bell - visible on all screens */}
          <div className="flex items-center  gap-2 sm:gap-4 ml-auto sm:block -translate-x-5">
            <Link to="/notifications">
              <div className="indicator">
                <button className="btn btn-ghost btn-circle">
                  <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                </button>
                {!isLoading && (x + y > 0) && (
                  <span className="badge badge-primary ml-2 -translate-x-8 translate-y-0">
                    {x + y}
                  </span>
                )}
              </div>
            </Link>
          </div>
          {/* Theme Switch */}
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
