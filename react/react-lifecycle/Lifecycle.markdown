# React Lifecycle -  E-Commerce Guide

## Table of Contents
1. [What is the React Lifecycle?](#what-is-the-react-lifecycle)
2. [Class Component Lifecycle Methods](#class-component-lifecycle-methods)
3. [useEffect Hook - The Modern Approach](#useeffect-hook---the-modern-approach)
4. [Advanced Lifecycle Management](#advanced-lifecycle-management)
5. [Real-Life E-Commerce Project Examples](#real-life-e-commerce-project-examples)
6. [Performance Optimization with Lifecycle](#performance-optimization-with-lifecycle)
7. [Interview Questions & Answers](#interview-questions--answers)
8. [Testing Lifecycle Methods](#testing-lifecycle-methods)
9. [Best Practices](#best-practices)
10. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What is the React Lifecycle?

The React lifecycle refers to the phases a component goes through: mounting, updating, and unmounting. Class components use lifecycle methods, while functional components use the `useEffect` hook.

### Real-World Analogy
Think of a component's lifecycle as a plant: it's planted (mounted), grows (updates), and is removed (unmounted).

### Why Understand Lifecycle?
- **Control Behavior**: Execute code at specific phases.
- **Resource Management**: Handle setup and cleanup.
- **Optimization**: Prevent unnecessary work.

---

## Class Component Lifecycle Methods

### Mounting
- **constructor**: Initialize state and bind methods.
- **render**: Render the UI.
- **componentDidMount**: Run after mounting (e.g., fetch data).

**Example**
```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log('Mounted');
  }

  render() {
    return <p>Count: {this.state.count}</p>;
  }
}
```

### Updating
- **shouldComponentUpdate**: Optimize by preventing renders.
- **render**: Re-render on state/props change.
- **componentDidUpdate**: Run after updates.

**Example**
```jsx
class Counter extends React.Component {
  state = { count: 0 };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      console.log('Count updated:', this.state.count);
    }
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}
```

### Unmounting
- **componentWillUnmount**: Cleanup before removal.

**Example**
```jsx
class Timer extends React.Component {
  componentDidMount() {
    this.timer = setInterval(() => console.log('Tick'), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <p>Timer running</p>;
  }
}
```

---

## useEffect Hook - The Modern Approach

The `useEffect` hook handles side effects in functional components, replacing lifecycle methods.

**Example: useEffect**
```jsx
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Effect ran');
    return () => console.log('Cleanup');
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>Count: {count}</button>
  );
}
```

### Common useEffect Patterns
- **Mounting**: Empty dependency array (`[]`).
- **Updating**: Include dependencies in the array.
- **Unmounting**: Return a cleanup function.

**Example: Fetching Data**
```jsx
function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <p>{data ? JSON.stringify(data) : 'Loading...'}</p>;
}
```

---

## Advanced Lifecycle Management

### Conditional Effects
Run effects conditionally using dependencies.

**Example**
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(res => res.json())
        .then(setUser);
    }
  }, [userId]);

  return <p>{user ? user.name : 'Loading...'}</p>;
}
```

### Cleanup in useEffect
Prevent memory leaks with cleanup functions.

**Example**
```jsx
function Timer() {
  useEffect(() => {
    const timer = setInterval(() => console.log('Tick'), 1000);
    return () => clearInterval(timer);
  }, []);

  return <p>Timer running</p>;
}
```

### Multiple Effects
Separate concerns using multiple effects.

**Example**
```jsx
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  
  // Fetch user data
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  // Fetch user activity separately
  useEffect(() => {
    if (user) {
      fetch(`/api/users/${userId}/activity`)
        .then(res => res.json())
        .then(setActivity);
    }
  }, [userId, user]);
  
  return (
    <div>
      {user && <UserInfo user={user} />}
      {activity.length > 0 && <ActivityList activities={activity} />}
    </div>
  );
}
```

### Advanced Cleanup Patterns
Handle complex cleanup scenarios.

**Example: WebSocket Connection**
```jsx
function LiveChat({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(`wss://chat.example.com/room/${roomId}`);
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };
    
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'JOIN', userId: currentUser.id }));
    };
    
    // Cleanup: Close socket when component unmounts or roomId changes
    return () => {
      socket.send(JSON.stringify({ type: 'LEAVE', userId: currentUser.id }));
      socket.close();
    };
  }, [roomId, currentUser.id]);
  
  return (
    <div className="chat-container">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
}
```

### Async Effects with Cleanup
Properly handle async operations in effects.

**Example: Cancellable Fetch**
```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    
    const fetchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${query}`, {
          signal: abortController.signal
        });
        const data = await response.json();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setResults(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Search error:', error);
          setIsLoading(false);
        }
      }
    };
    
    fetchResults();
    
    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [query]);
  
  return (
    <div>
      {isLoading ? (
        <p>Loading results...</p>
      ) : (
        <ResultsList results={results} />
      )}
    </div>
  );
}
```

## Real-Life E-Commerce Project Examples

### 1. Product Page with Lifecycle Management

```jsx
import { useState, useEffect, useCallback, useRef } from 'react';

function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewTime, setViewTime] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const startTime = useRef(Date.now());
  const viewTimeInterval = useRef(null);
  const abortController = useRef(null);

  // Track page view time for analytics
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Update view time when page is visible
  useEffect(() => {
    if (isVisible) {
      viewTimeInterval.current = setInterval(() => {
        setViewTime(Date.now() - startTime.current);
      }, 1000);
    } else {
      clearInterval(viewTimeInterval.current);
    }

    return () => clearInterval(viewTimeInterval.current);
  }, [isVisible]);

  // Fetch product data when productId changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cancel previous request if it exists
        if (abortController.current) {
          abortController.current.abort();
        }
        
        abortController.current = new AbortController();
        
        // Parallel API calls for better performance
        const [productRes, reviewsRes, relatedRes] = await Promise.all([
          fetch(`/api/products/${productId}`, { 
            signal: abortController.current.signal 
          }),
          fetch(`/api/products/${productId}/reviews`, { 
            signal: abortController.current.signal 
          }),
          fetch(`/api/products/${productId}/related`, { 
            signal: abortController.current.signal 
          })
        ]);

        if (!productRes.ok) throw new Error('Failed to fetch product');
        
        const [productData, reviewsData, relatedData] = await Promise.all([
          productRes.json(),
          reviewsRes.ok ? reviewsRes.json() : { reviews: [] },
          relatedRes.ok ? relatedRes.json() : { products: [] }
        ]);

        // Only update state if component is still mounted
        if (isMounted) {
          setProduct(productData);
          setReviews(reviewsData.reviews);
          setRelatedProducts(relatedData.products);
        }
        
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductData();
    
    // Reset start time for new product
    startTime.current = Date.now();
    setViewTime(0);

    // Cleanup function
    return () => {
      isMounted = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [productId]);

  // Track user engagement analytics
  useEffect(() => {
    // Track product view
    if (product) {
      analytics.track('Product Viewed', {
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price
      });
    }

    // Cleanup: Send view time analytics
    return () => {
      if (product && viewTime > 0) {
        analytics.track('Product View Duration', {
          productId: product.id,
          viewTime: Math.floor(viewTime / 1000), // in seconds
          engaged: viewTime > 10000 // considered engaged if viewed > 10s
        });
      }
    };
  }, [product, viewTime]);

  // Auto-save recently viewed products
  useEffect(() => {
    if (product) {
      const recentlyViewed = JSON.parse(
        localStorage.getItem('recentlyViewed') || '[]'
      );
      
      const updated = [
        product,
        ...recentlyViewed.filter(p => p.id !== product.id)
      ].slice(0, 10); // Keep only last 10
      
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    }
  }, [product]);

  if (loading) {
    return (
      <div className="product-loading">
        <div className="skeleton-loader">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-error">
        <h2>Unable to load product</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="product-page">
      {product && (
        <>
          <ProductDetails product={product} />
          <ProductReviews reviews={reviews} />
          <RelatedProducts products={relatedProducts} />
          {process.env.NODE_ENV === 'development' && (
            <div className="debug-info">
              View Time: {Math.floor(viewTime / 1000)}s
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

### 2. Shopping Cart with Real-time Updates

```jsx
import { useState, useEffect, useCallback, useRef } from 'react';

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'syncing', 'offline'
  const [pendingUpdates, setPendingUpdates] = useState([]);
  
  const syncTimeout = useRef(null);
  const wsConnection = useRef(null);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingUpdates();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // WebSocket connection for real-time cart updates
  useEffect(() => {
    if (isOnline) {
      wsConnection.current = new WebSocket(`${process.env.REACT_APP_WS_URL}/cart`);
      
      wsConnection.current.onopen = () => {
        console.log('Cart WebSocket connected');
      };

      wsConnection.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'CART_UPDATED') {
          setCartItems(data.items);
        }
      };

      wsConnection.current.onclose = () => {
        console.log('Cart WebSocket disconnected');
      };

      return () => {
        if (wsConnection.current) {
          wsConnection.current.close();
        }
      };
    }
  }, [isOnline]);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Auto-save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart_backup', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync pending updates when online
  const syncPendingUpdates = useCallback(async () => {
    if (pendingUpdates.length === 0) return;

    setSyncStatus('syncing');
    
    try {
      for (const update of pendingUpdates) {
        await fetch('/api/cart/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        });
      }
      
      setPendingUpdates([]);
      setSyncStatus('synced');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('offline');
    }
  }, [pendingUpdates]);

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items);
      } else {
        // Fallback to localStorage
        const backup = localStorage.getItem('cart_backup');
        if (backup) {
          setCartItems(JSON.parse(backup));
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      const backup = localStorage.getItem('cart_backup');
      if (backup) {
        setCartItems(JSON.parse(backup));
      }
    }
  };

  const updateCartItem = useCallback(async (itemId, quantity) => {
    // Optimistic update
    setCartItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );

    const updateData = { itemId, quantity, timestamp: Date.now() };

    if (isOnline) {
      try {
        setSyncStatus('syncing');
        
        const response = await fetch(`/api/cart/items/${itemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity })
        });

        if (response.ok) {
          setSyncStatus('synced');
        } else {
          throw new Error('Update failed');
        }
      } catch (error) {
        // Add to pending updates for later sync
        setPendingUpdates(prev => [...prev, updateData]);
        setSyncStatus('offline');
      }
    } else {
      // Add to pending updates
      setPendingUpdates(prev => [...prev, updateData]);
    }
  }, [isOnline]);

  // Debounced sync for better performance
  useEffect(() => {
    if (isOnline && pendingUpdates.length > 0) {
      clearTimeout(syncTimeout.current);
      syncTimeout.current = setTimeout(() => {
        syncPendingUpdates();
      }, 2000);
    }

    return () => clearTimeout(syncTimeout.current);
  }, [pendingUpdates, isOnline, syncPendingUpdates]);

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <div className={`sync-status ${syncStatus}`}>
          {syncStatus === 'synced' && '✅ Synced'}
          {syncStatus === 'syncing' && '🔄 Syncing...'}
          {syncStatus === 'offline' && '⚠️ Offline'}
          {!isOnline && ' (No Internet)'}
        </div>
      </div>

      {pendingUpdates.length > 0 && (
        <div className="pending-updates-notice">
          {pendingUpdates.length} changes pending sync
        </div>
      )}

      <div className="cart-items">
        {cartItems.map(item => (
          <CartItem 
            key={item.id} 
            item={item} 
            onUpdateQuantity={updateCartItem}
          />
        ))}
      </div>
    </div>
  );
}

function CartItem({ item, onUpdateQuantity }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateTimeout = useRef(null);

  const handleQuantityChange = (newQuantity) => {
    setIsUpdating(true);
    onUpdateQuantity(item.id, newQuantity);

    // Reset updating state after delay
    clearTimeout(updateTimeout.current);
    updateTimeout.current = setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };

  useEffect(() => {
    return () => clearTimeout(updateTimeout.current);
  }, []);

  return (
    <div className={`cart-item ${isUpdating ? 'updating' : ''}`}>
      <span>{item.name}</span>
      <div className="quantity-controls">
        <button onClick={() => handleQuantityChange(item.quantity - 1)}>
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => handleQuantityChange(item.quantity + 1)}>
          +
        </button>
      </div>
      <span>${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  );
}
```

### 3. User Session Management with Lifecycle

```jsx
function UserSessionManager({ children }) {
  const [user, setUser] = useState(null);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [isIdle, setIsIdle] = useState(false);
  
  const idleTimeout = useRef(null);
  const warningTimeout = useRef(null);
  const sessionExtendTimeout = useRef(null);

  // Track user activity
  useEffect(() => {
    let activityTimeout;
    const IDLE_TIME = 15 * 60 * 1000; // 15 minutes
    const WARNING_TIME = 2 * 60 * 1000; // 2 minutes before logout

    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(activityTimeout);
      clearTimeout(warningTimeout.current);
      
      activityTimeout = setTimeout(() => {
        setIsIdle(true);
        
        // Show warning before auto-logout
        warningTimeout.current = setTimeout(() => {
          logout('Session expired due to inactivity');
        }, WARNING_TIME);
        
      }, IDLE_TIME);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });

    resetIdleTimer(); // Initialize timer

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer, true);
      });
      clearTimeout(activityTimeout);
      clearTimeout(warningTimeout.current);
    };
  }, [user]);

  // Auto-extend session
  useEffect(() => {
    if (user && !isIdle) {
      const extendSession = async () => {
        try {
          const response = await fetch('/api/auth/extend-session', {
            method: 'POST',
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            setSessionTimeout(data.expiresAt);
          }
        } catch (error) {
          console.error('Failed to extend session:', error);
        }
      };

      // Extend session every 10 minutes when active
      sessionExtendTimeout.current = setInterval(extendSession, 10 * 60 * 1000);

      return () => clearInterval(sessionExtendTimeout.current);
    }
  }, [user, isIdle]);

  const logout = useCallback((reason) => {
    setUser(null);
    localStorage.removeItem('user');
    
    // Clear all timeouts
    clearTimeout(idleTimeout.current);
    clearTimeout(warningTimeout.current);
    clearInterval(sessionExtendTimeout.current);
    
    // Redirect to login
    window.location.href = `/login?reason=${encodeURIComponent(reason)}`;
  }, []);

  return (
    <UserContext.Provider value={{ user, isIdle, logout }}>
      {isIdle && (
        <IdleWarningModal 
          onContinue={() => setIsIdle(false)}
          onLogout={() => logout('Logged out due to inactivity')}
        />
      )}
      {children}
    </UserContext.Provider>
  );
}
```

---

## Performance Optimization with Lifecycle

### 1. Component Memoization with Lifecycle

```jsx
import { memo, useMemo, useCallback } from 'react';

const ProductCard = memo(({ product, onAddToCart }) => {
  // Expensive calculation that should only run when product changes
  const discountPercentage = useMemo(() => {
    if (product.originalPrice && product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  }, [product.originalPrice, product.price]);

  // Memoized callback to prevent child re-renders
  const handleAddToCart = useCallback(() => {
    onAddToCart(product.id, 1);
  }, [product.id, onAddToCart]);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <div className="price">
        <span className="current-price">${product.price}</span>
        {discountPercentage > 0 && (
          <>
            <span className="original-price">${product.originalPrice}</span>
            <span className="discount">-{discountPercentage}%</span>
          </>
        )}
      </div>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
});

// Display name for debugging
ProductCard.displayName = 'ProductCard';
```

### 2. Lazy Loading with Intersection Observer

```jsx
import { useState, useEffect, useRef } from 'react';

function LazyProductGrid({ products }) {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20); // Initial load
  const loaderRef = useRef(null);

  // Initialize with first batch
  useEffect(() => {
    setVisibleProducts(products.slice(0, loadedCount));
  }, [products, loadedCount]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loadedCount < products.length) {
          setLoadedCount(prev => Math.min(prev + 20, products.length));
        }
      },
      { rootMargin: '100px' }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadedCount, products.length]);

  return (
    <div className="product-grid">
      {visibleProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      {loadedCount < products.length && (
        <div ref={loaderRef} className="loading-indicator">
          Loading more products...
        </div>
      )}
    </div>
  );
}
```

---

## Interview Questions & Answers

### Basic Level

**Q1: What are the main phases of React component lifecycle?**
**A:** The three main phases are:
1. **Mounting**: Component is being created and inserted into DOM
2. **Updating**: Component is being re-rendered as a result of props or state changes  
3. **Unmounting**: Component is being removed from DOM

**Q2: How does useEffect replace lifecycle methods?**
**A:** 
- `useEffect(() => {}, [])` = `componentDidMount`
- `useEffect(() => {})` = `componentDidUpdate` 
- `useEffect(() => { return () => {} }, [])` = `componentWillUnmount`

**Q3: Why do we need cleanup in useEffect?**
**A:** Cleanup prevents memory leaks by canceling subscriptions, clearing timers, and aborting network requests when component unmounts or dependencies change.

### Intermediate Level

**Q4: How would you implement componentDidUpdate equivalent with useEffect?**
**A:** 
```jsx
const [count, setCount] = useState(0);
const prevCount = useRef();

useEffect(() => {
  if (prevCount.current !== undefined && prevCount.current !== count) {
    console.log('Count updated from', prevCount.current, 'to', count);
  }
  prevCount.current = count;
});
```

**Q5: How do you prevent useEffect from running on mount?**
**A:** Use a ref to track if it's the first render:
```jsx
const isFirstRender = useRef(true);

useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }
  // This runs only on updates
}, [dependency]);
```

### Advanced Level

**Q6: How would you implement shouldComponentUpdate with hooks?**
**A:** Use `React.memo` with a custom comparison function:
```jsx
const MyComponent = React.memo(({ prop1, prop2 }) => {
  return <div>{prop1} {prop2}</div>;
}, (prevProps, nextProps) => {
  return prevProps.prop1 === nextProps.prop1 && 
         prevProps.prop2 === nextProps.prop2;
});
```

**Q7: How do you handle async operations in useEffect properly?**
**A:** 
```jsx
useEffect(() => {
  let isMounted = true;
  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data', {
        signal: abortController.signal
      });
      const data = await response.json();
      
      if (isMounted) {
        setData(data);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && isMounted) {
        setError(error);
      }
    }
  };

  fetchData();

  return () => {
    isMounted = false;
    abortController.abort();
  };
}, []);
```

---

## Testing Lifecycle Methods

### 1. Testing useEffect

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('fetches data on mount', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'test data' })
  });

  render(<DataComponent />);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('/api/data');
  });
});

test('cleans up on unmount', () => {
  const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
  
  const { unmount } = render(<TimerComponent />);
  
  unmount();
  
  expect(clearIntervalSpy).toHaveBeenCalled();
});
```

### 2. Testing Component Updates

```jsx
import { render, fireEvent } from '@testing-library/react';

test('updates component when props change', () => {
  const { rerender } = render(<Counter count={0} />);
  
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
  
  rerender(<Counter count={5} />);
  
  expect(screen.getByText('Count: 5')).toBeInTheDocument();
});
```

---

## Summary

React lifecycle management has evolved from class component methods to hooks-based approach. Modern React applications rely heavily on `useEffect` for side effects, with proper cleanup being crucial for performance and preventing memory leaks. In e-commerce applications, lifecycle management is essential for data fetching, real-time updates, session management, and performance optimization.

### Interview-Friendly Tips

- **Class vs Hooks**: Hooks provide more flexibility and cleaner code than class lifecycle methods
- **useEffect patterns**: Empty deps array for mount, deps for updates, cleanup function for unmount
- **Performance**: Use `useMemo`, `useCallback`, and `React.memo` to optimize re-renders
- **Async handling**: Always handle cleanup for async operations to prevent memory leaks
- **Testing**: Test both successful operations and cleanup scenariosManagement](#advanced-lifecycle-management)
5. [Real-Life E-Commerce Project Examples](#real-life-e-commerce-project-examples)
6. [Performance Optimization with Lifecycle](#performance-optimization-with-lifecycle)
7. [Interview Questions & Answers](#interview-questions--answers)
8. [Best Practices](#best-practices)
9. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
10. [Testing Lifecycle Methods](#testing-lifecycle-methods)

---

## What is the React Lifecycle?

The React lifecycle refers to the phases a component goes through: mounting, updating, and unmounting. Class components use lifecycle methods, while functional components use the `useEffect` hook.

### Real-World Analogy
Think of a component’s lifecycle as a plant: it’s planted (mounted), grows (updates), and is removed (unmounted).

### Why Understand Lifecycle?
- **Control Behavior**: Execute code at specific phases.
- **Resource Management**: Handle setup and cleanup.
- **Optimization**: Prevent unnecessary work.

---

## Class Component Lifecycle Methods

### Mounting
- **constructor**: Initialize state and bind methods.
- **render**: Render the UI.
- **componentDidMount**: Run after mounting (e.g., fetch data).

**Example**
```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log('Mounted');
  }

  render() {
    return <p>Count: {this.state.count}</p>;
  }
}
```

### Updating
- **shouldComponentUpdate**: Optimize by preventing renders.
- **render**: Re-render on state/props change.
- **componentDidUpdate**: Run after updates.

**Example**
```jsx
class Counter extends React.Component {
  state = { count: 0 };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      console.log('Count updated:', this.state.count);
    }
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}
```

### Unmounting
- **componentWillUnmount**: Cleanup before removal.

**Example**
```jsx
class Timer extends React.Component {
  componentDidMount() {
    this.timer = setInterval(() => console.log('Tick'), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <p>Timer running</p>;
  }
}
```

---

## useEffect Hook

The `useEffect` hook handles side effects in functional components, replacing lifecycle methods.

**Example: useEffect**
```jsx
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Effect ran');
    return () => console.log('Cleanup');
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>Count: {count}</button>
  );
}
```

### Common useEffect Patterns
- **Mounting**: Empty dependency array (`[]`).
- **Updating**: Include dependencies in the array.
- **Unmounting**: Return a cleanup function.

**Example: Fetching Data**
```jsx
function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <p>{data ? JSON.stringify(data) : 'Loading...'}</p>;
}
```

---

## Advanced Lifecycle Management

### Conditional Effects
Run effects conditionally using dependencies.

**Example**
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  return <p>{user ? user.name : 'Loading...'}</p>;
}
```

### Cleanup in useEffect
Prevent memory leaks with cleanup functions.

**Example**
```jsx
function Timer() {
  useEffect(() => {
    const timer = setInterval(() => console.log('Tick'), 1000);
    return () => clearInterval(timer);
  }, []);

  return <p>Timer running</p>;
}
```

---

## Real-Life Project Examples

### 1. Real-Time Clock
A clock updating every second.

```jsx
import { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <p>Current time: {time.toLocaleTimeString()}</p>;
}
```

### 2. Data Fetcher with Loading State
A component fetching data on mount.

```jsx
import { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

## Best Practices

### 1. Minimize Side Effects
Keep `useEffect` logic focused.

**Example**
```jsx
useEffect(() => {
  // Only fetch data
  fetchData();
}, []);
```

### 2. Always Include Dependencies
Avoid missing dependencies to prevent bugs.

**Example**
```jsx
useEffect(() => {
  fetchData(id);
}, [id]);
```

### 3. Cleanup Resources
Always return cleanup functions.

**Example**
```jsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

### 4. Avoid Overfetching
Debounce or throttle frequent updates.

**Example**
```jsx
import _ from 'lodash';

const debouncedFetch = _.debounce(fetchData, 500);
```

---

## Common Pitfalls and Solutions

### Pitfall: Missing Dependencies
Omitting dependencies causes stale data.

**Solution**
```jsx
useEffect(() => {
  fetchData(id);
}, [id]); // Include id
```

### Pitfall: Infinite Loops
Incorrect dependencies cause endless renders.

**Solution**: Use `useCallback` or correct dependencies.

### Pitfall: No Cleanup
Missing cleanup leads to memory leaks.

**Solution**
```jsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

---

## Summary
React’s lifecycle is managed with class methods or `useEffect`. Proper lifecycle management ensures efficient resource use and prevents bugs.

### Interview-Friendly Tips
- **What are lifecycle phases?** Mounting, updating, unmounting.
- **useEffect vs componentDidMount?** `useEffect` with `[]` mimics `componentDidMount`.
- **Why cleanup in useEffect?** To prevent memory leaks (e.g., timers, subscriptions).
- **How to optimize lifecycle?** Minimize effects, use correct dependencies.