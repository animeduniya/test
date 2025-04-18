import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategory } from '../utils/dataFetchers';
import { getImageUrl } from '../utils/corsProxy';

const CategoryCard = ({ category, page = 1 }) => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategoryAnime = async () => {
      try {
        const data = await fetchCategory(category, page);
        setAnimeList(data.anime || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadCategoryAnime();
  }, [category, page]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!animeList.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {animeList.map((anime) => (
        <Link 
          key={anime.id} 
          to={`/anime/${anime.id}`}
          className="group"
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <img
              src={getImageUrl(anime.poster)}
              alt={anime.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-white text-lg font-semibold">{anime.title}</h3>
                <p className="text-gray-300 text-sm">{anime.type}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryCard; 