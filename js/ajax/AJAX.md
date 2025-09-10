# JavaScript AJAX & Fetch API - Complete Guide

## Table of Contents
1. [What is AJAX?](#what-is-ajax)
2. [XMLHttpRequest](#xmlhttprequest)
3. [Fetch API](#fetch-api)
4. [Advanced AJAX Patterns](#advanced-ajax-patterns)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is AJAX?

AJAX (Asynchronous JavaScript and XML) enables asynchronous communication with servers, allowing dynamic updates without reloading pages. The modern `Fetch API` is preferred over `XMLHttpRequest`.

### Real-World Analogy
Think of AJAX as ordering food delivery: you request food (data) without leaving home (reloading the page), and it arrives asynchronously.

### Why AJAX?
- **Dynamic Updates**: Refresh parts of a page.
- **Performance**: Avoid full page reloads.
- **User Experience**: Seamless data fetching.

---

## XMLHttpRequest

`XMLHttpRequest` is the older way to make HTTP requests.

**Example**
```javascript
function fetchData(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = () => {
    if (xhr.status === 200) callback(null, JSON.parse(xhr.responseText));
    else callback(new Error(`Status: ${xhr.status}`));
  };
  xhr.onerror = () => callback(new Error('Network error'));
  xhr.send();
}

fetchData('https://jsonplaceholder.typicode.com/users', (err, data) => {
  if (err) console.error(err);
  else console.log(data);
});
```

---

## Fetch API

The `Fetch API` is a modern, promise-based alternative.

**Example: Basic Fetch**
```javascript
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Fetch error:', error));
```

**Async/Await**
```javascript
async function getUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
```

---

## Advanced AJAX Patterns

### Cancelable Requests
Use `AbortController` to cancel fetch requests.

**Example**
```javascript
const controller = new AbortController();
const signal = controller.signal;

async function fetchWithTimeout(url, timeout = 5000) {
  setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal });
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') console.error('Request timed out');
    else console.error(error);
  }
}

fetchWithTimeout('https://jsonplaceholder.typicode.com/posts');
```

### Retry Logic
Retry failed requests.

**Example**
```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Fetch failed');
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

---

## Real-Life Project Examples

### 1. User List Loader
Fetch and display a user list.

```javascript
function UserList() {
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch');
        setUsers(await response.json());
      } catch (error) {
        setError(error.message);
      }
    }
    fetchUsers();
  }, []);

  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Use Case**: Displays a list of users in a dashboard.

### 2. Search API Integration
Real-time search with fetch.

```javascript
function Search() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    const controller = new AbortController();
    async function search() {
      try {
        const response = await fetch(`https://api.example.com/search?q=${query}`, {
          signal: controller.signal,
        });
        setResults(await response.json());
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error);
      }
    }
    if (query) search();
    return () => controller.abort();
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Use Case**: Implements a dynamic search bar.

---

## Best Practices

### 1. Use Fetch Over XMLHttpRequest
`Fetch` is simpler and promise-based.

**Example**
```javascript
fetch('...').then(res => res.json());
```

### 2. Handle Errors
Always check `response.ok` and catch errors.

**Example**
```javascript
if (!response.ok) throw new Error('HTTP error');
```

### 3. Cancel Requests
Use `AbortController` for cleanup.

**Example**
```javascript
const controller = new AbortController();
fetch('...', { signal: controller.signal });
```

### 4. Optimize Requests
Debounce or throttle frequent requests.

**Example**
```javascript
const debounceFetch = debounce(fetchData, 300);
```

---

## Common Pitfalls and Solutions

### Pitfall: Unhandled Promise Rejections
Uncaught errors crash the app.

**Solution**: Always use `.catch()` or `try-catch`.

### Pitfall: Memory Leaks
Uncancelled requests pile up.

**Solution**: Use `AbortController`.

### Pitfall: Ignoring HTTP Status
Assuming all responses are successful.

**Solution**: Check `response.ok`.

---

## Summary
AJAX with `Fetch API` enables asynchronous server communication, improving UX and performance. It’s preferred over `XMLHttpRequest` for modern apps.

### Interview-Friendly Tips
- **What is AJAX?** Asynchronous communication with servers without reloading.
- **Fetch vs XMLHttpRequest?** `Fetch` is promise-based and simpler; `XMLHttpRequest` is older and verbose.
- **How to cancel a fetch?** Use `AbortController`.
- **How to handle rate limits?** Implement retry logic or throttling.