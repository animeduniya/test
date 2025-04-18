import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHistory, FaTrash } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

function History() {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load watch history from localStorage
    const history = JSON.parse(localStorage.getItem("continueWatching") || "[]");
    setWatchHistory(history);
    setLoading(false);
  }, []);

  const removeFromHistory = (episodeId) => {
    const updatedHistory = watchHistory.filter(
      (item) => item.episodeId !== episodeId
    );
    setWatchHistory(updatedHistory);
    localStorage.setItem("continueWatching", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setWatchHistory([]);
    localStorage.setItem("continueWatching", JSON.stringify([]));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-devilish-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-devilish-crimson"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-devilish-dark pt-20 pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-x-2">
            <FaHistory className="text-devilish-crimson text-2xl" />
            <h1 className="text-devilish-crimson text-2xl font-bold">Watch History</h1>
          </div>
          {watchHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-x-2 bg-devilish-darker hover:bg-devilish-crimson/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <FaTrash className="text-devilish-crimson" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {watchHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaHistory className="text-devilish-crimson/50 text-6xl mb-4" />
            <h2 className="text-white text-xl mb-2">No watch history</h2>
            <p className="text-gray-400 text-center max-w-md">
              Your watch history will appear here. Start watching anime to build your history.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchHistory.map((item) => (
              <div
                key={item.episodeId}
                className="bg-devilish-darker rounded-lg overflow-hidden shadow-lg hover:shadow-devilish-crimson/20 transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                      to={`/watch/${item.id}?ep=${item.episodeId}`}
                      className="bg-devilish-crimson text-white p-3 rounded-full hover:bg-devilish-blood transition-colors duration-300"
                    >
                      <FontAwesomeIcon icon={faPlay} className="text-xl" />
                    </Link>
                  </div>
                  <button
                    onClick={() => removeFromHistory(item.episodeId)}
                    className="absolute top-2 right-2 bg-devilish-darker/80 text-white p-2 rounded-full hover:bg-devilish-crimson transition-colors duration-300"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Episode {item.episodeNum}
                  </p>
                  {item.japanese_title && (
                    <p className="text-gray-500 text-xs line-clamp-1">
                      {item.japanese_title}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History; 