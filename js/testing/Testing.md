# JavaScript Testing & Debugging - Complete Guide

## Table of Contents
1. [What is Testing & Debugging?](#what-is-testing--debugging)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [Debugging Techniques](#debugging-techniques)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is Testing & Debugging?

Testing ensures code works as expected; debugging identifies and fixes issues. Tools like Jest, Mocha, and browser DevTools are commonly used.

### Real-World Analogy
Testing is like a chef tasting a dish; debugging is finding and fixing why it tastes wrong.

### Why Testing & Debugging?
- **Reliability**: Ensure code correctness.
- **Maintainability**: Catch issues early.
- **Scalability**: Support large codebases.

---

## Unit Testing

Test individual functions or components.

**Example: Jest**
```javascript
// math.js
export function add(a, b) {
  return a + b;
}

// math.test.js
import { add } from './math.js';

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});
```

---

## Integration Testing

Test how components work together.

**Example: React Testing Library**
```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders user list', async () => {
  render(<App />);
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});
```

---

## Debugging Techniques

Use `console.log`, breakpoints, and DevTools.

**Example: Breakpoint Debugging**
```javascript
function calculateTotal(items) {
  debugger; // Pause in DevTools
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**DevTools Tips**:
- Set breakpoints in Sources tab.
- Inspect variables and call stack.
- Use Performance tab to profile.

---

## Real-Life Project Examples

### 1. Testing a Utility Function
Test a string formatter.

```javascript
// utils.js
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// utils.test.js
import { capitalize } from './utils';

test('capitalizes string', () => {
  expect(capitalize('hello')).toBe('Hello');
  expect(capitalize('')).toBe('');
});
```

**Use Case**: Ensures reliable formatting in a UI component.

### 2. Debugging an API Call
Debug a failing fetch request.

```javascript
async function fetchUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  debugger; // Inspect response
  return await response.json();
}
```

**Use Case**: Identifies network or parsing issues.

---

## Best Practices

### 1. Write Testable Code
Keep functions pure and modular.

**Example**
```javascript
export function sum(a, b) {
  return a + b;
}
```

### 2. Mock Dependencies
Mock APIs or external services.

**Example**
```javascript
jest.mock('axios');
axios.get.mockResolvedValue({ data: { name: 'John' } });
```

### 3. Use Descriptive Tests
Clear test names improve readability.

**Example**
```javascript
test('adds two numbers correctly', () => {
  expect(add(2, 3)).toBe(5);
});
```

### 4. Debug Early
Use DevTools during development.

---

## Common Pitfalls and Solutions

### Pitfall: Untested Edge Cases
Missing tests for edge cases.

**Solution**: Test all scenarios.

**Example**
```javascript
test('handles empty string', () => {
  expect(capitalize('')).toBe('');
});
```

### Pitfall: Over-Mocking
Excessive mocking reduces test reliability.

**Solution**: Mock only external dependencies.

### Pitfall: Ignoring Performance
Slow tests delay development.

**Solution**: Use `--watch` mode in Jest.

---

## Summary
Testing and debugging ensure reliable JavaScript code using tools like Jest and DevTools.

### Interview-Friendly Tips
- **What is unit testing?** Testing individual functions or components.
- **How to debug JavaScript?** Use `console.log`, DevTools, and breakpoints.
- **Why mock dependencies?** To isolate tests from external systems.
- **What is integration testing?** Testing how components work together.