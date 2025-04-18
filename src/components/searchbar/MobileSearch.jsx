import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Suggestion from "../suggestion/Suggestion";

function MobileSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();
  const suggestionRefs = useRef([]);

  const handleSearchClick = () => {
    if (searchValue.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
      setIsSearchVisible(false);
    }
  };

  return (
    <>
      {isSearchVisible && (
        <div className="flex w-full mt-2 relative custom-md:hidden">
          <input
            type="text"
            className="bg-devilish-darker/90 px-4 py-2 text-foreground focus:outline-none w-full rounded-l-lg border border-devilish-border/20 placeholder:text-foreground/50"
            placeholder="Search anime..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                const isInsideSuggestionBox = suggestionRefs.current.some(
                  (ref) => ref && ref.contains(document.activeElement),
                );
                if (!isInsideSuggestionBox) {
                  setIsFocused(false);
                }
              }, 100);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchClick();
              }
            }}
          />
          <button 
            className="flex items-center justify-center p-2 bg-devilish-darker/90 rounded-r-lg border border-devilish-border/20 border-l-0 hover:bg-devilish-darker/80 transition-colors duration-300"
            onClick={handleSearchClick}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-foreground/80 hover:text-devilish-crimson text-lg transition-colors duration-300"
            />
          </button>
          {isFocused && searchValue && (
            <div className="absolute top-full left-0 w-full mt-2 bg-devilish-darker/95 rounded-lg border border-devilish-border/20 shadow-lg z-50">
              <Suggestion
                keyword={searchValue}
                suggestionRefs={suggestionRefs}
                setIsFocused={setIsFocused}
              />
            </div>
          )}
        </div>
      )}
      <button
        className="custom-md:hidden text-foreground/80 hover:text-devilish-crimson transition-colors duration-300"
        onClick={() => setIsSearchVisible(!isSearchVisible)}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="text-2xl max-[575px]:text-xl"
        />
      </button>
    </>
  );
}

export default MobileSearch;
