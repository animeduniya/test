import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTopTen } from "../utils/dataFetchers";
import { getImageUrl } from "../utils/corsProxy";

const TopTen = () => {
  const [topTen, setTopTen] = useState({ today: [], week: [], month: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTopTen = async () => {
      try {
        const data = await fetchTopTen();
        setTopTen(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTopTen();
  }, []);

  if (loading) return <div className="space-y-8">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-4">
        <div className="h-8 bg-gray-800 animate-pulse rounded-lg w-32"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, j) => (
            <div key={j} className="h-64 bg-gray-800 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    ))}
  </div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      {Object.entries(topTen).map(([period, animes]) => (
        <div key={period} className="space-y-4">
          <h2 className="text-2xl font-bold text-white capitalize">{period} Top 10</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {animes.map((anime) => (
              <Link
                key={anime.id}
                to={`/anime/${anime.id}`}
                className="block group"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={getImageUrl(anime.poster)}
                    alt={anime.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-lg font-semibold mb-1">{anime.name}</h3>
                      <p className="text-sm text-gray-300">#{anime.number}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopTen; 