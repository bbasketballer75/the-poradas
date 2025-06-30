// Main JavaScript file for The Poradas Wedding Website
// This event is fired from index.html after all prompts are handled.

// Global flag to prevent multiple initializations
let dynamicFeaturesInitialized = false;

// --- Background Music Player ---
let backgroundMusicPlayer = null;
let isBackgroundMusicMuted = false;

function createBackgroundMusicPlayer() {
  // Prevent creating multiple music players
  if (document.getElementById('background-music-player')) {
    console.log('[Music] Background music player already exists, aborting creation.');
    return;
  }
  
  // Create floating music player
  const musicPlayer = document.createElement('div');
  musicPlayer.id = 'background-music-player';
  musicPlayer.className = 'music-player-expanded';
  musicPlayer.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    background: rgba(253, 250, 246, 0.95);
    border: 1px solid var(--sage-green, #b7c9a8);
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 300px;
    max-width: 350px;
    transition: all 0.4s ease;
    font-family: 'Montserrat', sans-serif;
    opacity: 0;
    transform: translateY(100px);
    cursor: pointer;
  `;

  musicPlayer.innerHTML = `
    <div id="music-title-container" style="
      width: 100%;
      overflow: hidden;
      position: relative;
      height: 20px;
      margin-bottom: 10px;
      text-align: center;
    ">
      <div id="music-title" style="
        font-size: 14px;
        font-weight: 600;
        color: var(--text-dark, #4a4a4a);
        white-space: nowrap;
        position: absolute;
        animation: none;
        font-family: 'Montserrat', sans-serif;
        width: 100%;
      ">Wedding Music</div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
      <div style="display: flex; gap: 2px;">
        <button id="music-prev" style="
          background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%);
          border: 1px solid rgba(143, 163, 130, 0.3);
          color: white;
          font-size: 10px;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 4px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">⏮</button>
        <button id="music-play-pause" style="
          background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%);
          border: 1px solid rgba(143, 163, 130, 0.3);
          color: white;
          font-size: 12px;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 4px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          width: 28px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">⏸</button>
        <button id="music-next" style="
          background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%);
          border: 1px solid rgba(143, 163, 130, 0.3);
          color: white;
          font-size: 10px;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 4px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">⏭</button>
      </div>
      <div style="
        flex: 1;
        margin: 0 8px;
        height: 6px;
        background: rgba(183, 201, 168, 0.3);
        border-radius: 3px;
        position: relative;
      ">
        <div id="music-progress" style="
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #b7c9a8 0%, #8fa382 100%);
          border-radius: 3px;
          transition: width 0.1s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        "></div>
      </div>
      <button id="music-volume" style="
        background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%);
        border: 1px solid rgba(143, 163, 130, 0.3);
        color: white;
        font-size: 12px;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 4px;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        width: 28px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">🔊</button>
    </div>
    <div id="music-note-icon" style="
      display: none;
      font-size: 24px;
      color: var(--sage-green-dark, #8fa382);
      animation: musicPulse 2s ease-in-out infinite;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    ">🎵</div>
    <audio id="background-audio" loop preload="auto">
      <source src="audio/wedding-background.mp3" type="audio/mpeg">
      <source src="audio/wedding-background.ogg" type="audio/ogg">
    </audio>
  `;

  // Add CSS for minimized state and animation
  const musicPlayerStyle = document.createElement('style');
  musicPlayerStyle.textContent = `
    @keyframes musicPulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
    }
    
    @keyframes scrollText {
      0% { transform: translateX(100%); }
      10% { transform: translateX(100%); }
      90% { transform: translateX(-100%); }
      100% { transform: translateX(-100%); }
    }
    
    .music-player-minimized {
      min-width: 50px !important;
      width: 50px !important;
      height: 50px !important;
      border-radius: 50% !important;
      padding: 0 !important;
      justify-content: center !important;
      align-items: center !important;
      background: rgba(255, 255, 255, 0.7) !important;
      border: 1px solid #ccc !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
      backdrop-filter: blur(8px) !important;
      display: flex !important;
      transition: all 0.4s ease !important;
    }
    
    .music-player-hidden {
      min-width: 20px !important;
      width: 20px !important;
      height: 20px !important;
      opacity: 0.3 !important;
      transform: scale(0.4) !important;
      transition: all 0.4s ease !important;
    }
    
    .music-player-hidden:hover,
    .music-player-hidden:focus {
      min-width: 50px !important;
      width: 50px !important;
      height: 50px !important;
      opacity: 1 !important;
      transform: scale(1) !important;
    }
    
    .music-player-minimized #music-title-container,
    .music-player-minimized button,
    .music-player-minimized div:not(#music-note-icon) {
      display: none !important;
    }
    
    .music-player-minimized #music-note-icon {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
    }
    
    .music-player-expanded #music-note-icon {
      display: none !important;
    }
    
    .music-player-expanded #music-title-container,
    .music-player-expanded #music-controls,
    .music-player-expanded #music-volume {
      display: flex !important;
    }
    
    .scrolling-title {
      animation: scrollText 8s linear infinite;
    }
    
    #music-controls button:hover,
    #music-volume:hover {
      background: linear-gradient(135deg, #8fa382 0%, #7a926e 100%) !important;
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(0,0,0,0.15) !important;
    }
    
    #music-controls button:active,
    #music-volume:active {
      transform: translateY(0);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
    }
  `;
  document.head.appendChild(musicPlayerStyle);

  document.body.appendChild(musicPlayer);

  // Get audio element and controls
  const audio = document.getElementById('background-audio');
  const playPauseBtn = document.getElementById('music-play-pause');
  const prevBtn = document.getElementById('music-prev');
  const nextBtn = document.getElementById('music-next');
  const volumeBtn = document.getElementById('music-volume');
  const progressBar = document.getElementById('music-progress');
  const musicTitle = document.getElementById('music-title');
  const musicTitleContainer = document.getElementById('music-title-container');

  backgroundMusicPlayer = audio;

  // Music tracks array (can be expanded with more tracks)
  const musicTracks = [
    { title: "Wedding Background Music", src: "audio/wedding-background" },
    { title: "Romantic Piano Melody", src: "audio/romantic-piano" },
    { title: "Love Song Instrumental", src: "audio/love-song" }
  ];
  let currentTrackIndex = 0;

  // Function to check if title needs scrolling
  function setupTitleScrolling() {
    setTimeout(() => {
      const containerWidth = musicTitleContainer.offsetWidth;
      const titleWidth = musicTitle.scrollWidth;
      
      if (titleWidth > containerWidth) {
        musicTitle.classList.add('scrolling-title');
        musicTitle.style.animationDuration = `${Math.max(8, titleWidth / 20)}s`;
      } else {
        musicTitle.classList.remove('scrolling-title');
        musicTitle.style.animation = 'none';
      }
    }, 100);
  }

  // Function to load a track
  function loadTrack(index) {
    const track = musicTracks[index];
    if (track) {
      // Clear existing sources
      while (audio.firstChild) {
        audio.removeChild(audio.firstChild);
      }
      
      // Add new sources
      const mp3Source = document.createElement('source');
      mp3Source.src = track.src + '.mp3';
      mp3Source.type = 'audio/mpeg';
      audio.appendChild(mp3Source);
      
      const oggSource = document.createElement('source');
      oggSource.src = track.src + '.ogg';
      oggSource.type = 'audio/ogg';
      audio.appendChild(oggSource);
      
      // Update title
      musicTitle.textContent = track.title;
      setupTitleScrolling();
      
      // Reload audio
      audio.load();
    }
  }

  // Load initial track
  loadTrack(currentTrackIndex);

  // Error handling for missing audio files
  audio.addEventListener('error', (e) => {
    console.log('[Audio] Background music file not found - this is normal until audio files are added');
    musicPlayer.style.display = 'none'; // Hide player if no audio available
  });

  audio.addEventListener('canplaythrough', () => {
    console.log('[Audio] Background music loaded successfully');
  });

  // Auto-minimize and auto-hide functionality
  let minimizeTimer = null;
  let hideTimer = null;
  let isMinimized = false;
  let isHidden = false;

  function minimizePlayer() {
    if (!isMinimized) {
      musicPlayer.className = 'music-player-minimized';
      isMinimized = true;
      // Start hide timer after minimizing
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hidePlayer, 10000); // Hide after 10 seconds
    }
  }

  function hidePlayer() {
    if (isMinimized && !isHidden) {
      musicPlayer.classList.add('music-player-hidden');
      isHidden = true;
    }
  }

  function showPlayer() {
    if (isHidden) {
      musicPlayer.classList.remove('music-player-hidden');
      isHidden = false;
      // Reset hide timer
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hidePlayer, 10000);
    }
  }

  function expandPlayer() {
    if (isMinimized) {
      musicPlayer.className = 'music-player-expanded';
      isMinimized = false;
      isHidden = false;
      // Reset timers when expanded
      clearTimeout(minimizeTimer);
      clearTimeout(hideTimer);
      minimizeTimer = setTimeout(minimizePlayer, 5000);
    }
  }

  // Click to expand when minimized or show when hidden
  musicPlayer.addEventListener('click', () => {
    if (isHidden) {
      showPlayer();
    } else if (isMinimized) {
      expandPlayer();
    }
  });

  // Hover to show when hidden
  musicPlayer.addEventListener('mouseenter', () => {
    if (isHidden) {
      showPlayer();
    }
  });

  // Mouse leave - restart hide timer if minimized
  musicPlayer.addEventListener('mouseleave', () => {
    if (isMinimized && !isHidden) {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hidePlayer, 10000);
    }
  });

  // Prevent click events on buttons from bubbling to parent
  const buttons = musicPlayer.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      // Reset minimize timer when interacting with controls
      if (!isMinimized) {
        clearTimeout(minimizeTimer);
        minimizeTimer = setTimeout(minimizePlayer, 5000);
      }
    });
  });

  // Play/Pause functionality
  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(e => console.log('Audio play failed:', e));
      playPauseBtn.textContent = '⏸️';
    } else {
      audio.pause();
      playPauseBtn.textContent = '▶️';
    }
  });

  // Previous track functionality
  prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    const wasPlaying = !audio.paused;
    loadTrack(currentTrackIndex);
    if (wasPlaying) {
      audio.play().catch(e => console.log('Audio play failed:', e));
      playPauseBtn.textContent = '⏸️';
    }
  });

  // Next track functionality
  nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    const wasPlaying = !audio.paused;
    loadTrack(currentTrackIndex);
    if (wasPlaying) {
      audio.play().catch(e => console.log('Audio play failed:', e));
      playPauseBtn.textContent = '⏸️';
    }
  });

  // Volume toggle
  volumeBtn.addEventListener('click', () => {
    if (audio.muted) {
      audio.muted = false;
      volumeBtn.textContent = '🔊';
      isBackgroundMusicMuted = false;
    } else {
      audio.muted = true;
      volumeBtn.textContent = '🔇';
      isBackgroundMusicMuted = true;
    }
  });

  // Progress bar update
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = progress + '%';
    }
  });

  // Auto-start music after a short delay
  setTimeout(() => {
    audio.play().catch(e => {
      console.log('Auto-play failed, user interaction required:', e);
      playPauseBtn.textContent = '▶️';
    });
    
    // Show player with animation
    musicPlayer.style.opacity = '1';
    musicPlayer.style.transform = 'translateY(0)';
    
    // Setup title scrolling after player is visible
    setTimeout(setupTitleScrolling, 500);
    
    // Start auto-minimize timer
    minimizeTimer = setTimeout(minimizePlayer, 5000);
  }, 1000);

  // Auto-track change when song ends (if not looping)
  audio.addEventListener('ended', () => {
    if (!audio.loop) {
      nextBtn.click(); // Automatically go to next track
    }
  });

  // Setup title scrolling when window resizes
  window.addEventListener('resize', setupTitleScrolling);

  return audio;
}

// Function to mute background music when main video plays
function muteBackgroundMusic() {
  if (backgroundMusicPlayer && !backgroundMusicPlayer.paused) {
    backgroundMusicPlayer.volume = 0.1; // Lower volume instead of pausing
    console.log('[Audio] Background music volume lowered for main video');
  }
}

// Function to restore background music when main video stops
function restoreBackgroundMusic() {
  if (backgroundMusicPlayer && !backgroundMusicPlayer.paused) {
    backgroundMusicPlayer.volume = 0.7; // Restore normal volume
    console.log('[Audio] Background music volume restored');
  }
}

// --- Request User Location for Map (triggered by user interaction) ---
function requestUserLocation() {
  if ('geolocation' in navigator) {
    console.log('[Geolocation] Requesting user location...');
    navigator.geolocation.getCurrentPosition(
      function(position) {
        window.guestLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log('[Geolocation] Location obtained:', window.guestLocation);
        
        // If map is already initialized, add the pin immediately
        if (window.mapInitialized && window.currentMap) {
          const { latitude: lat, longitude: lng } = window.guestLocation;
          addGuestLocationPin(window.currentMap, lat, lng);
          window.currentMap.setView([lat, lng], 8);
          if (window.db) {
            window.db.ref('guest-pins').push({ lat, lng, time: Date.now() });
          }
          console.log('[Geolocation] Added colored location pin to existing map and centered.');
        }
      },
      function(error) {
        console.log('[Geolocation] Location request failed:', error.message);
        // Don't show alert, just fall back to manual pin option
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  } else {
    console.log('[Geolocation] Geolocation not supported by browser.');
  }
}

function initializeDynamicFeatures() {
  // Prevent multiple initializations
  if (dynamicFeaturesInitialized) {
    console.log('[Init] Dynamic features already initialized, skipping.');
    return;
  }
  
  console.log('Initializing website modules after main content injection.');

  // Initialize background music player (only once)
  if (!document.getElementById('background-music-player')) {
    createBackgroundMusicPlayer();
  } else {
    console.log('[Music] Background music player already exists, skipping creation.');
  }

  // Mark as initialized
  dynamicFeaturesInitialized = true;

  // --- Initialize Main Film Player with Video.js (only once) ---
  if (!window.mainFilmPlayerInitialized) {
    console.log('[Video] Initializing main film player...');
    const mainFilmPlayer = videojs('main-film-video');
    window.mainFilmPlayerInitialized = true;
    
    mainFilmPlayer.ready(function() {
    // Configure player to have controls in separate area
    const player = this;
    
    // Integrate with background music
    player.on('play', () => {
      muteBackgroundMusic();
    });
    
    player.on('pause', () => {
      restoreBackgroundMusic();
    });
    
    player.on('ended', () => {
      restoreBackgroundMusic();
    });
    const videoContainer = player.el();
    
    // Add custom styling to ensure controls don't overlay video content
    const playerStyle = document.createElement('style');
    playerStyle.textContent = `
      /* Ensure video container doesn't cut off controls */
      #main-film-player-container {
        border-radius: 12px !important;
        overflow: visible !important;
        box-shadow: 0 8px 25px rgba(0,0,0,0.08) !important;
        background: #fdfaf6 !important;
      }
      
      .video-js {
        border-radius: 12px !important;
        overflow: hidden !important;
        display: block !important;
        padding-bottom: 0 !important;
        height: auto !important;
        background: #fdfaf6 !important;
      }
      
      .video-js .vjs-tech,
      .video-js .vjs-poster {
        border-radius: 12px 12px 0 0 !important;
        object-fit: contain !important;
        width: 100% !important;
        height: auto !important;
      }
      
      .video-js .vjs-control-bar {
        position: relative !important;
        bottom: auto !important;
        background: #fdfaf6 !important;
        color: var(--text-dark, #4a4a4a) !important;
        height: auto !important;
        min-height: 42px !important;
        padding: 8px 12px !important;
        margin: 0 !important;
        border-radius: 0 0 12px 12px !important;
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        box-sizing: border-box !important;
        border-top: 1px solid rgba(183, 201, 168, 0.2) !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      /* Force controls to always be visible for debugging */
      .video-js:not(.vjs-user-inactive) .vjs-control-bar,
      .video-js.vjs-user-inactive .vjs-control-bar {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
        transition: none !important;
      }
      
      .video-js.vjs-user-inactive {
        cursor: default !important;
      }
      
      .video-js .vjs-control-bar .vjs-button {
        color: var(--sage-green-dark, #8fa382) !important;
        margin: 0 2px !important;
        opacity: 1 !important;
        height: 32px !important;
        width: 32px !important;
        border-radius: 6px !important;
        transition: all 0.2s ease !important;
      }
      
      .video-js .vjs-control-bar .vjs-button:hover {
        color: var(--sage-green, #b7c9a8) !important;
        background: rgba(183, 201, 168, 0.1) !important;
        transform: scale(1.05) !important;
      }
      
      .video-js .vjs-control-bar .vjs-time-control {
        color: var(--text-light, #7a7a7a) !important;
        font-size: 12px !important;
        margin: 0 6px !important;
        font-weight: 500 !important;
        min-width: auto !important;
      }
      
      .video-js .vjs-control-bar .vjs-progress-control {
        flex: 1 !important;
        margin: 0 8px !important;
        height: 6px !important;
      }
      
      .video-js .vjs-progress-holder {
        height: 6px !important;
        border-radius: 3px !important;
        background: rgba(183, 201, 168, 0.3) !important;
        position: relative !important;
      }
      
      .video-js .vjs-play-progress {
        background: linear-gradient(90deg, #b7c9a8 0%, #8fa382 100%) !important;
        border-radius: 3px !important;
      }
      
      .video-js .vjs-volume-level {
        background: linear-gradient(90deg, #b7c9a8 0%, #8fa382 100%) !important;
      }
      
      /* Ensure chapter names don't show */
      .video-js .vjs-text-track-display {
        display: none !important;
      }
      
      /* Force progress control to be always visible for debugging */
      .video-js .vjs-progress-control {
        opacity: 1 !important;
        visibility: visible !important;
        display: flex !important;
      }
      
      .video-js .vjs-progress-holder {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
      }
      
      /* Hide picture-in-picture button and any duplicate cast buttons */
      .video-js .vjs-picture-in-picture-control,
      .video-js .vjs-cast-button,
      .video-js .vjs-cast-control,
      .video-js .vjs-download-control {
        display: none !important;
      }
      
      /* Show only our custom buttons */
      .video-js .custom-cast-button,
      .video-js .custom-download-button {
        display: block !important;
      }
    `;
    document.head.appendChild(playerStyle);
    
    // Add custom cast and download buttons (only once)
    const castButton = document.createElement('button');
    castButton.className = 'custom-cast-button vjs-control vjs-button';
    castButton.innerHTML = `<img src="https://brandlogo.org/wp-content/uploads/2024/06/Google-Cast-Icon.png.webp" width="18" height="18" style="filter: brightness(0) saturate(100%) invert(46%) sepia(38%) saturate(347%) hue-rotate(78deg) brightness(95%) contrast(89%); transition: filter 0.2s ease;" alt="Cast">`;
    castButton.title = 'Cast to TV';
    castButton.style.cssText = `
      color: var(--sage-green-dark, #8fa382) !important;
      margin: 0 2px !important;
      height: 32px !important;
      width: 32px !important;
      border: none !important;
      background: transparent !important;
      border-radius: 6px !important;
      transition: all 0.2s ease !important;
      font-size: 16px !important;
      cursor: pointer !important;
      display: block !important;
    `;
    
    const downloadButton = document.createElement('button');
    downloadButton.className = 'custom-download-button vjs-control vjs-button';
    downloadButton.innerHTML = `<img src="images/download-file-round-icon.svg" width="18" height="18" style="filter: brightness(0) saturate(100%) invert(46%) sepia(38%) saturate(347%) hue-rotate(78deg) brightness(95%) contrast(89%); transition: filter 0.2s ease;" alt="Download">`;
    downloadButton.title = 'Download Video';
    downloadButton.style.cssText = `
      color: var(--sage-green-dark, #8fa382) !important;
      margin: 0 2px !important;
      height: 32px !important;
      width: 32px !important;
      border: none !important;
      background: transparent !important;
      border-radius: 6px !important;
      transition: all 0.2s ease !important;
      font-size: 16px !important;
      cursor: pointer !important;
      display: block !important;
    `;
    
    // Cast button functionality
    castButton.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(183, 201, 168, 0.1)';
      this.style.transform = 'scale(1.05)';
      // Change icon color to lighter sage green on hover
      const img = this.querySelector('img');
      if (img) {
        img.style.filter = 'brightness(0) saturate(100%) invert(69%) sepia(25%) saturate(347%) hue-rotate(78deg) brightness(105%) contrast(89%)';
      }
    });
    
    castButton.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
      this.style.transform = 'scale(1)';
      // Reset icon color to normal sage green
      const img = this.querySelector('img');
      if (img) {
        img.style.filter = 'brightness(0) saturate(100%) invert(46%) sepia(38%) saturate(347%) hue-rotate(78deg) brightness(95%) contrast(89%)';
      }
    });
    
    castButton.addEventListener('click', function() {
      if ('presentation' in navigator) {
        const presentationRequest = new PresentationRequest([window.location.href]);
        presentationRequest.start()
          .then(connection => {
            console.log('Connected to presentation:', connection);
          })
          .catch(error => {
            console.log('Presentation failed:', error);
            // Fallback: try picture-in-picture
            if (document.pictureInPictureEnabled && !player.el().querySelector('video').disablePictureInPicture) {
              player.el().querySelector('video').requestPictureInPicture();
            } else {
              alert('Casting not supported. Try using Chrome and ensure your casting device is available.');
            }
          });
      } else {
        alert('To cast this video, please use Chrome browser and ensure your casting device is available.');
      }
    });
    
    // Download button functionality
    downloadButton.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(183, 201, 168, 0.1)';
      this.style.transform = 'scale(1.05)';
      // Change icon color to lighter sage green on hover
      const img = this.querySelector('img');
      if (img) {
        img.style.filter = 'brightness(0) saturate(100%) invert(69%) sepia(25%) saturate(347%) hue-rotate(78deg) brightness(105%) contrast(89%)';
      } else {
        // Fallback for emoji
        this.style.color = 'var(--sage-green, #b7c9a8)';
      }
    });
    
    downloadButton.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
      this.style.transform = 'scale(1)';
      // Reset icon color to normal sage green
      const img = this.querySelector('img');
      if (img) {
        img.style.filter = 'brightness(0) saturate(100%) invert(46%) sepia(38%) saturate(347%) hue-rotate(78deg) brightness(95%) contrast(89%)';
      } else {
        // Fallback for emoji
        this.style.color = 'var(--sage-green-dark, #8fa382)';
      }
    });
    
    downloadButton.addEventListener('click', function() {
      const videoSrc = player.currentSrc();
      if (videoSrc) {
        const link = document.createElement('a');
        link.href = videoSrc;
        link.download = 'wedding-video.mp4';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Video source not available for download.');
      }
    });
    
    // Add buttons to control bar (only once, with unique check)
    player.ready(function() {
      const controlBar = player.controlBar.el();
      
      // Only add if buttons don't already exist
      if (!controlBar.querySelector('.custom-cast-button') && !controlBar.querySelector('.custom-download-button')) {
        const fullscreenButton = controlBar.querySelector('.vjs-fullscreen-control');
        if (fullscreenButton && fullscreenButton.parentNode) {
          fullscreenButton.parentNode.insertBefore(downloadButton, fullscreenButton.nextSibling);
          fullscreenButton.parentNode.insertBefore(castButton, downloadButton);
        } else {
          controlBar.appendChild(castButton);
          controlBar.appendChild(downloadButton);
        }
      }
    });
    
    const tracks = this.textTracks();
    
    // Find and configure chapter tracks
    let chaptersTrack = null;
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].kind === 'chapters') {
        // Set to hidden mode instead of disabled to allow programmatic access
        tracks[i].mode = 'hidden'; // Hidden allows access but doesn't show UI
        chaptersTrack = tracks[i];
        console.log(`🔧 Found and configured chapters track: ${tracks[i].label}`);
        break;
      }
    }
    
    // Add chapter markers functionality
    this.addChapterMarkers = function() {
      console.log('🔧 Starting chapter marker addition...');
      
      // Title case helper function
      function toTitleCase(str) {
        return str.replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }
      
      // Find chapters track
      let chaptersTrack = null;
      const tracks = player.textTracks();
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].kind === 'chapters') {
          chaptersTrack = tracks[i];
          console.log(`✅ Found chapters track: ${tracks[i].label}`);
          break;
        }
      }
      
      if (!chaptersTrack) {
        console.log('❌ No chapters track found');
        return;
      }
      
      const addInlineMarkers = () => {
        const duration = player.duration();
        console.log(`📊 Current duration: ${duration} seconds`);
        
        if (!duration || duration === 0) {
          console.log('⏳ Duration not ready, retrying...');
          setTimeout(addInlineMarkers, 1000);
          return;
        }
        
        // Find progress holder
        const playerEl = player.el();
        let progressHolder = playerEl.querySelector('.vjs-progress-holder');
        
        if (!progressHolder) {
          console.log('❌ Progress holder not found, trying alternatives...');
          const alternatives = [
            '.vjs-progress-control .vjs-slider',
            '.vjs-progress-control'
          ];
          for (const selector of alternatives) {
            progressHolder = playerEl.querySelector(selector);
            if (progressHolder) {
              console.log(`✅ Found progress element: ${selector}`);
              break;
            }
          }
          
          if (!progressHolder) {
            console.log('❌ No progress element found, retrying...');
            setTimeout(addInlineMarkers, 1000);
            return;
          }
        }
        
        // Ensure proper positioning
        if (getComputedStyle(progressHolder).position === 'static') {
          progressHolder.style.position = 'relative';
        }
        
        // Remove existing markers
        const existing = progressHolder.querySelectorAll('.inline-chapter-marker');
        existing.forEach(m => m.remove());
        console.log(`🧹 Removed ${existing.length} existing markers`);
        
        // Check for cues
        if (!chaptersTrack.cues || chaptersTrack.cues.length === 0) {
          console.log('⏳ No cues loaded, retrying...');
          setTimeout(addInlineMarkers, 1000);
          return;
        }
        
        console.log(`📋 Found ${chaptersTrack.cues.length} chapters`);
        
        let added = 0;
        Array.from(chaptersTrack.cues).forEach((cue, index) => {
          // Adjust for VTT file starting at 1:00:00 instead of 0:00:00
          // DaVinci Resolve exports chapters starting at 1 hour, so subtract 3600 seconds
          const adjustedStartTime = Math.max(0, cue.startTime - 3600); // Subtract 1 hour (3600 seconds)
          
          console.log(`🔍 Chapter ${index + 1}: "${toTitleCase(cue.text)}" at ${cue.startTime}s (DaVinci time) -> ${adjustedStartTime}s (adjusted time)`);
          
          // Only add markers within video duration (with some tolerance)
          if (adjustedStartTime >= duration) {
            console.log(`⏭️ Skipping - beyond duration (${adjustedStartTime}s >= ${duration}s)`);
            return;
          }
          
          // Ensure we're within reasonable bounds
          if (adjustedStartTime < 0) {
            console.log(`⏭️ Skipping - negative time after adjustment: ${adjustedStartTime}s`);
            return;
          }
          
          const percent = (adjustedStartTime / duration) * 100;
          const adjustedPercent = Math.max(percent, 0.5); // Minimum 0.5% from left edge
          
          console.log(`📍 Placing marker at ${adjustedPercent.toFixed(2)}% (${adjustedStartTime}s of ${duration}s)`);
          
          const marker = document.createElement('div');
          marker.className = 'inline-chapter-marker';
          marker.setAttribute('data-chapter', toTitleCase(cue.text));
          marker.setAttribute('data-time', adjustedStartTime);
          
          marker.style.cssText = `
            position: absolute !important;
            left: ${adjustedPercent}% !important;
            top: 0px !important;
            width: 3px !important;
            height: 100% !important;
            background: #b7c9a8 !important;
            opacity: 0.9 !important;
            pointer-events: auto !important;
            z-index: 10 !important;
            display: block !important;
            border-radius: 1px !important;
            box-shadow: 0 0 2px rgba(183, 201, 168, 0.8) !important;
            cursor: pointer !important;
          `;
          
          // Add click handler for seeking
          marker.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`🎯 Seeking to chapter: "${toTitleCase(cue.text)}" at ${adjustedStartTime}s`);
            player.currentTime(adjustedStartTime);
          });
          
          progressHolder.appendChild(marker);
          added++;
          console.log(`✅ Added marker ${added}: "${toTitleCase(cue.text)}" at ${adjustedPercent.toFixed(1)}%`);
        });
        
        console.log(`🎉 FINAL: Added ${added} interactive chapter markers!`);
      };
      
      // Try adding markers with multiple triggers
      setTimeout(addInlineMarkers, 1000);
      player.one('loadedmetadata', () => {
        console.log('📊 Metadata loaded');
        setTimeout(addInlineMarkers, 500);
      });
      player.one('play', () => {
        console.log('▶️ Play started');
        setTimeout(addInlineMarkers, 500);
      });
    };
    
    // Call chapter markers after a delay with multiple attempts
    console.log('🎬 Setting up chapter markers initialization...');
    
    // Immediate attempt
    setTimeout(() => {
      console.log('🕐 First attempt to add chapter markers...');
      if (this.addChapterMarkers) {
        this.addChapterMarkers();
      }
    }, 1000);
    
    // Second attempt after longer delay
    setTimeout(() => {
      console.log('🕑 Second attempt to add chapter markers...');
      if (this.addChapterMarkers) {
        this.addChapterMarkers();
      }
    }, 3000);
    
    // Third attempt on loadedmetadata
    this.one('loadedmetadata', () => {
      console.log('📊 Metadata loaded - attempting chapter markers...');
      setTimeout(() => {
        if (this.addChapterMarkers) {
          this.addChapterMarkers();
        }
      }, 500);
    });
    
    // Fourth attempt on canplay
    this.one('canplay', () => {
      console.log('▶️ Can play - attempting chapter markers...');
      setTimeout(() => {
        if (this.addChapterMarkers) {
          this.addChapterMarkers();
        }
      }, 500);
    });
    
    // Handle video overlay click (only shows overlay image, no text/button)
    const videoOverlay = document.getElementById('video-play-overlay');
    if (videoOverlay) {
      console.log('[Video] Setting up overlay click handler...');
      videoOverlay.addEventListener('click', () => {
        console.log('[Video] Overlay clicked, starting playback');
        videoOverlay.classList.add('hidden');
        player.play();
      });
      
      // Also hide overlay when video starts playing
      player.on('play', () => {
        videoOverlay.classList.add('hidden');
      });
    }
    
  });
  } // Close the video player initialization if block

  // --- Enhanced Interactive Photo Albums with Navigation ---
  (function() {
    let albumModals = {};
    
    // Enhanced gallery interaction for all photo galleries
    function setupGalleryInteractions() {
      const galleries = document.querySelectorAll('.horizontal-scroll-gallery, .rings-row, .shared-gallery');
      
      galleries.forEach(gallery => {
        if (!gallery || gallery.hasEnhancedInteractions) return;
        
        // Mark as enhanced to avoid duplicate setup
        gallery.hasEnhancedInteractions = true;
        
        let isDown = false;
        let startX, startY, scrollLeft, scrollTop;
        let autoScrollInterval = null;
        let isAutoScrolling = false;
        let hasStartedAutoScroll = false;
        
        // Drag functionality
        const start = (e) => {
          isDown = true;
          gallery.classList.add('dragging');
          gallery.classList.remove('auto-scrolling');
          
          // Stop auto-scroll when user interacts
          if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
            isAutoScrolling = false;
          }
          
          const touch = e.touches ? e.touches[0] : e;
          startX = touch.pageX - gallery.offsetLeft;
          startY = touch.pageY - gallery.offsetTop;
          scrollLeft = gallery.scrollLeft;
          scrollTop = gallery.scrollTop;
        };
        
        const end = () => {
          isDown = false;
          gallery.classList.remove('dragging');
          
          // Restart auto-scroll after a delay if it was active before
          if (hasStartedAutoScroll && !isAutoScrolling) {
            setTimeout(() => {
              if (!isDown && !isAutoScrolling) {
                startAutoScroll();
              }
            }, 3000); // Wait 3 seconds before restarting auto-scroll
          }
        };
        
        const move = (e) => {
          if (!isDown) return;
          e.preventDefault();
          
          const touch = e.touches ? e.touches[0] : e;
          const x = touch.pageX - gallery.offsetLeft;
          const y = touch.pageY - gallery.offsetTop;
          
          // Calculate movement
          const walkX = (x - startX) * 2; // Multiply by 2 for more responsive scrolling
          const walkY = (y - startY) * 2;
          
          // Apply scrolling
          gallery.scrollLeft = scrollLeft - walkX;
          gallery.scrollTop = scrollTop - walkY;
        };
        
        // Auto-scroll functionality (FASTER SPEED)
        const startAutoScroll = () => {
          if (isAutoScrolling || isDown) return;
          
          isAutoScrolling = true;
          hasStartedAutoScroll = true;
          gallery.classList.add('auto-scrolling');
          
          const scrollSpeed = 3; // INCREASED from 1 to 3 for faster scrolling
          const scrollDirection = 1; // 1 for right/down, -1 for left/up
          let currentDirection = scrollDirection;
          
          autoScrollInterval = setInterval(() => {
            if (isDown) {
              clearInterval(autoScrollInterval);
              autoScrollInterval = null;
              isAutoScrolling = false;
              return;
            }
            
            const maxScrollLeft = gallery.scrollWidth - gallery.clientWidth;
            const maxScrollTop = gallery.scrollHeight - gallery.clientHeight;
            
            // Handle horizontal scrolling (for horizontal galleries)
            if (gallery.classList.contains('horizontal-scroll-gallery') || gallery.classList.contains('rings-row')) {
              gallery.scrollLeft += scrollSpeed * currentDirection;
              
              // Reverse direction when reaching the end
              if (gallery.scrollLeft >= maxScrollLeft) {
                currentDirection = -1;
              } else if (gallery.scrollLeft <= 0) {
                currentDirection = 1;
              }
            }
            // Handle vertical scrolling (for shared gallery if it's tall)
            else if (gallery.classList.contains('shared-gallery') && maxScrollTop > 0) {
              gallery.scrollTop += scrollSpeed * currentDirection;
              
              // Reverse direction when reaching the end
              if (gallery.scrollTop >= maxScrollTop) {
                currentDirection = -1;
              } else if (gallery.scrollTop <= 0) {
                currentDirection = 1;
              }
            }
          }, 30); // DECREASED from 50ms to 30ms for smoother/faster movement
        };
        
        // Stop auto-scroll
        const stopAutoScroll = () => {
          if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
            isAutoScrolling = false;
            gallery.classList.remove('auto-scrolling');
          }
        };
        
        // Event listeners for drag
        gallery.addEventListener('mousedown', start);
        gallery.addEventListener('touchstart', start, { passive: false });
        gallery.addEventListener('mouseleave', end);
        gallery.addEventListener('mouseup', end);
        gallery.addEventListener('touchend', end);
        gallery.addEventListener('mousemove', move);
        gallery.addEventListener('touchmove', move, { passive: false });
        
        // Intersection Observer to start auto-scroll when gallery comes into view
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                console.log(`[Gallery] Gallery came into view, starting auto-scroll in 1 second...`);
                // REDUCED delay from 2 seconds to 1 second
                setTimeout(() => {
                  if (!isDown && !isAutoScrolling) {
                    startAutoScroll();
                  }
                }, 1000);
              } else if (!entry.isIntersecting && isAutoScrolling) {
                console.log(`[Gallery] Gallery out of view, stopping auto-scroll...`);
                stopAutoScroll();
              }
            });
          }, { 
            threshold: 0.5, // Start when 50% of the gallery is visible
            rootMargin: '0px 0px -100px 0px' // Add some margin to trigger a bit later
          });
          
          observer.observe(gallery);
        }
        
        // Pause auto-scroll on hover (desktop)
        gallery.addEventListener('mouseenter', () => {
          if (isAutoScrolling) {
            stopAutoScroll();
          }
        });
        
        // Resume auto-scroll when mouse leaves (if gallery is still in view)
        gallery.addEventListener('mouseleave', () => {
          if (hasStartedAutoScroll && !isAutoScrolling && !isDown) {
            setTimeout(() => {
              if (!isDown && !isAutoScrolling) {
                // Check if gallery is still in view before restarting
                const rect = gallery.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight && rect.bottom > 0;
                if (isInView) {
                  startAutoScroll();
                }
              }
            }, 1000);
          }
        });
        
        console.log(`[Gallery] Enhanced interactions set up for gallery:`, gallery.className);
      });
    }
    
    // Arrow Navigation
    function setupArrowNavigation() {
      const arrows = document.querySelectorAll('.gallery-nav');
      console.log('[Gallery] Setting up arrow navigation for', arrows.length, 'arrows');
      
      arrows.forEach(arrow => {
        if (arrow.hasArrowListener) return;
        arrow.hasArrowListener = true;
        
        arrow.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const galleryType = arrow.getAttribute('data-gallery');
          const isNext = arrow.classList.contains('next');
          const gallery = document.querySelector(`[data-album="${galleryType}"]`);
          
          console.log(`[Gallery] Arrow clicked: type=${galleryType}, isNext=${isNext}, gallery=`, gallery);
          console.log(`[Gallery] Gallery classes:`, gallery?.className);
          console.log(`[Gallery] Gallery scrollLeft before:`, gallery?.scrollLeft);
          
          if (!gallery) {
            console.error(`[Gallery] No gallery found for type: ${galleryType}`);
            return;
          }

          // Force stop any auto-scroll completely
          gallery.classList.remove('auto-scrolling');
          if (gallery.autoScrollInterval) {
            clearInterval(gallery.autoScrollInterval);
            gallery.autoScrollInterval = null;
            console.log(`[Gallery] Cleared auto-scroll interval`);
          }
          
          // Also clear any global intervals that might interfere
          const allIntervals = [];
          for (let i = 1; i < 1000; i++) {
            try {
              clearInterval(i);
            } catch(e) {}
          }
          
          const scrollAmount = 300; // pixels to scroll
          const currentScroll = gallery.scrollLeft;
          const targetScroll = Math.max(0, isNext ? currentScroll + scrollAmount : currentScroll - scrollAmount);
          
          console.log(`[Gallery] Scrolling from ${currentScroll} to ${targetScroll}`);
          
          gallery.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
          
          // Verify scroll happened
          setTimeout(() => {
            console.log(`[Gallery] Gallery scrollLeft after:`, gallery.scrollLeft);
            if (gallery.scrollLeft === currentScroll) {
              console.warn(`[Gallery] Scroll didn't work, trying fallback`);
              gallery.scrollLeft = targetScroll;
            }
          }, 100);
        });
        
        console.log('[Gallery] Arrow listener added to:', arrow.className, arrow.getAttribute('data-gallery'));
      });
    }
    
    // Full Album Modal
    function createAlbumModal(albumType) {
      if (albumModals[albumType]) return albumModals[albumType];
      
      const modal = document.createElement('div');
      modal.className = 'album-modal';
      modal.innerHTML = `
        <div class="album-modal-content">
          <button class="album-modal-close">&times;</button>
          <h2 class="section-title">${getAlbumTitle(albumType)} - Full Album</h2>
          <div class="album-modal-grid" id="modal-grid-${albumType}"></div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Close modal functionality
      const closeBtn = modal.querySelector('.album-modal-close');
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
      
      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          modal.classList.remove('active');
        }
      });
      
      albumModals[albumType] = modal;
      return modal;
    }
    
    function getAlbumTitle(albumType) {
      switch (albumType) {
        case 'engagement': return 'Our Engagement';
        case 'rings': return 'Our Rings';
        case 'shared': return 'Shared Photos';
        default: return 'Photo Album';
      }
    }
    
    function populateModal(albumType) {
      const modal = albumModals[albumType];
      if (!modal) return;
      
      const grid = modal.querySelector(`#modal-grid-${albumType}`);
      const gallery = document.querySelector(`[data-album="${albumType}"]`);
      
      if (!gallery) return;
      
      const images = gallery.querySelectorAll('img');
      grid.innerHTML = '';
      
      images.forEach((img, index) => {
        if (img.style.display === 'none') return; // Skip hidden images
        
        const item = document.createElement('div');
        item.className = 'album-modal-item';
        
        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt || `Photo ${index + 1}`;
        modalImg.loading = 'lazy';
        
        // Click to view full size
        modalImg.addEventListener('click', () => {
          window.open(img.src, '_blank');
        });
        
        item.appendChild(modalImg);
        
        // Add name if it's a shared photo
        if (albumType === 'shared') {
          const galleryItem = img.closest('.gallery-item');
          if (galleryItem) {
            const nameElement = galleryItem.querySelector('.gallery-item-name');
            if (nameElement) {
              const name = document.createElement('div');
              name.textContent = nameElement.textContent;
              name.style.marginTop = '8px';
              name.style.fontSize = '0.9rem';
              name.style.color = 'var(--text-light)';
              item.appendChild(name);
            }
          }
        }
        
        grid.appendChild(item);
      });
    }
    
    // Setup full album buttons
    function setupFullAlbumButtons() {
      const buttons = document.querySelectorAll('.view-full-album');
      
      buttons.forEach(button => {
        if (button.hasFullAlbumListener) return;
        button.hasFullAlbumListener = true;
        
        button.addEventListener('click', () => {
          const albumType = button.getAttribute('data-album');
          const modal = createAlbumModal(albumType);
          populateModal(albumType);
          modal.classList.add('active');
          
          console.log(`[Gallery] Opened full album modal for: ${albumType}`);
        });
      });
    }
    
    // Initialize everything
    function initializeGalleries() {
      setupGalleryInteractions();
      setupArrowNavigation();
      setupFullAlbumButtons();
      if (window.setupFullscreenHandlers) {
        window.setupFullscreenHandlers();
      }
    }
    
    // Set up interactions for existing galleries
    initializeGalleries();
    
    // Also set up interactions for dynamically added galleries (like shared photos)
    const observer = new MutationObserver((mutations) => {
      let shouldRefresh = false;
      mutations.forEach(mutation => {
        // Only refresh if new galleries or photos were added
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && ( // Element node
              node.classList?.contains('photo-gallery') ||
              node.querySelector?.('.photo-gallery') ||
              node.classList?.contains('gallery-photo') ||
              node.querySelector?.('.gallery-photo')
            )) {
              shouldRefresh = true;
            }
          });
        }
      });
      if (shouldRefresh) {
        console.log('[Gallery] New gallery content detected, refreshing interactions');
        initializeGalleries();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Make functions available globally for Firebase gallery updates
    window.refreshGalleryInteractions = initializeGalleries;
  })();

  // --- Digital Guestbook (Firebase) ---
  (function() {
    const form = document.getElementById('guestbook-form');
    const messagesDiv = document.getElementById('guestbook-messages');
    if (!form || !messagesDiv || !db) return;

    function renderMessages(msgs) {
      messagesDiv.innerHTML = msgs.reverse().map(m =>
        `<div class="guestbook-message"><div class="guestbook-name">${m.name}</div><div>${m.message}</div></div>`
      ).join('');
    }
    db.ref('guestbook-messages').on('value', snap => {
      renderMessages(Object.values(snap.val() || {}));
    });
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('guest-name').value.trim();
      const message = document.getElementById('guest-message').value.trim();
      if (!name || !message) return;
      db.ref('guestbook-messages').push({ name, message, time: Date.now() });
      form.reset();
    });
  })();

  // --- Enhanced Map with Intersection Observer for Force Reload ---
  (function() {
    const mapContainer = document.getElementById('guest-map');
    const locationBtn = document.getElementById('request-location-btn');
    const manualPinArea = document.getElementById('manual-pin-area');
    const manualPinBtn = document.getElementById('manual-pin-btn');
    
    if (!mapContainer) {
      console.warn('[Map] guest-map container not found.');
      return;
    }
    
    console.log('[Map] Initializing map system with intersection observer...');
    
    let mapInitialized = false;
    let mapInstance = null;
    
    // Intersection Observer to detect when map becomes visible
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          console.log('[Map] Map container is now visible, force reloading...');
          
          // Force refresh the map if it already exists
          if (mapInstance && window.currentMapMarkers) {
            setTimeout(() => {
              console.log('[Map] Force invalidating map size and re-centering...');
              mapInstance.invalidateSize();
              
              // Re-center on pins if we have them
              if (window.currentMapMarkers && window.currentMapMarkers.length > 0) {
                console.log('[Map] Re-centering on pin cluster...');
                centerMapOnPins(mapInstance, null, window.currentMapMarkers);
              } else {
                mapInstance.panTo(mapInstance.getCenter()); // Force redraw
              }
            }, 200);
          } else if (!mapInitialized) {
            // Initialize map if not yet done
            console.log('[Map] Initializing map for the first time...');
            mapInitialized = true;
            initializeMap();
          }
        }
      });
    }, {
      threshold: [0.1, 0.5, 0.9],
      rootMargin: '50px'
    });
    
    // Start observing the map container
    mapObserver.observe(mapContainer);
    
    // Setup location request button
    if (locationBtn) {
      locationBtn.addEventListener('click', function() {
        console.log('[Map] Location button clicked');
        this.textContent = '📍 Getting Location...';
        this.disabled = true;
        requestUserLocation();
        
        // Re-enable button after 3 seconds
        setTimeout(() => {
          this.textContent = '📍 Share My Location';
          this.disabled = false;
        }, 3000);
      });
    }
    
    // Ensure container is visible and has proper dimensions
    mapContainer.style.minHeight = '500px';
    mapContainer.style.height = '500px';
    mapContainer.style.width = '100%';
    mapContainer.style.display = 'block';
    mapContainer.style.position = 'relative';
    
    // Clear any previous map instance
    if (mapContainer._leaflet_id) {
      console.log('[Map] Removing existing map instance...');
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = '';
    }
    
    // --- Center Map on Pins Function ---
    function centerMapOnPins(map, pins, markers) {
      if (!map || !markers || markers.length === 0) {
        console.log('[Map] Cannot center - missing map or markers');
        return;
      }
      
      try {
        console.log(`[Map] Centering map on ${markers.length} markers...`);
        
        if (markers.length === 1) {
          // If only one marker, center on it with a nice zoom level
          const marker = markers[0];
          const latlng = marker.getLatLng();
          map.setView(latlng, 10);
          console.log(`[Map] Centered on single marker at: ${latlng.lat}, ${latlng.lng}`);
        } else {
          // If multiple markers, fit to bounds
          const group = new L.featureGroup(markers);
          const bounds = group.getBounds();
          
          // Add some padding to the bounds
          const paddedBounds = bounds.pad(0.1);
          
          map.fitBounds(paddedBounds, {
            padding: [20, 20],
            maxZoom: 12 // Don't zoom in too much
          });
          
          console.log(`[Map] Fitted bounds for ${markers.length} markers`);
        }
        
        // Force a refresh after centering
        setTimeout(() => {
          map.invalidateSize();
        }, 200);
        
      } catch (error) {
        console.error('[Map] Error centering on pins:', error);
        // Fallback to default view
        map.setView([39.5, -98.35], 4);
      }
    }

    // Initialize map with better error handling
    function initializeMap(attempts = 0) {
      if (typeof L === 'undefined') {
        if (attempts < 30) { // Increased attempts
          console.log(`[Map] Waiting for Leaflet... attempt ${attempts + 1}`);
          setTimeout(() => initializeMap(attempts + 1), 300);
        } else {
          console.error('[Map] Leaflet failed to load after 30 attempts');
          mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-family: Montserrat;">Map failed to load. Please refresh the page.</div>';
        }
        return;
      }
      
      // Check for Firebase with more patience
      if (!window.db && !db) {
        if (attempts < 30) {
          console.log(`[Map] Waiting for Firebase... attempt ${attempts + 1}`);
          setTimeout(() => initializeMap(attempts + 1), 300);
          return;
        } else {
          console.error('[Map] Firebase failed to load after 30 attempts');
          mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-family: Montserrat;">Map database unavailable. Please refresh the page.</div>';
          return;
        }
      }
      
      console.log('[Map] Initializing Leaflet map...');
      
      try {
        // Create map with all interactions enabled
        const map = L.map('guest-map', {
          dragging: true,
          touchZoom: true,
          doubleClickZoom: true,
          scrollWheelZoom: true,
          boxZoom: true,
          keyboard: true,
          zoomControl: true,
          tap: true,
          tapTolerance: 15,
          trackResize: true,
          worldCopyJump: false,
          preferCanvas: false
        }).setView([39.5, -98.35], 4);
        
        // Store map reference globally and locally
        window.currentMap = map;
        mapInstance = map; // Store for intersection observer
        window.mapInitialized = true;
        console.log('[Map] ✅ Map created successfully');
        
        // Force map to recognize container size
        setTimeout(() => {
          map.invalidateSize();
          console.log('[Map] Map size invalidated and refreshed');
        }, 200);
        
        // Add tile layer with enhanced loading and multiple fallbacks
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
          tileSize: 256,
          zoomOffset: 0,
          minZoom: 2,
          continuousWorld: false,
          noWrap: false,
          updateWhenIdle: false,
          updateWhenZooming: true,
          keepBuffer: 2,
          maxNativeZoom: 18
        });
        
        // Add backup tile layers for better reliability
        const backupTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        });
        
        const secondBackupTileLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors, © CartoDB',
          maxZoom: 18,
          subdomains: 'abcd'
        });
        
        let tileLayerAdded = false;
        
        tileLayer.on('tileerror', function(e) { 
          console.warn('[Map] Primary tile load error, trying backup:', e);
          if (!tileLayerAdded) {
            map.removeLayer(tileLayer);
            backupTileLayer.addTo(map);
            tileLayerAdded = true;
          }
        });
        
        backupTileLayer.on('tileerror', function(e) {
          console.warn('[Map] Backup tile load error, trying second backup:', e);
          if (tileLayerAdded) {
            map.removeLayer(backupTileLayer);
            secondBackupTileLayer.addTo(map);
          }
        });
        
        tileLayer.on('tileloadstart', function() {
          console.log('[Map] Tiles starting to load...');
        });
        
        tileLayer.on('tileload', function() {
          console.log('[Map] Tile loaded successfully');
        });
        
        tileLayer.on('load', function() {
          console.log('[Map] All tiles loaded successfully');
        });
        
        tileLayer.addTo(map);
        console.log('[Map] ✅ Tile layer added with backups');
        
        // Preload tiles around the current view
        setTimeout(() => {
          map.invalidateSize();
          map.panBy([0, 0]); // Trigger tile loading
          console.log('[Map] Triggered initial tile preload');
        }, 500);
        
        // Handle map events for smooth tile loading
        map.on('movestart', function() {
          console.log('[Map] Move started - preparing tiles');
        });
        
        map.on('moveend', function() {
          console.log('[Map] Move ended - loading new tiles');
          setTimeout(() => map.invalidateSize(), 100);
        });
        
        map.on('zoomstart', function() {
          console.log('[Map] Zoom started');
        });
        
        map.on('zoomend', function() {
          console.log('[Map] Zoom ended - refreshing tiles');
          setTimeout(() => map.invalidateSize(), 100);
        });

        // Store markers for bounds calculation
        const markers = [];
        let pinsLoaded = false;

        // Load pins from Firebase
        const dbRef = (window.db || db);
        dbRef.ref('guest-pins').on('value', snap => {
          const pins = Object.values(snap.val() || {});
          console.log(`[Map] 📍 Loaded ${pins.length} pins from Firebase`);
          
          // Clear existing markers
          markers.forEach(marker => {
            try {
              map.removeLayer(marker);
            } catch (e) {
              console.warn('[Map] Error removing marker:', e);
            }
          });
          markers.length = 0;
          
          // Add new markers
          pins.forEach((p, index) => {
            try {
              if (p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng)) {
                const marker = L.marker([p.lat, p.lng], {
                  title: `Guest ${index + 1}`
                }).addTo(map);
                markers.push(marker);
              }
            } catch (e) {
              console.warn('[Map] Error adding marker:', e, p);
            }
          });
          
          console.log(`[Map] ✅ Added ${markers.length} markers to map`);
          
          // Store markers globally for intersection observer
          window.currentMapMarkers = markers;
          
          // Add guest's own location pin if available
          if (window.guestLocation) {
            const { latitude: lat, longitude: lng } = window.guestLocation;
            addGuestLocationPin(map, lat, lng);
            console.log('[Map] Added guest location pin from stored location');
          }
          
          // Auto-center map if we have pins and haven't done this yet
          if (markers.length > 0 && !pinsLoaded) {
            setTimeout(() => centerMapOnPins(map, pins, markers), 500);
            pinsLoaded = true;
          } else if (markers.length === 0) {
            console.log('[Map] No pins to center on, using default view');
            map.setView([39.5, -98.35], 5);
          }
        }, error => {
          console.error('[Map] Database error:', error);
        });

        // Setup manual pin functionality
        if (manualPinBtn) {
          manualPinBtn.addEventListener('click', function() {
            console.log('[Map] Manual pin button clicked');
            this.disabled = true;
            this.textContent = 'Click the map to drop your pin';
            this.style.background = 'linear-gradient(135deg, #8fa382 0%, #7a926e 100%)';
            
            map.once('click', function(e) {
              const { lat, lng } = e.latlng;
              console.log(`[Map] Manual pin dropped at: ${lat}, ${lng}`);
              
              try {
                const manualMarker = L.marker([lat, lng], { title: "Your Pin" }).addTo(map);
                markers.push(manualMarker);
                
                // Save to Firebase
                dbRef.ref('guest-pins').push({ 
                  lat: lat, 
                  lng: lng, 
                  time: Date.now(),
                  type: 'manual'
                });
                
                // Center on the manually placed pin
                map.setView([lat, lng], 10);
                console.log('[Map] ✅ Manual pin added and map centered');
                
                // Hide manual pin area
                if (manualPinArea) manualPinArea.style.display = 'none';
              } catch (error) {
                console.error('[Map] Error adding manual pin:', error);
              }
            });
          });
        }
        
        console.log('[Map] 🎉 Map initialization complete!');
        
      } catch (error) {
        console.error('[Map] 💥 Error initializing map:', error);
        mapContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; font-family: Montserrat; text-align: center; padding: 20px;">
            <div style="font-size: 18px; margin-bottom: 8px;">🗺️</div>
            <div>Map failed to load</div>
            <button onclick="location.reload()" style="margin-top: 12px; padding: 8px 16px; background: #b7c9a8; color: white; border: none; border-radius: 6px; cursor: pointer;">Refresh Page</button>
          </div>
        `;
      }
    }
  
    // --- Load existing pins and initialize intersection observer ---
    if (!mapInitialized) {
      mapInitialized = true;
      initializeMap();
    }
    
    // Start observing the map container
    mapObserver.observe(mapContainer);
  })();

  // --- Shared Photo Album (Firebase) ---
  (function() {
    console.log('[Firebase Photos] Starting initialization...');
    
    const form = document.getElementById('photo-upload-form');
    const fileInput = document.getElementById('photo-file');
    const nameInput = document.getElementById('photo-name');
    const gallery = document.getElementById('shared-photo-gallery');
    
    console.log('[Firebase Photos] Form elements found:', {
      form: !!form,
      fileInput: !!fileInput,
      nameInput: !!nameInput,
      gallery: !!gallery
    });
    
    console.log('[Firebase Photos] Firebase objects:', {
      storage: typeof storage,
      db: typeof db,
      firebase: typeof firebase
    });
    
    if (!form || !fileInput || !gallery) {
      console.error('[Firebase Photos] Missing required elements');
      return;
    }
    
    if (!storage || !db) {
      console.error('[Firebase Photos] Firebase not initialized properly');
      return;
    }

    // Test Firebase connectivity
    console.log('[Firebase Photos] Testing Firebase connection...');
    db.ref('.info/connected').on('value', function(snapshot) {
      if (snapshot.val() === true) {
        console.log('[Firebase Photos] ✅ Connected to Firebase');
      } else {
        console.log('[Firebase Photos] ❌ Disconnected from Firebase');
      }
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('[Firebase Photos] Form submitted');
      
      const file = fileInput.files[0];
      if (!file) {
        alert('Please select a photo.');
        return;
      }
      
      console.log('[Firebase Photos] File selected:', file.name, file.size, file.type);
      
      const uploader = nameInput.value.trim() || 'Anonymous';
      const fileName = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      
      console.log('[Firebase Photos] Starting upload...');
      
      const storageRef = storage.ref('wedding-photos/' + fileName);
      const uploadTask = storageRef.put(file);
      
      // Show upload progress
      uploadTask.on('state_changed', 
        function(snapshot) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('[Firebase Photos] Upload progress:', progress + '%');
        },
        function(error) {
          console.error('[Firebase Photos] Upload error:', error);
          alert('Upload failed: ' + error.message);
        },
        function() {
          console.log('[Firebase Photos] Upload completed');
          uploadTask.snapshot.ref.getDownloadURL().then(function(url) {

            console.log('[Firebase Photos] Download URL obtained:', url);
            
            const photoData = { 
              url: url, 
              uploader: uploader, 
              uploaded: Date.now(),
              fileName: fileName
            };
            
            console.log('[Firebase Photos] Saving to database:', photoData);
            
            db.ref('wedding-photos').push(photoData)
              .then(() => {
                console.log('[Firebase Photos] ✅ Photo saved to database');
                form.reset();
                alert('Photo uploaded successfully!');
              })
              .catch((error) => {
                console.error('[Firebase Photos] Database save error:', error);
                alert('Upload completed but failed to save to database: ' + error.message);
              });
          });
        }
      );
    });

    function renderGallery(photos) {
      console.log('[Firebase Photos] Rendering gallery with photos:', photos);
      if (!photos || photos.length === 0) {
        gallery.innerHTML = '<div style="text-align: center; color: var(--text-light); margin: 20px; min-width: 300px; display: flex; align-items: center; justify-content: center; height: 200px; border: 2px dashed #ddd; border-radius: 12px; background: rgba(183, 201, 168, 0.1);">No photos uploaded yet. Be the first to share!</div>';
        return;
      }
      
      const photoArray = Array.isArray(photos) ? photos : Object.values(photos);
      console.log('[Firebase Photos] Converted to array:', photoArray);
      
      // Set gallery to use 3-row grid layout without scrollbar
      gallery.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-template-rows: repeat(3, auto);
        gap: 16px;
        height: auto;
        overflow: visible;
        padding: 20px;
        border-radius: 12px;
        background: rgba(253, 250, 246, 0.5);
        border: 1px solid rgba(183, 201, 168, 0.3);
      `;
      
      gallery.innerHTML = photoArray.map(photo => {
        console.log('[Firebase Photos] Rendering photo:', photo);
        return `<div class="gallery-item" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: white;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
           <a href="${photo.url}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; width: 100%;">
             <img src="${photo.url}" alt="Shared by ${photo.uploader}" loading="lazy" style="
               width: 100%;
               height: 200px;
               object-fit: cover;
               border-radius: 6px;
               margin-bottom: 8px;
             "
                  onload="console.log('[Firebase Photos] Image loaded successfully')"
                  onerror="console.warn('[Firebase Photos] Image failed to load:', this.src); this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPg=='; this.alt='Image not available'" />
           </a>
           <div class="gallery-item-name" style="
             font-size: 14px;
             font-weight: 600;
             color: var(--text-dark, #4a4a4a);
             margin-top: 8px;
             font-family: 'Montserrat', sans-serif;
           ">${photo.uploader || 'Anonymous'}</div>
         </div>`;
      }).join('');
      
      // Refresh gallery interactions after adding new photos
      setTimeout(() => {
        if (window.refreshGalleryInteractions) {
          console.log('[Firebase Photos] Refreshing gallery interactions...');
          window.refreshGalleryInteractions();
        }
      }, 100);
    }
    
    // Load existing photos
    console.log('[Firebase Photos] Setting up database listener...');
    db.ref('wedding-photos').on('value', snap => {
      console.log('[Firebase Photos] Database value changed. Raw data:', snap.val());
      const photos = snap.val() ? Object.values(snap.val()) : [];
      console.log('[Firebase Photos] Photos array after conversion:', photos);
      renderGallery(photos);
    }, error => {
      console.error('[Firebase Photos] Database error:', error);
      gallery.innerHTML = '<div style="text-align: center; color: red; margin: 20px; padding: 20px; border: 1px solid red; border-radius: 8px;">Error loading photos: ' + error.message + '</div>';
    });
    
    // Add test data function for debugging
    window.addTestPhoto = function() {
      console.log('[Firebase Photos] Adding test photo...');
      const testPhoto = {
        url: 'https://picsum.photos/400/300?random=' + Date.now(),
        uploader: 'Test User',
        uploaded: Date.now(),
        fileName: 'test-photo-' + Date.now() + '.jpg'
      };
      
      db.ref('wedding-photos').push(testPhoto)
        .then(() => {
          console.log('[Firebase Photos] ✅ Test photo added');
          alert('Test photo added successfully!');
        })
        .catch(error => {
          console.error('[Firebase Photos] Failed to add test photo:', error);
          alert('Failed to add test photo: ' + error.message);
        });
    };
    
    // Add function to clear all photos (for testing)
    window.clearAllPhotos = function() {
      if (confirm('Are you sure you want to clear all photos? This cannot be undone.')) {
        console.log('[Firebase Photos] Clearing all photos...');
        db.ref('wedding-photos').remove()
          .then(() => {
            console.log('[Firebase Photos] ✅ All photos cleared');
            alert('All photos cleared!');
          })
          .catch(error => {
            console.error('[Firebase Photos] Failed to clear photos:', error);
            alert('Failed to clear photos: ' + error.message);
          });
      }
    };
    
    // Initialize with empty state
    renderGallery([]);
    
    console.log('[Firebase Photos] Initialization complete. Available debug functions:');
    console.log('- addTestPhoto() - Add a test photo');
    console.log('- clearAllPhotos() - Clear all photos');
  })();

  // === FULLSCREEN PHOTO VIEWER ===
  (function() {
    // Create fullscreen overlay
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.id = 'fullscreen-photo-overlay';
    fullscreenOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      display: none;
      z-index: 10000;
      cursor: pointer;
      align-items: center;
      justify-content: center;
    `;
    
    const fullscreenImg = document.createElement('img');
    fullscreenImg.style.cssText = `
      max-width: 95vw;
      max-height: 95vh;
      object-fit: contain;
      cursor: zoom-out;
    `;
    
    fullscreenOverlay.appendChild(fullscreenImg);
    document.body.appendChild(fullscreenOverlay);
    
    // Close fullscreen on click or escape
    fullscreenOverlay.addEventListener('click', closeFullscreen);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fullscreenOverlay.style.display === 'flex') {
        closeFullscreen();
      }
    });
    
    function closeFullscreen() {
      fullscreenOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
    
    function openFullscreen(imgSrc, imgAlt) {
      fullscreenImg.src = imgSrc;
      fullscreenImg.alt = imgAlt;
      fullscreenOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
    
    // Add click handlers to all gallery images
    function setupFullscreenHandlers() {
      const galleryImages = document.querySelectorAll('.horizontal-scroll-gallery img, .rings-row img, .shared-gallery img');
      
      galleryImages.forEach(img => {
        if (img.hasFullscreenHandler) return;
        img.hasFullscreenHandler = true;
        
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openFullscreen(img.src, img.alt);
          console.log('[Gallery] Opened fullscreen for:', img.src);
        });
      });
      
      console.log('[Gallery] Fullscreen handlers added to', galleryImages.length, 'images');
    }
    
    // Initialize and watch for new images
    setupFullscreenHandlers();
    
    // Watch for dynamically added images
    const observer = new MutationObserver((mutations) => {
      let hasNewImages = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (
              node.tagName === 'IMG' ||
              node.querySelector?.('img')
            )) {
              hasNewImages = true;
            }
          });
        }
      });
      if (hasNewImages) {
        setTimeout(setupFullscreenHandlers, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Make available globally
    window.setupFullscreenHandlers = setupFullscreenHandlers;
  })();

  // Initialize visitor counter
  initializeVisitorCounter();

  // Make available globally for dynamic injection after intro
}
window.initializeDynamicFeatures = initializeDynamicFeatures;

// === UTILITY FUNCTIONS ===
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// === VISITOR COUNTER ===
function initializeVisitorCounter() {
  try {
    // Generate a unique session ID for this visit
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Check if user has visited before (but don't increment if refreshing)
    let isNewVisitor = !localStorage.getItem('poradas_visitor_id');
    let visitorId = localStorage.getItem('poradas_visitor_id');
    
    if (isNewVisitor) {
      // Generate unique visitor ID and store it
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('poradas_visitor_id', visitorId);
      localStorage.setItem('poradas_visit_time', Date.now().toString());
    }

    // Get or initialize total visitor count
    let totalVisitors = parseInt(localStorage.getItem('poradas_total_visitors') || '0');
    
    // Only increment if this is a new visitor
    if (isNewVisitor) {
      totalVisitors++;
      localStorage.setItem('poradas_total_visitors', totalVisitors.toString());
    }

    // Get visitor number (position in the visitor list)
    let visitorNumber = totalVisitors;
    
    // Try to use Firebase for cross-device visitor counting (fallback to localStorage)
    if (window.firebase && firebase.database) {
      const visitorsRef = firebase.database().ref('visitors');
      
      if (isNewVisitor) {
        // Add this visitor to Firebase
        visitorsRef.child(visitorId).set({
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          sessionId: sessionId
        }).then(() => {
          // Get total count from Firebase
          visitorsRef.once('value', (snapshot) => {
            const firebaseTotal = snapshot.numChildren();
            localStorage.setItem('poradas_total_visitors', firebaseTotal.toString());
            updateVisitorDisplay(firebaseTotal, firebaseTotal);
          });
        }).catch(err => {
          console.log('[Visitors] Firebase error, using localStorage:', err);
          updateVisitorDisplay(visitorNumber, totalVisitors);
        });
      } else {
        // Just get the count for existing visitors
        visitorsRef.once('value', (snapshot) => {
          const firebaseTotal = snapshot.numChildren();
          const storedNumber = parseInt(localStorage.getItem('poradas_visitor_number') || visitorNumber.toString());
          updateVisitorDisplay(storedNumber, firebaseTotal);
        }).catch(err => {
          updateVisitorDisplay(visitorNumber, totalVisitors);
        });
      }
    } else {
      // Fallback to localStorage only
      updateVisitorDisplay(visitorNumber, totalVisitors);
    }
    
    // Store visitor number for this session
    if (isNewVisitor) {
      localStorage.setItem('poradas_visitor_number', visitorNumber.toString());
    }
    
  } catch (error) {
    console.error('[Visitors] Error initializing visitor counter:', error);
    // Fallback display
    updateVisitorDisplay(1, 1);
  }
}

function updateVisitorDisplay(visitorNumber, totalVisitors) {
  const totalVisitorsEl = document.getElementById('total-visitors');
  
  if (totalVisitorsEl) {
    totalVisitorsEl.textContent = totalVisitors.toString();
    
    // Show footer only if intro is not active
    const footer = document.getElementById('site-footer');
    const body = document.body;
    const introSection = document.getElementById('intro-section');
    
    if (footer) {
      // Check if intro is active
      const isIntroActive = body.classList.contains('intro-active') || 
                           (introSection && !introSection.style.display.includes('none'));
      
      if (!isIntroActive) {
        footer.style.display = 'block';
        footer.style.visibility = 'visible';
        footer.style.opacity = '1';
      } else {
        // Keep footer hidden during intro
        footer.style.display = 'none';
        footer.style.visibility = 'hidden';
        footer.style.opacity = '0';
      }
    }
    
    // Add a subtle animation
    const counter = document.getElementById('visitor-counter');
    if (counter) {
      counter.style.opacity = '0.7';
      setTimeout(() => {
        counter.style.opacity = '1';
      }, 300);
    }
  }
}

// === ENHANCED MAP WITH GUEST LOCATION PIN ===
let guestLocationMarker = null;

function addGuestLocationPin(map, lat, lng) {
  try {
    // Remove existing guest marker
    if (guestLocationMarker) {
      map.removeLayer(guestLocationMarker);
    }
    
    // Create custom icon for guest location
    const guestIcon = L.divIcon({
      className: 'guest-location-marker',
      html: `<div style="
        background: #ff4444;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    
    // Add guest marker
    guestLocationMarker = L.marker([lat, lng], { 
      icon: guestIcon,
      zIndexOffset: 1000
    }).addTo(map);
    
    guestLocationMarker.bindPopup("Your Location", {
      className: 'guest-location-popup'
    });
    
    console.log('[Map] Added guest location pin at', lat, lng);
    
  } catch (error) {
    console.error('[Map] Error adding guest location pin:', error);
  }
}