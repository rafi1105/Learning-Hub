# React Patterns - Complete Guide

## Table of Contents
1. [What are React Patterns?](#what-are-react-patterns)
2. [Higher-Order Components (HOCs)](#higher-order-components-hocs)
3. [Render Props](#render-props)
4. [Compound Components](#compound-components)
5. [Advanced Patterns](#advanced-patterns)
6. [Real-Life Project Examples](#real-life-project-examples)
7. [Best Practices](#best-practices)
8. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What are React Patterns?

React patterns are reusable solutions for common problems in component design. They include Higher-Order Components (HOCs), render props, compound components, and hooks-based patterns, enabling modular and maintainable code.

### Real-World Analogy
Think of React patterns as recipes: each pattern (recipe) provides a structured way to combine ingredients (components) to achieve a specific dish (functionality).

### Why Patterns?
- **Reusability**: Share logic across components.
- **Maintainability**: Organize code for scalability.
- **Flexibility**: Adapt to various use cases.

---

## Higher-Order Components (HOCs)

HOCs are functions that take a component and return a new component with added functionality.

**Example: HOC**
```jsx
function withLogger(WrappedComponent) {
  return function EnhancedComponent(props) {
    console.log('Props:', props);
    return <WrappedComponent {...props} />;
  };
}

function Button({ label }) {
  return <button>{label}</button>;
}

const LoggedButton = withLogger(Button);

function App() {
  return <LoggedButton label="Click Me" />;
}
```

---

## Render Props

Render props allow components to share logic by passing a render function as a prop.

**Example: Render Props**
```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = e => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return <div onMouseMove={handleMouseMove}>{render(position)}</div>;
}

function App() {
  return (
    <MouseTracker
      render={position => (
        <p>
          Mouse position: ({position.x}, {position.y})
        </p>
      )}
    />
  );
}
```

---

## Compound Components

Compound components are a group of components that work together, sharing state implicitly.

**Example: Compound Components**
```jsx
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

function Tab({ index, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      onClick={() => setActiveTab(index)}
      style={{ fontWeight: activeTab === index ? 'bold' : 'normal' }}
    >
      {children}
    </button>
  );
}

function TabPanel({ index, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === index ? <div>{children}</div> : null;
}

function App() {
  return (
    <Tabs>
      <Tab index={0}>Tab 1</Tab>
      <Tab index={1}>Tab 2</Tab>
      <TabPanel index={0}>Content 1</TabPanel>
      <TabPanel index={1}>Content 2</TabPanel>
    </Tabs>
  );
}
```

---

## Advanced Patterns

### Controlled Components
Allow parent components to control child state.

**Example**
```jsx
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}

function App() {
  const [value, setValue] = useState('');
  return <ControlledInput value={value} onChange={e => setValue(e.target.value)} />;
}
```

### Custom Hooks
Extract reusable logic into hooks.

**Example**
```jsx
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

function App() {
  const { width, height } = useWindowSize();
  return <p>Window: {width}x{height}</p>;
}
```

---

## Real-Life Project Examples

### 1. Reusable Modal with Compound Components
A modal system using compound components.

```jsx
import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

function Modal({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

function ModalTrigger({ children }) {
  const { setIsOpen } = useContext(ModalContext);
  return <button onClick={() => setIsOpen(true)}>{children}</button>;
}

function ModalContent({ children }) {
  const { isOpen, setIsOpen } = useContext(ModalContext);
  if (!isOpen) return null;
  return (
    <div style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div style={{ background: 'white', padding: 20 }}>
        {children}
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Modal>
      <ModalTrigger>Open Modal</ModalTrigger>
      <ModalContent>
        <h2>Modal Content</h2>
        <p>This is a modal!</p>
      </ModalContent>
    </Modal>
  );
}
```

### 2. Data Fetching with HOC
A HOC for data fetching.

```jsx
function withDataFetching(WrappedComponent, url) {
  return function EnhancedComponent(props) {
    const [data, setData] = useState(null);
    useEffect(() => {
      fetch(url)
        .then(res => res.json())
        .then(setData);
    }, []);
    return <WrappedComponent data={data} {...props} />;
  };
}

function UserList({ data }) {
  if (!data) return <p>Loading...</p>;
  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

const UserListWithData = withDataFetching(UserList, 'https://jsonplaceholder.typicode.com/users');

function App() {
  return <UserListWithData />;
}
```

---

## Best Practices

### 1. Choose the Right Pattern
Use HOCs for cross-cutting concerns, render props for flexibility, and compound components for related components.

### 2. Keep Components Small
Break down complex components into smaller ones.

**Example**
```jsx
function App() {
  return (
    <Tabs>
      <Tab />
      <TabPanel />
    </Tabs>
  );
}
```

### 3. Use Hooks When Possible
Prefer hooks over HOCs/render props for modern React.

### 4. Document Patterns
Document custom patterns for team clarity.

---

## Common Pitfalls and Solutions

### Pitfall: Overusing HOCs
HOCs can lead to wrapper hell.

**Solution**: Use hooks or composition.

### Pitfall: Render Props Complexity
Render props can make JSX complex.

**Solution**
```jsx
// Simplify with hooks
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // ...
  return position;
}
```

### Pitfall: Context Overuse in Compound Components
Overusing context can reduce reusability.

**Solution**: Pass props explicitly when possible.

---

## Summary
React patterns like HOCs, render props, and compound components enable reusable, maintainable code. Hooks often simplify these patterns.

### Interview-Friendly Tips
- **HOC vs render props?** HOCs wrap components; render props pass render functions.
- **When to use compound components?** For tightly coupled component groups like tabs.
- **Why prefer hooks?** Simpler, more modern, and less boilerplate.
- **How to avoid wrapper hell?** Use composition or hooks.