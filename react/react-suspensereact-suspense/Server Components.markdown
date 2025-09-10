# React Server Components - Complete Guide

## Table of Contents
1. [What are React Server Components?](#what-are-react-server-components)
2. [Server vs Client Components](#server-vs-client-components)
3. [Setting Up Server Components](#setting-up-server-components)
4. [Advanced Server Component Patterns](#advanced-server-component-patterns)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What are React Server Components?

React Server Components (RSCs) are a new architecture in React (introduced experimentally and adopted in frameworks like Next.js 13+) that allows components to run only on the server, reducing client-side JavaScript and improving performance.

### Real-World Analogy
Think of RSCs as a chef preparing a dish in the kitchen (server) and sending only the final plate (HTML) to the dining room (client), reducing the need for the customer to cook (client-side rendering).

### Why Server Components?
- **Reduced Bundle Size**: Less JavaScript sent to the client.
- **Server-Side Data Fetching**: Direct access to server resources (e.g., databases).
- **Improved Performance**: Faster initial page loads.

---

## Server vs Client Components

- **Server Components**: Run only on the server, no client-side JavaScript, ideal for static or data-heavy content.
- **Client Components**: Run in the browser, handle interactivity, use `"use client"` directive.

**Example: Server Component**
```jsx
// ServerComponent.jsx
async function ServerComponent({ id }) {
  const data = await fetch(`https://api.example.com/data/${id}`).then(res => res.json());
  return <div>{data.name}</div>;
}
```

**Example: Client Component**
```jsx
// ClientComponent.jsx
"use client";

import { useState } from 'react';

function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

---

## Setting Up Server Components

Server Components are supported in frameworks like Next.js (App Router). You need a compatible setup.

**Example: Next.js Server Component**
```jsx
// app/page.jsx
async function Page() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default Page;
```

**Setup Steps**:
1. Use Next.js 13+ with the App Router.
2. Default components are server components unless marked `"use client"`.
3. Fetch data directly in server components using `async/await`.

---

## Advanced Server Component Patterns

### Combining Server and Client Components
Use server components for static content and client components for interactivity.

**Example**
```jsx
// app/page.jsx (Server Component)
import ClientCounter from './ClientCounter';

async function Page() {
  const data = await fetch('https://jsonplaceholder.typicode.com/posts/1').then(res => res.json());
  return (
    <div>
      <h1>{data.title}</h1>
      <ClientCounter />
    </div>
  );
}

export default Page;

// ClientCounter.jsx (Client Component)
"use client";

import { useState } from 'react';

export default function ClientCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

### Streaming with Suspense
Use Suspense to stream server-rendered content.

**Example**
```jsx
import { Suspense } from 'react';
import SlowComponent from './SlowComponent';

export default async function Page() {
  return (
    <div>
      <h1>Streaming Example</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}

// SlowComponent.jsx
async function SlowComponent() {
  const data = await new Promise(resolve => setTimeout(() => resolve('Done'), 2000));
  return <p>{data}</p>;
}
```

---

## Real-Life Project Examples

### 1. Blog Post Page
A server-rendered blog post with client-side comments.

```jsx
// app/post/[id]/page.jsx
import Comments from './Comments';

async function PostPage({ params }) {
  const post = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`).then(res => res.json());
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <Comments postId={params.id} />
    </div>
  );
}

export default PostPage;

// Comments.jsx
"use client";

import { useState, useEffect } from 'react';

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
      .then(res => res.json())
      .then(setComments);
  }, [postId]);

  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>{comment.body}</li>
      ))}
    </ul>
  );
}
```

**Use Case**: Server components fetch and render static content; client components handle interactive features.

### 2. E-Commerce Product List
A server-rendered product list with client-side filters.

```jsx
// app/products/page.jsx
import ProductFilters from './ProductFilters';

async function ProductsPage() {
  const products = await fetch('https://api.example.com/products').then(res => res.json());
  return (
    <div>
      <ProductFilters />
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsPage;

// ProductFilters.jsx
"use client";

import { useState } from 'react';

export default function ProductFilters() {
  const [category, setCategory] = useState('');
  return (
    <select value={category} onChange={e => setCategory(e.target.value)}>
      <option value="">All</option>
      <option value="electronics">Electronics</option>
      <option value="clothing">Clothing</option>
    </select>
  );
}
```

**Use Case**: Server components reduce client-side JavaScript; client components handle dynamic filtering.

---

## Best Practices

### 1. Use Server Components for Static Content
Fetch data and render static UI on the server.

**Example**
```jsx
async function Page() {
  const data = await fetch('...').then(res => res.json());
  return <div>{data.name}</div>;
}
```

### 2. Mark Client Components Explicitly
Use `"use client"` for interactive components.

**Example**
```jsx
"use client";

import { useState } from 'react';
```

### 3. Optimize Data Fetching
Fetch data directly in server components to reduce client requests.

**Example**
```jsx
async function Page() {
  const data = await db.query('SELECT * FROM users');
  return <div>{data.name}</div>;
}
```

### 4. Use Suspense for Streaming
Stream content to improve perceived performance.

**Example**
```jsx
<Suspense fallback={<div>Loading...</div>}>
  <SlowComponent />
</Suspense>
```

---

## Common Pitfalls and Solutions

### Pitfall: Using Hooks in Server Components
Server components don’t support hooks like `useState`.

**Solution**: Move interactive logic to client components.

**Example**
```jsx
// ClientComponent.jsx
"use client";

import { useState } from 'react';
```

### Pitfall: Slow Server Rendering
Heavy server computations delay rendering.

**Solution**: Use Suspense for streaming or optimize queries.

### Pitfall: Mixing Server and Client Logic
Incorrectly mixing server and client code causes errors.

**Solution**: Clearly separate server and client components.

---

## Summary
React Server Components reduce client-side JavaScript by rendering static content on the server. They’re ideal for performance-critical apps and pair well with client components for interactivity.

### Interview-Friendly Tips
- **What are Server Components?** Components that run only on the server, reducing client-side JavaScript.
- **Server vs Client Components?** Server components are static; client components handle interactivity.
- **Why use RSCs?** For faster initial loads and direct server data access.
- **How to handle interactivity?** Use `"use client"` for interactive components.