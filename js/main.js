  // --- Intro Video Logic ---
  const introWrapper = document.getElementById('intro-wrapper');
  const introVideo = document.getElementById('intro-video');
  const skipBtn = document.getElementById('skip-intro');
  let revealed = false;
  if (skipBtn) setTimeout(() => skipBtn.classList.add('visible'), 3000);
  function revealContent() {
    if (revealed) return;
    revealed = true;
    if (introWrapper) introWrapper.style.opacity = 0;
    setTimeout(() => {
      if (introWrapper) introWrapper.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 600);
  }
  document.body.style.overflow = 'hidden';
  if (skipBtn) skipBtn.addEventListener('click', revealContent);
  if (introVideo) introVideo.addEventListener('ended', revealContent);
  setTimeout(revealContent, 60000);

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
}
window.addEventListener('DOMContentLoaded', () => {
  // --- Intro Video Logic ---
  const introWrapper = document.getElementById('intro-wrapper');
  const introVideo = document.getElementById('intro-video');
  const skipBtn = document.getElementById('skip-intro');
  let revealed = false;
  if (skipBtn) setTimeout(() => skipBtn.classList.add('visible'), 3000);
  function revealContent() {
    if (revealed) return;
    revealed = true;
    if (introWrapper) introWrapper.style.opacity = 0;
    setTimeout(() => {
      if (introWrapper) introWrapper.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 600);
  }
  document.body.style.overflow = 'hidden';
  if (skipBtn) skipBtn.addEventListener('click', revealContent);
  if (introVideo) introVideo.addEventListener('ended', revealContent);
  setTimeout(revealContent, 60000);

  // --- Modal logic for Cloudflare Stream ---
  const openBtn = document.getElementById('open-modal');
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('close-modal');
  if (openBtn) openBtn.addEventListener('click', () => {
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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