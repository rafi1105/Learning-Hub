# React Hooks - Complete Guide

## Table of Contents
1. [What are Hooks?](#what-are-hooks)
2. [Core Hooks](#core-hooks)
3. [Custom Hooks](#custom-hooks)
4. [Rules of Hooks](#rules-of-hooks)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)

---

## What are Hooks?

Hooks, introduced in React 16.8, allow functional components to manage state, side effects, and other React features without class components. They make code more concise and reusable.

### Real-World Analogy
Think of hooks as tools in a toolbox: each hook (like `useState` or `useEffect`) serves a specific purpose, helping you build complex UIs in functional components.

---

## Core Hooks

### useState
Manages state in functional components.

**Example: useState**
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### useEffect
Handles side effects like data fetching or subscriptions.

**Example: useEffect**
```jsx
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <p>Seconds: {seconds}</p>;
}
```

### useContext
Accesses context values without prop drilling.

**Example: useContext**
```jsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemeDisplay() {
  const theme = useContext(ThemeContext);
  return <p>Current theme: {theme}</p>;
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemeDisplay />
    </ThemeContext.Provider>
  );
}
```

---

## Custom Hooks

Custom hooks encapsulate reusable logic using built-in hooks.

**Example: Custom Hook**
```jsx
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

function App() {
  const { width, height } = useWindowSize();
  return <p>Window size: {width}x{height}</p>;
}
```

---

## Rules of Hooks

1. **Only Call Hooks at the Top Level**: Don’t call hooks inside loops, conditions, or nested functions.
2. **Only Call Hooks from Functional Components or Custom Hooks**: Don’t use hooks in regular JavaScript functions.

**Example: Correct Hook Usage**
```jsx
function Component() {
  const [count, setCount] = useState(0); // Top-level
  useEffect(() => {}, []); // Top-level
  return <div>{count}</div>;
}
```

---

## Real-Life Project Examples

### 1. Data Fetching Hook
A custom hook for fetching data with loading and error states.

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Fetch failed');
        return response.json();
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

function UserList() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 2. Form Validation Hook
A custom hook for managing form state and validation.

```jsx
import { useState } from 'react';

function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!values.email.includes('@')) newErrors.email = 'Invalid email';
    if (values.password.length < 6) newErrors.password = 'Password too short';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, handleChange, validate };
}

function LoginForm() {
  const { values, errors, handleChange, validate } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p>{errors.email}</p>}
      </div>
      <div>
        <input
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <p>{errors.password}</p>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Best Practices

### 1. Keep Hooks Simple
Each hook should have a single responsibility.

**Example**
```jsx
// ❌ Bad: Complex hook
function useBadHook() {
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  // ...
}

// ✅ Good: Focused hook
function useSingleFeature() {
  const [state, setState] = useState();
  // Single responsibility
}
```

### 2. Clean Up Effects
Always return a cleanup function in `useEffect` to prevent memory leaks.

**Example**
```jsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

### 3. Use Descriptive Hook Names
Prefix custom hooks with `use` and make names descriptive.

**Example**
```jsx
// ❌ Bad
function hook() {}

// ✅ Good
function useUserData() {}
```

### 4. Avoid Overusing Hooks
Don’t overuse hooks for simple logic that can be handled with regular functions.

**Example**
```jsx
// ❌ Bad: Unnecessary hook
function useAdd(a, b) {
  return a + b;
}

// ✅ Good: Regular function
function add(a, b) {
  return a + b;
}
```

---

## Summary
Hooks revolutionize React by enabling state and lifecycle management in functional components. Mastering `useState`, `useEffect`, `useContext`, and custom hooks is essential for modern React development.

### Interview-Friendly Tips
- **Why hooks?** They simplify code and enable reusable logic in functional components.
- **When to use custom hooks?** For reusable logic across components, like data fetching or form handling.
- **What are the rules of hooks?** Call hooks at the top level and only in functional components or custom hooks.