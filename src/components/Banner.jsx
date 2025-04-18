import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHomeData } from "../utils/dataFetchers";
import { getImageUrl } from "../utils/corsProxy";

const Banner = () => {
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

  if (loading) return <div className="h-[500px] bg-gray-800 animate-pulse"></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!spotlights.length) return null;

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {spotlights.map((anime) => (
        <div
          key={anime.id}
          className="absolute inset-0 transition-opacity duration-500"
        >
          <img
            src={getImageUrl(anime.poster)}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent">
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h2 className="text-4xl font-bold mb-2">{anime.title}</h2>
              <p className="text-xl mb-4">{anime.japanese_title}</p>
              <p className="text-gray-300 mb-4 line-clamp-3">
                {anime.description}
              </p>
              <Link
                to={`/anime/${anime.id}`}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner; 