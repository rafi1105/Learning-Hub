# React Accessibility - Complete Guide

## Table of Contents
1. [What is React Accessibility?](#what-is-react-accessibility)
2. [ARIA Attributes](#aria-attributes)
3. [Focus Management](#focus-management)
4. [Advanced Accessibility Patterns](#advanced-accessibility-patterns)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is React Accessibility?

React accessibility (a11y) ensures applications are usable by everyone, including people with disabilities. This involves using ARIA attributes, managing focus, and ensuring semantic HTML.

### Real-World Analogy
Think of accessibility as building ramps and wide doors in a building: it ensures everyone (e.g., screen reader users, keyboard navigators) can access the content.

### Why Accessibility?
- **Inclusivity**: Supports users with disabilities.
- **Legal Compliance**: Meets standards like WCAG and ADA.
- **Better UX**: Improves usability for all users.

---

## ARIA Attributes

ARIA (Accessible Rich Internet Applications) attributes enhance semantics for assistive technologies.

**Example: ARIA for Button**
```jsx
function ToggleButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      aria-expanded={isOpen}
      aria-controls="panel"
      onClick={() => setIsOpen(!isOpen)}
    >
      Toggle
    </button>
  );
}
```

**Common ARIA Attributes**:
- `aria-label`: Describes an element.
- `aria-hidden`: Hides elements from screen readers.
- `aria-live`: Announces dynamic updates.

**Example: ARIA Live Region**
```jsx
function Notification() {
  const [message, setMessage] = useState('');

  return (
    <div>
      <button onClick={() => setMessage('New alert!')}>Trigger Alert</button>
      <div aria-live="polite">{message}</div>
    </div>
  );
}
```

---

## Focus Management

Manage keyboard focus to ensure navigability.

**Example: Focus on Modal Open**
```jsx
import { useRef, useEffect } from 'react';

function Modal({ isOpen, onClose }) {
  const firstFocusable = useRef(null);

  useEffect(() => {
    if (isOpen) firstFocusable.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-labelledby="modal-title">
      <h2 id="modal-title">Modal</h2>
      <button ref={firstFocusable} onClick={onClose}>
        Close
      </button>
    </div>
  );
}
```

---

## Advanced Accessibility Patterns

### Keyboard Navigation
Ensure all interactive elements are keyboard-accessible.

**Example: Keyboard-Friendly Menu**
```jsx
function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen) menuRef.current?.focus();
  }, [isOpen]);

  return (
    <div>
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </button>
      {isOpen && (
        <ul
          ref={menuRef}
          tabIndex={-1}
          role="menu"
          onKeyDown={e => e.key === 'Escape' && setIsOpen(false)}
        >
          <li role="menuitem" tabIndex={0}>
            Item 1
          </li>
          <li role="menuitem" tabIndex={0}>
            Item 2
          </li>
        </ul>
      )}
    </div>
  );
}
```

### Screen Reader Announcements
Use `aria-live` for dynamic content.

**Example**
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <div aria-live="polite">Count: {count}</div>
    </div>
  );
}
```

---

## Real-Life Project Examples

### 1. Accessible Form
A form with validation and ARIA attributes.

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!email.includes('@')) setError('Invalid email');
    else setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-describedby="email-error"
      />
      {error && (
        <div id="email-error" role="alert">
          {error}
        </div>
      )}
      <button type="submit">Login</button>
    </form>
  );
}
```

**Use Case**: Ensures screen readers announce validation errors.

### 2. Accessible Modal
A modal with focus trapping.

```jsx
import { useRef, useEffect } from 'react';

function Modal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current.focus();
      const handleKeyDown = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <h2 id="modal-title">Modal</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
```

**Use Case**: Traps focus for keyboard users and ensures screen reader compatibility.

---

## Best Practices

### 1. Use Semantic HTML
Use native elements (e.g., `<button>`, `<form>`) for accessibility.

**Example**
```jsx
<button type="button">Click</button>
```

### 2. Add ARIA Attributes
Enhance semantics for assistive technologies.

**Example**
```jsx
<div role="alert" aria-live="assertive">Error</div>
```

### 3. Manage Focus
Ensure focus is handled for modals and dynamic content.

**Example**
```jsx
useEffect(() => {
  ref.current?.focus();
}, []);
```

### 4. Test with Screen Readers
Use tools like VoiceOver or NVDA to test accessibility.

---

## Common Pitfalls and Solutions

### Pitfall: Missing ARIA Attributes
Non-semantic elements confuse screen readers.

**Solution**: Add appropriate ARIA roles and attributes.

**Example**
```jsx
<button aria-label="Close">X</button>
```

### Pitfall: Poor Focus Management
Modals or dialogs lose focus.

**Solution**: Implement focus trapping.

**Example**
```jsx
useEffect(() => {
  modalRef.current?.focus();
}, []);
```

### Pitfall: Overusing ARIA
Unnecessary ARIA attributes can confuse assistive technologies.

**Solution**: Use native HTML when possible.

---

## Summary
React accessibility ensures inclusive apps using ARIA, semantic HTML, and focus management. It’s critical for compliance and UX.

### Interview-Friendly Tips
- **What is ARIA?** Attributes that enhance accessibility for assistive technologies.
- **Why manage focus?** To ensure keyboard navigability, especially in modals.
- **How to test a11y?** Use screen readers (VoiceOver, NVDA) and tools like axe.
- **When to use ARIA?** When native HTML semantics are insufficient.