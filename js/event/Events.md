# JavaScript Event Handling - Complete Guide

## Table of Contents
1. [What is Event Handling?](#what-is-event-handling)
2. [Event Listeners](#event-listeners)
3. [Event Propagation](#event-propagation)
4. [Event Delegation](#event-delegation)
5. [Common Event Types](#common-event-types)
6. [Advanced Event Handling Techniques](#advanced-event-handling-techniques)
7. [Real-Life Project Examples](#real-life-project-examples)
8. [Best Practices](#best-practices)
9. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is Event Handling?

Event handling in JavaScript involves detecting and responding to user interactions (e.g., clicks, keypresses) or system events (e.g., page load, resize). Events are managed using event listeners, propagation mechanisms, and techniques like delegation to create interactive web applications.

### Real-World Analogy
Think of event handling as a restaurant waiter: they listen for customer requests (events like clicks), respond appropriately (execute code), and manage multiple tables efficiently (event delegation).

### Why Event Handling?
- **Interactivity**: Enables dynamic user experiences (e.g., form submissions, button clicks).
- **Flexibility**: Handles various events like mouse, keyboard, or touch.
- **Performance**: Techniques like delegation optimize resource usage.

---

## Event Listeners

Event listeners attach functions to DOM elements to respond to events.

**Example: Basic Event Listener**
```javascript
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
  console.log('Button clicked!');
});
```

**Multiple Listeners**
```javascript
const input = document.getElementById('myInput');
input.addEventListener('focus', () => console.log('Input focused'));
input.addEventListener('blur', () => console.log('Input blurred'));
```

**Removing Listeners**
```javascript
function handleClick() {
  console.log('Clicked!');
}

const button = document.getElementById('myButton');
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick); // Must reference same function
```

**Event Object**
```javascript
button.addEventListener('click', event => {
  console.log('Target:', event.target);
  console.log('Coordinates:', event.clientX, event.clientY);
});
```

---

## Event Propagation

Events propagate through the DOM in two phases: **capturing** (from root to target) and **bubbling** (from target to root).

**Example: Bubbling**
```javascript
document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent clicked');
});

document.getElementById('child').addEventListener('click', () => {
  console.log('Child clicked');
});

// Clicking child logs: "Child clicked" -> "Parent clicked"
```

**Example: Capturing**
```javascript
document.getElementById('parent').addEventListener(
  'click',
  () => console.log('Parent captured'),
  { capture: true }
);
```

**Stopping Propagation**
```javascript
document.getElementById('child').addEventListener('click', event => {
  event.stopPropagation(); // Prevents parent handler
  console.log('Child clicked');
});
```

**Prevent Default**
```javascript
document.getElementById('form').addEventListener('submit', event => {
  event.preventDefault(); // Stops form submission
  console.log('Form submission prevented');
});
```

---

## Event Delegation

Event delegation uses a single listener on a parent element to handle events from multiple children, improving performance.

**Example: Delegated Click Handling**
```javascript
document.getElementById('list').addEventListener('click', event => {
  if (event.target.tagName === 'LI') {
    console.log('List item clicked:', event.target.textContent);
  }
});

// HTML
// <ul id="list">
//   <li>Item 1</li>
//   <li>Item 2</li>
// </ul>
```

**Dynamic Elements**
```javascript
const list = document.getElementById('list');
list.addEventListener('click', event => {
  if (event.target.tagName === 'LI') {
    event.target.style.color = 'blue';
  }
});

// Dynamically add item
const newItem = document.createElement('li');
newItem.textContent = 'Item 3';
list.appendChild(newItem); // Still works with delegation
```

---

## Common Event Types

### Mouse Events
- `click`, `dblclick`, `mouseover`, `mouseout`, `mousemove`

**Example**
```javascript
document.getElementById('box').addEventListener('mouseover', () => {
  console.log('Mouse over box');
});
```

### Keyboard Events
- `keydown`, `keyup`, `keypress`

**Example**
```javascript
document.addEventListener('keydown', event => {
  if (event.key === 'Enter') console.log('Enter pressed');
});
```

### Form Events
- `submit`, `change`, `input`, `focus`, `blur`

**Example**
```javascript
document.getElementById('input').addEventListener('input', event => {
  console.log('Input value:', event.target.value);
});
```

### Window Events
- `load`, `resize`, `scroll`

**Example**
```javascript
window.addEventListener('resize', () => {
  console.log('Window resized:', window.innerWidth);
});
```

### Touch Events
- `touchstart`, `touchmove`, `touchend`

**Example**
```javascript
document.getElementById('touchArea').addEventListener('touchstart', event => {
  console.log('Touch started:', event.touches.length);
});
```

---

## Advanced Event Handling Techniques

### Throttling and Debouncing
Limit event frequency for performance.

**Example: Debounce Scroll**
```javascript
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const handleScroll = debounce(() => {
  console.log('Scrolled:', window.scrollY);
}, 100);

window.addEventListener('scroll', handleScroll);
```

### Custom Events
Create and dispatch custom events.

**Example**
```javascript
const myEvent = new CustomEvent('myEvent', { detail: { message: 'Hello' } });

document.addEventListener('myEvent', event => {
  console.log('Custom event:', event.detail.message);
});

document.dispatchEvent(myEvent);
```

### React Event Handling
Use synthetic events in React.

**Example**
```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## Real-Life Project Examples

### 1. Todo List with Event Delegation
Use delegation for a dynamic todo list.

```javascript
import { useEffect } from 'react';

function TodoList() {
  useEffect(() => {
    const list = document.getElementById('todo-list');
    list.addEventListener('click', event => {
      if (event.target.classList.contains('todo-item')) {
        event.target.classList.toggle('completed');
      }
    });

    return () => list.removeEventListener('click'); // Cleanup
  }, []);

  return (
    <ul id="todo-list">
      <li className="todo-item">Task 1</li>
      <li className="todo-item">Task 2</li>
    </ul>
  );
}

// CSS
// .completed { text-decoration: line-through; }
```

**Use Case**: Toggles completed tasks in a todo app, handling dynamically added items.

### 2. Search Bar with Real-Time Input
Handle input and submit events.

```javascript
import { useState } from 'react';

function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    console.log('Search submitted:', query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

**Use Case**: Implements a search bar with real-time input and form submission.

### 3. Drag-and-Drop Interface
Use mouse events for drag-and-drop.

```javascript
function DragDrop() {
  useEffect(() => {
    const item = document.getElementById('draggable');
    let isDragging = false;
    let currentX;
    let initialX;

    item.addEventListener('mousedown', event => {
      isDragging = true;
      initialX = event.clientX - currentX;
    });

    document.addEventListener('mousemove', event => {
      if (isDragging) {
        currentX = event.clientX - initialX;
        item.style.left = `${currentX}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    return () => {
      item.removeEventListener('mousedown');
      document.removeEventListener('mousemove');
      document.removeEventListener('mouseup');
    };
  }, []);

  return <div id="draggable" style={{ position: 'absolute', width: '100px', height: '100px', background: 'blue' }} />;
}
```

**Use Case**: Enables draggable elements in a UI builder or kanban board.

---

## Best Practices

### 1. Use Event Delegation
Attach listeners to parent elements for dynamic content.

**Example**
```javascript
document.getElementById('parent').addEventListener('click', event => {
  if (event.target.matches('.child')) {
    // Handle event
  }
});
```

### 2. Clean Up Listeners
Remove listeners to prevent memory leaks.

**Example**
```javascript
useEffect(() => {
  const handler = () => {};
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

### 3. Optimize Performance
Throttle or debounce high-frequency events.

**Example**
```javascript
const throttle = (fn, delay) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      fn(...args);
      last = now;
    }
  };
};
```

### 4. Ensure Accessibility
Use keyboard events alongside mouse events.

**Example**
```javascript
button.addEventListener('click', handleClick);
button.addEventListener('keypress', event => {
  if (event.key === 'Enter') handleClick(event);
});
```

---

## Common Pitfalls and Solutions

### Pitfall: Memory Leaks
Unremoved listeners persist.

**Solution**: Remove listeners in cleanup functions.

**Example**
```javascript
useEffect(() => {
  const handler = () => {};
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
}, []);
```

### Pitfall: Incorrect Event Delegation
Targeting wrong elements.

**Solution**: Use `matches` or `classList.contains`.

**Example**
```javascript
if (event.target.matches('.item')) {
  // Handle event
}
```

### Pitfall: Overusing PreventDefault
Blocking default behavior unnecessarily.

**Solution**: Only prevent when needed (e.g., form submission).

### Pitfall: Event Order Issues
Unexpected propagation order.

**Solution**: Understand bubbling vs. capturing.

**Example**
```javascript
element.addEventListener('click', () => {}, { capture: true });
```

---

## Summary
Event handling in JavaScript uses listeners, propagation, and delegation to create interactive apps. Techniques like throttling and custom events enhance functionality.

### Interview-Friendly Tips
- **What is event delegation?** Attaching a listener to a parent to handle child events.
- **Explain bubbling vs capturing?** Bubbling is bottom-up; capturing is top-down.
- **How to throttle events?** Limit execution with a delay using `setTimeout`.
- **Why remove listeners?** To prevent memory leaks in dynamic apps.