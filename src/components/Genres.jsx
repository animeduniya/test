import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHomeData } from "../utils/dataFetchers";

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchHomeData();
        setGenres(data.genres || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (loading) return <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-800 animate-pulse rounded-lg"></div>
    ))}
  </div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {genres.map((genre) => (
        <Link
          key={genre}
          to={`/genre/${genre.toLowerCase()}`}
          className="block p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-center text-white transition-colors"
        >
          {genre}
        </Link>
      ))}
    </div>
  );
};

export default Genres; 