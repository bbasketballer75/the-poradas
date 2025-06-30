# Photo Management Guide for The Poradas Wedding Website

## 📂 Photo Directory Structure

Your website is organized into specific folders for different types of photos:

### 1. Main Video Cover Photo
**Location:** `images/`
**File name:** `main-video-cover.jpg` or `main-video-cover.webp`
**Purpose:** This appears as the poster/thumbnail for your main wedding video before it plays
**Recommended size:** 1920x1080px (16:9 aspect ratio)
**How to add:** Simply place your chosen cover photo in the `images/` folder with this exact name

### 2. Engagement Photos
**Location:** `images/engagement/`
**Purpose:** These appear in the horizontal scrolling engagement album section
**Recommended format:** `.webp` or `.jpg`
**Recommended size:** 400-800px height, any width (they will auto-resize)
**How to add:** 
- Create an `engagement/` folder inside the `images/` folder if it doesn't exist
- Place all your engagement photos in this folder
- Name them descriptively (e.g., `engagement-1.webp`, `sunset-engagement.jpg`, etc.)

### 3. Ring Photos
**Location:** `images/rings/`
**Purpose:** These appear in the rings showcase section
**Recommended format:** `.webp` or `.jpg`
**Recommended size:** Square format preferred (1:1 ratio), 800x800px ideal
**How to add:**
- Create a `rings/` folder inside the `images/` folder if it doesn't exist
- Place your ring photos in this folder
- Name them descriptively (e.g., `engagement-ring.webp`, `wedding-bands.jpg`, etc.)

### 4. Shared Photo Album (Guest Uploads)
**Location:** Firebase Storage (automatic)
**Purpose:** Guests upload photos here during/after the wedding
**How it works:** 
- Guests use the photo upload form on your website
- Photos are automatically stored in Firebase Storage
- They appear in the shared gallery section automatically
- No manual management needed - it's all handled by the website!

## 🔄 How to Update Photos

### For Static Photos (engagement, rings, video cover):
1. **Prepare your photos:**
   - Resize them to recommended dimensions
   - Convert to `.webp` format for best performance (optional but recommended)
   - Name them descriptively

2. **Upload to correct folders:**
   ```
   📁 images/
   ├── 📁 engagement/
   │   ├── engagement-1.webp
   │   ├── engagement-2.webp
   │   └── engagement-3.webp
   ├── 📁 rings/
   │   ├── engagement-ring.webp
   │   └── wedding-bands.webp
   └── main-video-cover.webp
   ```

3. **Update HTML if needed:**
   - For engagement photos: The website automatically loads all photos from the `images/engagement/` folder
   - For ring photos: Update the HTML in `index.html` in the rings section
   - For video cover: Make sure the file is named exactly `main-video-cover.webp` or update the video tag in the HTML

### For Shared Album:
- **No action needed!** Guests upload directly through the website
- Photos are stored in Firebase and appear automatically
- You can view/download them from your Firebase console if needed

## 📝 Important Notes

- **File formats:** `.webp` is preferred for better compression, but `.jpg` and `.png` work too
- **File sizes:** Keep individual photos under 2MB for faster loading
- **Backup:** Always keep original high-resolution versions of your photos separate
- **Testing:** After adding photos, test the website to make sure they load correctly

## 🚨 Quick Checklist

- [ ] Main video cover photo in `images/`
- [ ] Engagement photos in `images/engagement/`
- [ ] Ring photos in `images/rings/`
- [ ] Firebase is set up for guest photo uploads (already done!)
- [ ] Test website after adding photos

Your wedding website will automatically load and display photos from these locations!
