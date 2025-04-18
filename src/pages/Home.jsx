import { useEffect, useState } from "react";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import Banner from "@/src/components/banner/Banner";
import Trending from "@/src/components/trending/Trending";
import Topten from "@/src/components/topten/Topten";
import ContinueWatching from "@/src/components/continue/ContinueWatching";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import { categoryRoutes } from "@/src/utils/category.utils";

const Home = () => {
  const { homeInfo, loading } = useHomeInfo();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (homeInfo?.spotlight?.length > 0) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => 
          prev === homeInfo.spotlight.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [homeInfo?.spotlight]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      {homeInfo?.spotlight?.length > 0 && (
        <Banner item={homeInfo.spotlight[currentBannerIndex]} index={currentBannerIndex} />
      )}
      
      <Trending trending={homeInfo.trending} />
      
      <div className="mt-10 flex gap-6 max-[1200px]:px-4 max-[1200px]:grid max-[1200px]:grid-cols-2 max-[1200px]:mt-12 max-[1200px]:gap-y-10 max-[680px]:grid-cols-1">
        <Topten items={homeInfo.top10} />
        <ContinueWatching />
      </div>
      
      <div className="mt-10 grid grid-cols-4 gap-6 max-[1200px]:grid-cols-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {categoryRoutes.map((category) => (
          <CategoryCard key={category} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Home; 