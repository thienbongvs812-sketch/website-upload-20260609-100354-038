(function () {
  function setupPlayer(config) {
    const video = document.getElementById(config.videoId);
    const overlay = document.getElementById(config.overlayId);
    const button = document.getElementById(config.buttonId);
    let hls = null;

    function loadVideo() {
      if (!video || video.dataset.ready === "true") {
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(config.source);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = config.source;
      } else {
        video.src = config.source;
      }
      video.dataset.ready = "true";
    }

    function startPlayback() {
      if (!video) {
        return;
      }
      loadVideo();
      video.controls = true;
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startPlayback);
    }
    if (button) {
      button.addEventListener("click", startPlayback);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          startPlayback();
        }
      });
      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });
      video.addEventListener("ended", function () {
        if (overlay) {
          overlay.classList.remove("is-hidden");
        }
      });
      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    }
  }

  window.setupPlayer = setupPlayer;
})();
