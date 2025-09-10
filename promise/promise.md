# JavaScript Promises - Complete Guide

## Table of Contents
1. [What is a Promise?](#what-is-a-promise)
2. [Promise States](#promise-states)
3. [Creating Promises](#creating-promises)
4. [Promise Methods](#promise-methods)
5. [Async/Await](#asyncawait)
6. [Error Handling](#error-handling)
7. [Real-Life Project Examples](#real-life-project-examples)
8. [Best Practices](#best-practices)

---

## What is a Promise?

A **Promise** is an object representing the eventual completion or failure of an asynchronous operation. It's a way to handle asynchronous code without falling into "callback hell".

### Real-World Analogy
Think of a promise like ordering food at a restaurant:
- You place an order (create a promise)
- The kitchen starts cooking (pending state)
- Either the food is ready (resolved/fulfilled) or something goes wrong (rejected)
- You get the food or an explanation of what went wrong

---

## Promise States

A Promise has three states:

1. **Pending** - Initial state, neither fulfilled nor rejected
2. **Fulfilled (Resolved)** - Operation completed successfully
3. **Rejected** - Operation failed

```javascript
// Example showing all states
const examplePromise = new Promise((resolve, reject) => {
    // Pending state initially
    console.log('Promise is pending...');
    
    setTimeout(() => {
        const success = Math.random() > 0.5;
        
        if (success) {
            resolve('Operation successful!'); // Fulfilled state
        } else {
            reject('Operation failed!'); // Rejected state
        }
    }, 2000);
});
```

---

## Creating Promises

### Basic Promise Creation

```javascript
// Method 1: Using Promise constructor
const myPromise = new Promise((resolve, reject) => {
    // Asynchronous operation
    const isSuccess = true;
    
    if (isSuccess) {
        resolve('Success data');
    } else {
        reject('Error message');
    }
});

// Method 2: Promise.resolve() for immediate resolution
const resolvedPromise = Promise.resolve('Immediate success');

// Method 3: Promise.reject() for immediate rejection
const rejectedPromise = Promise.reject('Immediate failure');
```

### Real Example: File Reading Simulation

```javascript
function readFilePromise(filename) {
    return new Promise((resolve, reject) => {
        console.log(`Starting to read ${filename}...`);
        
        // Simulate file reading delay
        setTimeout(() => {
            if (filename.endsWith('.txt')) {
                resolve(`Content of ${filename}: "Hello, World!"`);
            } else {
                reject(`Error: Cannot read ${filename}. Unsupported format.`);
            }
        }, 1500);
    });
}

// Usage
readFilePromise('document.txt')
    .then(content => console.log(content))
    .catch(error => console.error(error));
```

---

## Promise Methods

### .then() and .catch()

```javascript
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = { id: 1, name: 'John Doe', email: 'john@example.com' };
            resolve(data);
        }, 1000);
    });
};

fetchData()
    .then(data => {
        console.log('User data:', data);
        return data.name; // Return for chaining
    })
    .then(name => {
        console.log('User name:', name);
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        console.log('Operation completed');
    });
```

### Promise.all() - Wait for all promises

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise(resolve => setTimeout(() => resolve('foo'), 1000));
const promise3 = Promise.resolve(42);

Promise.all([promise1, promise2, promise3])
    .then(values => {
        console.log(values); // [3, 'foo', 42]
    })
    .catch(error => {
        console.error('One or more promises failed:', error);
    });
```

### Promise.allSettled() - Wait for all, regardless of outcome

```javascript
const promises = [
    Promise.resolve('Success 1'),
    Promise.reject('Error 1'),
    Promise.resolve('Success 2')
];

Promise.allSettled(promises)
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index + 1} succeeded:`, result.value);
            } else {
                console.log(`Promise ${index + 1} failed:`, result.reason);
            }
        });
    });
```

### Promise.race() - First to complete wins

```javascript
const slowPromise = new Promise(resolve => 
    setTimeout(() => resolve('Slow result'), 3000)
);

const fastPromise = new Promise(resolve => 
    setTimeout(() => resolve('Fast result'), 1000)
);

Promise.race([slowPromise, fastPromise])
    .then(result => {
        console.log('Winner:', result); // 'Fast result'
    });
```

---

## Async/Await

Modern way to work with promises using `async/await` syntax:

### Basic Async/Await

```javascript
// Converting promise-based code to async/await
async function fetchUserData(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

// Usage
async function displayUser() {
    try {
        const user = await fetchUserData(1);
        console.log('User:', user.name);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

displayUser();
```

### Parallel Execution with Async/Await

```javascript
async function fetchMultipleUsers() {
    try {
        // Sequential (slower)
        // const user1 = await fetchUserData(1);
        // const user2 = await fetchUserData(2);
        
        // Parallel (faster)
        const [user1, user2] = await Promise.all([
            fetchUserData(1),
            fetchUserData(2)
        ]);
        
        console.log('Users:', user1.name, user2.name);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}
```

---

## Error Handling

### Try-Catch with Async/Await

```javascript
async function robustDataFetcher(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            console.error('Network error:', error.message);
        } else {
            console.error('Fetch error:', error.message);
        }
        throw error; // Re-throw if needed
    }
}
```

### Promise Chain Error Handling

```javascript
fetchData()
    .then(data => {
        if (!data) {
            throw new Error('No data received');
        }
        return processData(data);
    })
    .then(processedData => {
        return saveData(processedData);
    })
    .catch(error => {
        console.error('Pipeline error:', error.message);
        // Handle error or provide fallback
        return { error: true, message: error.message };
    });
```

---

## Real-Life Project Examples

### 1. Weather App with API

```javascript
class WeatherApp {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }
    
    async getWeather(city) {
        try {
            const url = `${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather data not found for ${city}`);
            }
            
            const data = await response.json();
            return this.formatWeatherData(data);
        } catch (error) {
            throw new Error(`Failed to get weather: ${error.message}`);
        }
    }
    
    formatWeatherData(data) {
        return {
            city: data.name,
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };
    }
    
    async displayWeather(city) {
        try {
            console.log(`Fetching weather for ${city}...`);
            const weather = await this.getWeather(city);
            
            console.log(`Weather in ${weather.city}:`);
            console.log(`Temperature: ${weather.temperature}°C`);
            console.log(`Description: ${weather.description}`);
            console.log(`Humidity: ${weather.humidity}%`);
            console.log(`Wind Speed: ${weather.windSpeed} m/s`);
        } catch (error) {
            console.error('Weather Error:', error.message);
        }
    }
}

// Usage
const weatherApp = new WeatherApp('your-api-key');
weatherApp.displayWeather('London');
```

### 2. User Authentication System

```javascript
class AuthSystem {
    constructor() {
        this.users = new Map();
        this.sessions = new Map();
    }
    
    // Simulate user registration
    async registerUser(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const { username, email, password } = userData;
                
                if (this.users.has(username)) {
                    reject(new Error('Username already exists'));
                    return;
                }
                
                const user = {
                    id: Date.now(),
                    username,
                    email,
                    password: this.hashPassword(password),
                    createdAt: new Date()
                };
                
                this.users.set(username, user);
                resolve({ success: true, userId: user.id });
            }, 500);
        });
    }
    
    // Simulate user login
    async loginUser(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.users.get(username);
                
                if (!user || user.password !== this.hashPassword(password)) {
                    reject(new Error('Invalid credentials'));
                    return;
                }
                
                const sessionToken = this.generateToken();
                this.sessions.set(sessionToken, {
                    userId: user.id,
                    username: user.username,
                    loginTime: new Date()
                });
                
                resolve({ token: sessionToken, user: { id: user.id, username: user.username } });
            }, 800);
        });
    }
    
    // Simulate token validation
    async validateSession(token) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const session = this.sessions.get(token);
                
                if (!session) {
                    reject(new Error('Invalid or expired session'));
                    return;
                }
                
                resolve(session);
            }, 200);
        });
    }
    
    hashPassword(password) {
        // Simple hash simulation (use proper hashing in real apps)
        return btoa(password + 'salt');
    }
    
    generateToken() {
        return Math.random().toString(36).substr(2) + Date.now().toString(36);
    }
}

// Usage Example
async function authFlow() {
    const auth = new AuthSystem();
    
    try {
        // Register user
        console.log('Registering user...');
        await auth.registerUser({
            username: 'johndoe',
            email: 'john@example.com',
            password: 'password123'
        });
        console.log('User registered successfully!');
        
        // Login user
        console.log('Logging in...');
        const loginResult = await auth.loginUser('johndoe', 'password123');
        console.log('Login successful!', loginResult.user);
        
        // Validate session
        console.log('Validating session...');
        const session = await auth.validateSession(loginResult.token);
        console.log('Session valid for user:', session.username);
        
    } catch (error) {
        console.error('Auth Error:', error.message);
    }
}

authFlow();
```

### 3. File Upload with Progress

```javascript
class FileUploader {
    constructor(uploadEndpoint) {
        this.uploadEndpoint = uploadEndpoint;
    }
    
    async uploadFile(file, onProgress) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            
            const xhr = new XMLHttpRequest();
            
            // Progress tracking
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    onProgress && onProgress(Math.round(percentComplete));
                }
            });
            
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Invalid response format'));
                    }
                } else {
                    reject(new Error(`Upload failed with status: ${xhr.status}`));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });
            
            xhr.open('POST', this.uploadEndpoint);
            xhr.send(formData);
        });
    }
    
    async uploadMultipleFiles(files, onOverallProgress) {
        const uploadPromises = files.map((file, index) => {
            return this.uploadFile(file, (progress) => {
                console.log(`File ${index + 1} progress: ${progress}%`);
            });
        });
        
        try {
            const results = await Promise.allSettled(uploadPromises);
            
            const successful = results.filter(r => r.status === 'fulfilled');
            const failed = results.filter(r => r.status === 'rejected');
            
            console.log(`Upload complete: ${successful.length} successful, ${failed.length} failed`);
            
            return {
                successful: successful.map(r => r.value),
                failed: failed.map(r => r.reason.message)
            };
        } catch (error) {
            throw new Error(`Batch upload failed: ${error.message}`);
        }
    }
}

// Usage
const uploader = new FileUploader('/api/upload');

// Simulate file upload
async function simulateFileUpload() {
    // Create mock file objects
    const files = [
        new File(['content1'], 'file1.txt', { type: 'text/plain' }),
        new File(['content2'], 'file2.txt', { type: 'text/plain' })
    ];
    
    try {
        const results = await uploader.uploadMultipleFiles(files);
        console.log('Upload results:', results);
    } catch (error) {
        console.error('Upload error:', error.message);
    }
}
```

### 4. Database-like Operations

```javascript
class SimpleDB {
    constructor() {
        this.data = new Map();
    }
    
    // Create
    async create(table, record) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.data.has(table)) {
                    this.data.set(table, new Map());
                }
                
                const id = Date.now().toString();
                const recordWithId = { ...record, id, createdAt: new Date() };
                
                this.data.get(table).set(id, recordWithId);
                resolve(recordWithId);
            }, 100);
        });
    }
    
    // Read
    async findById(table, id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const tableData = this.data.get(table);
                if (!tableData || !tableData.has(id)) {
                    reject(new Error(`Record with id ${id} not found in ${table}`));
                    return;
                }
                
                resolve(tableData.get(id));
            }, 50);
        });
    }
    
    // Read all
    async findAll(table) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const tableData = this.data.get(table);
                if (!tableData) {
                    resolve([]);
                    return;
                }
                
                resolve(Array.from(tableData.values()));
            }, 75);
        });
    }
    
    // Update
    async update(table, id, updates) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const tableData = this.data.get(table);
                if (!tableData || !tableData.has(id)) {
                    reject(new Error(`Record with id ${id} not found in ${table}`));
                    return;
                }
                
                const existing = tableData.get(id);
                const updated = { ...existing, ...updates, updatedAt: new Date() };
                tableData.set(id, updated);
                
                resolve(updated);
            }, 100);
        });
    }
    
    // Delete
    async delete(table, id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const tableData = this.data.get(table);
                if (!tableData || !tableData.has(id)) {
                    reject(new Error(`Record with id ${id} not found in ${table}`));
                    return;
                }
                
                tableData.delete(id);
                resolve({ success: true, deletedId: id });
            }, 75);
        });
    }
}

// Usage Example
async function databaseDemo() {
    const db = new SimpleDB();
    
    try {
        // Create users
        console.log('Creating users...');
        const user1 = await db.create('users', { name: 'John Doe', email: 'john@example.com' });
        const user2 = await db.create('users', { name: 'Jane Smith', email: 'jane@example.com' });
        
        console.log('Users created:', user1, user2);
        
        // Read all users
        const allUsers = await db.findAll('users');
        console.log('All users:', allUsers);
        
        // Update user
        const updatedUser = await db.update('users', user1.id, { name: 'John Updated' });
        console.log('Updated user:', updatedUser);
        
        // Find specific user
        const foundUser = await db.findById('users', user2.id);
        console.log('Found user:', foundUser);
        
        // Delete user
        await db.delete('users', user1.id);
        console.log('User deleted');
        
        // Verify deletion
        const remainingUsers = await db.findAll('users');
        console.log('Remaining users:', remainingUsers);
        
    } catch (error) {
        console.error('Database Error:', error.message);
    }
}

databaseDemo();
```

---

## Best Practices

### 1. Always Handle Errors

```javascript
// ❌ Bad: No error handling
fetchData().then(data => console.log(data));

// ✅ Good: Proper error handling
fetchData()
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

// ✅ Better: With async/await
async function safeFetchData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### 2. Avoid Promise Constructor Anti-pattern

```javascript
// ❌ Bad: Unnecessary Promise wrapper
function badAsync() {
    return new Promise((resolve, reject) => {
        someAsyncFunction()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

// ✅ Good: Return promise directly
function goodAsync() {
    return someAsyncFunction();
}
```

### 3. Use Promise.all for Parallel Operations

```javascript
// ❌ Bad: Sequential execution
async function sequentialRequests() {
    const user = await fetchUser();
    const posts = await fetchPosts();
    const comments = await fetchComments();
    return { user, posts, comments };
}

// ✅ Good: Parallel execution
async function parallelRequests() {
    const [user, posts, comments] = await Promise.all([
        fetchUser(),
        fetchPosts(),
        fetchComments()
    ]);
    return { user, posts, comments };
}
```

### 4. Set Timeouts for Long Operations

```javascript
function withTimeout(promise, timeoutMs) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
    });
    
    return Promise.race([promise, timeout]);
}

// Usage
try {
    const data = await withTimeout(fetchData(), 5000); // 5 second timeout
    console.log(data);
} catch (error) {
    console.error('Error or timeout:', error.message);
}
```

### 5. Use Finally for Cleanup

```javascript
async function dataOperation() {
    let loading = true;
    showLoadingSpinner();
    
    try {
        const data = await fetchData();
        displayData(data);
        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    } finally {
        hideLoadingSpinner();
        loading = false;
    }
}
```

---

## Common Patterns and Utilities

### Retry Logic

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }
            
            console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Usage
const result = await retry(() => fetchUnreliableData(), 3, 2000);
```

### Promise Queue

```javascript
class PromiseQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }
    
    add(promiseFunction) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promiseFunction,
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
        const { promiseFunction, resolve, reject } = this.queue.shift();
        
        try {
            const result = await promiseFunction();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.running--;
            this.process();
        }
    }
}

// Usage
const queue = new PromiseQueue(2); // Max 2 concurrent operations

const results = await Promise.all([
    queue.add(() => fetchData(1)),
    queue.add(() => fetchData(2)),
    queue.add(() => fetchData(3)),
    queue.add(() => fetchData(4))
]);
```

---

## Summary

Promises are essential for handling asynchronous operations in JavaScript. Key takeaways:

1. **Three States**: Pending, Fulfilled, Rejected
2. **Methods**: `.then()`, `.catch()`, `.finally()`
3. **Static Methods**: `Promise.all()`, `Promise.race()`, `Promise.allSettled()`
4. **Modern Syntax**: `async/await` for cleaner code
5. **Error Handling**: Always handle errors properly
6. **Performance**: Use `Promise.all()` for parallel operations

Practice with the real-life examples above to master promise-based programming!