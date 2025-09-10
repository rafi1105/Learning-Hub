# JavaScript Browser Storage - Complete Guide

## Table of Contents
1. [What is Browser Storage?](#what-is-browser-storage)
2. [localStorage and sessionStorage](#localStorage-and-sessionStorage)
3. [Cookies](#cookies)
4. [IndexedDB](#indexedDB)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is Browser Storage?

Browser storage allows JavaScript to store data in the user’s browser, including `localStorage`, `sessionStorage`, cookies, and `IndexedDB`.

### Real-World Analogy
Think of browser storage as a filing cabinet: `localStorage` is a permanent drawer, `sessionStorage` is a temporary folder, cookies are small sticky notes, and `IndexedDB` is a database for large files.

### Why Browser Storage?
- **Persistence**: Save user preferences or state.
- **Offline Support**: Store data for offline apps.
- **Performance**: Reduce server requests.

---

## localStorage and sessionStorage

`localStorage` persists until cleared; `sessionStorage` lasts for the session.

**Example: localStorage**
```javascript
// Save data
localStorage.setItem('theme', 'dark');

// Retrieve data
const theme = localStorage.getItem('theme'); // 'dark'

// Remove data
localStorage.removeItem('theme');
```

**Example: sessionStorage**
```javascript
// Save data
sessionStorage.setItem('token', 'abc123');

// Retrieve data
const token = sessionStorage.getItem('token'); // 'abc123'
```

---

## Cookies

Cookies store small amounts of data, often for authentication or tracking.

**Example: Setting a Cookie**
```javascript
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

setCookie('user', 'John', 7);
console.log(getCookie('user')); // 'John'
```

---

## IndexedDB

`IndexedDB` is a NoSQL database for large datasets.

**Example: Basic IndexedDB**
```javascript
async function initDB() {
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open('myDB', 1);
    request.onupgradeneeded = event => {
      event.target.result.createObjectStore('users', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  // Add data
  const tx = db.transaction('users', 'readwrite');
  const store = tx.objectStore('users');
  store.add({ id: 1, name: 'John' });

  // Retrieve data
  const user = await new Promise(resolve => {
    store.get(1).onsuccess = event => resolve(event.target.result);
  });
  console.log(user); // { id: 1, name: 'John' }
}
```

---

## Real-Life Project Examples

### 1. Theme Toggle
Persist user theme preference with `localStorage`.

```javascript
function ThemeToggle() {
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

**Use Case**: Saves user theme across sessions.

### 2. Offline Form Data
Store form data in `IndexedDB` for offline support.

```javascript
async function saveFormData(data) {
  const db = await new Promise(resolve => {
    const request = indexedDB.open('forms', 1);
    request.onupgradeneeded = event => {
      event.target.result.createObjectStore('entries', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
  });

  const tx = db.transaction('entries', 'readwrite');
  const store = tx.objectStore('entries');
  store.add({ id: Date.now(), ...data });
}

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const data = { email: e.target.email.value };
  await saveFormData(data);
  alert('Form data saved offline');
});
```

**Use Case**: Saves form data when offline, syncs later.

---

## Best Practices

### 1. Use Appropriate Storage
- `localStorage`: Persistent settings.
- `sessionStorage`: Temporary session data.
- `Cookies`: Authentication tokens.
- `IndexedDB`: Large datasets.

### 2. Handle Storage Limits
Check for quota errors.

**Example**
```javascript
try {
  localStorage.setItem('key', 'value');
} catch (e) {
  console.error('Storage quota exceeded:', e);
}
```

### 3. Secure Cookies
Use `HttpOnly` and `Secure` flags for cookies.

**Example**
```javascript
document.cookie = 'token=abc; HttpOnly; Secure';
```

### 4. Clear Unused Data
Remove outdated storage entries.

**Example**
```javascript
localStorage.clear();
```

---

## Common Pitfalls and Solutions

### Pitfall: Storage Quota Errors
Exceeding storage limits causes errors.

**Solution**: Catch errors and inform users.

**Example**
```javascript
try {
  localStorage.setItem('key', largeData);
} catch (e) {
  alert('Storage full, please clear data.');
}
```

### Pitfall: Cookies Security
Exposing cookies to XSS attacks.

**Solution**: Use `HttpOnly` and `Secure`.

### Pitfall: IndexedDB Complexity
Complex setup for simple tasks.

**Solution**: Use libraries like `Dexie.js`.

**Example**
```javascript
import Dexie from 'dexie';

const db = new Dexie('myDB');
db.version(1).stores({ users: 'id,name' });
```

---

## Summary
Browser storage options (`localStorage`, `sessionStorage`, cookies, `IndexedDB`) enable data persistence for various use cases, from settings to offline support.

### Interview-Friendly Tips
- **localStorage vs sessionStorage?** `localStorage` persists; `sessionStorage` clears on tab close.
- **When to use cookies?** For small, secure data like tokens.
- **Why use IndexedDB?** For large, structured data.
- **How to handle storage limits?** Catch quota errors and clear unnecessary data.