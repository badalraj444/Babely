import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUsersByUsername } from "../lib/api"; // create this in your API file
import { Link } from "react-router";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef();

  // Debounce input: delay actual query firing by 300ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  // Fetch users based on search input
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["searchUsers", debouncedQuery],
    queryFn: () => searchUsersByUsername(debouncedQuery),
    enabled: !!debouncedQuery, // only run query when input is non-empty
  });

  // Hide dropdown on outside click
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
        <img src="/search.png" alt="search" sizes="10" className="w-10 h-10 text-base-content opacity-70"/>

        <input
          type="text"
          placeholder="users/language..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="input input-bordered input-sm w-48 focus:outline-none hover:scale-105"
        />
      </div>

      {showResults && debouncedQuery && (
        <div className="absolute mt-2 w-64 bg-base-100 shadow-lg rounded-md z-50 border border-base-300 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm opacity-60">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm opacity-60">No users found</div>
          ) : (
            results.map((user) => (
              <Link
                to={`/profile/${user._id}`} // Update route if needed
                key={user._id}
                onClick={() => setShowResults(false)}
                className="flex items-center gap-3 p-2 hover:bg-base-200 cursor-pointer"
              >
                <img
                  src={user.profilePic || "/user.png"}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user.fullName}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
