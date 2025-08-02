import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, UserRoundPen, KeyRound, Trash, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteAccount } from "../lib/api";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";

const SettingsPage = () => {
  const [password, setPassword] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: mutateDelete, isPending } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Account deleted successfully.");
      navigate("/");
    },
    onError: () => {
      setDeleteErrorMsg("Could not delete account.");
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    setDeleteErrorMsg("");
    mutateDelete({ password });
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="size-10 text-primary" />
        <span className="ml-2 text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
          Settings
        </span>
      </div>
      <hr className="my-4" />

      <Link to="/edit-profile" className="flex items mt-10 group">
        <UserRoundPen className="size-8 text-primary group-hover:scale-110 transition-transform duration-200" />
        <span className="ml-2 transition-colors duration-200 hover:text-green-300">
          Edit Profile
        </span>
      </Link>

      <div className="flex items mt-10 group">
        <KeyRound className="size-8 text-primary group-hover:scale-110 transition-transform duration-200" />
        <button className="ml-2 transition-colors duration-200 hover:text-violet-600">
          Change password
        </button>
      </div>

      <div className="flex items mt-10 group">
        <Trash className="size-8 text-primary group-hover:scale-110 transition-transform duration-200" />
        <button
          className="ml-2 transition-all duration-200 hover:text-red-800 hover:opacity-40"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isPending}
        >
          Delete account
        </button>
      </div>

      {isDeleteModalOpen && (
  <dialog className="modal modal-open">
    <div className="modal-box">
      <div className="flex items-center gap-2 text-error mb-2">
        <AlertTriangle className="w-5 h-5" />
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
      </div>

      <p className="py-2 text-sm">
        This action is <strong>irreversible</strong>. Please enter your password to confirm:
      </p>

      <form onSubmit={handleDelete} className="space-y-2 mt-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="input input-bordered w-full"
          required
        />

        {deleteErrorMsg && (
          <p className="text-error text-sm">{deleteErrorMsg}</p>
        )}

        <div className="modal-action">
          <button
            type="button"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setPassword("");
              setDeleteErrorMsg("");
            }}
            className="btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-error text-white"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </form>
    </div>
  </dialog>
)}

    </div>
  );
};

export default SettingsPage;
