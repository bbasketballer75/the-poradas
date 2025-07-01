// Music Player Test Script
// Run this in the browser console after the page loads

console.log('=== MUSIC PLAYER INITIALIZATION TEST ===');

// Test 1: Check if music player exists immediately after page load
setTimeout(() => {
    console.log('\n🔍 TEST 1: Checking music player after page load...');
    const musicPlayer = document.getElementById('background-music-player');
    if (musicPlayer) {
        console.log('❌ FAIL: Music player found immediately after page load!');
        console.log('Player:', musicPlayer);
    } else {
        console.log('✅ PASS: No music player found after page load (correct)');
    }
}, 1000);

// Test 2: Check if continue button exists after intro
setTimeout(() => {
    console.log('\n🔍 TEST 2: Checking for continue button...');
    const continueBtn = document.getElementById('continue-button');
    if (continueBtn) {
        console.log('✅ PASS: Continue button found');
        console.log('Button text:', continueBtn.textContent);
    } else {
        console.log('❌ FAIL: Continue button not found');
    }
}, 2000);

// Test 3: Monitor for music player creation
const checkForMusicPlayer = () => {
    const musicPlayer = document.getElementById('background-music-player');
    if (musicPlayer && !window.musicPlayerDetected) {
        window.musicPlayerDetected = true;
        console.log('\n🎵 MUSIC PLAYER DETECTED!');
        console.log('Time since page load:', Date.now() - window.pageLoadTime);
        console.trace('Stack trace when music player was detected');
    }
};

window.pageLoadTime = Date.now();
window.musicPlayerDetected = false;

// Check every 500ms for music player
const monitorInterval = setInterval(checkForMusicPlayer, 500);

// Stop monitoring after 30 seconds
setTimeout(() => {
    clearInterval(monitorInterval);
    console.log('\n⏰ Monitoring stopped after 30 seconds');
    if (!window.musicPlayerDetected) {
        console.log('✅ No music player was created during monitoring period');
    }
}, 30000);

// Test 4: Manual continue button test
window.testContinueButton = () => {
    console.log('\n🧪 MANUAL TEST: Simulating continue button click...');
    const continueBtn = document.getElementById('continue-button');
    if (continueBtn) {
        continueBtn.click();
        console.log('✅ Continue button clicked');
        
        // Check if music player appears after click
        setTimeout(() => {
            const musicPlayer = document.getElementById('background-music-player');
            if (musicPlayer) {
                console.log('✅ PASS: Music player created after continue button click (correct)');
            } else {
                console.log('❌ FAIL: Music player not created after continue button click');
            }
        }, 2000);
    } else {
        console.log('❌ Continue button not found for manual test');
    }
};

console.log('\n📝 To manually test the continue button, run: testContinueButton()');
console.log('📝 Monitoring will run for 30 seconds...');
