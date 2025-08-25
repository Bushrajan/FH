import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { apiAuthHandle } from '../config/apiAuthHandle';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const goto = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // const { data } = await axios.get(`${import.meta.env.BACKEND_DEPLOY_URL}/profile`, { email })
            const { data } = await apiAuthHandle.post(`/forgetPassword`, { email })
            setEmail("");
            toast.success(data.message);
            setLoading(false);

        } catch (error) {
            console.log(error.response?.data);
            toast.error(error.response?.data?.message || 'Reset password failed');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Video */}
            <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
                <source src="/background.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 z-10 " />

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="max-w-md w-full space-y-8 z-40 z-40 border border-green-500 lg:p-5 p-1 rounded">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Forget Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                            remembered your password? Sign In
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'wait...' : 'Reset'}
                        </button>

                        <div className='mt-3 text-center'>
                            <Link to="/login" className="font-medium mt-5 text-green-600 hover:text-green-500">
                                Go back to login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgetPassword