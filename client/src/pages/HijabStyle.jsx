import { useEffect, useState } from 'react';
import HijabCard from '../components/HijabCard';
import axios from 'axios';

const HijabStyle = () => {
  const [styles, setStyles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4); // Initial 4 cards
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const { data } = await axios.get('https://final-hackathon-server-ten.vercel.app/api/hijab');
        setStyles(data);
      } catch (err) {
        setError('Failed to load hijab styles');
        console.error('Hijab styles fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4); // Load 4 more
  };

  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
      <p className="mt-4 text-sm text-white ">Loading . . . </p>
    </div>
  }

  if (error) {
    return <div className="p-4 text-green-100  text-white fs-3 text-center font-semibold flex items-center justify-center">{error}</div>;
  }

  if (!styles.length) {
    return <div className="p-4 text-green-100  text-white fs-3 text-center font-semibold flex items-center justify-center">No hijab styles found.</div>;
  }

  return (
    <div className="lg:p-4">
      {/* Welcome Box */}
      <div className="my-16">
        <div className="bg-white dark:bg-gray-800 lg:w-[600px] mx-auto w-[300px] shadow-lg rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to <span className="text-green-600">Hijabi Gallery</span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Explore and manage your dashboard with ease 🌸
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
           Write Reviews on our collection ... 
          </p>
        </div>
      </div>


      <div className="flex flex-wrap p-2 gap-6 justify-center">
        {styles.slice(0, visibleCount).map(style => (
          <HijabCard key={style._id} style={style} />
        ))}
      </div>

      {visibleCount < styles.length && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default HijabStyle;
