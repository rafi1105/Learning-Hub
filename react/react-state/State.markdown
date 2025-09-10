# React State Management - Complete Guide

## Table of Contents
1. [What is State Management?](#what-is-state-management)
2. [Local State](#local-state)
3. [Lifting State Up](#lifting-state-up)
4. [Global State with Context](#global-state-with-context)
5. [Advanced State Management](#advanced-state-management)
6. [Real-Life Project Examples](#real-life-project-examples)
7. [Best Practices](#best-practices)

---

## What is State Management?

State represents the dynamic data in a React application that can change over time, triggering UI updates. Effective state management ensures predictable data flow and scalable applications.

### Real-World Analogy
Think of state as the current status of a vending machine: it tracks available items, user selections, and money inserted, updating the display accordingly.

---

## Local State

Local state is managed within a single component using `useState`.

**Example: Local State**
```jsx
import { useState } from 'react';

function Toggle() {
  const [isOn, setIsOn] = useState(false);
  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

---

## Lifting State Up

When multiple components need to share state, lift it to their closest common ancestor.

**Example: Lifting State Up**
```jsx
function CounterApp() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Display count={count} />
      <Button setCount={setCount} />
    </div>
  );
}

function Display({ count }) {
  return <p>Count: {count}</p>;
}

function Button({ setCount }) {
  return <button onClick={() => setCount(prev => prev + 1)}>Increment</button>;
}
```

---

## Global State with Context

The Context API allows sharing state across components without prop drilling.

**Example: Context API**
```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeToggle />
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle to {theme === 'light' ? 'dark' : 'light'}
    </button>
  );
}
```

---

## Advanced State Management

### useReducer
`useReducer` is an alternative to `useState` for complex state logic.

**Example: useReducer**
```jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
    </div>
  );
}
```

### State Management Libraries
Libraries like Redux or Zustand manage complex global state.

**Example: Zustand**
```jsx
import create from 'zustand';

const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}));

function Counter() {
  const { count, increment } = useStore();
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

---

## Real-Life Project Examples

### 1. Task Manager
A task management app with local and global state.

```jsx
import { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

function TaskForm() {
  const { setTasks } = useContext(TaskContext);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (input.trim()) {
      setTasks(prev => [...prev, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a task"
      />
      <button onClick={addTask}>Add</button>
    </div>
  );
}

function TaskList() {
  const { tasks } = useContext(TaskContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>{task.text}</li>
      ))}
    </ul>
  );
}

function TaskManager() {
  return (
    <TaskProvider>
      <h1>Task Manager</h1>
      <TaskForm />
      <TaskList />
    </TaskProvider>
  );
}
```

### 2. E-Commerce Product Filter
A product filter system using state and context.

```jsx
import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

function FilterProvider({ children }) {
  const [filters, setFilters] = useState({ category: 'all', minPrice: 0 });
  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

function ProductFilter() {
  const { filters, setFilters } = useContext(FilterContext);

  return (
    <div>
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <input
        type="number"
        value={filters.minPrice}
        onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
        placeholder="Min Price"
      />
    </div>
  );
}

function ProductList() {
  const { filters } = useContext(FilterContext);
  const products = [
    { id: 1, name: 'Laptop', category: 'electronics', price: 999 },
    { id: 2, name: 'T-Shirt', category: 'clothing', price: 29 },
  ];

  const filteredProducts = products.filter(
    product =>
      (filters.category === 'all' || product.category === filters.category) &&
      product.price >= filters.minPrice
  );

  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>
          {product.name} - ${product.price}
        </li>
      ))}
    </ul>
  );
}

function ProductApp() {
  return (
    <FilterProvider>
      <h1>Product Catalog</h1>
      <ProductFilter />
      <ProductList />
    </FilterProvider>
  );
}
```

---

## Best Practices

### 1. Minimize State
Keep state minimal to avoid complexity.

**Example**
```jsx
// ❌ Bad: Redundant state
function BadComponent() {
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(name.length > 0);
}

// ✅ Good: Derive state
function GoodComponent() {
  const [name, setName] = useState('');
  const isNameValid = name.length > 0;
}
```

### 2. Use Context Sparingly
Use Context for global state, not local state.

**Example**
```jsx
// ❌ Bad: Context for local state
const LocalContext = createContext();
function BadComponent() {
  const [count, setCount] = useState(0);
  return <LocalContext.Provider value={{ count, setCount }} />;
}

// ✅ Good: Local state
function GoodComponent() {
  const [count, setCount] = useState(0);
}
```

### 3. Optimize with Memoization
Use `useMemo` and `useCallback` to prevent unnecessary re-renders.

**Example**
```jsx
function ExpensiveComponent({ items }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.price - b.price);
  }, [items]);

  return <ul>{sortedItems.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}
```

### 4. Batch State Updates
Group state updates to minimize re-renders.

**Example**
```jsx
// ❌ Bad: Multiple updates
function BadComponent() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const update = () => {
    setA(a + 1);
    setB(b + 1);
  };
}

// ✅ Good: Single state object
function GoodComponent() {
  const [state, setState] = useState({ a: 0, b: 0 });
  const update = () => {
    setState(prev => ({ a: prev.a + 1, b: prev.b + 1 }));
  };
}
```

---

## Summary
State management in React involves local state (`useState`, `useReducer`), lifting state up, and global state (Context, libraries). Understanding when and how to use each approach is key to building scalable apps.

### Interview-Friendly Tips
- **When to use useReducer?** For complex state logic with multiple actions.
- **Context vs Redux?** Context for simple global state; Redux for complex apps with predictable state.
- **How to optimize state?** Minimize state, use memoization, and batch updates.