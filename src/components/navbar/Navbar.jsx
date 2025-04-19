import { useState, useEffect, useRef } from "react";
import logoTitle from "@/src/config/logoTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFilm,
  faRandom,
  faStar,
  faXmark,
  faCircleInfo,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { SearchProvider } from "@/src/context/SearchContext";
import WebSearch from "../searchbar/WebSearch";
import MobileSearch from "../searchbar/MobileSearch";
import { motion, AnimatePresence } from "framer-motion";
import { faInstagram, faDiscord } from "@fortawesome/free-brands-svg-icons";

function Navbar() {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [isNotHomePage, setIsNotHomePage] = useState(
    location.pathname !== "/" && location.pathname !== "/home"
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const navRef = useRef(null);
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleHamburgerClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.style.overflow = isSidebarOpen ? "auto" : "hidden";
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleRandomClick = () => {
    if (location.pathname === "/random") {
      window.location.reload();
    }
  };

  useEffect(() => {
    setIsNotHomePage(
      location.pathname !== "/" && location.pathname !== "/home"
    );
  }, [location.pathname]);

  const navItems = [
    { icon: faRandom, label: "Random", path: "/random" },
    { icon: faFilm, label: "Movie", path: "/movie" },
    { icon: faStar, label: "Popular", path: "/most-popular" },
  ];

  const socialItems = [
    { icon: faInstagram, label: "Instagram", url: "https://www.instagram.com/its.dark.devil?igsh=MWtpNHA1ZWxwcmRmaA==" },
    { icon: faDiscord, label: "Discord", url: "/" },
  ];

  return (
    <SearchProvider>
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full h-20 z-[1000] flex px-6 py-4 items-center justify-between transition-all duration-500 ease-in-out ${
          isNotHomePage || isScrolled
            ? "bg-devilish-dark/95 backdrop-blur-xl"
            : "bg-transparent"
        } ${
          isScrolled
            ? "shadow-2xl shadow-devilish-crimson/20 border-b border-devilish-crimson/10"
            : ""
        } max-[600px]:h-16 max-[600px]:px-4`}
      >
        {/* Left Section */}
        <div className="flex gap-x-6 items-center w-fit max-lg:w-full max-lg:justify-between">
          <div className="flex gap-x-6 items-center">
            <button
              onClick={handleHamburgerClick}
              className="text-devilish-light hover:text-devilish-crimson"
              aria-label="Menu"
            >
              <FontAwesomeIcon
                icon={isSidebarOpen ? faXmark : faBars}
                size="lg"
              />
            </button>
            
            <div>
              <Link
                to="/"
                className="text-4xl font-bold max-[575px]:text-3xl cursor-pointer devilish-gradient-text flex items-center"
              >
                {logoTitle}
                <span className="text-xs ml-2 bg-devilish-crimson/10 text-devilish-crimson px-2 py-1 rounded-full">
                  BETA
                </span>
              </Link>
            </div>
          </div>
          
          <div className="max-[900px]:hidden">
            <WebSearch />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex gap-x-8 items-center max-lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => {
                if (item.path === "/random" && location.pathname === "/random") {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
              className="nav-link flex flex-col items-center cursor-pointer p-3 rounded-lg hover:bg-devilish-crimson/10 transition-all duration-300"
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`text-xl transition-all duration-300 ${
                  location.pathname === item.path
                    ? "text-devilish-crimson"
                    : "text-devilish-light/80"
                }`}
              />
              <span
                className={`text-xs font-medium transition-all duration-300 mt-1 ${
                  location.pathname === item.path
                    ? "text-devilish-crimson"
                    : "text-devilish-light/80"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
          
          {/* Language Toggle */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <button
              onClick={toggleLanguage}
              className="nav-link flex flex-col gap-y-1 items-center cursor-pointer group"
            >
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLanguage}
                  className={`text-xl transition-all duration-300 ${
                    language === "EN"
                      ? "text-devilish-crimson"
                      : "text-devilish-light/80"
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium transition-all duration-300 ${
                  language === "EN"
                    ? "text-devilish-crimson"
                    : "text-devilish-light/80"
                }`}
              >
                {language === "EN" ? "English" : "日本語"}
              </span>
            </button>
          </motion.div>
          
          {/* About */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Link
              to="/about"
              className="nav-link flex flex-col gap-y-1 items-center cursor-pointer group"
            >
              <FontAwesomeIcon
                icon={faCircleInfo}
                className={`text-xl transition-all duration-300 ${
                  location.pathname === "/about"
                    ? "text-devilish-crimson"
                    : "text-devilish-light/80"
                }`}
              />
              <span
                className={`text-xs font-medium transition-all duration-300 ${
                  location.pathname === "/about"
                    ? "text-devilish-crimson"
                    : "text-devilish-light/80"
                }`}
              >
                About
              </span>
            </Link>
          </motion.div>
          
          {/* Social Links */}
          <div className="flex gap-x-5 ml-2">
            {socialItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2, color: "#ff3860" }}
                className="text-devilish-light/70 hover:text-devilish-crimson transition-colors"
                aria-label={item.label}
              >
                <FontAwesomeIcon icon={item.icon} />
              </motion.a>
            ))}
          </div>
        </div>
        
        <div className="lg:hidden">
          <MobileSearch />
        </div>
        
        {/* Scrolling Indicator */}
        {isNotHomePage && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-devilish-crimson"
            initial={{ width: 0 }}
            animate={{ width: `${(window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.nav>
      
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
    </SearchProvider>
  );
}

export default Navbar;