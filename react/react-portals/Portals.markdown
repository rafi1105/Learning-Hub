# React Portals - Complete Guide

## Table of Contents
1. [What are React Portals?](#what-are-react-portals)
2. [Creating Portals](#creating-portals)
3. [Use Cases for Portals](#use-cases-for-portals)
4. [Advanced Portal Patterns](#advanced-portal-patterns)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What are React Portals?

React Portals allow rendering components outside the parent DOM hierarchy while maintaining React’s event handling and context. They’re useful for modals, tooltips, and overlays.

### Real-World Analogy
Think of a portal as a teleportation device: it moves a component (e.g., a modal) to a different part of the DOM (e.g., `<body>`) while keeping it connected to the React tree.

### Why Portals?
- **Avoid CSS Conflicts**: Escape parent styles (e.g., `overflow: hidden`).
- **Semantic DOM**: Place modals/tooltips at the root level.
- **Event Handling**: Maintain React’s synthetic events.

---

## Creating Portals

Use `ReactDOM.createPortal` to render a component into a different DOM node.

**Example: Basic Portal**
```jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {children}
    </div>,
    document.body
  );
}

function App() {
  return <Modal><h1>Modal Content</h1></Modal>;
}
```

---

## Use Cases for Portals

- **Modals**: Render dialogs outside the app’s DOM.
- **Tooltips**: Position tooltips relative to the body.
- **Notifications**: Display alerts at the top level.

**Example: Modal with Close**
```jsx
import { useState } from 'react';
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return createPortal(
    <div style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div style={{ background: 'white', padding: 20 }}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h1>Modal Content</h1>
      </Modal>
    </div>
  );
}
```

---

## Advanced Portal Patterns

### Portal with Context
Pass context through portals.

**Example**
```jsx
import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const ThemeContext = createContext('light');

function Modal({ children }) {
  const theme = useContext(ThemeContext);
  return createPortal(
    <div style={{ background: theme === 'light' ? '#fff' : '#333', padding: 20 }}>
      {children}
    </div>,
    document.body
  );
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Modal><h1>Modal in {theme} theme</h1></Modal>
    </ThemeContext.Provider>
  );
}
```

### Dynamic Portal Container
Use a dynamic DOM node for portals.

**Example**
```jsx
function Modal({ children }) {
  const el = useRef(document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(el.current);
    return () => document.body.removeChild(el.current);
  }, []);

  return createPortal(children, el.current);
}
```

---

## Real-Life Project Examples

### 1. Notification System
A notification portal.

```jsx
import { useState } from 'react';
import { createPortal } from 'react-dom';

function Notification({ message, onClose }) {
  return createPortal(
    <div style={{ position: 'fixed', top: 10, right: 10, background: '#007bff', color: 'white', padding: 10 }}>
      {message}
      <button onClick={onClose}>Close</button>
    </div>,
    document.body
  );
}

function App() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(true)}>Show Notification</button>
      {show && <Notification message="Success!" onClose={() => setShow(false)} />}
    </div>
  );
}
```

### 2. Modal Dialog
A reusable modal dialog.

```jsx
import { useState } from 'react';
import { createPortal } from 'react-dom';

function ModalDialog({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return createPortal(
    <div style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div style={{ background: 'white', padding: 20, margin: '100px auto', width: 400 }}>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
        <p>This is a modal dialog!</p>
      </ModalDialog>
    </div>
  );
}
```

---

## Best Practices

### 1. Use Portals for Overlays
Render modals/tooltips outside the app’s DOM.

**Example**
```jsx
createPortal(<Modal />, document.body);
```

### 2. Manage DOM Nodes
Clean up dynamically created nodes.

**Example**
```jsx
useEffect(() => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return () => document.body.removeChild(div);
}, []);
```

### 3. Preserve Context
Ensure context is available in portals.

**Example**
```jsx
<Context.Provider value={value}>
  <Portal />
</Context.Provider>
```

### 4. Handle Accessibility
Add ARIA attributes and focus management.

**Example**
```jsx
<div role="dialog" aria-labelledby="modal-title">
  <h2 id="modal-title">Modal</h2>
</div>
```

---

## Common Pitfalls and Solutions

### Pitfall: CSS Conflicts
Parent styles affect portals.

**Solution**: Render to `<body>` or a dedicated container.

### Pitfall: Missing Cleanup
Dynamic nodes can persist.

**Solution**
```jsx
useEffect(() => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return () => document.body.removeChild(div);
}, []);
```

### Pitfall: Accessibility Issues
Modals may not be accessible.

**Solution**: Add ARIA roles and manage focus.

---

## Summary
React Portals enable rendering outside the DOM hierarchy, ideal for modals and overlays. Proper management ensures seamless integration.

### Interview-Friendly Tips
- **What are portals?** Render components outside the parent DOM while keeping React’s context.
- **Why use portals?** To avoid CSS conflicts and maintain semantic DOM structure.
- **How to handle accessibility?** Use ARIA roles and focus management.
- **When to use portals?** For modals, tooltips, and notifications.