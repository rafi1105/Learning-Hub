# React Testing - Complete Guide

## Table of Contents
1. [What is React Testing?](#what-is-react-testing)
2. [Unit Testing with Jest](#unit-testing-with-jest)
3. [Integration Testing](#integration-testing)
4. [Testing with React Testing Library](#testing-with-react-testing-library)
5. [Mocking and Testing Async Code](#mocking-and-testing-async-code)
6. [Real-Life Project Examples](#real-life-project-examples)
7. [Best Practices](#best-practices)
8. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is React Testing?

React testing verifies that components behave as expected under various conditions. It includes unit testing (individual components), integration testing (component interactions), and end-to-end testing (full app flows). Jest and React Testing Library (RTL) are standard tools.

### Real-World Analogy
Testing is like a car quality check: unit tests inspect individual parts (components), integration tests ensure parts work together, and end-to-end tests verify the entire car.

### Why Test?
- **Reliability**: Ensures components work as intended.
- **Regression Prevention**: Catches bugs in updates.
- **User-Centric Testing**: RTL focuses on user interactions.

---

## Unit Testing with Jest

Jest is a JavaScript testing framework with built-in assertions and mocking.

**Example: Unit Test**
```jsx
// Button.jsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

// Button.test.js
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with correct label', () => {
  render(<Button label="Click Me" />);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button label="Click Me" onClick={handleClick}