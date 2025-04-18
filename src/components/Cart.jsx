import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAnimeInfo } from "../utils/dataFetchers";
import { getImageUrl } from "../utils/corsProxy";

const Cart = ({ id }) => {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnime = async () => {
      try {
        const data = await fetchAnimeInfo(id);
        setAnime(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnime();
  }, [id]);

  if (loading) return <div className="h-64 bg-gray-800 animate-pulse rounded-lg"></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!anime) return null;

  return (
    <Link to={`/anime/${id}`} className="block group">
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
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Cart; 