# Higher-Order Functions in JavaScript

## Table of Contents
1. [Introduction to Higher-Order Functions](#introduction-to-higher-order-functions)
2. [Beginner Concepts](#beginner-concepts)
3. [Intermediate Concepts](#intermediate-concepts)
4. [Advanced Concepts](#advanced-concepts)
5. [Real-World Examples](#real-world-examples)
6. [Best Practices](#best-practices)

## Introduction to Higher-Order Functions

Higher-Order Functions (HOFs) are functions that either:
- Take other functions as arguments
- Return functions as their result
- Or both

They are fundamental to functional programming and enable powerful, reusable, and composable code patterns in JavaScript.

## Beginner Concepts

### 1. Basic Function Passing (Beginner)

```javascript
// Function that takes another function as argument
function greetUser(name, formatter) {
    return formatter(name);
}

function uppercase(str) {
    return str.toUpperCase();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Using higher-order function
console.log(greetUser("john", uppercase)); // "JOHN"
console.log(greetUser("MARY", capitalize)); // "Mary"
```

### 2. Array.forEach() (Beginner)

```javascript
const numbers = [1, 2, 3, 4, 5];

// Traditional for loop
for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i] * 2);
}

// Using forEach (higher-order function)
numbers.forEach(function(number) {
    console.log(number * 2);
});

// With arrow function
numbers.forEach(number => console.log(number * 2));

// More complex example
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 }
];

users.forEach(user => {
    console.log(`${user.name} is ${user.age} years old`);
});
```

### 3. Array.map() (Beginner)

```javascript
const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Convert to strings
const strings = numbers.map(num => `Number: ${num}`);
console.log(strings); // ["Number: 1", "Number: 2", ...]

// Working with objects
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
];

const userNames = users.map(user => user.name);
console.log(userNames); // ["Alice", "Bob"]

const userInfo = users.map(user => ({
    ...user,
    isAdult: user.age >= 18
}));
console.log(userInfo);
```

### 4. Array.filter() (Beginner)

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter even numbers
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6, 8, 10]

// Filter numbers greater than 5
const bigNumbers = numbers.filter(num => num > 5);
console.log(bigNumbers); // [6, 7, 8, 9, 10]

// Working with objects
const products = [
    { name: "Laptop", price: 1000, category: "Electronics" },
    { name: "Book", price: 20, category: "Education" },
    { name: "Phone", price: 800, category: "Electronics" }
];

const electronics = products.filter(product => product.category === "Electronics");
console.log(electronics);

const expensiveItems = products.filter(product => product.price > 500);
console.log(expensiveItems);
```

### 5. Array.reduce() (Beginner)

```javascript
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((accumulator, current) => {
    return accumulator + current;
}, 0);
console.log(sum); // 15

// Find maximum
const max = numbers.reduce((max, current) => {
    return current > max ? current : max;
}, numbers[0]);
console.log(max); // 5

// Count occurrences
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
const fruitCount = fruits.reduce((count, fruit) => {
    count[fruit] = (count[fruit] || 0) + 1;
    return count;
}, {});
console.log(fruitCount); // { apple: 3, banana: 2, orange: 1 }
```

## Intermediate Concepts

### 1. Creating Custom Higher-Order Functions (Intermediate)

```javascript
// Custom map function
function customMap(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(callback(array[i], i, array));
    }
    return result;
}

// Custom filter function
function customFilter(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            result.push(array[i]);
        }
    }
    return result;
}

// Usage
const numbers = [1, 2, 3, 4, 5];
console.log(customMap(numbers, x => x * 2)); // [2, 4, 6, 8, 10]
console.log(customFilter(numbers, x => x % 2 === 0)); // [2, 4]
```

### 2. Function Composition (Intermediate)

```javascript
// Simple function composition
const add = x => y => x + y;
const multiply = x => y => x * y;
const subtract = x => y => x - y;

// Compose function
const compose = (...functions) => (value) => {
    return functions.reduceRight((acc, fn) => fn(acc), value);
};

const pipe = (...functions) => (value) => {
    return functions.reduce((acc, fn) => fn(acc), value);
};

// Usage
const add5 = add(5);
const multiply3 = multiply(3);
const subtract2 = subtract(2);

const composedFunction = compose(
    subtract2,
    multiply3,
    add5
);

console.log(composedFunction(10)); // ((10 + 5) * 3) - 2 = 43

const pipedFunction = pipe(
    add5,
    multiply3,
    subtract2
);

console.log(pipedFunction(10)); // ((10 + 5) * 3) - 2 = 43
```

### 3. Partial Application and Currying (Intermediate)

```javascript
// Currying
const curriedAdd = a => b => c => a + b + c;
console.log(curriedAdd(1)(2)(3)); // 6

// Partial application
const partial = (fn, ...presetArgs) => {
    return (...laterArgs) => fn(...presetArgs, ...laterArgs);
};

const multiply = (a, b, c) => a * b * c;
const multiplyBy2 = partial(multiply, 2);
const multiplyBy2And3 = partial(multiply, 2, 3);

console.log(multiplyBy2(5, 4)); // 2 * 5 * 4 = 40
console.log(multiplyBy2And3(5)); // 2 * 3 * 5 = 30

// Practical example with event handling
const createEventHandler = (eventType, callback) => {
    return (element) => {
        element.addEventListener(eventType, callback);
    };
};

const addClickHandler = createEventHandler('click', () => console.log('Clicked!'));
// addClickHandler(document.getElementById('myButton'));
```

### 4. Memoization (Intermediate)

```javascript
// Memoization higher-order function
const memoize = (fn) => {
    const cache = new Map();
    
    return (...args) => {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log('Cache hit!');
            return cache.get(key);
        }
        
        console.log('Computing...');
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

// Expensive function
const fibonacci = (n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
};

const memoizedFibonacci = memoize(fibonacci);

console.log(memoizedFibonacci(10)); // Computing... 55
console.log(memoizedFibonacci(10)); // Cache hit! 55

// API call memoization
const memoizedApiCall = memoize(async (url) => {
    const response = await fetch(url);
    return response.json();
});
```

### 5. Debouncing and Throttling (Intermediate)

```javascript
// Debounce function
const debounce = (func, delay) => {
    let timeoutId;
    
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

// Throttle function
const throttle = (func, limit) => {
    let inThrottle;
    
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Usage examples
const expensiveOperation = (query) => {
    console.log(`Searching for: ${query}`);
    // Simulate API call
};

const debouncedSearch = debounce(expensiveOperation, 300);
const throttledScroll = throttle(() => console.log('Scrolling...'), 100);

// debouncedSearch('javascript'); // Will only execute after 300ms of no new calls
// window.addEventListener('scroll', throttledScroll);
```

## Advanced Concepts

### 1. Monads and Functors (Advanced)

```javascript
// Maybe Monad for handling null/undefined
class Maybe {
    constructor(value) {
        this.value = value;
    }
    
    static of(value) {
        return new Maybe(value);
    }
    
    isNothing() {
        return this.value === null || this.value === undefined;
    }
    
    map(fn) {
        if (this.isNothing()) {
            return Maybe.of(null);
        }
        return Maybe.of(fn(this.value));
    }
    
    flatMap(fn) {
        if (this.isNothing()) {
            return Maybe.of(null);
        }
        return fn(this.value);
    }
    
    filter(predicate) {
        if (this.isNothing() || !predicate(this.value)) {
            return Maybe.of(null);
        }
        return this;
    }
    
    getOrElse(defaultValue) {
        return this.isNothing() ? defaultValue : this.value;
    }
}

// Usage
const user = { name: "Alice", address: { street: "123 Main St" } };

const streetName = Maybe.of(user)
    .map(u => u.address)
    .map(addr => addr.street)
    .map(street => street.toUpperCase())
    .getOrElse("No address");

console.log(streetName); // "123 MAIN ST"

// With null value
const nullUser = null;
const nullStreet = Maybe.of(nullUser)
    .map(u => u.address)
    .map(addr => addr.street)
    .getOrElse("No address");

console.log(nullStreet); // "No address"
```

### 2. Function Decorators (Advanced)

```javascript
// Timing decorator
const withTiming = (fn) => {
    return (...args) => {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        console.log(`${fn.name} took ${end - start} milliseconds`);
        return result;
    };
};

// Logging decorator
const withLogging = (fn) => {
    return (...args) => {
        console.log(`Calling ${fn.name} with args:`, args);
        const result = fn(...args);
        console.log(`${fn.name} returned:`, result);
        return result;
    };
};

// Retry decorator
const withRetry = (fn, maxRetries = 3) => {
    return async (...args) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn(...args);
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`Attempt ${i + 1} failed, retrying...`);
            }
        }
    };
};

// Usage
const expensiveCalculation = (n) => {
    let result = 0;
    for (let i = 0; i < n; i++) {
        result += Math.sqrt(i);
    }
    return result;
};

const decoratedFunction = withTiming(withLogging(expensiveCalculation));
decoratedFunction(1000000);
```

### 3. Async Higher-Order Functions (Advanced)

```javascript
// Async map
const asyncMap = async (array, asyncCallback) => {
    const promises = array.map(asyncCallback);
    return Promise.all(promises);
};

// Async filter
const asyncFilter = async (array, asyncPredicate) => {
    const results = await asyncMap(array, asyncPredicate);
    return array.filter((_, index) => results[index]);
};

// Async reduce
const asyncReduce = async (array, asyncCallback, initialValue) => {
    let accumulator = initialValue;
    for (const item of array) {
        accumulator = await asyncCallback(accumulator, item);
    }
    return accumulator;
};

// Usage examples
const urls = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/posts/2',
    'https://jsonplaceholder.typicode.com/posts/3'
];

const fetchData = async (url) => {
    const response = await fetch(url);
    return response.json();
};

// Fetch all posts
// const posts = await asyncMap(urls, fetchData);

// Filter posts with specific criteria
const isLongPost = async (post) => {
    return post.body.length > 100;
};

// const longPosts = await asyncFilter(posts, isLongPost);
```

### 4. Transducers (Advanced)

```javascript
// Transducer implementation
const map = (transform) => (reducer) => (accumulator, input) => {
    return reducer(accumulator, transform(input));
};

const filter = (predicate) => (reducer) => (accumulator, input) => {
    return predicate(input) ? reducer(accumulator, input) : accumulator;
};

const take = (n) => (reducer) => {
    let taken = 0;
    return (accumulator, input) => {
        if (taken < n) {
            taken++;
            return reducer(accumulator, input);
        }
        return accumulator;
    };
};

// Compose transducers
const compose = (...functions) => (x) => functions.reduceRight((acc, fn) => fn(acc), x);

// Transduce function
const transduce = (transducer, reducer, initial, collection) => {
    const transformedReducer = transducer(reducer);
    return collection.reduce(transformedReducer, initial);
};

// Usage
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const transducer = compose(
    filter(x => x % 2 === 0),  // Filter even numbers
    map(x => x * 2),           // Double them
    take(3)                    // Take first 3
);

const result = transduce(
    transducer,
    (acc, val) => [...acc, val],  // Array reducer
    [],
    numbers
);

console.log(result); // [4, 8, 12]
```

## Real-World Examples

### 1. Data Pipeline (Advanced)

```javascript
class DataPipeline {
    constructor(data) {
        this.data = data;
    }
    
    static from(data) {
        return new DataPipeline(data);
    }
    
    map(transformer) {
        return new DataPipeline(this.data.map(transformer));
    }
    
    filter(predicate) {
        return new DataPipeline(this.data.filter(predicate));
    }
    
    reduce(reducer, initialValue) {
        return this.data.reduce(reducer, initialValue);
    }
    
    sort(compareFn) {
        return new DataPipeline([...this.data].sort(compareFn));
    }
    
    groupBy(keySelector) {
        const groups = this.data.reduce((acc, item) => {
            const key = keySelector(item);
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
        return groups;
    }
    
    take(n) {
        return new DataPipeline(this.data.slice(0, n));
    }
    
    toArray() {
        return this.data;
    }
}

// Usage with sales data
const salesData = [
    { product: "Laptop", category: "Electronics", price: 1200, quantity: 2 },
    { product: "Book", category: "Education", price: 25, quantity: 5 },
    { product: "Phone", category: "Electronics", price: 800, quantity: 1 },
    { product: "Desk", category: "Furniture", price: 400, quantity: 1 },
    { product: "Chair", category: "Furniture", price: 150, quantity: 4 }
];

const highValueElectronics = DataPipeline
    .from(salesData)
    .filter(item => item.category === "Electronics")
    .map(item => ({
        ...item,
        total: item.price * item.quantity
    }))
    .filter(item => item.total > 500)
    .sort((a, b) => b.total - a.total)
    .toArray();

console.log(highValueElectronics);

const categoryTotals = DataPipeline
    .from(salesData)
    .groupBy(item => item.category);

console.log(categoryTotals);
```

### 2. Event System with Higher-Order Functions (Advanced)

```javascript
class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    
    on(event, listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(listener);
        return this;
    }
    
    off(event, listener) {
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event);
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
        return this;
    }
    
    emit(event, ...args) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(listener => {
                listener(...args);
            });
        }
        return this;
    }
    
    // Higher-order function for creating middleware
    use(middleware) {
        return (event, ...args) => {
            middleware(event, ...args, () => this.emit(event, ...args));
        };
    }
    
    // Transform events
    mapEvent(fromEvent, toEvent, transformer = x => x) {
        this.on(fromEvent, (...args) => {
            const transformedArgs = transformer(...args);
            this.emit(toEvent, transformedArgs);
        });
        return this;
    }
    
    // Filter events
    filterEvent(event, predicate) {
        const originalEmit = this.emit.bind(this);
        this.emit = (eventName, ...args) => {
            if (eventName === event && !predicate(...args)) {
                return this;
            }
            return originalEmit(eventName, ...args);
        };
        return this;
    }
    
    // Debounce events
    debounceEvent(event, delay) {
        let timeoutId;
        const originalEmit = this.emit.bind(this);
        
        this.emit = (eventName, ...args) => {
            if (eventName === event) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    originalEmit(eventName, ...args);
                }, delay);
                return this;
            }
            return originalEmit(eventName, ...args);
        };
        return this;
    }
}

// Usage
const emitter = new EventEmitter();

// Logging middleware
const loggingMiddleware = (event, data, next) => {
    console.log(`Event: ${event}, Data:`, data);
    next();
};

const withLogging = emitter.use(loggingMiddleware);

emitter.on('user-login', (user) => {
    console.log(`Welcome ${user.name}!`);
});

emitter.mapEvent('user-registered', 'user-login', (userData) => ({
    ...userData,
    isNewUser: true
}));

withLogging('user-registered', { name: 'Alice', email: 'alice@example.com' });
```

### 3. Functional Validation System (Advanced)

```javascript
// Validation functions
const required = (field) => (value) => {
    return value !== null && value !== undefined && value !== '' 
        ? { valid: true }
        : { valid: false, error: `${field} is required` };
};

const minLength = (field, min) => (value) => {
    return value && value.length >= min
        ? { valid: true }
        : { valid: false, error: `${field} must be at least ${min} characters` };
};

const email = (field) => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value)
        ? { valid: true }
        : { valid: false, error: `${field} must be a valid email` };
};

const numeric = (field) => (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value))
        ? { valid: true }
        : { valid: false, error: `${field} must be a number` };
};

// Validator composer
const validate = (validations) => (data) => {
    const results = {};
    const errors = {};
    
    Object.keys(validations).forEach(field => {
        const fieldValidations = validations[field];
        const value = data[field];
        
        for (const validation of fieldValidations) {
            const result = validation(value);
            if (!result.valid) {
                if (!errors[field]) errors[field] = [];
                errors[field].push(result.error);
                break;
            }
        }
        
        if (!errors[field]) {
            results[field] = { valid: true };
        }
    });
    
    return {
        valid: Object.keys(errors).length === 0,
        errors,
        results
    };
};

// Usage
const userValidation = validate({
    name: [required('Name'), minLength('Name', 2)],
    email: [required('Email'), email('Email')],
    age: [required('Age'), numeric('Age')]
});

const userData = {
    name: 'Alice',
    email: 'alice@example.com',
    age: '25'
};

const validationResult = userValidation(userData);
console.log(validationResult);

// Async validation
const asyncValidate = (validations) => async (data) => {
    const results = {};
    const errors = {};
    
    for (const field of Object.keys(validations)) {
        const fieldValidations = validations[field];
        const value = data[field];
        
        for (const validation of fieldValidations) {
            const result = await validation(value);
            if (!result.valid) {
                if (!errors[field]) errors[field] = [];
                errors[field].push(result.error);
                break;
            }
        }
        
        if (!errors[field]) {
            results[field] = { valid: true };
        }
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors,
        results
    };
};
```

## Best Practices

### 1. Pure Functions and Immutability

```javascript
// Bad: Mutating input
const badAddElement = (array, element) => {
    array.push(element); // Mutates original array
    return array;
};

// Good: Pure function
const addElement = (array, element) => {
    return [...array, element]; // Returns new array
};

// Working with objects
const updateUser = (user, updates) => ({
    ...user,
    ...updates,
    updatedAt: new Date()
});

const users = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 }
];

const updatedUsers = users.map(user => 
    user.id === 1 
        ? updateUser(user, { age: 26 })
        : user
);
```

### 2. Error Handling in Higher-Order Functions

```javascript
// Safe higher-order function wrapper
const safeExecute = (fn) => {
    return (...args) => {
        try {
            return { success: true, data: fn(...args) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };
};

// Safe array operations
const safeMap = (array, callback) => {
    const results = [];
    const errors = [];
    
    array.forEach((item, index) => {
        try {
            results.push(callback(item, index));
        } catch (error) {
            errors.push({ index, error: error.message });
            results.push(null);
        }
    });
    
    return { results, errors };
};

// Usage
const riskyOperation = (x) => {
    if (x < 0) throw new Error('Negative numbers not allowed');
    return Math.sqrt(x);
};

const safeRiskyOperation = safeExecute(riskyOperation);
console.log(safeRiskyOperation(4)); // { success: true, data: 2 }
console.log(safeRiskyOperation(-1)); // { success: false, error: "Negative numbers not allowed" }

const numbers = [4, 9, -1, 16];
const result = safeMap(numbers, riskyOperation);
console.log(result);
```

### 3. Performance Considerations

```javascript
// Lazy evaluation
class LazySequence {
    constructor(iterable) {
        this.iterable = iterable;
    }
    
    *[Symbol.iterator]() {
        yield* this.iterable;
    }
    
    map(fn) {
        const iterable = this.iterable;
        return new LazySequence(function* () {
            for (const item of iterable) {
                yield fn(item);
            }
        }());
    }
    
    filter(predicate) {
        const iterable = this.iterable;
        return new LazySequence(function* () {
            for (const item of iterable) {
                if (predicate(item)) {
                    yield item;
                }
            }
        }());
    }
    
    take(n) {
        const iterable = this.iterable;
        return new LazySequence(function* () {
            let count = 0;
            for (const item of iterable) {
                if (count >= n) break;
                yield item;
                count++;
            }
        }());
    }
    
    toArray() {
        return Array.from(this.iterable);
    }
}

// Usage - only processes needed items
const largeArray = Array.from({ length: 1000000 }, (_, i) => i);
const result = new LazySequence(largeArray)
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .take(5)
    .toArray();

console.log(result); // [0, 4, 8, 12, 16]
```

This comprehensive guide covers Higher-Order Functions in JavaScript from beginner to advanced levels, providing practical examples and real-world applications that demonstrate the power and flexibility of functional programming concepts.
