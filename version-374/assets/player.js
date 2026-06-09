(function () {
    function setupPlayer(videoId, buttonId, coverId, streamUrl) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var cover = document.getElementById(coverId);
        var hlsInstance = null;
        var attached = false;

        if (!video || !streamUrl) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            attached = true;
        }

        function start() {
            attach();
            if (cover) {
                cover.classList.add('hide');
            }
            video.controls = true;
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', start);
        }
        if (cover) {
            cover.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (!attached) {
                start();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.setupPlayer = setupPlayer;
})();
