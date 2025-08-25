import { useEffect, useState } from 'react';

const UserFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = localStorage.getItem('favorites');
    if (favs) {
      try {
        setFavorites(JSON.parse(favs));
      } catch {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, []);

  return (
    <div className="lg:p-6 ">
      <h2 className="text-2xl font-bold text-white mb-6">💗 Favorite Hijab Styles</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorites found.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="bg-white text-gray-500 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src={fav.profileImage}
                alt={fav.name}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Name: {fav.name}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Description: {fav.description}
                </p>
 
                 
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFavorites;
