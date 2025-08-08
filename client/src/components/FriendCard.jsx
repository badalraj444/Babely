import { Link } from "react-router";
import { useState } from "react";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow max-w-sm">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 hover: grid-flow-row hover:grid-flow-dense"
            onClick={() => setIsModalOpen(true)}>
            <img className="rounded-full hover:scale-110" src={friend.profilePic || "/user.png"} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold text-accent truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-outline badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline btn-accent w-full">
          Message
        </Link>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={friend?.profilePic || (friend?.gender === "male" ? "/man.png" : "/woman.png")}
            alt="friend-avatar"
            className="h-96 w-96 rounded-full "
            onClick={(e) => e.stopPropagation()} // prevents closing on image click
          />
        </div>
      )}

    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
