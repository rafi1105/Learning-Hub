# React Router - Complete Guide

## Table of Contents
1. [What is React Router?](#what-is-react-router)
2. [Core Routing Concepts](#core-routing-concepts)
3. [Route Parameters and Query Strings](#route-parameters-and-query-strings)
4. [Nested Routes and Layouts](#nested-routes-and-layouts)
5. [Programmatic Navigation](#programmatic-navigation)
6. [Real-Life Project Examples](#real-life-project-examples)
7. [Best Practices](#best-practices)
8. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is React Router?

React Router is a powerful library for client-side routing in React applications. It enables navigation between different views or pages without full page reloads, maintaining the single-page application (SPA) experience. It supports dynamic routing, nested routes, and programmatic navigation.

### Real-World Analogy
React Router is like a train station’s routing system: it directs passengers (users) to specific platforms (components) based on their tickets (URLs), ensuring smooth transitions.

### Why React Router?
- **Client-Side Navigation**: Avoids server requests for page changes.
- **Dynamic Routing**: Supports parameters and query strings.
- **Nested Routes**: Enables hierarchical UI structures.
- **History Management**: Integrates with browser history for back/forward navigation.

---

## Core Routing Concepts

React Router uses components like `BrowserRouter`, `Routes`, `Route`, and `Link` to manage navigation.

**Example: Basic Routing Setup**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
```

### BrowserRouter vs HashRouter
- **BrowserRouter**: Uses clean URLs (e.g., `/about`) and requires server configuration.
- **HashRouter**: Uses hash-based URLs (e.g., `/#/about`) for static hosting.

**Example: HashRouter**
```jsx
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
      </Routes>
    </HashRouter>
  );
}
```

---

## Route Parameters and Query Strings

### Route Parameters
Capture dynamic segments in URLs using `:param`.

**Example: Route Parameters**
```jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();
  return <h1>User Profile: {userId}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/:userId" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Query Strings
Access query parameters using `useSearchParams`.

**Example: Query Strings**
```jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  return <h1>Search Query: {query}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Nested Routes and Layouts

Nested routes allow rendering child components within a parent layout using `<Outlet>`.

**Example: Nested Routes**
```jsx
import { Routes, Route, Outlet, Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="overview">Overview</Link> | <Link to="stats">Stats</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function Overview() {
  return <h2>Dashboard Overview</h2>;
}

function Stats() {
  return <h2>Dashboard Stats</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="overview" element={<Overview />} />
          <Route path="stats" element={<Stats />} />
          <Route index element={<Overview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Layout Routes
Use a layout component to wrap routes with shared UI.

**Example: Layout Route**
```jsx
function Layout() {
  return (
    <div>
      <header>App Header</header>
      <Outlet />
      <footer>App Footer</footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/about" element={<h1>About</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Programmatic Navigation

Use `useNavigate` for navigation based on logic.

**Example: Programmatic Navigation**
```jsx
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate login
    navigate('/dashboard', { state: { from: 'login' } });
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Accessing Navigation State
Use `useLocation` to access state or URL details.

**Example: Navigation State**
```jsx
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const { state } = useLocation();
  return <h1>Welcome from: {state?.from || 'unknown'}</h1>;
}
```

---

## Real-Life Project Examples

### 1. Blog Application
A blog with dynamic post routes and navigation.

```jsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function PostList() {
  const posts = [
    { id: 1, title: 'First Post', content: 'Content of first post' },
    { id: 2, title: 'Second Post', content: 'Content of second post' },
  ];

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}

function PostDetail() {
  const { id } = useParams();
  const post = { id, title: `Post ${id}`, content: `Content of post ${id}` };
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <Link to="/posts">Back to Posts</Link>
    </div>
  );
}

function BlogApp() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/posts">Posts</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Blog Home</h1>} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. E-Commerce Product Catalog
A product catalog with category and product routes.

```jsx
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

function ProductList({ products }) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </li>
      ))}
    </ul>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = { id, name: `Product ${id}`, price: 99 };

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Price: ${product.price}</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

function CategoryPage() {
  const { category } = useParams();
  const products = [
    { id: 1, name: 'Laptop', category: 'electronics' },
    { id: 2, name: 'Shirt', category: 'clothing' },
  ].filter(p => p.category === category);

  return (
    <div>
      <h2>{category} Products</h2>
      <ProductList products={products} />
    </div>
  );
}

function ECommerceApp() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |
        <Link to="/category/electronics">Electronics</Link> |
        <Link to="/category/clothing">Clothing</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Admin Dashboard
A dashboard with protected routes.

```jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }) {
  const isAuthenticated = false; // Simulate auth check
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} />
  );
}

function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <button onClick={() => navigate(state?.from || '/')}>Login</button>
  );
}

function Dashboard() {
  return <h1>Admin Dashboard</h1>;
}

function AdminApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Best Practices

### 1. Use Descriptive Route Paths
Clear paths improve maintainability and SEO.

**Example**
```jsx
// ❌ Bad
<Route path="/u/:id" element={<User />} />

// ✅ Good
<Route path="/users/:id" element={<User />} />
```

### 2. Handle 404s
Always include a catch-all route.

**Example**
```jsx
<Route path="*" element={<h1>404 Not Found</h1>} />
```

### 3. Use Programmatic Navigation
Leverage `useNavigate` for dynamic redirects.

**Example**
```jsx
const navigate = useNavigate();
navigate('/success', { state: { message: 'Done' } });
```

### 4. Optimize Nested Routes
Keep nesting shallow to avoid complexity.

**Example**
```jsx
// ❌ Bad: Deep nesting
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="settings/advanced" element={<AdvancedSettings />} />
</Route>

// ✅ Good: Flat routes
<Route path="/dashboard/settings" element={<Settings />} />
```

### 5. Use Relative Links
Use relative paths in `Link` for flexibility.

**Example**
```jsx
<Link to="details">Details</Link> // Relative to current route
```

---

## Common Pitfalls and Solutions

### Pitfall: Incorrect Server Configuration
`BrowserRouter` fails without proper server setup for SPAs.

**Solution**: Configure server to serve `index.html` for all routes or use `HashRouter`.

### Pitfall: Missing Index Routes
Nested routes may render nothing without an `index` route.

**Solution**
```jsx
<Route path="/dashboard" element={<Dashboard />}>
  <Route index element={<Overview />} />
</Route>
```

### Pitfall: Stale Navigation State
Navigation state can become outdated.

**Solution**: Use `useLocation` to access fresh state.

---

## Summary
React Router enables seamless client-side navigation with dynamic routes, parameters, and nested layouts. Mastering its features ensures robust SPA navigation.

### Interview-Friendly Tips
- **What’s the difference between BrowserRouter and HashRouter?** `BrowserRouter` uses clean URLs; `HashRouter` uses hashes for static hosting.
- **How to protect routes?** Use a wrapper component to check authentication.
- **Why use useNavigate?** For programmatic navigation based on logic or events.
- **How to handle query parameters?** Use `useSearchParams` for reading and updating.