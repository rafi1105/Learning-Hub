# React API Integration - Complete Guide

## Table of Contents
1. [What is React API Integration?](#what-is-react-api-integration)
2. [Fetching Data with Fetch API](#fetching-data-with-fetch-api)
3. [Managing API State](#managing-api-state)
4. [Advanced API Integration Patterns](#advanced-api-integration-patterns)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is React API Integration?

React API integration involves fetching data from REST APIs (or other endpoints), handling asynchronous operations, and managing the resulting data in a React application. It typically uses the `Fetch API`, `axios`, or libraries like `react-query` to retrieve and display dynamic data.

### Real-World Analogy
Think of API integration as ordering ingredients from a supplier (API) for a restaurant (React app). The chef (React component) requests ingredients, waits for delivery (async operation), and prepares the dish (renders data) for customers (users).

### Why API Integration?
- **Dynamic Content**: Fetches real-time data (e.g., user profiles, products).
- **Scalability**: Connects frontend to backend services.
- **User Experience**: Enables seamless updates without reloading.

---

## Fetching Data with Fetch API

The `Fetch API` is a modern, promise-based way to make HTTP requests in React.

**Example: Basic Fetch**
```javascript
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return response.json();
      })
      .then(data => setUsers(data))
      .catch(error => console.error('Fetch error:', error));
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Async/Await Version**
```javascript
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Using Axios**
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Axios error:', error));
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Managing API State

Handle loading, error, and data states to improve UX.

**Example: Full State Management**
```javascript
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Using React Query
`react-query` simplifies API state management.

**Example**
```javascript
import { useQuery } from 'react-query';

function UserList() {
  const { data, isLoading, error } = useQuery('users', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Advanced API Integration Patterns

### Cancelable Requests
Use `AbortController` to cancel fetch requests.

**Example**
```javascript
import { useState, useEffect } from 'react';

function Search() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function searchUsers() {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?query=${query}`,
          { signal: controller.signal }
        );
        console.log(await response.json());
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error);
      }
    }
    if (query) searchUsers();
    return () => controller.abort();
  }, [query]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### Retry Logic
Retry failed requests with exponential backoff.

**Example**
```javascript
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Fetch failed');
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * 2 ** i));
    }
  }
}
```

### Optimistic Updates
Update UI before the server responds.

**Example**
```javascript
import { useState } from 'react';

function AddTodo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const newTodo = { id: Date.now(), title };
    setTodos([...todos, newTodo]); // Optimistic update
    try {
      await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      setTodos(todos.filter(todo => todo.id !== newTodo.id)); // Rollback
      console.error('Failed to add todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button type="submit">Add Todo</button>
    </form>
  );
}
```

---

## Real-Life Project Examples

### 1. Product Catalog
Fetch and display products from an API.

```javascript
import { useState, useEffect } from 'react';

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://fakestoreapi.com/products')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

**Use Case**: Displays a product catalog in an e-commerce app, handling loading and error states.

### 2. Real-Time Search
Implement a search bar with API integration.

```javascript
import { useState, useEffect } from 'react';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function search() {
      if (!query) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?query=${query}`,
          { signal: controller.signal }
        );
        setResults(await response.json());
        setLoading(false);
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error);
        setLoading(false);
      }
    }
    search();
    return () => controller.abort();
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading && <div>Loading...</div>}
      <ul>
        {results.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Use Case**: Provides real-time search results in a blog or e-commerce app.

---

## Best Practices

### 1. Manage Loading and Error States
Always display loading and error feedback.

**Example**
```javascript
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

### 2. Use AbortController
Cancel unnecessary requests to prevent memory leaks.

**Example**
```javascript
const controller = new AbortController();
fetch(url, { signal: controller.signal });
```

### 3. Debounce Frequent Requests
Reduce API calls in search or input handlers.

**Example**
```javascript
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const debouncedSearch = debounce(fetchData, 300);
```

### 4. Use Libraries for Complex State
Leverage `react-query` or `SWR` for caching and refetching.

**Example**
```javascript
useQuery('key', fetchData);
```

---

## Common Pitfalls and Solutions

### Pitfall: Unhandled Errors
API errors crash the app.

**Solution**: Use `try-catch` and error states.

**Example**
```javascript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed');
} catch (error) {
  setError(error.message);
}
```

### Pitfall: Memory Leaks
Uncancelled requests pile up.

**Solution**: Use `AbortController` in `useEffect`.

**Example**
```javascript
return () => controller.abort();
```

### Pitfall: Overfetching
Frequent API calls slow performance.

**Solution**: Debounce or cache responses.

**Example**
```javascript
useQuery('key', fetchData, { cacheTime: 300000 });
```

---

## Summary
React API integration fetches and manages data from REST APIs using `Fetch`, `axios`, or libraries like `react-query`. Proper state management and error handling ensure robust apps.

### Interview-Friendly Tips
- **What is API integration in React?** Fetching and managing data from APIs in components.
- **How to handle API errors?** Use `try-catch`, check `response.ok`, and display error states.
- **Why use AbortController?** To cancel requests and prevent memory leaks.
- **When to use react-query?** For caching, refetching, and simplified state management.