console.log('main.js loaded');

// --- Modal logic with YouTube API ---
// ...existing code...

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
    if (!ytPlayer) {
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
    }, 3000);
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
      // Scroll to the overlay video section
      const overlaySection = document.getElementById('overlay-section');
      if (overlaySection) {
        overlaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 600);
  }
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

  // --- Main Video logic (auto fullscreen after intro) ---
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('close-modal');
  function showMainVideo() {
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Show overlay gif if not already shown
    const overlay = document.getElementById('main-gif-overlay');
    if (overlay) overlay.style.display = 'flex';
    // Pause video until overlay is clicked
    const iframe = document.getElementById('main-film');
    if (iframe) {
      iframe.contentWindow && iframe.contentWindow.postMessage({event: 'pause'}, '*');
    }
  }

  // Overlay click: hide overlay, unmute and play video
  // Only click on the gif (not the family tree) will start the video
  document.addEventListener('click', function(e) {
    const overlay = document.getElementById('main-gif-overlay');
    if (overlay && e.target.tagName === 'VIDEO' && e.target.id === 'overlay-video') {
      overlay.style.display = 'none';
      const iframe = document.getElementById('main-film');
      if (iframe) {
        iframe.contentWindow && iframe.contentWindow.postMessage({event: 'play'}, '*');
        iframe.contentWindow && iframe.contentWindow.postMessage({event: 'setMuted', value: false}, '*');
        iframe.contentWindow && iframe.contentWindow.postMessage({event: 'setCaptions', value: true}, '*');
        iframe.contentWindow && iframe.contentWindow.postMessage({event: 'setQuality', value: 'highest'}, '*');
      }
    }
  });
  if (closeBtn) closeBtn.addEventListener('click', () => {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    // Pause Cloudflare Stream video by reloading iframe
    const iframe = modal.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = src;
    }
  });
});