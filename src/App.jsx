import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomeInfoProvider } from "./context/HomeInfoContext";
import Home from "./pages/Home/Home";
import AnimeInfo from "./pages/animeInfo/AnimeInfo";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Error from "./components/error/Error";
import Category from "./pages/category/Category";
import AtoZ from "./pages/a2z/AtoZ";
import { azRoute, categoryRoutes } from "./utils/category.utils";
import "./App.css";
import Search from "./pages/search/Search";
import Watch from "./pages/watch/Watch";
import Producer from "./components/producer/Producer";
import SplashScreen from "./components/splashscreen/SplashScreen";
import About from "./pages/About.jsx";
import History from "./pages/History.jsx";
import AnimatedRune from "./components/animated-rune/AnimatedRune";
import './styles/no-animations.css'

function App() {
  const location = useLocation();
  const [showRune, setShowRune] = useState(true);

  // Scroll to top on location change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleRuneComplete = () => {
    setShowRune(false);
  };

  return (
    <HomeInfoProvider>
      <div className="app-container">
        {showRune && <AnimatedRune onComplete={handleRuneComplete} />}
        <main className="content">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/about" element={<About />} />
            <Route path="/history" element={<History />} />
            <Route path="/:id" element={<AnimeInfo />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/random" element={<AnimeInfo random={true} />} />
            <Route path="/404-not-found-page" element={<Error error="404" />} />
            <Route path="/error-page" element={<Error />} />
            {/* Render category routes */}
            {categoryRoutes.map((path) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <Category path={path} label={path.split("-").join(" ")} />
                }
              />
            ))}
            {/* Render A to Z routes */}
            {azRoute.map((path) => (
              <Route
                key={path}
                path={`/${path}`}
                element={<AtoZ path={path} />}
              />
            ))}
            <Route path="/producer/:id" element={<Producer />} />
            <Route path="/search" element={<Search />} />
            {/* Redirect to home page for any other route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </HomeInfoProvider>
  );
}

export default App;
