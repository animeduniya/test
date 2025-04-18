import { useEffect, useState } from "react";
import { fetchQtip } from "../utils/dataFetchers";

const Qtip = ({ id }) => {
  const [qtip, setQtip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQtip = async () => {
      try {
        const data = await fetchQtip(id);
        setQtip(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadQtip();
  }, [id]);

  if (loading) return <div className="p-4 bg-gray-800 animate-pulse rounded-lg"></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!qtip) return null;

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h3 className="text-xl font-semibold mb-2">{qtip.title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400">Rating</p>
          <p>{qtip.rating}</p>
        </div>
        <div>
          <p className="text-gray-400">Quality</p>
          <p>{qtip.quality}</p>
        </div>
        <div>
          <p className="text-gray-400">Sub Count</p>
          <p>{qtip.subCount}</p>
        </div>
        <div>
          <p className="text-gray-400">Dub Count</p>
          <p>{qtip.dubCount}</p>
        </div>
        <div>
          <p className="text-gray-400">Episode Count</p>
          <p>{qtip.episodeCount}</p>
        </div>
        <div>
          <p className="text-gray-400">Type</p>
          <p>{qtip.type}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Description</p>
        <p className="mt-1">{qtip.description}</p>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Japanese Title</p>
        <p className="mt-1">{qtip.japaneseTitle}</p>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Synonyms</p>
        <p className="mt-1">{qtip.Synonyms}</p>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Aired Date</p>
        <p className="mt-1">{qtip.airedDate}</p>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Status</p>
        <p className="mt-1">{qtip.status}</p>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Genres</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {qtip.genres.map((genre, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700 rounded">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Qtip; 