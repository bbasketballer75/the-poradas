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
    padding: 12px 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 200px;
    transition: all 0.4s ease;
    font-family: 'Montserrat', sans-serif;
    opacity: 0;
    transform: translateY(100px);
    cursor: pointer;
  `;

  musicPlayer.innerHTML = `
    <button id="music-play-pause" style="
      background: none;
      border: none;
      color: var(--sage-green-dark, #8fa382);
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    ">⏸️</button>
    <div id="music-details" style="flex: 1; min-width: 0;">
      <div id="music-title" style="
        font-size: 12px;
        font-weight: 600;
        color: var(--text-dark, #4a4a4a);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      ">Wedding Music</div>
      <div style="
        width: 100%;
        height: 3px;
        background: rgba(183, 201, 168, 0.3);
        border-radius: 2px;
        margin-top: 4px;
        position: relative;
      ">
        <div id="music-progress" style="
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #b7c9a8 0%, #8fa382 100%);
          border-radius: 2px;
          transition: width 0.1s ease;
        "></div>
      </div>
    </div>
    <button id="music-volume" style="
      background: none;
      border: none;
      color: var(--sage-green-dark, #8fa382);
      font-size: 14px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    ">🔊</button>
    <div id="music-note-icon" style="
      display: none;
      font-size: 24px;
      color: var(--sage-green-dark, #8fa382);
      animation: musicPulse 2s ease-in-out infinite;
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
    
    .music-player-minimized {
      min-width: 50px !important;
      width: 50px !important;
      height: 50px !important;
      border-radius: 50% !important;
      padding: 8px !important;
      justify-content: center !important;
      background: rgba(183, 201, 168, 0.9) !important;
      backdrop-filter: blur(8px) !important;
    }
    
    .music-player-minimized #music-details,
    .music-player-minimized #music-play-pause,
    .music-player-minimized #music-volume {
      display: none !important;
    }
    
    .music-player-minimized #music-note-icon {
      display: block !important;
    }
    
    .music-player-expanded #music-note-icon {
      display: none !important;
    }
    
    .music-player-expanded #music-details,
    .music-player-expanded #music-play-pause,
    .music-player-expanded #music-volume {
      display: flex !important;
    }
  `;
  document.head.appendChild(musicPlayerStyle);

  document.body.appendChild(musicPlayer);

  // Get audio element and controls
  const audio = document.getElementById('background-audio');
  const playPauseBtn = document.getElementById('music-play-pause');
  const volumeBtn = document.getElementById('music-volume');
  const progressBar = document.getElementById('music-progress');

  backgroundMusicPlayer = audio;

  // Auto-minimize functionality
  let minimizeTimer = null;
  let isMinimized = false;

  function minimizePlayer() {
    if (!isMinimized) {
      musicPlayer.className = 'music-player-minimized';
      isMinimized = true;
    }
  }

  function expandPlayer() {
    if (isMinimized) {
      musicPlayer.className = 'music-player-expanded';
      isMinimized = false;
      // Reset timer when expanded
      clearTimeout(minimizeTimer);
      minimizeTimer = setTimeout(minimizePlayer, 5000);
    }
  }

  // Click to expand when minimized
  musicPlayer.addEventListener('click', () => {
    if (isMinimized) {
      expandPlayer();
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
    
    // Start auto-minimize timer
    minimizeTimer = setTimeout(minimizePlayer, 5000);
  }, 1000);

  // Add hover effects
  playPauseBtn.addEventListener('mouseenter', () => {
    playPauseBtn.style.background = 'rgba(183, 201, 168, 0.1)';
    playPauseBtn.style.transform = 'scale(1.1)';
  });
  playPauseBtn.addEventListener('mouseleave', () => {
    playPauseBtn.style.background = 'none';
    playPauseBtn.style.transform = 'scale(1)';
  });

  volumeBtn.addEventListener('mouseenter', () => {
    volumeBtn.style.background = 'rgba(183, 201, 168, 0.1)';
    volumeBtn.style.transform = 'scale(1.1)';
  });
  volumeBtn.addEventListener('mouseleave', () => {
    volumeBtn.style.background = 'none';
    volumeBtn.style.transform = 'scale(1)';
  });

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

// --- Request User Location for Map ---
(function() {
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
          const userMarker = L.marker([lat, lng], { title: "Your Location" }).addTo(window.currentMap);
          window.currentMap.setView([lat, lng], 8);
          if (window.db) {
            window.db.ref('guest-pins').push({ lat, lng, time: Date.now() });
          }
          console.log('[Geolocation] Added location pin to existing map and centered.');
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
})();

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

  // --- Initialize Main Film Player with Video.js ---
  const mainFilmPlayer = videojs('main-film-video');
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
      
      /* Chapter markers on progress bar */
      .video-js .chapter-marker {
        position: absolute !important;
        background: #b7c9a8 !important;
        border-radius: 1px !important;
        pointer-events: none !important;
        z-index: 15 !important;
        opacity: 0.9 !important;
      }
      
      .video-js .vjs-progress-holder {
        position: relative !important;
        overflow: visible !important;
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
    let hasChapters = false;
    let chaptersTrack = null;
    
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].kind === 'chapters') {
        tracks[i].mode = 'disabled'; // Disable to prevent chapter names from showing
        hasChapters = true;
        chaptersTrack = tracks[i];
        break;
      }
    }
    
    // Add chapter markers to the timeline
    if (hasChapters && chaptersTrack) {
      console.log('[Video] Adding chapter markers to progress bar...');
      
      // Wait for chapters and video to load
      const addChapterMarkers = () => {
        const duration = player.duration();
        
        if (!duration || duration === 0) {
          console.log('[Video] Duration not ready, retrying in 500ms...');
          setTimeout(addChapterMarkers, 500);
          return;
        }
        
        // Check if this looks like a partial duration (suggesting the video hasn't fully loaded)
        // Remove this check for now as it's preventing markers from appearing
        // if (duration < 3600) { // Less than 1 hour seems suspicious for a wedding video
        //   console.log(`[Video] Duration seems short (${duration}s), waiting for video to load more...`);
        //   // Try waiting for loadedmetadata event or a longer delay
        //   setTimeout(addChapterMarkers, 2000);
        //   return;
        // }
        
        // Try multiple ways to find the actual progress bar
        let progressBarElement = null;
        
        // Method 1: Look for the actual progress bar (the blue bar in the image)
        const playerEl = player.el();
        progressBarElement = playerEl.querySelector('.vjs-play-progress');
        if (progressBarElement) {
          progressBarElement = progressBarElement.parentElement; // Get the container
          console.log('[Video] Method 1 - Found play progress parent:', progressBarElement);
        }
        
        // Method 2: Look for load progress container
        if (!progressBarElement) {
          progressBarElement = playerEl.querySelector('.vjs-load-progress');
          if (progressBarElement) {
            progressBarElement = progressBarElement.parentElement;
            console.log('[Video] Method 2 - Found load progress parent:', progressBarElement);
          }
        }
        
        // Method 3: Find the progress holder and use it
        if (!progressBarElement) {
          progressBarElement = playerEl.querySelector('.vjs-progress-holder');
          console.log('[Video] Method 3 - Using progress holder:', progressBarElement);
        }
        
        // Method 4: Create our own container in the progress control
        if (!progressBarElement) {
          const progressControl = playerEl.querySelector('.vjs-progress-control');
          if (progressControl) {
            progressBarElement = document.createElement('div');
            progressBarElement.className = 'chapter-markers-container';
            progressBarElement.style.cssText = `
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              pointer-events: none !important;
              z-index: 1000 !important;
            `;
            progressControl.appendChild(progressBarElement);
            console.log('[Video] Method 4 - Created custom container in progress control');
          }
        }
        
        if (!progressBarElement) {
          console.log('[Video] Could not find any suitable progress element, listing all elements...');
          const allProgressElements = playerEl.querySelectorAll('[class*="progress"], [class*="seek"], [class*="bar"]');
          console.log('[Video] All progress-related elements:', allProgressElements);
          setTimeout(addChapterMarkers, 1000);
          return;
        }
        
        // Ensure the progress element has relative positioning
        if (progressBarElement.style.position !== 'relative' && progressBarElement.style.position !== 'absolute') {
          progressBarElement.style.position = 'relative';
        }
        
        // Remove any existing chapter markers
        const existingMarkers = progressBarElement.querySelectorAll('.chapter-marker');
        existingMarkers.forEach(marker => marker.remove());
        
        // Force load the VTT cues
        if (!chaptersTrack.cues || chaptersTrack.cues.length === 0) {
          console.log('[Video] No cues loaded yet, retrying...');
          setTimeout(addChapterMarkers, 500);
          return;
        }
        
        console.log(`[Video] Duration: ${duration}s, Found ${chaptersTrack.cues.length} chapters`);
        console.log('[Video] Using progress element:', progressBarElement.className, progressBarElement);
        
        // Check for duration mismatch between video and chapters
        const lastChapterTime = Math.max(...Array.from(chaptersTrack.cues).map(cue => cue.startTime));
        console.log(`[Video] Last chapter time: ${lastChapterTime}s, Video duration: ${duration}s`);
        
        if (lastChapterTime > duration * 1.1) { // Allow 10% tolerance
          console.warn(`[Video] Chapter duration mismatch! Chapters go to ${lastChapterTime}s but video is only ${duration}s`);
        }
        
        // Add markers for each chapter - ONLY FOR CHAPTERS WITHIN VIDEO DURATION
        let markersAdded = 0;
        Array.from(chaptersTrack.cues).forEach((cue, index) => {
          console.log(`[Video] Checking chapter ${index + 1}: "${cue.text}" at ${cue.startTime}s`);
          
          // Skip chapters that are beyond the video duration - this is the key fix!
          if (cue.startTime > duration) {
            console.log(`[Video] -> SKIPPED: Beyond video duration of ${duration}s`);
            return;
          }
          
          const startPercent = (cue.startTime / duration) * 100;
          
          const marker = document.createElement('div');
          marker.className = 'chapter-marker';
          marker.setAttribute('data-chapter', cue.text);
          marker.setAttribute('data-time', cue.startTime);
          
          // Make markers EXTREMELY visible - different colors for debugging
          const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
          const color = colors[markersAdded % colors.length];
          
          marker.style.cssText = `
            position: absolute !important;
            left: ${Math.max(startPercent, 0.5)}% !important;
            top: -3px !important;
            width: 10px !important;
            height: calc(100% + 6px) !important;
            background: ${color} !important;
            opacity: 1 !important;
            pointer-events: none !important;
            z-index: 9999 !important;
            display: block !important;
            border: 2px solid #ffffff !important;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.8) !important;
            border-radius: 3px !important;
          `;
          
          progressBarElement.appendChild(marker);
          markersAdded++;
          console.log(`[Video] -> ADDED marker ${markersAdded}: "${cue.text}" at ${startPercent.toFixed(1)}% (${cue.startTime}s) - COLOR: ${color}`);
        });
        
        console.log(`[Video] Successfully added ${markersAdded} visible markers out of ${chaptersTrack.cues.length} total chapters`);
        
        if (markersAdded === 0) {
          console.warn('[Video] No markers were added! All chapters may be beyond the video duration.');
        } else {
          console.log(`[Video] Chapter markers are now visible on the progress bar.`);
        }
        
        // Ensure the progress element has relative positioning
        if (progressBarElement.style.position !== 'relative') {
          progressBarElement.style.position = 'relative';
          console.log('[Video] Set progress element position to relative');
        }
      };
      
      // Try with longer delays to ensure Video.js is fully ready
      player.ready(() => {
        console.log('[Video] Player ready, waiting 1s before adding markers...');
        setTimeout(addChapterMarkers, 1000);
        
        // Also try when the video metadata is loaded
        player.one('loadedmetadata', () => {
          console.log('[Video] Video metadata loaded, adding markers...');
          setTimeout(addChapterMarkers, 500);
        });
        
        // Also try when the user interacts with the video
        player.one('play', () => {
          console.log('[Video] Video started playing, adding markers...');
          setTimeout(addChapterMarkers, 500);
        });
        
        // Force try after 5 seconds to handle duration issues
        setTimeout(() => {
          console.log('[Video] Force trying markers after 5s...');
          addChapterMarkers();
        }, 5000);
      });
    }
    
  });

  // --- Engagement Album: Horizontal Drag-to-Scroll ---
  (function() {
    const gallery = document.querySelector('.horizontal-scroll-gallery');
    if (!gallery) return;
    let isDown = false, startX, scrollLeft;
    const start = (e) => {
      isDown = true;
      gallery.classList.add('active');
      startX = (e.pageX || e.touches[0].pageX) - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
    };
    const end = () => {
      isDown = false;
      gallery.classList.remove('active');
    };
    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.pageX || e.touches[0].pageX) - gallery.offsetLeft;
      const walk = (x - startX) * 1.5;
      gallery.scrollLeft = scrollLeft - walk;
    };
    gallery.addEventListener('mousedown', start);
    gallery.addEventListener('touchstart', start);
    gallery.addEventListener('mouseleave', end);
    gallery.addEventListener('mouseup', end);
    gallery.addEventListener('touchend', end);
    gallery.addEventListener('mousemove', move);
    gallery.addEventListener('touchmove', move);
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

  // --- Interactive Map (Leaflet + Firebase) ---
  (function() {
    const mapContainer = document.getElementById('guest-map');
    if (!mapContainer) {
      console.warn('[Map] guest-map container not found.');
      return;
    }
    // Defensive: clear any previous map instance
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = '';
    }
    // Wait for Leaflet to be available
    function tryInitMap(attempts = 0) {
      if (typeof L === 'undefined') {
        if (attempts < 10) {
          setTimeout(() => tryInitMap(attempts + 1), 100);
        } else {
          console.error('[Map] Leaflet (L) is not defined after waiting.');
        }
        return;
      }
      if (!db) {
        console.error('[Map] Firebase db is not defined.');
        return;
      }
      console.log('[Map] Initializing Leaflet map...');
      // --- Enable dragging and all interactions ---
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
        worldCopyJump: false
      }).setView([39.5, -98.35], 4);
      
      // Store map reference for geolocation code
      window.currentMap = map;
      window.mapInitialized = true;
      
      // Force map to recognize container size changes
      setTimeout(() => {
        map.invalidateSize();
        console.log('[Map] Map size invalidated and refreshed.');
      }, 100);
      
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      });
      tileLayer.on('loading', function() { console.log('[Map] TileLayer loading...'); });
      tileLayer.on('load', function() { console.log('[Map] TileLayer loaded!'); });
      tileLayer.on('tileerror', function(e) { console.error('[Map] TileLayer tileerror', e); });
      tileLayer.addTo(map);

      // Store markers for bounds calculation
      const markers = [];

      db.ref('guest-pins').on('value', snap => {
        const pins = Object.values(snap.val() || {});
        console.log(`[Map] Loaded ${pins.length} pins from Firebase.`);
        
        // Clear existing markers
        markers.forEach(marker => map.removeLayer(marker));
        markers.length = 0;
        
        // Add new markers
        pins.forEach(p => {
          const marker = L.marker([p.lat, p.lng]).addTo(map);
          markers.push(marker);
        });
        
        // Auto-center map around all pins if there are any
        if (markers.length > 0) {
          console.log('[Map] Centering map around pins...');
          
          if (markers.length === 1) {
            // If only one pin, center on it with a reasonable zoom
            const pin = pins[0];
            map.setView([pin.lat, pin.lng], 10);
            console.log('[Map] Centered on single pin.');
          } else if (markers.length <= 3) {
            // For small number of pins, fit all with good zoom
            const group = new L.featureGroup(markers);
            const bounds = group.getBounds();
            if (bounds.isValid()) {
              map.fitBounds(bounds, { 
                padding: [50, 50],
                maxZoom: 8 // Good zoom level for small groups
              });
              console.log('[Map] Fitted bounds around small group of pins.');
            }
          } else {
            // For larger groups, find the densest cluster area
            const clusters = findPinClusters(pins);
            const largestCluster = clusters.reduce((max, cluster) => 
              cluster.pins.length > max.pins.length ? cluster : max
            );
            
            if (largestCluster.pins.length >= Math.ceil(pins.length * 0.4)) {
              // If the largest cluster has at least 40% of pins, focus on it
              const clusterGroup = new L.featureGroup(
                largestCluster.pins.map(p => L.marker([p.lat, p.lng]))
              );
              const clusterBounds = clusterGroup.getBounds();
              if (clusterBounds.isValid()) {
                map.fitBounds(clusterBounds, { 
                  padding: [30, 30],
                  maxZoom: 9
                });
                console.log(`[Map] Focused on densest cluster with ${largestCluster.pins.length} pins.`);
              }
            } else {
              // If pins are spread out, show all but with better initial zoom
              const group = new L.featureGroup(markers);
              const bounds = group.getBounds();
              if (bounds.isValid()) {
                map.fitBounds(bounds, { 
                  padding: [40, 40],
                  maxZoom: 6 // Wider view for spread out pins
                });
                console.log('[Map] Fitted bounds around all spread out pins.');
              }
            }
          }
        } else {
          console.log('[Map] No pins to center on, keeping default view.');
          // Set a more reasonable default view (US-centered with better zoom)
          map.setView([39.5, -98.35], 5);
        }
      });

      // Function to find pin clusters
      function findPinClusters(pins, maxDistance = 2) { // 2 degrees = ~200km
        const clusters = [];
        const processed = new Set();
        
        pins.forEach((pin, index) => {
          if (processed.has(index)) return;
          
          const cluster = { pins: [pin], centerLat: pin.lat, centerLng: pin.lng };
          processed.add(index);
          
          // Find nearby pins
          pins.forEach((otherPin, otherIndex) => {
            if (processed.has(otherIndex)) return;
            
            const distance = Math.sqrt(
              Math.pow(pin.lat - otherPin.lat, 2) + 
              Math.pow(pin.lng - otherPin.lng, 2)
            );
            
            if (distance <= maxDistance) {
              cluster.pins.push(otherPin);
              processed.add(otherIndex);
            }
          });
          
          // Calculate cluster center
          if (cluster.pins.length > 1) {
            cluster.centerLat = cluster.pins.reduce((sum, p) => sum + p.lat, 0) / cluster.pins.length;
            cluster.centerLng = cluster.pins.reduce((sum, p) => sum + p.lng, 0) / cluster.pins.length;
          }
          
          clusters.push(cluster);
        });
        
        return clusters.sort((a, b) => b.pins.length - a.pins.length);
      }

      if (window.guestLocation) {
        const { latitude: lat, longitude: lng } = window.guestLocation;
        const userMarker = L.marker([lat, lng], { title: "Your Location" }).addTo(map);
        markers.push(userMarker);
        db.ref('guest-pins').push({ lat, lng, time: Date.now() });
        
        // Center on user location with appropriate zoom
        map.setView([lat, lng], 10);
        console.log('[Map] Added user location pin and centered map.');
      } else {
        console.log('[Map] No guestLocation available, showing manual pin option.');
        const pinArea = document.getElementById('manual-pin-area');
        const pinBtn = document.getElementById('manual-pin-btn');
        if (pinArea) pinArea.style.display = 'block';
        if (pinBtn) {
          pinBtn.onclick = function() {
            pinBtn.disabled = true;
            pinBtn.textContent = 'Click the map to drop your pin';
            map.once('click', function(e) {
              const { lat, lng } = e.latlng;
              const manualMarker = L.marker([lat, lng], { title: "Your Pin" }).addTo(map);
              markers.push(manualMarker);
              db.ref('guest-pins').push({ lat, lng, time: Date.now() });
              if (pinArea) pinArea.style.display = 'none';
              
              // Center on the manually placed pin
              map.setView([lat, lng], 10);
              console.log('[Map] Manual pin dropped and centered at', lat, lng);
            });
          };
        }
      }
      console.log('[Map] Map initialization complete.');
    }
    tryInitMap();
  })();

  // --- Shared Photo Album (Firebase) ---
  (function() {
    const form = document.getElementById('photo-upload-form');
    const fileInput = document.getElementById('photo-file');
    const nameInput = document.getElementById('photo-name');
    const gallery = document.getElementById('shared-photo-gallery');
    
    console.log('[Firebase Photos] Initializing shared photo album...');
    console.log('[Firebase Photos] Form:', form);
    console.log('[Firebase Photos] Gallery:', gallery);
    console.log('[Firebase Photos] Storage:', storage);
    console.log('[Firebase Photos] Database:', db);
    
    if (!form || !fileInput || !gallery) {
      console.error('[Firebase Photos] Missing required elements');
      return;
    }
    
    if (!storage || !db) {
      console.error('[Firebase Photos] Firebase not initialized properly');
      return;
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const file = fileInput.files[0];
      if (!file) return alert('Please select a photo.');
      const uploader = nameInput.value.trim() || 'Anonymous';
      const fileName = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storageRef = storage.ref('wedding-photos/' + fileName);
      storageRef.put(file).then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        db.ref('wedding-photos').push({ url, uploader, uploaded: Date.now() });
        form.reset();
        alert('Photo uploaded successfully!');
      }).catch(err => {
        console.error("Upload failed:", err);
        alert('Upload failed. Please try again.');
      });
    });

    function renderGallery(photos) {
      console.log('[Firebase Photos] Rendering gallery with photos:', photos);
      if (!photos || photos.length === 0) {
        gallery.innerHTML = '<p style="text-align: center; color: var(--text-light); margin: 20px;">No photos uploaded yet. Be the first to share!</p>';
        return;
      }
      gallery.innerHTML = photos.reverse().map(photo =>
        `<div class="gallery-item">
           <a href="${photo.url}" target="_blank" rel="noopener noreferrer">
             <img src="${photo.url}" alt="Shared by ${photo.uploader}" loading="lazy" />
           </a>
           <div class="gallery-item-name">${photo.uploader}</div>
         </div>`
      ).join('');
    }
    
    // Load existing photos
    console.log('[Firebase Photos] Setting up database listener...');
    db.ref('wedding-photos').on('value', snap => {
      console.log('[Firebase Photos] Database value changed:', snap.val());
      const photos = snap.val() ? Object.values(snap.val()) : [];
      renderGallery(photos);
    });
    
    // Initialize with empty state
    renderGallery([]);
  })();

  // Make available globally for dynamic injection after intro
}
window.initializeDynamicFeatures = initializeDynamicFeatures;