# JavaScript JSON Handling - Complete Guide

## Table of Contents
1. [What is JSON?](#what-is-json)
2. [Parsing and Stringifying](#parsing-and-stringifying)
3. [Working with JSON Data](#working-with-json-data)
4. [Advanced JSON Techniques](#advanced-json-techniques)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is JSON?

JSON (JavaScript Object Notation) is a lightweight data format for storing and exchanging data. It’s widely used in APIs and configuration files.

### Real-World Analogy
Think of JSON as a universal recipe card: it’s a standard format that any chef (program) can read and use.

### Why JSON?
- **Interoperability**: Works across languages and platforms.
- **Readability**: Human-readable format.
- **Lightweight**: Efficient for data transfer.

---

## Parsing and Stringifying

Use `JSON.parse` to convert JSON strings to objects and `JSON.stringify` to convert objects to JSON strings.

**Example**
```javascript
const jsonString = '{"name": "John", "age": 30}';
const obj = JSON.parse(jsonString); // { name: 'John', age: 30 }
const newJsonString = JSON.stringify(obj); // '{"name":"John","age":30}'
```

**Error Handling**
```javascript
try {
  const obj = JSON.parse('invalid-json');
} catch (error) {
  console.error('Parsing error:', error.message);
}
```

---

## Working with JSON Data

### Fetching JSON
Retrieve JSON from APIs.

**Example**
```javascript
async function fetchUser(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
```

### Manipulating JSON
Transform JSON data.

**Example**
```javascript
const user = { name: 'John', age: 30, hobbies: ['reading', 'gaming'] };
const updatedUser = JSON.parse(JSON.stringify(user)); // Deep copy
updatedUser.age = 31;
```

---

## Advanced JSON Techniques

### Custom Stringifying
Use `replacer` in `JSON.stringify`.

**Example**
```javascript
const data = { name: 'John', age: 30, secret: 'hidden' };
const json = JSON.stringify(data, (key, value) => (key === 'secret' ? undefined : value));
console.log(json); // '{"name":"John","age":30}'
```

### Custom Parsing
Use `reviver` in `JSON.parse`.

**Example**
```javascript
const json = '{"date": "2025-09-11"}';
const obj = JSON.parse(json, (key, value) => 
  key === 'date' ? new Date(value) : value
);
console.log(obj.date); // Date object
```

---

## Real-Life Project Examples

### 1. API Data Display
Display user data from an API.

```javascript
function UserDisplay() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      setUser(await response.json());
    }
    fetchData();
  }, []);

  if (!user) return <div>Loading...</div>;
  return <div>{JSON.stringify(user)}</div>;
}
```

**Use Case**: Displays API data in a profile page.

### 2. Configuration Loader
Load app settings from JSON.

```javascript
async function loadConfig() {
  try {
    const response = await fetch('/config.json');
    const config = await response.json();
    console.log('Config:', config);
    return config;
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}
```

**Use Case**: Loads app settings (e.g., API keys, themes).

---

## Best Practices

### 1. Handle Parsing Errors
Always use `try-catch` with `JSON.parse`.

**Example**
```javascript
try {
  JSON.parse(jsonString);
} catch (e) {
  console.error('Invalid JSON');
}
```

### 2. Validate JSON
Ensure JSON structure before processing.

**Example**
```javascript
if (!data.name) throw new Error('Missing name field');
```

### 3. Use Deep Copies
Avoid mutating original JSON objects.

**Example**
```javascript
const copy = JSON.parse(JSON.stringify(data));
```

### 4. Optimize JSON Size
Minimize data sent over the network.

**Example**
```javascript
JSON.stringify(data, null, 0); // No whitespace
```

---

## Common Pitfalls and Solutions

### Pitfall: Invalid JSON
Parsing invalid JSON throws errors.

**Solution**: Use `try-catch`.

### Pitfall: Circular References
`JSON.stringify` fails with circular objects.

**Solution**: Remove circular references or use libraries like `flatted`.

**Example**
```javascript
import { stringify } from 'flatted';
const obj = { a: 1 };
obj.circular = obj;
stringify(obj);
```

### Pitfall: Large JSON Payloads
Large JSON slows down apps.

**Solution**: Paginate or compress data.

---

## Summary
JSON is a versatile format for data exchange, with `JSON.parse` and `JSON.stringify` enabling easy manipulation.

### Interview-Friendly Tips
- **What is JSON?** A lightweight data format for APIs and storage.
- **How to handle parsing errors?** Use `try-catch` with `JSON.parse`.
- **What are replacer/reviver?** Functions to customize `stringify`/`parse`.
- **How to handle circular references?** Use libraries like `flatted`.