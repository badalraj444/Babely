import  { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle} from 'lucide-react';
import { Link } from 'react-router';
import { signup } from '../lib/api';

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    onError: (error) => {
      toast.error(error.response?.data?.message || "Signup failed");
    },
  })
  const handleSignup = (e) => {
    e.preventDefault();
    mutate(signupData);
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" >
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        {/* signup form- left side */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          {/* logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <MessageCircle className="w-8 h-8 text-primary" />

            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              {import.meta.env.VITE_APP_NAME}
            </span>
          </div>
          {/* error message */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}
          {/* signup form */}
          <div className="w-full">
            <form className='flex flex-col gap-4'>
              <div className='space-y-3'>
                <div>
                  <h2 className='text-2xl font-bold'>Sign Up</h2>
                  <p className='text-sm text-gray-500'>Create a new account to start chatting!</p>
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Full Name</span>
                  </label>
                  <input
                    type='text'
                    placeholder='Enter your full name'
                    className='input input-bordered w-full'
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                  <input
                    type='email'
                    placeholder='Enter your email'
                    className='input input-bordered w-full'
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Password</span>
                  </label>
                  <input
                    type='password'
                    placeholder='Enter your password'
                    className='input input-bordered w-full'
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  />
                </div>
                <button className='btn btn-primary w-full' onClick={handleSignup}>
                  {isPending ? "creating account..." : "sign up"}
                </button>
                <div className='text-center mt-4'>
                  <p className='text-sm text-gray-500'>
                    Already have an account?{" "}
                    <Link to="/login" className='text-primary font-semibold hover:underline'>
                      Log In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/videoCall.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SignUpPage

// to do: make screen size responsive

