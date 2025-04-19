import Hls from "hls.js";
import { useEffect, useRef, useState, useCallback } from "react";
import Artplayer from "artplayer";
import artplayerPluginChapter from "./artPlayerPluinChaper";
import autoSkip from "./autoSkip";
import artplayerPluginVttThumbnail from "./artPlayerPluginVttThumbnail";
import {
  backward10Icon,
  backwardIcon,
  captionIcon,
  forward10Icon,
  forwardIcon,
  fullScreenOffIcon,
  fullScreenOnIcon,
  loadingIcon,
  logo,
  muteIcon,
  pauseIcon,
  pipIcon,
  playIcon,
  playIconLg,
  settingsIcon,
  volumeIcon,
} from "./PlayerIcons";
import "./Player.css";
import website_name from "@/src/config/website";
import getChapterStyles from "./getChapterStyle";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";

Artplayer.LOG_VERSION = false;
Artplayer.CONTEXTMENU = false;

const KEY_CODES = {
  M: "m",
  I: "i",
  F: "f",
  V: "v",
  SPACE: " ",
  ARROW_UP: "arrowup",
  ARROW_DOWN: "arrowdown",
  ARROW_RIGHT: "arrowright",
  ARROW_LEFT: "arrowleft",
};

// Update HLS configuration with optimized start handling
const hlsConfig = {
  maxBufferLength: 30,
  maxMaxBufferLength: 600,
  maxBufferSize: 60 * 1000 * 1000,
  maxBufferHole: 0.1,
  lowLatencyMode: true,
  backBufferLength: 90,
  startLevel: -1,
  abrEwmaDefaultEstimate: 500000,
  testBandwidth: true,
  progressive: true,
  debug: false,
  enableWorker: true,
  startPosition: 0,
  defaultAudioCodec: undefined,
  fragLoadingTimeOut: 20000,
  manifestLoadingTimeOut: 20000,
  levelLoadingTimeOut: 20000,
  fragLoadingMaxRetry: 6,
  manifestLoadingMaxRetry: 6,
  levelLoadingMaxRetry: 6,
  startFragPrefetch: true,
  appendErrorMaxRetry: 3,
  enableCEA708Captions: true,
  stretchShortVideoTrack: true,
  maxAudioFramesDrift: 1,
  forceKeyFrameOnDiscontinuity: true,
  abrEwmaFastLive: 3,
  abrEwmaSlowLive: 9,
  abrEwmaFastVoD: 3,
  abrEwmaSlowVoD: 9,
  abrMaxWithRealBitrate: true,
  maxStarvationDelay: 4,
  maxLoadingDelay: 4,
  minAutoBitrate: 0,
};

// Add retry mechanism for stuck playback
const retryPlayback = (video, art, url, retryCount = 0) => {
  if (retryCount >= 3) {
    art.notice.show = "Failed to play video. Please refresh the page.";
    return;
  }

  if (Hls.isSupported()) {
    if (art.hls) art.hls.destroy();
    const hls = new Hls(hlsConfig);
    
    let lastTime = 0;
    let stuckCount = 0;
    const checkStuck = setInterval(() => {
      if (video.currentTime === lastTime && video.currentTime > 0) {
        stuckCount++;
        if (stuckCount >= 2) {
          // If stuck, skip forward by 3 seconds
          const newTime = Math.min(video.currentTime + 3, video.duration);
          video.currentTime = newTime;
          video.play().catch(() => {
            art.notice.show = "Skipping ahead...";
          });
          stuckCount = 0;
        }
      } else {
        stuckCount = 0;
      }
      lastTime = video.currentTime;
    }, 1000);

    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            hls.destroy();
            retryPlayback(video, art, url, retryCount + 1);
            break;
        }
      }
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {
        art.notice.show = "Click to play";
      });
    });

    hls.on(Hls.Events.FRAG_LOADED, () => {
      art.notice.hide();
      if (video.paused) {
        video.play().catch(() => {
          art.notice.show = "Click to play";
        });
      }
    });

    hls.on(Hls.Events.FRAG_LOADING, () => {
      art.notice.show = "Loading...";
    });

    hls.loadSource(url);
    hls.attachMedia(video);
    art.hls = hls;

    art.on("destroy", () => {
      clearInterval(checkStuck);
      hls.destroy();
    });
    video.addEventListener("timeupdate", () => handleTimeUpdate(video, art));
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    video.addEventListener("timeupdate", () => handleTimeUpdate(video, art));
    video.play().catch(() => {
      art.notice.show = "Click to play";
    });
  } else {
    console.log("Unsupported playback format: m3u8");
  }
};

export default function Player({
  streamUrl,
  subtitles,
  thumbnail,
  intro,
  outro,
  autoSkipIntro,
  autoPlay,
  autoNext,
  episodeId,
  episodes,
  playNext,
  animeInfo,
  episodeNum,
  streamInfo,
}) {
  const artRef = useRef(null);
  const proxy = import.meta.env.VITE_PROXY_URL;
  const m3u8proxy = import.meta.env.VITE_M3U8_PROXY_URL?.split(",") || [];
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

  useEffect(() => {
    const applyChapterStyles = () => {
      const existingStyles = document.querySelectorAll(
        "style[data-chapter-styles]"
      );
      existingStyles.forEach((style) => style.remove());
      const styleElement = document.createElement("style");
      styleElement.setAttribute("data-chapter-styles", "true");
      const styles = getChapterStyles(intro, outro);
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
      return () => {
        styleElement.remove();
      };
    };

    if (streamUrl || intro || outro) {
      const cleanup = applyChapterStyles();
      return cleanup;
    }
  }, [streamUrl, intro, outro]);

  const handleSubtitleChange = useCallback((art, item) => {
    art.subtitle.switch(item.url, { name: item.html });
    return item.html;
  }, []);

  const handleTimeUpdate = useCallback((video, art) => {
    const currentTime = Math.round(video.currentTime);
    const duration = Math.round(video.duration);
    if (duration > 0 && currentTime >= duration) {
      art.pause();
      if (currentEpisodeIndex < episodes?.length - 1 && autoNext) {
        playNext(episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]);
      }
    }
  }, [currentEpisodeIndex, episodes, autoNext, playNext]);

  const playM3u8 = useCallback((video, url, art) => {
    retryPlayback(video, art, url);
  }, [handleTimeUpdate]);

  const handleResize = useCallback((art) => {
    art.subtitle.style({
      fontSize: (art.width > 500 ? art.width * 0.02 : art.width * 0.03) + "px",
    });
  }, []);

  const createChapters = () => {
    const chapters = [];
    if (intro?.start !== 0 || intro?.end !== 0) {
      chapters.push({ 
        start: intro.start, 
        end: intro.end, 
        title: "intro",
        style: {
          background: "rgba(255, 255, 0, 0.3)",
          border: "2px solid yellow"
        }
      });
    }
    if (outro?.start !== 0 || outro?.end !== 0) {
      chapters.push({ 
        start: outro.start, 
        end: outro.end, 
        title: "outro",
        style: {
          background: "rgba(255, 255, 0, 0.3)",
          border: "2px solid yellow"
        }
      });
    }
    return chapters;
  };

  const handleKeydown = (event, art) => {
    const tagName = event.target.tagName.toLowerCase();

    if (tagName === "input" || tagName === "textarea") return;

    switch (event.key.toLowerCase()) {
      case KEY_CODES.M:
        art.muted = !art.muted;
        break;
      case KEY_CODES.I:
        art.pip = !art.pip;
        break;
      case KEY_CODES.F:
        event.preventDefault();
        event.stopPropagation();
        art.fullscreen = !art.fullscreen;
        break;
      case KEY_CODES.V:
        event.preventDefault();
        event.stopPropagation();
        art.subtitle.show = !art.subtitle.show;
        break;
      case KEY_CODES.SPACE:
        event.preventDefault();
        event.stopPropagation();
        art.playing ? art.pause() : art.play();
        break;
      case KEY_CODES.ARROW_UP:
        event.preventDefault();
        event.stopPropagation();
        art.volume = Math.min(art.volume + 0.1, 1);
        break;
      case KEY_CODES.ARROW_DOWN:
        event.preventDefault();
        event.stopPropagation();
        art.volume = Math.max(art.volume - 0.1, 0);
        break;
      case KEY_CODES.ARROW_RIGHT:
        event.preventDefault();
        event.stopPropagation();
        art.currentTime = Math.min(art.currentTime + 10, art.duration);
        break;
      case KEY_CODES.ARROW_LEFT:
        event.preventDefault();
        event.stopPropagation();
        art.currentTime = Math.max(art.currentTime - 10, 0);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!streamUrl || !artRef.current) return;
    
    const iframeUrl = streamInfo?.streamingLink?.iframe;
    const headers = {};
    if (iframeUrl) {
      const url = new URL(iframeUrl);
      headers.Referer = url.origin + "/";
    } else {
      headers.Referer = "https://megacloud.club/";
    }

    const art = new Artplayer({
      url:
        m3u8proxy[Math.floor(Math.random() * m3u8proxy?.length)] +
        encodeURIComponent(streamUrl) +
        "&headers=" +
        encodeURIComponent(JSON.stringify(headers)),
      container: artRef.current,
      type: "m3u8",
      autoplay: autoPlay,
      volume: 1,
      setting: true,
      playbackRate: true,
      pip: true,
      hotkey: false,
      fullscreen: true,
      mutex: true,
      playsInline: true,
      lock: true,
      airplay: true,
      autoOrientation: true,
      fastForward: true,
      aspectRatio: true,
      subtitleOffset: true,
      plugins: [
        artplayerPluginHlsControl({
          quality: {
            setting: true,
            getName: (level) => level.height + "P",
            title: "Quality",
            auto: "Auto",
          },
        }),
        artplayerPluginChapter({ chapters: createChapters() }),
      ],
      subtitle: {
        style: {
          "font-weight": "400",
          height: "fit-content",
          minWidth: "fit-content",
          marginInline: "auto",
          "margin-top": "auto",
          "margin-bottom": "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#fff",
        },
        escape: false,
      },
      controls: [
        {
          name: "progress",
          position: "top",
          style: {
            height: "3px",
            background: "rgba(255, 255, 255, 0.2)",
            transition: "none",
          },
          children: [
            {
              name: "played",
              style: {
                background: "#ff0033",
                height: "100%",
                transition: "none",
              },
            },
            {
              name: "loaded",
              style: {
                background: "rgba(255, 255, 255, 0.4)",
                height: "100%",
                transition: "none",
              },
            },
            {
              name: "thumb",
              style: {
                width: "12px",
                height: "12px",
                background: "#ff0033",
                borderRadius: "50%",
                border: "2px solid #fff",
                top: "50%",
                transform: "translateY(-50%)",
                transition: "none",
              },
            },
          ],
        },
        {
          html: backward10Icon,
          position: "right",
          tooltip: "Backward 10s",
          click: () => {
            art.currentTime = Math.max(art.currentTime - 10, 0);
          },
        },
        {
          html: forward10Icon,
          position: "right",
          tooltip: "Forward 10s",
          click: () => {
            art.currentTime = Math.min(art.currentTime + 10, art.duration);
          },
        },
      ],
      layers: [
        {
          name: website_name,
          html: logo,
          tooltip: website_name,
          style: {
            opacity: 1,
            position: "absolute",
            top: "5px",
            right: "5px",
          },
        },
        {
          html: "",
          style: {
            position: "absolute",
            left: "50%",
            top: 0,
            width: "20%",
            height: "100%",
            transform: "translateX(-50%)",
          },
          disable: !Artplayer.utils.isMobile,
          click: function () {
            art.toggle();
          },
        },
        {
          name: "rewind",
          html: "",
          style: {
            position: "absolute",
            left: 0,
            top: 0,
            width: "40%",
            height: "100%",
          },
          disable: !Artplayer.utils.isMobile,
          click: () => {
            art.controls.show = !art.controls.show;
          },
        },
        {
          name: "forward",
          html: "",
          style: {
            position: "absolute",
            right: 0,
            top: 0,
            width: "40%",
            height: "100%",
          },
          disable: !Artplayer.utils.isMobile,
          click: () => {
            art.controls.show = !art.controls.show;
          },
        },
        {
          name: "backwardIcon",
          html: backwardIcon,
          style: {
            position: "absolute",
            left: "25%",
            top: "50%",
            transform: "translate(50%,-50%)",
            opacity: 0,
          },
          disable: !Artplayer.utils.isMobile,
        },
        {
          name: "forwardIcon",
          html: forwardIcon,
          style: {
            position: "absolute",
            right: "25%",
            top: "50%",
            transform: "translate(50%, -50%)",
            opacity: 0,
          },
          disable: !Artplayer.utils.isMobile,
        },
      ],
      icons: {
        play: playIcon,
        pause: pauseIcon,
        setting: settingsIcon,
        volume: volumeIcon,
        pip: pipIcon,
        volumeClose: muteIcon,
        state: playIconLg,
        loading: loadingIcon,
        fullscreenOn: fullScreenOnIcon,
        fullscreenOff: fullScreenOffIcon,
      },
      customType: {
        m3u8: playM3u8,
      },
    });

    // Debounce resize handler
    const debouncedResize = debounce(() => handleResize(art), 250);
    window.addEventListener("resize", debouncedResize);

    art.on("ready", () => {
      art.layers[website_name].style.opacity = 0;
      const ranges = [];
      if (intro?.start != null && intro?.end != null && intro.start < intro.end) {
        ranges.push([Math.floor(intro.start), Math.floor(intro.end)]);
      }
      if (outro?.start != null && outro?.end != null && outro.start < outro.end) {
        ranges.push([Math.floor(outro.start), Math.floor(outro.end)]);
      }
      document.addEventListener("keydown", (event) =>
        handleKeydown(event, art)
      );
      art.subtitle.style({
        fontSize:
          (art.width > 500 ? art.width * 0.02 : art.width * 0.03) + "px",
      });
      thumbnail &&
        art.plugins.add(
          artplayerPluginVttThumbnail({
            vtt: `${proxy}${thumbnail}`,
          })
        );
      const defaultEnglishSub =
        subtitles.find(
          (sub) => sub.label.toLowerCase() === "english" && sub.default
        ) || subtitles.find((sub) => sub.label.toLowerCase() === "english");
      subtitles &&
        subtitles.length > 0 &&
        art.setting.add({
          name: "captions",
          icon: captionIcon,
          html: "Subtitle",
          tooltip:
            subtitles.find((sub) => sub.label.toLowerCase() === "english")
              ?.label || "default",
          position: "right",
          selector: [
            {
              html: "Display",
              switch: true,
              onSwitch: function (item) {
                item.tooltip = item.switch ? "Hide" : "Show";
                art.subtitle.show = !item.switch;
                return !item.switch;
              },
            },
            ...subtitles.map((sub) => ({
              default:
                sub.label.toLowerCase() === "english" &&
                sub === defaultEnglishSub,
              html: sub.label,
              url: sub.file,
            })),
          ],
          onSelect: handleSubtitleChange,
        });
      if (ranges.length > 0 && autoSkipIntro) {
        art.plugins.add(autoSkip(ranges));
      }
      const defaultSubtitle = subtitles?.find(
        (sub) => sub.label.toLowerCase() === "english"
      );
      if (defaultSubtitle) {
        art.subtitle.switch(defaultSubtitle.file, {
          name: defaultSubtitle.label,
          default: true,
        });
      }
      const $rewind = art.layers["rewind"];
      const $forward = art.layers["forward"];
      Artplayer.utils.isMobile &&
        art.proxy($rewind, "dblclick", () => {
          art.currentTime = Math.max(0, art.currentTime - 10);
          art.layers["backwardIcon"].style.opacity = 1;
          setTimeout(() => {
            art.layers["backwardIcon"].style.opacity = 0;
          }, 300);
        });
      Artplayer.utils.isMobile &&
        art.proxy($forward, "dblclick", () => {
          art.currentTime = Math.max(0, art.currentTime + 10);
          art.layers["forwardIcon"].style.opacity = 1;
          setTimeout(() => {
            art.layers["forwardIcon"].style.opacity = 0;
          }, 300);
        });

      // Add specific handling for start and intro
      let lastTime = 0;
      let stuckCount = 0;
      const checkStuck = setInterval(() => {
        if (art.currentTime === lastTime && art.currentTime > 0) {
          stuckCount++;
          if (stuckCount >= 2) {
            // If stuck, skip forward by 3 seconds
            const newTime = Math.min(art.currentTime + 3, art.duration);
            art.seek = newTime;
            art.play().catch(() => {
              art.notice.show = "Skipping ahead...";
            });
            stuckCount = 0;
          }
        } else {
          stuckCount = 0;
        }
        lastTime = art.currentTime;
      }, 1000);

      // Add pre-buffering for intro
      if (intro?.start) {
        const preBufferTime = Math.max(0, intro.start - 5);
        art.on("video:timeupdate", () => {
          if (art.currentTime >= preBufferTime && art.currentTime < intro.start) {
            art.seek = intro.start;
          }
        });
      }

      // Add immediate playback handling
      art.on("video:canplay", () => {
        art.play().catch(() => {
          art.notice.show = "Click to play";
        });
      });

      art.on("video:play", () => {
        art.notice.hide();
      });

      art.on("video:pause", () => {
        if (art.currentTime === 0) {
          art.play().catch(() => {
            art.notice.show = "Click to play";
          });
        }
      });
    });

    return () => {
      window.removeEventListener("resize", debouncedResize);
      if (art && art.destroy) {
        art.destroy(false);
      }
      const continueWatching =
        JSON.parse(localStorage.getItem("continueWatching")) || [];

      const newEntry = {
        id: animeInfo?.id,
        data_id: animeInfo?.data_id,
        episodeId,
        episodeNum,
        adultContent: animeInfo?.adultContent,
        poster: animeInfo?.poster,
        title: animeInfo?.title,
        japanese_title: animeInfo?.japanese_title,
      };
      if (!newEntry.data_id) return;
      const existingIndex = continueWatching.findIndex(
        (item) => item.data_id === newEntry.data_id
      );

      if (existingIndex !== -1) {
        continueWatching[existingIndex] = newEntry;
      } else {
        continueWatching.push(newEntry);
      }
      localStorage.setItem(
        "continueWatching",
        JSON.stringify(continueWatching)
      );
      clearInterval(checkStuck);
    };
  }, [streamUrl, subtitles, intro, outro, autoSkipIntro]);

  return <div ref={artRef} className="w-full h-full"></div>;
}