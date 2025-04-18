import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHomeData } from "../utils/dataFetchers";
import { getImageUrl } from "../utils/corsProxy";

const Spotlight = () => {
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSpotlights = async () => {
      try {
        const data = await fetchHomeData();
        setSpotlights(data.spotlights || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSpotlights();
  }, []);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-64 bg-gray-800 animate-pulse rounded-lg"></div>
    ))}
  </div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {spotlights.map((anime) => (
        <Link
          key={anime.id}
          to={`/anime/${anime.id}`}
          className="block group"
        >
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={getImageUrl(anime.poster)}
              alt={anime.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-lg font-semibold mb-1">{anime.title}</h3>
                <p className="text-sm text-gray-300">{anime.japanese_title}</p>
                <p className="text-sm mt-2 line-clamp-2">{anime.description}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Spotlight; 