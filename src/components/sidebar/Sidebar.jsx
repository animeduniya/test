import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faHome,
  faFilm,
  faRandom,
  faStar,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const menuItems = [
    { icon: faHome, label: "Home", path: "/" },
    { icon: faFilm, label: "Movie", path: "/movie" },
    { icon: faRandom, label: "Random", path: "/random" },
    { icon: faStar, label: "Popular", path: "/most-popular" },
    { icon: faHistory, label: "History", path: "/history" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 left-0 bottom-0 right-0 w-screen h-screen transform transition-all duration-400 ease-in-out backdrop-blur-lg"
          onClick={onClose}
          style={{ zIndex: 1000000, background: "rgba(17, 16, 23, 0.8)" }}
        />
      )}
      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-devilish-dark/90 backdrop-blur-md transform transition-transform duration-300 ease-in-out z-[1000001] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold devilish-gradient-text">Menu</h2>
            <button
              onClick={onClose}
              className="text-foreground/80 hover:text-devilish-crimson transition-colors duration-300 hover:rotate-90 transform"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group hover:bg-devilish-darker/50 ${
                  location.pathname === item.path
                    ? "bg-devilish-darker/50 text-devilish-crimson"
                    : "text-foreground/80"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`text-xl transition-all duration-300 group-hover:scale-110 ${
                    location.pathname === item.path
                      ? "text-devilish-crimson"
                      : "text-foreground/80"
                  }`}
                />
                <span className="text-lg font-medium">{item.label}</span>
              </Link>
            ))}

            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group hover:bg-devilish-darker/50 ${
                language === "EN"
                  ? "bg-devilish-darker/50 text-devilish-crimson"
                  : "text-foreground/80"
              }`}
            >
              <span
                className={`text-xl transition-all duration-300 group-hover:scale-110 ${
                  language === "EN"
                    ? "text-devilish-crimson"
                    : "text-foreground/80"
                }`}
              >
                {language === "EN" ? "EN" : "JP"}
              </span>
              <span className="text-lg font-medium">
                {language === "EN" ? "English" : "日本語"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
