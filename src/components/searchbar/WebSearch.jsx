import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Suggestion from "../suggestion/Suggestion";

function WebSearch() {
    const [searchValue, setSearchValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();
    const suggestionRefs = useRef([]);

    const handleSearchClick = () => {
        if (searchValue.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
        }
    };

    return (
        <div className="flex items-center relative w-[380px] max-[600px]:w-fit">
            <input
                type="text"
                className="bg-devilish-darker/90 px-4 py-2 text-foreground focus:outline-none w-full max-[600px]:hidden rounded-lg border border-devilish-border/20 placeholder:text-foreground/50"
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
                        if (searchValue.trim()) {
                            navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
                        }
                    }
                }}
            />
            <button
                className="bg-devilish-darker/90 p-2 max-[600px]:bg-transparent focus:outline-none max-[600px]:p-0 rounded-lg hover:bg-devilish-darker/80 transition-colors duration-300"
                onClick={handleSearchClick}
            >
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-lg text-foreground/80 hover:text-devilish-crimson max-[600px]:text-foreground max-[600px]:text-2xl max-[575px]:text-xl max-[600px]:mt-[7px] transition-colors duration-300"
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
    );
}

export default WebSearch;
