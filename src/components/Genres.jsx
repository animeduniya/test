import React, { useEffect, useState } from 'react';
import { fetchHomeData } from '../utils/dataFetchers';
import { Link } from 'react-router-dom';

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchHomeData();
        setGenres(data.genres || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!genres.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <Link
          key={genre.id}
          to={`/genre/${genre.id}`}
          className="px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          {genre.name}
        </Link>
      ))}
    </div>
  );
};

export default Genres; 