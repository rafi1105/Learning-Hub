# Object-Oriented Programming in JavaScript

## Table of Contents
1. [Introduction to OOP](#introduction-to-oop)
2. [Beginner Concepts](#beginner-concepts)
3. [Intermediate Concepts](#intermediate-concepts)
4. [Advanced Concepts](#advanced-concepts)
5. [Real-World Examples](#real-world-examples)
6. [Best Practices](#best-practices)

## Introduction to OOP

Object-Oriented Programming (OOP) is a programming paradigm that organizes code around objects rather than functions. JavaScript supports OOP through prototypes and classes, making it possible to create modular, reusable, and maintainable code.

### Core OOP Principles:
- **Encapsulation**: Bundling data and methods together
- **Inheritance**: Creating new classes based on existing ones
- **Polymorphism**: Objects of different types responding to the same interface
- **Abstraction**: Hiding complex implementation details

## Beginner Concepts

### 1. Object Literals (Beginner)

```javascript
// Simple object literal
const person = {
    name: "John",
    age: 30,
    greet: function() {
        return `Hello, I'm ${this.name}`;
    }
};

console.log(person.greet()); // "Hello, I'm John"
```

### 2. Constructor Functions (Beginner)

```javascript
// Constructor function
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.greet = function() {
        return `Hello, I'm ${this.name}`;
    };
}

// Creating instances
const john = new Person("John", 30);
const jane = new Person("Jane", 25);

console.log(john.greet()); // "Hello, I'm John"
console.log(jane.greet()); // "Hello, I'm Jane"
```

### 3. Prototype-based Inheritance (Beginner)

```javascript
// Adding methods to prototype
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    return `${this.name} makes a sound`;
};

Animal.prototype.sleep = function() {
    return `${this.name} is sleeping`;
};

const dog = new Animal("Buddy");
console.log(dog.speak()); // "Buddy makes a sound"
```

### 4. ES6 Classes (Beginner)

```javascript
// ES6 Class syntax
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
    
    celebrateBirthday() {
        this.age++;
        return `Happy birthday! Now I'm ${this.age}`;
    }
}

const person = new Person("Alice", 28);
console.log(person.greet());
console.log(person.celebrateBirthday());
```

## Intermediate Concepts

### 1. Class Inheritance (Intermediate)

```javascript
// Base class
class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }
    
    speak() {
        return `${this.name} makes a sound`;
    }
    
    getInfo() {
        return `${this.name} is a ${this.species}`;
    }
}

// Derived class
class Dog extends Animal {
    constructor(name, breed) {
        super(name, "Dog"); // Call parent constructor
        this.breed = breed;
    }
    
    speak() {
        return `${this.name} barks!`;
    }
    
    fetch() {
        return `${this.name} fetches the ball`;
    }
}

const myDog = new Dog("Max", "Golden Retriever");
console.log(myDog.speak()); // "Max barks!"
console.log(myDog.getInfo()); // "Max is a Dog"
console.log(myDog.fetch()); // "Max fetches the ball"
```

### 2. Encapsulation with Private Fields (Intermediate)

```javascript
class BankAccount {
    #balance; // Private field
    #accountNumber;
    
    constructor(accountNumber, initialBalance = 0) {
        this.#accountNumber = accountNumber;
        this.#balance = initialBalance;
    }
    
    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
            return `Deposited $${amount}. New balance: $${this.#balance}`;
        }
        throw new Error("Deposit amount must be positive");
    }
    
    withdraw(amount) {
        if (amount > 0 && amount <= this.#balance) {
            this.#balance -= amount;
            return `Withdrew $${amount}. New balance: $${this.#balance}`;
        }
        throw new Error("Invalid withdrawal amount");
    }
    
    getBalance() {
        return this.#balance;
    }
    
    // Private method
    #validateTransaction(amount) {
        return amount > 0 && amount <= this.#balance;
    }
}

const account = new BankAccount("123456", 1000);
console.log(account.deposit(500));
console.log(account.withdraw(200));
// console.log(account.#balance); // Error: Private field
```

### 3. Static Methods and Properties (Intermediate)

```javascript
class MathUtils {
    static PI = 3.14159;
    
    static add(a, b) {
        return a + b;
    }
    
    static multiply(a, b) {
        return a * b;
    }
    
    static circleArea(radius) {
        return MathUtils.PI * radius * radius;
    }
}

// Call static methods without creating instance
console.log(MathUtils.add(5, 3)); // 8
console.log(MathUtils.circleArea(5)); // 78.53975
console.log(MathUtils.PI); // 3.14159
```

### 4. Getters and Setters (Intermediate)

```javascript
class Temperature {
    constructor(celsius = 0) {
        this._celsius = celsius;
    }
    
    get celsius() {
        return this._celsius;
    }
    
    set celsius(value) {
        if (value < -273.15) {
            throw new Error("Temperature cannot be below absolute zero");
        }
        this._celsius = value;
    }
    
    get fahrenheit() {
        return (this._celsius * 9/5) + 32;
    }
    
    set fahrenheit(value) {
        this.celsius = (value - 32) * 5/9;
    }
    
    get kelvin() {
        return this._celsius + 273.15;
    }
}

const temp = new Temperature(25);
console.log(temp.celsius); // 25
console.log(temp.fahrenheit); // 77
temp.fahrenheit = 100;
console.log(temp.celsius); // 37.77777777777778
```

## Advanced Concepts

### 1. Abstract Classes and Interfaces (Advanced)

```javascript
// Abstract class simulation
class Shape {
    constructor(name) {
        if (this.constructor === Shape) {
            throw new Error("Abstract class cannot be instantiated");
        }
        this.name = name;
    }
    
    // Abstract method
    area() {
        throw new Error("Abstract method must be implemented");
    }
    
    // Concrete method
    describe() {
        return `This is a ${this.name} with area ${this.area()}`;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super("Rectangle");
        this.width = width;
        this.height = height;
    }
    
    area() {
        return this.width * this.height;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super("Circle");
        this.radius = radius;
    }
    
    area() {
        return Math.PI * this.radius * this.radius;
    }
}

const rect = new Rectangle(5, 3);
console.log(rect.describe()); // "This is a Rectangle with area 15"

const circle = new Circle(4);
console.log(circle.describe()); // "This is a Circle with area 50.26548245743669"
```

### 2. Mixins (Advanced)

```javascript
// Mixin for flying capability
const FlyingMixin = {
    fly() {
        return `${this.name} is flying!`;
    },
    
    land() {
        return `${this.name} has landed.`;
    }
};

// Mixin for swimming capability
const SwimmingMixin = {
    swim() {
        return `${this.name} is swimming!`;
    },
    
    dive() {
        return `${this.name} dives underwater.`;
    }
};

class Bird {
    constructor(name) {
        this.name = name;
    }
}

class Duck extends Bird {
    constructor(name) {
        super(name);
    }
    
    quack() {
        return `${this.name} says quack!`;
    }
}

// Apply mixins
Object.assign(Duck.prototype, FlyingMixin, SwimmingMixin);

const donald = new Duck("Donald");
console.log(donald.quack()); // "Donald says quack!"
console.log(donald.fly());   // "Donald is flying!"
console.log(donald.swim());  // "Donald is swimming!"
```

### 3. Factory Pattern (Advanced)

```javascript
class VehicleFactory {
    static createVehicle(type, options) {
        switch(type.toLowerCase()) {
            case 'car':
                return new Car(options);
            case 'motorcycle':
                return new Motorcycle(options);
            case 'truck':
                return new Truck(options);
            default:
                throw new Error(`Unknown vehicle type: ${type}`);
        }
    }
}

class Vehicle {
    constructor(options) {
        this.make = options.make;
        this.model = options.model;
        this.year = options.year;
    }
    
    getInfo() {
        return `${this.year} ${this.make} ${this.model}`;
    }
}

class Car extends Vehicle {
    constructor(options) {
        super(options);
        this.doors = options.doors || 4;
    }
    
    start() {
        return `${this.getInfo()} car is starting...`;
    }
}

class Motorcycle extends Vehicle {
    constructor(options) {
        super(options);
        this.engineSize = options.engineSize;
    }
    
    start() {
        return `${this.getInfo()} motorcycle is revving up...`;
    }
}

class Truck extends Vehicle {
    constructor(options) {
        super(options);
        this.payload = options.payload;
    }
    
    start() {
        return `${this.getInfo()} truck is starting...`;
    }
}

// Using the factory
const car = VehicleFactory.createVehicle('car', {
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    doors: 4
});

const bike = VehicleFactory.createVehicle('motorcycle', {
    make: 'Honda',
    model: 'CBR',
    year: 2023,
    engineSize: '600cc'
});

console.log(car.start());
console.log(bike.start());
```

### 4. Observer Pattern (Advanced)

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    
    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        
        this.events[event] = this.events[event].filter(
            listener => listener !== listenerToRemove
        );
    }
    
    emit(event, data) {
        if (!this.events[event]) return;
        
        this.events[event].forEach(listener => listener(data));
    }
}

class NewsAgency extends EventEmitter {
    constructor() {
        super();
        this.news = [];
    }
    
    addNews(news) {
        this.news.push(news);
        this.emit('news', news);
    }
}

class NewsChannel {
    constructor(name) {
        this.name = name;
    }
    
    update(news) {
        console.log(`${this.name} broadcasting: ${news}`);
    }
}

// Usage
const agency = new NewsAgency();
const cnn = new NewsChannel('CNN');
const bbc = new NewsChannel('BBC');

// Subscribe to news
agency.on('news', (news) => cnn.update(news));
agency.on('news', (news) => bbc.update(news));

// Publish news
agency.addNews('Breaking: New JavaScript framework released!');
```

## Real-World Examples

### 1. E-commerce System (Advanced)

```javascript
class Product {
    constructor(id, name, price, category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
    }
    
    getDisplayInfo() {
        return `${this.name} - $${this.price}`;
    }
}

class ShoppingCart {
    constructor() {
        this.items = [];
    }
    
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
    }
    
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }
    
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
}

class Order {
    static #orderCounter = 1000;
    
    constructor(cart, customer) {
        this.id = ++Order.#orderCounter;
        this.items = [...cart.items];
        this.customer = customer;
        this.total = cart.getTotal();
        this.status = 'pending';
        this.createdAt = new Date();
    }
    
    updateStatus(newStatus) {
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (validStatuses.includes(newStatus)) {
            this.status = newStatus;
            return true;
        }
        throw new Error(`Invalid status: ${newStatus}`);
    }
    
    getOrderSummary() {
        return {
            orderId: this.id,
            customerName: this.customer.name,
            itemCount: this.items.length,
            total: this.total,
            status: this.status
        };
    }
}

class Customer {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.orders = [];
    }
    
    placeOrder(cart) {
        if (cart.items.length === 0) {
            throw new Error("Cannot place order with empty cart");
        }
        
        const order = new Order(cart, this);
        this.orders.push(order);
        return order;
    }
    
    getOrderHistory() {
        return this.orders.map(order => order.getOrderSummary());
    }
}

// Usage example
const laptop = new Product(1, "Gaming Laptop", 1299.99, "Electronics");
const mouse = new Product(2, "Wireless Mouse", 29.99, "Electronics");

const customer = new Customer("John Doe", "john@example.com");
const cart = new ShoppingCart();

cart.addItem(laptop, 1);
cart.addItem(mouse, 2);

console.log(`Cart total: $${cart.getTotal()}`);
console.log(`Items in cart: ${cart.getItemCount()}`);

const order = customer.placeOrder(cart);
console.log(order.getOrderSummary());
```

### 2. Task Management System (Advanced)

```javascript
class Task {
    static #taskIdCounter = 0;
    
    constructor(title, description, priority = 'medium') {
        this.id = ++Task.#taskIdCounter;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = 'todo';
        this.createdAt = new Date();
        this.completedAt = null;
        this.assignee = null;
    }
    
    assign(user) {
        this.assignee = user;
        return this;
    }
    
    markComplete() {
        this.status = 'completed';
        this.completedAt = new Date();
        return this;
    }
    
    updatePriority(newPriority) {
        const validPriorities = ['low', 'medium', 'high', 'critical'];
        if (validPriorities.includes(newPriority)) {
            this.priority = newPriority;
            return this;
        }
        throw new Error(`Invalid priority: ${newPriority}`);
    }
}

class User {
    constructor(name, email, role = 'user') {
        this.name = name;
        this.email = email;
        this.role = role;
        this.tasks = [];
    }
    
    assignTask(task) {
        task.assign(this);
        this.tasks.push(task);
    }
    
    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }
    
    getTasksByPriority(priority) {
        return this.tasks.filter(task => task.priority === priority);
    }
}

class ProjectManager extends User {
    constructor(name, email) {
        super(name, email, 'manager');
        this.projects = [];
    }
    
    createProject(name, description) {
        const project = new Project(name, description, this);
        this.projects.push(project);
        return project;
    }
}

class Project {
    constructor(name, description, manager) {
        this.name = name;
        this.description = description;
        this.manager = manager;
        this.tasks = [];
        this.teamMembers = [];
        this.createdAt = new Date();
    }
    
    addTask(title, description, priority) {
        const task = new Task(title, description, priority);
        this.tasks.push(task);
        return task;
    }
    
    addTeamMember(user) {
        if (!this.teamMembers.includes(user)) {
            this.teamMembers.push(user);
        }
    }
    
    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }
    
    getProjectProgress() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
        return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    }
    
    assignTaskToUser(taskId, user) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && this.teamMembers.includes(user)) {
            user.assignTask(task);
            return true;
        }
        return false;
    }
}

// Usage example
const manager = new ProjectManager("Alice Smith", "alice@company.com");
const developer = new User("Bob Johnson", "bob@company.com", "developer");

const project = manager.createProject("Website Redesign", "Complete redesign of company website");
project.addTeamMember(developer);

const task1 = project.addTask("Create wireframes", "Design initial wireframes for homepage", "high");
const task2 = project.addTask("Implement header", "Code the new header component", "medium");

project.assignTaskToUser(task1.id, developer);
project.assignTaskToUser(task2.id, developer);

task1.markComplete();

console.log(`Project progress: ${project.getProjectProgress()}%`);
console.log(`Developer's completed tasks:`, developer.getTasksByStatus('completed'));
```

## Best Practices

### 1. Single Responsibility Principle

```javascript
// Bad: Class with multiple responsibilities
class BadUser {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    
    save() {
        // Database logic
        console.log("Saving to database");
    }
    
    sendEmail() {
        // Email logic
        console.log("Sending email");
    }
    
    validateEmail() {
        // Validation logic
        return this.email.includes('@');
    }
}

// Good: Separated responsibilities
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}

class UserRepository {
    save(user) {
        console.log(`Saving user: ${user.name}`);
    }
}

class EmailService {
    send(user, message) {
        console.log(`Sending email to ${user.email}: ${message}`);
    }
}

class EmailValidator {
    static validate(email) {
        return email.includes('@');
    }
}
```

### 2. Composition over Inheritance

```javascript
// Using composition
class Engine {
    start() {
        return "Engine started";
    }
    
    stop() {
        return "Engine stopped";
    }
}

class GPS {
    navigate(destination) {
        return `Navigating to ${destination}`;
    }
}

class Car {
    constructor() {
        this.engine = new Engine();
        this.gps = new GPS();
    }
    
    start() {
        return this.engine.start();
    }
    
    navigateTo(destination) {
        return this.gps.navigate(destination);
    }
}

const myCar = new Car();
console.log(myCar.start());
console.log(myCar.navigateTo("Downtown"));
```

### 3. Error Handling in Classes

```javascript
class Calculator {
    static divide(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new TypeError('Both arguments must be numbers');
        }
        
        if (b === 0) {
            throw new Error('Division by zero is not allowed');
        }
        
        return a / b;
    }
    
    static safeCall(operation, ...args) {
        try {
            return { success: true, result: operation(...args) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Usage with error handling
const result1 = Calculator.safeCall(Calculator.divide, 10, 2);
console.log(result1); // { success: true, result: 5 }

const result2 = Calculator.safeCall(Calculator.divide, 10, 0);
console.log(result2); // { success: false, error: "Division by zero is not allowed" }
```

### 4. Documentation and Type Hints

```javascript
/**
 * Represents a book in a library system
 * @class
 */
class Book {
    /**
     * Create a book
     * @param {string} title - The title of the book
     * @param {string} author - The author of the book
     * @param {string} isbn - The ISBN number
     * @param {number} pages - Number of pages
     */
    constructor(title, author, isbn, pages) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.pages = pages;
        this.isAvailable = true;
    }
    
    /**
     * Borrow the book
     * @returns {boolean} True if successfully borrowed, false otherwise
     */
    borrow() {
        if (this.isAvailable) {
            this.isAvailable = false;
            return true;
        }
        return false;
    }
    
    /**
     * Return the book
     * @returns {boolean} True if successfully returned
     */
    return() {
        this.isAvailable = true;
        return true;
    }
    
    /**
     * Get book information
     * @returns {Object} Book details
     */
    getInfo() {
        return {
            title: this.title,
            author: this.author,
            isbn: this.isbn,
            pages: this.pages,
            available: this.isAvailable
        };
    }
}
```

This comprehensive guide covers Object-Oriented Programming in JavaScript from beginner to advanced levels, including real-world examples and best practices. Each concept builds upon the previous ones, providing a solid foundation for mastering OOP in JavaScript.
