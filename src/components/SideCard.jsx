import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHomeData } from "../utils/dataFetchers";
import { getImageUrl } from "../utils/corsProxy";

const SideCard = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchHomeData();
        setTrending(data.trending || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  if (loading) return <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-20 bg-gray-800 animate-pulse rounded-lg"></div>
    ))}
  </div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      {trending.map((anime) => (
        <Link
          key={anime.id}
          to={`/anime/${anime.id}`}
          className="flex items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <img
            src={getImageUrl(anime.poster)}
            alt={anime.title}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-white">{anime.title}</h3>
            <p className="text-sm text-gray-300">{anime.japanese_title}</p>
          </div>
          <div className="text-right">
            <p className="text-white">#{anime.number}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SideCard; 