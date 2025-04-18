export default function artplayerPluginChromecast() {
  return (art) => {
    // Flag to track if the plugin is initialized
    let isInitialized = false;
    let castSession = null;
    let castContext = null;
    
    // Check if the browser supports the Cast API
    if (!window.chrome || !window.chrome.cast || !window.chrome.cast.isAvailable) {
      // Load the Cast API if it's not already loaded
      const initializeCastApi = () => {
        try {
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

      // Load the Cast API script
      if (!window.__onGCastApiAvailable) {
        window.__onGCastApiAvailable = (isAvailable) => {
          if (isAvailable) {
            initializeCastApi();
          }
        };
      }

      try {
        const script = document.createElement("script");
        script.src = "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading Cast API script:", error);
      }
    } else {
      // Cast API is already available
      isInitialized = true;
    }

    // Session listener
    const sessionListener = (session) => {
      console.log("New cast session:", session);
      castSession = session;
    };

    // Receiver listener
    const receiverListener = (availability) => {
      if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
        console.log("Cast receiver available");
      } else {
        console.log("Cast receiver not available");
      }
    };

    // Success callback for initialization
    const onInitSuccess = () => {
      console.log("Cast API initialized successfully");
      isInitialized = true;
    };

    // Error callback for initialization
    const onInitError = (error) => {
      console.error("Error initializing Cast API:", error);
      isInitialized = false;
    };

    // Add the cast button to the player controls
    art.controls.add({
      name: "chromecast",
      position: "right",
      index: 10,
      tooltip: "Cast to device",
      click: () => {
        // Don't do anything if the player is not ready
        if (!art.ready) {
          console.log("Player not ready");
          return;
        }
        
        if (!window.chrome || !window.chrome.cast || !window.chrome.cast.isAvailable) {
          console.log("Cast API not available");
          return;
        }

        try {
          // Request a cast session
          chrome.cast.requestSession(
            (session) => {
              console.log("Cast session established:", session);
              castSession = session;
              
              // Get the current media URL
              const mediaUrl = art.url;
              
              // Create a media object
              const mediaInfo = new chrome.cast.media.MediaInfo(mediaUrl, "application/x-mpegURL");
              
              // Create a request
              const request = new chrome.cast.media.LoadRequest(mediaInfo);
              
              // Load the media
              session.loadMedia(request, onMediaSuccess, onMediaError);
            },
            (error) => {
              console.error("Error requesting cast session:", error);
            }
          );
        } catch (error) {
          console.error("Error in cast button click handler:", error);
        }
      },
    });

    // Media success callback
    const onMediaSuccess = (mediaSession) => {
      console.log("Media loaded successfully:", mediaSession);
    };

    // Media error callback
    const onMediaError = (error) => {
      console.error("Error loading media:", error);
    };

    // Return the plugin object
    return {
      name: "artplayerPluginChromecast",
      // Add a destroy method to clean up resources
      destroy: () => {
        // Clean up any resources if needed
        if (castSession) {
          try {
            castSession.stop();
            castSession = null;
          } catch (error) {
            console.error("Error stopping cast session:", error);
          }
        }
      }
    };
  };
} 