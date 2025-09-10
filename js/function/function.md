# JavaScript Functions - Complete Study Guide

## Table of Contents

1. [Function Basics](#function-basics)
2. [Arrow Functions](#arrow-functions)
3. [Rest & Spread Operators](#rest--spread-operators)
4. [Higher-Order Functions](#higher-order-functions)
5. [Closures](#closures)
6. [Lexical Scoping](#lexical-scoping)
7. [IIFE (Immediately Invoked Function Expressions)](#iife)
8. [Hoisting](#hoisting)
9. [Pure vs Impure Functions](#pure-vs-impure-functions)
10. [Complex Problems & Solutions](#complex-problems--solutions)
11. [Practice Exercises](#practice-exercises)

---

## 🎯 Function Basics

### Function Declaration
```javascript
function greet(name) {
    return `Hello, ${name}!`;
}
```

### Function Expression
```javascript
const greet = function(name) {
    return `Hello, ${name}!`;
};
```

### Function with Return
```javascript
let calculate = function() {
    return c = (4 + 4); // Returns 8
}
console.log(calculate()); // Output: 8
```

---

## ➡️ Arrow Functions

### Basic Arrow Function
```javascript
let func = () => {
    console.log("Arrow function executed");
}
func(); // Output: Arrow function executed
```

### Arrow Function with Parameters
```javascript
const multiply = (a, b) => a * b;
console.log(multiply(5, 3)); // Output: 15
```

### Arrow Function vs Regular Function
```javascript
// Regular function
function regularFunc() {
    console.log(this); // 'this' refers to the calling object
}

// Arrow function
const arrowFunc = () => {
    console.log(this); // 'this' is lexically bound
}
```

---

## 📦 Rest & Spread Operators

### Rest Operator (...) - Function Parameters
Collects multiple arguments into an array.

```javascript
// Basic rest operator
function abcd(...val) {
    console.log(val); // [1, 2, 3, 4, 5, 6, 87, 9]
}
abcd(1, 2, 3, 4, 5, 6, 87, 9);

// Practical example - Calculate total scores
function getScore(...scores) {
    let total = 0;
    scores.forEach(function(val) {
        total += val;
    });
    console.log("Total scores is:", total);
}
getScore(12, 3, 14, 51, 21); // Output: Total scores is: 101
```

### Advanced Rest Operator Usage
```javascript
// Rest with other parameters
function processData(first, second, ...remaining) {
    console.log("First:", first);
    console.log("Second:", second);
    console.log("Remaining:", remaining);
}
processData(1, 2, 3, 4, 5, 6);
// Output:
// First: 1
// Second: 2
// Remaining: [3, 4, 5, 6]
```

### Spread Operator (...) - Arrays & Objects
Spreads elements of an array or object.

```javascript
// Array spreading
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Object spreading
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const combinedObj = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }
```

---

## 🔄 Higher-Order Functions

Functions that either take other functions as arguments or return functions.

### First-Class Functions (Callback Functions)
```javascript
function add(val) { // Higher-order function
    val(); // Callback function is called here
}

add(function() {
    console.log("Callback function executed");
});
// Output: Callback function executed
```

### Functions Returning Functions
```javascript
function higher() {
    let val =2
    return function(para = val) { // Returns another function
        console.log("Higher-order function working",para);
    }
}

higher()(); // Output: Higher-order function working

// Alternative calling method
const innerFunc = higher();
innerFunc(); // Same output
```

### Practical Higher-Order Function Example
```javascript
function createMultiplier(multiplier) {
    return function(number) {
        return number * multiplier;
    }
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // Output: 10
console.log(triple(4)); // Output: 12
```

---

## 🔒 Closures

A closure gives access to an outer function's scope from an inner function.

### Basic Closure
```javascript
function closure() {
    let clo = 23;
    return function() {
        console.log(clo); // Accesses parent scope variable
    }
}

const closureFunc = closure();
closureFunc(); // Output: 23
```

### Practical Closure Example - Counter
```javascript
function createCounter() {
    let count = 0;
    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
console.log(counter.decrement()); // 1
```

### Private Variables with Closures
```javascript
function bankAccount(initialBalance) {
    let balance = initialBalance;
    
    return {
        deposit: function(amount) {
            balance += amount;
            return balance;
        },
        withdraw: function(amount) {
            if (amount <= balance) {
                balance -= amount;
                return balance;
            } else {
                return "Insufficient funds";
            }
        },
        getBalance: function() {
            return balance;
        }
    };
}

const account = bankAccount(100);
console.log(account.deposit(50));  // 150
console.log(account.withdraw(30)); // 120
console.log(account.getBalance()); // 120
// console.log(account.balance);   // undefined (private variable)
```

---

## 🎯 Lexical Scoping

Variables are accessible based on where they are defined in the code structure.

### Basic Lexical Scoping
```javascript
function lexical() {
    let a = 12; // Accessible only in lexical() and its nested functions
    
    function l1() {
        let b = 13; // Accessible only in l1() and its nested functions
        
        function l2() {
            let c = 14; // Accessible only in l2()
            let sum = a + b + c; // Can access a, b, and c
            console.log('Sum is:', sum);
            return sum;
        }
        return l2; // Return l2 function
    }
    return l1; // Return l1 function
}

// Method 1: Chain calling
lexical()()(); // Output: Sum is: 39

// Method 2: Step by step
const getL1 = lexical();
const getL2 = getL1();
const result = getL2(); // Output: Sum is: 39
```

### Complex Lexical Scoping Example
```javascript
function outerFunction(x) {
    function middleFunction(y) {
        function innerFunction(z) {
            console.log(`x: ${x}, y: ${y}, z: ${z}`);
            return x + y + z;
        }
        return innerFunction;
    }
    return middleFunction;
}

const result = outerFunction(10)(20)(30);
console.log(result); // Output: x: 10, y: 20, z: 30, then 60
```

---

## ⚡ IIFE (Immediately Invoked Function Expressions)

Functions that execute immediately after being defined.

### Basic IIFE
```javascript
(function() {
    console.log("IIFE executed immediately");
})();
// Output: IIFE executed immediately
```

### IIFE with Parameters
```javascript
(function(name, age) {
    console.log(`Name: ${name}, Age: ${age}`);
})("John", 25);
// Output: Name: John, Age: 25
```

### IIFE for Module Pattern
```javascript
const myModule = (function() {
    let privateVariable = 0;
    
    return {
        increment: function() {
            privateVariable++;
        },
        decrement: function() {
            privateVariable--;
        },
        getValue: function() {
            return privateVariable;
        }
    };
})();

myModule.increment();
myModule.increment();
console.log(myModule.getValue()); // 2
```

---

## 🏗️ Hoisting

JavaScript moves function declarations to the top of their scope.

### Function Declaration Hoisting
```javascript
// This works due to hoisting
host();

function host() {
    console.log("Hoisting works!"); // Output: Hoisting works!
}
```

### Function Expression Hoisting (Doesn't Work)
```javascript
// This throws an error
// hosting(); // TypeError: hosting is not a function

let hosting = function() {
    console.log("Hoisting error");
}
```

### Detailed Hoisting Example
```javascript
console.log(typeof myFunc); // "function"
console.log(typeof myVar);  // "undefined"

function myFunc() {
    return "I'm hoisted!";
}

var myVar = "I'm not fully hoisted!";

console.log(myFunc()); // "I'm hoisted!"
console.log(myVar);    // "I'm not fully hoisted!"
```

---

## 🔍 Pure vs Impure Functions

### Pure Functions
- Same input always produces same output
- No side effects
- Don't modify external state

```javascript
// Pure function
function add(a, b) {
    return a + b; // Only returns value, no side effects
}

function multiply(x, y) {
    return x * y; // Predictable, no external dependencies
}

console.log(add(2, 3)); // Always returns 5
console.log(multiply(4, 5)); // Always returns 20
```

### Impure Functions
- May produce different outputs for same input
- Have side effects
- Modify external state

```javascript
let counter = 0;

// Impure function - modifies external variable
function incrementCounter() {
    counter++; // Side effect: modifies external state
    return counter;
}

// Impure function - depends on external state
function getRandomMultiple(x) {
    return x * Math.random(); // Different output each time
}

console.log(incrementCounter()); // 1 (first call)
console.log(incrementCounter()); // 2 (second call)
```

### Converting Impure to Pure
```javascript
// Impure version
let total = 0;
function addToTotal(value) {
    total += value;
    return total;
}

// Pure version
function add(currentTotal, value) {
    return currentTotal + value;
}

// Usage
let total = 0;
total = add(total, 5); // total = 5
total = add(total, 3); // total = 8
```

---

## 🧩 Complex Problems & Solutions

### Problem 1: Function Composition
Create a function that composes multiple functions together.

```javascript
// Solution
function compose(...functions) {
    return function(value) {
        return functions.reduceRight((acc, fn) => fn(acc), value);
    };
}

// Usage
const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const square = x => x * x;

const composedFunction = compose(square, multiplyByTwo, addOne);
console.log(composedFunction(3)); // ((3 + 1) * 2)² = (4 * 2)² = 8² = 64
```

### Problem 2: Memoization
Create a function that caches results for expensive operations.

```javascript
// Solution
function memoize(fn) {
    const cache = {};
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache[key]) {
            console.log('Cache hit!');
            return cache[key];
        }
        
        console.log('Computing...');
        const result = fn.apply(this, args);
        cache[key] = result;
        return result;
    };
}

// Usage
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);
console.log(memoizedFib(10)); // Computing... 55
console.log(memoizedFib(10)); // Cache hit! 55
```

### Problem 3: Partial Application
Create a function that allows partial application of arguments.

```javascript
// Solution
function partial(fn, ...partialArgs) {
    return function(...remainingArgs) {
        return fn(...partialArgs, ...remainingArgs);
    };
}

// Usage
function greetPerson(greeting, title, firstName, lastName) {
    return `${greeting}, ${title} ${firstName} ${lastName}!`;
}

const greetMr = partial(greetPerson, "Hello", "Mr.");
const greetDrSmith = partial(greetPerson, "Good morning", "Dr.", "Smith");

console.log(greetMr("John", "Doe")); // "Hello, Mr. John Doe!"
console.log(greetDrSmith("Jane"));   // "Good morning, Dr. Smith Jane!"
```

---

## 🌟 Real-Life Development Problems & Solutions

### Problem 1: API Rate Limiting & Request Batching
**Scenario**: Your app makes too many API calls and gets rate-limited. You need to batch requests and handle rate limits gracefully.

```javascript
// Solution: Request Queue with Rate Limiting
class APIRateLimiter {
    constructor(maxRequests = 5, timeWindow = 1000) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = [];
        this.queue = [];
    }
    
    async makeRequest(apiCall) {
        return new Promise((resolve, reject) => {
            this.queue.push({ apiCall, resolve, reject });
            this.processQueue();
        });
    }
    
    async processQueue() {
        if (this.queue.length === 0) return;
        
        // Clean old requests
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        // Check if we can make a request
        if (this.requests.length < this.maxRequests) {
            const { apiCall, resolve, reject } = this.queue.shift();
            this.requests.push(now);
            
            try {
                const result = await apiCall();
                resolve(result);
            } catch (error) {
                reject(error);
            }
            
            // Process next in queue
            setTimeout(() => this.processQueue(), 100);
        } else {
            // Wait and retry
            setTimeout(() => this.processQueue(), this.timeWindow / this.maxRequests);
        }
    }
}

// Usage Example
const rateLimiter = new APIRateLimiter(3, 1000); // 3 requests per second

async function fetchUserData(userId) {
    return rateLimiter.makeRequest(async () => {
        const response = await fetch(`/api/users/${userId}`);
        return response.json();
    });
}

// Batch fetch multiple users without hitting rate limits
async function fetchMultipleUsers(userIds) {
    const promises = userIds.map(id => fetchUserData(id));
    return Promise.all(promises);
}

// Real usage
const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
fetchMultipleUsers(userIds)
    .then(users => console.log('All users fetched:', users))
    .catch(error => console.error('Error:', error));
```

### Problem 2: Form Validation with Real-time Feedback
**Scenario**: Create a robust form validation system that provides real-time feedback and handles complex validation rules.

```javascript
// Solution: Advanced Form Validator
class FormValidator {
    constructor() {
        this.rules = {};
        this.errors = {};
        this.debounceTime = 300;
    }
    
    addRule(fieldName, validator, message) {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push({ validator, message });
        return this;
    }
    
    // Debounced validation for real-time feedback
    createDebouncedValidator(fieldName) {
        let timeoutId;
        return (value) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                this.validateField(fieldName, value);
            }, this.debounceTime);
        };
    }
    
    validateField(fieldName, value) {
        const fieldRules = this.rules[fieldName] || [];
        const fieldErrors = [];
        
        for (const rule of fieldRules) {
            if (!rule.validator(value)) {
                fieldErrors.push(rule.message);
            }
        }
        
        this.errors[fieldName] = fieldErrors;
        this.displayErrors(fieldName, fieldErrors);
        return fieldErrors.length === 0;
    }
    
    validateForm(formData) {
        let isValid = true;
        this.errors = {};
        
        for (const [fieldName, value] of Object.entries(formData)) {
            if (!this.validateField(fieldName, value)) {
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    displayErrors(fieldName, errors) {
        const errorElement = document.querySelector(`#${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = errors.join(', ');
            errorElement.style.display = errors.length > 0 ? 'block' : 'none';
        }
    }
}

// Validation Rules Library
const ValidationRules = {
    required: (value) => value !== null && value !== undefined && value.toString().trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    minLength: (min) => (value) => value.length >= min,
    maxLength: (max) => (value) => value.length <= max,
    pattern: (regex) => (value) => regex.test(value),
    strongPassword: (value) => {
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*]/.test(value);
        return hasUpper && hasLower && hasNumber && hasSpecial && value.length >= 8;
    },
    phoneNumber: (value) => /^\+?[\d\s\-()]{10,}$/.test(value),
    creditCard: (value) => {
        // Luhn algorithm for credit card validation
        const digits = value.replace(/\D/g, '');
        let sum = 0;
        let isEven = false;
        
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i]);
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0 && digits.length >= 13;
    }
};

// Usage Example: Registration Form
const registrationValidator = new FormValidator()
    .addRule('username', ValidationRules.required, 'Username is required')
    .addRule('username', ValidationRules.minLength(3), 'Username must be at least 3 characters')
    .addRule('username', ValidationRules.maxLength(20), 'Username cannot exceed 20 characters')
    .addRule('email', ValidationRules.required, 'Email is required')
    .addRule('email', ValidationRules.email, 'Please enter a valid email address')
    .addRule('password', ValidationRules.required, 'Password is required')
    .addRule('password', ValidationRules.strongPassword, 'Password must contain uppercase, lowercase, number, and special character')
    .addRule('phone', ValidationRules.phoneNumber, 'Please enter a valid phone number');

// Real-time validation setup
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#registration-form');
    const fields = ['username', 'email', 'password', 'phone'];
    
    fields.forEach(fieldName => {
        const input = document.querySelector(`#${fieldName}`);
        const debouncedValidator = registrationValidator.createDebouncedValidator(fieldName);
        
        input.addEventListener('input', (e) => {
            debouncedValidator(e.target.value);
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        if (registrationValidator.validateForm(data)) {
            console.log('Form is valid, submitting...', data);
            // Submit to server
        } else {
            console.log('Form has errors:', registrationValidator.errors);
        }
    });
});
```

### Problem 3: Shopping Cart with Local Storage and State Management
**Scenario**: Build a shopping cart that persists data, handles quantity updates, calculates totals, and manages inventory.

```javascript
// Solution: Advanced Shopping Cart Manager
class ShoppingCartManager {
    constructor(storageKey = 'shopping_cart') {
        this.storageKey = storageKey;
        this.cart = this.loadFromStorage();
        this.observers = [];
        this.taxRate = 0.08; // 8% tax
        this.shippingCost = 10;
        this.freeShippingThreshold = 50;
    }
    
    // Observer pattern for state changes
    subscribe(callback) {
        this.observers.push(callback);
        return () => {
            this.observers = this.observers.filter(obs => obs !== callback);
        };
    }
    
    notify() {
        this.observers.forEach(callback => callback(this.getCartSummary()));
        this.saveToStorage();
    }
    
    addItem(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            this.updateQuantity(product.id, existingItem.quantity + quantity);
        } else {
            this.cart.push({
                ...product,
                quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.notify();
        return this.getCartSummary();
    }
    
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.notify();
        return this.getCartSummary();
    }
    
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            return this.removeItem(productId);
        }
        
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.notify();
        }
        
        return this.getCartSummary();
    }
    
    clearCart() {
        this.cart = [];
        this.notify();
        return this.getCartSummary();
    }
    
    // Apply discount codes
    applyDiscount(discountCode) {
        const discounts = {
            'SAVE10': { type: 'percentage', value: 0.10 },
            'WELCOME': { type: 'fixed', value: 5 },
            'FREESHIP': { type: 'shipping', value: 0 }
        };
        
        const discount = discounts[discountCode.toUpperCase()];
        if (discount) {
            this.appliedDiscount = discount;
            this.notify();
            return { success: true, discount };
        }
        
        return { success: false, message: 'Invalid discount code' };
    }
    
    calculateSubtotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    calculateDiscount(subtotal) {
        if (!this.appliedDiscount) return 0;
        
        switch (this.appliedDiscount.type) {
            case 'percentage':
                return subtotal * this.appliedDiscount.value;
            case 'fixed':
                return Math.min(this.appliedDiscount.value, subtotal);
            default:
                return 0;
        }
    }
    
    calculateShipping(subtotal) {
        if (this.appliedDiscount?.type === 'shipping') {
            return 0;
        }
        
        return subtotal >= this.freeShippingThreshold ? 0 : this.shippingCost;
    }
    
    calculateTax(subtotal, discount) {
        return (subtotal - discount) * this.taxRate;
    }
    
    getCartSummary() {
        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount(subtotal);
        const shipping = this.calculateShipping(subtotal);
        const tax = this.calculateTax(subtotal, discount);
        const total = subtotal - discount + shipping + tax;
        
        return {
            items: [...this.cart],
            itemCount: this.cart.reduce((count, item) => count + item.quantity, 0),
            subtotal: Number(subtotal.toFixed(2)),
            discount: Number(discount.toFixed(2)),
            shipping: Number(shipping.toFixed(2)),
            tax: Number(tax.toFixed(2)),
            total: Number(total.toFixed(2)),
            appliedDiscount: this.appliedDiscount
        };
    }
    
    // Inventory management
    checkInventory(productId, requestedQuantity) {
        // In real app, this would check against server inventory
        const mockInventory = {
            1: 10, 2: 5, 3: 8, 4: 3, 5: 15
        };
        
        const available = mockInventory[productId] || 0;
        return {
            available,
            canAdd: available >= requestedQuantity,
            maxQuantity: available
        };
    }
    
    // Persistent storage
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify({
                cart: this.cart,
                appliedDiscount: this.appliedDiscount
            }));
        } catch (error) {
            console.error('Failed to save cart to storage:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                this.appliedDiscount = data.appliedDiscount;
                return data.cart || [];
            }
        } catch (error) {
            console.error('Failed to load cart from storage:', error);
        }
        return [];
    }
    
    // Export cart for checkout
    exportForCheckout() {
        const summary = this.getCartSummary();
        return {
            ...summary,
            timestamp: new Date().toISOString(),
            currency: 'USD'
        };
    }
}

// Usage Example
const cart = new ShoppingCartManager();

// Subscribe to cart changes
const unsubscribe = cart.subscribe((summary) => {
    console.log('Cart updated:', summary);
    updateUIDisplay(summary);
});

// Sample products
const products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Mouse', price: 29.99, category: 'Electronics' },
    { id: 3, name: 'Keyboard', price: 79.99, category: 'Electronics' }
];

// Add items to cart
cart.addItem(products[0], 1);
cart.addItem(products[1], 2);

// Apply discount
const discountResult = cart.applyDiscount('SAVE10');
console.log('Discount applied:', discountResult);

// Update quantity
cart.updateQuantity(1, 2);

// Get final summary
const finalSummary = cart.getCartSummary();
console.log('Final cart summary:', finalSummary);

// UI Update function (would be connected to actual UI)
function updateUIDisplay(summary) {
    // Update cart icon badge
    document.querySelector('.cart-badge').textContent = summary.itemCount;
    
    // Update cart total in header
    document.querySelector('.cart-total').textContent = `$${summary.total}`;
    
    // Update detailed cart view
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = summary.items.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>$${item.price} x ${item.quantity}</span>
            <button onclick="cart.removeItem(${item.id})">Remove</button>
        </div>
    `).join('');
}
```

### Problem 4: Real-time Search with Auto-complete and Caching
**Scenario**: Implement a search feature that provides real-time suggestions, caches results, and handles network errors gracefully.

```javascript
// Solution: Advanced Search Manager
class SearchManager {
    constructor(apiEndpoint, options = {}) {
        this.apiEndpoint = apiEndpoint;
        this.cache = new Map();
        this.debounceTime = options.debounceTime || 300;
        this.maxCacheSize = options.maxCacheSize || 100;
        this.minQueryLength = options.minQueryLength || 2;
        this.maxResults = options.maxResults || 10;
        this.searchHistory = this.loadSearchHistory();
        this.abortController = null;
    }
    
    // Debounced search with caching
    createDebouncedSearch() {
        let timeoutId;
        
        return (query, callback) => {
            clearTimeout(timeoutId);
            
            if (this.abortController) {
                this.abortController.abort();
            }
            
            timeoutId = setTimeout(async () => {
                try {
                    const results = await this.search(query);
                    callback(null, results);
                } catch (error) {
                    callback(error, null);
                }
            }, this.debounceTime);
        };
    }
    
    async search(query) {
        if (!query || query.trim().length < this.minQueryLength) {
            return { results: [], fromCache: false, suggestions: this.getPopularSearches() };
        }
        
        const normalizedQuery = query.trim().toLowerCase();
        
        // Check cache first
        if (this.cache.has(normalizedQuery)) {
            const cached = this.cache.get(normalizedQuery);
            return { ...cached, fromCache: true };
        }
        
        // Make API request
        this.abortController = new AbortController();
        
        try {
            const response = await fetch(`${this.apiEndpoint}?q=${encodeURIComponent(query)}&limit=${this.maxResults}`, {
                signal: this.abortController.signal,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Search API error: ${response.status}`);
            }
            
            const data = await response.json();
            const results = {
                results: data.results || [],
                suggestions: data.suggestions || [],
                totalCount: data.totalCount || 0,
                query: normalizedQuery,
                timestamp: Date.now()
            };
            
            // Cache the results
            this.cacheResults(normalizedQuery, results);
            
            // Save to search history
            this.addToSearchHistory(query);
            
            return { ...results, fromCache: false };
            
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Search was cancelled');
            }
            
            // Return cached results if available, otherwise throw
            if (this.cache.has(normalizedQuery)) {
                const cached = this.cache.get(normalizedQuery);
                return { ...cached, fromCache: true, error: 'Using cached results due to network error' };
            }
            
            throw error;
        }
    }
    
    // Smart caching with LRU eviction
    cacheResults(query, results) {
        if (this.cache.size >= this.maxCacheSize) {
            // Remove oldest entries
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(query, results);
    }
    
    // Search history management
    addToSearchHistory(query) {
        if (!query.trim()) return;
        
        const normalizedQuery = query.trim();
        
        // Remove if already exists to avoid duplicates
        this.searchHistory = this.searchHistory.filter(item => item.query !== normalizedQuery);
        
        // Add to beginning
        this.searchHistory.unshift({
            query: normalizedQuery,
            timestamp: Date.now()
        });
        
        // Keep only last 20 searches
        this.searchHistory = this.searchHistory.slice(0, 20);
        
        this.saveSearchHistory();
    }
    
    getSearchHistory() {
        return this.searchHistory.slice(0, 10);
    }
    
    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
    }
    
    getPopularSearches() {
        // Return most frequent searches from history
        const frequency = {};
        this.searchHistory.forEach(item => {
            frequency[item.query] = (frequency[item.query] || 0) + 1;
        });
        
        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([query]) => query);
    }
    
    // Persistence
    saveSearchHistory() {
        try {
            localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('Failed to save search history:', error);
        }
    }
    
    loadSearchHistory() {
        try {
            const stored = localStorage.getItem('search_history');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load search history:', error);
            return [];
        }
    }
    
    // Advanced filtering
    filterResults(results, filters = {}) {
        let filtered = [...results];
        
        if (filters.category) {
            filtered = filtered.filter(item => item.category === filters.category);
        }
        
        if (filters.minPrice !== undefined) {
            filtered = filtered.filter(item => item.price >= filters.minPrice);
        }
        
        if (filters.maxPrice !== undefined) {
            filtered = filtered.filter(item => item.price <= filters.maxPrice);
        }
        
        if (filters.sortBy) {
            filtered.sort((a, b) => {
                switch (filters.sortBy) {
                    case 'price_asc':
                        return a.price - b.price;
                    case 'price_desc':
                        return b.price - a.price;
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'relevance':
                    default:
                        return b.relevance - a.relevance;
                }
            });
        }
        
        return filtered;
    }
}

// Usage Example: E-commerce Product Search
const productSearch = new SearchManager('/api/products/search', {
    debounceTime: 300,
    maxCacheSize: 50,
    minQueryLength: 2,
    maxResults: 20
});

const debouncedSearch = productSearch.createDebouncedSearch();

// UI Implementation
class SearchUI {
    constructor(searchManager) {
        this.searchManager = searchManager;
        this.searchInput = document.querySelector('#search-input');
        this.resultsContainer = document.querySelector('#search-results');
        this.historyContainer = document.querySelector('#search-history');
        this.loadingIndicator = document.querySelector('#search-loading');
        
        this.setupEventListeners();
        this.showSearchHistory();
    }
    
    setupEventListeners() {
        // Real-time search
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            
            if (query.trim().length === 0) {
                this.showSearchHistory();
                return;
            }
            
            this.showLoading();
            
            debouncedSearch(query, (error, results) => {
                this.hideLoading();
                
                if (error) {
                    this.showError(error.message);
                } else {
                    this.displayResults(results);
                }
            });
        });
        
        // Handle search history clicks
        this.historyContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-item')) {
                const query = e.target.textContent;
                this.searchInput.value = query;
                this.searchInput.dispatchEvent(new Event('input'));
            }
        });
        
        // Clear history
        document.querySelector('#clear-history')?.addEventListener('click', () => {
            this.searchManager.clearSearchHistory();
            this.showSearchHistory();
        });
    }
    
    showLoading() {
        this.loadingIndicator.style.display = 'block';
        this.resultsContainer.innerHTML = '';
    }
    
    hideLoading() {
        this.loadingIndicator.style.display = 'none';
    }
    
    displayResults(data) {
        const { results, fromCache, suggestions, error } = data;
        
        let html = '';
        
        if (error) {
            html += `<div class="search-warning">${error}</div>`;
        }
        
        if (fromCache) {
            html += '<div class="cache-indicator">Results from cache</div>';
        }
        
        if (results.length === 0) {
            html += '<div class="no-results">No results found</div>';
            
            if (suggestions.length > 0) {
                html += '<div class="suggestions">Did you mean: ' +
                    suggestions.map(s => `<span class="suggestion">${s}</span>`).join(', ') +
                    '</div>';
            }
        } else {
            html += results.map(item => `
                <div class="search-result">
                    <img src="${item.image}" alt="${item.name}" class="result-image">
                    <div class="result-content">
                        <h3>${this.highlightQuery(item.name, data.query)}</h3>
                        <p class="result-price">$${item.price}</p>
                        <p class="result-description">${item.description}</p>
                    </div>
                </div>
            `).join('');
        }
        
        this.resultsContainer.innerHTML = html;
    }
    
    showSearchHistory() {
        const history = this.searchManager.getSearchHistory();
        
        if (history.length === 0) {
            this.historyContainer.innerHTML = '<div class="no-history">No recent searches</div>';
            return;
        }
        
        const html = '<div class="history-title">Recent Searches</div>' +
            history.map(item => `
                <div class="history-item">${item.query}</div>
            `).join('');
        
        this.historyContainer.innerHTML = html;
        this.resultsContainer.innerHTML = '';
    }
    
    highlightQuery(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    showError(message) {
        this.resultsContainer.innerHTML = `
            <div class="search-error">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
            </div>
        `;
    }
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchUI = new SearchUI(productSearch);
});
```

### Problem 5: Image Lazy Loading with Progressive Enhancement
**Scenario**: Implement performant image loading that improves page speed and user experience.

```javascript
// Solution: Advanced Lazy Loading Manager
class LazyImageLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: '50px',
            threshold: 0.1,
            enableRetry: true,
            maxRetries: 3,
            retryDelay: 1000,
            enableProgressiveLoading: true,
            enableWebP: true,
            ...options
        };
        
        this.loadedImages = new Set();
        this.failedImages = new Map(); // Track retry attempts
        this.observer = null;
        this.init();
    }
    
    init() {
        // Check for browser support
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.fallbackToScrollListener();
        }
        
        // Preload critical images
        this.preloadCriticalImages();
        
        // Handle network status changes
        this.setupNetworkListener();
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: this.options.rootMargin,
            threshold: this.options.threshold
        });
        
        // Observe all lazy images
        this.observeImages();
    }
    
    observeImages() {
        const lazyImages = document.querySelectorAll('[data-lazy-src]');
        lazyImages.forEach(img => {
            this.observer.observe(img);
            this.setupImagePlaceholder(img);
        });
    }
    
    setupImagePlaceholder(img) {
        if (!img.src) {
            // Create a low-quality placeholder
            const placeholder = this.generatePlaceholder(img);
            img.src = placeholder;
            img.classList.add('lazy-loading');
        }
    }
    
    generatePlaceholder(img) {
        const width = img.dataset.width || 400;
        const height = img.dataset.height || 300;
        
        // Generate SVG placeholder with blur effect
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#f0f0f0;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#gradient)" />
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                      font-family="Arial, sans-serif" font-size="14" fill="#999">
                    Loading...
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
    
    async loadImage(img) {
        if (this.loadedImages.has(img)) return;
        
        const originalSrc = img.dataset.lazySrc;
        const fallbackSrc = img.dataset.fallbackSrc;
        
        try {
            // Progressive loading: try WebP first, then original format
            const srcToLoad = this.options.enableWebP ? 
                this.getWebPSource(originalSrc) || originalSrc : 
                originalSrc;
            
            await this.loadImageWithProgress(img, srcToLoad);
            
            this.onImageLoadSuccess(img, srcToLoad);
            
        } catch (error) {
            console.warn('Failed to load image:', originalSrc, error);
            await this.handleImageLoadFailure(img, originalSrc, fallbackSrc);
        }
    }
    
    loadImageWithProgress(img, src) {
        return new Promise((resolve, reject) => {
            const imageLoader = new Image();
            
            // Track loading progress
            if (this.options.enableProgressiveLoading) {
                this.showLoadingProgress(img);
            }
            
            imageLoader.onload = () => {
                img.src = src;
                resolve();
            };
            
            imageLoader.onerror = () => {
                reject(new Error('Image load failed'));
            };
            
            // Start loading
            imageLoader.src = src;
            
            // Timeout after 10 seconds
            setTimeout(() => {
                if (!imageLoader.complete) {
                    reject(new Error('Image load timeout'));
                }
            }, 10000);
        });
    }
    
    async handleImageLoadFailure(img, originalSrc, fallbackSrc) {
        const retryCount = this.failedImages.get(img) || 0;
        
        if (this.options.enableRetry && retryCount < this.options.maxRetries) {
            // Retry with exponential backoff
            const delay = this.options.retryDelay * Math.pow(2, retryCount);
            this.failedImages.set(img, retryCount + 1);
            
            setTimeout(() => {
                this.loadImage(img);
            }, delay);
            
        } else if (fallbackSrc) {
            // Use fallback image
            try {
                await this.loadImageWithProgress(img, fallbackSrc);
                this.onImageLoadSuccess(img, fallbackSrc);
            } catch (fallbackError) {
                this.onImageLoadFinalFailure(img);
            }
        } else {
            this.onImageLoadFinalFailure(img);
        }
    }
    
    onImageLoadSuccess(img, src) {
        this.loadedImages.add(img);
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
        
        // Fade in animation
        this.animateImageLoad(img);
        
        // Clean up
        delete img.dataset.lazySrc;
        this.failedImages.delete(img);
        
        // Dispatch custom event
        img.dispatchEvent(new CustomEvent('lazyload', {
            detail: { src, loadTime: Date.now() }
        }));
    }
    
    onImageLoadFinalFailure(img) {
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-error');
        
        // Show error placeholder
        img.alt = 'Failed to load image';
        img.src = this.generateErrorPlaceholder();
        
        // Dispatch error event
        img.dispatchEvent(new CustomEvent('lazyerror', {
            detail: { originalSrc: img.dataset.lazySrc }
        }));
    }
    
    generateErrorPlaceholder() {
        const svg = `
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f5f5f5" stroke="#ddd" stroke-width="2"/>
                <text x="50%" y="45%" text-anchor="middle" font-family="Arial" font-size="16" fill="#999">
                    ⚠️ Image failed to load
                </text>
                <text x="50%" y="60%" text-anchor="middle" font-family="Arial" font-size="12" fill="#ccc">
                    Click to retry
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
    
    animateImageLoad(img) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        
        // Trigger reflow
        img.offsetHeight;
        
        img.style.opacity = '1';
    }
    
    showLoadingProgress(img) {
        const progressBar = document.createElement('div');
        progressBar.className = 'image-loading-progress';
        progressBar.innerHTML = '<div class="progress-bar"></div>';
        
        img.parentNode.insertBefore(progressBar, img.nextSibling);
        
        // Simulate progress (in real app, use actual progress events)
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => progressBar.remove(), 300);
            }
            
            const bar = progressBar.querySelector('.progress-bar');
            if (bar) bar.style.width = `${progress}%`;
        }, 200);
    }
    
    getWebPSource(originalSrc) {
        if (!this.supportsWebP()) return null;
        
        // Convert common image extensions to WebP
        const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        return webpSrc !== originalSrc ? webpSrc : null;
    }
    
    supportsWebP() {
        if (this._webpSupported !== undefined) return this._webpSupported;
        
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        
        this._webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        return this._webpSupported;
    }
    
    preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('[data-critical-src]');
        
        criticalImages.forEach(async (img) => {
            try {
                await this.loadImageWithProgress(img, img.dataset.criticalSrc);
                this.onImageLoadSuccess(img, img.dataset.criticalSrc);
            } catch (error) {
                console.warn('Failed to preload critical image:', img.dataset.criticalSrc);
            }
        });
    }
    
    setupNetworkListener() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Adjust loading strategy based on connection
            const updateStrategy = () => {
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    this.options.rootMargin = '10px'; // Load images closer to viewport
                    this.options.enableWebP = false; // Disable WebP on slow connections
                } else {
                    this.options.rootMargin = '100px'; // Load images earlier
                    this.options.enableWebP = true;
                }
            };
            
            connection.addEventListener('change', updateStrategy);
            updateStrategy(); // Initial setup
        }
    }
    
    fallbackToScrollListener() {
        // Fallback for browsers without IntersectionObserver
        const checkImages = () => {
            const lazyImages = document.querySelectorAll('[data-lazy-src]:not(.lazy-loaded)');
            
            lazyImages.forEach(img => {
                const rect = img.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight + 50 && rect.bottom > -50;
                
                if (isVisible) {
                    this.loadImage(img);
                }
            });
        };
        
        // Throttled scroll listener
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkImages();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onScroll);
        
        // Initial check
        checkImages();
    }
    
    // Public methods
    refresh() {
        if (this.observer) {
            this.observeImages();
        }
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.loadedImages.clear();
        this.failedImages.clear();
    }
}

// Usage Example
const lazyLoader = new LazyImageLoader({
    rootMargin: '50px',
    threshold: 0.1,
    enableRetry: true,
    maxRetries: 3,
    enableProgressiveLoading: true,
    enableWebP: true
});

// HTML structure for lazy images:
/*
<img data-lazy-src="high-res-image.jpg" 
     data-fallback-src="low-res-fallback.jpg"
     data-width="800" 
     data-height="600"
     alt="Description"
     class="lazy-image">

<img data-critical-src="hero-image.jpg" 
     alt="Hero image"
     class="critical-image">
*/

// Event listeners for image loading
document.addEventListener('lazyload', (e) => {
    console.log('Image loaded successfully:', e.detail.src);
});

document.addEventListener('lazyerror', (e) => {
    console.error('Image failed to load:', e.detail.originalSrc);
});
```

### Problem 6: Data Synchronization with Offline Support
**Scenario**: Build a system that handles data synchronization between client and server, with offline capability and conflict resolution.

```javascript
// Solution: Offline-First Data Sync Manager
class OfflineDataSync {
    constructor(options = {}) {
        this.options = {
            apiBaseUrl: options.apiBaseUrl || '/api',
            syncInterval: options.syncInterval || 30000, // 30 seconds
            maxRetries: options.maxRetries || 3,
            storagePrefix: options.storagePrefix || 'offline_',
            enableConflictResolution: options.enableConflictResolution !== false,
            ...options
        };
        
        this.isOnline = navigator.onLine;
        this.syncQueue = [];
        this.conflictResolver = options.conflictResolver || this.defaultConflictResolver;
        this.lastSyncTimestamp = this.getLastSyncTimestamp();
        
        this.init();
    }
    
    init() {
        this.setupNetworkListeners();
        this.setupPeriodicSync();
        this.loadPendingOperations();
        
        // Initial sync if online
        if (this.isOnline) {
            this.performSync();
        }
    }
    
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            console.log('Network connection restored');
            this.isOnline = true;
            this.performSync();
        });
        
        window.addEventListener('offline', () => {
            console.log('Network connection lost');
            this.isOnline = false;
        });
    }
    
    setupPeriodicSync() {
        setInterval(() => {
            if (this.isOnline && this.syncQueue.length > 0) {
                this.performSync();
            }
        }, this.options.syncInterval);
    }
    
    // CRUD operations with offline support
    async create(collection, data) {
        const operation = {
            id: this.generateId(),
            type: 'CREATE',
            collection,
            data: {
                ...data,
                localId: this.generateId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            timestamp: Date.now(),
            retries: 0
        };
        
        // Store locally first
        this.storeLocally(collection, operation.data);
        
        // Add to sync queue
        this.addToSyncQueue(operation);
        
        // Try to sync immediately if online
        if (this.isOnline) {
            this.performSync();
        }
        
        return operation.data;
    }
    
    async read(collection, id = null) {
        const localData = this.getLocalData(collection);
        
        if (id) {
            return localData.find(item => item.id === id || item.localId === id);
        }
        
        return localData;
    }
    
    async update(collection, id, updates) {
        const existing = await this.read(collection, id);
        if (!existing) {
            throw new Error('Item not found');
        }
        
        const updatedData = {
            ...existing,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        const operation = {
            id: this.generateId(),
            type: 'UPDATE',
            collection,
            itemId: id,
            data: updatedData,
            previousData: existing,
            timestamp: Date.now(),
            retries: 0
        };
        
        // Update locally
        this.updateLocally(collection, id, updatedData);
        
        // Add to sync queue
        this.addToSyncQueue(operation);
        
        if (this.isOnline) {
            this.performSync();
        }
        
        return updatedData;
    }
    
    async delete(collection, id) {
        const existing = await this.read(collection, id);
        if (!existing) {
            throw new Error('Item not found');
        }
        
        const operation = {
            id: this.generateId(),
            type: 'DELETE',
            collection,
            itemId: id,
            data: existing,
            timestamp: Date.now(),
            retries: 0
        };
        
        // Mark as deleted locally
        this.deleteLocally(collection, id);
        
        // Add to sync queue
        this.addToSyncQueue(operation);
        
        if (this.isOnline) {
            this.performSync();
        }
        
        return true;
    }
    
    // Sync operations
    async performSync() {
        if (!this.isOnline || this.syncQueue.length === 0) return;
        
        console.log(`Starting sync with ${this.syncQueue.length} operations`);
        
        const operations = [...this.syncQueue];
        const successful = [];
        const failed = [];
        
        for (const operation of operations) {
            try {
                await this.syncOperation(operation);
                successful.push(operation);
            } catch (error) {
                console.error('Sync operation failed:', operation, error);
                operation.retries++;
                
                if (operation.retries >= this.options.maxRetries) {
                    failed.push(operation);
                } else {
                    // Keep in queue for retry
                    continue;
                }
            }
        }
        
        // Remove successful operations from queue
        this.syncQueue = this.syncQueue.filter(op => 
            !successful.some(s => s.id === op.id)
        );
        
        // Remove permanently failed operations
        this.syncQueue = this.syncQueue.filter(op => 
            !failed.some(f => f.id === op.id)
        );
        
        // Update last sync timestamp
        this.lastSyncTimestamp = Date.now();
        this.saveLastSyncTimestamp();
        
        // Save pending operations
        this.savePendingOperations();
        
        console.log(`Sync completed: ${successful.length} successful, ${failed.length} failed`);
        
        // Fetch server changes
        await this.fetchServerChanges();
    }
    
    async syncOperation(operation) {
        const { type, collection, data, itemId } = operation;
        const url = `${this.options.apiBaseUrl}/${collection}`;
        
        let response;
        
        switch (type) {
            case 'CREATE':
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const serverData = await response.json();
                    // Update local data with server ID
                    this.updateLocalWithServerId(collection, data.localId, serverData);
                }
                break;
                
            case 'UPDATE':
                response = await fetch(`${url}/${itemId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                break;
                
            case 'DELETE':
                response = await fetch(`${url}/${itemId}`, {
                    method: 'DELETE'
                });
                break;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
    }
    
    async fetchServerChanges() {
        try {
            const response = await fetch(
                `${this.options.apiBaseUrl}/sync?since=${this.lastSyncTimestamp}`,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            
            if (!response.ok) return;
            
            const { changes } = await response.json();
            
            for (const change of changes) {
                await this.applyServerChange(change);
            }
            
        } catch (error) {
            console.error('Failed to fetch server changes:', error);
        }
    }
    
    async applyServerChange(change) {
        const { collection, type, data, timestamp } = change;
        
        if (this.options.enableConflictResolution) {
            const conflict = await this.detectConflict(collection, data);
            if (conflict) {
                const resolution = await this.conflictResolver(conflict, data);
                if (resolution) {
                    this.updateLocally(collection, data.id, resolution);
                }
                return;
            }
        }
        
        switch (type) {
            case 'CREATE':
            case 'UPDATE':
                this.updateLocally(collection, data.id, data);
                break;
            case 'DELETE':
                this.deleteLocally(collection, data.id);
                break;
        }
    }
    
    async detectConflict(collection, serverData) {
        const localData = await this.read(collection, serverData.id);
        
        if (!localData) return null;
        
        // Check if local data was modified after server timestamp
        const localTimestamp = new Date(localData.updatedAt).getTime();
        const serverTimestamp = new Date(serverData.updatedAt).getTime();
        
        if (localTimestamp > serverTimestamp) {
            return {
                type: 'UPDATE_CONFLICT',
                localData,
                serverData,
                collection
            };
        }
        
        return null;
    }
    
    defaultConflictResolver(conflict, serverData) {
        // Default: prefer server data (last-write-wins)
        console.warn('Conflict detected, using server data:', conflict);
        return serverData;
    }
    
    // Local storage operations
    storeLocally(collection, data) {
        const key = `${this.options.storagePrefix}${collection}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(data);
        localStorage.setItem(key, JSON.stringify(existing));
    }
    
    getLocalData(collection) {
        const key = `${this.options.storagePrefix}${collection}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }
    
    updateLocally(collection, id, data) {
        const key = `${this.options.storagePrefix}${collection}`;
        const existing = this.getLocalData(collection);
        const index = existing.findIndex(item => item.id === id || item.localId === id);
        
        if (index !== -1) {
            existing[index] = data;
            localStorage.setItem(key, JSON.stringify(existing));
        }
    }
    
    deleteLocally(collection, id) {
        const key = `${this.options.storagePrefix}${collection}`;
        const existing = this.getLocalData(collection);
        const filtered = existing.filter(item => item.id !== id && item.localId !== id);
        localStorage.setItem(key, JSON.stringify(filtered));
    }
    
    updateLocalWithServerId(collection, localId, serverData) {
        const key = `${this.options.storagePrefix}${collection}`;
        const existing = this.getLocalData(collection);
        const index = existing.findIndex(item => item.localId === localId);
        
        if (index !== -1) {
            existing[index] = { ...existing[index], ...serverData };
            delete existing[index].localId;
            localStorage.setItem(key, JSON.stringify(existing));
        }
    }
    
    // Queue management
    addToSyncQueue(operation) {
        this.syncQueue.push(operation);
        this.savePendingOperations();
    }
    
    savePendingOperations() {
        const key = `${this.options.storagePrefix}sync_queue`;
        localStorage.setItem(key, JSON.stringify(this.syncQueue));
    }
    
    loadPendingOperations() {
        const key = `${this.options.storagePrefix}sync_queue`;
        this.syncQueue = JSON.parse(localStorage.getItem(key) || '[]');
    }
    
    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    getLastSyncTimestamp() {
        const key = `${this.options.storagePrefix}last_sync`;
        return parseInt(localStorage.getItem(key) || '0');
    }
    
    saveLastSyncTimestamp() {
        const key = `${this.options.storagePrefix}last_sync`;
        localStorage.setItem(key, this.lastSyncTimestamp.toString());
    }
    
    // Public methods
    getSyncStatus() {
        return {
            isOnline: this.isOnline,
            pendingOperations: this.syncQueue.length,
            lastSync: new Date(this.lastSyncTimestamp),
            queueSize: this.syncQueue.length
        };
    }
    
    forcSync() {
        if (this.isOnline) {
            return this.performSync();
        }
        throw new Error('Cannot sync while offline');
    }
    
    clearLocalData(collection) {
        const key = `${this.options.storagePrefix}${collection}`;
        localStorage.removeItem(key);
    }
}

// Usage Example: Todo App with Offline Support
const syncManager = new OfflineDataSync({
    apiBaseUrl: '/api',
    syncInterval: 30000,
    conflictResolver: (conflict, serverData) => {
        // Custom conflict resolution
        if (conflict.type === 'UPDATE_CONFLICT') {
            // Merge strategy: combine local and server changes
            return {
                ...serverData,
                ...conflict.localData,
                updatedAt: new Date().toISOString(),
                conflictResolved: true
            };
        }
        return serverData;
    }
});

// Example usage
async function createTodo(text) {
    try {
        const todo = await syncManager.create('todos', {
            text,
            completed: false,
            priority: 'medium'
        });
        
        console.log('Todo created:', todo);
        return todo;
    } catch (error) {
        console.error('Failed to create todo:', error);
    }
}

async function updateTodo(id, updates) {
    try {
        const updated = await syncManager.update('todos', id, updates);
        console.log('Todo updated:', updated);
        return updated;
    } catch (error) {
        console.error('Failed to update todo:', error);
    }
}

async function getTodos() {
    try {
        const todos = await syncManager.read('todos');
        console.log('Todos loaded:', todos);
        return todos;
    } catch (error) {
        console.error('Failed to load todos:', error);
    }
}

// Monitor sync status
setInterval(() => {
    const status = syncManager.getSyncStatus();
    document.querySelector('#sync-status').textContent = 
        `${status.isOnline ? 'Online' : 'Offline'} - ${status.pendingOperations} pending`;
}, 1000);
```

### Problem 7: Performance Monitoring and Error Tracking   // "Good morning, Dr. Smith Jane!"
```

### Problem 4: Currying
Transform a function to accept arguments one at a time.

```javascript
// Solution
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...nextArgs) {
                return curried(...args, ...nextArgs);
            };
        }
    };
}

// Usage
function add(a, b, c) {
    return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

### Problem 5: Function Pipeline
Create a pipeline that processes data through multiple functions.

```javascript
// Solution
function pipeline(...functions) {
    return function(value) {
        return functions.reduce((acc, fn) => fn(acc), value);
    };
}

// Usage
const processNumber = pipeline(
    x => x + 1,           // Add 1
    x => x * 2,           // Multiply by 2
    x => Math.pow(x, 2),  // Square
    x => x - 10           // Subtract 10
);

console.log(processNumber(3)); // ((3 + 1) * 2)² - 10 = (4 * 2)² - 10 = 64 - 10 = 54
```

### Problem 6: Debounce Function
Create a function that delays execution until after a specified time.

```javascript
// Solution
function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Usage
function searchAPI(query) {
    console.log(`Searching for: ${query}`);
}

const debouncedSearch = debounce(searchAPI, 300);

// Only the last call will execute after 300ms
debouncedSearch("a");
debouncedSearch("ap");
debouncedSearch("app"); // Only this will execute
```

### Problem 7: Throttle Function
Limit function execution to once per specified time period.

```javascript
// Solution
function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage
function handleScroll() {
    console.log("Scroll event handled");
}

const throttledScroll = throttle(handleScroll, 100);

// Will execute at most once every 100ms
window.addEventListener('scroll', throttledScroll);
```

---

## 🎮 Practice Exercises

### Exercise 1: Function Factory
Create a function that generates specialized calculator functions.

```javascript
// Your solution here
function createCalculator(operation) {
    // Return appropriate function based on operation
}

// Should work like:
// const add = createCalculator('add');
// const multiply = createCalculator('multiply');
// console.log(add(5, 3)); // 8
// console.log(multiply(4, 2)); // 8
```

### Exercise 2: Advanced Closure
Create a function that manages a shopping cart.

```javascript
// Your solution here
function createShoppingCart() {
    // Implement cart functionality with closures
}

// Should work like:
// const cart = createShoppingCart();
// cart.addItem('apple', 2);
// cart.addItem('banana', 3);
// console.log(cart.getTotal()); // Returns total items
// console.log(cart.getItems()); // Returns all items
```

### Exercise 3: Function Chaining
Create a chainable calculator.

```javascript
// Your solution here
function Calculator(value) {
    // Implement chainable methods
}

// Should work like:
// Calculator(5).add(3).multiply(2).subtract(1).getValue(); // 15
```

---

## 🎯 Key Takeaways

### Function Best Practices
1. **Use descriptive names** for functions
2. **Keep functions small** and focused on one task
3. **Prefer pure functions** when possible
4. **Use arrow functions** for short, simple operations
5. **Leverage closures** for data privacy
6. **Use higher-order functions** for reusable logic

### Performance Considerations
- **Memoization** for expensive computations
- **Debouncing/Throttling** for event handlers
- **Function composition** for clean, reusable code
- **Avoid unnecessary closures** in loops

### Common Pitfalls
- **Hoisting confusion** with function expressions
- **this binding** differences in arrow functions
- **Memory leaks** with improperly managed closures
- **Overusing IIFE** when modules are available

---

## 📚 Additional Resources

- [MDN Functions Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [JavaScript.info Functions](https://javascript.info/function-basics)
- [Eloquent JavaScript - Functions](https://eloquentjavascript.net/03_functions.html)

---

**Happy Learning! 🚀**

Master these concepts through practice and experimentation!
