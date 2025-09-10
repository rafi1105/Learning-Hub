# JavaScript Error Handling - Complete Guide

## Table of Contents
1. [What is Error Handling?](#what-is-error-handling)
2. [Try-Catch Blocks](#try-catch-blocks)
3. [Error Types](#error-types)
4. [Debugging Techniques](#debugging-techniques)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is Error Handling?

Error handling in JavaScript involves detecting, managing, and recovering from errors to ensure robust applications. It uses `try-catch` blocks, error objects, and debugging tools to handle unexpected issues gracefully.

### Real-World Analogy
Think of error handling as a safety net in a circus: it catches performers (code) when they fall (throw errors), preventing the show (app) from stopping.

### Why Error Handling?
- **Prevent Crashes**: Keeps apps running despite errors.
- **User Experience**: Provides meaningful error messages.
- **Debugging**: Helps identify and fix issues.

---

## Try-Catch Blocks

The `try-catch` block catches errors in synchronous code.

**Example: Basic Try-Catch**
```javascript
try {
  const data = JSON.parse('invalid-json');
} catch (error) {
  console.error('Parsing error:', error.message);
}
```

**Async Try-Catch**
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://invalid-api.com');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error.message);
    return null;
  }
}
```

---

## Error Types

JavaScript has built-in error types like `Error`, `TypeError`, `ReferenceError`, and `SyntaxError`.

**Example: Custom Error**
```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateUser(user) {
  if (!user.name) throw new ValidationError('Name is required');
  return user;
}

try {
  validateUser({});
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
```

**Common Error Types**:
- `ReferenceError`: Accessing undefined variables.
- `TypeError`: Invalid operations (e.g., calling a non-function).
- `SyntaxError`: Invalid code syntax.

---

## Debugging Techniques

Use tools like `console.log`, browser DevTools, and debuggers to identify errors.

**Example: Console Debugging**
```javascript
function divide(a, b) {
  console.log('Inputs:', a, b);
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

try {
  console.log(divide(10, 0));
} catch (error) {
  console.error('Error:', error.message);
}
```

**Browser DevTools**:
- Set breakpoints in the Sources tab.
- Inspect call stack and variables.
- Use `debugger` statement:
```javascript
function problematicFunction() {
  debugger; // Pauses execution in DevTools
  let result = undefinedVar;
}
```

---

## Real-Life Project Examples

### 1. API Error Handler
Handle API errors in a web app.

```javascript
async function getUser(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error.message);
    return { error: 'Unable to load user' };
  }
}

async function displayUser(id) {
  const user = await getUser(id);
  if (user.error) {
    document.getElementById('error').textContent = user.error;
    return;
  }
  document.getElementById('user').textContent = user.name;
}
```

**Use Case**: Gracefully handles network or server errors in a user profile page.

### 2. Form Submission with Validation
Validate form input and handle errors.

```javascript
class FormError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FormError';
  }
}

function validateForm(data) {
  if (!data.email.includes('@')) throw new FormError('Invalid email');
  return data;
}

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const formData = { email: e.target.email.value };
    validateForm(formData);
    alert('Form submitted successfully!');
  } catch (error) {
    document.getElementById('error').textContent = error.message;
  }
});
```

**Use Case**: Prevents form submission with invalid data, showing user-friendly errors.

---

## Best Practices

### 1. Use Specific Error Types
Create custom errors for specific cases.

**Example**
```javascript
class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
```

### 2. Provide User-Friendly Messages
Display clear errors to users.

**Example**
```javascript
try {
  throw new Error('Invalid input');
} catch (error) {
  alert('Please check your input and try again.');
}
```

### 3. Log Errors
Log errors for debugging and monitoring.

**Example**
```javascript
try {
  // Code
} catch (error) {
  console.error('Error:', error);
  logToServer(error);
}
```

### 4. Graceful Degradation
Handle errors without crashing the app.

**Example**
```javascript
async function fetchData() {
  try {
    const data = await fetch('...').then(res => res.json());
    return data;
  } catch {
    return { error: 'Failed to load data' };
  }
}
```

---

## Common Pitfalls and Solutions

### Pitfall: Uncaught Async Errors
Async errors outside `try-catch` crash the app.

**Solution**: Always use `try-catch` in async functions.

**Example**
```javascript
async function fetchData() {
  try {
    const data = await fetch('...');
  } catch (error) {
    console.error(error);
  }
}
```

### Pitfall: Overusing Try-Catch
Wrapping all code in `try-catch` reduces readability.

**Solution**: Only catch errors where recovery is possible.

### Pitfall: Ignoring Error Details
Not logging stack traces hinders debugging.

**Solution**: Log full error objects.

**Example**
```javascript
catch (error) {
  console.error(error.stack);
}
```

---

## Summary
Error handling in JavaScript uses `try-catch`, custom error types, and debugging tools to build robust apps. Proper handling improves UX and simplifies debugging.

### Interview-Friendly Tips
- **What are JavaScript error types?** `Error`, `TypeError`, `ReferenceError`, etc.
- **How to handle async errors?** Use `try-catch` in async functions or `.catch()` with Promises.
- **Why use custom errors?** For specific error handling and clarity.
- **How to debug errors?** Use `console.log`, DevTools breakpoints, and stack traces.