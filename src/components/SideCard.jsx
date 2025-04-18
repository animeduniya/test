import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHomeData } from '../utils/dataFetchers';
import { getImageUrl } from '../utils/corsProxy';

const SideCard = () => {
  const [popularAnime, setPopularAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPopularAnime = async () => {
      try {
        const data = await fetchHomeData();
        setPopularAnime(data.popular || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadPopularAnime();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!popularAnime.length) return null;

  return (
    <div className="space-y-4">
      {popularAnime.map((anime) => (
        <Link 
          key={anime.id} 
          to={`/anime/${anime.id}`}
          className="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <img
            src={getImageUrl(anime.poster)}
            alt={anime.title}
            className="w-16 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-white font-semibold line-clamp-2">{anime.title}</h3>
            <p className="text-gray-400 text-sm">{anime.type}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SideCard; 