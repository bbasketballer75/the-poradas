// Clean Main JavaScript for The Poradas Wedding Website
// Consolidated and optimized version with all functionality restored

// Global variables
let dynamicFeaturesInitialized = false;
let guestMap = null;
let guestMarkers = [];
let backgroundMusicPlayer = null;
let isBackgroundMusicMuted = false;
let visitorCount = 1; // Starting visitor count - will be managed by localStorage

// Accurate visitor count system
function updateVisitorCount() {
  // Get or initialize visitor count from localStorage
  let storedCount = localStorage.getItem('porada-visitor-count');
  if (!storedCount) {
    // First time visitor - start at 1
    visitorCount = 1;
    localStorage.setItem('porada-visitor-count', visitorCount.toString());
    localStorage.setItem('porada-last-visit', new Date().toDateString());
    return visitorCount;
  } else {
    visitorCount = parseInt(storedCount);
  }
  
  // Check if this is a unique visitor for today
  const lastVisit = localStorage.getItem('porada-last-visit');
  const today = new Date().toDateString();
  
  if (lastVisit !== today) {
    // New unique visitor for today - increment by 1
    visitorCount += 1;
    localStorage.setItem('porada-visitor-count', visitorCount.toString());
    localStorage.setItem('porada-last-visit', today);
  }
  
  return visitorCount;
}

// ===== INTRO & MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  const mainContent = document.getElementById('main-content');
  const introSection = document.getElementById('intro-section');
  const introVideo = document.getElementById('intro-video');
  const skipBtn = document.getElementById('skip-intro');
  const replayBtn = document.getElementById('replay-intro');

  // Hide replay button until after intro
  replayBtn.style.display = 'none';

  // Disable scrolling during intro
  body.style.overflow = 'hidden';
  mainContent.style.display = 'none';
  skipBtn.style.opacity = 0;
  skipBtn.style.pointerEvents = 'auto';
  introVideo.muted = true;
  introVideo.setAttribute('muted', '');
  introVideo.load();
  
  let videoStarted = false;
  let skipTimeout;
  let fallbackTimeout;
  let introActive = true;

  function showSkipBtn() {
    skipBtn.style.opacity = 1;
    skipBtn.disabled = false;
  }

  let introWasSkipped = false;
  function endIntro() {
    // Show main content and initialize dynamic features
    mainContent.style.display = 'block';
    skipBtn.style.opacity = 0;
    skipBtn.disabled = true;
    clearTimeout(skipTimeout);
    clearTimeout(fallbackTimeout);
    body.style.overflow = '';
    introActive = false;
    replayBtn.style.display = '';
    
    // Update visitor count
    const finalCount = updateVisitorCount();
    
    // Create and inject footer when intro ends
    if (!document.getElementById('site-footer')) {
      const footer = document.createElement('footer');
      footer.id = 'site-footer';
      footer.style.cssText = `
        background: linear-gradient(135deg, var(--sage-green) 0%, var(--sage-green-dark) 100%);
        color: white;
        text-align: center;
        padding: 40px 20px;
        margin-top: 60px;
        font-family: 'Montserrat', sans-serif;
      `;
      footer.innerHTML = `
        <div class="footer-content">
          <div class="footer-title" style="font-size: 1.2rem; font-weight: 600; margin-bottom: 10px;">The Poradas - Established 2025</div>
          <div class="footer-counter">
            <div id="visitor-counter" style="font-size: 0.9rem; opacity: 0.8;">
              <span id="total-visitors">${finalCount}</span> visits
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(footer);
    }
    
    // Initialize all dynamic features
    initializeDynamicFeatures();
    
    // Scroll video lazy load logic
    const scrollSection = document.getElementById('scroll-section');
    if ('IntersectionObserver' in window && scrollSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let scrollVideo = document.getElementById('scroll-video');
            if (!scrollVideo) {
              scrollVideo = document.createElement('video');
              scrollVideo.id = 'scroll-video';
              scrollVideo.preload = 'none';
              scrollVideo.playsInline = true;
              scrollVideo.muted = true;
              scrollVideo.loop = true;
              scrollVideo.style.cssText = 'background:#fff;width:100%;display:block;height:100vh;object-fit:cover;';
              const source = document.createElement('source');
              source.type = 'video/mp4';
              source.src = 'video/scroll.mp4';
              scrollVideo.appendChild(source);
              scrollSection.appendChild(scrollVideo);
            }
            scrollVideo.load();
            scrollVideo.play().catch(()=>{});
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });
      observer.observe(scrollSection);
    }
    
    // Scroll to scroll-section after intro if not skipped
    if (scrollSection && !window._hasScrolledToScrollSection) {
      setTimeout(() => {
        scrollSection.scrollIntoView({ behavior: 'smooth' });
        window._hasScrolledToScrollSection = true;
      }, 100);
    }
  }

  // Fallback: if video doesn't start loading in 3s, skip intro
  fallbackTimeout = setTimeout(() => {
    if (!videoStarted) {
      endIntro();
    }
  }, 3000);

  skipBtn.onclick = function() {
    introWasSkipped = true;
    endIntro();
  };
  
  introVideo.onended = endIntro;

  // Show skip after 5s of playback
  introVideo.addEventListener('play', function onPlayOnce() {
    videoStarted = true;
    clearTimeout(fallbackTimeout);
    skipTimeout = setTimeout(showSkipBtn, 5000);
    introVideo.removeEventListener('play', onPlayOnce);
  });

  // Try to play video
  const playPromise = introVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      const unlockPlayback = () => {
        introVideo.muted = true;
        introVideo.setAttribute('muted', '');
        introVideo.play();
        body.removeEventListener('click', unlockPlayback);
        body.removeEventListener('touchstart', unlockPlayback);
      }
      body.addEventListener('click', unlockPlayback, { once: true });
      body.addEventListener('touchstart', unlockPlayback, { once: true });
    });
  }

  // Replay intro logic
  replayBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    introVideo.currentTime = 0;
    introVideo.play();
    skipBtn.style.opacity = 0;
    skipBtn.disabled = false;
    body.style.overflow = 'hidden';
    mainContent.style.display = 'none';
    introActive = true;
    fallbackTimeout = setTimeout(() => {
      if (!videoStarted) {
        endIntro();
      }
    }, 3000);
  };
});

// ===== BACKGROUND MUSIC SYSTEM =====
let musicPausedForVideo = false;
let musicPausedPosition = 0;
let musicPlayerMinimized = false;
let autoMinimizeTimeout = null;

function createBackgroundMusicPlayer() {
  if (document.getElementById('background-music-player')) {
    console.log('[Music] Background music player already exists');
    return;
  }
  
  const musicPlayer = document.createElement('div');
  musicPlayer.id = 'background-music-player';
  musicPlayer.className = 'music-player-expanded';
  musicPlayer.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    background: rgba(253, 250, 246, 0.95);
    border: 1px solid var(--sage-green);
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: min(320px, calc(100vw - 40px));
    max-width: 350px;
    transition: all 0.4s ease;
    font-family: 'Montserrat', sans-serif;
    opacity: 1;
    transform: translateY(0);
    cursor: pointer;
  `;

  musicPlayer.innerHTML = `
    <div id="music-title-container" style="width: 100%; overflow: hidden; position: relative; height: 20px; margin-bottom: 10px; text-align: center;">
      <div id="music-title" style="font-size: 14px; font-weight: 600; color: var(--text-dark); white-space: nowrap; position: absolute; width: 100%;">Wedding Music</div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
      <button id="music-prev" style="background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%); border: 1px solid rgba(143, 163, 130, 0.3); color: white; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">⏮</button>
      <button id="music-play-pause" style="background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%); border: 1px solid rgba(143, 163, 130, 0.3); color: white; font-size: 12px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 28px; height: 24px; display: flex; align-items: center; justify-content: center;">⏸</button>
      <button id="music-next" style="background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%); border: 1px solid rgba(143, 163, 130, 0.3); color: white; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">⏭</button>
      <button id="music-mute" style="background: linear-gradient(135deg, #c9a972 0%, #b8965f 100%); border: 1px solid rgba(201, 169, 114, 0.3); color: white; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">🔊</button>
      <input type="range" id="music-volume" min="0" max="1" step="0.1" value="0.3" style="flex: 1; height: 4px; background: linear-gradient(to right, #b7c9a8 0%, #b7c9a8 30%, #ddd 30%, #ddd 100%); border-radius: 2px; outline: none; appearance: none; cursor: pointer;">
      <button id="music-minimize" style="background: linear-gradient(135deg, #f7d6d6 0%, #eeb7b7 100%); border: 1px solid rgba(238, 183, 183, 0.3); color: white; font-size: 8px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">─</button>
    </div>
    <audio id="background-audio" loop>
      <source src="audio/Seven Lions, SLANDER, & Dabin feat. Dylan Matthew - First Time (Acoustic) ｜ Ophelia Records - SEVENLIONS.mp3" type="audio/mpeg">
    </audio>
  `;

  document.body.appendChild(musicPlayer);
  
  // Initialize audio controls
  const audio = document.getElementById('background-audio');
  const playPauseBtn = document.getElementById('music-play-pause');
  const muteBtn = document.getElementById('music-mute');
  const volumeSlider = document.getElementById('music-volume');
  const minimizeBtn = document.getElementById('music-minimize');
  
  if (audio) {
    audio.volume = 0.3;
    
    playPauseBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸';
      } else {
        audio.pause();
        playPauseBtn.textContent = '▶';
      }
    });
    
    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      muteBtn.textContent = audio.muted ? '🔇' : '🔊';
    });
    
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
      const percentage = e.target.value * 100;
      e.target.style.background = `linear-gradient(to right, #b7c9a8 0%, #b7c9a8 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
    });
    
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      minimizePlayer();
    });
    
    // Click to expand when minimized
    musicPlayer.addEventListener('click', (e) => {
      // Only expand if player is minimized and click is not on a control
      if (musicPlayerMinimized && !e.target.closest('button, input')) {
        expandPlayer();
      }
    });
  }
  
  // Auto-minimize after 10 seconds only if not already minimized
  if (autoMinimizeTimeout) {
    clearTimeout(autoMinimizeTimeout);
  }
  
  autoMinimizeTimeout = setTimeout(() => {
    if (!musicPlayerMinimized) {
      minimizePlayer();
    }
  }, 10000);

  console.log('[Music] Background music player created and initialized');
}

function minimizePlayer() {
  const player = document.getElementById('background-music-player');
  if (player && !musicPlayerMinimized) {
    musicPlayerMinimized = true;
    player.classList.remove('music-player-expanded');
    player.classList.add('music-player-minimized');
    
    // Clear any auto-minimize timeout
    if (autoMinimizeTimeout) {
      clearTimeout(autoMinimizeTimeout);
      autoMinimizeTimeout = null;
    }
    
    player.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 1000;
      background: rgba(253, 250, 246, 0.95);
      border: 1px solid var(--sage-green);
      border-radius: 50px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s ease;
      cursor: pointer;
      font-size: 20px;
      overflow: hidden;
    `;
    player.innerHTML = '🎵';
    console.log('[Music] Player minimized');
  }
}

function expandPlayer() {
  const player = document.getElementById('background-music-player');
  if (player && musicPlayerMinimized) {
    musicPlayerMinimized = false;
    
    // Clear any auto-minimize timeout
    if (autoMinimizeTimeout) {
      clearTimeout(autoMinimizeTimeout);
      autoMinimizeTimeout = null;
    }
    
    player.remove(); // Remove the minimized version
    createBackgroundMusicPlayer(); // Recreate the full player
    console.log('[Music] Player expanded');
  }
}

// ===== VIDEO CONTROLS & CHAPTER MARKERS =====
function initializeVideoPlayer() {
  const videoElement = document.getElementById('main-film-video');
  if (!videoElement || typeof videojs === 'undefined') {
    console.log('[Video] Video.js not available yet, retrying...');
    setTimeout(initializeVideoPlayer, 2000);
    return;
  }

  console.log('[Video] Initializing Video.js player...');
  const player = videojs('main-film-video');
  
  // Video event listeners for background music
  player.on('play', () => {
    const audio = document.getElementById('background-audio');
    if (audio && !audio.paused) {
      fadeOutMusic(audio, 1000);
    }
  });
  
  player.on('pause', () => {
    const audio = document.getElementById('background-audio');
    if (audio && musicPausedForVideo) {
      fadeInMusic(audio, 0.3, 1000);
    }
  });
  
  player.on('ended', () => {
    const audio = document.getElementById('background-audio');
    if (audio && musicPausedForVideo) {
      fadeInMusic(audio, 0.3, 1000);
    }
  });
  
  player.ready(() => {
    console.log('[Video] Player ready, adding chapter markers...');
    
    // Find chapters track
    let chaptersTrack = null;
    const tracks = player.textTracks();
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].kind === 'chapters') {
        tracks[i].mode = 'disabled';
        chaptersTrack = tracks[i];
        console.log(`[Video] Found chapters track: ${tracks[i].label}`);
        break;
      }
    }
    
    if (!chaptersTrack) {
      console.log('[Video] No chapters track found');
      return;
    }
    
    const addChapterMarkers = () => {
      const duration = player.duration();
      console.log(`[Video] Duration: ${duration} seconds`);
      
      if (!duration || duration === 0) {
        console.log('[Video] Duration not ready, retrying...');
        setTimeout(addChapterMarkers, 1000);
        return;
      }
      
      // Find progress holder
      const playerEl = player.el();
      const progressHolder = playerEl.querySelector('.vjs-progress-holder');
      
      if (!progressHolder) {
        console.log('[Video] Progress holder not found, retrying...');
        setTimeout(addChapterMarkers, 1000);
        return;
      }
      
      console.log('[Video] Progress holder found');
      progressHolder.style.position = 'relative';
      
      // Remove existing markers
      const existing = progressHolder.querySelectorAll('.inline-chapter-marker');
      existing.forEach(m => m.remove());
      
      // Check for cues
      if (!chaptersTrack.cues || chaptersTrack.cues.length === 0) {
        console.log('[Video] No cues loaded, retrying...');
        setTimeout(addChapterMarkers, 1000);
        return;
      }
      
      console.log(`[Video] Found ${chaptersTrack.cues.length} chapters`);
      
      let added = 0;
      Array.from(chaptersTrack.cues).forEach((cue, index) => {
        console.log(`[Video] Chapter ${index + 1}: "${cue.text}" at ${cue.startTime}s`);
        
        if (cue.startTime > duration) return;
        
        const percent = (cue.startTime / duration) * 100;
        const adjustedPercent = Math.max(percent, 0.5);
        
        const marker = document.createElement('div');
        marker.className = 'inline-chapter-marker';
        marker.setAttribute('data-chapter', cue.text);
        marker.setAttribute('data-time', cue.startTime);
        
        marker.style.cssText = `
          position: absolute !important;
          left: ${adjustedPercent}% !important;
          top: 0 !important;
          width: 3px !important;
          height: 100% !important;
          background: #8fa382 !important;
          opacity: 0.9 !important;
          pointer-events: none !important;
          z-index: 15 !important;
          display: block !important;
          border-radius: 1px !important;
        `;
        
        progressHolder.appendChild(marker);
        added++;
        console.log(`[Video] Added marker ${added}: "${cue.text}" at ${adjustedPercent.toFixed(1)}%`);
      });
      
      console.log(`[Video] Added ${added} chapter markers!`);
    };
    
    // Add markers with multiple triggers
    setTimeout(addChapterMarkers, 1000);
    player.one('loadedmetadata', () => setTimeout(addChapterMarkers, 500));
    player.one('play', () => setTimeout(addChapterMarkers, 500));
  });
}

// ===== MAP INITIALIZATION =====
let mapInitialized = false;

function initializeMap() {
  if (mapInitialized) {
    console.log('[Map] Map already initialized');
    return;
  }
  
  const mapElement = document.getElementById('guest-map');
  const mapSection = document.getElementById('map-section');
  
  if (!mapElement || !mapSection || typeof L === 'undefined') {
    console.log('[Map] Leaflet not available or map element not found');
    return;
  }

  console.log('[Map] Initializing map...');
  
  mapInitialized = true;
  
  // Clear any existing map
  if (guestMap) {
    guestMap.remove();
    guestMap = null;
  }
  
  // Initialize map centered globally initially
  guestMap = L.map('guest-map').setView([40.0, -95.0], 4);
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(guestMap);
  
  // Initialize empty markers array - no static locations
  guestMarkers = [];
  
  // Function to update map bounds based on markers
  function updateMapBounds() {
    if (guestMarkers.length > 0) {
      const group = new L.featureGroup(guestMarkers);
      guestMap.fitBounds(group.getBounds().pad(0.2));
    }
  }
  
  // Add share location button
  const shareLocationBtn = document.getElementById('share-location-btn');
  if (shareLocationBtn) {
    shareLocationBtn.addEventListener('click', (event) => {
      // Ensure this is a user gesture
      if (!event.isTrusted) {
        console.log('[Map] Geolocation request must be from user gesture');
        return;
      }
      
      console.log('[Map] User clicked share location button - requesting geolocation with user consent');
      
      if (navigator.geolocation) {
        shareLocationBtn.textContent = 'Getting your location...';
        shareLocationBtn.disabled = true;
        
        // Use strict options to prevent unnecessary prompts
        const options = {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        };
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Add user marker in red color (different from others)
            const userMarker = L.marker([userLat, userLng], {
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                shadowSize: [41, 41]
              })
            }).addTo(guestMap).bindPopup('<b>You are here!</b>');
            
            guestMarkers.push(userMarker);
            
            // Update map bounds to center around all pins
            updateMapBounds();
            
            shareLocationBtn.textContent = 'Location shared! ✓';
            shareLocationBtn.style.background = 'linear-gradient(135deg, #8fa382 0%, #b7c9a8 100%)';
            
            console.log('[Map] User location added and map bounds adjusted');
          },
          (error) => {
            console.log('[Map] Geolocation error:', error);
            shareLocationBtn.textContent = 'Location access denied';
            shareLocationBtn.disabled = false;
            setTimeout(() => {
              shareLocationBtn.textContent = 'Share My Location';
              shareLocationBtn.style.background = '';
            }, 3000);
          },
          options
        );
      } else {
        shareLocationBtn.textContent = 'Geolocation not supported';
        setTimeout(() => {
          shareLocationBtn.textContent = 'Share My Location';
        }, 3000);
      }
    });
  }
  
  // Manual pin functionality
  const manualPinBtn = document.getElementById('manual-pin-btn');
  if (manualPinBtn) {
    manualPinBtn.addEventListener('click', () => {
      guestMap.once('click', (e) => {
        // Add marker in blue color for manual pins
        const marker = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41]
          })
        }).addTo(guestMap).bindPopup('<b>Guest Pin</b><br>Manually added');
        
        guestMarkers.push(marker);
        
        // Update map bounds to include all pins
        updateMapBounds();
        
        console.log('[Map] Manual pin added and map centered');
      });
      
      guestMap.getContainer().style.cursor = 'crosshair';
      manualPinBtn.textContent = 'Click on the map to add your pin';
      manualPinBtn.disabled = true;
      
      setTimeout(() => {
        guestMap.getContainer().style.cursor = '';
        manualPinBtn.textContent = 'Drop a Pin on the Map';
        manualPinBtn.disabled = false;
      }, 10000);
    });
  }
  
  console.log('[Map] Map initialized successfully');
}

// ===== LAZY MAP INITIALIZATION =====
function initializeMapOnScroll() {
  const mapSection = document.getElementById('map-section');
  if (!mapSection) {
    console.log('[Map] Map section not found, skipping lazy initialization');
    return;
  }
  
  // Use Intersection Observer to initialize map when it's about to be visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting || entry.intersectionRatio > 0.1) {
        console.log('[Map] Map section coming into view, initializing...');
        initializeMap();
        observer.disconnect(); // Stop observing once initialized
      }
    });
  }, {
    rootMargin: '200px' // Start initializing 200px before the section is visible
  });
  
  observer.observe(mapSection);
  console.log('[Map] Lazy loading observer set up for map section');
}

// ===== ENGAGEMENT GALLERY AUTO-SCROLL =====
function initializeEngagementGallery() {
  const gallery = document.getElementById('engagement-gallery');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  
  if (!gallery) return;
  
  console.log('[Gallery] Initializing engagement gallery with navigation');
  
  // Gallery navigation functionality
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      const scrollAmount = gallery.clientWidth * 0.8;
      gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
      const scrollAmount = gallery.clientWidth * 0.8;
      gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    // Update button states based on scroll position
    const updateButtonStates = () => {
      const isAtStart = gallery.scrollLeft <= 10;
      const isAtEnd = gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 10;
      
      prevBtn.disabled = isAtStart;
      nextBtn.disabled = isAtEnd;
    };
    
    gallery.addEventListener('scroll', updateButtonStates);
    updateButtonStates(); // Initial state
  }
  
  console.log('[Gallery] Engagement gallery navigation initialized');
}

// ===== FIREBASE & SHARED ALBUM =====
function initializeSharedAlbum() {
  if (typeof firebase === 'undefined') {
    console.log('[Firebase] Firebase not available');
    return;
  }
  
  console.log('[Firebase] Initializing shared album...');
  
  const uploadForm = document.getElementById('photo-upload-form');
  const gallery = document.getElementById('shared-photo-gallery');
  
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('photo-name').value;
      const file = document.getElementById('photo-file').files[0];
      
      if (!name || !file) return;
      
      try {
        const timestamp = Date.now();
        const storageRef = firebase.storage().ref(`shared-photos/${timestamp}-${file.name}`);
        
        const uploadTask = storageRef.put(file);
        
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`[Firebase] Upload ${progress}% done`);
          },
          (error) => {
            console.error('[Firebase] Upload error:', error);
          },
          async () => {
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            
            await firebase.database().ref('shared-photos').push({
              name: name,
              url: downloadURL,
              timestamp: timestamp
            });
            
            console.log('[Firebase] Photo uploaded successfully');
            uploadForm.reset();
            loadSharedPhotos();
          }
        );
      } catch (error) {
        console.error('[Firebase] Error uploading photo:', error);
      }
    });
  }
  
  loadSharedPhotos();
}

function loadSharedPhotos() {
  const gallery = document.getElementById('shared-photo-gallery');
  if (!gallery) return;
  
  firebase.database().ref('shared-photos').on('value', (snapshot) => {
    gallery.innerHTML = '';
    
    const photos = snapshot.val();
    if (photos) {
      Object.values(photos).forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = `Photo by ${photo.name}`;
        img.style.cssText = 'height: 200px; border-radius: 8px; margin: 5px; object-fit: cover;';
        gallery.appendChild(img);
      });
    }
  });
}

// ===== GUESTBOOK =====
function initializeGuestbook() {
  const guestbookForm = document.getElementById('guestbook-form');
  const messagesContainer = document.getElementById('guestbook-messages');
  
  if (!guestbookForm || typeof firebase === 'undefined') return;
  
  console.log('[Guestbook] Initializing...');
  
  guestbookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('guest-name').value;
    const message = document.getElementById('guest-message').value;
    
    if (!name || !message) return;
    
    try {
      await firebase.database().ref('guestbook').push({
        name: name,
        message: message,
        timestamp: Date.now()
      });
      
      console.log('[Guestbook] Message submitted successfully');
      guestbookForm.reset();
    } catch (error) {
      console.error('[Guestbook] Error submitting message:', error);
    }
  });
  
  // Load existing messages
  firebase.database().ref('guestbook').on('value', (snapshot) => {
    messagesContainer.innerHTML = '';
    
    const messages = snapshot.val();
    if (messages) {
      Object.values(messages)
        .sort((a, b) => b.timestamp - a.timestamp)
        .forEach(msg => {
          const messageDiv = document.createElement('div');
          messageDiv.style.cssText = 'background: white; padding: 15px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);';
          messageDiv.innerHTML = `
            <strong>${msg.name}</strong>
            <p style="margin: 8px 0 0 0; color: #666;">${msg.message}</p>
          `;
          messagesContainer.appendChild(messageDiv);
        });
    }
  });
}

// ===== GEOLOCATION MONITORING =====
// Override geolocation to monitor any unauthorized access
if (navigator.geolocation) {
  const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
  navigator.geolocation.getCurrentPosition = function(success, error, options) {
    console.log('[Geolocation] getCurrentPosition called from:', new Error().stack);
    return originalGetCurrentPosition.call(this, success, error, options);
  };
  
  const originalWatchPosition = navigator.geolocation.watchPosition;
  navigator.geolocation.watchPosition = function(success, error, options) {
    console.log('[Geolocation] watchPosition called from:', new Error().stack);
    return originalWatchPosition.call(this, success, error, options);
  };
}

// ===== MAIN INITIALIZATION FUNCTION =====
function initializeDynamicFeatures() {
  if (dynamicFeaturesInitialized) {
    console.log('[Init] Dynamic features already initialized');
    return;
  }
  
  console.log('[Init] Initializing all dynamic features...');
  
  // Initialize all components
  setTimeout(() => {
    createBackgroundMusicPlayer();
    initializeVideoPlayer();
    initializeMapOnScroll(); // Use lazy loading for map
    initializeEngagementGallery();
    initializeSharedAlbum();
    initializeGuestbook();
    
    dynamicFeaturesInitialized = true;
    console.log('[Init] All dynamic features initialized');
  }, 1000);
}

// Make function globally available
window.initializeDynamicFeatures = initializeDynamicFeatures;

// Auto-initialize if main content is already visible
if (document.getElementById('family-tree')) {
  console.log('[Init] Main content detected, initializing features...');
  initializeDynamicFeatures();
}

// ===== MUSIC FADE FUNCTIONS =====
function fadeOutMusic(audio, duration = 1000, callback) {
  if (!audio || audio.paused) {
    if (callback) callback();
    return;
  }
  
  const startVolume = audio.volume;
  const fadeOutInterval = 50;
  const volumeStep = startVolume / (duration / fadeOutInterval);
  
  const fade = setInterval(() => {
    if (audio.volume > volumeStep) {
      audio.volume = Math.max(0, audio.volume - volumeStep);
    } else {
      audio.volume = 0;
      musicPausedPosition = audio.currentTime;
      audio.pause();
      clearInterval(fade);
      musicPausedForVideo = true;
      console.log('[Music] Faded out and paused for video');
      if (callback) callback();
    }
  }, fadeOutInterval);
}

function fadeInMusic(audio, targetVolume = 0.3, duration = 1000) {
  if (!audio || musicPausedForVideo === false) return;
  
  audio.currentTime = musicPausedPosition;
  audio.volume = 0;
  audio.play().then(() => {
    const fadeInInterval = 50;
    const volumeStep = targetVolume / (duration / fadeInInterval);
    
    const fade = setInterval(() => {
      if (audio.volume < targetVolume - volumeStep) {
        audio.volume = Math.min(targetVolume, audio.volume + volumeStep);
      } else {
        audio.volume = targetVolume;
        clearInterval(fade);
        musicPausedForVideo = false;
        console.log('[Music] Faded in and resumed from position');
      }
    }, fadeInInterval);
  }).catch(err => console.log('[Music] Resume play error:', err));
}
