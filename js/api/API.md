# API Integration in JavaScript

## Table of Contents
1. [Introduction to API Integration](#introduction-to-api-integration)
2. [Beginner Concepts](#beginner-concepts)
3. [Intermediate Concepts](#intermediate-concepts)
4. [Advanced Concepts](#advanced-concepts)
5. [Real-World Examples](#real-world-examples)
6. [Best Practices](#best-practices)

## Introduction to API Integration

API (Application Programming Interface) integration is the process of connecting different software applications to exchange data and functionality. In JavaScript, we primarily work with REST APIs, GraphQL APIs, and WebSocket connections to build dynamic, data-driven applications.

### Key Concepts:
- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH
- **Status Codes**: 200 (OK), 404 (Not Found), 500 (Server Error)
- **Request/Response Cycle**: Client sends request, server responds with data
- **Authentication**: API keys, tokens, OAuth
- **Data Formats**: JSON, XML, form data

## Beginner Concepts

### 1. Basic Fetch API (Beginner)

```javascript
// Simple GET request
async function fetchUserData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        console.log('User data:', userData);
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Call the function
fetchUserData();

// Using .then() syntax (alternative approach)
fetch('https://jsonplaceholder.typicode.com/users/1')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log('User data:', data))
    .catch(error => console.error('Error:', error));
```

### 2. POST Requests with Data (Beginner)

```javascript
// Creating a new post
async function createPost(postData) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newPost = await response.json();
        console.log('New post created:', newPost);
        return newPost;
    } catch (error) {
        console.error('Error creating post:', error);
    }
}

// Usage
const newPostData = {
    title: 'My New Post',
    body: 'This is the content of my new post.',
    userId: 1
};

createPost(newPostData);
```

### 3. Handling Different Response Types (Beginner)

```javascript
// Handling JSON response
async function fetchJSON(url) {
    const response = await fetch(url);
    return response.json();
}

// Handling text response
async function fetchText(url) {
    const response = await fetch(url);
    return response.text();
}

// Handling blob (binary data)
async function fetchImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

// Usage examples
fetchJSON('https://api.github.com/users/octocat')
    .then(data => console.log('GitHub user:', data));

fetchText('https://raw.githubusercontent.com/octocat/Hello-World/master/README')
    .then(text => console.log('README content:', text));
```

### 4. Query Parameters and Headers (Beginner)

```javascript
// Building URLs with query parameters
function buildURL(baseUrl, params) {
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });
    return url.toString();
}

// Search GitHub repositories
async function searchRepositories(query, sort = 'stars') {
    const url = buildURL('https://api.github.com/search/repositories', {
        q: query,
        sort: sort,
        order: 'desc',
        per_page: 10
    });
    
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'MyApp/1.0'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error searching repositories:', error);
        return [];
    }
}

// Usage
searchRepositories('javascript')
    .then(repos => {
        repos.forEach(repo => {
            console.log(`${repo.name}: ${repo.stars_count} stars`);
        });
    });
```

### 5. Error Handling Patterns (Beginner)

```javascript
// Generic API error handler
class APIError extends Error {
    constructor(message, statusCode, response) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.response = response;
    }
}

async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new APIError(
                `API call failed: ${response.statusText}`,
                response.status,
                errorData
            );
        }
        
        return await response.json();
    } catch (error) {
        if (error instanceof APIError) {
            console.error('API Error:', error.message, 'Status:', error.statusCode);
        } else {
            console.error('Network Error:', error.message);
        }
        throw error;
    }
}

// Usage with specific error handling
async function getUserWithErrorHandling(userId) {
    try {
        const user = await apiCall(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return user;
    } catch (error) {
        if (error.statusCode === 404) {
            console.log('User not found');
            return null;
        } else if (error.statusCode >= 500) {
            console.log('Server error, please try again later');
            return null;
        }
        throw error; // Re-throw other errors
    }
}
```

## Intermediate Concepts

### 1. API Client Class (Intermediate)

```javascript
class APIClient {
    constructor(baseURL, defaultHeaders = {}) {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...defaultHeaders
        };
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };
        
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new APIError(`Request failed: ${response.statusText}`, response.status);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    get(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        
        return this.request(url.pathname + url.search, { method: 'GET' });
    }
    
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    }
    
    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    }
    
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    
    setAuthToken(token) {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
}

// Usage
const api = new APIClient('https://jsonplaceholder.typicode.com');

// Get all posts
api.get('/posts')
    .then(posts => console.log('Posts:', posts.slice(0, 5)));

// Create a new post
api.post('/posts', {
    title: 'New Post',
    body: 'Post content',
    userId: 1
}).then(post => console.log('Created post:', post));

// Update a post
api.put('/posts/1', {
    id: 1,
    title: 'Updated Post',
    body: 'Updated content',
    userId: 1
}).then(post => console.log('Updated post:', post));
```

### 2. Request Interceptors and Middleware (Intermediate)

```javascript
class APIClientWithInterceptors extends APIClient {
    constructor(baseURL, defaultHeaders = {}) {
        super(baseURL, defaultHeaders);
        this.requestInterceptors = [];
        this.responseInterceptors = [];
    }
    
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }
    
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }
    
    async request(endpoint, options = {}) {
        let config = { ...options };
        
        // Apply request interceptors
        for (const interceptor of this.requestInterceptors) {
            config = await interceptor(config);
        }
        
        let response = await super.request(endpoint, config);
        
        // Apply response interceptors
        for (const interceptor of this.responseInterceptors) {
            response = await interceptor(response);
        }
        
        return response;
    }
}

// Create API client with interceptors
const apiWithInterceptors = new APIClientWithInterceptors('https://api.example.com');

// Request interceptor for logging
apiWithInterceptors.addRequestInterceptor(async (config) => {
    console.log('Making request:', config.method || 'GET', config.url);
    return config;
});

// Request interceptor for authentication
apiWithInterceptors.addRequestInterceptor(async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return config;
});

// Response interceptor for error handling
apiWithInterceptors.addResponseInterceptor(async (response) => {
    if (response.error && response.error.status === 401) {
        // Token expired, redirect to login
        window.location.href = '/login';
    }
    return response;
});
```

### 3. Caching and Request Deduplication (Intermediate)

```javascript
class CachedAPIClient extends APIClient {
    constructor(baseURL, defaultHeaders = {}, cacheOptions = {}) {
        super(baseURL, defaultHeaders);
        this.cache = new Map();
        this.pendingRequests = new Map();
        this.cacheOptions = {
            defaultTTL: 5 * 60 * 1000, // 5 minutes
            maxSize: 100,
            ...cacheOptions
        };
    }
    
    generateCacheKey(endpoint, options) {
        return JSON.stringify({ endpoint, ...options });
    }
    
    isCacheValid(cacheEntry) {
        return Date.now() - cacheEntry.timestamp < this.cacheOptions.defaultTTL;
    }
    
    async request(endpoint, options = {}) {
        const cacheKey = this.generateCacheKey(endpoint, options);
        
        // Check if request is already pending
        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey);
        }
        
        // Check cache for GET requests
        if (!options.method || options.method === 'GET') {
            const cached = this.cache.get(cacheKey);
            if (cached && this.isCacheValid(cached)) {
                console.log('Cache hit for:', endpoint);
                return cached.data;
            }
        }
        
        // Make the request
        const requestPromise = super.request(endpoint, options);
        this.pendingRequests.set(cacheKey, requestPromise);
        
        try {
            const response = await requestPromise;
            
            // Cache GET responses
            if (!options.method || options.method === 'GET') {
                this.setCache(cacheKey, response);
            }
            
            return response;
        } finally {
            this.pendingRequests.delete(cacheKey);
        }
    }
    
    setCache(key, data) {
        // Implement LRU cache eviction
        if (this.cache.size >= this.cacheOptions.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    invalidateCache(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }
}

// Usage
const cachedAPI = new CachedAPIClient('https://jsonplaceholder.typicode.com');

// First call - makes actual request
cachedAPI.get('/posts/1').then(post => console.log('First call:', post.title));

// Second call - returns cached result
setTimeout(() => {
    cachedAPI.get('/posts/1').then(post => console.log('Second call (cached):', post.title));
}, 1000);
```

### 4. Retry Logic and Circuit Breaker (Intermediate)

```javascript
class ResilientAPIClient extends APIClient {
    constructor(baseURL, defaultHeaders = {}, resilienceOptions = {}) {
        super(baseURL, defaultHeaders);
        this.resilienceOptions = {
            maxRetries: 3,
            retryDelay: 1000,
            backoffFactor: 2,
            circuitBreakerThreshold: 5,
            circuitBreakerTimeout: 30000,
            ...resilienceOptions
        };
        this.failureCount = 0;
        this.circuitBreakerOpenTime = null;
    }
    
    async request(endpoint, options = {}) {
        // Check circuit breaker
        if (this.isCircuitOpen()) {
            throw new Error('Circuit breaker is open. Service temporarily unavailable.');
        }
        
        let lastError;
        const maxRetries = options.retry !== undefined ? options.retry : this.resilienceOptions.maxRetries;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await super.request(endpoint, options);
                
                // Reset failure count on success
                this.failureCount = 0;
                this.circuitBreakerOpenTime = null;
                
                return response;
            } catch (error) {
                lastError = error;
                this.failureCount++;
                
                // Open circuit breaker if threshold reached
                if (this.failureCount >= this.resilienceOptions.circuitBreakerThreshold) {
                    this.circuitBreakerOpenTime = Date.now();
                }
                
                // Don't retry on client errors (4xx)
                if (error.statusCode >= 400 && error.statusCode < 500) {
                    throw error;
                }
                
                // Don't retry on last attempt
                if (attempt === maxRetries) {
                    break;
                }
                
                // Wait before retry with exponential backoff
                const delay = this.resilienceOptions.retryDelay * 
                             Math.pow(this.resilienceOptions.backoffFactor, attempt);
                console.log(`Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
                await this.delay(delay);
            }
        }
        
        throw lastError;
    }
    
    isCircuitOpen() {
        if (!this.circuitBreakerOpenTime) return false;
        
        const timeElapsed = Date.now() - this.circuitBreakerOpenTime;
        if (timeElapsed > this.resilienceOptions.circuitBreakerTimeout) {
            // Half-open circuit - allow one request to test
            this.circuitBreakerOpenTime = null;
            this.failureCount = Math.floor(this.resilienceOptions.circuitBreakerThreshold / 2);
            return false;
        }
        
        return true;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Usage
const resilientAPI = new ResilientAPIClient('https://unreliable-api.example.com', {}, {
    maxRetries: 3,
    retryDelay: 1000,
    circuitBreakerThreshold: 5
});

resilientAPI.get('/data')
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Failed after retries:', error.message));
```

## Advanced Concepts

### 1. GraphQL Client (Advanced)

```javascript
class GraphQLClient {
    constructor(endpoint, options = {}) {
        this.endpoint = endpoint;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...options.headers
        };
    }
    
    async query(query, variables = {}, options = {}) {
        const body = {
            query,
            variables
        };
        
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
                ...options.headers
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
        
        return result.data;
    }
    
    async mutate(mutation, variables = {}, options = {}) {
        return this.query(mutation, variables, options);
    }
    
    // Subscription support (would need WebSocket implementation)
    async subscribe(subscription, variables = {}, callback) {
        // Implementation would depend on subscription transport
        throw new Error('Subscriptions not implemented in this example');
    }
}

// Usage
const gqlClient = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
        'Authorization': 'Bearer YOUR_GITHUB_TOKEN'
    }
});

const GET_USER_REPOS = `
    query GetUserRepos($login: String!, $first: Int!) {
        user(login: $login) {
            name
            repositories(first: $first, orderBy: {field: STARS, direction: DESC}) {
                nodes {
                    name
                    description
                    stargazerCount
                    primaryLanguage {
                        name
                    }
                }
            }
        }
    }
`;

gqlClient.query(GET_USER_REPOS, { login: 'octocat', first: 5 })
    .then(data => {
        console.log('User:', data.user.name);
        data.user.repositories.nodes.forEach(repo => {
            console.log(`${repo.name}: ${repo.stargazerCount} stars`);
        });
    })
    .catch(error => console.error('GraphQL Error:', error));
```

### 2. Real-time API with WebSockets (Advanced)

```javascript
class WebSocketClient {
    constructor(url, options = {}) {
        this.url = url;
        this.options = options;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
        this.reconnectInterval = options.reconnectInterval || 1000;
        this.listeners = new Map();
        this.messageQueue = [];
        this.isConnected = false;
    }
    
    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);
                
                this.ws.onopen = (event) => {
                    console.log('WebSocket connected');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    
                    // Send queued messages
                    while (this.messageQueue.length > 0) {
                        const message = this.messageQueue.shift();
                        this.ws.send(JSON.stringify(message));
                    }
                    
                    resolve(event);
                };
                
                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.handleMessage(data);
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };
                
                this.ws.onclose = (event) => {
                    console.log('WebSocket disconnected');
                    this.isConnected = false;
                    
                    if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.scheduleReconnect();
                    }
                };
                
                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                };
            } catch (error) {
                reject(error);
            }
        });
    }
    
    scheduleReconnect() {
        setTimeout(() => {
            this.reconnectAttempts++;
            console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            this.connect();
        }, this.reconnectInterval * Math.pow(2, this.reconnectAttempts));
    }
    
    send(message) {
        if (this.isConnected) {
            this.ws.send(JSON.stringify(message));
        } else {
            this.messageQueue.push(message);
        }
    }
    
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    handleMessage(data) {
        const event = data.type || 'message';
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                callback(data);
            });
        }
    }
    
    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Usage
const wsClient = new WebSocketClient('wss://echo.websocket.org');

wsClient.on('message', (data) => {
    console.log('Received message:', data);
});

wsClient.on('user-joined', (data) => {
    console.log('User joined:', data.username);
});

wsClient.connect()
    .then(() => {
        console.log('Connected to WebSocket');
        
        // Send a message
        wsClient.send({
            type: 'chat-message',
            message: 'Hello, WebSocket!',
            timestamp: Date.now()
        });
    })
    .catch(error => {
        console.error('Failed to connect:', error);
    });
```

### 3. API Rate Limiting and Queue Management (Advanced)

```javascript
class RateLimitedAPIClient extends APIClient {
    constructor(baseURL, defaultHeaders = {}, rateLimitOptions = {}) {
        super(baseURL, defaultHeaders);
        this.rateLimitOptions = {
            requestsPerSecond: 10,
            burstLimit: 50,
            ...rateLimitOptions
        };
        this.requestQueue = [];
        this.requestHistory = [];
        this.processing = false;
    }
    
    async request(endpoint, options = {}) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                endpoint,
                options,
                resolve,
                reject,
                timestamp: Date.now()
            });
            
            this.processQueue();
        });
    }
    
    async processQueue() {
        if (this.processing || this.requestQueue.length === 0) {
            return;
        }
        
        this.processing = true;
        
        while (this.requestQueue.length > 0) {
            if (!this.canMakeRequest()) {
                const waitTime = this.getWaitTime();
                console.log(`Rate limit reached. Waiting ${waitTime}ms`);
                await this.delay(waitTime);
                continue;
            }
            
            const requestData = this.requestQueue.shift();
            this.recordRequest();
            
            try {
                const response = await super.request(requestData.endpoint, requestData.options);
                requestData.resolve(response);
            } catch (error) {
                requestData.reject(error);
            }
        }
        
        this.processing = false;
    }
    
    canMakeRequest() {
        const now = Date.now();
        const oneSecondAgo = now - 1000;
        
        // Clean old requests from history
        this.requestHistory = this.requestHistory.filter(time => time > oneSecondAgo);
        
        // Check if we can make a request based on rate limit
        return this.requestHistory.length < this.rateLimitOptions.requestsPerSecond;
    }
    
    getWaitTime() {
        if (this.requestHistory.length === 0) return 0;
        
        const oldestRequest = Math.min(...this.requestHistory);
        const waitTime = 1000 - (Date.now() - oldestRequest);
        return Math.max(waitTime, 0);
    }
    
    recordRequest() {
        this.requestHistory.push(Date.now());
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    getQueueLength() {
        return this.requestQueue.length;
    }
    
    clearQueue() {
        this.requestQueue.forEach(req => {
            req.reject(new Error('Request cancelled due to queue clear'));
        });
        this.requestQueue = [];
    }
}

// Usage
const rateLimitedAPI = new RateLimitedAPIClient('https://api.github.com', {
    'Authorization': 'token YOUR_TOKEN'
}, {
    requestsPerSecond: 5
});

// Make multiple requests - they will be automatically rate limited
for (let i = 1; i <= 20; i++) {
    rateLimitedAPI.get(`/users/octocat/repos?page=${i}`)
        .then(repos => console.log(`Page ${i}: ${repos.length} repos`))
        .catch(error => console.error(`Page ${i} error:`, error.message));
}
```

## Real-World Examples

### 1. E-commerce API Integration (Advanced)

```javascript
class ECommerceAPI {
    constructor(baseURL, apiKey) {
        this.client = new APIClient(baseURL);
        this.client.setAuthToken(apiKey);
    }
    
    // Product management
    async getProducts(filters = {}) {
        const params = {
            page: filters.page || 1,
            limit: filters.limit || 20,
            category: filters.category,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sortBy: filters.sortBy || 'created_at',
            sortOrder: filters.sortOrder || 'desc'
        };
        
        return this.client.get('/products', params);
    }
    
    async getProduct(productId) {
        return this.client.get(`/products/${productId}`);
    }
    
    async searchProducts(query, filters = {}) {
        return this.client.get('/products/search', {
            q: query,
            ...filters
        });
    }
    
    // Cart management
    async getCart(sessionId) {
        return this.client.get(`/cart/${sessionId}`);
    }
    
    async addToCart(sessionId, productId, quantity = 1) {
        return this.client.post(`/cart/${sessionId}/items`, {
            productId,
            quantity
        });
    }
    
    async updateCartItem(sessionId, itemId, quantity) {
        return this.client.put(`/cart/${sessionId}/items/${itemId}`, {
            quantity
        });
    }
    
    async removeFromCart(sessionId, itemId) {
        return this.client.delete(`/cart/${sessionId}/items/${itemId}`);
    }
    
    // Order management
    async createOrder(orderData) {
        return this.client.post('/orders', orderData);
    }
    
    async getOrder(orderId) {
        return this.client.get(`/orders/${orderId}`);
    }
    
    async getUserOrders(userId, page = 1) {
        return this.client.get(`/users/${userId}/orders`, { page });
    }
    
    // Payment processing
    async processPayment(paymentData) {
        return this.client.post('/payments', paymentData);
    }
    
    async getPaymentStatus(paymentId) {
        return this.client.get(`/payments/${paymentId}/status`);
    }
}

// Usage in a shopping application
class ShoppingApp {
    constructor(apiKey) {
        this.api = new ECommerceAPI('https://api.mystore.com', apiKey);
        this.sessionId = this.generateSessionId();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    async searchAndDisplayProducts(query) {
        try {
            const products = await this.api.searchProducts(query, {
                limit: 12,
                sortBy: 'relevance'
            });
            
            this.displayProducts(products.items);
        } catch (error) {
            console.error('Error searching products:', error);
            this.showError('Failed to search products. Please try again.');
        }
    }
    
    async addProductToCart(productId, quantity = 1) {
        try {
            const result = await this.api.addToCart(this.sessionId, productId, quantity);
            this.updateCartDisplay();
            this.showSuccess('Product added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showError('Failed to add product to cart.');
        }
    }
    
    async checkout(shippingInfo, paymentInfo) {
        try {
            // Get current cart
            const cart = await this.api.getCart(this.sessionId);
            
            // Create order
            const orderData = {
                sessionId: this.sessionId,
                shippingAddress: shippingInfo,
                paymentMethod: paymentInfo.method,
                items: cart.items
            };
            
            const order = await this.api.createOrder(orderData);
            
            // Process payment
            const paymentData = {
                orderId: order.id,
                amount: order.total,
                currency: 'USD',
                ...paymentInfo
            };
            
            const payment = await this.api.processPayment(paymentData);
            
            if (payment.status === 'completed') {
                this.showSuccess('Order placed successfully!');
                this.clearCart();
                return order;
            } else {
                throw new Error('Payment failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            this.showError('Checkout failed. Please try again.');
            throw error;
        }
    }
    
    displayProducts(products) {
        // Implementation for displaying products in UI
        console.log('Displaying products:', products);
    }
    
    updateCartDisplay() {
        // Implementation for updating cart UI
        console.log('Updating cart display');
    }
    
    showSuccess(message) {
        console.log('SUCCESS:', message);
    }
    
    showError(message) {
        console.error('ERROR:', message);
    }
    
    clearCart() {
        this.sessionId = this.generateSessionId();
    }
}

// Initialize the shopping app
const app = new ShoppingApp('your-api-key-here');
```

### 2. Social Media API Integration (Advanced)

```javascript
class SocialMediaAPI {
    constructor() {
        this.apis = {
            twitter: new APIClient('https://api.twitter.com/2'),
            facebook: new APIClient('https://graph.facebook.com/v12.0'),
            instagram: new APIClient('https://graph.instagram.com')
        };
    }
    
    setCredentials(platform, credentials) {
        switch (platform) {
            case 'twitter':
                this.apis.twitter.setAuthToken(credentials.bearerToken);
                break;
            case 'facebook':
                this.apis.facebook.defaultHeaders['Authorization'] = `Bearer ${credentials.accessToken}`;
                break;
            case 'instagram':
                this.apis.instagram.defaultHeaders['Authorization'] = `Bearer ${credentials.accessToken}`;
                break;
        }
    }
    
    async postToMultiplePlatforms(content, platforms = ['twitter', 'facebook']) {
        const results = await Promise.allSettled(
            platforms.map(platform => this.postToPlatform(platform, content))
        );
        
        return results.map((result, index) => ({
            platform: platforms[index],
            success: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason.message : null
        }));
    }
    
    async postToPlatform(platform, content) {
        switch (platform) {
            case 'twitter':
                return this.postToTwitter(content);
            case 'facebook':
                return this.postToFacebook(content);
            case 'instagram':
                return this.postToInstagram(content);
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }
    
    async postToTwitter(content) {
        return this.apis.twitter.post('/tweets', {
            text: content.text.substring(0, 280) // Twitter character limit
        });
    }
    
    async postToFacebook(content) {
        return this.apis.facebook.post('/me/feed', {
            message: content.text,
            link: content.link
        });
    }
    
    async postToInstagram(content) {
        // Instagram requires media
        if (!content.imageUrl) {
            throw new Error('Instagram posts require an image');
        }
        
        // First, create media object
        const mediaResponse = await this.apis.instagram.post('/me/media', {
            image_url: content.imageUrl,
            caption: content.text
        });
        
        // Then publish it
        return this.apis.instagram.post('/me/media_publish', {
            creation_id: mediaResponse.id
        });
    }
    
    async getAnalytics(platform, startDate, endDate) {
        switch (platform) {
            case 'twitter':
                return this.getTwitterAnalytics(startDate, endDate);
            case 'facebook':
                return this.getFacebookAnalytics(startDate, endDate);
            default:
                throw new Error(`Analytics not supported for ${platform}`);
        }
    }
    
    async getTwitterAnalytics(startDate, endDate) {
        return this.apis.twitter.get('/users/me/tweets', {
            'tweet.fields': 'public_metrics,created_at',
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString()
        });
    }
    
    async getFacebookAnalytics(startDate, endDate) {
        return this.apis.facebook.get('/me/insights', {
            metric: 'page_impressions,page_engaged_users',
            since: Math.floor(startDate.getTime() / 1000),
            until: Math.floor(endDate.getTime() / 1000)
        });
    }
}

// Social media manager
class SocialMediaManager {
    constructor() {
        this.api = new SocialMediaAPI();
        this.scheduledPosts = [];
    }
    
    async initialize(credentials) {
        Object.keys(credentials).forEach(platform => {
            this.api.setCredentials(platform, credentials[platform]);
        });
    }
    
    async schedulePost(content, platforms, scheduledTime) {
        const post = {
            id: Date.now().toString(),
            content,
            platforms,
            scheduledTime: new Date(scheduledTime),
            status: 'scheduled'
        };
        
        this.scheduledPosts.push(post);
        this.schedulePostExecution(post);
        
        return post;
    }
    
    schedulePostExecution(post) {
        const delay = post.scheduledTime.getTime() - Date.now();
        
        if (delay > 0) {
            setTimeout(async () => {
                await this.executeScheduledPost(post);
            }, delay);
        }
    }
    
    async executeScheduledPost(post) {
        try {
            const results = await this.api.postToMultiplePlatforms(
                post.content, 
                post.platforms
            );
            
            post.status = 'published';
            post.results = results;
            
            console.log('Scheduled post executed:', post.id);
        } catch (error) {
            post.status = 'failed';
            post.error = error.message;
            console.error('Failed to execute scheduled post:', error);
        }
    }
    
    async getScheduledPosts() {
        return this.scheduledPosts.filter(post => post.status === 'scheduled');
    }
    
    async cancelScheduledPost(postId) {
        const postIndex = this.scheduledPosts.findIndex(post => post.id === postId);
        if (postIndex > -1) {
            this.scheduledPosts[postIndex].status = 'cancelled';
            return true;
        }
        return false;
    }
}

// Usage
const socialManager = new SocialMediaManager();

// Initialize with credentials
socialManager.initialize({
    twitter: { bearerToken: 'your-twitter-token' },
    facebook: { accessToken: 'your-facebook-token' }
});

// Schedule a post
socialManager.schedulePost(
    {
        text: 'Check out our new product launch! 🚀',
        link: 'https://example.com/product',
        imageUrl: 'https://example.com/image.jpg'
    },
    ['twitter', 'facebook'],
    new Date(Date.now() + 3600000) // 1 hour from now
);
```

## Best Practices

### 1. Environment Configuration (Best Practice)

```javascript
class APIConfig {
    constructor() {
        this.environments = {
            development: {
                baseURL: 'http://localhost:3000/api',
                timeout: 10000,
                retries: 2
            },
            staging: {
                baseURL: 'https://staging-api.example.com',
                timeout: 15000,
                retries: 3
            },
            production: {
                baseURL: 'https://api.example.com',
                timeout: 20000,
                retries: 5
            }
        };
        
        this.currentEnv = process.env.NODE_ENV || 'development';
    }
    
    getConfig() {
        return this.environments[this.currentEnv];
    }
    
    getBaseURL() {
        return this.getConfig().baseURL;
    }
    
    getTimeout() {
        return this.getConfig().timeout;
    }
    
    getRetries() {
        return this.getConfig().retries;
    }
}

// API client with environment configuration
class ConfiguredAPIClient extends APIClient {
    constructor() {
        const config = new APIConfig();
        super(config.getBaseURL(), {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        
        this.timeout = config.getTimeout();
        this.retries = config.getRetries();
    }
    
    async request(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            return await super.request(endpoint, {
                ...options,
                signal: controller.signal
            });
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }
}
```

### 2. Type Safety and Validation (Best Practice)

```javascript
// Simple schema validation
class SchemaValidator {
    static validate(data, schema) {
        const errors = [];
        
        for (const [key, rules] of Object.entries(schema)) {
            const value = data[key];
            
            if (rules.required && (value === undefined || value === null)) {
                errors.push(`${key} is required`);
                continue;
            }
            
            if (value !== undefined && value !== null) {
                if (rules.type && typeof value !== rules.type) {
                    errors.push(`${key} must be of type ${rules.type}`);
                }
                
                if (rules.minLength && value.length < rules.minLength) {
                    errors.push(`${key} must be at least ${rules.minLength} characters`);
                }
                
                if (rules.pattern && !rules.pattern.test(value)) {
                    errors.push(`${key} format is invalid`);
                }
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Typed API client
class TypedAPIClient extends APIClient {
    async request(endpoint, options = {}, schema = null) {
        const response = await super.request(endpoint, options);
        
        if (schema) {
            const validation = SchemaValidator.validate(response, schema);
            if (!validation.valid) {
                throw new Error(`Response validation failed: ${validation.errors.join(', ')}`);
            }
        }
        
        return response;
    }
    
    async getUser(userId) {
        const userSchema = {
            id: { required: true, type: 'number' },
            name: { required: true, type: 'string', minLength: 1 },
            email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
        };
        
        return this.request(`/users/${userId}`, { method: 'GET' }, userSchema);
    }
    
    async createUser(userData) {
        const userInputSchema = {
            name: { required: true, type: 'string', minLength: 2 },
            email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            age: { required: false, type: 'number' }
        };
        
        const validation = SchemaValidator.validate(userData, userInputSchema);
        if (!validation.valid) {
            throw new Error(`Invalid user data: ${validation.errors.join(', ')}`);
        }
        
        return this.request('/users', {
            method: 'POST',
            body: userData
        });
    }
}
```

This comprehensive guide covers API Integration in JavaScript from beginner to advanced levels, including real-world examples, best practices, and modern techniques for building robust, scalable applications that interact with various APIs.
