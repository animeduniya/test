import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSearchSuggestions } from "../utils/dataFetchers";
import { getImageUrl } from "../utils/corsProxy";

const Suggestion = ({ keyword }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const data = await fetchSearchSuggestions(keyword);
        setSuggestions(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      loadSuggestions();
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  }, [keyword]);

  if (!keyword) return null;
  if (loading) return <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-800 animate-pulse rounded-lg"></div>
    ))}
  </div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!suggestions.length) return null;

  return (
    <div className="space-y-2">
      {suggestions.map((anime) => (
        <Link
          key={anime.id}
          to={`/anime/${anime.id}`}
          className="flex items-center p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <img
            src={getImageUrl(anime.poster)}
            alt={anime.title}
            className="w-10 h-10 object-cover rounded"
          />
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-white">{anime.title}</h3>
            <p className="text-xs text-gray-300">{anime.japanese_title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Suggestion; 