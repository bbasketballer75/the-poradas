// Clean Main JavaScript for The Poradas Wedding Website
// Consolidated and optimized version with all functionality restored

// Global variables
let dynamicFeaturesInitialized = false;
let guestMap = null;
let guestMarkers = [];
let backgroundMusicPlayer = null;
let isBackgroundMusicMuted = false;
let visitorCount = 1247; // Starting visitor count - will be managed by localStorage
let musicEnabled = false; // Track if music has been enabled
let userPausedMusic = false; // Track if user intentionally paused music

// ===== ENABLE MUSIC BUTTON =====
let enableMusicMinimized = false;
let enableMusicAutoMinimizeTimeout = null;

function createEnableMusicButton() {
  if (document.getElementById('enable-music-btn') || musicEnabled) return;
  
  const enableMusicBtn = document.createElement('button');
  enableMusicBtn.id = 'enable-music-btn';
  enableMusicBtn.textContent = 'Enable Music';
  enableMusicBtn.style.cssText = `
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: 10000;
    background: rgba(183, 201, 168, 0.7);
    border: 2px solid white;
    color: #333;
    padding: 6px 12px;
    border-radius: 16px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.4s ease;
  `;
  
  enableMusicBtn.addEventListener('click', () => {
    console.log('[Music] Enable music button clicked');
    enableMusicBtn.style.opacity = '0';
    setTimeout(() => {
      enableMusicBtn.remove();
      enableMusic();
    }, 300);
  });
  
  enableMusicBtn.addEventListener('mouseenter', () => {
    if (!enableMusicMinimized) {
      enableMusicBtn.style.transform = 'scale(1.05)';
      enableMusicBtn.style.background = 'rgba(255, 255, 255, 0.9)';
      enableMusicBtn.style.color = '#333';
    }
  });
  
  enableMusicBtn.addEventListener('mouseleave', () => {
    if (!enableMusicMinimized) {
      enableMusicBtn.style.transform = 'scale(1)';
      enableMusicBtn.style.background = 'rgba(183, 201, 168, 0.7)';
      enableMusicBtn.style.color = '#333';
    }
  });
  
  document.body.appendChild(enableMusicBtn);
  console.log('[Music] Enable music button created');
  
  // Auto-minimize after 5 seconds
  enableMusicAutoMinimizeTimeout = setTimeout(() => {
    minimizeEnableMusicButton();
  }, 5000);
}

function minimizeEnableMusicButton() {
  const enableMusicBtn = document.getElementById('enable-music-btn');
  if (!enableMusicBtn || enableMusicMinimized) return;
  
  enableMusicMinimized = true;
  enableMusicBtn.style.cssText = `
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: 10000;
    background: rgba(183, 201, 168, 0.7);
    border: 2px solid white;
    color: #8fa382;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.4s ease;
  `;
  enableMusicBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#5d6b56">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  `;
  
  // Add click to expand functionality
  enableMusicBtn.onclick = () => {
    expandEnableMusicButton();
  };
  
  console.log('[Music] Enable music button minimized');
}

function expandEnableMusicButton() {
  const enableMusicBtn = document.getElementById('enable-music-btn');
  if (!enableMusicBtn || !enableMusicMinimized) return;
  
  enableMusicMinimized = false;
  enableMusicBtn.style.cssText = `
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: 10000;
    background: rgba(183, 201, 168, 0.7);
    border: 2px solid white;
    color: #333;
    padding: 6px 12px;
    border-radius: 16px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.4s ease;
  `;
  enableMusicBtn.textContent = 'Enable Music';
  
  // Restore original click functionality
  enableMusicBtn.onclick = () => {
    console.log('[Music] Enable music button clicked');
    enableMusicBtn.style.opacity = '0';
    setTimeout(() => {
      enableMusicBtn.remove();
      enableMusic();
    }, 300);
  };
  
  console.log('[Music] Enable music button expanded');
}

function enableMusic() {
  if (musicEnabled) {
    console.log('[Music] Music already enabled');
    return;
  }
  
  musicEnabled = true;
  console.log('[Music] Enabling music...');
  
  // Create and start music player immediately
  createBackgroundMusicPlayer();
  
  // Start playing music
  setTimeout(() => {
    const audio = document.getElementById('background-audio');
    if (audio) {
      audio.volume = 0.4; // Reasonable volume
      audio.play().then(() => {
        console.log('[Music] Music started playing');
        
        // Add periodic check to ensure music continues playing
        setInterval(() => {
          const currentAudio = document.getElementById('background-audio') || document.querySelector('audio');
          if (currentAudio && musicEnabled && !musicPausedForVideo && !userPausedMusic) {
            if (currentAudio.paused && currentAudio.currentTime > 0) {
              console.log('[Music] Detected unexpected pause, resuming...');
              currentAudio.play().catch(err => console.log('[Music] Resume failed:', err));
            }
          }
        }, 2000); // Check every 2 seconds
        
      }).catch(err => {
        console.log('[Music] Autoplay failed:', err);
      });
    }
  }, 500);
}

// Accurate visitor count system with live updates
function updateVisitorCount() {
  // Get current timestamp and date
  const now = Date.now();
  const today = new Date().toDateString();
  
  // Get stored data
  let storedCount = localStorage.getItem('porada-visitor-count');
  let lastVisit = localStorage.getItem('porada-last-visit');
  let sessionId = sessionStorage.getItem('porada-session-id');
  
  // Generate session ID if not exists
  if (!sessionId) {
    sessionId = now + '-' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('porada-session-id', sessionId);
  }
  
  // Initialize count if first time
  if (!storedCount) {
    visitorCount = 4; // Start with 4 as requested
    localStorage.setItem('porada-visitor-count', visitorCount.toString());
    localStorage.setItem('porada-last-visit', today);
    localStorage.setItem('porada-last-session', sessionId);
    console.log('[Visitor] First visitor - count initialized to 4');
    return visitorCount;
  }
  
  visitorCount = parseInt(storedCount);
  const lastSession = localStorage.getItem('porada-last-session');
  
  // Check if this is a new unique session
  if (lastSession !== sessionId) {
    visitorCount += 1;
    localStorage.setItem('porada-visitor-count', visitorCount.toString());
    localStorage.setItem('porada-last-visit', today);
    localStorage.setItem('porada-last-session', sessionId);
    console.log(`[Visitor] New visitor - count updated to ${visitorCount}`);
  } else {
    console.log(`[Visitor] Returning visitor in same session - count remains ${visitorCount}`);
  }
  
  // Update the display if counter exists
  updateVisitorDisplay();
  
  return visitorCount;
}

// Function to update visitor display in real-time
function updateVisitorDisplay() {
  const visitorSpan = document.getElementById('total-visitors');
  if (visitorSpan) {
    visitorSpan.textContent = visitorCount;
    
    // Add brief highlight animation
    visitorSpan.style.transition = 'all 0.3s ease';
    visitorSpan.style.background = 'rgba(255, 255, 255, 0.2)';
    visitorSpan.style.padding = '2px 8px';
    visitorSpan.style.borderRadius = '4px';
    
    setTimeout(() => {
      visitorSpan.style.background = 'transparent';
      visitorSpan.style.padding = '0';
    }, 1000);
  }
}

// Periodically check for count updates (in case of multiple tabs)
setInterval(() => {
  const currentCount = localStorage.getItem('porada-visitor-count');
  if (currentCount && parseInt(currentCount) !== visitorCount) {
    visitorCount = parseInt(currentCount);
    updateVisitorDisplay();
  }
}, 5000);

// Clear old visitor count for fresh start
if (localStorage.getItem('porada-visitor-count') && parseInt(localStorage.getItem('porada-visitor-count')) > 10) {
  localStorage.removeItem('porada-visitor-count');
  localStorage.removeItem('porada-last-visit');
  localStorage.removeItem('porada-last-session');
  console.log('[Visitor] Reset visitor count for fresh start');
}

// ===== INTRO & MAIN INITIALIZATION =====

function resetSkipButton() {
  const skipBtn = document.getElementById('skip-intro');
  if (skipBtn) {
    skipBtn.classList.remove('skip-minimized');
    skipBtn.innerHTML = 'Skip Intro';
    
    // Reset to original styling
    skipBtn.style.cssText = `
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba(183, 201, 168, 0.7);
      color: #333;
      border: 2px solid white;
      padding: 6px 12px;
      border-radius: 16px;
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      transition: all 0.3s ease, opacity 0.5s ease;
      z-index: 10001;
      font-size: 0.75rem;
      opacity: 0;
      pointer-events: auto;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    console.log('[Skip] Button reset to full state');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  const mainContent = document.getElementById('main-content');
  const introSection = document.getElementById('intro-section');
  const introVideo = document.getElementById('intro-video');
  const skipBtn = document.getElementById('skip-intro');
  const replayBtn = document.getElementById('replay-intro');

  // Hide replay button until after intro
  replayBtn.style.display = 'none';

  // Reset skip button to initial state
  resetSkipButton();

  // Show intro section and start intro
  introSection.style.display = 'flex';
  introSection.classList.add('active');
  body.classList.add('intro-active');
  
  // Disable scrolling during intro
  body.style.overflow = 'hidden';
  mainContent.style.display = 'none';
  skipBtn.style.opacity = 0;
  skipBtn.style.pointerEvents = 'auto';
  
  // Create enable music button immediately
  createEnableMusicButton();
  
  // iOS/iPad compatibility fixes
  introVideo.muted = true;
  introVideo.setAttribute('muted', '');
  introVideo.setAttribute('playsinline', 'true');
  introVideo.setAttribute('webkit-playsinline', 'true');
  introVideo.preload = 'auto';
  introVideo.load();
  
  let videoStarted = false;
  let skipTimeout;
  let fallbackTimeout;
  let introActive = true;

  function showSkipBtn() {
    skipBtn.style.opacity = 1;
    skipBtn.disabled = false;
    
    // After 5 seconds, shrink the button to minimized size
    setTimeout(() => {
      if (skipBtn && !skipBtn.disabled && introActive) {
        minimizeSkipButton();
      }
    }, 5000);
  }
  
  function minimizeSkipButton() {
    skipBtn.classList.add('skip-minimized');
    skipBtn.innerHTML = `
      <svg viewBox="0 0 100 100" style="width: 16px; height: 16px;">
        <polygon points="30,20 30,80 60,50" fill="#5d6b56"/>
        <rect x="65" y="20" width="8" height="60" fill="#5d6b56"/>
      </svg>
    `;
    
    // Apply minimized styling with circular shape
    skipBtn.style.cssText = `
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba(183, 201, 168, 0.7);
      border: 2px solid white;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      z-index: 10001;
      opacity: 1;
      pointer-events: auto;
    `;
    
    console.log('[Skip] Button minimized to circular icon');
  }

  let introWasSkipped = false;
  function endIntro(wasSkipped = false) {
    // Hide intro section
    introSection.style.display = 'none';
    introSection.classList.remove('active');
    body.classList.remove('intro-active');
    
    // DON'T show main content yet - wait for continue button
    skipBtn.style.opacity = 0;
    skipBtn.disabled = true;
    skipBtn.style.display = 'none'; // Hide skip button
    clearTimeout(skipTimeout);
    clearTimeout(fallbackTimeout);
    body.style.overflow = '';
    introActive = false;
    replayBtn.style.display = 'none'; // Keep the old replay button hidden
    
    // Hide enable music button if it exists
    const enableMusicBtn = document.getElementById('enable-music-btn');
    if (enableMusicBtn) {
      enableMusicBtn.style.display = 'none';
    }
    
    // Clear auto-minimize timeout
    if (enableMusicAutoMinimizeTimeout) {
      clearTimeout(enableMusicAutoMinimizeTimeout);
    }
    
    // Update visitor count
    const finalCount = updateVisitorCount();
    
    // If skipped, go directly to main content
    if (wasSkipped) {
      const mainContent = document.getElementById('main-content');
      mainContent.style.display = 'block';
      const footer = document.getElementById('site-footer');
      if (!footer) {
        // Create footer but show it immediately
        const newFooter = document.createElement('footer');
        newFooter.id = 'site-footer';
        newFooter.style.cssText = `
          background: linear-gradient(135deg, var(--sage-green) 0%, var(--sage-green-dark) 100%);
          color: white;
          text-align: center;
          padding: 40px 20px;
          margin-top: 60px;
          font-family: 'Montserrat', sans-serif;
        `;
        newFooter.innerHTML = `
          <div class="footer-content">
            <div class="footer-title" style="font-size: 1.2rem; font-weight: 600; margin-bottom: 10px;">The Poradas - Established 2025</div>
            <div class="footer-counter">
              <div id="visitor-counter" style="font-size: 0.9rem; opacity: 0.8;">
                <span id="total-visitors">${finalCount}</span> visits
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(newFooter);
      } else {
        footer.style.display = 'block';
      }
      
      // Initialize all features when skipped
      initializeDynamicFeatures(false);
      
      // Initialize scroll video logic for skipped intro
      initializeScrollVideo();
    } else {
      // Always create end intro buttons when intro completes naturally (not skipped)
      createEndIntroButtons();
      
      // Create and inject footer but keep main content hidden
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
          display: none;
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
    }
    
    // Content will be shown only when continue button is clicked (if not skipped)
  }

  // Fallback: if video doesn't start loading in 3s, skip intro
  fallbackTimeout = setTimeout(() => {
    if (!videoStarted) {
      endIntro();
    }
  }, 3000);

  skipBtn.onclick = function() {
    introWasSkipped = true;
    endIntro(true); // Pass true to indicate it was skipped
  };
  
  introVideo.onended = endIntro;

  // Show skip after 15s of playback
  introVideo.addEventListener('play', function onPlayOnce() {
    videoStarted = true;
    clearTimeout(fallbackTimeout);
    skipTimeout = setTimeout(showSkipBtn, 10000);
    introVideo.removeEventListener('play', onPlayOnce);
  });

  // Try to play video with iOS compatibility
  const playPromise = introVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      console.log('[Intro] Video autoplay failed, waiting for user interaction');
      const unlockPlayback = () => {
        introVideo.muted = true;
        introVideo.setAttribute('muted', '');
        introVideo.play().catch(() => {
          console.log('[Intro] Manual play also failed, skipping to main content');
          endIntro();
        });
        body.removeEventListener('click', unlockPlayback);
        body.removeEventListener('touchstart', unlockPlayback);
      }
      body.addEventListener('click', unlockPlayback, { once: true });
      body.addEventListener('touchstart', unlockPlayback, { once: true });
      
      // Show skip button immediately if autoplay fails
      setTimeout(showSkipBtn, 1000);
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
  
  // Create continue button after intro
});

// ===== BACKGROUND MUSIC SYSTEM =====
let musicPausedForVideo = false;
let musicPausedPosition = 0;
let musicPlayerMinimized = false;
let musicPlayerInteracting = false;
let autoMinimizeTimeout = null;

// Global audio element that persists
let globalAudioElement = null;

function createGlobalAudioElement() {
  if (!globalAudioElement) {
    globalAudioElement = document.createElement('audio');
    globalAudioElement.id = 'background-audio';
    globalAudioElement.loop = true;
    globalAudioElement.volume = 0.3;
    globalAudioElement.innerHTML = `<source src="audio/Seven Lions, SLANDER, & Dabin feat. Dylan Matthew - First Time (Acoustic) ｜ Ophelia Records - SEVENLIONS.mp3" type="audio/mpeg">`;
    
    // Add to document body and keep it there permanently
    globalAudioElement.style.display = 'none';
    document.body.appendChild(globalAudioElement);
    
    // Add event listeners for debugging
    globalAudioElement.addEventListener('play', () => {
      console.log('[Music] Global audio started playing');
    });
    
    globalAudioElement.addEventListener('pause', () => {
      console.log('[Music] Global audio paused');
    });
    
    globalAudioElement.addEventListener('ended', () => {
      console.log('[Music] Global audio ended');
    });
    
    console.log('[Music] Global audio element created and added to body');
  }
  return globalAudioElement;
}

function createBackgroundMusicPlayer() {
  console.log('[Music] Creating background music player...');
  console.trace('[Music] Music player creation stack trace');
  
  if (document.getElementById('background-music-player')) {
    console.log('[Music] Background music player already exists');
    return;
  }
  
  // Ensure global audio exists
  const audio = createGlobalAudioElement();
  
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
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
      <div id="music-title-container" style="flex: 1; overflow: hidden; position: relative; height: 20px; text-align: center;">
        <div id="music-title" style="font-size: 14px; font-weight: 600; color: var(--text-dark); white-space: nowrap; position: absolute; width: max-content; animation: scrollTitle 8s linear infinite;">Seven Lions - First Time (Acoustic)</div>
      </div>
      <button id="music-minimize" style="background: rgba(183, 201, 168, 0.8); border: 1px solid rgba(93, 107, 86, 0.5); color: #5d6b56; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; margin-left: 8px; flex-shrink: 0;">−</button>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
      <button id="music-prev" style="background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%); border: 1px solid rgba(143, 163, 130, 0.3); color: white; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">⏮</button>
      <button id="music-play-pause" style="background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%); border: 1px solid rgba(143, 163, 130, 0.3); color: white; font-size: 12px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 28px; height: 24px; display: flex; align-items: center; justify-content: center;">⏸</button>
      <button id="music-next" style="background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%); border: 1px solid rgba(143, 163, 130, 0.3); color: white; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">⏭</button>
      <button id="music-mute" style="background: linear-gradient(135deg, #c9a972 0%, #b8965f 100%); border: 1px solid rgba(201, 169, 114, 0.3); color: white; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">🔊</button>
      <input type="range" id="music-volume" min="0" max="1" step="0.1" value="0.3" style="flex: 1; height: 4px; background: linear-gradient(to right, #b7c9a8 0%, #b7c9a8 30%, #ddd 30%, #ddd 100%); border-radius: 2px; outline: none; appearance: none; cursor: pointer;">
    </div>
  `;

  document.body.appendChild(musicPlayer);
  
  // Initialize audio controls with the global audio element
  const playPauseBtn = document.getElementById('music-play-pause');
  const muteBtn = document.getElementById('music-mute');
  const volumeSlider = document.getElementById('music-volume');
  const minimizeBtn = document.getElementById('music-minimize');
  
  if (audio) {
    // Update UI to match current audio state
    playPauseBtn.textContent = audio.paused ? '▶' : '⏸';
    muteBtn.textContent = audio.muted ? '🔇' : '🔊';
    volumeSlider.value = audio.volume;
    const percentage = audio.volume * 100;
    volumeSlider.style.background = `linear-gradient(to right, #b7c9a8 0%, #b7c9a8 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
    
    // Function to update play/pause button based on audio state
    const updatePlayPauseButton = () => {
      playPauseBtn.textContent = audio.paused ? '▶' : '⏸';
    };
    
    // Add audio event listeners to keep button in sync
    audio.addEventListener('play', updatePlayPauseButton);
    audio.addEventListener('pause', updatePlayPauseButton);
    
    playPauseBtn.addEventListener('click', () => {
      console.log('[Music] Play/pause clicked, current state:', audio.paused);
      if (audio.paused) {
        userPausedMusic = false; // User wants to play
        audio.play().then(() => {
          console.log('[Music] Audio started playing');
        }).catch(err => {
          console.log('[Music] Play failed:', err);
          updatePlayPauseButton();
        });
      } else {
        userPausedMusic = true; // User wants to pause
        audio.pause();
        console.log('[Music] Audio paused by user');
      }
    });
    
    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      muteBtn.textContent = audio.muted ? '🔇' : '🔊';
      console.log('[Music] Mute toggled:', audio.muted);
    });
    
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
      const percentage = e.target.value * 100;
      e.target.style.background = `linear-gradient(to right, #b7c9a8 0%, #b7c9a8 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
      console.log('[Music] Volume changed to:', audio.volume);
    });
    
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('[Music] Minimize button clicked');
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
  
  // Auto-minimize after 4 seconds only if not already minimized and no user interaction
  if (autoMinimizeTimeout) {
    clearTimeout(autoMinimizeTimeout);
  }
  
  autoMinimizeTimeout = setTimeout(() => {
    if (!musicPlayerMinimized && !musicPlayerInteracting) {
      minimizePlayer();
    }
  }, 4000);

  // Track user interaction with the music player
  musicPlayer.addEventListener('mouseenter', () => {
    musicPlayerInteracting = true;
    if (autoMinimizeTimeout) {
      clearTimeout(autoMinimizeTimeout);
    }
  });
  
  musicPlayer.addEventListener('mouseleave', () => {
    musicPlayerInteracting = false;
    // Restart auto-minimize timer when user stops interacting
    if (!musicPlayerMinimized) {
      autoMinimizeTimeout = setTimeout(() => {
        if (!musicPlayerMinimized && !musicPlayerInteracting) {
          minimizePlayer();
        }
      }, 4000);
    }
  });

  console.log('[Music] Background music player created and initialized');
}

function minimizePlayer() {
  const player = document.getElementById('background-music-player');
  if (player && !musicPlayerMinimized) {
    musicPlayerMinimized = true;
    
    // Clear any auto-minimize timeout
    if (autoMinimizeTimeout) {
      clearTimeout(autoMinimizeTimeout);
      autoMinimizeTimeout = null;
    }
    
    // Get the global audio element - it should remain in document.body
    const audio = globalAudioElement || document.getElementById('background-audio');
    console.log('[Music] Minimizing player, current audio state:', {
      exists: !!audio,
      paused: audio?.paused,
      currentTime: audio?.currentTime,
      volume: audio?.volume,
      inBody: document.body.contains(audio)
    });
    
    // Clear all visible controls (innerHTML will remove everything except our preserved audio)
    player.innerHTML = '';
    
    // Add minimized class for CSS styling
    player.className = 'minimized';
    
    // Apply minimized styles with smooth transition - forcing perfect circle
    player.style.cssText = `
      position: fixed !important;
      bottom: 10px !important;
      left: 10px !important;
      z-index: 1000 !important;
      background: rgba(183, 201, 168, 0.8) !important;
      border: 2px solid white !important;
      border-radius: 50% !important;
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
      backdrop-filter: blur(10px) !important;
      width: 44px !important;
      height: 44px !important;
      min-width: 44px !important;
      min-height: 44px !important;
      max-width: 44px !important;
      max-height: 44px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
      cursor: pointer !important;
      font-size: 16px !important;
      font-family: 'Montserrat', sans-serif !important;
      font-weight: 600 !important;
      color: #5d6b56 !important;
      overflow: hidden !important;
      opacity: 1 !important;
      transform: scale(1) !important;
      flex-shrink: 0 !important;
      flex-grow: 0 !important;
      flex-basis: 44px !important;
      box-sizing: border-box !important;
    `;
    
    // Add the minimized icon
    const iconDiv = document.createElement('div');
    iconDiv.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#5d6b56">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    `;
    iconDiv.style.cssText = `
      pointer-events: none !important; 
      display: flex !important; 
      align-items: center !important; 
      justify-content: center !important; 
      width: 100% !important; 
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    `;
    player.appendChild(iconDiv);
    
    // Add click handler to expand when minimized
    player.onclick = (e) => {
      e.stopPropagation();
      console.log('[Music] Minimized player clicked - expanding');
      expandPlayer();
    };
    
    // Audio should continue playing without interruption since it's in document.body
    console.log('[Music] Player minimized successfully, global audio unaffected');
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
    
    console.log('[Music] Expanding player while preserving global audio state');
    
    // Get the global audio element (it should be in document.body)
    const audio = globalAudioElement || document.getElementById('background-audio');
    let audioWasPlaying = false;
    if (audio) {
      audioWasPlaying = !audio.paused;
      console.log('[Music] Global audio state:', {
        exists: !!audio,
        playing: audioWasPlaying,
        currentTime: audio.currentTime,
        volume: audio.volume,
        inBody: document.body.contains(audio)
      });
    }
    
    // Remove only the minimized icon
    const iconDiv = player.querySelector('div');
    if (iconDiv) {
      iconDiv.remove();
    }
    
    // Remove minimized class
    player.className = '';
    
    // Restore expanded player styles
    player.style.cssText = `
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

    // Restore the player HTML content
    player.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div id="music-title-container" style="flex: 1; overflow: hidden; position: relative; height: 20px; text-align: center;">
          <div id="music-title" style="font-size: 14px; font-weight: 600; color: var(--text-dark); white-space: nowrap; position: absolute; width: max-content; animation: scrollTitle 8s linear infinite;">Seven Lions - First Time (Acoustic)</div>
        </div>
        <button id="music-minimize" style="background: rgba(183, 201, 168, 0.8); border: 1px solid rgba(93, 107, 86, 0.5); color: #5d6b56; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; margin-left: 8px; flex-shrink: 0;">−</button>
      </div>
      <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
        <button id="music-prev" style="background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%); border: 1px solid rgba(143, 163, 130, 0.3); color: white; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">⏮</button>
        <button id="music-play-pause" style="background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%); border: 1px solid rgba(143, 163, 130, 0.3); color: white; font-size: 12px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 28px; height: 24px; display: flex; align-items: center; justify-content: center;">⏸</button>
        <button id="music-next" style="background: linear-gradient(135deg, #b7c9a8 0%, #8fa382 100%); border: 1px solid rgba(143, 163, 130, 0.3); color: white; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">⏭</button>
        <button id="music-mute" style="background: linear-gradient(135deg, #c9a972 0%, #b8965f 100%); border: 1px solid rgba(201, 169, 114, 0.3); color: white; font-size: 10px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: all 0.2s ease; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">🔊</button>
        <input type="range" id="music-volume" min="0" max="1" step="0.1" value="0.3" style="flex: 1; height: 4px; background: linear-gradient(to right, #b7c9a8 0%, #b7c9a8 30%, #ddd 30%, #ddd 100%); border-radius: 2px; outline: none; appearance: none; cursor: pointer;">
      </div>
    `;
    
    // Re-initialize control event listeners with the global audio element
    const playPauseBtn = document.getElementById('music-play-pause');
    const muteBtn = document.getElementById('music-mute');
    const volumeSlider = document.getElementById('music-volume');
    const minimizeBtn = document.getElementById('music-minimize');
    
    if (audio && playPauseBtn && muteBtn && volumeSlider && minimizeBtn) {
      // Update UI to match current audio state
      playPauseBtn.textContent = audio.paused ? '▶' : '⏸';
      muteBtn.textContent = audio.muted ? '🔇' : '🔊';
      volumeSlider.value = audio.volume;
      const percentage = audio.volume * 100;
      volumeSlider.style.background = `linear-gradient(to right, #b7c9a8 0%, #b7c9a8 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
      
      // Function to update play/pause button based on audio state
      const updatePlayPauseButton = () => {
        playPauseBtn.textContent = audio.paused ? '▶' : '⏸';
      };
      
      // Add audio event listeners to keep button in sync
      audio.addEventListener('play', updatePlayPauseButton);
      audio.addEventListener('pause', updatePlayPauseButton);
      
      // Add event listeners
      playPauseBtn.addEventListener('click', () => {
        console.log('[Music] Play/pause clicked after expansion, current state:', audio.paused);
        if (audio.paused) {
          userPausedMusic = false; // User wants to play
          audio.play().then(() => {
            console.log('[Music] Audio resumed after expansion');
          }).catch(err => {
            console.log('[Music] Play failed after expansion:', err);
            updatePlayPauseButton();
          });
        } else {
          userPausedMusic = true; // User wants to pause
          audio.pause();
          console.log('[Music] Audio paused after expansion');
        }
      });
      
      muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.textContent = audio.muted ? '🔇' : '🔊';
        console.log('[Music] Mute toggled after expansion:', audio.muted);
      });
      
      volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
        const percentage = e.target.value * 100;
        e.target.style.background = `linear-gradient(to right, #b7c9a8 0%, #b7c9a8 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
        console.log('[Music] Volume changed after expansion:', audio.volume);
      });
      
      minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('[Music] Minimize button clicked after expansion');
        minimizePlayer();
      });
      
      // Click to expand when minimized
      player.addEventListener('click', (e) => {
        // Only expand if player is minimized and click is not on a control
        if (musicPlayerMinimized && !e.target.closest('button, input')) {
          expandPlayer();
        }
      });
    }
    
    console.log('[Music] Player expanded successfully, global audio continuity preserved');
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
  
  if (!mapElement) {
    console.log('[Map] Map element not found');
    return;
  }
  
  if (!mapSection) {
    console.log('[Map] Map section not found');
    return;
  }
  
  if (typeof L === 'undefined') {
    console.log('[Map] Leaflet not available, retrying in 2 seconds...');
    setTimeout(initializeMap, 2000);
    return;
  }

  console.log('[Map] Initializing map...');
  
  try {
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
    
    // Initialize empty markers array
    guestMarkers = [];
    
    console.log('[Map] Map initialized successfully');
    
    // Initialize map controls after a short delay
    setTimeout(initializeMapControls, 500);
    
  } catch (error) {
    console.error('[Map] Error initializing map:', error);
    mapInitialized = false;
  }
}
  
function initializeMapControls() {
  // Function to save pins to localStorage
  function savePinToStorage(lat, lng, type, popup) {
    const savedPins = JSON.parse(localStorage.getItem('porada-guest-pins') || '[]');
    savedPins.push({ lat, lng, type, popup, timestamp: Date.now() });
    localStorage.setItem('porada-guest-pins', JSON.stringify(savedPins));
  }
  
  // Function to load saved pins
  function loadSavedPins() {
    const savedPins = JSON.parse(localStorage.getItem('porada-guest-pins') || '[]');
    savedPins.forEach(pin => {
      const iconUrl = pin.type === 'user' 
        ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
        : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
        
      const marker = L.marker([pin.lat, pin.lng], {
        icon: L.icon({
          iconUrl: iconUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          shadowSize: [41, 41]
        })
      }).addTo(guestMap).bindPopup(pin.popup);
      
      guestMarkers.push(marker);
    });
    
    // Update map bounds after loading pins
    setTimeout(updateMapBounds, 500);
  }
  
  // Function to update map bounds based on markers
  function updateMapBounds() {
    if (guestMarkers.length > 0) {
      const group = new L.featureGroup(guestMarkers);
      guestMap.fitBounds(group.getBounds().pad(0.2));
      console.log(`[Map] Centered around ${guestMarkers.length} pins`);
    } else {
      // Default view if no pins
      guestMap.setView([40.0, -95.0], 4);
    }
  }
  
  // Load saved pins when controls are initialized
  loadSavedPins();
  
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
            
            // Save pin to localStorage
            savePinToStorage(userLat, userLng, 'user', '<b>You are here!</b>');
            
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
        
        // Save pin to localStorage
        savePinToStorage(e.latlng.lat, e.latlng.lng, 'manual', '<b>Guest Pin</b><br>Manually added');
        
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
  
  console.log('[Map] Map controls initialized successfully');
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
  
  console.log('[Gallery] Initializing dual-row engagement gallery with arrow navigation');
  
  // Get all images and create two rows
  const allImages = Array.from(gallery.querySelectorAll('img'));
  const midPoint = Math.ceil(allImages.length / 2);
  
  // Clear existing gallery content
  gallery.innerHTML = '';
  
  // Create container for two rows
  const galleryContainer = document.createElement('div');
  galleryContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: clamp(300px, 50vh, 400px);
    overflow: hidden;
    width: 100%;
    max-width: 100%;
  `;
  
  // Create two rows
  const row1 = document.createElement('div');
  const row2 = document.createElement('div');
  
  const rowStyles = `
    display: flex;
    gap: 15px;
    overflow: hidden;
    height: 50%;
    position: relative;
    align-items: center;
  `;
  
  row1.style.cssText = rowStyles;
  row1.className = 'gallery-row gallery-row-1';
  row2.style.cssText = rowStyles;
  row2.className = 'gallery-row gallery-row-2';
  
  // Distribute images between rows (staggered for visual appeal)
  allImages.forEach((img, index) => {
    const clonedImg = img.cloneNode(true);
    clonedImg.style.cssText = `
      height: clamp(150px, 25vh, 200px);
      width: auto;
      max-width: calc(50vw - 30px);
      object-fit: cover;
      border-radius: 8px;
      transition: transform 0.3s ease;
      flex-shrink: 0;
    `;
    
    // Stagger distribution: 0,2,4... to row1, 1,3,5... to row2
    if (index % 2 === 0) {
      row1.appendChild(clonedImg);
    } else {
      row2.appendChild(clonedImg);
    }
  });
  
  galleryContainer.appendChild(row1);
  galleryContainer.appendChild(row2);
  gallery.appendChild(galleryContainer);
  
  // Auto-scroll functionality for both rows
  let autoScrollInterval;
  let isPaused = false;
  let scrollDirection1 = 1; // Row 1 scrolls right
  let scrollDirection2 = -1; // Row 2 scrolls left (opposite)
  let scrollPosition1 = 0;
  let scrollPosition2 = 0;
  
  function startAutoScroll() {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    
    autoScrollInterval = setInterval(() => {
      if (!isPaused) {
        const maxScroll1 = row1.scrollWidth - row1.clientWidth;
        const maxScroll2 = row2.scrollWidth - row2.clientWidth;
        
        // Row 1 scrolling
        if (scrollDirection1 === 1) {
          if (scrollPosition1 >= maxScroll1) {
            scrollDirection1 = -1;
          } else {
            scrollPosition1 += 1;
            row1.scrollLeft = scrollPosition1;
          }
        } else {
          if (scrollPosition1 <= 0) {
            scrollDirection1 = 1;
          } else {
            scrollPosition1 -= 1;
            row1.scrollLeft = scrollPosition1;
          }
        }
        
        // Row 2 scrolling (opposite direction)
        if (scrollDirection2 === 1) {
          if (scrollPosition2 >= maxScroll2) {
            scrollDirection2 = -1;
          } else {
            scrollPosition2 += 1;
            row2.scrollLeft = scrollPosition2;
          }
        } else {
          if (scrollPosition2 <= 0) {
            scrollDirection2 = 1;
          } else {
            scrollPosition2 -= 1;
            row2.scrollLeft = scrollPosition2;
          }
        }
      }
    }, 25);
  }
  
  // Pause on hover
  gallery.addEventListener('mouseenter', () => {
    isPaused = true;
  });
  
  gallery.addEventListener('mouseleave', () => {
    isPaused = false;
  });
  
  // Update button styling to arrows and functionality
  if (prevBtn && nextBtn) {
    // Update button content to arrows
    prevBtn.innerHTML = '◀';
    nextBtn.innerHTML = '▶';
    
    // Update button styling
    const arrowButtonStyles = `
      background: rgba(183, 201, 168, 0.9);
      border: 2px solid white;
      color: #5d6b56;
      font-size: 18px;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-weight: bold;
    `;
    
    prevBtn.style.cssText = arrowButtonStyles;
    nextBtn.style.cssText = arrowButtonStyles;
    
    prevBtn.addEventListener('click', () => {
      isPaused = true;
      const scrollAmount = gallery.clientWidth * 0.6;
      scrollPosition1 = Math.max(0, scrollPosition1 - scrollAmount);
      scrollPosition2 = Math.max(0, scrollPosition2 - scrollAmount);
      row1.scrollTo({ left: scrollPosition1, behavior: 'smooth' });
      row2.scrollTo({ left: scrollPosition2, behavior: 'smooth' });
      setTimeout(() => { isPaused = false; }, 2000);
    });
    
    nextBtn.addEventListener('click', () => {
      isPaused = true;
      const scrollAmount = gallery.clientWidth * 0.6;
      const maxScroll1 = row1.scrollWidth - row1.clientWidth;
      const maxScroll2 = row2.scrollWidth - row2.clientWidth;
      scrollPosition1 = Math.min(maxScroll1, scrollPosition1 + scrollAmount);
      scrollPosition2 = Math.min(maxScroll2, scrollPosition2 + scrollAmount);
      row1.scrollTo({ left: scrollPosition1, behavior: 'smooth' });
      row2.scrollTo({ left: scrollPosition2, behavior: 'smooth' });
      setTimeout(() => { isPaused = false; }, 2000);
    });
  }
  
  // Start auto-scrolling
  startAutoScroll();
  
  console.log('[Gallery] Dual-row engagement gallery initialized with arrow navigation');
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
      const files = document.getElementById('photo-file').files;
      
      if (!name || files.length === 0) return;
      
      try {
        const uploads = [];
        
        // Process each file
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const timestamp = Date.now() + i; // Ensure unique timestamps
          
          // Check if file is image or video
          const isVideo = file.type.startsWith('video/');
          const isImage = file.type.startsWith('image/');
          
          if (!isVideo && !isImage) {
            console.warn('[Firebase] Skipping unsupported file type:', file.type);
            continue;
          }
          
          const folderName = isVideo ? 'shared-videos' : 'shared-photos';
          const storageRef = firebase.storage().ref(`${folderName}/${timestamp}-${file.name}`);
          
          const uploadPromise = new Promise((resolve, reject) => {
            const uploadTask = storageRef.put(file);
            
            uploadTask.on('state_changed', 
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`[Firebase] Upload ${file.name} ${progress.toFixed(1)}% done`);
              },
              (error) => {
                console.error('[Firebase] Upload error:', error);
                reject(error);
              },
              async () => {
                try {
                  const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                  
                  const mediaData = {
                    name: name,
                    url: downloadURL,
                    timestamp: timestamp,
                    fileName: file.name,
                    fileType: file.type,
                    isVideo: isVideo
                  };
                  
                  const dbRef = isVideo ? 'shared-videos' : 'shared-photos';
                  await firebase.database().ref(dbRef).push(mediaData);
                  
                  console.log(`[Firebase] ${isVideo ? 'Video' : 'Photo'} uploaded successfully:`, file.name);
                  resolve(mediaData);
                } catch (error) {
                  reject(error);
                }
              }
            );
          });
          
          uploads.push(uploadPromise);
        }
        
        // Wait for all uploads to complete
        await Promise.all(uploads);
        console.log('[Firebase] All files uploaded successfully');
        uploadForm.reset();
        loadSharedPhotos();
        
      } catch (error) {
        console.error('[Firebase] Error uploading files:', error);
      }
    });
  }
  
  loadSharedPhotos();
}

function loadSharedPhotos() {
  const gallery = document.getElementById('shared-photo-gallery');
  if (!gallery) return;
  
  // Load both photos and videos
  const loadMedia = () => {
    gallery.innerHTML = '';
    
    // Load photos
    firebase.database().ref('shared-photos').once('value', (photoSnapshot) => {
      const photos = photoSnapshot.val();
      if (photos) {
        Object.values(photos).forEach(photo => {
          const img = document.createElement('img');
          img.src = photo.url;
          img.alt = `Photo by ${photo.name}`;
          img.className = 'shared-upload';
          img.style.cssText = 'height: 200px; border-radius: 8px; margin: 5px; object-fit: cover; cursor: pointer; transition: transform 0.3s ease;';
          
          // Add hover effect
          img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
          });
          
          img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
          });
          
          gallery.appendChild(img);
        });
      }
      
      // Load videos
      firebase.database().ref('shared-videos').once('value', (videoSnapshot) => {
        const videos = videoSnapshot.val();
        if (videos) {
          Object.values(videos).forEach(video => {
            const videoElement = document.createElement('video');
            videoElement.src = video.url;
            videoElement.className = 'shared-upload';
            videoElement.controls = false;
            videoElement.muted = true;
            videoElement.style.cssText = 'height: 200px; border-radius: 8px; margin: 5px; object-fit: cover; cursor: pointer; transition: transform 0.3s ease;';
            
            // Add play icon overlay
            const playOverlay = document.createElement('div');
            playOverlay.innerHTML = '▶';
            playOverlay.style.cssText = `
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(0, 0, 0, 0.7);
              color: white;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              pointer-events: none;
            `;
            
            const videoContainer = document.createElement('div');
            videoContainer.style.cssText = 'position: relative; display: inline-block;';
            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(playOverlay);
            
            // Add hover effect
            videoContainer.addEventListener('mouseenter', () => {
              videoElement.style.transform = 'scale(1.05)';
            });
            
            videoContainer.addEventListener('mouseleave', () => {
              videoElement.style.transform = 'scale(1)';
            });
            
            gallery.appendChild(videoContainer);
          });
        }
        
        // Re-initialize photo popups for new uploads
        setTimeout(() => {
          initializePhotoPopups();
        }, 100);
      });
    });
  };
  
  // Use real-time listeners for live updates
  firebase.database().ref('shared-photos').on('value', loadMedia);
  firebase.database().ref('shared-videos').on('value', loadMedia);
}

// ===== RESTYLE SHARED ALBUM TO MATCH ENGAGEMENT GALLERY =====
function restyleSharedAlbumGallery() {
  const gallery = document.getElementById('shared-photo-gallery');
  const prevBtn = document.getElementById('shared-gallery-prev');
  const nextBtn = document.getElementById('shared-gallery-next');
  if (!gallery) return;

  // Get all media elements (img and video)
  const allMedia = Array.from(gallery.querySelectorAll('img.shared-upload, video.shared-upload'));
  if (allMedia.length === 0) return;

  // Clear gallery
  gallery.innerHTML = '';

  // Create two rows
  const galleryContainer = document.createElement('div');
  galleryContainer.style.cssText = `display: flex; flex-direction: column; gap:  15px; height: clamp(300px, 50vh, 400px); overflow: hidden; width: 100%; max-width: 100%;`;
  const row1 = document.createElement('div');
  const row2 = document.createElement('div');
  const rowStyles = `display: flex; gap: 15px; overflow: hidden; height: 50%; align-items: center;`;
  row1.style.cssText = rowStyles;
  row1.className = 'gallery-row gallery-row-1';
  row2.style.cssText = rowStyles;
  row2.className = 'gallery-row gallery-row-2';

  // Distribute media between rows (staggered)
  allMedia.forEach((media, index) => {
    const cloned = media.cloneNode(true);
    if (index % 2 === 0) {
      row1.appendChild(cloned);
    } else {
      row2.appendChild(cloned);
    }
  });

  galleryContainer.appendChild(row1);
  galleryContainer.appendChild(row2);
  gallery.appendChild(galleryContainer);

  // Scrolling logic
  let autoScrollInterval;
  let isPaused = false;
  let scrollDirection1 = 1;
  let scrollDirection2 = -1;
  let scrollPosition1 = 0;
  let scrollPosition2 = 0;

  function startAutoScroll() {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
      if (!isPaused) {
        const maxScroll1 = row1.scrollWidth - row1.clientWidth;
        const maxScroll2 = row2.scrollWidth - row2.clientWidth;
        // Row 1
        if (scrollDirection1 === 1) {
          if (scrollPosition1 >= maxScroll1) {
            scrollDirection1 = -1;
          } else {
            scrollPosition1 += 1;
            row1.scrollLeft = scrollPosition1;
          }
        } else {
          if (scrollPosition1 <= 0) {
            scrollDirection1 = 1;
          } else {
            scrollPosition1 -= 1;
            row1.scrollLeft = scrollPosition1;
          }
        }
        // Row 2
        if (scrollDirection2 === 1) {
          if (scrollPosition2 >= maxScroll2) {
            scrollDirection2 = -1;
          } else {
            scrollPosition2 += 1;
            row2.scrollLeft = scrollPosition2;
          }
        } else {
          if (scrollPosition2 <= 0) {
            scrollDirection2 = 1;
          } else {
            scrollPosition2 -= 1;
            row2.scrollLeft = scrollPosition2;
          }
        }
      }
    }, 25);
  }

  gallery.addEventListener('mouseenter', () => { isPaused = true; });
  gallery.addEventListener('mouseleave', () => { isPaused = false; });

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      isPaused = true;
      const scrollAmount = gallery.clientWidth * 0.6;
      scrollPosition1 = Math.max(0, scrollPosition1 - scrollAmount);
      scrollPosition2 = Math.max(0, scrollPosition2 - scrollAmount);
      row1.scrollTo({ left: scrollPosition1, behavior: 'smooth' });
      row2.scrollTo({ left: scrollPosition2, behavior: 'smooth' });
      setTimeout(() => { isPaused = false; }, 2000);
    });
    nextBtn.addEventListener('click', () => {
      isPaused = true;
      const scrollAmount = gallery.clientWidth * 0.6;
      const maxScroll1 = row1.scrollWidth - row1.clientWidth;
      const maxScroll2 = row2.scrollWidth - row2.clientWidth;
      scrollPosition1 = Math.min(maxScroll1, scrollPosition1 + scrollAmount);
      scrollPosition2 = Math.min(maxScroll2, scrollPosition2 + scrollAmount);
      row1.scrollTo({ left: scrollPosition1, behavior: 'smooth' });
      row2.scrollTo({ left: scrollPosition2, behavior: 'smooth' });
      setTimeout(() => { isPaused = false; }, 2000);
    });
  }
  startAutoScroll();
  
  // Re-initialize photo popups for the restyled gallery
  setTimeout(() => {
    initializePhotoPopups();
  }, 200);
}

// Auto-extend guestbook textarea to match map height
function autoExtendGuestbookTextarea() {
  const map = document.getElementById('guest-map');
  const textarea = document.getElementById('guest-message');
  if (!map || !textarea) return;
  // Wait for map to render
  setTimeout(() => {
    const mapHeight = map.offsetHeight;
    if (mapHeight > 0) {
      textarea.style.minHeight = mapHeight + 'px';
    }
  }, 500);
}
window.addEventListener('resize', autoExtendGuestbookTextarea);
document.addEventListener('DOMContentLoaded', autoExtendGuestbookTextarea);
setTimeout(autoExtendGuestbookTextarea, 2000);

// Patch map initialization to call autoExtendGuestbookTextarea after map loads
const originalMapInit = initializeMap;
initializeMap = function() {
  originalMapInit();
  setTimeout(autoExtendGuestbookTextarea, 1000);
};

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
function initializeDynamicFeatures(includeMusic = true) {
  if (dynamicFeaturesInitialized) {
    console.log('[Init] Dynamic features already initialized');
    return;
  }
  
  console.log('[Init] Initializing all dynamic features...');
  
  // Initialize components immediately for smooth experience
  // Only create music player if requested AND not already enabled separately
  if (includeMusic && !musicEnabled) {
    setTimeout(() => createBackgroundMusicPlayer(), 100);
  }
  
  // Initialize core features immediately
  initializeVideoPlayer();
  initializeEngagementGallery();
  
  // Initialize photo popups and optimize family tree layout
  initializePhotoPopups();
  optimizeFamilyTreeLayout();
  
  // Stagger heavy components to prevent blocking
  setTimeout(() => {
    initializeMap();
    initializeSharedAlbum();
  }, 500);
  
  setTimeout(() => {
    initializeGuestbook();
  }, 1000);
  
  dynamicFeaturesInitialized = true;
  console.log('[Init] All dynamic features initialized with staggered loading');
}

// Make function globally available
window.initializeDynamicFeatures = initializeDynamicFeatures;

// DON'T auto-initialize - wait for user interaction via continue button
// Auto-initialize removed to prevent music player from loading before user consent

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

// Create stacked end intro buttons
function createEndIntroButtons() {
  if (document.getElementById('end-intro-buttons')) return;
  
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'end-intro-buttons';
  buttonContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
  `;
  
  // Enter Site with Music button
  const enterSiteBtn = document.createElement('button');
  enterSiteBtn.id = 'enter-site-btn';
  enterSiteBtn.textContent = 'Enter Site with Music';
  enterSiteBtn.style.cssText = `
    background: linear-gradient(135deg, var(--sage-green) 0%, var(--sage-green-dark) 100%);
    border: none;
    color: white;
    padding: 15px 35px;
    border-radius: 25px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    min-width: 200px;
    text-align: center;
  `;
  
  // Replay Intro button
  const replayIntroBtn = document.createElement('button');
  replayIntroBtn.id = 'replay-intro-btn';
  replayIntroBtn.textContent = 'Replay Intro';
  replayIntroBtn.style.cssText = `
    background: linear-gradient(135deg, var(--gold) 0%, #b8965f 100%);
    border: none;
    color: white;
    padding: 15px 35px;
    border-radius: 25px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    min-width: 200px;
    text-align: center;
  `;
  
  // Enter Site button functionality
  enterSiteBtn.addEventListener('click', () => {
    console.log('[Init] Enter Site with Music button clicked - showing main content and initializing features...');
    
    // Enable music first
    if (!musicEnabled) {
      enableMusic();
    }
    
    // Show main content and footer now
    const mainContent = document.getElementById('main-content');
    mainContent.style.display = 'block';
    const footer = document.getElementById('site-footer');
    if (footer) {
      footer.style.display = 'block';
    }
    
    buttonContainer.style.opacity = 0;
    setTimeout(() => {
      buttonContainer.remove();
      
      // Initialize all dynamic features EXCEPT music (music is handled separately)
      initializeDynamicFeatures(false); // false = don't initialize music
      
      // Initialize scroll video logic after content is shown
      initializeScrollVideo();
      
      // Scroll to scroll-section after content loads
      const scrollSection = document.getElementById('scroll-section');
      if (scrollSection && !window._hasScrolledToScrollSection) {
        setTimeout(() => {
          scrollSection.scrollIntoView({ behavior: 'smooth' });
          window._hasScrolledToScrollSection = true;
        }, 500);
      }
    }, 300);
  });
  
  // Replay Intro button functionality
  replayIntroBtn.addEventListener('click', () => {
    console.log('[Init] Replay Intro button clicked');
    buttonContainer.remove();
    
    // Get elements in scope
    const mainContent = document.getElementById('main-content');
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-intro');
    const body = document.body;
    
    // Reset intro
    window.scrollTo({ top: 0, behavior: 'smooth' });
    introVideo.currentTime = 0;
    introVideo.play();
    skipBtn.style.opacity = 0;
    skipBtn.style.display = '';
    skipBtn.disabled = false;
    body.style.overflow = 'hidden';
    mainContent.style.display = 'none';
    introActive = true;
    
    // Show enable music button again
    const enableMusicBtn = document.getElementById('enable-music-btn');
    if (enableMusicBtn) {
      enableMusicBtn.style.display = '';
    } else {
      createEnableMusicButton();
    }
    
    fallbackTimeout = setTimeout(() => {
      if (!videoStarted) {
        endIntro();
      }
    }, 3000);
  });
  
  // Hover effects
  enterSiteBtn.addEventListener('mouseenter', () => {
    enterSiteBtn.style.transform = 'scale(1.05)';
    enterSiteBtn.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)';
  });
  
  enterSiteBtn.addEventListener('mouseleave', () => {
    enterSiteBtn.style.transform = 'scale(1)';
    enterSiteBtn.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
  });
  
  replayIntroBtn.addEventListener('mouseenter', () => {
    replayIntroBtn.style.transform = 'scale(1.05)';
    replayIntroBtn.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.25)';
  });
  
  replayIntroBtn.addEventListener('mouseleave', () => {
    replayIntroBtn.style.transform = 'scale(1)';
    replayIntroBtn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
  });
  
  buttonContainer.appendChild(enterSiteBtn);
  buttonContainer.appendChild(replayIntroBtn);
  document.body.appendChild(buttonContainer);
}

// ===== SCROLL VIDEO INITIALIZATION =====
function initializeScrollVideo() {
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
            scrollVideo.setAttribute('playsinline', 'true');
            scrollVideo.setAttribute('webkit-playsinline', 'true');
            scrollVideo.style.cssText = 'background:#fff;width:100%;display:block;height:100vh;object-fit:cover;';
            const source = document.createElement('source');
            source.type = 'video/mp4';
            source.src = 'video/scroll.mp4';
            scrollVideo.appendChild(source);
            scrollSection.appendChild(scrollVideo);
            
            // Add return to intro button
            if (!document.getElementById('return-to-intro-btn')) {
              const returnBtn = document.createElement('button');
              returnBtn.id = 'return-to-intro-btn';
              returnBtn.textContent = 'Return to Intro';
              returnBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(183, 201, 168, 0.8);
                border: 2px solid white;
                color: #333;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-family: 'Montserrat', sans-serif;
                font-size: 0.85rem;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
              `;
              
              returnBtn.addEventListener('click', () => {
                console.log('[Intro] Return to intro button clicked');
                returnToIntro();
              });
              
              returnBtn.addEventListener('mouseenter', () => {
                returnBtn.style.transform = 'scale(1.05)';
                returnBtn.style.background = 'rgba(255, 255, 255, 0.9)';
                returnBtn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              });
              
              returnBtn.addEventListener('mouseleave', () => {
                returnBtn.style.transform = 'scale(1)';
                returnBtn.style.background = 'rgba(183, 201, 168, 0.8)';
                returnBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              });
              
              scrollSection.style.position = 'relative';
              scrollSection.appendChild(returnBtn);
            }
          }
          scrollVideo.load();
          scrollVideo.play().catch(()=>{});
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(scrollSection);
  }
}

// ===== RETURN TO INTRO FUNCTIONALITY =====
function returnToIntro() {
  console.log('[Intro] Returning to intro section...');
  
  // Get intro video and main content elements
  const introVideo = document.getElementById('intro-video');
  const mainContent = document.getElementById('main-content');
  const introSection = document.getElementById('intro-section');
  const skipBtn = document.getElementById('skip-intro');
  const enableMusicBtn = document.getElementById('enable-music-btn');
  const footer = document.getElementById('site-footer');
  
  // Hide main content and footer
  if (mainContent) mainContent.style.display = 'none';
  if (footer) footer.style.display = 'none';
  
  // Show intro section
  if (introSection) {
    introSection.style.display = 'block';
    introSection.style.opacity = '1';
  }
  
  // Reset intro video
  if (introVideo) {
    introVideo.currentTime = 0;
    introVideo.style.display = 'block';
    
    // Reset intro state
    introActive = true;
    introWasSkipped = false;
    videoStarted = false;
    
    // Hide skip button initially and reset it to full state
    if (skipBtn) {
      resetSkipButton();
      skipBtn.style.opacity = '0';
      skipBtn.style.display = '';
      skipBtn.disabled = false;
    }
    
    // Show enable music button if it doesn't exist
    if (!enableMusicBtn && !musicEnabled) {
      createEnableMusicButton();
    } else if (enableMusicBtn) {
      enableMusicBtn.style.display = '';
    }
    
    // Reset body overflow
    document.body.style.overflow = 'hidden';
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Start playing the intro video
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.log('[Intro] Video autoplay failed on return, waiting for user interaction');
      });
    }
    
    // Set up skip button timer again
    introVideo.addEventListener('play', function onPlayOnce() {
      videoStarted = true;
      skipTimeout = setTimeout(showSkipBtn, 10000);
      introVideo.removeEventListener('play', onPlayOnce);
    });
    
    // Clean up any end intro buttons
    const endIntroButtons = document.getElementById('end-intro-buttons');
    if (endIntroButtons) {
      endIntroButtons.remove();
    }
    
    // Minimize music player if it's expanded
    const musicPlayer = document.getElementById('background-music-player');
    if (musicPlayer && !musicPlayerMinimized) {
      minimizePlayer();
    }
  }
  
  console.log('[Intro] Successfully returned to intro');
}

// ===== PRELOADING & OPTIMIZATION =====
function preloadCriticalAssets() {
  console.log('[Preload] Starting critical asset preloading...');
  
  // Preload key images
  const criticalImages = [
    'images/austin.webp',
    'images/jordyn.webp',
    'images/engagement/PoradaProposal-4.jpg',
    'images/engagement/PoradaProposal-6.jpg',
    'images/engagement/PoradaProposal-11.jpg'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => console.log(`[Preload] Loaded: ${src}`);
    img.onerror = () => console.log(`[Preload] Failed: ${src}`);
  });
  
  // Preload scroll video
  const scrollVideo = document.createElement('video');
  scrollVideo.preload = 'metadata';
  scrollVideo.src = 'video/scroll.mp4';
  scrollVideo.muted = true;
  scrollVideo.load();
  
  console.log('[Preload] Critical assets preload initiated');
}

// Call preloading immediately
preloadCriticalAssets();

// ===== PHOTO POPUP FUNCTIONALITY =====
function initializePhotoPopups() {
  console.log('[PhotoPopup] Initializing photo popups for family tree, engagement, and ring photos...');
  
  // Add click listeners to all family tree photos
  const familyPhotos = document.querySelectorAll('.tree-person-photo');
  familyPhotos.forEach(photo => {
    photo.style.cursor = 'pointer';
    photo.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Get the background image URL
      const bgImage = photo.style.backgroundImage;
      const imageUrl = bgImage.slice(5, -2); // Remove 'url("' and '")'
      
      if (imageUrl) {
        openPhotoPopup(imageUrl, photo.getAttribute('alt') || 'Family Photo');
      }
    });
    
    // Add hover effect
    photo.addEventListener('mouseenter', () => {
      photo.style.transform = 'scale(1.05)';
      photo.style.transition = 'transform 0.3s ease';
    });
    
    photo.addEventListener('mouseleave', () => {
      photo.style.transform = 'scale(1)';
    });
  });
  
  // Add click listeners to engagement gallery photos
  const engagementPhotos = document.querySelectorAll('#engagement-gallery img, .horizontal-scroll-gallery img, .engagement-photo');
  engagementPhotos.forEach(photo => {
    photo.style.cursor = 'pointer';
    photo.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      let imageUrl = '';
      let altText = 'Engagement Photo';
      
      if (photo.tagName === 'IMG') {
        imageUrl = photo.src;
        altText = photo.alt || 'Engagement Photo';
      } else if (photo.style.backgroundImage) {
        const bgImage = photo.style.backgroundImage;
        imageUrl = bgImage.slice(5, -2); // Remove 'url("' and '")'
        altText = photo.getAttribute('alt') || 'Engagement Photo';
      }
      
      if (imageUrl) {
        openPhotoPopup(imageUrl, altText);
      }
    });
    
    // Add hover effect
    photo.addEventListener('mouseenter', () => {
      photo.style.transform = 'scale(1.05)';
      photo.style.transition = 'transform 0.3s ease';
    });
    
    photo.addEventListener('mouseleave', () => {
      photo.style.transform = 'scale(1)';
    });
  });
  
  // Add click listeners to ring photos
  const ringPhotos = document.querySelectorAll('.ring-img, .rings-row img, .ring-section img, .ring-section .ring-photo');
  ringPhotos.forEach(photo => {
    photo.style.cursor = 'pointer';
    photo.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      let imageUrl = '';
      let altText = 'Ring Photo';
      
      if (photo.tagName === 'IMG') {
        imageUrl = photo.src;
        altText = photo.alt || 'Ring Photo';
      } else if (photo.style.backgroundImage) {
        const bgImage = photo.style.backgroundImage;
        imageUrl = bgImage.slice(5, -2); // Remove 'url("' and '")'
        altText = photo.getAttribute('alt') || 'Ring Photo';
      }
      
      if (imageUrl) {
        openPhotoPopup(imageUrl, altText);
      }
    });
    
    // Add hover effect
    photo.addEventListener('mouseenter', () => {
      photo.style.transform = 'scale(1.05)';
      photo.style.transition = 'transform 0.3s ease';
    });
    
    photo.addEventListener('mouseleave', () => {
      photo.style.transform = 'scale(1)';
    });
  });
  
  // Add click listeners to shared uploaded photos/videos
  const sharedUploads = document.querySelectorAll('.shared-upload, #shared-photo-gallery img, #shared-photo-gallery video');
  sharedUploads.forEach(upload => {
    upload.style.cursor = 'pointer';
    upload.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      let mediaUrl = '';
      let altText = 'Shared Upload';
      let isVideo = false;
      
      if (upload.tagName === 'IMG') {
        mediaUrl = upload.src;
        altText = upload.alt || 'Shared Photo';
      } else if (upload.tagName === 'VIDEO') {
        mediaUrl = upload.src;
        altText = upload.title || 'Shared Video';
        isVideo = true;
      } else if (upload.style.backgroundImage) {
        const bgImage = upload.style.backgroundImage;
        mediaUrl = bgImage.slice(5, -2); // Remove 'url("' and '")'
        altText = upload.getAttribute('alt') || 'Shared Upload';
      }
      
      if (mediaUrl) {
        if (isVideo) {
          openVideoPopup(mediaUrl, altText);
        } else {
          openPhotoPopup(mediaUrl, altText);
        }
      }
    });
    
    // Add hover effect
    upload.addEventListener('mouseenter', () => {
      upload.style.transform = 'scale(1.05)';
      upload.style.transition = 'transform 0.3s ease';
    });
    
    upload.addEventListener('mouseleave', () => {
      upload.style.transform = 'scale(1)';
    });
  });
}

function openPhotoPopup(imageUrl, altText) {
  console.log('[PhotoPopup] Opening photo popup for:', imageUrl);
  
  // Remove any existing popup
  const existingPopup = document.getElementById('photo-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  // Create popup overlay
  const popup = document.createElement('div');
  popup.id = 'photo-popup';
  popup.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: 20000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(5px);
  `;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(183, 201, 168, 0.9);
    border: 2px solid white;
    color: #333;
    font-size: 24px;
    font-weight: bold;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Montserrat', sans-serif;
    transition: all 0.3s ease;
    z-index: 20001;
  `;
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = 'rgba(255, 255, 255, 0.9)';
    closeBtn.style.transform = 'scale(1.1)';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'rgba(183, 201, 168, 0.9)';
    closeBtn.style.transform = 'scale(1)';
  });
  
  closeBtn.addEventListener('click', closePhotoPopup);
  
  // Create image element
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = altText;
  img.style.cssText = `
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
  `;
  
  // Add elements to popup
  popup.appendChild(closeBtn);
  popup.appendChild(img);
  
  // Add popup to document
  document.body.appendChild(popup);
  
  // Animate in
  setTimeout(() => {
    popup.style.opacity = '1';
  }, 10);
  
  // Close on background click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closePhotoPopup();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', handleEscapeKey);
}

function closePhotoPopup() {
  const popup = document.getElementById('photo-popup');
  if (popup) {
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.remove();
      document.removeEventListener('keydown', handleEscapeKey);
    }, 300);
  }
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closePhotoPopup();
  }
}

function openVideoPopup(videoUrl, altText) {
  console.log('[VideoPopup] Opening video popup for:', videoUrl);
  
  // Remove any existing popup
  const existingPopup = document.getElementById('media-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  // Create popup overlay
  const popup = document.createElement('div');
  popup.id = 'media-popup';
  popup.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: 20000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(5px);
  `;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(183, 201, 168, 0.9);
    border: 2px solid white;
    color: #333;
    font-size: 24px;
    font-weight: bold;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Montserrat', sans-serif;
    transition: all 0.3s ease;
    z-index: 20001;
  `;
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = 'rgba(255, 255, 255, 0.9)';
    closeBtn.style.transform = 'scale(1.1)';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'rgba(183, 201, 168, 0.9)';
    closeBtn.style.transform = 'scale(1)';
  });
  
  closeBtn.addEventListener('click', closeMediaPopup);
  
  // Create video element
  const video = document.createElement('video');
  video.src = videoUrl;
  video.controls = true;
  video.style.cssText = `
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
  `;
  
  // Add elements to popup
  popup.appendChild(closeBtn);
  popup.appendChild(video);
  
  // Add popup to document
  document.body.appendChild(popup);
  
  // Animate in
  setTimeout(() => {
    popup.style.opacity = '1';
  }, 10);
  
  // Close on background click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closeMediaPopup();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', handleMediaEscapeKey);
}

function closeMediaPopup() {
  const popup = document.getElementById('media-popup');
  if (popup) {
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.remove();
      document.removeEventListener('keydown', handleMediaEscapeKey);
    }, 300);
  }
}

function handleMediaEscapeKey(e) {
  if (e.key === 'Escape') {
    closeMediaPopup();
  }
}

// ===== FAMILY TREE LAYOUT OPTIMIZATION =====
function optimizeFamilyTreeLayout() {
  console.log('[FamilyTree] Optimizing family tree layout...');
  
  // Find all family tree rows that need optimization (not the couple row)
  const familyRows = document.querySelectorAll('.family-tree-row:not(.couple-row)');
  
  familyRows.forEach(row => {
    const people = Array.from(row.children);
    const personCount = people.length;
    
    // For rows with many people, consider splitting into balanced rows
    if (personCount > 6) {
      balanceLargeRow(row, people);
    }
  });
  
  // Apply responsive grid layout to all rows
  applyResponsiveGridLayout();
}

function getNextFamilyRow(currentRow) {
  let nextElement = currentRow.nextElementSibling;
  while (nextElement) {
    if (nextElement.classList.contains('family-tree-row')) {
      return nextElement;
    }
    // Look inside section blocks
    const rowInSection = nextElement.querySelector('.family-tree-row');
    if (rowInSection) {
      return rowInSection;
    }
    nextElement = nextElement.nextElementSibling;
  }
  return null;
}

function balanceLargeRow(row, people) {
  const personCount = people.length;
  
  // For 7+ people, split into two rows
  if (personCount >= 7) {
    const midPoint = Math.ceil(personCount / 2);
    const firstRowPeople = people.slice(0, midPoint);
    const secondRowPeople = people.slice(midPoint);
    
    // Create new row for second half
    const newRow = document.createElement('div');
    newRow.className = 'family-tree-row';
    
    // Move second half to new row
    secondRowPeople.forEach(person => {
      newRow.appendChild(person);
    });
    
    // Insert new row after current row
    row.parentNode.insertBefore(newRow, row.nextSibling);
    
    console.log(`[FamilyTree] Split row of ${personCount} into ${firstRowPeople.length} and ${secondRowPeople.length}`);
  }
}

function applyResponsiveGridLayout() {
  const familyRows = document.querySelectorAll('.family-tree-row');
  
  familyRows.forEach(row => {
    const personCount = row.children.length;
    
    // Apply appropriate grid layout based on person count
    if (personCount === 2) {
      row.style.display = 'flex';
      row.style.justifyContent = 'center';
      row.style.gap = '60px';
      row.style.maxWidth = '600px';
      row.style.margin = '0 auto';
    } else if (personCount === 3) {
      row.style.display = 'flex';
      row.style.justifyContent = 'center';
      row.style.gap = '40px';
      row.style.maxWidth = '800px';
      row.style.margin = '0 auto';
    } else if (personCount === 4) {
      row.style.display = 'grid';
      row.style.gridTemplateColumns = 'repeat(2, 1fr)';
      row.style.gap = '30px';
      row.style.justifyItems = 'center';
      row.style.maxWidth = '600px';
      row.style.margin = '0 auto';
    } else if (personCount >= 5) {
      row.style.display = 'grid';
      row.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
      row.style.gap = '25px';
      row.style.justifyItems = 'center';
      row.style.maxWidth = '1000px';
      row.style.margin = '0 auto';
    }
  });
}

// Initial optimization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  optimizeFamilyTreeLayout();
});
