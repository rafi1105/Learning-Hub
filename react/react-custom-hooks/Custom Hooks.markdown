# React Custom Hooks - Complete Interview & E-Commerce Guide

## Table of Contents
1. [What are Custom Hooks?](#what-are-custom-hooks)
2. [Creating Your First Custom Hook](#creating-your-first-custom-hook)
3. [Advanced Custom Hook Patterns](#advanced-custom-hook-patterns)
4. [Real-Life E-Commerce Custom Hooks](#real-life-e-commerce-custom-hooks)
5. [Performance Optimization with Custom Hooks](#performance-optimization-with-custom-hooks)
6. [Testing Custom Hooks](#testing-custom-hooks)
7. [Interview Questions & Answers](#interview-questions--answers)
8. [Best Practices](#best-practices)
9. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
10. [Production-Ready Hook Library](#production-ready-hook-library)

---

## What are Custom Hooks?

Custom hooks are JavaScript functions that start with "use" and can call other hooks. They allow you to extract component logic into reusable functions, promoting code reuse and separation of concerns.

### Real-World Analogy
Think of custom hooks as specialized tools in a toolbox. Instead of using basic tools (useState, useEffect) repeatedly, you create specialized tools (custom hooks) for specific tasks like data fetching, form handling, or API management.

### Why Custom Hooks?
- **Reusability**: Share logic between components
- **Separation of Concerns**: Keep components focused on rendering
- **Testability**: Test business logic independently
- **Maintainability**: Centralize complex logic

---

## Creating Your First Custom Hook

### Basic Custom Hook Structure

```jsx
import { useState, useEffect } from 'react';

// Simple custom hook for API data fetching
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage in component
function ProductList() {
  const { data: products, loading, error } = useApi('/api/products');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {products?.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Custom Hook with Parameters and Actions

```jsx
function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value) => {
    setCount(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
    isPositive: count > 0,
    isNegative: count < 0,
    isZero: count === 0
  };
}

// Usage
function CounterComponent() {
  const { count, increment, decrement, reset, isPositive } = useCounter(0, 2);

  return (
    <div>
      <p>Count: {count} {isPositive && '(Positive)'}</p>
      <button onClick={increment}>+2</button>
      <button onClick={decrement}>-2</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

## Advanced Custom Hook Patterns

### 1. Hook with Cleanup and Cancellation

```jsx
function useFetchWithCleanup(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (url) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
```

### 2. Hook with Caching and Persistence

```jsx
function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  const removeValue = useCallback(() => {
    try {
      setState(defaultValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [state, setValue, removeValue];
}

// Usage
function UserPreferences() {
  const [theme, setTheme, removeTheme] = useLocalStorageState('theme', 'light');
  const [language, setLanguage] = useLocalStorageState('language', 'en');

  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <button onClick={removeTheme}>Reset Theme</button>
    </div>
  );
}
```

---

## Real-Life E-Commerce Custom Hooks

### 1. Shopping Cart Management Hook

```jsx
function useShoppingCart() {
  const [items, setItems] = useLocalStorageState('cart', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [items]);

  // Add item to cart
  const addItem = useCallback(async (product, quantity = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check stock availability
      const stockResponse = await fetch(`/api/products/${product.id}/stock`);
      const stockData = await stockResponse.json();

      if (stockData.available < quantity) {
        throw new Error(`Only ${stockData.available} items available`);
      }

      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === product.id);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > stockData.available) {
            throw new Error(`Cannot add more than ${stockData.available} items`);
          }
          
          return currentItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        } else {
          return [...currentItems, { ...product, quantity }];
        }
      });

      // Track analytics
      analytics.track('Product Added to Cart', {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price
      });

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setItems]);

  // Remove item from cart
  const removeItem = useCallback((productId) => {
    setItems(currentItems => {
      const removedItem = currentItems.find(item => item.id === productId);
      
      if (removedItem) {
        analytics.track('Product Removed from Cart', {
          productId: removedItem.id,
          productName: removedItem.name,
          quantity: removedItem.quantity
        });
      }

      return currentItems.filter(item => item.id !== productId);
    });
  }, [setItems]);

  // Update item quantity
  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check stock availability
      const stockResponse = await fetch(`/api/products/${productId}/stock`);
      const stockData = await stockResponse.json();

      if (stockData.available < newQuantity) {
        throw new Error(`Only ${stockData.available} items available`);
      }

      setItems(currentItems =>
        currentItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setItems, removeItem]);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
    analytics.track('Cart Cleared');
  }, [setItems]);

  // Get item by id
  const getItem = useCallback((productId) => {
    return items.find(item => item.id === productId);
  }, [items]);

  // Check if item is in cart
  const isInCart = useCallback((productId) => {
    return items.some(item => item.id === productId);
  }, [items]);

  return {
    items,
    totals,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
    isInCart
  };
}

// Usage in components
function ProductCard({ product }) {
  const { addItem, isInCart, isLoading } = useShoppingCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      await addItem(product, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <div>
        <input 
          type="number" 
          value={quantity} 
          onChange={e => setQuantity(parseInt(e.target.value))}
          min="1"
        />
        <button 
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          {isInCart(product.id) ? 'Update Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
```

### 2. Product Search & Filter Hook

```jsx
function useProductSearch(initialFilters = {}) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'name',
    sortOrder: 'asc',
    inStock: false,
    ...initialFilters
  });

  const [searchHistory, setSearchHistory] = useLocalStorageState('searchHistory', []);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((searchTerm) => {
      if (searchTerm && searchTerm.length > 2) {
        setSearchHistory(prev => {
          const updated = [searchTerm, ...prev.filter(term => term !== searchTerm)];
          return updated.slice(0, 10); // Keep only last 10 searches
        });
      }
    }, 500),
    [setSearchHistory]
  );

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'newest':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredProducts(filtered);

    // Track search analytics
    if (filters.search) {
      analytics.track('Product Search', {
        searchTerm: filters.search,
        resultsCount: filtered.length,
        filters: { ...filters, search: undefined }
      });
    }
  }, [products, filters]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search effect
  useEffect(() => {
    debouncedSearch(filters.search);
  }, [filters.search, debouncedSearch]);

  // Update individual filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update multiple filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'all',
      priceRange: [0, 1000],
      sortBy: 'name',
      sortOrder: 'asc',
      inStock: false
    });
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.sort();
  }, [products]);

  // Get price range
  const priceRange = useMemo(() => {
    if (products.length === 0) return [0, 1000];
    
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  return {
    // Data
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    
    // Filters
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    
    // Metadata
    categories,
    priceRange,
    searchHistory,
    
    // Actions
    refetch: fetchProducts,
    
    // Stats
    totalCount: products.length,
    filteredCount: filteredProducts.length
  };
}

// Usage
function ProductSearchPage() {
  const {
    products,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    categories,
    priceRange,
    searchHistory,
    totalCount,
    filteredCount
  } = useProductSearch();

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-search-page">
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
        />
        
        <select
          value={filters.category}
          onChange={e => updateFilter('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <div className="price-range">
          <label>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</label>
          <input
            type="range"
            min={priceRange[0]}
            max={priceRange[1]}
            value={filters.priceRange[1]}
            onChange={e => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
          />
        </div>

        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      <div className="results">
        <p>{filteredCount} of {totalCount} products</p>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {searchHistory.length > 0 && (
        <div className="search-history">
          <h3>Recent Searches</h3>
          {searchHistory.map((term, index) => (
            <button
              key={index}
              onClick={() => updateFilter('search', term)}
              className="history-item"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3. User Authentication Hook

```jsx
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);
      setUser(data.user);

      // Track login
      analytics.track('User Logged In', {
        userId: data.user.id,
        method: 'email'
      });

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('authToken', data.token);
      setUser(data.user);

      // Track registration
      analytics.track('User Registered', {
        userId: data.user.id,
        method: 'email'
      });

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    
    // Track logout
    if (user) {
      analytics.track('User Logged Out', {
        userId: user.id
      });
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
}

// Usage
function LoginForm() {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success('Logged in successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={formData.email}
        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## Interview Questions & Answers

### Basic Level

**Q1: What is a custom hook in React?**
**A:** A custom hook is a JavaScript function that starts with "use" and can call other React hooks. It allows you to extract component logic into reusable functions.

**Q2: What are the rules for custom hooks?**
**A:** Custom hooks must:
1. Start with the word "use"
2. Follow the rules of hooks (only call at top level)
3. Can call other hooks
4. Can be called from React functions or other custom hooks

**Q3: How do custom hooks help with code reuse?**
**A:** Custom hooks extract stateful logic from components, allowing multiple components to share the same logic without duplicating code.

### Intermediate Level

**Q4: How would you create a custom hook for form handling?**
**A:** 
```jsx
function useForm(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(key => {
      const rule = validationRules[key];
      if (rule.required && !values[key]) {
        newErrors[key] = `${key} is required`;
      }
      // Add more validation logic
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (onSubmit) => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, errors, isSubmitting, handleChange, handleSubmit };
}
```

**Q5: How do you test custom hooks?**
**A:** Use React Testing Library's `renderHook`:
```jsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter(0));
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### Advanced Level

**Q6: How would you create a custom hook with cleanup and error handling?**
**A:** 
```jsx
function useAsyncOperation() {
  const [state, setState] = useState({ data: null, loading: false, error: null });
  const abortControllerRef = useRef();

  const execute = useCallback(async (asyncFunction) => {
    // Cancel previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState({ data: null, loading: true, error: null });

    try {
      const result = await asyncFunction(abortControllerRef.current.signal);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      if (error.name !== 'AbortError') {
        setState({ data: null, loading: false, error: error.message });
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { ...state, execute };
}
```

---

## Summary

Custom hooks are powerful tools for extracting and reusing component logic in React applications. They promote code reuse, separation of concerns, and testability. In e-commerce applications, custom hooks are essential for managing complex state like shopping carts, user authentication, product searches, and API interactions. Mastering custom hooks is crucial for building maintainable and scalable React applications.

### Interview-Friendly Tips

- **Purpose**: Custom hooks extract reusable stateful logic from components
- **Naming**: Must start with "use" and follow hook rules
- **Benefits**: Code reuse, easier testing, separation of concerns
- **Common patterns**: Data fetching, form handling, localStorage, timers
- **Testing**: Use `renderHook` from React Testing Library
- **Performance**: Use `useMemo` and `useCallback` within custom hooks for optimization

## Table of Contents
1. [What are Custom Hooks?](#what-are-custom-hooks)
2. [Creating Custom Hooks](#creating-custom-hooks)
3. [Hook Composition](#hook-composition)
4. [Advanced Hook Patterns](#advanced-hook-patterns)
5. [Real-Life Project Examples](#real-life-project-examples)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## What are Custom Hooks?

Custom hooks are reusable functions that encapsulate React hook logic, allowing components to share stateful logic without duplicating code.

### Real-World Analogy
Think of custom hooks as reusable kitchen appliances: a blender (hook) performs a specific task (logic) that multiple recipes (components) can use.

### Why Custom Hooks?
- **Reusability**: Share logic across components.
- **Readability**: Encapsulate complex logic.
- **Testability**: Isolate logic for easier testing.

---

## Creating Custom Hooks

Custom hooks are functions that use built-in hooks (e.g., `useState`, `useEffect`).

**Example: useCounter**
```jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

## Hook Composition

Combine multiple hooks within a custom hook.

**Example: useForm**
```jsx
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!values.email?.includes('@')) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, handleChange, validate };
}

function Form() {
  const { values, errors, handleChange, validate } = useForm({ email: '' });

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) console.log('Submitted:', values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email} onChange={handleChange} />
      {errors.email && <p>{errors.email}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Advanced Hook Patterns

### useDebounce
Debounce rapid state updates.

**Example**
```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    console.log('Searching:', debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### useLocalStorage
Sync state with localStorage.

**Example**
```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [name, setName] = useLocalStorage('name', '');

  return <input value={name} onChange={e => setName(e.target.value)} />;
}
```

---

## Real-Life Project Examples

### 1. useFetch Hook
A hook for fetching data.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        setData(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [url]);

  return { data, loading, error };
}

function UserList() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 2. useOnlineStatus Hook
Track network status.

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

function App() {
  const isOnline = useOnlineStatus();
  return <p>{isOnline ? 'Online' : 'Offline'}</p>;
}
```

---

## Best Practices

### 1. Follow Hook Naming
Prefix with `use` to indicate a hook.

**Example**
```jsx
function useCustomHook() {}
```

### 2. Keep Hooks Focused
Each hook should handle one concern.

**Example**
```jsx
// ❌ Bad
function useComplexLogic() {
  // Multiple concerns
}

// ✅ Good
function useFetch() {}
function useAuth() {}
```

### 3. Handle Cleanup
Always clean up side effects.

**Example**
```jsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

### 4. Test Hooks
Test hooks independently.

**Example**
```jsx
import { renderHook } from '@testing-library/react-hooks';

test('useCounter', () => {
  const { result } = renderHook(() => useCounter(0));
  expect(result.current.count).toBe(0);
});
```

---

## Common Pitfalls and Solutions

### Pitfall: Breaking Rules of Hooks
Calling hooks conditionally or in loops.

**Solution**: Always call hooks at the top level.

### Pitfall: Missing Dependencies
Incorrect `useEffect` dependencies.

**Solution**
```jsx
useEffect(() => {
  fetchData(id);
}, [id]);
```

### Pitfall: Overcomplicating Hooks
Complex hooks reduce reusability.

**Solution**: Break into smaller hooks.

---

## Summary
Custom hooks encapsulate reusable logic, improving code modularity and readability. They’re a cornerstone of modern React development.

### Interview-Friendly Tips
- **Why use custom hooks?** For reusable, testable logic.
- **How to name hooks?** Prefix with `use` (e.g., `useFetch`).
- **How to test hooks?** Use `@testing-library/react-hooks`.
- **When to create a hook?** When logic is reused across components.