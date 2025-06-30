# 🔧 Testing Guide

## Firebase Shared Album Testing

After opening the website in your browser, open the Developer Console (F12 → Console tab) and test these functions:

### Test Functions Available:
- `addTestPhoto()` - Adds a test photo with working image URL
- `clearAllPhotos()` - Removes all photos from the shared album

### Testing Steps:
1. Open website in browser
2. Press F12 to open Developer Tools
3. Click "Console" tab
4. Type `addTestPhoto()` and press Enter
5. Check if a test photo appears in the "Shared Photos" section
6. Try uploading a real photo using the form
7. Use `clearAllPhotos()` to clean up when testing is done

## New Features to Test:

### 🖼️ Fullscreen Photo Viewer:
1. Click on any photo in any gallery (engagement, rings, shared)
2. Photo should open in fullscreen overlay
3. Click anywhere or press Escape to close
4. Cursor should show zoom-in icon on hover

### ▶️ Video Player Improvements:
1. Main video should show custom overlay instead of default play button
2. Click the overlay to start video playback
3. Overlay should disappear when video starts
4. Chapter titles should be properly capitalized when chapter menu is accessed

### 🖱️ Enhanced Arrow Navigation:
1. Scroll to any photo gallery (Engagement, Rings, or Shared Photos)
2. Click the left/right arrow buttons multiple times
3. Gallery should scroll smoothly in the clicked direction
4. Arrow navigation should work consistently every time

## Browser Console Commands:
```javascript
// Add test photo (uses working Picsum image)
addTestPhoto()

// Clear all photos
clearAllPhotos()

// Check Firebase connection status
console.log("DB connected:", !!window.db)
console.log("Storage connected:", !!window.storage)

// Check current photos
window.db.ref('wedding-photos').once('value').then(snap => console.log('Current photos:', snap.val()))
```

## Expected Behavior:
- ✅ Test photos should appear in the shared gallery
- ✅ Arrow navigation should work repeatedly on all galleries  
- ✅ Photo upload form should accept files
- ✅ **NEW:** Photos open in fullscreen when clicked
- ✅ **NEW:** Video shows custom overlay instead of default play button
- ✅ **NEW:** Chapter titles are properly capitalized
- ✅ Map should load without excessive tile loading messages
- ✅ Music player should appear (may be hidden if no audio files)
- ✅ Video should play with chapter markers
- ✅ Broken images show placeholder instead of hiding

## Pre-loaded Sample Photos:
The Firebase database now contains 2 sample wedding photos that should display automatically when you load the page.

## Troubleshooting:
- If `db is not defined` errors appear, refresh the page
- If test functions don't work, ensure Firebase is loaded (check console for "Successfully initialized")
- Audio 404 errors are normal until you add `audio/wedding-background.mp3`
- Map tile loading messages are now reduced for cleaner console output
