# JavaScript Browser APIs - Complete Guide

## Table of Contents
1. [What are Browser APIs?](#what-are-browser-apis)
2. [Geolocation API](#geolocation-api)
3. [Canvas API](#canvas-api)
4. [WebRTC API](#webrtc-api)
5. [Service Workers](#service-workers)
6. [Other Useful Browser APIs](#other-useful-browser-apis)
7. [Real-Life Project Examples](#real-life-project-examples)
8. [Best Practices](#best-practices)
9. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What are Browser APIs?

Browser APIs are built-in interfaces provided by web browsers to interact with hardware, system resources, or advanced functionalities like geolocation, graphics, real-time communication, and offline capabilities. Examples include the Geolocation API, Canvas API, WebRTC, and Service Workers.

### Real-World Analogy
Think of Browser APIs as a toolbox in a workshop: each tool (API) enables specific tasks, like measuring (Geolocation), drawing (Canvas), or communicating (WebRTC), to build a project (web app).

### Why Browser APIs?
- **Enhanced Functionality**: Access device features like GPS or camera.
- **Performance**: Leverage native browser capabilities.
- **User Experience**: Enable rich, interactive features like offline support or video calls.

---

## Geolocation API

The Geolocation API retrieves the user’s location with their permission.

**Example: Get User Location**
```javascript
function getLocation() {
  if (!navigator.geolocation) {
    console.error('Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    },
    error => {
      console.error('Geolocation error:', error.message);
    }
  );
}

getLocation();
```

**Watching Position**
```javascript
function watchLocation() {
  const id = navigator.geolocation.watchPosition(
    position => {
      console.log(`Updated: ${position.coords.latitude}, ${position.coords.longitude}`);
    },
    error => console.error(error),
    { enableHighAccuracy: true }
  );

  // Stop watching
  setTimeout(() => navigator.geolocation.clearWatch(id), 10000);
}
```

---

## Canvas API

The Canvas API enables 2D drawing and animations on a `<canvas>` element.

**Example: Draw a Rectangle**
```javascript
function drawRectangle() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'blue';
  ctx.fillRect(50, 50, 100, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  drawRectangle();
});

// HTML
// <canvas id="canvas" width="200" height="200"></canvas>
```

**Example: Animate a Circle**
```javascript
function animateCircle() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let x = 50;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, 100, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    x += 1;
    if (x > canvas.width) x = 0;
    requestAnimationFrame(draw);
  }

  draw();
}
```

---

## WebRTC API

WebRTC enables real-time communication, such as video or audio calls.

**Example: Simple Video Stream**
```javascript
async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const video = document.getElementById('video');
    video.srcObject = stream;
    video.play();
  } catch (error) {
    console.error('WebRTC error:', error);
  }
}

// HTML
// <video id="video" autoplay></video>
```

**Note**: WebRTC for peer-to-peer requires signaling servers (e.g., via WebSocket), which is complex and often uses libraries like `peerjs`.

---

## Service Workers

Service Workers enable offline capabilities, caching, and push notifications.

**Example: Basic Service Worker**
```javascript
// sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll(['/index.html', '/styles.css']);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker registered'))
    .catch(error => console.error('Service Worker error:', error));
}
```

---

## Other Useful Browser APIs

### Web Storage API
`localStorage` and `sessionStorage` for data persistence.

**Example**
```javascript
localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('theme')); // 'dark'
```

### Fetch API
For HTTP requests.

**Example**
```javascript
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Intersection Observer
Detects element visibility.

**Example**
```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) console.log('Element visible!');
  });
});

observer.observe(document.getElementById('target'));
```

---

## Real-Life Project Examples

### 1. Location-Based Weather App
Use Geolocation and Fetch APIs to display weather.

```javascript
import { useState, useEffect } from 'react';

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_API_KEY}`
          );
          if (!response.ok) throw new Error('Failed to fetch weather');
          setWeather(await response.json());
        } catch (err) {
          setError(err.message);
        }
      },
      err => setError(err.message)
    );
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!weather) return <div>Loading...</div>;
  return <div>Weather: {weather.weather[0].description}</div>;
}
```

**Use Case**: Displays local weather based on user location in a travel app.

### 2. Offline-Capable Note App
Use Service Worker for offline note saving.

```javascript
// sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('notes-cache').then(cache => {
      return cache.addAll(['/index.html', '/app.js']);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// main.js
import { useState } from 'react';

function NoteApp() {
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || []);

  const addNote = note => {
    const updated = [...notes, note];
    setNotes(updated);
    localStorage.setItem('notes', JSON.stringify(updated));
  };

  return (
    <div>
      <input
        type="text"
        onKeyPress={e => e.key === 'Enter' && addNote(e.target.value)}
      />
      <ul>
        {notes.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

**Use Case**: Allows note-taking offline, syncing when online.

---

## Best Practices

### 1. Check API Support
Verify browser compatibility.

**Example**
```javascript
if ('geolocation' in navigator) {
  // Use Geolocation
} else {
  console.error('Geolocation not supported');
}
```

### 2. Handle Permissions
Request user consent for sensitive APIs.

**Example**
```javascript
navigator.permissions.query({ name: 'geolocation' }).then(result => {
  if (result.state === 'granted') getLocation();
});
```

### 3. Optimize Canvas Rendering
Use `requestAnimationFrame` for smooth animations.

**Example**
```javascript
function draw() {
  // Draw on canvas
  requestAnimationFrame(draw);
}
```

### 4. Secure Service Workers
Serve over HTTPS.

**Example**
```javascript
navigator.serviceWorker.register('/sw.js', { scope: '/' });
```

---

## Common Pitfalls and Solutions

### Pitfall: Unsupported APIs
Using APIs in incompatible browsers.

**Solution**: Check support and provide fallbacks.

**Example**
```javascript
if (!navigator.geolocation) {
  alert('Please use a modern browser');
}
```

### Pitfall: Permission Denials
Failing to handle denied permissions.

**Solution**: Catch errors and inform users.

**Example**
```javascript
navigator.geolocation.getCurrentPosition(
  pos => {},
  err => alert('Please enable location access')
);
```

### Pitfall: Performance Issues
Heavy canvas or WebRTC operations slow the app.

**Solution**: Optimize with `requestAnimationFrame` or limit stream quality.

---

## Summary
Browser APIs like Geolocation, Canvas, WebRTC, and Service Workers enable powerful web features, from location tracking to offline support.

### Interview-Friendly Tips
- **What are Browser APIs?** Interfaces for accessing browser and device features.
- **How does Geolocation work?** Uses `navigator.geolocation` to get user coordinates.
- **What is WebRTC used for?** Real-time communication like video calls.
- **Why use Service Workers?** For offline support, caching, and push notifications.