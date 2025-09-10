# 🌟 Complete DOM Manipulation Learning Guide


## 📖 Table of Contents

1. [What is DOM?](#what-is-dom)
2. [DOM Tree Structure](#dom-tree-structure)
3. [Selecting Elements](#selecting-elements)
4. [Modifying Content](#modifying-content)
5. [Styling Elements](#styling-elements)
6. [Creating & Removing Elements](#creating--removing-elements)
7. [Event Handling](#event-handling)
8. [Form Manipulation](#form-manipulation)
9. [Advanced DOM Techniques](#advanced-dom-techniques)
10. [Real-World Examples](#real-world-examples)
11. [Best Practices](#best-practices)
12. [Performance Tips](#performance-tips)
13. [Browser Compatibility](#browser-compatibility)

---

## 🎯 What is DOM?

The **Document Object Model (DOM)** is a programming interface that represents HTML and XML documents as a tree structure of objects. It allows JavaScript to dynamically access and manipulate the content, structure, and style of web pages.

### Key Concepts:
- **Document**: The entire HTML page
- **Element**: HTML tags like `<div>`, `<p>`, `<h1>`
- **Node**: Everything in the DOM (elements, text, comments)
- **Tree Structure**: Hierarchical organization of elements

```javascript
// The DOM represents HTML like this:
document
  └── html
      ├── head
      │   ├── title
      │   └── meta
      └── body
          ├── h1
          ├── div
          │   ├── p
          │   └── span
          └── footer
```

---

## 🌳 DOM Tree Structure

Understanding the DOM tree is crucial for effective manipulation.

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <div id="container">
        <h1 class="title">Welcome</h1>
        <p class="content">Hello World!</p>
    </div>
</body>
</html>
```

```javascript
// Navigating the DOM Tree
const container = document.getElementById('container');

// Parent node
console.log(container.parentNode); // <body>

// Child nodes
console.log(container.children); // [h1.title, p.content]
console.log(container.firstElementChild); // <h1>
console.log(container.lastElementChild); // <p>

// Sibling nodes
const title = document.querySelector('.title');
console.log(title.nextElementSibling); // <p>
console.log(title.previousElementSibling); // null
```

---

## 🔍 Selecting Elements

### 1. **getElementById()**
```javascript
// Select by ID (returns single element)
const header = document.getElementById('header');
console.log(header);
```

### 2. **getElementsByClassName()**
```javascript
// Select by class name (returns HTMLCollection)
const buttons = document.getElementsByClassName('btn');
console.log(buttons[0]); // First button
```

### 3. **getElementsByTagName()**
```javascript
// Select by tag name (returns HTMLCollection)
const paragraphs = document.getElementsByTagName('p');
for (let p of paragraphs) {
    console.log(p.textContent);
}
```

### 4. **querySelector()** ⭐ Most Popular
```javascript
// Select first matching element (CSS selector)
const firstButton = document.querySelector('.btn');
const specificDiv = document.querySelector('#container .content');
const input = document.querySelector('input[type="email"]');
```

### 5. **querySelectorAll()** ⭐ Most Popular
```javascript
// Select all matching elements (NodeList)
const allButtons = document.querySelectorAll('.btn');
const listItems = document.querySelectorAll('ul li');

// Loop through NodeList
allButtons.forEach(button => {
    console.log(button.textContent);
});
```

### 🎯 Practical Selection Examples
```javascript
// Complex selectors
const nestedSpan = document.querySelector('.container  .card  span');
console.log('Span:', nestedSpan.textContent);

const evenRows = document.querySelectorAll('tr:nth-child(even)');
const requiredInputs = document.querySelectorAll('input[required]');

const checkedBoxes = document.querySelectorAll('input[type="checkbox"]');

check[0].checked= true; // for one 
// Set all checkboxes to checked
check.forEach(checkbox => { // for all 
    checkbox.checked = true;
});
```

---

## ✏️ Modifying Content

### 1. **textContent** (Safe Text Only)
```javascript
const title = document.querySelector('h1');

// Get text content
console.log(title.textContent); // "Welcome"

// Set text content (safe from XSS)
title.textContent = 'New Title';
title.textContent = '<script>alert("hack")</script>'; // Renders as text, not code
```

### 2. **innerHTML** (HTML Content)
```javascript
const container = document.querySelector('.container');

// Get HTML content
console.log(container.innerHTML);

// Set HTML content (use carefully)
container.innerHTML = '<p>New <strong>content</strong></p>';

// Add to existing content
container.innerHTML += '<div>Additional content</div>';
```

### 3. **innerText** (Visible Text)
```javascript
const element = document.querySelector('.hidden-content');

// innerText respects CSS styling (ignores hidden content)
console.log(element.innerText);

// textContent gets all text regardless of styling
console.log(element.textContent);
```

### 🛡️ Safe Content Insertion
```javascript
// Safe way to insert user content
function insertSafeContent(element, userInput) {
    element.textContent = userInput; // Always safe
}

// For HTML content, use textContent + createElement
function insertHTMLSafely(container, text) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = text;
    p.appendChild(strong);
    container.appendChild(p);
}
```

---

## 🎨 Styling Elements

### 1. **Direct Style Manipulation**
```javascript
const box = document.querySelector('.box');

// Set individual styles
box.style.backgroundColor = 'blue';
box.style.width = '200px';
box.style.height = '100px';
box.style.border = '2px solid red';

// CSS properties with hyphens become camelCase
box.style.borderRadius = '10px';
box.style.fontSize = '16px';
box.style.textAlign = 'center';
```

### 2. **CSS Classes** ⭐ Recommended
```javascript
const element = document.querySelector('.card');

// Add class
element.classList.add('active');
element.classList.add('highlighted', 'expanded'); // Multiple classes

// Remove class
element.classList.remove('inactive');

// Toggle class
element.classList.toggle('visible'); // Add if not present, remove if present

// Check if class exists
if (element.classList.contains('active')) {
    console.log('Element is active');
}

// Replace class
element.classList.replace('old-class', 'new-class');
```

### 3. **CSS Custom Properties (Variables)**
```javascript
// Set CSS custom properties
document.documentElement.style.setProperty('--main-color', '#3498db');
document.documentElement.style.setProperty('--font-size', '18px');

// Get CSS custom properties
const mainColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--main-color');
```

### 🌈 Practical Styling Examples
```javascript
// Theme switcher
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    }
}

// Dynamic progress bar
function updateProgressBar(percentage) {
    const progressBar = document.querySelector('.progress-fill');
    progressBar.style.width = `${percentage}%`;
    progressBar.style.backgroundColor = percentage < 50 ? 'red' : 'green';
}

// Responsive font sizing
function adjustFontSize() {
    const elements = document.querySelectorAll('.responsive-text');
    const screenWidth = window.innerWidth;
    
    elements.forEach(el => {
        if (screenWidth < 768) {
            el.style.fontSize = '14px';
        } else if (screenWidth < 1024) {
            el.style.fontSize = '16px';
        } else {
            el.style.fontSize = '18px';
        }
    });
}
```

---

## 🏗️ Creating & Removing Elements

### 1. **Creating Elements**
```javascript
// Create new element
const newDiv = document.createElement('div');
const newP = document.createElement('p');
const newImg = document.createElement('img');

// Set attributes and content
newDiv.className = 'card';
newDiv.id = 'unique-card';
newP.textContent = 'This is a new paragraph';
newImg.src = 'image.jpg';
newImg.alt = 'Description';
```

### 2. **Adding Elements to DOM**
```javascript
const container = document.querySelector('.container');
const list = document.querySelector('ul');

// Append to end
container.appendChild(newDiv);

// Insert at beginning
container.insertBefore(newP, container.firstChild);

// Insert adjacent to element
const referenceElement = document.querySelector('.reference');
referenceElement.insertAdjacentElement('beforebegin', newDiv); // Before element
referenceElement.insertAdjacentElement('afterbegin', newDiv);  // First child
referenceElement.insertAdjacentElement('beforeend', newDiv);   // Last child
referenceElement.insertAdjacentElement('afterend', newDiv);    // After element

// Modern method - prepend/append
container.prepend(newDiv); // Add to beginning
container.append(newP);    // Add to end
```

### 3. **Removing Elements**
```javascript
const elementToRemove = document.querySelector('.old-content');

// Modern way
elementToRemove.remove();

// Traditional way (still works)
elementToRemove.parentNode.removeChild(elementToRemove);

// Remove all children
const parent = document.querySelector('.parent');
parent.innerHTML = ''; // Quick but destroys event listeners

// Better way to remove all children
while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
}
```

### 🏭 Dynamic Content Examples
```javascript
// Create a card component
function createCard(title, content, imageUrl) {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" class="card-image">
        <div class="card-content">
            <h3 class="card-title">${title}</h3>
            <p class="card-text">${content}</p>
            <button class="card-btn">Read More</button>
        </div>
    `;
    
    return card;
}

// Create shopping cart item
function addCartItem(productId, name, price, quantity) {
    const cartContainer = document.querySelector('.cart-items');
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.productId = productId;
    
    cartItem.innerHTML = `
        <span class="item-name">${name}</span>
        <span class="item-price">$${price}</span>
        <input type="number" class="item-quantity" value="${quantity}" min="1">
        <button class="remove-item" onclick="removeCartItem('${productId}')">×</button>
    `;
    
    cartContainer.appendChild(cartItem);
}

// Dynamic list creation
function createList(items, container) {
    const ul = document.createElement('ul');
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.addEventListener('click', () => {
            li.classList.toggle('selected');
        });
        ul.appendChild(li);
    });
    
    container.appendChild(ul);
}
```

---

## 🎮 Event Handling

### 1. **addEventListener()** ⭐ Best Practice
```javascript
const button = document.querySelector('.btn');

// Basic event listener
button.addEventListener('click', function() {
    console.log('Button clicked!');
});

// Arrow function
button.addEventListener('click', () => {
    console.log('Button clicked!');
});

// Named function
function handleButtonClick() {
    console.log('Button clicked!');
}
button.addEventListener('click', handleButtonClick);
```

### 2. **Common Events**
```javascript
const input = document.querySelector('#email');
const form = document.querySelector('#contact-form');
const window = window;

// Mouse events
button.addEventListener('click', handleClick);
button.addEventListener('mouseover', handleMouseOver);
button.addEventListener('mouseout', handleMouseOut);
button.addEventListener('mousedown', handleMouseDown);
button.addEventListener('mouseup', handleMouseUp);

// Keyboard events
input.addEventListener('keydown', handleKeyDown);
input.addEventListener('keyup', handleKeyUp);
input.addEventListener('keypress', handleKeyPress);

// Form events
form.addEventListener('submit', handleSubmit);
input.addEventListener('focus', handleFocus);
input.addEventListener('blur', handleBlur);
input.addEventListener('change', handleChange);
input.addEventListener('input', handleInput); // Real-time input

// Window events
window.addEventListener('load', handleLoad);
window.addEventListener('resize', handleResize);
window.addEventListener('scroll', handleScroll);
```

### 3. **Event Object**
```javascript
button.addEventListener('click', function(event) {
    // Prevent default behavior
    event.preventDefault();
    
    // Stop event bubbling
    event.stopPropagation();
    
    // Get event details
    console.log('Event type:', event.type);
    console.log('Target element:', event.target);
    console.log('Current target:', event.currentTarget);
    console.log('Mouse position:', event.clientX, event.clientY);
});

// Keyboard event details
input.addEventListener('keydown', function(event) {
    console.log('Key pressed:', event.key);
    console.log('Key code:', event.keyCode);
    console.log('Ctrl pressed:', event.ctrlKey);
    console.log('Shift pressed:', event.shiftKey);
    console.log('Alt pressed:', event.altKey);
});
```

### 4. **Event Delegation** ⭐ Advanced Technique
```javascript
// Instead of adding listeners to each item
const itemContainer = document.querySelector('.item-container');

itemContainer.addEventListener('click', function(event) {
    // Check if clicked element matches our target
    if (event.target.classList.contains('item-button')) {
        console.log('Item button clicked:', event.target.textContent);
    }
    
    if (event.target.classList.contains('delete-btn')) {
        event.target.closest('.item').remove();
    }
});

// Works for dynamically added elements too!
function addNewItem(text) {
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.innerHTML = `
        <span>${text}</span>
        <button class="item-button">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
    itemContainer.appendChild(newItem);
}
```

### 🎯 Practical Event Examples
```javascript
// Auto-save form
const form = document.querySelector('#auto-save-form');
let saveTimeout;

form.addEventListener('input', function() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveFormData();
        showSaveIndicator();
    }, 1000); // Save after 1 second of inactivity
});

// Infinite scroll
window.addEventListener('scroll', function() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        loadMoreContent();
    }
});

// Real-time search
const searchInput = document.querySelector('#search');
const resultsContainer = document.querySelector('#results');

searchInput.addEventListener('input', function(event) {
    const query = event.target.value.trim();
    
    if (query.length > 2) {
        searchResults(query).then(results => {
            displayResults(results);
        });
    } else {
        resultsContainer.innerHTML = '';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveDocument();
    }
    
    if (event.key === 'Escape') {
        closeModal();
    }
});
```

---

## 📝 Form Manipulation

### 1. **Getting Form Values**
```javascript
// Get form element
const form = document.querySelector('#contact-form');

// Get individual input values
const name = document.querySelector('#name').value;
const email = document.querySelector('#email').value;
const message = document.querySelector('#message').value;

// Get all form data at once
const formData = new FormData(form);
for (let [key, value] of formData.entries()) {
    console.log(key, value);
}

// Convert FormData to object
function formDataToObject(formData) {
    const obj = {};
    for (let [key, value] of formData.entries()) {
        obj[key] = value;
    }
    return obj;
}
```

### 2. **Setting Form Values**
```javascript
// Set input values
document.querySelector('#name').value = 'John Doe';
document.querySelector('#email').value = 'john@example.com';

// Set checkbox/radio values
document.querySelector('#newsletter').checked = true;
document.querySelector('#gender-male').checked = true;

// Set select dropdown
document.querySelector('#country').value = 'US';

// Set multiple select
const multiSelect = document.querySelector('#skills');
multiSelect.options[0].selected = true;
multiSelect.options[2].selected = true;
```

### 3. **Form Validation**
```javascript
// Real-time validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password);
}

// Live validation
const emailInput = document.querySelector('#email');
const emailError = document.querySelector('#email-error');

emailInput.addEventListener('input', function() {
    const email = this.value;
    
    if (email === '') {
        emailError.textContent = '';
        this.classList.remove('valid', 'invalid');
    } else if (validateEmail(email)) {
        emailError.textContent = '';
        this.classList.add('valid');
        this.classList.remove('invalid');
    } else {
        emailError.textContent = 'Please enter a valid email address';
        this.classList.add('invalid');
        this.classList.remove('valid');
    }
});

// Form submission validation
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const data = formDataToObject(formData);
    
    // Validate all fields
    const errors = [];
    
    if (!data.name.trim()) {
        errors.push('Name is required');
    }
    
    if (!validateEmail(data.email)) {
        errors.push('Valid email is required');
    }
    
    if (!validatePassword(data.password)) {
        errors.push('Password must be at least 8 characters with uppercase, lowercase, and numbers');
    }
    
    if (errors.length > 0) {
        displayErrors(errors);
    } else {
        submitForm(data);
    }
});
```

### 📋 Advanced Form Examples
```javascript
// Dynamic form fields
function addFormField(container, fieldType, fieldName, label) {
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.setAttribute('for', fieldName);
    
    const input = document.createElement('input');
    input.type = fieldType;
    input.name = fieldName;
    input.id = fieldName;
    
    fieldGroup.appendChild(labelElement);
    fieldGroup.appendChild(input);
    container.appendChild(fieldGroup);
}

// Auto-complete functionality
function setupAutoComplete(input, suggestions) {
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    input.parentNode.appendChild(dropdown);
    
    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const filtered = suggestions.filter(item => 
            item.toLowerCase().includes(value)
        );
        
        dropdown.innerHTML = '';
        
        if (value && filtered.length > 0) {
            filtered.forEach(item => {
                const option = document.createElement('div');
                option.className = 'autocomplete-option';
                option.textContent = item;
                option.addEventListener('click', () => {
                    input.value = item;
                    dropdown.innerHTML = '';
                });
                dropdown.appendChild(option);
            });
        }
    });
}

// Multi-step form
class MultiStepForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.steps = this.form.querySelectorAll('.form-step');
        this.currentStep = 0;
        this.init();
    }
    
    init() {
        this.showStep(0);
        this.setupNavigation();
    }
    
    showStep(stepIndex) {
        this.steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
        });
        this.currentStep = stepIndex;
    }
    
    nextStep() {
        if (this.validateCurrentStep() && this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    validateCurrentStep() {
        const currentStepElement = this.steps[this.currentStep];
        const inputs = currentStepElement.querySelectorAll('input[required]');
        
        return Array.from(inputs).every(input => input.value.trim() !== '');
    }
}
```

---

## 🚀 Advanced DOM Techniques

### 1. **Document Fragments** (Performance)
```javascript
// Efficient way to add multiple elements
function addManyItems(container, items) {
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        fragment.appendChild(li);
    });
    
    // Single DOM update instead of multiple
    container.appendChild(fragment);
}
```

### 2. **MutationObserver** (Watch DOM Changes)
```javascript
// Watch for DOM changes
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            console.log('Children added/removed:', mutation.addedNodes, mutation.removedNodes);
        }
        if (mutation.type === 'attributes') {
            console.log('Attribute changed:', mutation.attributeName);
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true
});

// Stop observing
// observer.disconnect();
```

### 3. **IntersectionObserver** (Visibility Detection)
```javascript
// Lazy loading images
const imageObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

// Observe all lazy images
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Infinite scroll with IntersectionObserver
const sentinel = document.querySelector('#scroll-sentinel');
const scrollObserver = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
        loadMoreContent();
    }
});

scrollObserver.observe(sentinel);
```

### 4. **Custom Elements** (Web Components)
```javascript
// Define custom element
class CustomCard extends HTMLElement {
    constructor() {
        super();
        
        // Create shadow DOM
        this.attachShadow({ mode: 'open' });
        
        // Define template
        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 8px 0;
                }
                .title {
                    font-size: 1.2em;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
            </style>
            <div class="card">
                <div class="title"></div>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
    
    connectedCallback() {
        this.shadowRoot.querySelector('.title').textContent = 
            this.getAttribute('title') || 'Default Title';
    }
    
    static get observedAttributes() {
        return ['title'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'title') {
            this.shadowRoot.querySelector('.title').textContent = newValue;
        }
    }
}

// Register custom element
customElements.define('custom-card', CustomCard);

// Use in HTML: <custom-card title="My Card">Content here</custom-card>
```

---

## 🌟 Real-World Examples

### 1. **Shopping Cart**
```javascript
class ShoppingCart {
    constructor() {
        this.items = [];
        this.container = document.querySelector('#cart-items');
        this.totalElement = document.querySelector('#cart-total');
        this.countElement = document.querySelector('#cart-count');
        
        this.init();
    }
    
    init() {
        // Load cart from localStorage
        this.loadCart();
        this.render();
        this.setupEventListeners();
    }
    
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.render();
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.render();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.render();
            }
        }
    }
    
    render() {
        this.container.innerHTML = '';
        
        if (this.items.length === 0) {
            this.container.innerHTML = '<p>Your cart is empty</p>';
            this.updateTotals();
            return;
        }
        
        this.items.forEach(item => {
            const itemElement = this.createItemElement(item);
            this.container.appendChild(itemElement);
        });
        
        this.updateTotals();
    }
    
    createItemElement(item) {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.dataset.productId = item.id;
        
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price}</p>
            </div>
            <div class="item-controls">
                <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                <button class="remove-btn">Remove</button>
            </div>
        `;
        
        return div;
    }
    
    setupEventListeners() {
        // Event delegation for cart items
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const productId = e.target.closest('.cart-item').dataset.productId;
                this.removeItem(productId);
            }
        });
        
        this.container.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const productId = e.target.closest('.cart-item').dataset.productId;
                this.updateQuantity(productId, e.target.value);
            }
        });
    }
    
    updateTotals() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        this.totalElement.textContent = `$${total.toFixed(2)}`;
        this.countElement.textContent = count;
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    loadCart() {
        const saved = localStorage.getItem('cart');
        this.items = saved ? JSON.parse(saved) : [];
    }
}

// Initialize cart
const cart = new ShoppingCart();
```

### 2. **Todo List with Persistence**
```javascript
class TodoApp {
    constructor() {
        this.todos = [];
        this.filter = 'all'; // all, active, completed
        
        this.elements = {
            input: document.querySelector('#todo-input'),
            addBtn: document.querySelector('#add-todo'),
            list: document.querySelector('#todo-list'),
            filters: document.querySelectorAll('.filter-btn'),
            clearCompleted: document.querySelector('#clear-completed'),
            stats: document.querySelector('#todo-stats')
        };
        
        this.init();
    }
    
    init() {
        this.loadTodos();
        this.setupEventListeners();
        this.render();
    }
    
    setupEventListeners() {
        // Add todo
        this.elements.addBtn.addEventListener('click', () => this.addTodo());
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        
        // Filter todos
        this.elements.filters.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.dataset.filter;
                this.render();
            });
        });
        
        // Clear completed
        this.elements.clearCompleted.addEventListener('click', () => {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveTodos();
            this.render();
        });
        
        // Todo list events (delegation)
        this.elements.list.addEventListener('click', (e) => {
            const todoId = parseInt(e.target.closest('.todo-item')?.dataset.id);
            
            if (e.target.classList.contains('toggle-btn')) {
                this.toggleTodo(todoId);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteTodo(todoId);
            }
        });
        
        // Edit todo
        this.elements.list.addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('todo-text')) {
                this.editTodo(e.target);
            }
        });
    }
    
    addTodo() {
        const text = this.elements.input.value.trim();
        if (!text) return;
        
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        this.elements.input.value = '';
        this.saveTodos();
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }
    
    editTodo(textElement) {
        const todoItem = textElement.closest('.todo-item');
        const todoId = parseInt(todoItem.dataset.id);
        const todo = this.todos.find(t => t.id === todoId);
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = todo.text;
        
        textElement.style.display = 'none';
        todoItem.insertBefore(input, textElement);
        input.focus();
        
        const finishEdit = () => {
            const newText = input.value.trim();
            if (newText) {
                todo.text = newText;
                this.saveTodos();
            }
            input.remove();
            textElement.style.display = 'block';
            this.render();
        };
        
        input.addEventListener('blur', finishEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') finishEdit();
        });
    }
    
    render() {
        const filteredTodos = this.getFilteredTodos();
        
        this.elements.list.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.elements.list.appendChild(todoElement);
        });
        
        this.updateStats();
    }
    
    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <button class="toggle-btn">${todo.completed ? '✓' : '○'}</button>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">×</button>
        `;
        
        return li;
    }
    
    getFilteredTodos() {
        switch (this.filter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }
    
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const active = total - completed;
        
        this.elements.stats.textContent = 
            `${active} active, ${completed} completed, ${total} total`;
    }
    
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    
    loadTodos() {
        const saved = localStorage.getItem('todos');
        this.todos = saved ? JSON.parse(saved) : [];
    }
}

// Initialize todo app
const todoApp = new TodoApp();
```

### 3. **Image Gallery with Lightbox**
```javascript
class ImageGallery {
    constructor(selector) {
        this.gallery = document.querySelector(selector);
        this.lightbox = null;
        this.currentIndex = 0;
        this.images = [];
        
        this.init();
    }
    
    init() {
        this.createLightbox();
        this.loadImages();
        this.setupEventListeners();
    }
    
    loadImages() {
        const imageElements = this.gallery.querySelectorAll('img');
        this.images = Array.from(imageElements).map(img => ({
            src: img.dataset.fullsize || img.src,
            thumb: img.src,
            alt: img.alt,
            caption: img.dataset.caption || img.alt
        }));
    }
    
    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&#10094;</button>
                <button class="lightbox-next">&#10095;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(this.lightbox);
    }
    
    setupEventListeners() {
        // Gallery click
        this.gallery.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                const index = Array.from(this.gallery.querySelectorAll('img'))
                    .indexOf(e.target);
                this.openLightbox(index);
            }
        });
        
        // Lightbox controls
        this.lightbox.querySelector('.lightbox-close')
            .addEventListener('click', () => this.closeLightbox());
        
        this.lightbox.querySelector('.lightbox-prev')
            .addEventListener('click', () => this.prevImage());
        
        this.lightbox.querySelector('.lightbox-next')
            .addEventListener('click', () => this.nextImage());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
        
        // Close on backdrop click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightboxImage();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }
    
    prevImage() {
        this.currentIndex = this.currentIndex === 0 
            ? this.images.length - 1 
            : this.currentIndex - 1;
        this.updateLightboxImage();
    }
    
    updateLightboxImage() {
        const image = this.images[this.currentIndex];
        const imgElement = this.lightbox.querySelector('.lightbox-image');
        const captionElement = this.lightbox.querySelector('.lightbox-caption');
        
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        captionElement.textContent = image.caption;
    }
}

// Initialize gallery
const gallery = new ImageGallery('.image-gallery');
```

---

## ✅ Best Practices

### 1. **Performance Best Practices**
```javascript
// ❌ Bad: Multiple DOM queries
function updateElements() {
    document.querySelector('.title').textContent = 'New Title';
    document.querySelector('.title').style.color = 'red';
    document.querySelector('.title').classList.add('updated');
}

// ✅ Good: Cache DOM references
function updateElements() {
    const title = document.querySelector('.title');
    title.textContent = 'New Title';
    title.style.color = 'red';
    title.classList.add('updated');
}

// ❌ Bad: Multiple DOM updates
function addManyItems(items) {
    const list = document.querySelector('ul');
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li); // Multiple reflows
    });
}

// ✅ Good: Batch DOM updates
function addManyItems(items) {
    const list = document.querySelector('ul');
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        fragment.appendChild(li);
    });
    
    list.appendChild(fragment); // Single reflow
}
```

### 2. **Security Best Practices**
```javascript
// ❌ Dangerous: XSS vulnerability
function displayUserComment(comment) {
    document.querySelector('.comments').innerHTML += `<p>${comment}</p>`;
}

// ✅ Safe: Use textContent for user input
function displayUserComment(comment) {
    const p = document.createElement('p');
    p.textContent = comment; // Automatically escapes HTML
    document.querySelector('.comments').appendChild(p);
}

// ✅ Safe: Sanitize HTML if needed
function sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}
```

### 3. **Memory Management**
```javascript
// ❌ Memory leak: Event listeners not removed
function setupComponent() {
    const button = document.querySelector('.temp-button');
    button.addEventListener('click', handleClick);
    // Component removed but listener still exists
}

// ✅ Good: Clean up event listeners
class Component {
    constructor() {
        this.handleClick = this.handleClick.bind(this);
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.button = document.querySelector('.temp-button');
        this.button.addEventListener('click', this.handleClick);
    }
    
    destroy() {
        this.button.removeEventListener('click', this.handleClick);
        this.button = null;
    }
    
    handleClick() {
        // Handle click
    }
}
```

### 4. **Accessibility Best Practices**
```javascript
// Add proper ARIA attributes
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.setAttribute('aria-describedby', 'modal-content');
    modal.setAttribute('aria-modal', 'true');
    
    modal.innerHTML = `
        <h2 id="modal-title">${title}</h2>
        <div id="modal-content">${content}</div>
        <button aria-label="Close modal">×</button>
    `;
    
    return modal;
}

// Manage focus for accessibility
function openModal(modal) {
    const previousFocus = document.activeElement;
    document.body.appendChild(modal);
    
    // Focus first focusable element
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
    
    // Return focus when closed
    modal.addEventListener('close', () => {
        previousFocus.focus();
    });
}
```

---

## ⚡ Performance Tips

### 1. **Minimize Reflows and Repaints**
```javascript
// ❌ Causes multiple reflows
element.style.width = '100px';
element.style.height = '100px';
element.style.backgroundColor = 'red';

// ✅ Single reflow with CSS class
element.className = 'resized-red-box';

// ✅ Batch style changes
element.style.cssText = 'width: 100px; height: 100px; background-color: red;';
```

### 2. **Use RequestAnimationFrame**
```javascript
// ❌ May cause janky animation
function animate() {
    element.style.left = element.offsetLeft + 1 + 'px';
    setTimeout(animate, 16);
}

// ✅ Smooth animation
function animate() {
    element.style.left = element.offsetLeft + 1 + 'px';
    requestAnimationFrame(animate);
}
```

### 3. **Debounce Heavy Operations**
```javascript
// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use for expensive operations
const expensiveSearch = debounce(function(query) {
    // Expensive search operation
    searchDatabase(query);
}, 300);

searchInput.addEventListener('input', (e) => {
    expensiveSearch(e.target.value);
});
```

### 4. **Virtual Scrolling for Large Lists**
```javascript
class VirtualList {
    constructor(container, items, itemHeight) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
        this.startIndex = 0;
        
        this.init();
    }
    
    init() {
        // Create scrollable container
        this.scrollContainer = document.createElement('div');
        this.scrollContainer.style.height = this.items.length * this.itemHeight + 'px';
        this.container.appendChild(this.scrollContainer);
        
        // Create visible items container
        this.itemsContainer = document.createElement('div');
        this.itemsContainer.style.position = 'absolute';
        this.scrollContainer.appendChild(this.itemsContainer);
        
        this.container.addEventListener('scroll', () => {
            this.updateVisibleItems();
        });
        
        this.updateVisibleItems();
    }
    
    updateVisibleItems() {
        const scrollTop = this.container.scrollTop;
        this.startIndex = Math.floor(scrollTop / this.itemHeight);
        
        this.itemsContainer.style.transform = 
            `translateY(${this.startIndex * this.itemHeight}px)`;
        
        this.itemsContainer.innerHTML = '';
        
        for (let i = 0; i < this.visibleCount + 2; i++) {
            const itemIndex = this.startIndex + i;
            if (itemIndex >= this.items.length) break;
            
            const itemElement = this.createItemElement(this.items[itemIndex]);
            this.itemsContainer.appendChild(itemElement);
        }
    }
    
    createItemElement(item) {
        const div = document.createElement('div');
        div.style.height = this.itemHeight + 'px';
        div.textContent = item;
        return div;
    }
}
```

---

## 🌐 Browser Compatibility

### 1. **Feature Detection**
```javascript
// Check for feature support
if ('IntersectionObserver' in window) {
    // Use IntersectionObserver
    const observer = new IntersectionObserver(callback);
} else {
    // Fallback to scroll events
    window.addEventListener('scroll', scrollHandler);
}

// Check for CSS support
function supportsCSSProperty(property, value) {
    const element = document.createElement('div');
    element.style[property] = value;
    return element.style[property] === value;
}

if (supportsCSSProperty('display', 'grid')) {
    document.body.classList.add('supports-grid');
}
```

### 2. **Polyfills**
```javascript
// Polyfill for Element.closest()
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        let el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Polyfill for Element.remove()
if (!Element.prototype.remove) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
```

### 3. **Modern vs Legacy Approaches**
```javascript
// Modern: Array.from()
const elements = Array.from(document.querySelectorAll('.item'));

// Legacy fallback
const elements = [].slice.call(document.querySelectorAll('.item'));

// Modern: for...of
for (const element of elements) {
    element.classList.add('processed');
}

// Legacy: traditional for loop
for (let i = 0; i < elements.length; i++) {
    elements[i].classList.add('processed');
}
```

---

## 🎓 Learning Exercises

### Exercise 1: Build a Calculator
```javascript
// Create a working calculator with DOM manipulation
// Requirements:
// - Display for numbers and operations
// - Buttons for digits, operations, clear, equals
// - Handle keyboard input
// - Error handling for division by zero

class Calculator {
    constructor() {
        this.display = document.querySelector('#display');
        this.buttons = document.querySelector('#buttons');
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
        
        this.init();
    }
    
    // Implement calculator logic here
    init() {
        this.createButtons();
        this.setupEventListeners();
    }
    
    createButtons() {
        const buttonLayout = [
            ['C', '±', '%', '÷'],
            ['7', '8', '9', '×'],
            ['4', '5', '6', '−'],
            ['1', '2', '3', '+'],
            ['0', '.', '=']
        ];
        
        // Create button grid
        buttonLayout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'button-row';
            
            row.forEach(buttonText => {
                const button = document.createElement('button');
                button.textContent = buttonText;
                button.className = 'calc-button';
                button.dataset.value = buttonText;
                rowDiv.appendChild(button);
            });
            
            this.buttons.appendChild(rowDiv);
        });
    }
    
    // Add more methods...
}
```

### Exercise 2: Image Slider
```javascript
// Build an image slider with thumbnails
// Requirements:
// - Auto-play functionality
// - Navigation arrows
// - Thumbnail navigation
// - Pause on hover
// - Responsive design

class ImageSlider {
    constructor(selector, options = {}) {
        this.slider = document.querySelector(selector);
        this.options = {
            autoPlay: true,
            autoPlayInterval: 3000,
            showThumbnails: true,
            ...options
        };
        
        this.currentIndex = 0;
        this.images = [];
        this.autoPlayTimer = null;
        
        this.init();
    }
    
    // Implement slider functionality
}
```

### Exercise 3: Drag and Drop Todo
```javascript
// Create a todo app with drag and drop functionality
// Requirements:
// - Drag todos between different lists (todo, in progress, done)
// - Visual feedback during drag
// - Save state to localStorage
// - Add/edit/delete todos

class DragDropTodo {
    constructor() {
        this.lists = {
            todo: document.querySelector('#todo-list'),
            inProgress: document.querySelector('#progress-list'),
            done: document.querySelector('#done-list')
        };
        
        this.init();
    }
    
    // Implement drag and drop logic
}
```

---

## 📚 Additional Resources

### Official Documentation
- [MDN DOM Reference](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [W3C DOM Specification](https://www.w3.org/TR/dom/)

### Online Tutorials
- [JavaScript.info DOM](https://javascript.info/dom-nodes)
- [FreeCodeCamp JavaScript](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)

### Tools and Libraries
- [jQuery](https://jquery.com/) - Simplified DOM manipulation
- [D3.js](https://d3js.org/) - Data-driven documents
- [React](https://reactjs.org/) - Virtual DOM library

### Performance Tools
- Chrome DevTools
- Lighthouse
- WebPageTest

---

## 🎉 Conclusion

This guide covers everything you need to know about DOM manipulation with JavaScript. Start with the basics, practice with real examples, and gradually work your way up to advanced techniques.

Remember:
- **Practice regularly** with small projects
- **Focus on performance** and best practices
- **Consider accessibility** in your implementations
- **Test across different browsers**
- **Keep security in mind** when handling user input

Happy coding! 🚀

---

*This README.md was created as a comprehensive learning resource for DOM manipulation. Feel free to contribute and improve it!*
