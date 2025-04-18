import React, { useState } from "react";
import { Link } from "react-router-dom";

function Genre({ data }) {
  const colors = [
    "text-devilish-gold",
    "text-devilish-purple",
    "text-devilish-blue",
    "text-devilish-green",
    "text-devilish-orange",
    "text-devilish-yellow",
    "text-devilish-light",
    "text-devilish-white",
  ];

  const [showAll, setShowAll] = useState(false);
  const toggleGenres = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-2xl text-devilish-crimson">Genres</h1>
      <div className="bg-devilish-darker py-6 px-4 mt-6 max-[478px]:bg-transparent max-[478px]:px-0">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-3 w-full max-[478px]:flex max-[478px]:flex-wrap max-[478px]:gap-2">
          {data &&
            (showAll ? data : data.slice(0, 24)).map((item, index) => {
              const textColorClass = colors[index % colors.length];
              return (
                <Link
                  to={`/genre/${item}`}
                  key={index}
                  className={`rounded-[4px] py-2 px-3 hover:bg-devilish-crimson hover:text-devilish-darker hover:cursor-pointer max-[478px]:bg-devilish-darker max-[478px]:py-[6px] ${textColorClass}`}
                >
                  <div className="overflow-hidden text-left text-ellipsis text-nowrap font-bold">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </div>
                </Link>
              );
            })}
        </div>
        <button
          className="w-full bg-devilish-darker/80 py-3 mt-4 hover:bg-devilish-crimson hover:text-devilish-darker rounded-md font-bold transform transition-all ease-out"
          onClick={toggleGenres}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
}

export default React.memo(Genre);
