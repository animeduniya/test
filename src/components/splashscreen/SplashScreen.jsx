import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./SplashScreen.css";
import logoTitle from "@/src/config/logoTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowRight,
  faMagnifyingGlass,
  faFire,
  faSkull,
} from "@fortawesome/free-solid-svg-icons";
import getTopSearch from "@/src/utils/getTopSearch.utils";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedRune from '../animated-rune/AnimatedRune';

// Static data moved outside the component
const NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/movie", label: "Movies" },
  { to: "/tv", label: "TV Series" },
  { to: "/most-popular", label: "Most Popular" },
  { to: "/top-airing", label: "Top Airing" },
];

const useTopSearch = () => {
  const [topSearch, setTopSearch] = useState([]);
  useEffect(() => {
    const fetchTopSearch = async () => {
      const data = await getTopSearch();
      if (data) setTopSearch(data);
    };
    fetchTopSearch();
  }, []);
  return topSearch;
};

const SplashScreen = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showRune, setShowRune] = useState(true);
  const topSearch = useTopSearch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRuneComplete = () => {
    setShowRune(false);
  };

  if (showRune) {
    return <AnimatedRune onComplete={handleRuneComplete} />;
  }

  const handleSearchSubmit = () => {
    const trimmedSearch = search.trim();
    if (!trimmedSearch) return;
    const queryParam = encodeURIComponent(trimmedSearch);
    navigate(`/search?keyword=${queryParam}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const flameVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const skullVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="devilish-dark min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated flames */}
      <motion.div
        className="flame"
        style={{
          width: '100%',
          height: '100px',
          left: '20%'
        }}
        variants={flameVariants}
        animate="animate"
      />
      <motion.div
        className="flame"
        style={{
          width: '80%',
          height: '80px',
          right: '20%'
        }}
        variants={flameVariants}
        animate="animate"
      />

      {/* Floating skulls */}
      <motion.div
        className="skull"
        style={{ left: '10%', top: '20%' }}
        variants={skullVariants}
        animate="animate"
      >
        <FontAwesomeIcon icon={faSkull} size="2x" />
      </motion.div>
      <motion.div
        className="skull"
        style={{ right: '15%', top: '40%' }}
        variants={skullVariants}
        animate="animate"
      >
        <FontAwesomeIcon icon={faSkull} size="2x" />
      </motion.div>

      <motion.h1
        className="devilish-gradient-text text-6xl font-bold mb-8"
        variants={itemVariants}
      >
        {logoTitle}
      </motion.h1>

      <motion.div
        className="flex flex-col items-center space-y-4"
        variants={itemVariants}
      >
        <Link
          to="/home"
          className="enter-button bg-red-600 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-red-700 transition-colors"
        >
          Enter
        </Link>

        <motion.button
          className="search-button bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
          onClick={() => setShowSearch(!showSearch)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <span>Search</span>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-lg shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Search anime..."
              className="search-input bg-gray-800 text-white px-4 py-2 rounded-lg w-64 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-8 flex space-x-6"
        variants={itemVariants}
      >
        <Link to="/about" className="nav-link text-white hover:text-red-500 transition-colors">
          About
        </Link>
        <Link to="/random" className="nav-link text-white hover:text-red-500 transition-colors">
          Random
        </Link>
        <Link to="/movie" className="nav-link text-white hover:text-red-500 transition-colors">
          Movie
        </Link>
        <Link to="/most-popular" className="nav-link text-white hover:text-red-500 transition-colors">
          Popular
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default SplashScreen;
