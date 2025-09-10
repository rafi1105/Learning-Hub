# JavaScript Objects - Complete Study Guide



## Table of Contents

1. [Object Basics](#object-basics)
2. [Object Property Access](#object-property-access)
3. [Dynamic Properties](#dynamic-properties)
4. [Object Destructuring](#object-destructuring)
5. [Object Iteration](#object-iteration)
6. [Object Methods](#object-methods)
7. [Object Copying](#object-copying)
8. [Optional Chaining](#optional-chaining)
9. [Real-World Projects](#real-world-projects)
10. [Advanced Object Patterns](#advanced-object-patterns)
11. [Practice Exercises](#practice-exercises)

---

## 🎯 Object Basics

### Object Creation and Structure
```javascript
let role = "admin";
let obj = {
    name: "rafi",
    age: 45,
    food: {
        morning: "singara",
        lunch: {
            outdoor: "teheri",
            home: "khicuri"
        }
    },
    [role]: "rafi"  // Dynamic property using variable
};
```

### Object Properties Types
```javascript
const person = {
    // String key
    firstName: "John",
    
    // Number key (converted to string)
    123: "numeric key",
    
    // Symbol key
    [Symbol('id')]: 'unique-id',
    
    // Method
    greet: function() {
        return `Hello, I'm ${this.firstName}`;
    },
    
    // Arrow function (no 'this' binding)
    arrowGreet: () => "Hello from arrow function"
};
```

---

## 🔑 Object Property Access

### Dot Notation vs Bracket Notation
```javascript
let aa = "name";

// Dot notation - for known property names
obj.name;           // "rafi"
obj.age;            // 45

// Bracket notation - for dynamic property names
obj[aa];            // "rafi" (uses value of variable aa)
obj["name"];        // "rafi"
obj[role];          // "rafi" (dynamic property)

// Deep property access
console.log(obj.food.lunch.outdoor);  // "teheri"
```

### When to Use Each Method
```javascript
const user = {
    name: "Alice",
    "full-name": "Alice Johnson",  // Hyphenated key
    123: "numeric key",
    "user role": "developer"       // Spaced key
};

// Must use bracket notation for special characters
console.log(user["full-name"]);   // "Alice Johnson"
console.log(user["user role"]);   // "developer"
console.log(user[123]);           // "numeric key"

// Dot notation for simple identifiers
console.log(user.name);           // "Alice"
```

---

## 🔄 Dynamic Properties

### Computed Property Names
```javascript
const prefix = "user";
const id = 123;

const userObj = {
    [prefix + "_" + id]: "John Doe",
    [`${prefix}Email`]: "john@example.com",
    [new Date().getTime()]: "timestamp property"
};

console.log(userObj.user_123);        // "John Doe"
console.log(userObj.userEmail);       // "john@example.com"
```

### Dynamic Property Assignment
```javascript
const config = {};
const environment = "production";

// Dynamic assignment
config[environment + "_api"] = "https://api.prod.com";
config[environment + "_debug"] = false;

console.log(config.production_api);   // "https://api.prod.com"
console.log(config.production_debug); // false
```

---

## 📦 Object Destructuring

### Basic Destructuring
```javascript
// From your example
let {lunch, morning} = obj.food;
console.log(lunch);   // { outdoor: "teheri", home: "khicuri" }
console.log(morning); // "singara"
```

### Advanced Destructuring Patterns
```javascript
const person = {
    name: "John",
    age: 30,
    address: {
        street: "123 Main St",
        city: "New York",
        country: "USA"
    },
    hobbies: ["reading", "gaming"]
};

// Nested destructuring
const {
    name,
    age,
    address: { city, country },
    hobbies: [firstHobby, secondHobby]
} = person;

console.log(name);        // "John"
console.log(city);        // "New York"
console.log(firstHobby);  // "reading"

// Renaming variables
const { name: personName, age: personAge } = person;
console.log(personName);  // "John"

// Default values
const { salary = 50000, bonus = 0 } = person;
console.log(salary);      // 50000 (default)

// Rest operator in destructuring
const { name: userName, ...otherDetails } = person;
console.log(otherDetails); // { age: 30, address: {...}, hobbies: [...] }
```

---

## 🔄 Object Iteration

### For...in Loop
```javascript
// From your example
for (let key in obj) {
    console.log(key);                    // show the key name only
    console.log(key, ":", obj[key]);     // key-value pairs
}
```

### Modern Iteration Methods
```javascript
const product = {
    name: "Laptop",
    price: 999,
    brand: "TechCorp",
    inStock: true
};

// Object.keys() - get all keys as array
const keys = Object.keys(product);
console.log(keys); // ["name", "price", "brand", "inStock"]

// Object.values() - get all values as array
const values = Object.values(product);
console.log(values); // ["Laptop", 999, "TechCorp", true]

// Object.entries() - get key-value pairs as array
const entries = Object.entries(product);
console.log(entries); 
// [["name", "Laptop"], ["price", 999], ["brand", "TechCorp"], ["inStock", true]]

// forEach with entries
Object.entries(product).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});

// Filter object properties
const expensiveProducts = Object.fromEntries(
    Object.entries(product).filter(([key, value]) => 
        key === 'price' && value > 500
    )
);
```

---

## 🛠️ Object Methods

### Object.assign() - Shallow Copy
```javascript
// From your example
let obj3 = Object.assign({price: Infinity}, obj);
```

### Comprehensive Object Methods
```javascript
const target = { a: 1, b: 2 };
const source1 = { b: 3, c: 4 };
const source2 = { c: 5, d: 6 };

// Object.assign() - merge objects
const merged = Object.assign({}, target, source1, source2);
console.log(merged); // { a: 1, b: 3, c: 5, d: 6 }

// Object.freeze() - make object immutable
const frozenObj = Object.freeze({ name: "John" });
frozenObj.name = "Jane"; // Won't work
console.log(frozenObj.name); // "John"

// Object.seal() - prevent adding/removing properties
const sealedObj = Object.seal({ name: "John" });
sealedObj.name = "Jane";     // Works
sealedObj.age = 30;          // Won't work
delete sealedObj.name;       // Won't work

// Object.defineProperty() - define property with descriptors
Object.defineProperty(target, 'secret', {
    value: 'hidden',
    writable: false,
    enumerable: false,
    configurable: false
});
```

---

## 📋 Object Copying

### Shallow Copy vs Deep Copy
```javascript
// Shallow copy with spread operator
let obj2 = {...obj}; 
obj2.food.morning = "samusa"; // This changes original obj too!

// Shallow copy with Object.assign()
let obj3 = Object.assign({}, obj);
obj3.food.morning = "paratha"; // This also changes original obj!
```

### Deep Cloning Methods
```javascript
// Method 1: JSON.stringify/parse (your example - fixed)
let jsonString = JSON.stringify(obj);
let deepClone = JSON.parse(jsonString);

deepClone.food.morning = "samusa";
console.log("Original:", obj.food.morning);     // "singara" (unchanged)
console.log("Clone:", deepClone.food.morning);  // "samusa"

// Method 2: Recursive deep clone function
function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === "object") {
        const clonedObj = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

// Method 3: Using structuredClone (modern browsers)
const modernDeepClone = structuredClone(obj);

// Method 4: Using Lodash library
// const _ = require('lodash');
// const lodashClone = _.cloneDeep(obj);
```

### Comparison of Cloning Methods
```javascript
const testObj = {
    number: 42,
    string: "hello",
    date: new Date(),
    array: [1, 2, 3],
    nested: { deep: { value: "test" } },
    func: function() { return "function"; },
    symbol: Symbol('test'),
    undefined: undefined,
    null: null
};

// JSON method limitations
const jsonClone = JSON.parse(JSON.stringify(testObj));
// Loses: functions, symbols, undefined values, Date objects become strings

// Custom deep clone preserves most types
const customClone = deepClone(testObj);
// Preserves: most types except functions and symbols
```

---

## ❓ Optional Chaining

### Safe Property Access
```javascript
// From your example
obj?.food?.morning; // Safe access - won't throw error if any part is null/undefined
```

### Comprehensive Optional Chaining Examples
```javascript
const user = {
    profile: {
        address: {
            street: "123 Main St"
        }
    },
    contacts: [
        { type: "email", value: "user@example.com" },
        { type: "phone", value: "123-456-7890" }
    ],
    getFullName: function() {
        return this.firstName + " " + this.lastName;
    }
};

// Safe property access
console.log(user?.profile?.address?.street);     // "123 Main St"
console.log(user?.profile?.address?.zipCode);    // undefined (no error)
console.log(user?.company?.name);                // undefined (no error)

// Safe array access
console.log(user?.contacts?.[0]?.value);         // "user@example.com"
console.log(user?.contacts?.[10]?.value);        // undefined (no error)

// Safe method calls
console.log(user?.getFullName?.());              // Calls if method exists
console.log(user?.getNickname?.());              // undefined (no error)

// Nullish coalescing with optional chaining
const street = user?.profile?.address?.street ?? "No address provided";
const zipCode = user?.profile?.address?.zipCode ?? "No zip code";
```

---

## 🏗️ Real-World Projects

### Project 1: E-Commerce Shopping Cart
```javascript
class ShoppingCart {
    constructor() {
        this.items = {};
        this.discounts = {};
        this.taxRate = 0.08;
    }
    
    addItem(product) {
        const { id, name, price, quantity = 1 } = product;
        
        if (this.items[id]) {
            this.items[id].quantity += quantity;
        } else {
            this.items[id] = { id, name, price, quantity };
        }
        
        return this.items[id];
    }
    
    removeItem(productId) {
        if (this.items[productId]) {
            delete this.items[productId];
            return true;
        }
        return false;
    }
    
    updateQuantity(productId, newQuantity) {
        if (this.items[productId]) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                this.items[productId].quantity = newQuantity;
            }
            return true;
        }
        return false;
    }
    
    applyDiscount(discountCode, percentage) {
        this.discounts[discountCode] = percentage;
    }
    
    getSubtotal() {
        return Object.values(this.items).reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    getDiscountAmount() {
        const subtotal = this.getSubtotal();
        const totalDiscountPercentage = Object.values(this.discounts)
            .reduce((total, discount) => total + discount, 0);
        
        return subtotal * (Math.min(totalDiscountPercentage, 100) / 100);
    }
    
    getTax() {
        const discountedTotal = this.getSubtotal() - this.getDiscountAmount();
        return discountedTotal * this.taxRate;
    }
    
    getTotal() {
        return this.getSubtotal() - this.getDiscountAmount() + this.getTax();
    }
    
    getSummary() {
        return {
            items: Object.values(this.items),
            itemCount: Object.keys(this.items).length,
            subtotal: this.getSubtotal(),
            discounts: this.getDiscountAmount(),
            tax: this.getTax(),
            total: this.getTotal()
        };
    }
}

// Usage
const cart = new ShoppingCart();

cart.addItem({ id: 1, name: "Laptop", price: 999.99, quantity: 1 });
cart.addItem({ id: 2, name: "Mouse", price: 29.99, quantity: 2 });
cart.addItem({ id: 3, name: "Keyboard", price: 79.99, quantity: 1 });

cart.applyDiscount("SAVE10", 10);
cart.applyDiscount("NEWUSER", 5);

console.log(cart.getSummary());
```

### Project 2: User Management System
```javascript
class UserManager {
    constructor() {
        this.users = new Map();
        this.sessions = new Map();
        this.roles = {
            admin: { permissions: ['read', 'write', 'delete', 'manage'] },
            editor: { permissions: ['read', 'write'] },
            viewer: { permissions: ['read'] }
        };
    }
    
    createUser(userData) {
        const {
            email,
            password,
            firstName,
            lastName,
            role = 'viewer',
            profile = {}
        } = userData;
        
        if (this.users.has(email)) {
            throw new Error("User already exists");
        }
        
        const user = {
            id: this.generateId(),
            email,
            password: this.hashPassword(password),
            firstName,
            lastName,
            role,
            profile: {
                avatar: null,
                bio: '',
                preferences: {
                    theme: 'light',
                    notifications: true,
                    language: 'en'
                },
                ...profile
            },
            metadata: {
                createdAt: new Date(),
                lastLogin: null,
                loginCount: 0,
                isActive: true
            }
        };
        
        this.users.set(email, user);
        return this.sanitizeUser(user);
    }
    
    authenticateUser(email, password) {
        const user = this.users.get(email);
        
        if (!user || !user.metadata.isActive) {
            throw new Error("Invalid credentials");
        }
        
        if (!this.verifyPassword(password, user.password)) {
            throw new Error("Invalid credentials");
        }
        
        // Update login metadata
        user.metadata.lastLogin = new Date();
        user.metadata.loginCount += 1;
        
        // Create session
        const sessionId = this.generateSessionId();
        this.sessions.set(sessionId, {
            userId: user.id,
            email: user.email,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });
        
        return {
            user: this.sanitizeUser(user),
            sessionId,
            permissions: this.roles[user.role]?.permissions || []
        };
    }
    
    updateUserProfile(email, updates) {
        const user = this.users.get(email);
        if (!user) {
            throw new Error("User not found");
        }
        
        // Deep merge profile updates
        user.profile = this.deepMerge(user.profile, updates.profile || {});
        
        // Update other fields
        Object.keys(updates).forEach(key => {
            if (key !== 'profile' && key !== 'password' && key !== 'id') {
                user[key] = updates[key];
            }
        });
        
        return this.sanitizeUser(user);
    }
    
    getUsersByRole(role) {
        return Array.from(this.users.values())
            .filter(user => user.role === role)
            .map(user => this.sanitizeUser(user));
    }
    
    searchUsers(query) {
        const searchTerm = query.toLowerCase();
        return Array.from(this.users.values())
            .filter(user => {
                const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                return fullName.includes(searchTerm) || 
                       user.email.toLowerCase().includes(searchTerm);
            })
            .map(user => this.sanitizeUser(user));
    }
    
    // Utility methods
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }
    
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    generateSessionId() {
        return Math.random().toString(36).substr(2, 16);
    }
    
    hashPassword(password) {
        // Simplified - use proper hashing in production
        return btoa(password);
    }
    
    verifyPassword(password, hash) {
        return btoa(password) === hash;
    }
    
    deepMerge(target, source) {
        const result = { ...target };
        
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        });
        
        return result;
    }
}

// Usage
const userManager = new UserManager();

// Create users
const admin = userManager.createUser({
    email: "admin@example.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    profile: {
        bio: "System administrator",
        preferences: {
            theme: "dark",
            notifications: true
        }
    }
});

const editor = userManager.createUser({
    email: "editor@example.com",
    password: "editor123",
    firstName: "Editor",
    lastName: "User",
    role: "editor"
});

// Authenticate
const authResult = userManager.authenticateUser("admin@example.com", "admin123");
console.log("Authenticated:", authResult);

// Search users
const searchResults = userManager.searchUsers("admin");
console.log("Search results:", searchResults);
```

### Project 3: Configuration Manager
```javascript
class ConfigManager {
    constructor() {
        this.config = {};
        this.environment = process?.env?.NODE_ENV || 'development';
        this.watchers = new Map();
    }
    
    loadConfig(configObject) {
        this.config = this.deepMerge(this.config, configObject);
        this.notifyWatchers();
    }
    
    get(path, defaultValue = null) {
        return this.getNestedValue(this.config, path) ?? defaultValue;
    }
    
    set(path, value) {
        this.setNestedValue(this.config, path, value);
        this.notifyWatchers(path);
    }
    
    has(path) {
        return this.getNestedValue(this.config, path) !== undefined;
    }
    
    delete(path) {
        this.deleteNestedValue(this.config, path);
        this.notifyWatchers(path);
    }
    
    watch(path, callback) {
        if (!this.watchers.has(path)) {
            this.watchers.set(path, new Set());
        }
        this.watchers.get(path).add(callback);
        
        // Return unwatch function
        return () => {
            const pathWatchers = this.watchers.get(path);
            if (pathWatchers) {
                pathWatchers.delete(callback);
                if (pathWatchers.size === 0) {
                    this.watchers.delete(path);
                }
            }
        };
    }
    
    getEnvironmentConfig(env = this.environment) {
        return this.get(`environments.${env}`, {});
    }
    
    mergeEnvironmentConfig() {
        const envConfig = this.getEnvironmentConfig();
        this.config = this.deepMerge(this.config, envConfig);
    }
    
    validate(schema) {
        const errors = [];
        
        Object.entries(schema).forEach(([path, rules]) => {
            const value = this.get(path);
            
            if (rules.required && (value === null || value === undefined)) {
                errors.push(`${path} is required`);
            }
            
            if (value !== null && value !== undefined) {
                if (rules.type && typeof value !== rules.type) {
                    errors.push(`${path} must be of type ${rules.type}`);
                }
                
                if (rules.min && value < rules.min) {
                    errors.push(`${path} must be at least ${rules.min}`);
                }
                
                if (rules.max && value > rules.max) {
                    errors.push(`${path} must be at most ${rules.max}`);
                }
                
                if (rules.enum && !rules.enum.includes(value)) {
                    errors.push(`${path} must be one of: ${rules.enum.join(', ')}`);
                }
            }
        });
        
        return errors;
    }
    
    // Utility methods
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }
    
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            return current[key];
        }, obj);
        
        target[lastKey] = value;
    }
    
    deleteNestedValue(obj, path) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            return current && current[key] ? current[key] : null;
        }, obj);
        
        if (target && typeof target === 'object') {
            delete target[lastKey];
        }
    }
    
    deepMerge(target, source) {
        const result = { ...target };
        
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        });
        
        return result;
    }
    
    notifyWatchers(changedPath = null) {
        this.watchers.forEach((callbacks, path) => {
            if (!changedPath || changedPath.startsWith(path) || path.startsWith(changedPath)) {
                callbacks.forEach(callback => {
                    try {
                        callback(this.get(path), path);
                    } catch (error) {
                        console.error(`Error in config watcher for ${path}:`, error);
                    }
                });
            }
        });
    }
}

// Usage
const config = new ConfigManager();

// Load configuration
config.loadConfig({
    app: {
        name: "MyApp",
        version: "1.0.0",
        port: 3000
    },
    database: {
        host: "localhost",
        port: 5432,
        name: "myapp_db"
    },
    environments: {
        development: {
            app: { port: 3001 },
            database: { name: "myapp_dev" }
        },
        production: {
            app: { port: 80 },
            database: { host: "prod-db.example.com" }
        }
    }
});

// Watch for changes
const unwatch = config.watch('app.port', (value, path) => {
    console.log(`Port changed to: ${value}`);
});

// Get values
console.log(config.get('app.name'));        // "MyApp"
console.log(config.get('app.timeout', 30)); // 30 (default value)

// Set values
config.set('app.port', 4000);

// Validate configuration
const schema = {
    'app.name': { required: true, type: 'string' },
    'app.port': { required: true, type: 'number', min: 1, max: 65535 },
    'app.environment': { required: false, enum: ['development', 'production', 'test'] }
};

const errors = config.validate(schema);
console.log('Validation errors:', errors);
```

---

## 🔧 Advanced Object Patterns

### Proxy Pattern for Dynamic Objects
```javascript
function createSmartObject(target = {}) {
    return new Proxy(target, {
        get(obj, prop) {
            // Log property access
            console.log(`Accessing property: ${prop}`);
            
            // Return default values for missing properties
            if (!(prop in obj)) {
                if (prop.startsWith('is')) return false;
                if (prop.startsWith('get')) return () => null;
                return undefined;
            }
            
            return obj[prop];
        },
        
        set(obj, prop, value) {
            // Validate before setting
            if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
                throw new Error('Age must be a positive number');
            }
            
            console.log(`Setting ${prop} to ${value}`);
            obj[prop] = value;
            return true;
        },
        
        has(obj, prop) {
            return prop in obj || prop.startsWith('is') || prop.startsWith('get');
        }
    });
}

// Usage
const smartUser = createSmartObject({ name: 'John' });
console.log(smartUser.name);        // "John"
console.log(smartUser.isActive);    // false (default)
smartUser.age = 30;                 // Logs: "Setting age to 30"
```

### Observer Pattern with Objects
```javascript
class Observable {
    constructor() {
        this.observers = {};
        this.data = {};
    }
    
    subscribe(event, callback) {
        if (!this.observers[event]) {
            this.observers[event] = [];
        }
        this.observers[event].push(callback);
        
        return () => {
            this.observers[event] = this.observers[event].filter(cb => cb !== callback);
        };
    }
    
    notify(event, data) {
        if (this.observers[event]) {
            this.observers[event].forEach(callback => callback(data));
        }
    }
    
    set(key, value) {
        const oldValue = this.data[key];
        this.data[key] = value;
        
        this.notify('change', { key, value, oldValue });
        this.notify(`change:${key}`, { value, oldValue });
    }
    
    get(key) {
        return this.data[key];
    }
}

// Usage
const observable = new Observable();

observable.subscribe('change', ({ key, value }) => {
    console.log(`Property ${key} changed to ${value}`);
});

observable.subscribe('change:username', ({ value }) => {
    console.log(`Username is now: ${value}`);
});

observable.set('username', 'john_doe');  // Triggers both subscribers
```

---

## 🎮 Practice Exercises

### Exercise 1: Product Catalog Manager
```javascript
/*
Create a ProductCatalog class that manages products with the following features:
- Add/remove/update products
- Search products by name, category, or price range
- Apply filters and sorting
- Generate product reports
*/

class ProductCatalog {
    constructor() {
        this.products = new Map();
        this.categories = new Set();
    }
    
    // Your implementation here
    addProduct(product) {
        // Implement adding a product
        // Product should have: id, name, price, category, description, inStock
    }
    
    searchProducts(query) {
        // Implement search functionality
    }
    
    filterByCategory(category) {
        // Filter products by category
    }
    
    filterByPriceRange(min, max) {
        // Filter products by price range
    }
    
    getReport() {
        // Generate summary report
    }
}

// Test your implementation
const catalog = new ProductCatalog();
// Add test data and verify functionality
```

### Exercise 2: Event Management System
```javascript
/*
Create an EventManager that handles event registration, attendee management,
and provides analytics about events.
*/

class EventManager {
    constructor() {
        this.events = {};
        this.attendees = {};
    }
    
    // Your implementation here
    createEvent(eventData) {
        // Create new event with validation
    }
    
    registerAttendee(eventId, attendeeData) {
        // Register attendee for event
    }
    
    getEventAnalytics(eventId) {
        // Return event statistics
    }
    
    findEventsByDate(date) {
        // Find events on specific date
    }
}
```

### Exercise 3: Cache Manager with TTL
```javascript
/*
Create a CacheManager that stores data with expiration times and provides
automatic cleanup.
*/

class CacheManager {
    constructor() {
        this.cache = new Map();
        this.timers = new Map();
    }
    
    // Your implementation here
    set(key, value, ttl = 60000) {
        // Set cache with TTL (time to live)
    }
    
    get(key) {
        // Get cached value if not expired
    }
    
    delete(key) {
        // Delete cache entry
    }
    
    clear() {
        // Clear all cache
    }
    
    getStats() {
        // Return cache statistics
    }
}
```

---

## 🎯 Key Takeaways

### Object Best Practices
1. **Use meaningful property names**
2. **Prefer const for object references**
3. **Use optional chaining for safe access**
4. **Choose appropriate copying method**
5. **Validate object structure when needed**

### Performance Considerations
- **Object.keys()** vs **for...in** loops
- **Map vs Object** for dynamic keys
- **WeakMap** for private data
- **Avoid deep nesting** when possible

### Common Pitfalls
- **Shallow vs deep copying confusion**
- **Reference vs value assignment**
- **Property enumeration differences**
- **this binding in methods**

### Modern JavaScript Features
- **Optional chaining** (?.)
- **Nullish coalescing** (??)
- **Object.fromEntries()** and **Object.entries()**
- **Proxy** for advanced object behavior

---

## 📚 Additional Resources

- [MDN Object Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [JavaScript.info Objects](https://javascript.info/object)
- [Exploring JS Objects](https://exploringjs.com/impatient-js/ch_objects.html)

---

**Happy Learning! 🚀**

Master JavaScript objects through practice and real-world applications!
