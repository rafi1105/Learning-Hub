# ES6+ Modern JavaScript

## Table of Contents
1. [Introduction to ES6+](#introduction-to-es6)
2. [Beginner ES6+ Features](#beginner-es6-features)
3. [Intermediate ES6+ Features](#intermediate-es6-features)
4. [Advanced ES6+ Features](#advanced-es6-features)
5. [Real-World Examples](#real-world-examples)
6. [Best Practices](#best-practices)

## Introduction to ES6+

ES6 (ECMAScript 2015) and subsequent versions introduced revolutionary features that transformed JavaScript development. This guide covers modern JavaScript features from ES6 through the latest ECMAScript specifications, enabling you to write cleaner, more efficient, and more maintainable code.

### Key Evolution Points:
- **ES6 (2015)**: Classes, modules, arrow functions, destructuring
- **ES2016**: Array.includes(), exponentiation operator
- **ES2017**: Async/await, Object.entries/values
- **ES2018**: Rest/spread for objects, async iteration
- **ES2019**: Array.flat(), Object.fromEntries
- **ES2020**: Optional chaining, nullish coalescing
- **ES2021+**: Logical assignment, private fields

## Beginner ES6+ Features

### 1. Let, Const, and Block Scope (Beginner)

```javascript
// var vs let vs const
console.log('=== Variable Declarations ===');

// var - function scoped, can be redeclared
var oldWay = 'function scoped';
var oldWay = 'can be redeclared'; // No error

if (true) {
    var oldWay = 'hoisted to function scope';
}
console.log(oldWay); // "hoisted to function scope"

// let - block scoped, cannot be redeclared
let modernWay = 'block scoped';
// let modernWay = 'error'; // SyntaxError: Identifier already declared

if (true) {
    let modernWay = 'different scope';
    console.log(modernWay); // "different scope"
}
console.log(modernWay); // "block scoped"

// const - block scoped, cannot be reassigned
const CONSTANT = 'cannot change';
// CONSTANT = 'error'; // TypeError: Assignment to constant variable

// const with objects/arrays - contents can be modified
const user = { name: 'Alice' };
user.name = 'Bob'; // This is allowed
user.age = 25; // This is allowed
console.log(user); // { name: 'Bob', age: 25 }

const numbers = [1, 2, 3];
numbers.push(4); // This is allowed
console.log(numbers); // [1, 2, 3, 4]

// Temporal Dead Zone
console.log('=== Temporal Dead Zone ===');
try {
    console.log(notYetDeclared); // ReferenceError
    let notYetDeclared = 'now declared';
} catch (error) {
    console.log('Error:', error.message);
}
```

### 2. Arrow Functions (Beginner)

```javascript
// Traditional function vs arrow function
console.log('=== Arrow Functions ===');

// Traditional function
function traditionalAdd(a, b) {
    return a + b;
}

// Arrow function
const arrowAdd = (a, b) => a + b;

// Multiple variations
const singleParam = x => x * 2; // No parentheses needed for single parameter
const noParams = () => 'Hello World';
const multiLine = (x, y) => {
    const result = x + y;
    return result * 2;
};

console.log(traditionalAdd(5, 3)); // 8
console.log(arrowAdd(5, 3)); // 8
console.log(singleParam(4)); // 8
console.log(noParams()); // "Hello World"
console.log(multiLine(2, 3)); // 10

// this binding differences
console.log('=== this Binding ===');

const obj = {
    name: 'Alice',
    
    traditionalMethod: function() {
        console.log('Traditional:', this.name); // 'Alice'
        
        setTimeout(function() {
            console.log('Traditional timeout:', this.name); // undefined (this refers to global)
        }, 100);
        
        setTimeout(() => {
            console.log('Arrow timeout:', this.name); // 'Alice' (this inherited from outer scope)
        }, 100);
    },
    
    arrowMethod: () => {
        console.log('Arrow method:', this.name); // undefined (no this binding)
    }
};

obj.traditionalMethod();
obj.arrowMethod();

// Array methods with arrow functions
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log('Doubled:', doubled); // [2, 4, 6, 8, 10]
console.log('Evens:', evens); // [2, 4]
console.log('Sum:', sum); // 15
```

### 3. Template Literals (Beginner)

```javascript
console.log('=== Template Literals ===');

const name = 'Alice';
const age = 30;
const city = 'New York';

// Old way
const oldMessage = 'Hello, my name is ' + name + ' and I am ' + age + ' years old.';

// Template literal way
const newMessage = `Hello, my name is ${name} and I am ${age} years old.`;

console.log(oldMessage);
console.log(newMessage);

// Multi-line strings
const multiLine = `
    This is a multi-line string.
    It preserves line breaks and indentation.
    Name: ${name}
    Age: ${age}
    City: ${city}
`;
console.log(multiLine);

// Expression evaluation
const a = 10;
const b = 20;
console.log(`The sum of ${a} and ${b} is ${a + b}`); // "The sum of 10 and 20 is 30"

// Function calls in templates
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

const price = 99.99;
console.log(`The price is ${formatCurrency(price)}`); // "The price is $99.99"

// Conditional expressions
const isLoggedIn = true;
const greeting = `Welcome ${isLoggedIn ? name : 'Guest'}!`;
console.log(greeting); // "Welcome Alice!"

// Tagged template literals
function highlight(strings, ...expressions) {
    return strings.reduce((result, string, i) => {
        const expression = expressions[i] ? `<strong>${expressions[i]}</strong>` : '';
        return result + string + expression;
    }, '');
}

const highlighted = highlight`Hello ${name}, you are ${age} years old!`;
console.log(highlighted); // "Hello <strong>Alice</strong>, you are <strong>30</strong> years old!"
```

### 4. Destructuring Assignment (Beginner)

```javascript
console.log('=== Destructuring Assignment ===');

// Array destructuring
const colors = ['red', 'green', 'blue', 'yellow'];

const [first, second, third, ...rest] = colors;
console.log(first); // "red"
console.log(second); // "green" 
console.log(third); // "blue"
console.log(rest); // ["yellow"]

// Skipping elements
const [primary, , tertiary] = colors;
console.log(primary); // "red"
console.log(tertiary); // "blue"

// Default values
const [r, g, b = 'defaultBlue'] = ['red', 'green'];
console.log(r, g, b); // "red" "green" "defaultBlue"

// Object destructuring
const user = {
    name: 'Alice',
    age: 30,
    email: 'alice@example.com',
    address: {
        street: '123 Main St',
        city: 'Boston',
        zipCode: '02101'
    }
};

const { name, age, email } = user;
console.log(name, age, email); // "Alice" 30 "alice@example.com"

// Renaming variables
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // "Alice" 30

// Default values
const { name: fullName, profession = 'Unknown' } = user;
console.log(fullName, profession); // "Alice" "Unknown"

// Nested destructuring
const { address: { city, zipCode } } = user;
console.log(city, zipCode); // "Boston" "02101"

// Function parameter destructuring
function greetUser({ name, age = 0 }) {
    return `Hello ${name}, you are ${age} years old.`;
}

console.log(greetUser({ name: 'Bob', age: 25 })); // "Hello Bob, you are 25 years old."
console.log(greetUser({ name: 'Charlie' })); // "Hello Charlie, you are 0 years old."

// Mixed destructuring
function processOrder([id, quantity], { name, price }) {
    return {
        orderId: id,
        productName: name,
        quantity,
        total: quantity * price
    };
}

const orderData = [12345, 2];
const product = { name: 'Laptop', price: 999.99 };
const order = processOrder(orderData, product);
console.log(order);
```

### 5. Default Parameters (Beginner)

```javascript
console.log('=== Default Parameters ===');

// Traditional way
function oldGreet(name, greeting) {
    greeting = greeting || 'Hello';
    return greeting + ', ' + name + '!';
}

// ES6 way
function newGreet(name, greeting = 'Hello') {
    return `${greeting}, ${name}!`;
}

console.log(oldGreet('Alice')); // "Hello, Alice!"
console.log(newGreet('Alice')); // "Hello, Alice!"
console.log(newGreet('Bob', 'Hi')); // "Hi, Bob!"

// Default parameters can use other parameters
function createUser(name, role = 'user', active = true, id = Math.random()) {
    return { name, role, active, id };
}

console.log(createUser('Alice'));
console.log(createUser('Bob', 'admin'));

// Default parameters with destructuring
function configureApp({
    theme = 'light',
    language = 'en',
    notifications = true,
    timeout = 5000
} = {}) {
    return { theme, language, notifications, timeout };
}

console.log(configureApp()); // All defaults
console.log(configureApp({ theme: 'dark', language: 'es' })); // Some custom values

// Function expressions as defaults
function processData(data, formatter = JSON.stringify) {
    return formatter(data);
}

console.log(processData({ name: 'Alice' })); // '{"name":"Alice"}'
console.log(processData({ name: 'Bob' }, data => data.name)); // "Bob"

// Parameters can reference earlier parameters
function buildUrl(protocol = 'https', domain, path = '/', port = protocol === 'https' ? 443 : 80) {
    return `${protocol}://${domain}:${port}${path}`;
}

console.log(buildUrl(undefined, 'example.com')); // "https://example.com:443/"
console.log(buildUrl('http', 'example.com', '/api')); // "http://example.com:80/api"
```

## Intermediate ES6+ Features

### 1. Classes and Inheritance (Intermediate)

```javascript
console.log('=== Classes and Inheritance ===');

// Basic class definition
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    // Method
    greet() {
        return `Hello, I'm ${this.name} and I'm ${this.age} years old.`;
    }
    
    // Getter
    get info() {
        return `${this.name} (${this.age})`;
    }
    
    // Setter
    set fullName(name) {
        this.name = name;
    }
    
    // Static method
    static createFromString(str) {
        const [name, age] = str.split(',');
        return new Person(name.trim(), parseInt(age.trim()));
    }
}

const person1 = new Person('Alice', 30);
console.log(person1.greet()); // "Hello, I'm Alice and I'm 30 years old."
console.log(person1.info); // "Alice (30)"

person1.fullName = 'Alice Johnson';
console.log(person1.name); // "Alice Johnson"

const person2 = Person.createFromString('Bob, 25');
console.log(person2.greet()); // "Hello, I'm Bob and I'm 25 years old."

// Inheritance
class Employee extends Person {
    constructor(name, age, jobTitle, salary) {
        super(name, age); // Call parent constructor
        this.jobTitle = jobTitle;
        this.salary = salary;
    }
    
    // Override parent method
    greet() {
        return `${super.greet()} I work as a ${this.jobTitle}.`;
    }
    
    // New method
    getAnnualSalary() {
        return this.salary * 12;
    }
    
    // Static method
    static createIntern(name, age) {
        return new Employee(name, age, 'Intern', 2000);
    }
}

const employee = new Employee('Charlie', 28, 'Developer', 5000);
console.log(employee.greet()); // "Hello, I'm Charlie and I'm 28 years old. I work as a Developer."
console.log(`Annual salary: $${employee.getAnnualSalary()}`); // "Annual salary: $60000"

const intern = Employee.createIntern('Diana', 22);
console.log(intern.greet());

// Private fields (ES2022)
class BankAccount {
    #balance = 0; // Private field
    #accountNumber;
    
    constructor(accountNumber, initialBalance = 0) {
        this.#accountNumber = accountNumber;
        this.#balance = initialBalance;
    }
    
    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
            return this.#balance;
        }
        throw new Error('Amount must be positive');
    }
    
    withdraw(amount) {
        if (amount > 0 && amount <= this.#balance) {
            this.#balance -= amount;
            return this.#balance;
        }
        throw new Error('Invalid withdrawal amount');
    }
    
    get balance() {
        return this.#balance;
    }
    
    // Private method
    #validateTransaction(amount) {
        return amount > 0;
    }
}

const account = new BankAccount('123456', 1000);
console.log(account.balance); // 1000
account.deposit(500);
console.log(account.balance); // 1500
// console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

### 2. Modules (Import/Export) (Intermediate)

```javascript
// ES6 Modules - Note: This would typically be in separate files

// === math.js (example module) ===
/*
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

export default function subtract(a, b) {
    return a - b;
}

export class Calculator {
    static divide(a, b) {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }
}
*/

// === main.js (importing module) ===
/*
// Named imports
import { add, multiply, PI } from './math.js';

// Default import
import subtract from './math.js';

// Import with alias
import { Calculator as Calc } from './math.js';

// Import everything
import * as MathUtils from './math.js';

console.log(add(5, 3)); // 8
console.log(multiply(4, 2)); // 8
console.log(subtract(10, 3)); // 7
console.log(PI); // 3.14159
console.log(Calc.divide(10, 2)); // 5

console.log(MathUtils.add(1, 2)); // 3
console.log(MathUtils.default(5, 1)); // 4 (default export)
*/

// Dynamic imports (ES2020)
async function loadMathModule() {
    try {
        const mathModule = await import('./math.js');
        console.log(mathModule.add(5, 3));
    } catch (error) {
        console.error('Failed to load module:', error);
    }
}

// Conditional imports
async function loadFeature(featureName) {
    let module;
    
    switch (featureName) {
        case 'chart':
            module = await import('./chart.js');
            break;
        case 'table':
            module = await import('./table.js');
            break;
        default:
            throw new Error(`Unknown feature: ${featureName}`);
    }
    
    return module;
}

// Re-exports
/*
// === utils.js ===
export { add, multiply } from './math.js';
export { formatDate } from './date.js';
export { validateEmail } from './validation.js';
*/

console.log('=== Module Examples ===');
console.log('(Module imports would work in actual separate files)');
```

### 3. Spread and Rest Operators (Intermediate)

```javascript
console.log('=== Spread and Rest Operators ===');

// Rest operator in function parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15
console.log(sum(10, 20)); // 30

// Rest with other parameters
function greetAll(greeting, ...names) {
    return names.map(name => `${greeting}, ${name}!`);
}

console.log(greetAll('Hello', 'Alice', 'Bob', 'Charlie'));
// ["Hello, Alice!", "Hello, Bob!", "Hello, Charlie!"]

// Spread operator with arrays
const numbers1 = [1, 2, 3];
const numbers2 = [4, 5, 6];

// Combine arrays
const combined = [...numbers1, ...numbers2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Copy array
const copied = [...numbers1];
console.log(copied); // [1, 2, 3]

// Add elements
const extended = [0, ...numbers1, 4];
console.log(extended); // [0, 1, 2, 3, 4]

// Spread in function calls
function multiply(a, b, c) {
    return a * b * c;
}

const args = [2, 3, 4];
console.log(multiply(...args)); // 24

// Spread with objects (ES2018)
const person = { name: 'Alice', age: 30 };
const employee = { jobTitle: 'Developer', salary: 5000 };

// Combine objects
const employeeInfo = { ...person, ...employee };
console.log(employeeInfo); // { name: 'Alice', age: 30, jobTitle: 'Developer', salary: 5000 }

// Override properties
const updatedPerson = { ...person, age: 31, city: 'Boston' };
console.log(updatedPerson); // { name: 'Alice', age: 31, city: 'Boston' }

// Nested object spread (shallow copy)
const config = {
    api: { url: 'https://api.example.com', timeout: 5000 },
    ui: { theme: 'dark', language: 'en' }
};

const newConfig = {
    ...config,
    api: { ...config.api, timeout: 10000 }
};
console.log(newConfig);

// Rest in destructuring
const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
const [primary, secondary, ...otherColors] = colors;
console.log(primary); // "red"
console.log(secondary); // "green"
console.log(otherColors); // ["blue", "yellow", "purple"]

// Object rest in destructuring
const user = { name: 'Alice', age: 30, email: 'alice@example.com', city: 'Boston' };
const { name, age, ...contactInfo } = user;
console.log(name); // "Alice"
console.log(age); // 30
console.log(contactInfo); // { email: 'alice@example.com', city: 'Boston' }
```

### 4. Enhanced Object Literals (Intermediate)

```javascript
console.log('=== Enhanced Object Literals ===');

const name = 'Alice';
const age = 30;
const city = 'Boston';

// Property shorthand
const person = { name, age, city };
console.log(person); // { name: 'Alice', age: 30, city: 'Boston' }

// Method shorthand
const calculator = {
    // Old way: add: function(a, b) { return a + b; }
    add(a, b) {
        return a + b;
    },
    
    subtract(a, b) {
        return a - b;
    },
    
    // Arrow functions in objects (be careful with 'this')
    multiply: (a, b) => a * b,
    
    // Async methods
    async fetchData(url) {
        const response = await fetch(url);
        return response.json();
    }
};

console.log(calculator.add(5, 3)); // 8
console.log(calculator.multiply(4, 2)); // 8

// Computed property names
const property = 'dynamicKey';
const value = 'dynamicValue';

const obj = {
    staticKey: 'staticValue',
    [property]: value,
    [`${property}_2`]: 'another value',
    [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
        yield 3;
    }
};

console.log(obj.staticKey); // "staticValue"
console.log(obj.dynamicKey); // "dynamicValue"
console.log(obj.dynamicKey_2); // "another value"

// Iterate over the object using Symbol.iterator
for (const value of obj) {
    console.log(value); // 1, 2, 3
}

// Dynamic method names
const methodName = 'process';
const api = {
    [`${methodName}Data`](data) {
        return data.map(item => item.toUpperCase());
    },
    
    [`${methodName}Error`](error) {
        console.error('Processing error:', error);
    }
};

console.log(api.processData(['hello', 'world'])); // ["HELLO", "WORLD"]

// Getters and setters
const temperature = {
    _celsius: 0,
    
    get celsius() {
        return this._celsius;
    },
    
    set celsius(value) {
        this._celsius = value;
    },
    
    get fahrenheit() {
        return (this._celsius * 9/5) + 32;
    },
    
    set fahrenheit(value) {
        this._celsius = (value - 32) * 5/9;
    }
};

temperature.celsius = 25;
console.log(temperature.fahrenheit); // 77

temperature.fahrenheit = 100;
console.log(temperature.celsius); // 37.77777777777778

// Object with symbols
const SECRET = Symbol('secret');
const PUBLIC = Symbol('public');

const secureObject = {
    publicData: 'everyone can see this',
    [SECRET]: 'this is hidden',
    [PUBLIC]: 'this is also accessible but not obvious',
    
    getSecret() {
        return this[SECRET];
    }
};

console.log(secureObject.publicData); // "everyone can see this"
console.log(secureObject.getSecret()); // "this is hidden"
console.log(Object.keys(secureObject)); // ["publicData", "getSecret"] - symbols not included
```

## Advanced ES6+ Features

### 1. Generators and Iterators (Advanced)

```javascript
console.log('=== Generators and Iterators ===');

// Basic generator
function* simpleGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Infinite generator
function* fibonacci() {
    let [a, b] = [0, 1];
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

// Generator with parameters and return
function* parameterizedGenerator(max) {
    let count = 0;
    while (count < max) {
        const reset = yield count;
        if (reset) {
            count = 0;
        } else {
            count++;
        }
    }
    return 'Generator finished';
}

const paramGen = parameterizedGenerator(3);
console.log(paramGen.next()); // { value: 0, done: false }
console.log(paramGen.next()); // { value: 1, done: false }
console.log(paramGen.next(true)); // { value: 0, done: false } - reset
console.log(paramGen.next()); // { value: 1, done: false }

// Generator delegation
function* gen1() {
    yield 1;
    yield 2;
}

function* gen2() {
    yield 3;
    yield 4;
}

function* combinedGenerator() {
    yield* gen1();
    yield* gen2();
    yield 5;
}

console.log([...combinedGenerator()]); // [1, 2, 3, 4, 5]

// Custom iterable class
class Range {
    constructor(start, end, step = 1) {
        this.start = start;
        this.end = end;
        this.step = step;
    }
    
    *[Symbol.iterator]() {
        for (let i = this.start; i < this.end; i += this.step) {
            yield i;
        }
    }
}

const range = new Range(1, 10, 2);
console.log([...range]); // [1, 3, 5, 7, 9]

// Generator for tree traversal
class TreeNode {
    constructor(value, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
    
    *inorderTraversal() {
        if (this.left) yield* this.left.inorderTraversal();
        yield this.value;
        if (this.right) yield* this.right.inorderTraversal();
    }
}

const tree = new TreeNode(4,
    new TreeNode(2, new TreeNode(1), new TreeNode(3)),
    new TreeNode(6, new TreeNode(5), new TreeNode(7))
);

console.log('Inorder traversal:', [...tree.inorderTraversal()]); // [1, 2, 3, 4, 5, 6, 7]

// Async generators (ES2018)
async function* asyncGenerator() {
    let i = 0;
    while (i < 3) {
        await new Promise(resolve => setTimeout(resolve, 100));
        yield i++;
    }
}

async function processAsyncGenerator() {
    for await (const value of asyncGenerator()) {
        console.log('Async value:', value);
    }
}

processAsyncGenerator();
```

### 2. Proxies and Reflection (Advanced)

```javascript
console.log('=== Proxies and Reflection ===');

// Basic proxy
const target = { name: 'Alice', age: 30 };

const handler = {
    get(obj, prop) {
        console.log(`Getting property: ${prop}`);
        return Reflect.get(obj, prop);
    },
    
    set(obj, prop, value) {
        console.log(`Setting property: ${prop} = ${value}`);
        return Reflect.set(obj, prop, value);
    },
    
    has(obj, prop) {
        console.log(`Checking if property exists: ${prop}`);
        return Reflect.has(obj, prop);
    }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // "Getting property: name" then "Alice"
proxy.age = 31; // "Setting property: age = 31"
console.log('age' in proxy); // "Checking if property exists: age" then true

// Validation proxy
function createValidatedUser(userData) {
    return new Proxy(userData, {
        set(obj, prop, value) {
            if (prop === 'email' && !value.includes('@')) {
                throw new Error('Invalid email format');
            }
            if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
                throw new Error('Age must be a positive number');
            }
            return Reflect.set(obj, prop, value);
        }
    });
}

const user = createValidatedUser({ name: 'Bob' });
user.email = 'bob@example.com'; // OK
user.age = 25; // OK

try {
    user.email = 'invalid-email'; // Error
} catch (error) {
    console.log('Validation error:', error.message);
}

// Array with negative indices
function createArrayWithNegativeIndices(arr) {
    return new Proxy(arr, {
        get(target, prop) {
            if (typeof prop === 'string' && /^-\d+$/.test(prop)) {
                const index = target.length + parseInt(prop);
                return target[index];
            }
            return Reflect.get(target, prop);
        }
    });
}

const array = createArrayWithNegativeIndices([1, 2, 3, 4, 5]);
console.log(array[-1]); // 5 (last element)
console.log(array[-2]); // 4 (second to last)

// Observable object
function createObservable(target, onChange) {
    return new Proxy(target, {
        set(obj, prop, value) {
            const oldValue = obj[prop];
            const result = Reflect.set(obj, prop, value);
            if (result && oldValue !== value) {
                onChange(prop, value, oldValue);
            }
            return result;
        },
        
        deleteProperty(obj, prop) {
            const oldValue = obj[prop];
            const result = Reflect.deleteProperty(obj, prop);
            if (result) {
                onChange(prop, undefined, oldValue);
            }
            return result;
        }
    });
}

const observable = createObservable({ name: 'Alice' }, (prop, newVal, oldVal) => {
    console.log(`Property ${prop} changed from ${oldVal} to ${newVal}`);
});

observable.name = 'Bob'; // "Property name changed from Alice to Bob"
observable.age = 30; // "Property age changed from undefined to 30"
delete observable.age; // "Property age changed from 30 to undefined"

// Method interception
class Calculator {
    add(a, b) { return a + b; }
    subtract(a, b) { return a - b; }
    multiply(a, b) { return a * b; }
    divide(a, b) { return a / b; }
}

function createInstrumentedCalculator() {
    const calc = new Calculator();
    
    return new Proxy(calc, {
        get(target, prop) {
            const value = Reflect.get(target, prop);
            
            if (typeof value === 'function') {
                return function(...args) {
                    console.log(`Calling ${prop} with arguments:`, args);
                    const startTime = performance.now();
                    const result = value.apply(this, args);
                    const endTime = performance.now();
                    console.log(`${prop} returned ${result} in ${endTime - startTime}ms`);
                    return result;
                };
            }
            
            return value;
        }
    });
}

const instrumentedCalc = createInstrumentedCalculator();
instrumentedCalc.add(5, 3); // Logs method call and timing
instrumentedCalc.divide(10, 2); // Logs method call and timing
```

### 3. Modern Async Patterns (Advanced)

```javascript
console.log('=== Modern Async Patterns ===');

// Promise.allSettled (ES2020)
async function demonstratePromiseAllSettled() {
    const promises = [
        Promise.resolve('Success 1'),
        Promise.reject('Error 1'),
        Promise.resolve('Success 2'),
        Promise.reject('Error 2')
    ];
    
    const results = await Promise.allSettled(promises);
    console.log('Promise.allSettled results:', results);
    
    // Process results
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Promise ${index} succeeded:`, result.value);
        } else {
            console.log(`Promise ${index} failed:`, result.reason);
        }
    });
}

demonstratePromiseAllSettled();

// Promise.any (ES2021)
async function demonstratePromiseAny() {
    const promises = [
        new Promise(resolve => setTimeout(() => resolve('Fast result'), 100)),
        new Promise(resolve => setTimeout(() => resolve('Slow result'), 500)),
        new Promise((_, reject) => setTimeout(() => reject('Error'), 50))
    ];
    
    try {
        const result = await Promise.any(promises);
        console.log('Promise.any result:', result); // "Fast result"
    } catch (error) {
        console.log('All promises rejected:', error);
    }
}

demonstratePromiseAny();

// Async iteration
async function* asyncDataGenerator() {
    const data = ['item1', 'item2', 'item3'];
    
    for (const item of data) {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 100));
        yield item.toUpperCase();
    }
}

async function processAsyncData() {
    console.log('Processing async data:');
    for await (const item of asyncDataGenerator()) {
        console.log('Received:', item);
    }
}

processAsyncData();

// AbortController for cancellable operations
async function cancellableOperation() {
    const controller = new AbortController();
    const signal = controller.signal;
    
    // Cancel after 2 seconds
    setTimeout(() => controller.abort(), 2000);
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
            signal
        });
        const data = await response.json();
        console.log('Fetch completed:', data.title);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Operation was cancelled');
        } else {
            console.log('Fetch error:', error.message);
        }
    }
}

// Advanced async patterns
class AsyncQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }
    
    async add(asyncFunction) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                asyncFunction,
                resolve,
                reject
            });
            this.process();
        });
    }
    
    async process() {
        if (this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }
        
        this.running++;
        const { asyncFunction, resolve, reject } = this.queue.shift();
        
        try {
            const result = await asyncFunction();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.running--;
            this.process();
        }
    }
}

// Usage of AsyncQueue
const queue = new AsyncQueue(2); // Max 2 concurrent operations

async function simulateAsyncTask(id, delay) {
    console.log(`Task ${id} started`);
    await new Promise(resolve => setTimeout(resolve, delay));
    console.log(`Task ${id} completed`);
    return `Result ${id}`;
}

// Add tasks to queue
[1, 2, 3, 4, 5].forEach(id => {
    queue.add(() => simulateAsyncTask(id, Math.random() * 1000));
});
```

### 4. Latest ES Features (ES2020+) (Advanced)

```javascript
console.log('=== Latest ES Features ===');

// Optional Chaining (ES2020)
const user = {
    name: 'Alice',
    address: {
        street: '123 Main St',
        coordinates: {
            lat: 42.3601,
            lng: -71.0589
        }
    },
    hobbies: ['reading', 'swimming']
};

// Safe property access
console.log(user?.name); // "Alice"
console.log(user?.address?.street); // "123 Main St"
console.log(user?.address?.coordinates?.lat); // 42.3601
console.log(user?.phone?.number); // undefined (no error)

// Optional chaining with arrays
console.log(user?.hobbies?.[0]); // "reading"
console.log(user?.hobbies?.[10]); // undefined

// Optional chaining with methods
const api = {
    getData: () => 'data',
    // processData method might not exist
};

console.log(api?.getData?.()); // "data"
console.log(api?.processData?.()); // undefined

// Nullish Coalescing (ES2020)
const config = {
    timeout: 0,
    retries: null,
    debug: false
};

// Using || (problematic with falsy values)
console.log(config.timeout || 5000); // 5000 (0 is falsy)
console.log(config.debug || true); // true (false is falsy)

// Using ?? (only null/undefined)
console.log(config.timeout ?? 5000); // 0 (0 is not null/undefined)
console.log(config.retries ?? 3); // 3 (null triggers default)
console.log(config.debug ?? true); // false (false is not null/undefined)

// Logical Assignment Operators (ES2021)
let a = null;
let b = 0;
let c = 'hello';

// Nullish assignment
a ??= 'default'; // a is null, so assign 'default'
b ??= 'default'; // b is 0 (not null/undefined), so no assignment
console.log(a, b); // "default" 0

// Logical AND assignment
c &&= c.toUpperCase(); // c is truthy, so assign result of operation
console.log(c); // "HELLO"

// Logical OR assignment
let d = '';
d ||= 'default'; // d is falsy, so assign 'default'
console.log(d); // "default"

// Numeric Separators (ES2021)
const million = 1_000_000;
const binary = 0b1010_0001;
const hex = 0xFF_EC_DE_5E;
const bigInt = 123_456n;

console.log(million); // 1000000
console.log(binary); // 161
console.log(hex); // 4293713502

// String.prototype.replaceAll (ES2021)
const text = 'hello world hello universe';
console.log(text.replaceAll('hello', 'hi')); // "hi world hi universe"

// WeakRef and FinalizationRegistry (ES2021)
class WeakCache {
    constructor() {
        this.cache = new Map();
        this.registry = new FinalizationRegistry((key) => {
            console.log(`Cleaning up cache entry: ${key}`);
            this.cache.delete(key);
        });
    }
    
    set(key, value) {
        const ref = new WeakRef(value);
        this.cache.set(key, ref);
        this.registry.register(value, key);
    }
    
    get(key) {
        const ref = this.cache.get(key);
        if (ref) {
            const value = ref.deref();
            if (value !== undefined) {
                return value;
            } else {
                this.cache.delete(key);
            }
        }
        return undefined;
    }
}

// Private methods and accessors (ES2022)
class Counter {
    #count = 0;
    
    // Private method
    #validate(value) {
        return typeof value === 'number' && value >= 0;
    }
    
    // Private getter
    get #currentCount() {
        return this.#count;
    }
    
    // Private setter
    set #currentCount(value) {
        if (this.#validate(value)) {
            this.#count = value;
        }
    }
    
    increment() {
        this.#currentCount = this.#currentCount + 1;
    }
    
    getCount() {
        return this.#currentCount;
    }
}

const counter = new Counter();
counter.increment();
console.log(counter.getCount()); // 1
// console.log(counter.#count); // SyntaxError

// Top-level await (ES2022) - only works in modules
/*
// This would work in a module:
const data = await fetch('https://api.example.com/data');
const json = await data.json();
console.log(json);
*/

// Class static blocks (ES2022)
class MyClass {
    static config = {};
    
    static {
        // Static initialization block
        try {
            this.config = JSON.parse(localStorage.getItem('config') || '{}');
        } catch {
            this.config = { theme: 'light', lang: 'en' };
        }
    }
    
    static getConfig() {
        return this.config;
    }
}

console.log('MyClass config:', MyClass.getConfig());
```

## Real-World Examples

### 1. Modern API Client (Advanced)

```javascript
// Modern API client using ES6+ features
class ModernAPIClient {
    #baseURL;
    #defaultHeaders;
    #abortController;
    
    constructor(baseURL, options = {}) {
        this.#baseURL = baseURL;
        this.#defaultHeaders = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        this.#abortController = new AbortController();
    }
    
    // Private method for building URLs
    #buildURL(endpoint, params = {}) {
        const url = new URL(`${this.#baseURL}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => {
            if (value != null) {
                url.searchParams.append(key, String(value));
            }
        });
        return url.toString();
    }
    
    // Private method for processing response
    async #processResponse(response) {
        if (!response.ok) {
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
            error.status = response.status;
            error.response = response;
            throw error;
        }
        
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
            return response.json();
        } else if (contentType?.includes('text/')) {
            return response.text();
        } else {
            return response.blob();
        }
    }
    
    // Generic request method
    async request(endpoint, {
        method = 'GET',
        headers = {},
        params = {},
        body,
        timeout = 10000,
        ...options
    } = {}) {
        const url = this.#buildURL(endpoint, params);
        
        // Create abort controller for this specific request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                method,
                headers: { ...this.#defaultHeaders, ...headers },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
                ...options
            });
            
            return await this.#processResponse(response);
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout or cancelled');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }
    
    // Convenience methods using modern syntax
    get = (endpoint, options) => this.request(endpoint, { ...options, method: 'GET' });
    post = (endpoint, body, options) => this.request(endpoint, { ...options, method: 'POST', body });
    put = (endpoint, body, options) => this.request(endpoint, { ...options, method: 'PUT', body });
    delete = (endpoint, options) => this.request(endpoint, { ...options, method: 'DELETE' });
    
    // Batch requests with different patterns
    async *fetchPaginated(endpoint, { pageSize = 20, maxPages = 10 } = {}) {
        let page = 1;
        let hasMore = true;
        
        while (hasMore && page <= maxPages) {
            try {
                const data = await this.get(endpoint, {
                    params: { page, limit: pageSize }
                });
                
                hasMore = data.items?.length === pageSize;
                yield data;
                page++;
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error);
                break;
            }
        }
    }
    
    // Parallel requests with error handling
    async fetchMultiple(endpoints) {
        const promises = endpoints.map(async (endpoint) => {
            try {
                const data = await this.get(endpoint);
                return { success: true, data, endpoint };
            } catch (error) {
                return { success: false, error: error.message, endpoint };
            }
        });
        
        return Promise.allSettled(promises);
    }
    
    // Cancel all ongoing requests
    cancelAll() {
        this.#abortController.abort();
        this.#abortController = new AbortController();
    }
}

// Usage example
const api = new ModernAPIClient('https://jsonplaceholder.typicode.com');

async function demonstrateAPIClient() {
    try {
        // Simple GET request
        const post = await api.get('/posts/1');
        console.log('Single post:', post?.title);
        
        // POST request with body
        const newPost = await api.post('/posts', {
            title: 'My New Post',
            body: 'This is the content',
            userId: 1
        });
        console.log('Created post:', newPost?.id);
        
        // Paginated data fetching
        console.log('Fetching paginated posts:');
        for await (const page of api.fetchPaginated('/posts', { pageSize: 5, maxPages: 3 })) {
            console.log(`Page with ${page.length} posts`);
        }
        
        // Multiple parallel requests
        const endpoints = ['/posts/1', '/posts/2', '/posts/3'];
        const results = await api.fetchMultiple(endpoints);
        
        results.forEach((result, index) => {
            if (result.value?.success) {
                console.log(`Request ${index + 1} succeeded:`, result.value.data?.title);
            } else {
                console.log(`Request ${index + 1} failed:`, result.value?.error);
            }
        });
        
    } catch (error) {
        console.error('API demonstration error:', error.message);
    }
}

demonstrateAPIClient();
```

### 2. Modern State Management System (Advanced)

```javascript
// Modern state management using ES6+ features
class ModernStateManager {
    #state;
    #listeners;
    #middleware;
    #history;
    #historyIndex;
    
    constructor(initialState = {}) {
        this.#state = { ...initialState };
        this.#listeners = new Set();
        this.#middleware = [];
        this.#history = [{ ...initialState }];
        this.#historyIndex = 0;
        
        // Return a proxy for direct property access
        return new Proxy(this, {
            get(target, prop) {
                if (prop in target) {
                    return Reflect.get(target, prop);
                }
                return target.#state[prop];
            },
            
            set(target, prop, value) {
                if (prop in target) {
                    return Reflect.set(target, prop, value);
                }
                
                target.#setState({ [prop]: value });
                return true;
            },
            
            has(target, prop) {
                return prop in target || prop in target.#state;
            },
            
            ownKeys(target) {
                return [...Reflect.ownKeys(target), ...Object.keys(target.#state)];
            }
        });
    }
    
    // Private method to update state
    #setState(changes) {
        const prevState = { ...this.#state };
        const nextState = { ...prevState, ...changes };
        
        // Apply middleware
        let action = { type: 'SET_STATE', payload: changes, prevState, nextState };
        
        for (const middleware of this.#middleware) {
            action = middleware(action) ?? action;
        }
        
        if (action) {
            this.#state = action.nextState;
            this.#addToHistory(this.#state);
            this.#notifyListeners(action);
        }
    }
    
    // Add to history with size limit
    #addToHistory(state) {
        // Remove future history if we're not at the end
        this.#history = this.#history.slice(0, this.#historyIndex + 1);
        this.#history.push({ ...state });
        this.#historyIndex = this.#history.length - 1;
        
        // Limit history size
        if (this.#history.length > 50) {
            this.#history = this.#history.slice(-50);
            this.#historyIndex = this.#history.length - 1;
        }
    }
    
    #notifyListeners(action) {
        this.#listeners.forEach(listener => {
            try {
                listener(action);
            } catch (error) {
                console.error('Listener error:', error);
            }
        });
    }
    
    // Public methods
    getState() {
        return { ...this.#state };
    }
    
    setState(changes) {
        this.#setState(changes);
    }
    
    subscribe(listener) {
        this.#listeners.add(listener);
        
        // Return unsubscribe function
        return () => this.#listeners.delete(listener);
    }
    
    addMiddleware(middleware) {
        this.#middleware.push(middleware);
    }
    
    // Time travel methods
    undo() {
        if (this.#historyIndex > 0) {
            this.#historyIndex--;
            this.#state = { ...this.#history[this.#historyIndex] };
            this.#notifyListeners({ type: 'UNDO', nextState: this.#state });
        }
    }
    
    redo() {
        if (this.#historyIndex < this.#history.length - 1) {
            this.#historyIndex++;
            this.#state = { ...this.#history[this.#historyIndex] };
            this.#notifyListeners({ type: 'REDO', nextState: this.#state });
        }
    }
    
    // Async actions
    async dispatch(asyncAction) {
        try {
            const result = await asyncAction(this.getState(), this.setState.bind(this));
            return result;
        } catch (error) {
            this.#notifyListeners({ 
                type: 'ERROR', 
                error: error.message, 
                nextState: this.#state 
            });
            throw error;
        }
    }
    
    // Computed properties
    computed(computeFn, dependencies = []) {
        let cachedValue;
        let cachedDeps;
        
        return () => {
            const currentDeps = dependencies.map(dep => this.#state[dep]);
            
            if (!cachedDeps || !currentDeps.every((dep, i) => dep === cachedDeps[i])) {
                cachedValue = computeFn(this.#state);
                cachedDeps = currentDeps;
            }
            
            return cachedValue;
        };
    }
}

// Usage example
const store = new ModernStateManager({
    user: null,
    posts: [],
    loading: false,
    error: null
});

// Add middleware
store.addMiddleware((action) => {
    console.log('Action:', action.type, action.payload);
    
    // Validation middleware
    if (action.type === 'SET_STATE' && action.payload.user) {
        const user = action.payload.user;
        if (!user.email?.includes('@')) {
            console.warn('Invalid user email');
            return null; // Cancel action
        }
    }
    
    return action;
});

// Subscribe to changes
const unsubscribe = store.subscribe((action) => {
    console.log('State changed:', action.type);
    if (action.type === 'ERROR') {
        console.error('Store error:', action.error);
    }
});

// Computed property
const userPostCount = store.computed(
    (state) => state.posts?.filter(post => post.userId === state.user?.id).length ?? 0,
    ['posts', 'user']
);

// Direct property access (thanks to proxy)
store.user = { id: 1, name: 'Alice', email: 'alice@example.com' };
store.loading = true;

console.log('User post count:', userPostCount()); // 0

// Async action
store.dispatch(async (state, setState) => {
    setState({ loading: true, error: null });
    
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${state.user.id}/posts`);
        const posts = await response.json();
        
        setState({ posts, loading: false });
    } catch (error) {
        setState({ loading: false, error: error.message });
        throw error;
    }
});

// Time travel
setTimeout(() => {
    console.log('Current state:', store.getState());
    store.undo();
    console.log('After undo:', store.getState());
    store.redo();
    console.log('After redo:', store.getState());
}, 2000);
```

## Best Practices

### 1. Modern Module Organization

```javascript
// === utils/validators.js ===
export const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isPhone = (phone) => /^\+?[\d\s-()]+$/.test(phone);
export const isRequired = (value) => value != null && value !== '';

export default class Validator {
    static validate(data, rules) {
        const errors = {};
        
        for (const [field, validators] of Object.entries(rules)) {
            const value = data[field];
            
            for (const validator of validators) {
                const result = validator(value, data);
                if (result !== true) {
                    errors[field] = result;
                    break;
                }
            }
        }
        
        return { isValid: Object.keys(errors).length === 0, errors };
    }
}

// === utils/api.js ===
export { default as APIClient } from './api-client.js';
export { default as HTTPError } from './http-error.js';
export * from './api-helpers.js';

// === components/UserForm.js ===
import Validator, { isEmail, isRequired } from '../utils/validators.js';
import { APIClient } from '../utils/api.js';

export default class UserForm {
    #api = new APIClient('/api');
    #validator = new Validator();
    
    async submit(userData) {
        const { isValid, errors } = this.#validator.validate(userData, {
            name: [isRequired],
            email: [isRequired, isEmail]
        });
        
        if (!isValid) {
            throw new ValidationError(errors);
        }
        
        return this.#api.post('/users', userData);
    }
}

// === main.js ===
import('./components/UserForm.js').then(({ default: UserForm }) => {
    const form = new UserForm();
    // Use form...
});
```

### 2. Performance Optimization Patterns

```javascript
// Efficient object operations
const users = [
    { id: 1, name: 'Alice', department: 'Engineering' },
    { id: 2, name: 'Bob', department: 'Marketing' },
    { id: 3, name: 'Charlie', department: 'Engineering' }
];

// Modern groupBy using Object.groupBy (if available) or fallback
const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = item[key];
        (groups[group] ??= []).push(item);
        return groups;
    }, {});
};

const usersByDepartment = groupBy(users, 'department');
console.log(usersByDepartment);

// Efficient array operations
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Chaining operations efficiently
const result = numbers
    .filter(n => n % 2 === 0) // [2, 4, 6, 8, 10]
    .map(n => n * n)           // [4, 16, 36, 64, 100]
    .reduce((sum, n) => sum + n, 0); // 220

console.log('Chained result:', result);

// Using for...of for better performance with early exit
function findFirstEven(numbers) {
    for (const num of numbers) {
        if (num % 2 === 0) {
            return num; // Early exit
        }
    }
    return null;
}

// Memory-efficient iteration with generators
function* processLargeDataset(data) {
    for (const item of data) {
        // Process one item at a time
        yield {
            ...item,
            processed: true,
            timestamp: Date.now()
        };
    }
}

// Using WeakMap for metadata without memory leaks
const elementMetadata = new WeakMap();

class ComponentManager {
    attachMetadata(element, data) {
        elementMetadata.set(element, data);
    }
    
    getMetadata(element) {
        return elementMetadata.get(element);
    }
}
```

This comprehensive guide covers ES6+ Modern JavaScript features from beginner to advanced levels, providing practical examples and real-world applications that demonstrate how modern JavaScript can make your code more efficient, readable, and maintainable.
