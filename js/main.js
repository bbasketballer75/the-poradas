// This event is fired from index.html after all prompts are handled.
window.addEventListener('locationReady', () => {
  console.log('Location ready, initializing website modules.');

  // --- Initialize Main Film Player with Video.js ---
  const mainFilmPlayer = videojs('main-film-video');
  mainFilmPlayer.ready(function() {
    const tracks = this.textTracks();
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].kind === 'chapters') {
        tracks[i].mode = 'showing';
      }
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
    if (!mapContainer) return;

    function loadScript(url, cb) {
      if (document.querySelector(`script[src="${url}"]`)) {
        if (cb) cb(); return;
      }
      const s = document.createElement('script'); s.src = url; s.onload = cb;
      document.head.appendChild(s);
    }
    function loadCSS(url) {
      if (document.querySelector(`link[href="${url}"]`)) return;
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = url;
      document.head.appendChild(l);
    }

    function initMap() {
      if (mapContainer._leaflet_id) return; // Prevent re-initialization
      const map = L.map('guest-map').setView([39.5, -98.35], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      db.ref('guest-pins').on('value', snap => {
        Object.values(snap.val() || {}).forEach(p => L.marker([p.lat, p.lng]).addTo(map));
      });

      if (window.guestLocation) {
        const { latitude: lat, longitude: lng } = window.guestLocation;
        L.marker([lat, lng], { title: "Your Location" }).addTo(map);
        db.ref('guest-pins').push({ lat, lng, time: Date.now() });
        map.setView([lat, lng], 6);
      } else {
        const pinArea = document.getElementById('manual-pin-area');
        const pinBtn = document.getElementById('manual-pin-btn');
        if (pinArea) pinArea.style.display = 'block';
        if (pinBtn) {
          pinBtn.onclick = function() {
            pinBtn.disabled = true;
            pinBtn.textContent = 'Click the map to drop your pin';
            map.once('click', function(e) {
              const { lat, lng } = e.latlng;
              L.marker([lat, lng]).addTo(map);
              db.ref('guest-pins').push({ lat, lng, time: Date.now() });
              if (pinArea) pinArea.style.display = 'none';
            });
          };
        }
      }
    }
    loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', initMap);
  })();

  // --- Shared Photo Album (Firebase) ---
  (function() {
    const form = document.getElementById('photo-upload-form');
    const fileInput = document.getElementById('photo-file');
    const nameInput = document.getElementById('photo-name');
    const gallery = document.getElementById('shared-photo-gallery');
    if (!form || !fileInput || !gallery || !storage || !db) return;

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
      gallery.innerHTML = photos.reverse().map(photo =>
        `<div class="gallery-item">
           <a href="${photo.url}" target="_blank" rel="noopener noreferrer">
             <img src="${photo.url}" alt="Shared by ${photo.uploader}" />
           </a>
           <div class="gallery-item-name">${photo.uploader}</div>
         </div>`
      ).join('');
    }
    db.ref('wedding-photos').on('value', snap => {
      renderGallery(Object.values(snap.val() || {}));
    });
  })();
});