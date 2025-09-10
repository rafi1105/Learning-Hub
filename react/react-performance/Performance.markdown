# React Performance - Complete Guide

## Table of Contents
1. [What is React Performance?](#what-is-react-performance)
2. [React.memo for Component Optimization](#react-memo-for-component-optimization)
3. [useMemo and useCallback](#usememo-and-usecallback)
4. [Advanced Optimization Techniques](#advanced-optimization-techniques)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is React Performance?

React performance focuses on minimizing rendering and computation overhead to ensure fast, responsive applications. Techniques like `React.memo`, `useMemo`, `useCallback`, lazy loading, and code splitting optimize React apps.

### Real-World Analogy
Think of React performance as a chef streamlining a kitchen: prepping ingredients (memoization) and organizing tasks (code splitting) reduce wasted effort and speed up service.

### Why Optimize?
- **Faster Rendering**: Reduces UI lag.
- **Lower Resource Usage**: Minimizes CPU and memory consumption.
- **Better UX**: Ensures smooth interactions, especially on low-end devices.

---

## React.memo for Component Optimization

`React.memo` prevents unnecessary re-renders of functional components when props are unchanged.

**Example: React.memo**
```jsx
import { memo } from 'react';

const Item = memo(({ name }) => {
  console.log(`Rendering ${name}`);
  return <p>{name}</p>;
});

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Item name="Static Item" />
    </div>
  );
}
```

### When to Use React.memo
Use for components with expensive renders or frequent parent re-renders.

**Example: Complex Component**
```jsx
const Chart = memo(({ data }) => {
  // Expensive rendering logic
  return <ComplexChart data={data} />;
});
```

---

## useMemo and useCallback

### useMemo
Memoizes expensive computations, recomputing only when dependencies change.

**Example: useMemo**
```jsx
import { useMemo, useState } from 'react';

function SortedList({ items }) {
  const sortedItems = useMemo(() => {
    console.log('Sorting items');
    return [...items].sort((a, b) => a - b);
  }, [items]);

  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function App() {
  const [items] = useState([3, 1, 2]);
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <SortedList items={items} />
    </div>
  );
}
```

### useCallback
Memoizes functions to prevent re-creation, useful for passing callbacks to memoized components.

**Example: useCallback**
```jsx
import { useCallback, useState } from 'react';
import { memo } from 'react';

const Button = memo(({ onClick }) => {
  console.log('Button rendered');
  return <button onClick={onClick}>Click</button>;
});

function App() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Button onClick={handleClick} />
    </div>
  );
}
```

---

## Advanced Optimization Techniques

### Lazy Loading
Load components only when needed using `React.lazy` and `Suspense`.

**Example: Lazy Loading**
```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Code Splitting
Split code into smaller bundles to reduce initial load time.

**Example: Code Splitting with Routes**
```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Windowing/Virtualization
Render only visible items in large lists using libraries like `react-window`.

**Example: Virtualized List**
```jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index]}
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      width={300}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
```

### Avoiding Inline Objects/Functions
Inline objects or functions as props cause re-renders.

**Example**
```jsx
// ❌ Bad
<Child data={{ key: value }} />

// ✅ Good
const data = { key: value };
<Child data={data} />
```

---

## Real-Life Project Examples

### 1. Optimized Product Catalog
A product list with memoized sorting and rendering.

```jsx
import { useState, useMemo, memo } from 'react';

const Product = memo(({ name, price }) => {
  console.log(`Rendering ${name}`);
  return <li>{name} - ${price}</li>;
});

function ProductCatalog() {
  const [products] = useState([
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 499 },
    { id: 3, name: 'Tablet', price: 299 },
  ]);
  const [filter, setFilter] = useState('');

  const filteredProducts = useMemo(() => {
    console.log('Filtering products');
    return products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
  }, [products, filter]);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter products"
      />
      <ul>
        {filteredProducts.map(product => (
          <Product key={product.id} name={product.name} price={product.price} />
        ))}
      </ul>
    </div>
  );
}
```

### 2. Lazy-Loaded Dashboard
A dashboard with lazy-loaded charts.

```jsx
import { lazy, Suspense, useState } from 'react';

const Chart = lazy(() => import('./Chart')); // Simulated heavy component

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => setShowChart(true)}>Load Chart</button>
      {showChart && (
        <Suspense fallback={<p>Loading chart...</p>}>
          <Chart />
        </Suspense>
      )}
    </div>
  );
}
```

### 3. Virtualized Data Table
A large table with virtualization.

```jsx
import { FixedSizeList } from 'react-window';
import { useState } from 'react';

function DataTable() {
  const [items] = useState(Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`));

  const Row = ({ index, style }) => (
    <div style={{ ...style, padding: '8px', borderBottom: '1px solid #ccc' }}>
      {items[index]}
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      width={600}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
```

---

## Best Practices

### 1. Use React.memo Selectively
Apply to components with expensive renders or frequent updates.

**Example**
```jsx
// ❌ Bad: Memoizing simple component
const Simple = memo(() => <p>Simple</p>);

// ✅ Good: Memoizing complex component
const Complex = memo(({ data }) => <ExpensiveRender data={data} />);
```

### 2. Optimize Dependency Arrays
Include only necessary dependencies in `useMemo`/`useCallback`.

**Example**
```jsx
// ❌ Bad: Missing dependencies
useMemo(() => compute(data), []);

// ✅ Good
useMemo(() => compute(data), [data]);
```

### 3. Avoid Premature Optimization
Profile before optimizing to avoid complexity.

**Example**
```jsx
// ❌ Bad: Unnecessary memoization
const value = useMemo(() => x + y, [x, y]);

// ✅ Good: Simple calculation
const value = x + y;
```

### 4. Use React DevTools Profiler
Identify bottlenecks with the Profiler.

**Example**
```jsx
import { Profiler } from 'react';

function App() {
  return (
    <Profiler id="App" onRender={(id, phase, actualDuration) => {
      console.log(`${id} ${phase}: ${actualDuration}ms`);
    }}>
      <Component />
    </Profiler>
  );
}
```

### 5. Implement Lazy Loading
Use `React.lazy` for non-critical components.

**Example**
```jsx
const Heavy = lazy(() => import('./Heavy'));
```

---

## Common Pitfalls and Solutions

### Pitfall: Over-Memoization
Excessive use of `useMemo`/`React.memo` increases complexity.

**Solution**: Only memoize when profiling shows a benefit.

### Pitfall: Incorrect Dependencies
Missing or incorrect dependencies cause stale data.

**Solution**
```jsx
useEffect(() => {
  // Ensure all used variables are in the dependency array
}, [dependency1, dependency2]);
```

### Pitfall: Inline Props
Inline objects/functions cause unnecessary re-renders.

**Solution**
```jsx
const config = { key: value };
<Child config={config} />
```

---

## Summary
React performance optimization minimizes re-renders (`React.memo`, `useMemo`, `useCallback`) and load times (lazy loading, virtualization). Profiling ensures effective optimization.

### Interview-Friendly Tips
- **When to use React.memo?** For components with stable props and expensive renders.
- **useMemo vs useCallback?** `useMemo` for values, `useCallback` for functions.
- **How to identify performance issues?** Use React DevTools Profiler and browser tools.
- **Why lazy load?** To reduce initial bundle size and improve load times.