document.addEventListener('DOMContentLoaded', function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var message = player.querySelector('[data-player-message]');

    if (!video) {
      return;
    }

    var stream = video.getAttribute('data-stream');

    var showMessage = function (text) {
      if (message) {
        message.textContent = text;
        message.hidden = false;
      }
    };

    if (stream) {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage('视频加载遇到问题，请稍后重试。');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        showMessage('浏览器暂不支持该播放格式，请更换浏览器继续观看。');
      }
    }

    var play = function () {
      var action = video.paused ? video.play() : video.pause();
      if (action && action.catch) {
        action.catch(function () {
          showMessage('请再次点击播放按钮开始观看。');
        });
      }
    };

    if (button) {
      button.addEventListener('click', function () {
        play();
      });
    }

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (button) {
        button.classList.remove('is-hidden');
      }
    });
  });
});
