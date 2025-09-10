# React Redux - Complete Guide

## Table of Contents
1. [What is Redux?](#what-is-redux)
2. [Core Concepts: Actions, Reducers, Store](#core-concepts-actions-reducers-store)
3. [Connecting React to Redux](#connecting-react-to-redux)
4. [Advanced Redux Patterns](#advanced-redux-patterns)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is Redux?

Redux is a predictable state management library for JavaScript apps, often used with React. It centralizes application state in a single store, using actions and reducers to manage updates.

### Real-World Analogy
Think of Redux as a bank: the vault (store) holds all funds (state), tellers (reducers) process transactions (actions), and customers (components) interact with the bank.

### Why Redux?
- **Centralized State**: Simplifies state management in large apps.
- **Predictable Updates**: Actions and reducers ensure consistent state changes.
- **Debugging**: Tools like Redux DevTools track state changes.

---

## Core Concepts: Actions, Reducers, Store

### Actions
Actions are payloads describing what happened (e.g., `{ type: 'ADD_TODO', payload: 'Learn Redux' }`).

**Example: Action**
```jsx
const addTodo = (text) => ({
  type: 'ADD_TODO',
  payload: text,
});
```

### Reducers
Reducers are pure functions that update state based on actions.

**Example: Reducer**
```jsx
const initialState = { todos: [] };

function todoReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    default:
      return state;
  }
}
```

### Store
The store holds the state and dispatches actions.

**Example: Store Setup**
```jsx
import { createStore } from 'redux';

const store = createStore(todoReducer);
```

---

## Connecting React to Redux

Use `react-redux` to connect components to the Redux store.

**Example: Connecting Components**
```jsx
import { Provider, useSelector, useDispatch } from 'react-redux';
import { createStore } from 'redux';

const initialState = { todos: [] };

function todoReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    default:
      return state;
  }
}

const store = createStore(todoReducer);

function TodoList() {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    dispatch({ type: 'ADD_TODO', payload: `Todo ${todos.length + 1}` });
  };

  return (
    <div>
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
}
```

---

## Advanced Redux Patterns

### Redux Toolkit
Simplifies Redux with utilities like `createSlice`.

**Example: Redux Toolkit**
```jsx
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

const todoSlice = createSlice({
  name: 'todos',
  initialState: { todos: [] },
  reducers: {
    addTodo(state, action) {
      state.todos.push(action.payload);
    },
  },
});

const store = configureStore({
  reducer: todoSlice.reducer,
});

function TodoList() {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(todoSlice.actions.addTodo(`Todo ${todos.length + 1}`))}>
        Add Todo
      </button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
}
```

### Async Actions with Thunks
Use `redux-thunk` for asynchronous logic.

**Example: Async Thunk**
```jsx
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk('todos/fetch', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  return response.json();
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: { todos: [], status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTodos.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.status = 'idle';
      state.todos = action.payload;
    });
  },
});
```

---

## Real-Life Project Examples

### 1. Todo App with Redux
A todo app with add and toggle functionality.

```jsx
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

const todoSlice = createSlice({
  name: 'todos',
  initialState: { todos: [] },
  reducers: {
    addTodo(state, action) {
      state.todos.push({ id: Date.now(), text: action.payload, completed: false });
    },
    toggleTodo(state, action) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
  },
});

const store = configureStore({ reducer: todoSlice.reducer });

function TodoApp() {
  const [input, setInput] = useState('');
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(todoSlice.actions.addTodo(input));
      setInput('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            onClick={() => dispatch(todoSlice.actions.toggleTodo(todo.id))}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  );
}
```

### 2. Shopping Cart
A shopping cart with Redux-managed state.

```jsx
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem(state, action) {
      state.items.push(action.payload);
    },
    removeItem(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

const store = configureStore({ reducer: cartSlice.reducer });

function Cart() {
  const items = useSelector(state => state.items);
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(cartSlice.actions.addItem({ id: Date.now(), name: 'Product', price: 99 }));
  };

  return (
    <div>
      <button onClick={handleAdd}>Add Item</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => dispatch(cartSlice.actions.removeItem(item.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Cart />
    </Provider>
  );
}
```

---

## Best Practices

### 1. Use Redux Toolkit
Simplifies store setup and reduces boilerplate.

**Example**
```jsx
import { configureStore, createSlice } from '@reduxjs/toolkit';
```

### 2. Keep Actions Simple
Actions should be minimal payloads, not complex logic.

**Example**
```jsx
// ❌ Bad
const complexAction = () => ({ type: 'COMPLEX', payload: compute() });

// ✅ Good
const simpleAction = payload => ({ type: 'SIMPLE', payload });
```

### 3. Normalize State
Use flat, normalized state for easier updates.

**Example**
```jsx
// ❌ Bad: Nested state
{ users: { id: { name: 'John' } } }

// ✅ Good: Normalized state
{ users: [{ id: 1, name: 'John' }] }
```

### 4. Use Selectors
Encapsulate state access logic.

**Example**
```jsx
import { createSelector } from '@reduxjs/toolkit';

const selectTodos = state => state.todos;
const selectCompletedTodos = createSelector([selectTodos], todos =>
  todos.filter(t => t.completed)
);
```

---

## Common Pitfalls and Solutions

### Pitfall: Overusing Redux
Using Redux for all state increases complexity.

**Solution**: Use local state or Context for component-specific data.

### Pitfall: Mutating State
Reducers must be pure functions.

**Solution**
```jsx
// ❌ Bad
state.todos.push(action.payload);

// ✅ Good
return { ...state, todos: [...state.todos, action.payload] };
```

### Pitfall: Missing Middleware
Async logic requires middleware like `redux-thunk`.

**Solution**
```jsx
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

const store = configureStore({
  reducer,
  middleware: [thunk],
});
```

---

## Summary
Redux centralizes state management with actions, reducers, and a store. Redux Toolkit and `react-redux` simplify integration with React.

### Interview-Friendly Tips
- **When to use Redux?** For complex, global state in large apps.
- **Redux Toolkit vs vanilla Redux?** Toolkit reduces boilerplate and simplifies setup.
- **How to handle async actions?** Use `redux-thunk` or `createAsyncThunk`.
- **Why normalize state?** For easier updates and performance.