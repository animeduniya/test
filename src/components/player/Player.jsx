import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
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

// Chromecast icon SVG
const chromecastIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
  <line x1="2" y1="20" x2="2.01" y2="20" />
</svg>`;

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

  const playM3u8 = (video, url, art) => {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.hls = hls;

      art.on("destroy", () => hls.destroy());

      video.addEventListener("timeupdate", () => {
        const currentTime = Math.round(video.currentTime);
        const duration = Math.round(video.duration);
        if (duration > 0) {
          if (currentTime >= duration) {
            art.pause();
            if (currentEpisodeIndex < episodes?.length - 1 && autoNext) {
              playNext(
                episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]
              );
            }
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("timeupdate", () => {
        const currentTime = Math.round(video.currentTime);
        const duration = Math.round(video.duration);
        if (duration > 0) {
          if (currentTime >= duration) {
            art.pause();
            if (currentEpisodeIndex < episodes?.length - 1 && autoNext) {
              playNext(
                episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]
              );
            }
          }
        }
      });
    } else {
      console.log("Unsupported playback format: m3u8");
    }
  };

  const createChapters = () => {
    const chapters = [];
    if (intro?.start !== 0 || intro?.end !== 0) {
      chapters.push({ start: intro.start, end: intro.end, title: "intro" });
    }
    if (outro?.start !== 0 || outro?.end !== 0) {
      chapters.push({ start: outro.start, end: outro.end, title: "outro" });
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

  // Initialize Chromecast
  const initializeChromecast = () => {
    if (!window.chrome || !window.chrome.cast || !window.chrome.cast.isAvailable) {
      window.__onGCastApiAvailable = (isAvailable) => {
        if (isAvailable) {
          initializeCastApi();
        }
      };

      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
      document.head.appendChild(script);
    } else {
      initializeCastApi();
    }
  };

  const initializeCastApi = () => {
    try {
      // Use a custom receiver app ID that supports HLS
      const sessionRequest = new chrome.cast.SessionRequest(
        chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
      );
      const apiConfig = new chrome.cast.ApiConfig(
        sessionRequest,
        sessionListener,
        receiverListener
      );
      chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
    } catch (error) {
      console.error("Error initializing Cast API:", error);
    }
  };

  const onInitSuccess = () => {
    console.log("Cast API initialized successfully");
  };

  const onInitError = (error) => {
    console.error("Error initializing Cast API:", error);
  };

  const sessionListener = (session) => {
    console.log("New cast session:", session);
  };

  const receiverListener = (availability) => {
    if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
      console.log("Cast receiver available");
    } else {
      console.log("Cast receiver not available");
    }
  };

  const startCasting = (art) => {
    if (!window.chrome || !window.chrome.cast || !window.chrome.cast.isAvailable) {
      console.log("Cast API not available");
      return;
    }

    try {
      chrome.cast.requestSession(
        (session) => {
          console.log("Cast session established:", session);
          
          // Get the current media URL
          let mediaUrl = streamUrl;
          let contentType = "application/x-mpegURL";
          
          // Check if we have a direct MP4 URL available
          if (streamInfo?.sources?.find(source => source.quality === "default" && source.url.includes('.mp4'))) {
            const mp4Source = streamInfo.sources.find(source => source.quality === "default");
            mediaUrl = mp4Source.url;
            contentType = "video/mp4";
          }
          // If not, use the proxy URL for HLS
          else {
            const proxyUrl = m3u8proxy[Math.floor(Math.random() * m3u8proxy?.length)];
            const headers = {};
            
            if (streamInfo?.streamingLink?.iframe) {
              const iframeUrl = streamInfo.streamingLink.iframe;
              const url = new URL(iframeUrl);
              headers.Referer = url.origin + "/";
            } else {
              headers.Referer = "https://megacloud.club/";
            }
            
            mediaUrl = proxyUrl + encodeURIComponent(streamUrl) + "&headers=" + encodeURIComponent(JSON.stringify(headers));
          }
          
          console.log("Final media URL for casting:", mediaUrl);
          
          // Create media info with proper metadata
          const mediaInfo = new chrome.cast.media.MediaInfo(mediaUrl, contentType);
          mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
          mediaInfo.metadata.title = animeInfo?.title || "Anime Episode";
          mediaInfo.metadata.subtitle = `Episode ${episodeNum}`;
          
          // Set stream type based on content
          mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;
          
          // Add text tracks for subtitles if available
          if (subtitles && subtitles.length > 0) {
            mediaInfo.textTrackStyle = new chrome.cast.media.TextTrackStyle();
            mediaInfo.tracks = subtitles.map((sub, index) => {
              const track = new chrome.cast.media.Track(index, chrome.cast.media.TrackType.TEXT);
              track.trackContentId = sub.file;
              track.trackContentType = "text/vtt";
              track.subtype = chrome.cast.media.TextTrackType.SUBTITLES;
              track.name = sub.label;
              track.language = sub.language || "en";
              return track;
            });
          }
          
          // Create load request
          const request = new chrome.cast.media.LoadRequest(mediaInfo);
          request.currentTime = art.currentTime;
          request.autoplay = true;
          
          // Load media
          session.loadMedia(request)
            .then(() => console.log("Media loaded successfully"))
            .catch(error => console.error("Error loading media:", error));
        },
        (error) => {
          console.error("Error requesting cast session:", error);
        }
      );
    } catch (error) {
      console.error("Error in cast button click handler:", error);
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
            transition: "opacity 0.5s ease-out",
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
            transition: "opacity 0.5s ease-in-out",
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
            transition: "opacity 0.5s ease-in-out",
          },
          disable: !Artplayer.utils.isMobile,
        },
      ],
      controls: [
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
        {
          name: "chromecast",
          position: "right",
          tooltip: "Cast to device",
          html: chromecastIcon,
          click: () => {
            startCasting(art);
          },
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

    art.on("resize", () => {
      art.subtitle.style({
        fontSize:
          (art.width > 500 ? art.width * 0.02 : art.width * 0.03) + "px",
      });
    });
    art.on("ready", () => {
      setTimeout(() => {
        art.layers[website_name].style.opacity = 0;
      }, 2000);
      const ranges = [
        ...(intro.start != null && intro.end != null
          ? [[intro.start + 1, intro.end - 1]]
          : []),
        ...(outro.start != null && outro.end != null
          ? [[outro.start + 1, outro.end]]
          : []),
      ];
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
          onSelect: function (item) {
            art.subtitle.switch(item.url, { name: item.html });
            return item.html;
          },
        });
      {
        autoSkipIntro && art.plugins.add(autoSkip(ranges));
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
      
      // Initialize Chromecast
      initializeChromecast();
    });
    return () => {
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
    };
  }, [streamUrl, subtitles, intro, outro]);

  return <div ref={artRef} className="w-full h-full"></div>;
}