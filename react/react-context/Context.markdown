# React Context API - Complete Guide

## Table of Contents
1. [What is the Context API?](#what-is-the-context-api)
2. [Creating and Consuming Context](#creating-and-consuming-context)
3. [Context with State and Hooks](#context-with-state-and-hooks)
4. [Advanced Context Patterns](#advanced-context-patterns)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is the Context API?

The Context API allows sharing data globally across a React component tree without prop drilling. It’s ideal for managing themes, user authentication, or other global state.

### Real-World Analogy
Context is like a company-wide memo: any department (component) can access it without passing it through every manager (parent component).

### Why Context?
- **Avoids Prop Drilling**: Shares data directly with deep components.
- **Centralized State**: Simplifies global state management.
- **Integrates with Hooks**: Works seamlessly with `useContext`.

---

## Creating and Consuming Context

Use `createContext` to create a context and `Provider`/`Consumer` to share and access data.

**Example: Basic Context**
```jsx
import { createContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemeDisplay />
    </ThemeContext.Provider>
  );
}

function ThemeDisplay() {
  return (
    <ThemeContext.Consumer>
      {theme => <p>Theme: {theme}</p>}
    </ThemeContext.Consumer>
  );
}
```

### Using useContext
The `useContext` hook simplifies context consumption.

**Example: useContext**
```jsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext();

function ThemeDisplay() {
  const theme = useContext(ThemeContext);
  return <p>Theme: {theme}</p>;
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

## Context with State and Hooks

Combine Context with state for dynamic global data.

**Example: Dynamic Context**
```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <h1>Theme App</h1>
      <ThemeToggle />
    </ThemeProvider>
  );
}
```

---

## Advanced Context Patterns

### Multiple Contexts
Use separate contexts for different concerns.

**Example: Multiple Contexts**
```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();
const AuthContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

function AppContent() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}>
      <p>User: {user?.name || 'Guest'}</p>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
```

### Context with Reducer
Use `useReducer` for complex state logic.

**Example: Context with useReducer**
```jsx
import { createContext, useContext, useReducer } from 'react';

const CounterContext = createContext();

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

function Counter() {
  const { state, dispatch } = useContext(CounterContext);
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
    </div>
  );
}

function App() {
  return (
    <CounterProvider>
      <Counter />
    </CounterProvider>
  );
}
```

---

## Real-Life Project Examples

### 1. Authentication System
Manage user authentication state globally.

```jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ id: 1, name: credentials.username });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function LoginForm() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button type="submit">Login</button>
    </form>
  );
}

function UserProfile() {
  const { user, logout } = useContext(AuthContext);
  return user ? (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  ) : (
    <p>Please log in</p>
  );
}

function AuthApp() {
  return (
    <AuthProvider>
      <h1>Auth App</h1>
      <LoginForm />
      <UserProfile />
    </AuthProvider>
  );
}
```

### 2. Theme Switcher
A theme switcher with global theme state.

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#000' : '#fff',
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
    </button>
  );
}

function ThemeApp() {
  return (
    <ThemeProvider>
      <h1>Theme Switcher</h1>
      <ThemeToggle />
      <p>Content in {theme} mode</p>
    </ThemeProvider>
  );
}
```

### 3. Language Selector
A language selector for internationalization.

```jsx
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const translations = {
    en: { welcome: 'Welcome', change: 'Change Language' },
    es: { welcome: 'Bienvenido', change: 'Cambiar Idioma' },
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

function LanguageSelector() {
  const { language, setLanguage } = useContext(LanguageContext);
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Spanish</option>
    </select>
  );
}

function Content() {
  const { t } = useContext(LanguageContext);
  return (
    <div>
      <h1>{t.welcome}</h1>
      <p>{t.change}</p>
    </div>
  );
}

function LanguageApp() {
  return (
    <LanguageProvider>
      <LanguageSelector />
      <Content />
    </LanguageProvider>
  );
}
```

---

## Best Practices

### 1. Use Context for Global Data Only
Avoid using Context for local state.

**Example**
```jsx
// ❌ Bad: Local state in Context
const LocalContext = createContext();
function BadComponent() {
  const [value, setValue] = useState(0);
  return <LocalContext.Provider value={value} />;
}

// ✅ Good: Local state
function GoodComponent() {
  const [value, setValue] = useState(0);
}
```

### 2. Split Contexts by Concern
Use separate contexts for unrelated data.

**Example**
```jsx
const ThemeContext = createContext();
const AuthContext = createContext();
```

### 3. Provide Default Values
Set meaningful defaults to avoid undefined errors.

**Example**
```jsx
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });
```

### 4. Use Custom Hooks
Encapsulate context logic for cleaner components.

**Example**
```jsx
function useTheme() {
  return useContext(ThemeContext);
}

function Component() {
  const { theme } = useTheme();
  return <div style={{ background: theme === 'light' ? '#fff' : '#333' }} />;
}
```

### 5. Optimize Context Updates
Avoid unnecessary re-renders by splitting contexts or memoizing values.

**Example**
```jsx
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
```

---

## Common Pitfalls and Solutions

### Pitfall: Overusing Context
Using Context for all state increases complexity.

**Solution**: Use local state or props for component-specific data.

### Pitfall: Unnecessary Re-renders
Context updates cause all consumers to re-render.

**Solution**: Split contexts or use `useMemo`.

**Example**
```jsx
const value = useMemo(() => ({ theme, setTheme }), [theme]);
```

### Pitfall: Missing Default Values
Accessing undefined context causes errors.

**Solution**
```jsx
const Context = createContext({ default: 'value' });
```

---

## Summary
The Context API simplifies global state management, eliminating prop drilling. Combining it with hooks and reducers makes it powerful for scalable apps.

### Interview-Friendly Tips
- **When to use Context?** For global data like themes, auth, or settings.
- **Context vs Redux?** Context is simpler for small apps; Redux suits complex state management.
- **How to optimize Context?** Split contexts, use `useMemo`, and create custom hooks.
- **Why avoid prop drilling?** It makes code harder to maintain and less scalable.