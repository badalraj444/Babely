import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { searchUsersByUsername, sendFriendRequest, getOutgoingFriendReqs } from "../lib/api";
import { Search } from "lucide-react";
import UserCardModalView from "./UserCardModalView";
import { toast } from "react-hot-toast";

const SearchUsers = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const inputRef = useRef();

  // Debounce input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  // Fetch matching users
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["searchUsers", debouncedQuery],
    queryFn: () => searchUsersByUsername(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  // Fetch outgoing friend requests
  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const outgoingIds = new Set(outgoingFriendReqs.map((req) => req.recipient._id));

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success("Friend request sent");
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    }
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <div className="flex items-center gap-2">
        <img
          src="/search.png"
          alt="search"
          className="w-8 h-8 sm:w-10 sm:h-10 text-base-content opacity-70"
        />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="input input-bordered input-sm w-32 sm:w-48 focus:outline-none hover:scale-105"
          style={{ transition: "box-shadow 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #000000")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
        />

      </div>


      {/* Dropdown result list */}
      {showResults && debouncedQuery && (
        <div className="absolute mt-2 w-64 bg-base-100 shadow-lg rounded-md z-50 border border-base-300 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm opacity-60">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm opacity-60">No users found</div>
          ) : (
            results.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-2 hover:bg-base-200 cursor-pointer"
                onClick={() => {
                  setSelectedUser(user);
                  setShowResults(false);
                  setQuery(""); // Optional: clear search box
                }}
              >
                <img
                  src={user.profilePic || "/user.png"}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user.fullName}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for selected user */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UserCardModalView
              user={selectedUser}
              hasRequestBeenSent={outgoingIds.has(selectedUser._id)}
              onSendRequest={sendRequestMutation}
              isPending={isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
