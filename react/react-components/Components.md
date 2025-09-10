# React Components - Complete Guide

## Table of Contents
1. [What are Components?](#what-are-components)
2. [Types of Components](#types-of-components)
3. [Component Composition](#component-composition)
4. [Props and Prop Drilling](#props-and-prop-drilling)
5. [Advanced Patterns](#advanced-patterns)
6. [Real-Life Project Examples](#real-life-project-examples)
7. [Best Practices](#best-practices)

---

## What are Components?

Components are the building blocks of React applications. They encapsulate UI logic, styling, and behavior, making code modular and reusable.

### Real-World Analogy
Think of components as LEGO bricks: each brick (component) can be combined to build complex structures (UIs), and each brick serves a specific purpose.

---

## Types of Components

React supports two main types of components:
1. **Functional Components**: JavaScript functions returning JSX.
2. **Class Components**: ES6 classes extending `React.Component`.

### Functional Component
```jsx
function Button({ label }) {
  return <button>{label}</button>;
}
```

### Class Component
```jsx
import React from 'react';

class Button extends React.Component {
  render() {
    return <button>{this.props.label}</button>;
  }
}
```

---

## Component Composition

Components can be nested to create complex UIs. Parent components pass data to children via props.

**Example: Composition**
```jsx
function Card({ title, content }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <Card title="Card 1" content="This is the first card." />
      <Card title="Card 2" content="This is the second card." />
    </div>
  );
}
```

---

## Props and Prop Drilling

### Props
Props allow components to receive data from their parents.

**Example: Props**
```jsx
function UserInfo({ user }) {
  return <p>Name: {user.name}, Email: {user.email}</p>;
}

function App() {
  const user = { name: 'Alice', email: 'alice@example.com' };
  return <UserInfo user={user} />;
}
```

### Prop Drilling
Props drilling occurs when props are passed through multiple layers of components.

**Example: Prop Drilling**
```jsx
function Grandparent() {
  const user = { name: 'Bob' };
  return <Parent user={user} />;
}

function Parent({ user }) {
  return <Child user={user} />;
}

function Child({ user }) {
  return <p>Hello, {user.name}!</p>;
}
```

---

## Advanced Patterns

### Render Props
A component with a render prop takes a function that returns JSX, enabling code sharing.

**Example: Render Props**
```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div
      style={{ height: '100px' }}
      onMouseMove={(e) => setPosition({ x: e.clientX, y: e.clientY })}
    >
      {render(position)}
    </div>
  );
}

function App() {
  return (
    <MouseTracker
      render={({ x, y }) => <p>Mouse position: {x}, {y}</p>}
    />
  );
}
```

### Higher-Order Components (HOCs)
HOCs are functions that take a component and return an enhanced version.

**Example: HOC**
```jsx
function withLogging(WrappedComponent) {
  return function EnhancedComponent(props) {
    useEffect(() => {
      console.log('Component mounted with props:', props);
      return () => console.log('Component unmounted');
    }, []);
    return <WrappedComponent {...props} />;
  };
}

const EnhancedButton = withLogging(Button);
```

---

## Real-Life Project Examples

### 1. Shopping Cart
A component-based shopping cart system.

```jsx
import { useState } from 'react';

function ShoppingCart() {
  const [items, setItems] = useState([
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 499 },
  ]);

  return (
    <div>
      <h1>Shopping Cart</h1>
      <CartItems items={items} />
      <CartTotal items={items} />
    </div>
  );
}

function CartItems({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name} - ${item.price}
        </li>
      ))}
    </ul>
  );
}

function CartTotal({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <p>Total: ${total}</p>;
}
```

### 2. Comment System
A system for displaying and adding comments.

```jsx
import { useState } from 'react';

function CommentSystem() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment }]);
      setNewComment('');
    }
  };

  return (
    <div>
      <h1>Comments</h1>
      <CommentForm
        value={newComment}
        onChange={setNewComment}
        onSubmit={addComment}
      />
      <CommentList comments={comments} />
    </div>
  );
}

function CommentForm({ value, onChange, onSubmit }) {
  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={onSubmit}>Post</button>
    </div>
  );
}

function CommentList({ comments }) {
  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </ul>
  );
}
```

---

## Best Practices

### 1. Use Functional Components
Prefer functional components over class components for simplicity and hooks support.

**Example**
```jsx
// ❌ Bad: Class component
class OldButton extends React.Component {}

// ✅ Good: Functional component
function NewButton() {}
```

### 2. Avoid Prop Drilling
Use Context or state management libraries for deeply nested data.

**Example**
```jsx
// ❌ Bad: Prop drilling
function DeepComponent({ data }) {
  return <DeeperComponent data={data} />;
}

// ✅ Good: Use Context
const DataContext = createContext();
```

### 3. Reuse Components
Create generic components to reduce duplication.

**Example**
```jsx
function ReusableCard({ title, children }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### 4. Validate Props
Use PropTypes or TypeScript for prop validation.

**Example**
```jsx
import PropTypes from 'prop-types';

function UserCard({ user }) {
  return <p>{user.name}</p>;
}

UserCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};
```

---

## Summary
Components are the heart of React, enabling modular and reusable UI development. Understanding functional vs. class components, composition, and advanced patterns like render props and HOCs is key to mastering React.

### Interview-Friendly Tips
- **Functional vs Class?** Functional components are preferred for their simplicity and hook support.
- **How to optimize components?** Use composition, avoid prop drilling, and memoize with `React.memo`.
- **What are HOCs?** Functions that enhance components with additional functionality.