import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const ToggleButton = ({ label, isActive, onClick }) => (
  <button className="flex gap-x-2" onClick={onClick}>
    <h1 className="capitalize text-[13px]">{label}</h1>
    <span
      className={`capitalize text-[13px] ${
        isActive ? "text-devilish-crimson" : "text-red-500"
      }`}
    >
      {isActive ? "on" : "off"}
    </span>
  </button>
);

export default function WatchControls({
  autoPlay,
  setAutoPlay,
  autoSkipIntro,
  setAutoSkipIntro,
  autoNext,
  setAutoNext,
  episodeId,
  episodes = [],
  onButtonClick,
}) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(
    episodes?.findIndex(
      (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
    )
  );

  useEffect(() => {
    if (episodes?.length > 0) {
      const newIndex = episodes.findIndex(
        (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
      );
      setCurrentEpisodeIndex(newIndex);
    }
  }, [episodeId, episodes]);

  return (
    <div className="flex flex-col space-y-4 bg-devilish-darker p-4 pt-8">
      <div className="flex items-center gap-x-4">
        <h1 className="font-bold text-2xl pb-1 text-white border-b-[3px] border-devilish-crimson max-[350px]:hidden">01</h1>
        <div className="flex pb-4 relative container items-center" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.075)" }}>
          <img src="https://wsrv.nl/?url=https://cdn.noitatnemucod.net/thumbnail/300x400/100/bcd84731a3eda4f4a306250769675065.jpg" alt="One Piece" className="w-[60px] h-[75px] rounded-md object-cover flex-shrink-0 cursor-pointer" />
          <div className="flex flex-col ml-4 space-y-2">
            <a className="text-[1em] font-[500] hover:cursor-pointer hover:text-devilish-crimson transform transition-all ease-out line-clamp-1 max-[478px]:line-clamp-2 max-[478px]:text-[14px]" href="/one-piece-100">One Piece</a>
            <div className="flex flex-wrap items-center w-fit space-x-1 max-[350px]:gap-y-[3px]">
              <div className="flex space-x-1 justify-center items-center bg-devilish-green rounded-[4px] px-[4px] text-devilish-darker py-[2px]">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="closed-captioning" className="svg-inline--fa fa-closed-captioning text-[12px]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path fill="currentColor" d="M0 96C0 60.7 28.7 32 64 32l448 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 208c14.2 0 27 6.1 35.8 16c8.8 9.9 24 10.7 33.9 1.9s10.7-24 1.9-33.9c-17.5-19.6-43.1-32-71.5-32c-53 0-96 43-96 96s43 96 96 96c28.4 0 54-12.4 71.5-32c8.8-9.9 8-25-1.9-33.9s-25-8-33.9 1.9c-8.8 9.9-21.6 16-35.8 16c-26.5 0-48-21.5-48-48s21.5-48 48-48zm144 48c0-26.5 21.5-48 48-48c14.2 0 27 6.1 35.8 16c8.8 9.9 24 10.7 33.9 1.9s10.7-24 1.9-33.9c-17.5-19.6-43.1-32-71.5-32c-53 0-96 43-96 96s43 96 96 96c28.4 0 54-12.4 71.5-32c8.8-9.9 8-25-1.9-33.9s-25-8-33.9 1.9c-8.8 9.9-21.6 16-35.8 16c-26.5 0-48-21.5-48-48z"></path>
                </svg>
                <p className="text-[12px] font-bold">1125</p>
              </div>
              <div className="flex space-x-1 justify-center items-center bg-devilish-blue rounded-[4px] px-[8px] text-devilish-darker py-[2px]">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone" className="svg-inline--fa fa-microphone text-[12px]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path fill="currentColor" d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"></path>
                </svg>
                <p className="text-[12px] font-bold">1122</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-x-4 flex-wrap">
        <ToggleButton
          label="auto play"
          isActive={autoPlay}
          onClick={() => setAutoPlay((prev) => !prev)}
        />
        <ToggleButton
          label="auto skip intro"
          isActive={autoSkipIntro}
          onClick={() => setAutoSkipIntro((prev) => !prev)}
        />
        <ToggleButton
          label="auto next"
          isActive={autoNext}
          onClick={() => setAutoNext((prev) => !prev)}
        />
      </div>
      <div className="flex gap-x-6 max-[575px]:gap-x-4 max-[375px]:justify-end">
        <button
          onClick={() => {
            if (currentEpisodeIndex > 0) {
              onButtonClick(
                episodes[currentEpisodeIndex - 1].id.match(/ep=(\d+)/)?.[1]
              );
            }
          }}
          disabled={currentEpisodeIndex <= 0}
        >
          <FontAwesomeIcon
            icon={faBackward}
            className="text-[20px] max-[575px]:text-[16px] text-white"
          />
        </button>
        <button
          onClick={() => {
            if (currentEpisodeIndex < episodes?.length - 1) {
              onButtonClick(
                episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]
              );
            }
          }}
          disabled={currentEpisodeIndex >= episodes?.length - 1}
        >
          <FontAwesomeIcon
            icon={faForward}
            className="text-[20px] max-[575px]:text-[16px] text-white"
          />
        </button>
      </div>
      <div className="flex items-center gap-x-4">
        <h1 className="font-bold text-2xl text-devilish-light max-[350px]:hidden">04</h1>
      </div>
    </div>
  );
}
