import React from 'react';

const ContinueWatchingText = () => {
  return (
    <div className="h-full bg-devilish-crimson px-6 text-black flex flex-col justify-center items-center gap-y-2 max-[600px]:bg-transparent max-[600px]:h-1/2 max-[600px]:text-white max-[600px]:mb-4">
      <p className="text-center leading-5 font-medium text-[14px]">
        You are watching <br />
        <span className="font-semibold max-[600px]:text-devilish-crimson">
          Episode 1
        </span>
      </p>
      <p className="leading-5 text-[14px] font-medium text-center">
        If the current server doesn't work, please try other servers beside.
      </p>
    </div>
  );
};

export default ContinueWatchingText; 