import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { StreamChat } from "stream-chat";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";
import { HomeIcon, UsersIcon, Settings, LogOutIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const [totalUnread, setTotalUnread] = useState(0);
  const [chatClient, setChatClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });
  const { logoutMutation } = useLogout();
  useEffect(() => {
    const initStreamChat = async () => {
      if (!authUser || !tokenData?.token) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        if (client.userID !== authUser._id) {
          if (client.userID) await client.disconnectUser();

          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        const { total_unread_count } = await client.getUnreadCount();
        setTotalUnread(total_unread_count);

        client.on((event) => {
          if (
            event.type === "notification.message_new" ||
            event.type === "notification.mark_read" ||
            event.type === "notification.channel_mark_read" ||
            event.type === "message.read"
          ) {
            client.getUnreadCount().then((res) =>
              setTotalUnread(res.total_unread_count)
            );
          }
        });

        setChatClient(client);
      } catch (error) {
        console.error("Stream sidebar client error:", error);
      }
    };

    initStreamChat();

    return () => {
      if (chatClient) chatClient.off();
    };
  }, [authUser, tokenData]);

  return (
<>
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden [@media(min-width:1300px)]:flex flex-col h-screen sticky top-0">
      <div className="p-5 ">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/chat.png" alt="App Logo" className="size-9" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            {import.meta.env.VITE_APP_NAME}
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" ? "btn-active" : ""
            }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/allchats"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case relative ${currentPath === "/friends" ? "btn-active" : ""
            }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <div className="indicator">
            <span>Chats</span>
            {totalUnread > 0 && (
              <span className="badge badge-primary ml-2 -translate-x-0 -translate-y-1">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </div>

        </Link>


        <Link
          to="/settings"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/settings" ? "btn-active" : ""
            }`}
        >
          <Settings className="size-5 text-base-content opacity-70" />
          <span>Settings</span>
        </Link>
        {/* Logout button */}
        <button
  onClick={logoutMutation}
  className="btn btn-ghost justify-start w-full gap-3 px-3 normal-case hover:btn-active"
>
  <LogOutIcon className="size-5 text-base-content opacity-70" />
  <span>Log out</span>
</button>


      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
<div
              className="w-9 rounded-full hover:scale-110"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={authUser?.profilePic || "/user.png"}
                alt="User Avatar"
                rel="noreferrer"
              />
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
    </aside>
    {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={authUser?.profilePic || "/user.png"}
            alt="User Avatar Large"
            className="h-96 w-96 rounded-full "
            onClick={(e) => e.stopPropagation()} // prevents closing on image click
          />
        </div>
      )}
</>
  );
};

export default Sidebar;
