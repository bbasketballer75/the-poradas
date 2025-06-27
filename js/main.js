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
  let revealed = false;
  if (skipBtn) {
    console.log('Skip button found');
    setTimeout(() => {
      skipBtn.classList.add('visible');
      console.log('Skip button made visible');
    }, 5000);
  } else {
    console.warn('Skip button NOT found');
  }
  function revealContent() {
    if (revealed) return;
    revealed = true;
    if (introWrapper) {
      introWrapper.style.transition = 'opacity 0.6s';
      introWrapper.style.opacity = 0;
    }
    setTimeout(() => {
      if (introWrapper) introWrapper.style.display = 'none';
      document.body.style.overflow = 'auto';
      // Scroll to the scroll video section
      const scrollSection = document.getElementById('scroll-section');
      if (scrollSection) {
        scrollSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 600);
  }
// --- Scroll Video Auto Play Logic ---
window.addEventListener('DOMContentLoaded', () => {
  const scrollVideo = document.getElementById('scroll-video');
  if (scrollVideo) {
    // Try to play immediately (may require muted for autoplay)
    scrollVideo.play().catch(() => {});
    scrollVideo.addEventListener('ended', function() {
      // Scroll to family tree after video ends
      const familyTree = document.getElementById('family-tree');
      if (familyTree) {
        familyTree.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});
  document.body.style.overflow = 'hidden';
  if (skipBtn) {
    skipBtn.style.pointerEvents = 'auto';
    skipBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('Skip Intro button clicked');
      revealContent();
    });
  }
  if (introVideo) introVideo.addEventListener('ended', revealContent);
  setTimeout(revealContent, 60000);

  // --- Main Video logic (manual play on click) ---
  const playOverlay = document.getElementById('main-film-overlay');
  const playBtn = document.getElementById('play-main-film');
  const mainFilm = document.getElementById('main-film');
  if (playBtn && playOverlay && mainFilm) {
    playBtn.addEventListener('click', function() {
      playOverlay.style.opacity = 0;
      setTimeout(() => { playOverlay.style.display = 'none'; }, 400);
      // Ensure the iframe src includes enablejsapi=1 for postMessage to work
      if (mainFilm.src && !mainFilm.src.includes('enablejsapi=1')) {
        const url = new URL(mainFilm.src, window.location.origin);
        url.searchParams.set('enablejsapi', '1');
        mainFilm.src = url.toString();
        // Wait for iframe to reload before sending play message
        mainFilm.onload = function() {
          mainFilm.contentWindow && mainFilm.contentWindow.postMessage({event: 'play'}, '*');
        };
      } else {
        mainFilm.contentWindow && mainFilm.contentWindow.postMessage({event: 'play'}, '*');
      }
    });
  }
});