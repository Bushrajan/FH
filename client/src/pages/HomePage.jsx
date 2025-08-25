 
import { Link } from 'react-router-dom'; 

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to <span className="text-green-600">WorkApp</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Share what in your Mind, discover amazing content, and connect with writers from around the world.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              {/* Blog link removed */}
              <Link
                to="/"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Goto Board
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                to="/"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>


        {/* Recent Activity Section */}
        {/* Blog recent activity section removed */}
      </div>
    </div>
  );
};

export default HomePage;