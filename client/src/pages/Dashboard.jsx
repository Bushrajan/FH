import { useState, useEffect, useRef } from 'react';
import { FaUsers, FaChartLine, FaCog, FaHeart, FaUserShield } from 'react-icons/fa';
import { getUser, setUser, removeUser, } from '../utils/auth';
import { apiAuthHandle } from '../config/apiAuthHandle.js';
import apiUploadHandle from '../config/apiUploadHandle.js';
import toast from 'react-hot-toast';

// Blog API removed
import { useNavigate } from 'react-router-dom';
import { ImProfile } from "react-icons/im";
import { ImSwitch } from "react-icons/im";

import UserProfile from '../dashboard/UserDashboard/UserProfile';
import UserFavorites from '../dashboard/UserDashboard/UserFavorites';
import UserSettings from '../dashboard/UserDashboard/UserSettings';
import AdminProfile from '../dashboard/AdminDashboard/AdminProfile';
import AdminSettings from '../dashboard/AdminDashboard/AdminSettings';
import AdminUsers from '../dashboard/AdminDashboard/AdminUsers';
import HijabStyle from './HijabStyle.jsx';
import Stats from '../dashboard/AdminDashboard/Stats.jsx';

const Dashboard = () => {

  const currentUser = getUser()

  const goto = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // Close sidebar on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // logout user (self)
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiAuthHandle.post('/logout', {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);

      removeUser()

      setTimeout(() => {
        goto('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };


  // update user (self)
  const [updateUser, setUpdateUser] = useState({
    username: currentUser.name || '',
    useremail: currentUser.email || '',
    linkedin: currentUser.linkedin || '',
    portfolio: currentUser.portfolio || '',
    instagram: currentUser.instagram || '',
    github: currentUser.github || '',
    description: currentUser.description || '',
    field: currentUser.field || '',
    image: null
  });

  const updateImage = useRef(null);

  const handleUserSettingsChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateUser((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  // UpdateProfile 
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      console.log(token);

      const formData = new FormData();

      // 1. Image upload first (if selected)
      let imageUrl = null;
      if (updateUser.image) {
        const imageForm = new FormData();
        imageForm.append('file', updateUser.image); // assuming updateUser.image is a File object

        const uploadRes = await apiUploadHandle.post('/', imageForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrl = uploadRes?.data?.url;
      }

      // 2. Append all fields to formData
      formData.append('name', updateUser.username);
      formData.append('email', updateUser.useremail);
      formData.append('linkedin', updateUser.linkedin);
      formData.append('portfolio', updateUser.portfolio);
      formData.append('instagram', updateUser.instagram);
      formData.append('github', updateUser.github);
      formData.append('description', updateUser.description);
      formData.append('field', updateUser.field);

      if (imageUrl) {
        formData.append('profileImage', imageUrl); // your backend must support this
      }

      // 3. Send update request to backend
      const { data } = await apiAuthHandle.put('/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // 4. Save updated user to localStorage and state
      setUser(data?.user); // or whatever your backend returns
      localStorage.setItem('user', JSON.stringify(data?.user));

      toast.success(data.message || 'Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Profile update failed');
    }
  };

  // Sidebar navigation
  const userNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'profile', label: 'Profile', icon: ImProfile },
    { id: 'favorites', label: 'Favorites', icon: FaHeart },
    { id: 'settings', label: 'Settings', icon: FaCog },
    { id: 'login', label: 'Login', icon: FaUserShield },
    { id: 'logout', label: 'Logout', icon: ImSwitch },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'profile', label: 'Profile', icon: ImProfile },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'settings', label: 'Settings', icon: FaCog },
    { id: 'login', label: 'Login', icon: FaUserShield },
    { id: 'logout', label: 'Logout', icon: ImSwitch },
  ];

  const navItems = currentUser.role === 'admin' ? adminNavItems : userNavItems;

  const renderContent = () => {
    if (currentUser.role === 'admin') {
      switch (activeTab) {
        case 'profile':
          return <AdminProfile currentUser={currentUser} />;
        case 'home': return goto('/home');
        case 'login': return goto('/');
        case 'dashboard':
          return (
            <div className="p-6">
              <Stats />   {/* Stats Section */}
              <AdminUsers />   {/* User Table */}
            </div>
          );
        case 'users': return <AdminUsers />
        case 'settings':
          return <AdminSettings updateUser={updateUser} updateImage={updateImage} handleUserSettingsChange={handleUserSettingsChange} handleImageChange={handleImageChange} handleUpdateProfile={handleUpdateProfile} handleLogout={handleLogout} currentUser={currentUser} />;
        case 'logout': handleLogout();
          return null;
        default:
          return <AdminDashboard analytics={analytics} />;
      }
    }
    else {
      switch (activeTab) {
        case 'login': return goto('/');
        case 'dashboard': return <HijabStyle />
        case 'profile': return <UserProfile currentUser={currentUser} />;
        case 'favorites': return <UserFavorites />;
        case 'settings':
          return <UserSettings
            updateUser={updateUser}
            updateImage={updateImage}
            handleUserSettingsChange={handleUserSettingsChange}
            handleImageChange={handleImageChange}
            handleUpdateProfile={handleUpdateProfile}
            handleLogout={handleLogout}
            currentUser={currentUser} />;
        case 'logout': handleLogout();
          return null;
        default:
          return <UserProfile currentUser={currentUser} />;
      }
    }
  };

 

  return (

    <div className="relative min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 z-0"></div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col z-10">

        {/* Header */}
        <div className="bg-green-100 shadow-sm border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900 capitalize md:flex hidden">
                {currentUser.role} Dashboard
              </h2>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {/* same button open/close ke liye */}
                {sidebarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={currentUser.profileImage || '/user.avif'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-900">{currentUser.name}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 lg:p-6 overflow-y-auto no-scrollbar">
          {renderContent()}
        </div>
      </div>


      {/* Sidebar */}
      <div
        className={`
      fixed top-0 right-0 h-full z-40
      transition-all duration-300 ease-in-out
      ${sidebarOpen ? "w-60" : "w-0"}
      bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 overflow-hidden
    `}
      >
        {/* Profile + Navigation */}
        <div className="py-6 px-2">
          <div className="flex flex-col items-center justify-center space-y-2">
            <img
              src={currentUser.profileImage || "/user.avif"}
              alt="Profile"
              className="rounded-full w-[80px] h-[80px] border-2 border-primary-100 shadow-md object-cover"
            />
            {sidebarOpen && (
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <span><strong> Name :</strong></span> {currentUser.name}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <span><strong>Email :</strong></span> {currentUser.email}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  <span><strong> Role :</strong></span> {currentUser.role}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 space-y-1 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${activeTab === item.id
                  ? "bg-green-100 border border-green-600 text-green-700"
                  : "text-gray-600 dark:text-gray-300 hover:bg-green-50"
                  }`}
                title={!sidebarOpen ? item.label : ""}
              >
                <div className="flex justify-center items-center w-6">
                  <Icon className="text-xl" />
                </div>
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </div>



  );
};

export default Dashboard;