import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { StreamChat } from "stream-chat";
import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import ChatLoader from "../components/ChatLoader";
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const AllChats = () => {
  const { authUser } = useAuthUser();
  const [chatClient, setChatClient] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {

      if (!authUser || !tokenData?.token) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        // if (chatClient) { //not sure if this block is needed here, or if needed is it at correct place
        //   console.log("User already connected");
        //   return;
        // }

        if (client.userID && client.userID === authUser._id) {
          console.log("User already connected to StreamChat");
        } else {
          // Always disconnect before connecting a new user
          if (client.userID) {
            await client.disconnectUser();
          }

          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        const filters = {
          type: "messaging",
          members: { $in: [authUser._id] },
        };

        const sort = [{ last_message_at: -1 }];
        const result = await client.queryChannels(filters, sort, {
          watch: true,
          state: true,
        });

        setChatClient(client);
        setChannels(result);

        client.on("message.new", (event) => {
          setChannels((prev) => [...prev]); // trigger re-render
        });

      } catch (error) {
        console.error("Error initializing chat client:", error);
        toast.error("Could not load chats.");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      chatClient?.disconnectUser();
    };
  }, [authUser, tokenData]);

  // useEffect(() => {
  //   let client;

  //   const initChat = async () => {
  //     if (!authUser || !tokenData?.token) return;

  //     try {
  //       client = StreamChat.getInstance(STREAM_API_KEY);

  //       await client.connectUser(
  //         {
  //           id: authUser._id,
  //           name: authUser.fullName,
  //           image: authUser.profilePic,
  //         },
  //         tokenData.token
  //       );

  //       const filters = {
  //         type: "messaging",
  //         members: { $in: [authUser._id] },
  //       };

  //       const sort = [{ last_message_at: -1 }];

  //       const fetchChannels = async () => {
  //         const result = await client.queryChannels(filters, sort, {
  //           watch: true,
  //           state: true,
  //         });
  //         setChannels(result);
  //       };

  //       await fetchChannels();
  //       setChatClient(client);

  //       // Update when new message in existing channel
  //       client.on("message.new", () => {
  //         setChannels((prev) => [...prev]); // simple rerender
  //       });

  //       // Handle new channel created from first-time message
  //       client.on("notification.message_new", async () => {
  //         console.log("New message in new channel received");
  //         await fetchChannels();
  //       });

  //     } catch (error) {
  //       console.error("Error initializing chat client:", error);
  //       toast.error("Could not load chats.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   initChat();

  //   return () => {
  //     if (client) {
  //       client.disconnectUser();
  //       client.off("message.new");
  //       client.off("notification.message_new");
  //     }
  //   };
  // }, [authUser, tokenData]);




  if (loading) return <ChatLoader />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Chats</h2>
      <div className="space-y-4">
        {channels.length === 0 ? (
          <p className="text-gray-500">No conversations yet.</p>
        ) :
          (
            channels.map((channel) => {

              const members = Object.values(channel.state?.members || {});
              const otherUser = members.find((m) => m?.user?.id !== authUser._id)?.user;
              console.log("other user:", otherUser);

              if (!otherUser) {
                return null; // skip rendering this channel if other user is not present
              }

              const unreadCount = channel.countUnread();
              const lastMessage = channel.state.messages?.[channel.state.messages.length - 1];


              return (
                <Link
                  key={channel.id}
                  to={`/chat/${otherUser.id}`}
                  className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-3 rounded-lg shadow transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={otherUser.image || "/user.png"}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{otherUser.name}</p>
                      <p className="text-sm text-gray-600 truncate max-w-[250px]">
                        {lastMessage?.text || "No messages yet."}
                      </p>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {unreadCount}
                    </div>
                  )}
                </Link>
              );
            })

          )
        }
      </div>
    </div>
  );
};

export default AllChats;
