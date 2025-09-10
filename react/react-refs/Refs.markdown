# React Refs - Complete Guide

## Table of Contents


1. [What are React Refs?](#what-are-react-refs)
2. [Creating and Using Refs](#creating-and-using-refs)
3. [Forwarding Refs](#forwarding-refs)
4. [Advanced Ref Patterns](#advanced-ref-patterns)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What are React Refs?

React refs provide a way to access DOM elements or component instances directly, bypassing React’s declarative model. They’re used for imperative tasks like focusing inputs or measuring elements.

### Real-World Analogy

Think of refs as a remote control: they let you directly manipulate a device (DOM element) without going through the usual interface (state/props).

### Why Refs?

- **DOM Access**: Manipulate elements (e.g., focus, scroll).
- **Imperative Logic**: Control third-party libraries.
- **Performance**: Avoid re-renders for certain tasks.

---

## Creating and Using Refs

### useRef

The `useRef` hook creates a mutable ref object.

**Example: Focusing Input**

```jsx
import { useRef, useEffect } from 'react';

function Input() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

### createRef

Used in class components.

**Example**

```jsx
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  render() {
    return <input ref={this.inputRef} />;
  }
}
```

---

## Forwarding Refs

`React.forwardRef` passes refs to child components.

**Example: Forwarding Refs**

```jsx
const FancyInput = React.forwardRef((props, ref) => (
  <input ref={ref} style={{ border: '2px solid blue' }} />
));

function App() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <FancyInput ref={inputRef} />;
}
```

---

## Advanced Ref Patterns

### Callback Refs

Use a callback function for more control over ref assignment.

**Example**

```jsx
function Input() {
  const handleRef = node => {
    if (node) node.focus();
  };

  return <input ref={handleRef} />;
}
```

### Storing Mutable Values

Use `useRef` to store values that don’t trigger re-renders.

**Example**

```jsx
function Timer() {
  const countRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      countRef.current += 1;
      console.log('Count:', countRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <p>Timer running</p>;
}
```

---

## Real-Life Project Examples

### 1. Auto-Focusing Form

A form with auto-focused input.

```jsx
import { useRef, useEffect } from 'react';

function LoginForm() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form>
      <input ref={inputRef} placeholder="Username" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 2. Scroll to Element

Scroll to a specific element on click.

```jsx
import { useRef } from 'react';

function ScrollableList() {
  const itemRef = useRef(null);

  const handleScroll = () => {
    itemRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <button onClick={handleScroll}>Scroll to Item</button>
      <ul style={{ height: '200px', overflow: 'auto' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <li key={i} ref={i === 10 ? itemRef : null}>
            Item {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Best Practices

### 1. Use Refs Sparingly

Prefer state/props for declarative updates.

**Example**

```jsx
// ❌ Bad: Using ref for controlled input
<input ref={ref} />

// ✅ Good: Controlled input
<input value={value} onChange={e => setValue(e.target.value)} />
```

### 2. Clean Up Refs

Ensure refs are not accessed after unmounting.

**Example**

```jsx
useEffect(() => {
  return () => {
    if (ref.current) ref.current = null;
  };
}, []);
```

### 3. Forward Refs Correctly

Use `React.forwardRef` for child components.

**Example**

```jsx
const Child = React.forwardRef((props, ref) => <input ref={ref} />);
```

---

## Common Pitfalls and Solutions

### Pitfall: Accessing Refs Before Mounting

Refs are null before mounting.

**Solution**

```jsx
useEffect(() => {
  if (ref.current) ref.current.focus();
}, []);
```

### Pitfall: Overusing Refs

Using refs for state management.

**Solution**: Use state for UI updates.

### Pitfall: ForwardRef Complexity

Incorrect ref forwarding.

**Solution**

```jsx
const Child = React.forwardRef((props, ref) => <input ref={ref} />);
```

---

## Summary

React refs enable direct DOM or component access for imperative tasks. Use them sparingly and prefer declarative approaches.

### Interview-Friendly Tips

- **What are refs?** Objects for accessing DOM elements or component instances.
- **useRef vs createRef?** `useRef` for functional components; `createRef` for classes.
- **Why forward refs?** To pass refs to child components.
- **When to use refs?** For focus, measurements, or third-party libraries. 