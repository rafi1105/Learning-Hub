# JavaScript Regular Expressions - Complete Guide

## Table of Contents
1. [What are Regular Expressions?](#what-are-regular-expressions)
2. [Creating and Using RegEx](#creating-and-using-regex)
3. [Common RegEx Patterns](#common-regex-patterns)
4. [Advanced RegEx Techniques](#advanced-regex-techniques)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What are Regular Expressions?

Regular Expressions (RegEx) are patterns used to match and manipulate strings in JavaScript. They’re powerful for text validation, searching, and replacing.

### Real-World Analogy
Think of RegEx as a search filter in a library: it finds books (strings) matching specific criteria (patterns).

### Why RegEx?
- **Validation**: Ensure input formats (e.g., emails, phone numbers).
- **Text Manipulation**: Search, replace, or extract text.
- **Efficiency**: Perform complex string operations concisely.

---

## Creating and Using RegEx

Use RegEx literals (`/pattern/`) or the `RegExp` constructor.

**Example: Basic RegEx**
```javascript
const pattern = /\d+/; // Matches one or more digits
const str = 'I have 123 apples';
console.log(str.match(pattern)); // ['123']
```

**Using RegExp Constructor**
```javascript
const pattern = new RegExp('\\d+', 'g');
const str = '123 and 456';
console.log(str.match(pattern)); // ['123', '456']
```

**Common Methods**:
- `test()`: Checks if a pattern matches.
- `match()`: Returns matches.
- `replace()`: Replaces matches.

**Example**
```javascript
const email = 'user@example.com';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailPattern.test(email)); // true
```

---

## Common RegEx Patterns

- **Email**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Phone Number**: `/^\+?\d{10,12}$/`
- **URL**: `/^https?:\/\/[^\s$.?#].[^\s]*$/`

**Example: Email Validation**
```javascript
function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

console.log(validateEmail('test@example.com')); // true
console.log(validateEmail('invalid')); // false
```

---

## Advanced RegEx Techniques

### Lookaheads
Match patterns based on what follows.

**Example: Positive Lookahead**
```javascript
const str = 'hello123';
const pattern = /[a-z]+(?=\d+)/; // Letters followed by digits
console.log(str.match(pattern)); // ['hello']
```

### Capturing Groups
Extract parts of a match.

**Example**
```javascript
const str = '2025-09-11';
const pattern = /(\d{4})-(\d{2})-(\d{2})/;
const [, year, month, day] = str.match(pattern);
console.log(`Year: ${year}, Month: ${month}, Day: ${day}`);
```

### Replacing with Functions
Dynamically replace matches.

**Example**
```javascript
const str = 'John is 30, Jane is 25';
const result = str.replace(/\d+/g, num => Number(num) + 1);
console.log(result); // 'John is 31, Jane is 26'
```

---

## Real-Life Project Examples

### 1. Form Input Validation
Validate email and phone inputs.

```javascript
function validateForm({ email, phone }) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\+?\d{10,12}$/;
  
  if (!emailPattern.test(email)) throw new Error('Invalid email');
  if (!phonePattern.test(phone)) throw new Error('Invalid phone');
  return true;
}

try {
  validateForm({ email: 'user@example.com', phone: '+12345678901' });
  console.log('Form is valid');
} catch (error) {
  console.error(error.message);
}
```

**Use Case**: Ensures valid user input in a registration form.

### 2. Text Formatter
Format user input (e.g., capitalize names).

```javascript
function formatNames(text) {
  return text.replace(/\b\w+\b/g, word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

console.log(formatNames('john doe mary jane')); // 'John Doe Mary Jane'
```

**Use Case**: Standardizes names in a user profile system.

---

## Best Practices

### 1. Use Clear Patterns
Write readable RegEx with comments.

**Example**
```javascript
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Matches email format
```

### 2. Test Thoroughly
Use tools like RegEx101 to validate patterns.

### 3. Escape Special Characters
Handle user input safely.

**Example**
```javascript
const input = 'hello.world';
const pattern = new RegExp(input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
```

### 4. Optimize Performance
Avoid complex patterns that slow execution.

**Example**
```javascript
// ❌ Bad: Catastrophic backtracking
const badPattern = /(a+)+b/;

// ✅ Good: Simplified
const goodPattern = /a+b/;
```

---

## Common Pitfalls and Solutions

### Pitfall: Catastrophic Backtracking
Complex patterns cause performance issues.

**Solution**: Simplify patterns or use possessive quantifiers.

**Example**
```javascript
const pattern = /a++b/; // Possessive quantifier
```

### Pitfall: Unescaped Input
User input in RegEx can break patterns.

**Solution**: Escape special characters.

**Example**
```javascript
const safePattern = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
```

### Pitfall: Overcomplicating Patterns
Complex RegEx is hard to maintain.

**Solution**: Break into smaller patterns or use libraries like `validator.js`.

---

## Summary
Regular Expressions are powerful for pattern matching and text manipulation. They’re essential for validation and formatting in real-world apps.

### Interview-Friendly Tips
- **What is RegEx?** Patterns for matching and manipulating strings.
- **How to validate an email?** Use `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- **What are capturing groups?** Parts of a pattern to extract specific matches.
- **How to avoid performance issues?** Simplify patterns and test with tools like RegEx101.