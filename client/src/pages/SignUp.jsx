import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { set_verification_Email, setToken, setUser } from '../utils/auth';
import { apiAuthHandle } from '../config/apiAuthHandle.js';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      console.log(error);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      console.log(error);

      return;
    }

    setLoading(true);

    try {
      const response = await apiAuthHandle.post(`/register`, formData);

      set_verification_Email(formData.email);
      setToken(response.data.token);//yaha localStorage ma token store hoga
      setUser(response.data.user);//yaha localStorage ma user store hoga
      console.log(response);

      setLoading(false);

      toast.success(response.data.message);

      setTimeout(() => {

        navigate('/verify-otp', {
          state: {
            email: formData.email,
            message: response.data.message,
            otp: response.data.otp
          }
        });
      }, 2000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      console.log(error.response?.data);

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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required

                  className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;