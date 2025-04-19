import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning, faMicrophone, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import useToolTipPosition from "@/src/hooks/useToolTipPosition";
import Qtip from "../qtip/Qtip";

function Sidecard({ data, label, className, limit }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  
  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredItem, data);

  // Parallax effect for the header
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollY = window.scrollY;
        const offset = scrollY * 0.3;
        containerRef.current.style.transform = `translateY(${offset}px)`;
        setIsScrolling(scrollY > 10);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (item, index) => {
    const timeout = setTimeout(() => {
      setHoveredItem(item.id + index);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setHoveredItem(null);
  };

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const displayedData = limit
    ? data.slice(0, limit)
    : showAll
    ? data
    : data.slice(0, 6);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a2a5a] via-[#2B2A3C] to-[#1a1a2e] opacity-90"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      
      <div className="relative z-10">
        {/* Floating header with glass morphism */}
        <div 
          ref={containerRef}
          className={`sticky top-0 z-20 p-6 backdrop-blur-md transition-all duration-300 ${
            isScrolling ? 'bg-[rgba(43,42,60,0.7)] shadow-lg' : 'bg-transparent'
          }`}
        >
          <h1 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff7eb3] to-[#ff758c]">
            {label}
          </h1>
          <div className="w-16 h-1 mt-2 bg-gradient-to-r from-[#ff7eb3] to-[#ff758c] rounded-full"></div>
        </div>

        {/* Content with 3D depth effect */}
        <div className="p-6 pt-0">
          <div className="grid gap-5">
            {data && displayedData.map((item, index) => (
              <div
                key={index}
                className="relative"
                ref={(el) => (cardRefs.current[index] = el)}
              >
                <div 
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{
                    borderBottom: index + 1 < displayedData.length 
                      ? "1px solid rgba(255, 255, 255, 0.05)" 
                      : "none",
                  }}
                >
                  <div className="relative flex-shrink-0 overflow-hidden rounded-lg w-[70px] h-[85px]">
                    <div className="relative w-full h-fit">
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-sm font-medium truncate">{item.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/${item.id}`}
                      className="block text-lg font-semibold text-white transition-colors duration-200 hover:text-[#ffbade] truncate"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                      {language === "EN" ? item.title : item.japanese_title}
                    </Link>
                    
                    {/* Metadata with animated tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {item.tvInfo?.sub && (
                        <div className="flex items-center px-2 py-1 space-x-1 text-xs font-bold text-black transition-all duration-200 transform bg-[#B0E3AF] rounded-lg group-hover:scale-105">
                          <FontAwesomeIcon icon={faClosedCaptioning} />
                          <span>{item.tvInfo.sub}</span>
                        </div>
                      )}
                      {item.tvInfo?.dub && (
                        <div className="flex items-center px-2 py-1 space-x-1 text-xs font-bold text-black transition-all duration-200 transform bg-[#B9E7FF] rounded-lg group-hover:scale-105">
                          <FontAwesomeIcon icon={faMicrophone} />
                          <span>{item.tvInfo.dub}</span>
                        </div>
                      )}
                      {item.tvInfo?.showType && (
                        <div className="flex items-center space-x-1 text-sm text-gray-300">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{item.tvInfo.showType}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover tooltip */}
                  {hoveredItem === item.id + index && window.innerWidth > 1024 && (
                    <div
                      className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} z-[100000] transition-all duration-300 ease-in-out ${
                        hoveredItem === item.id + index
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Qtip id={item.id} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Animated show more button */}
          {!limit && data.length > 6 && (
            <button
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-[#ff7eb3] to-[#ff758c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-[#ff8fab] hover:to-[#ff7e8c] flex items-center justify-center space-x-2"
              onClick={toggleShowAll}
            >
              <span>{showAll ? "Show Less" : "Show More"}</span>
              <FontAwesomeIcon icon={showAll ? faChevronUp : faChevronDown} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Sidecard);