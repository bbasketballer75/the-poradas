console.log('main.js loaded');

// --- Modal logic with YouTube API ---
const openBtn = document.getElementById('open-modal');
const modal = document.getElementById('video-modal');
const closeBtn = document.getElementById('close-modal');
const chapterBtns = document.querySelectorAll('.chapter-jump');
let ytPlayer;
function loadYouTubeAPI(callback) {
  if (window.YT && window.YT.Player) {
    callback();
    return;
  }
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
  window.onYouTubeIframeAPIReady = callback;
}
function onYouTubeReady() {
  if (!ytPlayer && window.YT && window.YT.Player) {
    ytPlayer = new YT.Player('modal-player');
  }
}
if (openBtn) openBtn.addEventListener('click', () => {
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  loadYouTubeAPI(onYouTubeReady);
});
if (closeBtn) closeBtn.addEventListener('click', () => {
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
});
chapterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const t = parseFloat(btn.getAttribute('data-time'));
    if (ytPlayer && ytPlayer.seekTo) {
      ytPlayer.seekTo(t, true);
      ytPlayer.playVideo && ytPlayer.playVideo();
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  // --- Intro Video Logic ---
  const introWrapper = document.getElementById('intro-wrapper');
  const introVideo = document.getElementById('intro-video');
  const skipBtn = document.getElementById('skip-intro');
  const scrollVideo = document.getElementById('scroll-video');
  let revealed = false;
  if (scrollVideo) {
    scrollVideo.pause();
    scrollVideo.currentTime = 0;
  }
  if (skipBtn) {
    setTimeout(() => {
      skipBtn.classList.add('visible');
    }, 5000);
    skipBtn.addEventListener('click', () => {
      revealContent();
    });
  }
  function revealContent() {
    if (revealed) return;
    revealed = true;
    if (introWrapper) introWrapper.style.display = 'none';
    if (scrollVideo) {
      scrollVideo.play();
    }
    document.body.style.overflow = 'auto';
    // Scroll to the scroll video section
    const scrollSection = document.getElementById('scroll-section');
    if (scrollSection) {
      scrollSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  if (introVideo) {
    introVideo.addEventListener('ended', revealContent);
  }
  setTimeout(revealContent, 60000);

  // --- Main Video logic (manual play on click) ---
  const playOverlay = document.getElementById('main-film-overlay');
  const playAllBtn = document.getElementById('main-film-play-all');
  const mainFilm = document.getElementById('main-film');
  if (playAllBtn && playOverlay && mainFilm) {
    playAllBtn.addEventListener('click', async function() {
      // Fullscreen the iframe
      function requestFullscreen(el) {
        if (el.requestFullscreen) return el.requestFullscreen();
        if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
        if (el.msRequestFullscreen) return el.msRequestFullscreen();
        if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
      }
      await requestFullscreen(mainFilm);
      // Unmute, captions, quality, play (send multiple times for reliability)
      const sendAll = () => {
        mainFilm.contentWindow && mainFilm.contentWindow.postMessage({event: 'setMuted', value: false}, '*');
        mainFilm.contentWindow && mainFilm.contentWindow.postMessage({event: 'setCaptions', value: true}, '*');
        mainFilm.contentWindow && mainFilm.contentWindow.postMessage({event: 'setQuality', value: 'highest'}, '*');
        mainFilm.contentWindow && mainFilm.contentWindow.postMessage({event: 'play'}, '*');
      };
      sendAll();
      setTimeout(sendAll, 300);
      setTimeout(sendAll, 800);
      // Hide overlay after starting video
      playOverlay.style.opacity = 0;
      setTimeout(() => { playOverlay.style.display = 'none'; }, 400);
    });
  }
});