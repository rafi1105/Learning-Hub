# React Error Handling - Complete Interview & Project Guide

## Table of Contents
1. [What is Error Handling in React?](#what-is-error-handling-in-react)
2. [Error Boundaries](#error-boundaries)
3. [Handling Async Errors](#handling-async-errors)
4. [Advanced Error Handling Patterns](#advanced-error-handling-patterns)
5. [Real-Life E-Commerce Project Examples](#real-life-e-commerce-project-examples)
6. [Interview Questions & Answers](#interview-questions--answers)
7. [Best Practices](#best-practices)
8. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
9. [Testing Error Scenarios](#testing-error-scenarios)
10. [Production Error Monitoring](#production-error-monitoring)

---

## What is Error Handling in React?

Error handling in React involves catching and managing errors in components to prevent app crashes and provide a graceful user experience. Error boundaries handle rendering errors, while try-catch and state management handle async or logical errors.

### Real-World Analogy

Think of error handling as a safety net in a circus: if a performer (component) falls (throws an error), the net (error boundary) catches them, ensuring the show continues.

### Why Error Handling?

- **Prevent Crashes**: Avoids app-wide failures.
- **Better UX**: Displays user-friendly error messages.
- **Debugging**: Logs errors for developer analysis.

---

## Error Boundaries

Error boundaries are React components that catch JavaScript errors in their child component tree during rendering.

**Example: Error Boundary**

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong: {this.state.error.message}</h1>;
    }
    return this.props.children;
  }
}

function BuggyComponent() {
  throw new Error('I crashed!');
  return <div>Never renders</div>;
}

function App() {
  return (
    <ErrorBoundary>
      <BuggyComponent />
    </ErrorBoundary>
  );
}
```

---

## Handling Async Errors

Async errors (e.g., API failures) require try-catch blocks.

**Example: Async Error Handling**

```jsx
import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://invalid-api.com');
        setData(await response.json());
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, []);

  if (error) return <p>Error: {error}</p>;
  return <p>{data ? JSON.stringify(data) : 'Loading...'}</p>;
}
```

---

## Advanced Error Handling Patterns

### Global Error Boundary

Wrap the entire app in an error boundary.

**Example: Global Error Boundary**

```jsx
class GlobalErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <GlobalErrorBoundary>
      <AppContent />
    </GlobalErrorBoundary>
  );
}
```

### Error Boundary with Fallback Component

Use a reusable fallback component.

**Example**

```jsx
function ErrorFallback({ error }) {
  return (
    <div>
      <h2>Error: {error.message}</h2>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

---

## Real-Life Project Examples

### 1. Protected Component

A component with error handling for rendering errors.

```jsx
class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <p>Error: {this.state.error.message}</p>;
    }
    return this.props.children;
  }
}

function UserProfile({ user }) {
  if (!user) throw new Error('User data missing');
  return <h1>{user.name}</h1>;
}

function App() {
  return (
    <ErrorBoundary>
      <UserProfile user={null} />
    </ErrorBoundary>
  );
}
```

### 2. API Error Handler

A component handling API errors.

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        setUsers(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Best Practices

### 1. Use Error Boundaries

Wrap critical components to catch rendering errors.

**Example**

```jsx
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

### 2. Handle Async Errors

Use try-catch for async operations.

**Example**

```jsx
async function fetchData() {
  try {
    const data = await fetch('...').then(res => res.json());
    setData(data);
  } catch (err) {
    setError(err.message);
  }
}
```

### 3. Provide User Feedback

Show meaningful error messages.

**Example**

```jsx
if (error) return <p>Sorry, something went wrong. Please try again.</p>;
```

### 4. Log Errors

Log errors for debugging.

**Example**

```jsx
componentDidCatch(error, info) {
  logErrorToService(error, info);
}
```

---

## Common Pitfalls and Solutions

### Pitfall: Error Boundaries Don’t Catch All Errors

Error boundaries don’t catch async or event handler errors.

**Solution**: Use try-catch for async code.

### Pitfall: Missing Fallback UI

No fallback UI leads to poor UX.

**Solution**

```jsx
if (error) return <ErrorFallback error={error} />;
```

### Pitfall: Overusing Error Boundaries

Too many boundaries increase complexity.

**Solution**: Use a global error boundary for the app.

---

## Real-Life E-Commerce Project Examples

### 1. E-Commerce Product Listing with Error Handling

```jsx
import { useState, useEffect } from 'react';

// Global Error Boundary for E-commerce App
class ECommerceErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // Log to error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Send to services like Sentry, LogRocket, etc.
    console.error('E-commerce Error:', { error, errorInfo });
    // fetch('/api/log-error', { method: 'POST', body: JSON.stringify({ error: error.message, stack: error.stack }) });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>🛒 Oops! Something went wrong with our store</h2>
          <p>We're sorry for the inconvenience. Our team has been notified.</p>
          <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
            <summary>Technical Details (for developers)</summary>
            <pre style={{ color: 'red', fontSize: '12px' }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </details>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => window.location.reload()} className="retry-btn">
              🔄 Refresh Page
            </button>
            <button onClick={() => window.location.href = '/'} className="home-btn">
              🏠 Go to Homepage
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Product Listing Component with Comprehensive Error Handling
function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products', {
        timeout: 10000, // 10 second timeout
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Products not found. Please check back later.');
        } else if (response.status === 500) {
          throw new Error('Server error. Our team is working on it.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment.');
        } else {
          throw new Error(`Failed to load products (${response.status})`);
        }
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data.products)) {
        throw new Error('Invalid product data received');
      }
      
      setProducts(data.products);
      setRetryCount(0); // Reset retry count on success
      
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error. Please check your internet connection.');
      } else if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message);
      }
      
      // Auto-retry logic for certain errors
      if (retryCount < 3 && (err.message.includes('network') || err.message.includes('timeout'))) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchProducts();
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner">🔄</div>
        <p>Loading amazing products for you...</p>
        {retryCount > 0 && <p>Attempt {retryCount + 1} of 4</p>}
      </div>
    );
  }

  // Error state with retry options
  if (error && products.length === 0) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h3>Unable to Load Products</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={fetchProducts} className="retry-btn">
            🔄 Try Again
          </button>
          <button onClick={() => window.location.href = '/categories'} className="browse-btn">
            📂 Browse Categories
          </button>
        </div>
        {retryCount > 0 && (
          <p className="retry-info">Auto-retrying... ({retryCount}/3)</p>
        )}
      </div>
    );
  }

  return (
    <div className="product-listing">
      <h1>Our Products</h1>
      {error && products.length > 0 && (
        <div className="warning-banner">
          ⚠️ Some products may not be up to date: {error}
          <button onClick={fetchProducts}>Refresh</button>
        </div>
      )}
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Individual Product Card with Error Boundary
function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartError, setCartError] = useState(null);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setCartError(null);
      
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Product already in cart');
        } else if (response.status === 400) {
          throw new Error('Product out of stock');
        } else {
          throw new Error('Failed to add to cart');
        }
      }
      
      // Success feedback
      showToast('✅ Added to cart successfully!');
      
    } catch (err) {
      setCartError(err.message);
      showToast(`❌ ${err.message}`, 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {!imageError ? (
          <img 
            src={product.image} 
            alt={product.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-placeholder">
            📷 Image not available
          </div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
        <button 
          onClick={handleAddToCart}
          disabled={addingToCart}
          className={`add-to-cart ${cartError ? 'error' : ''}`}
        >
          {addingToCart ? '⏳ Adding...' : '🛒 Add to Cart'}
        </button>
        {cartError && (
          <p className="cart-error">{cartError}</p>
        )}
      </div>
    </div>
  );
}

// Main E-commerce App
function ECommerceApp() {
  return (
    <ECommerceErrorBoundary>
      <div className="app">
        <header>
          <h1>🛒 My E-Commerce Store</h1>
        </header>
        <main>
          <ProductListing />
        </main>
      </div>
    </ECommerceErrorBoundary>
  );
}
```

### 2. Shopping Cart with Advanced Error Recovery

```jsx
function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [optimisticUpdates, setOptimisticUpdates] = useState({});

  // Load cart with error handling
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to load cart');
      const data = await response.json();
      setCartItems(data.items || []);
      setError(null);
    } catch (err) {
      setError('Unable to load your cart. Using offline version.');
      // Load from localStorage as fallback
      const offlineCart = localStorage.getItem('cart');
      if (offlineCart) {
        setCartItems(JSON.parse(offlineCart));
      }
    } finally {
      setLoading(false);
    }
  };

  // Optimistic update with rollback on error
  const updateQuantity = async (itemId, newQuantity) => {
    // Optimistic update
    const originalItems = [...cartItems];
    setCartItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    
    // Show optimistic loading state
    setOptimisticUpdates(prev => ({ ...prev, [itemId]: true }));

    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      // Success - optimistic update was correct
      showToast('✅ Cart updated');
      
    } catch (err) {
      // Rollback optimistic update
      setCartItems(originalItems);
      showToast('❌ Failed to update cart. Please try again.', 'error');
    } finally {
      setOptimisticUpdates(prev => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
    }
  };

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="shopping-cart">
      <h2>🛒 Your Cart</h2>
      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button onClick={loadCart}>Retry</button>
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => window.location.href = '/products'}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={optimisticUpdates[item.id]}
                >
                  -
                </button>
                <span className={optimisticUpdates[item.id] ? 'updating' : ''}>
                  {item.quantity}
                </span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={optimisticUpdates[item.id]}
                >
                  +
                </button>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Interview Questions & Answers

### Basic Level Questions

**Q1: What are Error Boundaries in React?**
**A:** Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI. They're implemented as class components with `getDerivedStateFromError()` and `componentDidCatch()` lifecycle methods.

**Q2: What types of errors do Error Boundaries NOT catch?**
**A:** Error boundaries do NOT catch:
- Errors inside event handlers
- Errors in asynchronous code (setTimeout, promises)
- Errors during server-side rendering
- Errors thrown in the error boundary itself

**Q3: How do you handle async errors in React?**
**A:** Use try-catch blocks within async functions and update component state accordingly:
```jsx
const [error, setError] = useState(null);
try {
  const data = await fetchData();
  setData(data);
} catch (err) {
  setError(err.message);
}
```

### Intermediate Level Questions

**Q4: How would you implement retry logic for failed API calls?**
**A:** Implement exponential backoff with retry limits:
```jsx
const [retryCount, setRetryCount] = useState(0);
const maxRetries = 3;

const fetchWithRetry = async () => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Fetch failed');
    return response.json();
  } catch (error) {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        fetchWithRetry();
      }, Math.pow(2, retryCount) * 1000); // Exponential backoff
    } else {
      setError('Max retries exceeded');
    }
  }
};
```

**Q5: How do you implement optimistic updates with error recovery?**
**A:** Update UI immediately, then sync with server and rollback on failure:
```jsx
const updateItemOptimistic = async (id, newData) => {
  const originalItems = [...items];
  // Optimistic update
  setItems(items => items.map(item => 
    item.id === id ? { ...item, ...newData } : item
  ));
  
  try {
    await updateItem(id, newData);
  } catch (error) {
    // Rollback on error
    setItems(originalItems);
    showError('Update failed');
  }
};
```

### Advanced Level Questions

**Q6: How would you implement a global error reporting system?**
**A:** Create a centralized error service:
```jsx
class ErrorReportingService {
  static report(error, context = {}) {
    // Log locally
    console.error('Error reported:', error);
    
    // Send to external service
    fetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(err => console.error('Failed to report error:', err));
  }
}
```

**Q7: How do you handle errors in concurrent operations?**
**A:** Use Promise.allSettled() for concurrent operations:
```jsx
const handleConcurrentOperations = async () => {
  const operations = [
    fetchUserData(),
    fetchUserPreferences(),
    fetchUserOrders()
  ];
  
  const results = await Promise.allSettled(operations);
  
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Operation ${index} failed:`, result.reason);
      // Handle specific failures
    }
  });
};
```

---

## Testing Error Scenarios

### 1. Unit Testing Error Boundaries

```jsx
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component that throws error for testing
function ThrowError({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  it('should catch and display error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});
```

### 2. Testing Async Error Handling

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/data', (req, res, ctx) => {
    return res(ctx.status(500));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('handles API error correctly', async () => {
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });
});
```

---

## Production Error Monitoring

### 1. Integration with Error Tracking Services

```jsx
// Sentry integration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

class ProductionErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }
}
```

### 2. Custom Error Metrics

```jsx
// Custom error tracking
const trackError = (error, context) => {
  // Analytics tracking
  gtag('event', 'exception', {
    description: error.message,
    fatal: false,
    custom_map: context,
  });
  
  // Custom metrics
  fetch('/api/metrics/error', {
    method: 'POST',
    body: JSON.stringify({
      error: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    }),
  });
};
```

---

## Summary

React error handling requires a comprehensive approach combining Error Boundaries for rendering errors, try-catch for async operations, user-friendly fallbacks, retry mechanisms, and production monitoring. For e-commerce applications, robust error handling is crucial for maintaining user trust and preventing revenue loss.

### Interview-Friendly Tips

- **Error Boundaries vs try-catch**: Boundaries for rendering errors, try-catch for async/event errors
- **Production considerations**: Always implement error reporting, user-friendly messages, and retry mechanisms  
- **Testing**: Test both error and success scenarios, use tools like MSW for API mocking
- **Performance**: Implement optimistic updates with rollback for better UX
- **Monitoring**: Use services like Sentry, LogRocket for production error tracking 