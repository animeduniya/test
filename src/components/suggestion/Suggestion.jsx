import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import getSearch from "@/src/utils/getSearch.utils";

function Suggestion({ keyword, suggestionRefs, setIsFocused }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (keyword.trim()) {
        setLoading(true);
        try {
          const response = await getSearch(keyword, 1);
          setData(response.data.slice(0, 5));
          setHasFetched(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setData([]);
        setHasFetched(false);
      }
    };

    const debounceTimer = setTimeout(fetchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [keyword]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!data.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < data.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < data.length) {
            const selectedItem = data[selectedIndex];
            navigate(`/watch/${selectedItem.id}`);
            setIsFocused(false);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [data, selectedIndex, navigate, setIsFocused]);

  if (loading) {
    return (
      <div className="w-full py-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-devilish-crimson"></div>
      </div>
    );
  }

  if (!hasFetched || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {data.map((item, index) => (
        <Link
          key={index}
          to={`/watch/${item.id}`}
          ref={(el) => (suggestionRefs.current[index] = el)}
          className={`flex gap-x-4 items-start p-4 hover:bg-devilish-darker/80 transition-colors duration-300 group ${
            index === selectedIndex ? "bg-devilish-darker/80" : ""
          }`}
          onClick={() => setIsFocused(false)}
        >
          {item.poster && (
            <img
              src={item.poster}
              alt={item.title}
              className="w-12 h-16 object-cover rounded-md"
            />
          )}
          <div className="flex flex-col gap-y-[2px]">
            {item?.title && (
              <h1 className={`line-clamp-1 leading-5 font-bold text-[15px] ${
                index === selectedIndex ? "text-devilish-crimson" : ""
              } group-hover:text-devilish-crimson transition-colors duration-300`}>
                {item.title || "N/A"}
              </h1>
            )}
            {item?.japanese_title && (
              <h1 className="line-clamp-1 leading-5 text-[13px] font-light text-foreground/60">
                {item.japanese_title || "N/A"}
              </h1>
            )}
            {(item?.releaseDate || item?.showType || item?.duration) && (
              <div className="flex gap-x-[5px] items-center w-full justify-start mt-[4px]">
                <p className="leading-5 text-[13px] font-light text-foreground/60">
                  {item.releaseDate || "N/A"}
                </p>
                <span className="dot bg-foreground/60"></span>
                <p className="leading-5 text-[13px] font-medium group-hover:text-devilish-crimson transition-colors duration-300">
                  {item.showType || "N/A"}
                </p>
                <span className="dot bg-foreground/60"></span>
                <p className="leading-5 text-[13px] font-light text-foreground/60">
                  {item.duration || "N/A"}
                </p>
              </div>
            )}
          </div>
        </Link>
      ))}
      {!loading && hasFetched && (
        <Link
          className="w-full flex py-4 justify-center items-center bg-devilish-crimson hover:bg-devilish-crimson/90 transition-colors duration-300"
          to={`/search?keyword=${encodeURIComponent(keyword)}`}
          onClick={() => setIsFocused(false)}
        >
          <div className="flex w-fit items-center gap-x-2">
            <p className="text-[17px] font-light text-white">
              View all results
            </p>
            <FaChevronRight className="text-white text-[12px] font-black mt-[2px]" />
          </div>
        </Link>
      )}
    </div>
  );
}

export default Suggestion;
