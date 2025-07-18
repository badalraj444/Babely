
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings, UserRoundPen, KeyRound, Trash } from "lucide-react"
import { toast } from "react-hot-toast";
import useAuthUser from '../hooks/useAuthUser';
import { deleteAccount } from '../lib/api';
import { Link } from "react-router";
const SettingsPage = () => {
    const { authUser } = useAuthUser(); //will be used to find profilepic url to delete from cloudinary

    const queryClient = useQueryClient();
    const { mutate: mutateDelete, isPending, error: deleteError } = useMutation({
        mutationFn: deleteAccount, // todo: some non essential functions incomplete 
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        onError: (error) => {
            toast.error(error.response?.data?.message || "delete failed");
        },
    })
    const handleDelete = (e) => {
        e.preventDefault();
        mutateDelete();
    }

    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <Settings className=" size-10 text-primary" />
                <span className="ml-2 text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    Settings
                </span>
            </div>
            <hr className="my-4" />
            {/* Add your settings components here */}

            <Link to="/edit-profile" className="flex items mt-10 group">
                <UserRoundPen className="size-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                <span className="ml-2  transition-colors duration-200 hover:text-green-300">
                    Edit Profile
                </span>
            </Link>


            <div className="flex items mt-10 group">
                <KeyRound className="size-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                <button className="ml-2  transition-colors duration-200 hover:text-violet-600 ">
                    Change password
                </button>
            </div>

            <div className="flex items mt-10 group">
                <Trash className="size-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                <button
                    className="ml-2  transition-all duration-200 hover:text-red-800 hover:opacity-40"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    Delete account
                </button>
            </div>

            {/* error message */}
            {deleteError && (
                <div className="alert alert-error mb-4">
                    <span>{error.response.data.message}</span>
                </div>)}
        </div>
    )
}

export default SettingsPage
//todo: change password, profile pic implementations, add hovering over to buttons, add functions to buttons