import React, { useEffect, useState } from 'react';
import { fetchQtip } from '../utils/dataFetchers';
import { getImageUrl } from '../utils/corsProxy';
import { Link } from 'react-router-dom';

const Qtip = ({ id }) => {
  const [qtipData, setQtipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQtipData = async () => {
      try {
        const data = await fetchQtip(id);
        setQtipData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadQtipData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!qtipData) return null;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <img
          src={getImageUrl(qtipData.poster)}
          alt={qtipData.title}
          className="w-24 h-32 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-xl font-semibold text-white">{qtipData.title}</h3>
          <p className="text-gray-300 mt-2">{qtipData.description}</p>
          <div className="mt-4">
            <Link
              to={`/anime/${id}`}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qtip; 