import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "./FriendCard"; // you already export this

const UserCardModalView = ({ user, hasRequestBeenSent, onSendRequest, isPending }) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300 w-[350px]">
      <div className="card-body p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="avatar size-16 rounded-full">
            <img className="rounded-full" src={user.profilePic || "/user.png"} alt={user.fullName} />
          </div>

          <div>
            <h3 className="font-semibold text-secondary text-lg">{user.fullName}</h3>
            {user.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {user.location}
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1.5">
          <span className="badge badge-outline badge-secondary">
            {getLanguageFlag(user.nativeLanguage)}
            {capitialize(user.nativeLanguage)}
          </span>
          <span className="badge badge-outline">
            {getLanguageFlag(user.learningLanguage)}
            {capitialize(user.learningLanguage)}
          </span>
        </div>

        {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

        {/* Friend Request Button */}
        <button
          className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-secondary"}`}
          onClick={() => onSendRequest(user._id)}
          disabled={hasRequestBeenSent || isPending}
        >
          {hasRequestBeenSent ? (
            <>
              <CheckCircleIcon className="size-4 mr-2" />
              Request Sent
            </>
          ) : (
            <>
              <UserPlusIcon className="size-4 mr-2" />
              Send Friend Request
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCardModalView;
