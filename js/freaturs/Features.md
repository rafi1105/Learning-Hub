# Advanced JavaScript Features

## Table of Contents
1. [Introduction](#introduction)
2. [Beginner Advanced Features](#beginner-advanced-features)
3. [Intermediate Advanced Features](#intermediate-advanced-features)
4. [Advanced JavaScript Features](#advanced-javascript-features)
5. [Real-World Examples](#real-world-examples)
6. [Best Practices](#best-practices)

## Introduction

Advanced JavaScript features encompass the cutting-edge syntax, APIs, and patterns that enable developers to write more efficient, maintainable, and powerful code. This guide covers modern JavaScript features from ES6+ and beyond, including experimental features and browser APIs.

## Beginner Advanced Features

### 1. Template Literals and Tagged Templates (Beginner)

```javascript
// Basic template literals
const name = "Alice";
const age = 30;
const message = `Hello, my name is ${name} and I'm ${age} years old.`;
console.log(message);

// Multi-line strings
const html = `
    <div class="user-card">
        <h2>${name}</h2>
        <p>Age: ${age}</p>
    </div>
`;

// Tagged template literals
function highlight(strings, ...values) {
    return strings.reduce((result, string, i) => {
        const value = values[i] ? `<mark>${values[i]}</mark>` : '';
        return result + string + value;
    }, '');
}

const highlighted = highlight`Hello ${name}, you are ${age} years old`;
console.log(highlighted); // "Hello <mark>Alice</mark>, you are <mark>30</mark> years old"

// CSS-in-JS with tagged templates
function css(strings, ...values) {
    return strings.reduce((result, string, i) => {
        return result + string + (values[i] || '');
    }, '');
}

const primaryColor = '#007bff';
const buttonStyles = css`
    background-color: ${primaryColor};
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    color: white;
`;
```

### 2. Enhanced Object Literals (Beginner)

```javascript
const name = "John";
const age = 25;

// Property shorthand
const person = { name, age };
console.log(person); // { name: "John", age: 25 }

// Method shorthand
const calculator = {
    add(a, b) {
        return a + b;
    },
    
    multiply(a, b) {
        return a * b;
    },
    
    // Computed property names
    [`operation_${Date.now()}`]: 'timestamp'
};

// Dynamic property names
function createObject(key, value) {
    return {
        [key]: value,
        [`${key}_timestamp`]: Date.now()
    };
}

const dynamicObj = createObject('username', 'alice');
console.log(dynamicObj); // { username: 'alice', username_timestamp: 1638360000000 }

// Getter and setter shorthand
const user = {
    _name: '',
    
    get name() {
        return this._name.toUpperCase();
    },
    
    set name(value) {
        this._name = value.trim();
    }
};

user.name = '  alice  ';
console.log(user.name); // "ALICE"
```

### 3. Symbol and Well-known Symbols (Beginner)

```javascript
// Creating symbols
const mySymbol = Symbol('description');
const anotherSymbol = Symbol('description');
console.log(mySymbol === anotherSymbol); // false - symbols are unique

// Using symbols as object keys
const SECRET_KEY = Symbol('secret');
const obj = {
    name: 'Public',
    [SECRET_KEY]: 'This is secret'
};

console.log(obj.name); // "Public"
console.log(obj[SECRET_KEY]); // "This is secret"
console.log(Object.keys(obj)); // ["name"] - symbol keys are not enumerable

// Global symbol registry
const globalSymbol = Symbol.for('shared-key');
const sameSymbol = Symbol.for('shared-key');
console.log(globalSymbol === sameSymbol); // true

// Well-known symbols
class MyArray {
    constructor(items) {
        this.items = items;
    }
    
    // Make it iterable
    *[Symbol.iterator]() {
        for (const item of this.items) {
            yield item;
        }
    }
    
    // Custom toString behavior
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return this.items.length;
        }
        return this.items.join(',');
    }
}

const myArray = new MyArray([1, 2, 3]);
for (const item of myArray) {
    console.log(item); // 1, 2, 3
}
console.log(+myArray); // 3 (length)
console.log(String(myArray)); // "1,2,3"
```

### 4. Proxy and Reflect (Beginner)

```javascript
// Basic proxy for property access
const user = {
    name: 'Alice',
    age: 30
};

const userProxy = new Proxy(user, {
    get(target, property) {
        console.log(`Getting ${property}`);
        return Reflect.get(target, property);
    },
    
    set(target, property, value) {
        console.log(`Setting ${property} to ${value}`);
        if (property === 'age' && value < 0) {
            throw new Error('Age cannot be negative');
        }
        return Reflect.set(target, property, value);
    }
});

console.log(userProxy.name); // "Getting name" then "Alice"
userProxy.age = 31; // "Setting age to 31"

// Virtual properties
const enhancedUser = new Proxy({}, {
    get(target, property) {
        if (property === 'fullName') {
            return `${target.firstName} ${target.lastName}`;
        }
        return Reflect.get(target, property);
    },
    
    set(target, property, value) {
        if (property === 'fullName') {
            const [firstName, lastName] = value.split(' ');
            target.firstName = firstName;
            target.lastName = lastName;
            return true;
        }
        return Reflect.set(target, property, value);
    }
});

enhancedUser.fullName = 'John Doe';
console.log(enhancedUser.firstName); // "John"
console.log(enhancedUser.fullName); // "John Doe"
```

## Intermediate Advanced Features

### 1. Generators and Iterators (Intermediate)

```javascript
// Basic generator
function* numberGenerator() {
    let num = 1;
    while (true) {
        yield num++;
    }
}

const gen = numberGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2

// Generator with parameters
function* fibonacci() {
    let [a, b] = [0, 1];
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

function* take(n, iterable) {
    let count = 0;
    for (const item of iterable) {
        if (count >= n) break;
        yield item;
        count++;
    }
}

// Get first 10 Fibonacci numbers
const first10Fib = [...take(10, fibonacci())];
console.log(first10Fib); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// Async generators
async function* fetchPages(urls) {
    for (const url of urls) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            yield data;
        } catch (error) {
            yield { error: error.message, url };
        }
    }
}

// Usage with async iteration
async function processPages() {
    const urls = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://jsonplaceholder.typicode.com/posts/2'
    ];
    
    for await (const page of fetchPages(urls)) {
        console.log('Received page:', page);
    }
}

// Generator delegation
function* gen1() {
    yield 1;
    yield 2;
}

function* gen2() {
    yield 3;
    yield 4;
}

function* combinedGen() {
    yield* gen1();
    yield* gen2();
    yield 5;
}

console.log([...combinedGen()]); // [1, 2, 3, 4, 5]
```

### 2. WeakMap and WeakSet (Intermediate)

```javascript
// WeakMap for private data
const privateData = new WeakMap();

class User {
    constructor(name, ssn) {
        this.name = name;
        // Store sensitive data in WeakMap
        privateData.set(this, { ssn });
    }
    
    getSSN() {
        const data = privateData.get(this);
        return data ? data.ssn : null;
    }
    
    updateSSN(newSSN) {
        const data = privateData.get(this);
        if (data) {
            data.ssn = newSSN;
        }
    }
}

const user1 = new User('Alice', '123-45-6789');
console.log(user1.name); // "Alice"
console.log(user1.getSSN()); // "123-45-6789"
// user1.ssn is not accessible directly

// WeakSet for tracking objects
const processed = new WeakSet();

function processUser(user) {
    if (processed.has(user)) {
        console.log('User already processed');
        return;
    }
    
    // Process user...
    console.log(`Processing ${user.name}`);
    processed.add(user);
}

processUser(user1); // "Processing Alice"
processUser(user1); // "User already processed"

// Memory cleanup demonstration
function createUsers() {
    const user2 = new User('Bob', '987-65-4321');
    processUser(user2);
    // user2 will be garbage collected when function ends
    // and automatically removed from WeakSet
}

createUsers();
```

### 3. Advanced Array Methods (Intermediate)

```javascript
// Array.from with mapping function
const range = (start, end) => Array.from(
    { length: end - start + 1 }, 
    (_, i) => start + i
);

console.log(range(1, 5)); // [1, 2, 3, 4, 5]

// Create array from iterable with transformation
const doubledFib = Array.from(
    take(5, fibonacci()), 
    x => x * 2
);
console.log(doubledFib); // [0, 2, 2, 4, 6]

// Array.flatMap for flattening and mapping
const sentences = ['Hello world', 'How are you', 'JavaScript rocks'];
const words = sentences.flatMap(sentence => sentence.split(' '));
console.log(words); // ['Hello', 'world', 'How', 'are', 'you', 'JavaScript', 'rocks']

// Advanced array searching
const users = [
    { name: 'Alice', age: 25, active: true },
    { name: 'Bob', age: 30, active: false },
    { name: 'Charlie', age: 35, active: true }
];

// Find with complex conditions
const activeUser = users.find(user => user.active && user.age > 30);
console.log(activeUser); // { name: 'Charlie', age: 35, active: true }

// Group by using reduce
const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
};

const groupedByActive = groupBy(users, 'active');
console.log(groupedByActive);

// Array.reduceRight for right-to-left processing
const numbers = [1, 2, 3, 4, 5];
const result = numbers.reduceRight((acc, curr) => acc - curr);
console.log(result); // ((((5 - 4) - 3) - 2) - 1) = -5
```

### 4. Advanced Destructuring Patterns (Intermediate)

```javascript
// Nested destructuring
const user = {
    name: 'Alice',
    address: {
        street: '123 Main St',
        city: 'Boston',
        coordinates: {
            lat: 42.3601,
            lng: -71.0589
        }
    },
    hobbies: ['reading', 'swimming']
};

const {
    name,
    address: {
        city,
        coordinates: { lat, lng }
    },
    hobbies: [firstHobby, ...otherHobbies]
} = user;

console.log(name, city, lat, lng, firstHobby, otherHobbies);

// Destructuring function parameters
function processUser({ 
    name, 
    age = 0, 
    address: { city } = {}, 
    ...rest 
}) {
    console.log(`${name} from ${city}, age ${age}`);
    console.log('Other data:', rest);
}

processUser({
    name: 'Bob',
    address: { city: 'New York' },
    occupation: 'Developer'
});

// Dynamic destructuring
function extractFields(obj, fields) {
    const result = {};
    for (const field of fields) {
        if (field.includes('.')) {
            // Handle nested fields
            const [parent, child] = field.split('.');
            result[child] = obj[parent] && obj[parent][child];
        } else {
            result[field] = obj[field];
        }
    }
    return result;
}

const extracted = extractFields(user, ['name', 'address.city']);
console.log(extracted); // { name: 'Alice', city: 'Boston' }

// Destructuring with computed property names
const key1 = 'username';
const key2 = 'email';

const data = {
    username: 'alice123',
    email: 'alice@example.com',
    age: 25
};

const { [key1]: username, [key2]: email } = data;
console.log(username, email); // "alice123", "alice@example.com"
```

## Advanced JavaScript Features

### 1. Metaprogramming with Symbols and Proxies (Advanced)

```javascript
// Creating a sophisticated proxy for method interception
class MethodTracker {
    constructor(target) {
        this.callHistory = [];
        
        return new Proxy(target, {
            get(obj, prop) {
                const value = Reflect.get(obj, prop);
                
                if (typeof value === 'function') {
                    return (...args) => {
                        const startTime = performance.now();
                        const result = value.apply(obj, args);
                        const endTime = performance.now();
                        
                        this.callHistory.push({
                            method: prop,
                            args,
                            result,
                            executionTime: endTime - startTime,
                            timestamp: Date.now()
                        });
                        
                        return result;
                    };
                }
                
                return value;
            }
        });
    }
}

class Calculator {
    add(a, b) {
        return a + b;
    }
    
    multiply(a, b) {
        return a * b;
    }
    
    complexOperation(n) {
        // Simulate complex operation
        let result = 0;
        for (let i = 0; i < n; i++) {
            result += Math.sqrt(i);
        }
        return result;
    }
}

const trackedCalc = new MethodTracker(new Calculator());
trackedCalc.add(5, 3);
trackedCalc.multiply(4, 7);
trackedCalc.complexOperation(10000);

console.log('Call history:', trackedCalc.callHistory);

// Advanced symbol usage for metadata
const METADATA = Symbol('metadata');
const VALIDATORS = Symbol('validators');

class Model {
    constructor() {
        this[METADATA] = {};
        this[VALIDATORS] = {};
    }
    
    static field(type, validators = []) {
        return function(target, propertyName) {
            if (!target[METADATA]) target[METADATA] = {};
            if (!target[VALIDATORS]) target[VALIDATORS] = {};
            
            target[METADATA][propertyName] = { type };
            target[VALIDATORS][propertyName] = validators;
            
            // Create getter/setter with validation
            const privateKey = Symbol(`_${propertyName}`);
            
            Object.defineProperty(target, propertyName, {
                get() {
                    return this[privateKey];
                },
                set(value) {
                    // Type checking
                    if (type && typeof value !== type) {
                        throw new Error(`${propertyName} must be of type ${type}`);
                    }
                    
                    // Run validators
                    for (const validator of this[VALIDATORS][propertyName] || []) {
                        if (!validator(value)) {
                            throw new Error(`Validation failed for ${propertyName}`);
                        }
                    }
                    
                    this[privateKey] = value;
                }
            });
        };
    }
    
    getMetadata() {
        return this[METADATA];
    }
}

// Usage with decorators (simulated)
class User extends Model {
    constructor() {
        super();
        
        // Simulate decorator application
        Model.field('string', [v => v.length > 0])(this, 'name');
        Model.field('number', [v => v >= 0])(this, 'age');
        Model.field('string', [v => v.includes('@')])(this, 'email');
    }
}

const user = new User();
user.name = 'Alice';
user.age = 25;
user.email = 'alice@example.com';

console.log('User metadata:', user.getMetadata());
```

### 2. Advanced Async Patterns (Advanced)

```javascript
// Promise-based semaphore for controlling concurrency
class Semaphore {
    constructor(maxConcurrency) {
        this.maxConcurrency = maxConcurrency;
        this.currentConcurrency = 0;
        this.queue = [];
    }
    
    async acquire() {
        return new Promise((resolve) => {
            if (this.currentConcurrency < this.maxConcurrency) {
                this.currentConcurrency++;
                resolve();
            } else {
                this.queue.push(resolve);
            }
        });
    }
    
    release() {
        this.currentConcurrency--;
        if (this.queue.length > 0) {
            this.currentConcurrency++;
            const resolve = this.queue.shift();
            resolve();
        }
    }
    
    async execute(asyncFunction) {
        await this.acquire();
        try {
            return await asyncFunction();
        } finally {
            this.release();
        }
    }
}

// Usage
const semaphore = new Semaphore(3); // Max 3 concurrent operations

async function fetchWithSemaphore(url) {
    return semaphore.execute(async () => {
        console.log(`Fetching ${url}`);
        const response = await fetch(url);
        return response.json();
    });
}

// Advanced async iteration
class AsyncIterableRange {
    constructor(start, end, delay = 100) {
        this.start = start;
        this.end = end;
        this.delay = delay;
    }
    
    async *[Symbol.asyncIterator]() {
        for (let i = this.start; i <= this.end; i++) {
            await new Promise(resolve => setTimeout(resolve, this.delay));
            yield i;
        }
    }
}

// Usage
async function processAsyncRange() {
    for await (const num of new AsyncIterableRange(1, 5, 200)) {
        console.log('Async number:', num);
    }
}

// Async pipeline
class AsyncPipeline {
    constructor(initialValue) {
        this.value = Promise.resolve(initialValue);
    }
    
    pipe(asyncFunction) {
        this.value = this.value.then(asyncFunction);
        return this;
    }
    
    catch(errorHandler) {
        this.value = this.value.catch(errorHandler);
        return this;
    }
    
    async execute() {
        return this.value;
    }
}

// Usage
const pipeline = new AsyncPipeline('hello')
    .pipe(async (str) => str.toUpperCase())
    .pipe(async (str) => `${str} WORLD`)
    .pipe(async (str) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return str.split('').reverse().join('');
    })
    .catch(error => `Error: ${error.message}`);

pipeline.execute().then(result => console.log('Pipeline result:', result));
```

### 3. Memory Management and Performance (Advanced)

```javascript
// Object pool for memory optimization
class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.borrowed = new Set();
        
        // Pre-populate pool
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }
    
    acquire() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }
        
        this.borrowed.add(obj);
        return obj;
    }
    
    release(obj) {
        if (this.borrowed.has(obj)) {
            this.borrowed.delete(obj);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }
    
    getStats() {
        return {
            poolSize: this.pool.length,
            borrowed: this.borrowed.size,
            total: this.pool.length + this.borrowed.size
        };
    }
}

// Example: Vector object pool
const vectorPool = new ObjectPool(
    () => ({ x: 0, y: 0, z: 0 }), // create function
    (vector) => { vector.x = 0; vector.y = 0; vector.z = 0; } // reset function
);

function calculateForce(positions) {
    const forces = [];
    
    for (const position of positions) {
        const force = vectorPool.acquire();
        // Calculate force...
        force.x = Math.random() * 100;
        force.y = Math.random() * 100;
        force.z = Math.random() * 100;
        
        forces.push(force);
    }
    
    // Process forces...
    
    // Release objects back to pool
    forces.forEach(force => vectorPool.release(force));
    
    return forces;
}

// Lazy evaluation for performance
class LazyValue {
    constructor(computeFn) {
        this.computeFn = computeFn;
        this.computed = false;
        this.value = undefined;
    }
    
    get() {
        if (!this.computed) {
            this.value = this.computeFn();
            this.computed = true;
        }
        return this.value;
    }
    
    reset() {
        this.computed = false;
        this.value = undefined;
    }
}

// Memoization with TTL
class MemoizedFunction {
    constructor(fn, ttl = 5000) {
        this.fn = fn;
        this.ttl = ttl;
        this.cache = new Map();
    }
    
    call(...args) {
        const key = JSON.stringify(args);
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            return cached.value;
        }
        
        const result = this.fn(...args);
        this.cache.set(key, {
            value: result,
            timestamp: Date.now()
        });
        
        return result;
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    getCacheSize() {
        return this.cache.size;
    }
}

// Usage
const expensiveOperation = new MemoizedFunction((n) => {
    console.log(`Computing expensive operation for ${n}`);
    let result = 0;
    for (let i = 0; i < n; i++) {
        result += Math.sqrt(i);
    }
    return result;
}, 3000); // 3 second TTL

console.log(expensiveOperation.call(1000)); // Computed
console.log(expensiveOperation.call(1000)); // Cached
```

### 4. Advanced Error Handling (Advanced)

```javascript
// Custom error hierarchy
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, field) {
        super(message, 400);
        this.field = field;
    }
}

class NetworkError extends AppError {
    constructor(message, url) {
        super(message, 503);
        this.url = url;
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
    }
}

// Error boundary for async operations
class AsyncErrorBoundary {
    constructor() {
        this.errorHandlers = new Map();
        this.globalHandler = null;
    }
    
    addHandler(errorType, handler) {
        this.errorHandlers.set(errorType, handler);
    }
    
    setGlobalHandler(handler) {
        this.globalHandler = handler;
    }
    
    async execute(asyncOperation) {
        try {
            return await asyncOperation();
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    handleError(error) {
        const errorType = error.constructor;
        const handler = this.errorHandlers.get(errorType);
        
        if (handler) {
            return handler(error);
        } else if (this.globalHandler) {
            return this.globalHandler(error);
        } else {
            throw error; // Re-throw if no handler found
        }
    }
}

// Usage
const errorBoundary = new AsyncErrorBoundary();

errorBoundary.addHandler(ValidationError, (error) => {
    console.log(`Validation error in field ${error.field}: ${error.message}`);
    return { success: false, field: error.field, message: error.message };
});

errorBoundary.addHandler(NetworkError, (error) => {
    console.log(`Network error for ${error.url}: ${error.message}`);
    return { success: false, retry: true, message: 'Network error, please try again' };
});

errorBoundary.setGlobalHandler((error) => {
    console.error('Unhandled error:', error);
    return { success: false, message: 'An unexpected error occurred' };
});

// Result type for functional error handling
class Result {
    constructor(success, value, error) {
        this.success = success;
        this.value = value;
        this.error = error;
    }
    
    static ok(value) {
        return new Result(true, value, null);
    }
    
    static error(error) {
        return new Result(false, null, error);
    }
    
    map(fn) {
        if (this.success) {
            try {
                return Result.ok(fn(this.value));
            } catch (error) {
                return Result.error(error);
            }
        }
        return this;
    }
    
    flatMap(fn) {
        if (this.success) {
            try {
                return fn(this.value);
            } catch (error) {
                return Result.error(error);
            }
        }
        return this;
    }
    
    mapError(fn) {
        if (!this.success) {
            return Result.error(fn(this.error));
        }
        return this;
    }
    
    unwrap() {
        if (this.success) {
            return this.value;
        }
        throw this.error;
    }
    
    unwrapOr(defaultValue) {
        return this.success ? this.value : defaultValue;
    }
}

// Safe function wrapper
function safe(fn) {
    return (...args) => {
        try {
            const result = fn(...args);
            return Result.ok(result);
        } catch (error) {
            return Result.error(error);
        }
    };
}

// Usage
const safeDivide = safe((a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
});

const result = safeDivide(10, 2)
    .map(x => x * 2)
    .map(x => x + 1);

console.log(result.unwrap()); // 11
```

## Real-World Examples

### 1. Advanced State Management System (Advanced)

```javascript
// Observable state management with proxy
class ObservableState {
    constructor(initialState = {}) {
        this.state = initialState;
        this.observers = new Set();
        this.middlewares = [];
        this.history = [{ ...initialState }];
        this.historyIndex = 0;
        
        return new Proxy(this, {
            get(target, property) {
                if (property in target) {
                    return Reflect.get(target, property);
                }
                return Reflect.get(target.state, property);
            },
            
            set(target, property, value) {
                if (property in target) {
                    return Reflect.set(target, property, value);
                }
                
                const oldValue = target.state[property];
                const newState = { ...target.state, [property]: value };
                
                // Apply middlewares
                const action = { type: 'SET', property, value, oldValue };
                const processedAction = target.middlewares.reduce(
                    (acc, middleware) => middleware(acc, target.state),
                    action
                );
                
                if (processedAction) {
                    target.state[property] = processedAction.value;
                    target.addToHistory(target.state);
                    target.notifyObservers(property, processedAction.value, oldValue);
                }
                
                return true;
            }
        });
    }
    
    subscribe(observer) {
        this.observers.add(observer);
        return () => this.observers.delete(observer);
    }
    
    addMiddleware(middleware) {
        this.middlewares.push(middleware);
    }
    
    notifyObservers(property, newValue, oldValue) {
        this.observers.forEach(observer => {
            observer({ property, newValue, oldValue, state: { ...this.state } });
        });
    }
    
    addToHistory(state) {
        // Remove future history if we're not at the end
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push({ ...state });
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
            this.historyIndex = this.history.length - 1;
        }
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.state = { ...this.history[this.historyIndex] };
            this.notifyObservers('UNDO', this.state, null);
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.state = { ...this.history[this.historyIndex] };
            this.notifyObservers('REDO', this.state, null);
        }
    }
    
    getSnapshot() {
        return { ...this.state };
    }
    
    loadSnapshot(snapshot) {
        this.state = { ...snapshot };
        this.addToHistory(this.state);
        this.notifyObservers('LOAD_SNAPSHOT', this.state, null);
    }
}

// Middlewares
const loggingMiddleware = (action, state) => {
    console.log('State change:', action, 'Current state:', state);
    return action;
};

const validationMiddleware = (action, state) => {
    if (action.property === 'age' && action.value < 0) {
        console.warn('Age cannot be negative');
        return null; // Cancel the action
    }
    return action;
};

// Usage
const appState = new ObservableState({
    user: null,
    theme: 'light',
    counter: 0
});

appState.addMiddleware(loggingMiddleware);
appState.addMiddleware(validationMiddleware);

const unsubscribe = appState.subscribe((change) => {
    console.log('Observer notified:', change);
});

// Test the state management
appState.user = { name: 'Alice', age: 25 };
appState.theme = 'dark';
appState.counter = 10;

console.log('Current state:', appState.getSnapshot());

// Test undo/redo
appState.undo();
console.log('After undo:', appState.getSnapshot());

appState.redo();
console.log('After redo:', appState.getSnapshot());
```

### 2. Advanced Caching System (Advanced)

```javascript
// Multi-tier caching system
class CacheSystem {
    constructor(options = {}) {
        this.options = {
            maxMemorySize: options.maxMemorySize || 100,
            maxDiskSize: options.maxDiskSize || 1000,
            defaultTTL: options.defaultTTL || 300000, // 5 minutes
            ...options
        };
        
        this.memoryCache = new Map();
        this.diskCache = new Map(); // Simulated disk cache
        this.accessTimes = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0
        };
    }
    
    async get(key) {
        // Try memory cache first
        const memoryResult = this.getFromMemory(key);
        if (memoryResult) {
            this.stats.hits++;
            this.updateAccessTime(key);
            return memoryResult.value;
        }
        
        // Try disk cache
        const diskResult = this.getFromDisk(key);
        if (diskResult) {
            this.stats.hits++;
            // Promote to memory cache
            this.setInMemory(key, diskResult.value, diskResult.ttl);
            this.updateAccessTime(key);
            return diskResult.value;
        }
        
        this.stats.misses++;
        return null;
    }
    
    async set(key, value, ttl = this.options.defaultTTL) {
        // Always set in memory cache
        this.setInMemory(key, value, ttl);
        
        // Also set in disk cache
        this.setInDisk(key, value, ttl);
        
        this.updateAccessTime(key);
    }
    
    getFromMemory(key) {
        const entry = this.memoryCache.get(key);
        if (!entry) return null;
        
        if (Date.now() > entry.expiresAt) {
            this.memoryCache.delete(key);
            return null;
        }
        
        return entry;
    }
    
    setInMemory(key, value, ttl) {
        // Check if we need to evict
        if (this.memoryCache.size >= this.options.maxMemorySize && !this.memoryCache.has(key)) {
            this.evictFromMemory();
        }
        
        this.memoryCache.set(key, {
            value,
            ttl,
            expiresAt: Date.now() + ttl,
            createdAt: Date.now()
        });
    }
    
    getFromDisk(key) {
        const entry = this.diskCache.get(key);
        if (!entry) return null;
        
        if (Date.now() > entry.expiresAt) {
            this.diskCache.delete(key);
            return null;
        }
        
        return entry;
    }
    
    setInDisk(key, value, ttl) {
        // Check if we need to evict
        if (this.diskCache.size >= this.options.maxDiskSize && !this.diskCache.has(key)) {
            this.evictFromDisk();
        }
        
        this.diskCache.set(key, {
            value,
            ttl,
            expiresAt: Date.now() + ttl,
            createdAt: Date.now()
        });
    }
    
    evictFromMemory() {
        // LRU eviction
        let lruKey = null;
        let lruTime = Infinity;
        
        for (const [key] of this.memoryCache) {
            const accessTime = this.accessTimes.get(key) || 0;
            if (accessTime < lruTime) {
                lruTime = accessTime;
                lruKey = key;
            }
        }
        
        if (lruKey) {
            this.memoryCache.delete(lruKey);
            this.accessTimes.delete(lruKey);
            this.stats.evictions++;
        }
    }
    
    evictFromDisk() {
        // TTL-based eviction for disk cache
        let shortestTTLKey = null;
        let shortestTTL = Infinity;
        
        for (const [key, entry] of this.diskCache) {
            if (entry.ttl < shortestTTL) {
                shortestTTL = entry.ttl;
                shortestTTLKey = key;
            }
        }
        
        if (shortestTTLKey) {
            this.diskCache.delete(shortestTTLKey);
            this.stats.evictions++;
        }
    }
    
    updateAccessTime(key) {
        this.accessTimes.set(key, Date.now());
    }
    
    clear() {
        this.memoryCache.clear();
        this.diskCache.clear();
        this.accessTimes.clear();
    }
    
    getStats() {
        return {
            ...this.stats,
            memoryCacheSize: this.memoryCache.size,
            diskCacheSize: this.diskCache.size,
            hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
        };
    }
    
    // Advanced cache warming
    async warmCache(keys, valueFactory) {
        const promises = keys.map(async (key) => {
            const exists = await this.get(key);
            if (!exists) {
                const value = await valueFactory(key);
                await this.set(key, value);
            }
        });
        
        return Promise.all(promises);
    }
    
    // Cache invalidation patterns
    invalidatePattern(pattern) {
        const regex = new RegExp(pattern);
        const keysToDelete = [];
        
        for (const key of this.memoryCache.keys()) {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        }
        
        for (const key of this.diskCache.keys()) {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => {
            this.memoryCache.delete(key);
            this.diskCache.delete(key);
            this.accessTimes.delete(key);
        });
        
        return keysToDelete.length;
    }
}

// Usage
const cache = new CacheSystem({
    maxMemorySize: 5,
    maxDiskSize: 20,
    defaultTTL: 10000
});

// Test the cache
async function testCache() {
    // Set some values
    await cache.set('user:1', { name: 'Alice', age: 25 });
    await cache.set('user:2', { name: 'Bob', age: 30 });
    await cache.set('product:1', { name: 'Laptop', price: 1000 });
    
    // Get values
    console.log('User 1:', await cache.get('user:1'));
    console.log('User 2:', await cache.get('user:2'));
    console.log('Missing:', await cache.get('user:999'));
    
    // Cache warming
    await cache.warmCache(['user:3', 'user:4'], async (key) => {
        const id = key.split(':')[1];
        return { name: `User ${id}`, age: 20 + parseInt(id) };
    });
    
    console.log('User 3 (warmed):', await cache.get('user:3'));
    
    // Pattern invalidation
    const invalidated = cache.invalidatePattern('^user:');
    console.log(`Invalidated ${invalidated} user entries`);
    
    console.log('Cache stats:', cache.getStats());
}

testCache();
```

## Best Practices

### 1. Performance Monitoring and Profiling

```javascript
// Performance monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Set();
    }
    
    startTimer(name) {
        this.metrics.set(name, {
            startTime: performance.now(),
            startMemory: this.getMemoryUsage()
        });
    }
    
    endTimer(name) {
        const metric = this.metrics.get(name);
        if (!metric) return null;
        
        const endTime = performance.now();
        const endMemory = this.getMemoryUsage();
        
        const result = {
            name,
            duration: endTime - metric.startTime,
            memoryDelta: endMemory - metric.startMemory,
            timestamp: Date.now()
        };
        
        this.notifyObservers(result);
        this.metrics.delete(name);
        
        return result;
    }
    
    getMemoryUsage() {
        if (performance.memory) {
            return performance.memory.usedJSHeapSize;
        }
        return 0;
    }
    
    addObserver(observer) {
        this.observers.add(observer);
    }
    
    notifyObservers(metric) {
        this.observers.forEach(observer => observer(metric));
    }
    
    // Decorator for automatic performance monitoring
    monitor(name) {
        return (target, propertyName, descriptor) => {
            const originalMethod = descriptor.value;
            
            descriptor.value = function(...args) {
                this.startTimer(name || `${target.constructor.name}.${propertyName}`);
                
                try {
                    const result = originalMethod.apply(this, args);
                    
                    if (result && typeof result.then === 'function') {
                        return result.finally(() => {
                            this.endTimer(name || `${target.constructor.name}.${propertyName}`);
                        });
                    } else {
                        this.endTimer(name || `${target.constructor.name}.${propertyName}`);
                        return result;
                    }
                } catch (error) {
                    this.endTimer(name || `${target.constructor.name}.${propertyName}`);
                    throw error;
                }
            };
            
            return descriptor;
        };
    }
}

const perfMonitor = new PerformanceMonitor();

perfMonitor.addObserver((metric) => {
    if (metric.duration > 100) {
        console.warn(`Slow operation detected: ${metric.name} took ${metric.duration.toFixed(2)}ms`);
    }
});

// Usage
class DataProcessor {
    processLargeDataset(data) {
        perfMonitor.startTimer('processLargeDataset');
        
        // Simulate processing
        const processed = data.map(item => ({
            ...item,
            processed: true,
            timestamp: Date.now()
        }));
        
        perfMonitor.endTimer('processLargeDataset');
        return processed;
    }
}
```

### 2. Error Recovery and Resilience Patterns

```javascript
// Circuit breaker with exponential backoff
class CircuitBreaker {
    constructor(options = {}) {
        this.options = {
            failureThreshold: options.failureThreshold || 5,
            resetTimeout: options.resetTimeout || 30000,
            monitoringPeriod: options.monitoringPeriod || 10000,
            ...options
        };
        
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.successCount = 0;
        this.requestCount = 0;
    }
    
    async execute(operation, fallback = null) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime < this.options.resetTimeout) {
                if (fallback) {
                    return fallback();
                }
                throw new Error('Circuit breaker is OPEN');
            } else {
                this.state = 'HALF_OPEN';
                this.successCount = 0;
            }
        }
        
        this.requestCount++;
        
        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            
            if (fallback) {
                return fallback();
            }
            
            throw error;
        }
    }
    
    onSuccess() {
        this.failureCount = 0;
        
        if (this.state === 'HALF_OPEN') {
            this.successCount++;
            if (this.successCount >= 3) { // Require 3 successes to close
                this.state = 'CLOSED';
            }
        }
    }
    
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        if (this.failureCount >= this.options.failureThreshold) {
            this.state = 'OPEN';
        }
    }
    
    getState() {
        return {
            state: this.state,
            failureCount: this.failureCount,
            requestCount: this.requestCount,
            successRate: this.requestCount > 0 ? 
                ((this.requestCount - this.failureCount) / this.requestCount) : 0
        };
    }
}

// Retry with exponential backoff
class RetryHandler {
    constructor(options = {}) {
        this.options = {
            maxRetries: options.maxRetries || 3,
            baseDelay: options.baseDelay || 1000,
            maxDelay: options.maxDelay || 30000,
            backoffFactor: options.backoffFactor || 2,
            jitter: options.jitter || true,
            ...options
        };
    }
    
    async execute(operation, shouldRetry = this.defaultShouldRetry) {
        let lastError;
        
        for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
            try {
                return await operation(attempt);
            } catch (error) {
                lastError = error;
                
                if (attempt === this.options.maxRetries || !shouldRetry(error, attempt)) {
                    break;
                }
                
                const delay = this.calculateDelay(attempt);
                console.log(`Retry attempt ${attempt + 1} in ${delay}ms`);
                await this.delay(delay);
            }
        }
        
        throw lastError;
    }
    
    calculateDelay(attempt) {
        let delay = this.options.baseDelay * Math.pow(this.options.backoffFactor, attempt);
        delay = Math.min(delay, this.options.maxDelay);
        
        if (this.options.jitter) {
            delay = delay * (0.5 + Math.random() * 0.5);
        }
        
        return Math.floor(delay);
    }
    
    defaultShouldRetry(error, attempt) {
        // Retry on network errors or 5xx status codes
        return error.name === 'NetworkError' || 
               (error.statusCode && error.statusCode >= 500);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Bulkhead pattern for resource isolation
class BulkheadExecutor {
    constructor(pools) {
        this.pools = new Map();
        
        Object.entries(pools).forEach(([name, config]) => {
            this.pools.set(name, {
                maxConcurrency: config.maxConcurrency,
                queue: [],
                running: 0,
                ...config
            });
        });
    }
    
    async execute(poolName, operation) {
        const pool = this.pools.get(poolName);
        if (!pool) {
            throw new Error(`Pool ${poolName} not found`);
        }
        
        return new Promise((resolve, reject) => {
            const task = { operation, resolve, reject };
            
            if (pool.running < pool.maxConcurrency) {
                this.runTask(poolName, task);
            } else {
                pool.queue.push(task);
            }
        });
    }
    
    async runTask(poolName, task) {
        const pool = this.pools.get(poolName);
        pool.running++;
        
        try {
            const result = await task.operation();
            task.resolve(result);
        } catch (error) {
            task.reject(error);
        } finally {
            pool.running--;
            
            // Process next task in queue
            if (pool.queue.length > 0) {
                const nextTask = pool.queue.shift();
                this.runTask(poolName, nextTask);
            }
        }
    }
    
    getPoolStats() {
        const stats = {};
        for (const [name, pool] of this.pools) {
            stats[name] = {
                running: pool.running,
                queued: pool.queue.length,
                maxConcurrency: pool.maxConcurrency
            };
        }
        return stats;
    }
}

// Usage example
const circuitBreaker = new CircuitBreaker({ failureThreshold: 3 });
const retryHandler = new RetryHandler({ maxRetries: 3 });
const bulkhead = new BulkheadExecutor({
    'api-calls': { maxConcurrency: 5 },
    'file-operations': { maxConcurrency: 2 },
    'database': { maxConcurrency: 10 }
});

async function resilientAPICall(url) {
    return circuitBreaker.execute(
        () => retryHandler.execute(
            () => bulkhead.execute('api-calls', () => fetch(url))
        ),
        () => ({ fallback: true, message: 'Service temporarily unavailable' })
    );
}
```

This comprehensive guide covers Advanced JavaScript Features from beginner to expert level, including cutting-edge patterns, performance optimization techniques, and real-world applications that demonstrate the power and flexibility of modern JavaScript.
