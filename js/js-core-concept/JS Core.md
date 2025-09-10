# JavaScript Core Concepts - Complete Guide

## Table of Contents
1. [What are JavaScript Core Concepts?](#what-are-javascript-core-concepts)
2. [Data Types](#data-types)
3. [Variables](#variables)
4. [Scope](#scope)
5. [Basic Programming Constructs](#basic-programming-constructs)
6. [Real-Life Project Examples](#real-life-project-examples)
7. [Best Practices](#best-practices)
8. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What are JavaScript Core Concepts?

JavaScript core concepts include data types, variables, scope, and basic programming constructs (e.g., conditionals, functions). These fundamentals form the foundation for writing robust and efficient JavaScript code.

### Real-World Analogy
Think of JavaScript core concepts as the building blocks of a house: data types are the materials (wood, brick), variables are storage containers, scope defines room access, and constructs are the blueprints for construction.

### Why Core Concepts?
- **Foundation**: Essential for understanding advanced JavaScript.
- **Reliability**: Ensures correct data handling and logic.
- **Interoperability**: Used in all JavaScript environments (browser, Node.js).

---

## Data Types

JavaScript has **primitive** and **non-primitive** data types.

### Primitive Types
- `undefined`, `null`, `boolean`, `number`, `bigint`, `string`, `symbol`

**Example**
```javascript
let name = 'John'; // string
let age = 30; // number
let isActive = true; // boolean
let id = Symbol('id'); // symbol
let nothing = null; // null
let notDefined; // undefined
```

### Non-Primitive Types
- `object` (includes arrays, functions, etc.)

**Example**
```javascript
const user = { name: 'John', age: 30 }; // object
const numbers = [1, 2, 3]; // array
const add = (a, b) => a + b; // function
```

**Type Checking**
```javascript
console.log(typeof name); // 'string'
console.log(Array.isArray(numbers)); // true
console.log(user instanceof Object); // true
```

---

## Variables

Variables store data using `var`, `let`, or `const`.

**Example: Variable Declarations**
```javascript
var globalVar = 'global'; // Function-scoped, hoisted
let blockVar = 'block'; // Block-scoped, not hoisted
const constant = 42; // Block-scoped, immutable
```

**Hoisting**
```javascript
console.log(hoisted); // undefined
var hoisted = 'value';
```

**Const Immutability**
```javascript
const obj = { key: 'value' };
obj.key = 'newValue'; // Allowed: Object properties are mutable
// obj = {}; // Error: Cannot reassign const
```

---

## Scope

Scope determines variable accessibility: **global**, **function**, and **block**.

**Example: Global and Function Scope**
```javascript
var global = 'I am global';

function myFunc() {
  var local = 'I am local';
  console.log(global); // Accessible
  console.log(local); // Accessible
}

console.log(global); // Accessible
// console.log(local); // Error: Not defined
```

**Block Scope**
```javascript
if (true) {
  let block = 'I am block-scoped';
  console.log(block); // Accessible
}
// console.log(block); // Error: Not defined
```

**Closures**
```javascript
function outer() {
  let count = 0;
  return function inner() {
    return ++count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
```

---

## Basic Programming Constructs

### Conditionals
Use `if`, `else if`, `else`, or `switch`.

**Example: If Statement**
```javascript
const age = 18;
if (age >= 18) {
  console.log('Adult');
} else {
  console.log('Minor');
}
```

**Switch Statement**
```javascript
const day = 'Monday';
switch (day) {
  case 'Monday':
    console.log('Start of week');
    break;
  default:
    console.log('Other day');
}
```

### Functions
Define reusable logic.

**Example: Function Declaration**
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet('John')); // 'Hello, John!'
```

**Arrow Functions**
```javascript
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5
```

### Operators
- Arithmetic: `+`, `-`, `*`, `/`, `%`
- Comparison: `==`, `===`, `!=`, `!==`
- Logical: `&&`, `||`, `!`

**Example**
```javascript
console.log(5 === '5'); // false (strict equality)
console.log(5 == '5'); // true (loose equality)
```

---

## Real-Life Project Examples

### 1. User Profile Manager
Validate and store user data.

```javascript
function createUser(name, age) {
  if (typeof name !== 'string' || typeof age !== 'number') {
    throw new Error('Invalid input types');
  }
  const user = { name, age };
  return user;
}

try {
  const user = createUser('John', 30);
  console.log('User created:', user);
} catch (error) {
  console.error(error.message);
}
```

**Use Case**: Validates input in a registration form.

### 2. Settings Manager with Closures
Manage app settings with private state.

```javascript
function settingsManager() {
  let settings = { theme: 'light', notifications: true };
  
  return {
    getSetting: key => settings[key],
    setSetting: (key, value) => {
      if (!(key in settings)) throw new Error('Invalid setting');
      settings[key] = value;
    }
  };
}

const settings = settingsManager();
settings.setSetting('theme', 'dark');
console.log(settings.getSetting('theme')); // 'dark'
```

**Use Case**: Persists user preferences in a web app.

---

## Best Practices

### 1. Use `let` and `const`
Avoid `var` to prevent hoisting issues.

**Example**
```javascript
let count = 0;
const API_KEY = 'abc123';
```

### 2. Prefer Strict Equality
Use `===` over `==` to avoid type coercion.

**Example**
```javascript
if (value === 42) {}
```

### 3. Leverage Closures
Use closures for data privacy.

**Example**
```javascript
function createCounter() {
  let count = 0;
  return () => ++count;
}
```

### 4. Validate Types
Check data types before operations.

**Example**
```javascript
if (typeof input !== 'string') throw new Error('Expected string');
```

---

## Common Pitfalls and Solutions

### Pitfall: Var Hoisting
Using `var` before declaration.

**Solution**: Use `let` or `const`.

**Example**
```javascript
// ❌ Bad
console.log(x); // undefined
var x = 5;

// ✅ Good
let x = 5;
console.log(x);
```

### Pitfall: Loose Equality
`==` causes unexpected results.

**Solution**: Use `===`.

**Example**
```javascript
// ❌ Bad
if (0 == '0') // true

// ✅ Good
if (0 === '0') // false
```

### Pitfall: Global Scope Pollution
Declaring variables globally.

**Solution**: Use block scope or modules.

**Example**
```javascript
function myFunc() {
  let local = 'value';
}
```

---

## Summary
JavaScript core concepts (data types, variables, scope, constructs) are the foundation for writing robust code, enabling everything from simple scripts to complex applications.

### Interview-Friendly Tips
- **What are JavaScript data types?** Primitives: `undefined`, `null`, `boolean`, `number`, `bigint`, `string`, `symbol`; Non-primitive: `object`.
- **Var vs let vs const?** `var` is function-scoped and hoisted; `let` and `const` are block-scoped; `const` is immutable.
- **What is a closure?** A function retaining access to its outer scope’s variables.
- **Why avoid loose equality?** `==` coerces types, causing unexpected behavior.