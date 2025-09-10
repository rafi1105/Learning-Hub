// Global variables
let modulesData = null;
let cart = JSON.parse(localStorage.getItem('learningCart')) || [];
let currentTheme = localStorage.getItem('theme') || 'dark';
let currentTech = 'javascript';
let searchQuery = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadModuleData();
    setupEventListeners();
    updateCartUI();
});

// Theme management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    initializeTheme();
}

// Technology switching
function switchTechnology(tech) {
    currentTech = tech;
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    
    // Update UI elements
    const title = document.getElementById('modulesTitle');
    const description = document.getElementById('modulesDescription');
    
    if (tech === 'react') {
        title.textContent = 'React Modules';
        description.textContent = 'Choose from our comprehensive collection of React topics';
    } else {
        title.textContent = 'JavaScript Modules';
        description.textContent = 'Choose from our comprehensive collection of JavaScript topics';
    }
    
    // Update active tech button
    document.querySelectorAll('.tech-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tech="${tech}"]`).classList.add('active');
    
    // Reset filters and re-render
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');
    
    renderModules();
}

// Search functionality
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    searchQuery = searchInput.value.trim();
    
    if (searchQuery) {
        clearButton.style.display = 'block';
    } else {
        clearButton.style.display = 'none';
    }
    
    renderModules();
}

function clearSearch() {
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    renderModules();
}

// Load module data from JSON
async function loadModuleData() {
    try {
        const response = await fetch('module.json');
        modulesData = await response.json();
        
        // Update hero stats
        document.getElementById('totalModules').textContent = modulesData.metadata.total_modules;
        document.getElementById('totalHours').textContent = modulesData.metadata.estimated_hours;
        
        // Render sections
        renderModules();
        renderLearningPaths();
        renderProjects();
        
    } catch (error) {
        console.error('Error loading module data:', error);
        showErrorMessage('Failed to load course data. Please try again later.');
    }
}

// Render modules section
function renderModules(filter = 'all') {
    if (!modulesData) return;
    
    const modulesGrid = document.getElementById('modulesGrid');
    const modules = currentTech === 'javascript' ? modulesData.javascript_modules : modulesData.react_modules;
    
    // Add difficulty classification based on module name/content
    const jsDifficultyMap = {
        'JS Core': 'beginner',
        'Arrays': 'beginner',
        'Functions': 'beginner',
        'Objects': 'beginner',
        'Loops': 'beginner',
        'DOM': 'intermediate',
        'Events': 'intermediate',
        'Promises': 'intermediate',
        'AJAX': 'intermediate',
        'API': 'intermediate',
        'OOP': 'advanced',
        'ES6+': 'advanced',
        'Patterns': 'advanced',
        'Performance': 'advanced',
        'Testing': 'advanced'
    };

    const reactDifficultyMap = {
        'React Core': 'beginner',
        'Components': 'beginner',
        'Hooks': 'intermediate',
        'State': 'intermediate',
        'Events': 'beginner',
        'Router': 'intermediate',
        'Forms': 'intermediate',
        'Context': 'intermediate',
        'Performance': 'advanced',
        'Testing': 'advanced',
        'API': 'intermediate',
        'Styling': 'beginner',
        'Redux': 'advanced',
        'Error Handling': 'intermediate',
        'Patterns': 'advanced',
        'Lifecycle': 'intermediate',
        'Custom Hooks': 'advanced',
        'Portals': 'intermediate',
        'Refs': 'intermediate',
        'Suspense': 'advanced',
        'Server Components': 'advanced',
        'Animation': 'intermediate',
        'Accessibility': 'intermediate',
        'DevTools': 'beginner',
        'Deployment': 'intermediate'
    };

    const difficultyMap = currentTech === 'javascript' ? jsDifficultyMap : reactDifficultyMap;
    
    let filteredModules = modules;
    
    // Apply search filter
    if (searchQuery) {
        filteredModules = filteredModules.filter(module => 
            module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            module.summary.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    // Apply difficulty filter
    if (filter !== 'all') {
        filteredModules = filteredModules.filter(module => 
            (difficultyMap[module.name] || 'intermediate') === filter
        );
    }
    
    modulesGrid.innerHTML = filteredModules.map(module => {
        const difficulty = difficultyMap[module.name] || 'intermediate';
        const isInCart = cart.some(item => item.name === module.name);
        const moduleHours = getModuleHours(module.name);
        const prerequisites = getPrerequisites(module.name).split(',').length;
        
        return `
            <div class="module-card" data-module="${module.name}">
            <div class="module-card-header">
            <div class="module-image-container">
            <div class="module-placeholder" style="width: 100%; height: 200px; background: ${currentTheme === 'dark' ? '#FFD43B' : 'var(--gradient)'}; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); margin-bottom: 1rem;">
                <div style="text-align: center; color: ${currentTheme === 'light' ? '#ffffffff' : '#000'};">
                <i class="fab fa-${currentTech === 'javascript' ? 'js-square' : 'react'}" style="font-size: 3rem; margin-bottom: 0.5rem;"></i>
                <div style="font-size: 1.2rem; font-weight: bold;">${module.name}</div>
                </div>
            </div>
            <div class="module-overlay">
                <span class="difficulty-badge difficulty-${difficulty}">${difficulty}</span>
            </div>
            </div>
            </div>
            
            <div class="module-content">
            <div class="module-title-section">
            <h3 class="module-title">${module.title}</h3>
            <div class="module-subtitle">
                <span class="module-name">${module.name}</span>
                <span class="module-separator">•</span>
                <span class="module-duration">${moduleHours}h</span>
            </div>
            </div>
            
            <p class="module-summary">${module.summary}</p>
            
            <div class="module-stats">
            <div class="stat-item">
                <i class="fas fa-clock"></i>
                <span>${moduleHours} hours</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-layer-group"></i>
                <span>${prerequisites} prereq${prerequisites > 1 ? 's' : ''}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-signal"></i>
                <span>${difficulty}</span>
            </div>
            </div>
            
            <div class="module-actions">
            <button class="btn-primary ${isInCart ? 'btn-added' : ''}" 
                onclick="toggleCartItem('${module.name}')"
                data-action="cart">
                <i class="fas ${isInCart ? 'fa-check' : 'fa-cart-plus'}"></i>
                <span>${isInCart ? 'Added ' : 'Add '}</span>
            </button>
            <button class="btn-secondary" onclick="showModuleDetails('${module.name}')">
                <i class="fas fa-eye"></i>
                <span>Preview</span>
            </button>
            <button class="btn-outline" onclick="window.open('${module.page_html}', '_blank')">
                <i class="fas fa-external-link-alt"></i>
                <span>Launch</span>
            </button>
            </div>
            </div>
            </div>
        `;
    }).join('');
}

// Render learning paths
function renderLearningPaths() {
    if (!modulesData) return;
    
    const pathsGrid = document.getElementById('pathsGrid');
    const paths = modulesData.learning_paths;
    
    pathsGrid.innerHTML = paths.map(path => `
        <div class="path-card">
            <div class="path-header">
                <h3 class="path-title">${path.path_name}</h3>
                <span class="difficulty-badge difficulty-${path.difficulty.toLowerCase()}">${path.difficulty}</span>
            </div>
            <div class="path-info">
                <div class="path-duration">
                    <i class="fas fa-clock"></i> Duration: ${path.duration}
                </div>
                <div class="path-difficulty">
                    <i class="fas fa-signal"></i> Level: ${path.difficulty}
                </div>
            </div>
            <div class="path-modules">
                <h4>Modules included:</h4>
                <div class="module-tags">
                    ${path.modules.map(module => `<span class="module-tag">${module}</span>`).join('')}
                </div>
            </div>
            <button class="btn-primary" onclick="addPathToCart('${path.path_name}')">
                <i class="fas fa-plus"></i>
                Add Path to Cart
            </button>
        </div>
    `).join('');
}

// Render projects
function renderProjects() {
    if (!modulesData) return;
    
    const projectsGrid = document.getElementById('projectsGrid');
    const projects = modulesData.project_examples;
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${project.project_name}</h3>
                <span class="difficulty-badge difficulty-${project.difficulty.toLowerCase()}">${project.difficulty}</span>
            </div>
            <div class="project-features">
                <h4>Key Features:</h4>
                <ul class="feature-list">
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="path-modules">
                <h4>Required Modules:</h4>
                <div class="module-tags">
                    ${project.modules_used.map(module => `<span class="module-tag">${module}</span>`).join('')}
                </div>
            </div>
            <button class="btn-primary" onclick="addProjectModulesToCart('${project.project_name}')">
                <i class="fas fa-plus"></i>
                Add Required Modules
            </button>
        </div>
    `).join('');
}

// Cart management
function toggleCartItem(moduleName) {
    const modules = currentTech === 'javascript' ? modulesData.javascript_modules : modulesData.react_modules;
    const module = modules.find(m => m.name === moduleName);
    if (!module) return;
    
    const existingIndex = cart.findIndex(item => item.name === moduleName);
    
    if (existingIndex > -1) {
        cart.splice(existingIndex, 1);
        showNotification(`${module.title} removed from cart`, 'success');
    } else {
        cart.push({
            name: module.name,
            title: module.title,
            summary: module.summary,
            page_html: module.page_html,
            estimatedHours: getModuleHours(module.name)
        });
        showNotification(`${module.title} added to cart`, 'success');
    }
    
    localStorage.setItem('learningCart', JSON.stringify(cart));
    updateCartUI();
    updateModuleButtons();
}

function addPathToCart(pathName) {
    const path = modulesData.learning_paths.find(p => p.path_name === pathName);
    if (!path) return;
    
    let addedCount = 0;
    const modules = currentTech === 'javascript' ? modulesData.javascript_modules : modulesData.react_modules;
    path.modules.forEach(moduleName => {
        const module = modules.find(m => m.name === moduleName);
        if (module && !cart.some(item => item.name === moduleName)) {
            cart.push({
                name: module.name,
                title: module.title,
                summary: module.summary,
                page_html: module.page_html,
                estimatedHours: getModuleHours(module.name)
            });
            addedCount++;
        }
    });
    
    if (addedCount > 0) {
        localStorage.setItem('learningCart', JSON.stringify(cart));
        updateCartUI();
        updateModuleButtons();
        showNotification(`${addedCount} modules from "${pathName}" added to cart`, 'success');
    } else {
        showNotification('All modules from this path are already in your cart', 'info');
    }
}

function addProjectModulesToCart(projectName) {
    const project = modulesData.project_examples.find(p => p.project_name === projectName);
    if (!project) return;
    
    let addedCount = 0;
    const modules = currentTech === 'javascript' ? modulesData.javascript_modules : modulesData.react_modules;
    project.modules_used.forEach(moduleName => {
        const module = modules.find(m => m.name === moduleName);
        if (module && !cart.some(item => item.name === moduleName)) {
            cart.push({
                name: module.name,
                title: module.title,
                summary: module.summary,
                page_html: module.page_html,
                estimatedHours: getModuleHours(module.name)
            });
            addedCount++;
        }
    });
    
    if (addedCount > 0) {
        localStorage.setItem('learningCart', JSON.stringify(cart));
        updateCartUI();
        updateModuleButtons();
        showNotification(`${addedCount} modules for "${projectName}" added to cart`, 'success');
    } else {
        showNotification('All required modules are already in your cart', 'info');
    }
}

function removeFromCart(moduleName) {
    const index = cart.findIndex(item => item.name === moduleName);
    if (index > -1) {
        const removedModule = cart.splice(index, 1)[0];
        localStorage.setItem('learningCart', JSON.stringify(cart));
        updateCartUI();
        updateModuleButtons();
        showNotification(`${removedModule.title} removed from cart`, 'success');
    }
}

function clearCart() {
    cart = [];
    localStorage.setItem('learningCart', JSON.stringify(cart));
    updateCartUI();
    updateModuleButtons();
    showNotification('Cart cleared', 'info');
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartBody = document.getElementById('cartBody');
    const cartTotalModules = document.getElementById('cartTotalModules');
    const cartTotalHours = document.getElementById('cartTotalHours');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    cartCount.textContent = cart.length;
    cartTotalModules.textContent = cart.length;
    
    const totalHours = cart.reduce((sum, item) => sum + item.estimatedHours, 0);
    cartTotalHours.textContent = `${totalHours} hours`;
    
    checkoutBtn.disabled = cart.length === 0;
    
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your learning cart is empty</p>
                <p class="empty-cart-subtitle">Add modules to start your learning journey!</p>
            </div>
        `;
    } else {
        cartBody.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-name">${item.name} • ${item.estimatedHours}h</div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

function updateModuleButtons() {
    document.querySelectorAll('[data-action="cart"]').forEach(button => {
        const moduleName = button.closest('.module-card').dataset.module;
        const isInCart = cart.some(item => item.name === moduleName);
        
        button.className = `btn-primary ${isInCart ? 'btn-added' : ''}`;
        button.innerHTML = `
            <i class="fas ${isInCart ? 'fa-check' : 'fa-plus'}"></i>
            ${isInCart ? 'Added' : 'Add'}
        `;
    });
}

// Modal management
function showCart() {
    document.getElementById('cartModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideCart() {
    document.getElementById('cartModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function showModuleDetails(moduleName) {
    const modules = currentTech === 'javascript' ? modulesData.javascript_modules : modulesData.react_modules;
    const module = modules.find(m => m.name === moduleName);
    if (!module) return;
    
    const modal = document.getElementById('moduleModal');
    const modalBody = document.getElementById('moduleBody');
    
    modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="margin-bottom: 0.5rem; color: var(--text-primary);">${module.title}</h2>
            <p style="color: var(--primary-color); font-weight: 500;">${module.name}</p>
        </div>
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Overview</h3>
            <p style="color: var(--text-secondary); line-height: 1.6;">${module.summary}</p>
        </div>
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Module Details</h3>
            <div style="background-color: var(--bg-secondary); padding: 1.5rem; border-radius: var(--radius-md);">
                <p><strong>Estimated Duration:</strong> ${getModuleHours(module.name)} hours</p>
                <p><strong>Difficulty Level:</strong> ${getDifficulty(module.name)}</p>
                <p><strong>Prerequisites:</strong> ${getPrerequisites(module.name)}</p>
            </div>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn-primary" onclick="toggleCartItem('${module.name}'); hideModuleDetails();">
                <i class="fas fa-plus"></i>
                Add to Learning Cart
            </button>
            <button class="btn-secondary" onclick="window.open('${module.page_html}', '_blank')">
                <i class="fas fa-external-link-alt"></i>
                Open Module
            </button>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModuleDetails() {
    document.getElementById('moduleModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Event listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Technology selector
    document.querySelectorAll('.tech-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tech = e.currentTarget.dataset.tech;
            switchTechnology(tech);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    clearButton.addEventListener('click', clearSearch);
    
    // Cart modal
    document.getElementById('cartIcon').addEventListener('click', showCart);
    document.getElementById('closeCart').addEventListener('click', hideCart);
    document.getElementById('checkoutBtn').addEventListener('click', startLearningJourney);
    
    // Module modal
    document.getElementById('closeModule').addEventListener('click', hideModuleDetails);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderModules(e.target.dataset.filter);
        });
    });
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href').substring(1);
            scrollToSection(target);
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    // Close modals on outside click
    document.getElementById('cartModal').addEventListener('click', (e) => {
        if (e.target.id === 'cartModal') hideCart();
    });
    
    document.getElementById('moduleModal').addEventListener('click', (e) => {
        if (e.target.id === 'moduleModal') hideModuleDetails();
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideCart();
            hideModuleDetails();
        }
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function getModuleHours(moduleName) {
    const jsHourMap = {
        'JS Core': 8, 'Arrays': 6, 'Functions': 8, 'Objects': 7, 'Loops': 4,
        'DOM': 8, 'Events': 6, 'Promises': 10, 'OOP': 12, 'HOF': 6,
        'API': 8, 'Features': 5, 'ES6+': 10, 'Error Handling': 4, 'RegEx': 6,
        'Storage': 4, 'Forms': 5, 'AJAX': 7, 'JSON': 3, 'Modules': 6,
        'Testing': 8, 'Performance': 6, 'Patterns': 10, 'APIs': 8, 'Animation': 7
    };
    
    const reactHourMap = {
        'React Core': 8, 'Components': 6, 'Hooks': 10, 'State': 8, 'Events': 4,
        'Router': 8, 'Forms': 6, 'Context': 7, 'Performance': 10, 'Testing': 8,
        'API': 8, 'Styling': 6, 'Redux': 12, 'Error Handling': 5, 'Patterns': 10,
        'Lifecycle': 6, 'Custom Hooks': 8, 'Portals': 4, 'Refs': 5, 'Suspense': 7,
        'Server Components': 10, 'Animation': 6, 'Accessibility': 5, 'DevTools': 4, 'Deployment': 6
    };
    
    const hourMap = currentTech === 'javascript' ? jsHourMap : reactHourMap;
    return hourMap[moduleName] || 5;
}

function getDifficulty(moduleName) {
    const jsDifficultyMap = {
        'JS Core': 'Beginner', 'Arrays': 'Beginner', 'Functions': 'Beginner', 
        'Objects': 'Beginner', 'Loops': 'Beginner', 'DOM': 'Intermediate',
        'Events': 'Intermediate', 'Promises': 'Intermediate', 'AJAX': 'Intermediate',
        'API': 'Intermediate', 'OOP': 'Advanced', 'ES6+': 'Advanced',
        'Patterns': 'Advanced', 'Performance': 'Advanced', 'Testing': 'Advanced'
    };
    
    const reactDifficultyMap = {
        'React Core': 'Beginner', 'Components': 'Beginner', 'Hooks': 'Intermediate',
        'State': 'Intermediate', 'Events': 'Beginner', 'Router': 'Intermediate',
        'Forms': 'Intermediate', 'Context': 'Intermediate', 'Performance': 'Advanced',
        'Testing': 'Advanced', 'API': 'Intermediate', 'Styling': 'Beginner',
        'Redux': 'Advanced', 'Error Handling': 'Intermediate', 'Patterns': 'Advanced',
        'Lifecycle': 'Intermediate', 'Custom Hooks': 'Advanced', 'Portals': 'Intermediate',
        'Refs': 'Intermediate', 'Suspense': 'Advanced', 'Server Components': 'Advanced',
        'Animation': 'Intermediate', 'Accessibility': 'Intermediate', 'DevTools': 'Beginner',
        'Deployment': 'Intermediate'
    };
    
    const difficultyMap = currentTech === 'javascript' ? jsDifficultyMap : reactDifficultyMap;
    return difficultyMap[moduleName] || 'Intermediate';
}

function getPrerequisites(moduleName) {
    const jsPrereqMap = {
        'JS Core': 'Basic HTML knowledge',
        'Arrays': 'JavaScript basics',
        'Functions': 'JavaScript basics',
        'Objects': 'Functions, Arrays',
        'DOM': 'HTML, CSS, JavaScript basics',
        'Events': 'DOM manipulation',
        'Promises': 'Functions, Callbacks',
        'OOP': 'Objects, Functions',
        'ES6+': 'JavaScript fundamentals',
        'API': 'Promises, JSON',
        'Testing': 'Functions, Objects'
    };
    
    const reactPrereqMap = {
        'React Core': 'JavaScript ES6+, HTML, CSS',
        'Components': 'React Core',
        'Hooks': 'React Components',
        'State': 'React Hooks',
        'Events': 'React Components',
        'Router': 'React Components',
        'Forms': 'React State, Events',
        'Context': 'React Hooks',
        'Performance': 'React Hooks, State',
        'Testing': 'React Components',
        'API': 'React Hooks, JavaScript Promises',
        'Styling': 'CSS, React Components',
        'Redux': 'React State, JavaScript',
        'Error Handling': 'React Components',
        'Patterns': 'React Hooks, Components',
        'Lifecycle': 'React Components',
        'Custom Hooks': 'React Hooks',
        'Portals': 'React Components',
        'Refs': 'React Components',
        'Suspense': 'React Components',
        'Server Components': 'React Advanced',
        'Animation': 'CSS, React Components',
        'Accessibility': 'HTML, React Components',
        'DevTools': 'React basics',
        'Deployment': 'React fundamentals'
    };
    
    const prereqMap = currentTech === 'javascript' ? jsPrereqMap : reactPrereqMap;
    return prereqMap[moduleName] || (currentTech === 'javascript' ? 'JavaScript fundamentals' : 'React fundamentals');
}

function startLearningJourney() {
    if (cart.length === 0) return;
    
    showNotification('Starting your learning journey! Opening modules...', 'success');
    
    // Simulate opening learning dashboard
    setTimeout(() => {
        alert(`Welcome to your personalized learning journey!\n\nYou have selected ${cart.length} modules with an estimated ${cart.reduce((sum, item) => sum + item.estimatedHours, 0)} hours of content.\n\nModules in your journey:\n${cart.map(item => `• ${item.title}`).join('\n')}\n\nHappy learning! 🚀`);
    }, 1000);
    
    hideCart();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)'};
        color: white;
        padding: 12px 20px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add slide in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function showErrorMessage(message) {
    const container = document.querySelector('.container');
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background-color: var(--danger-color);
        color: white;
        padding: 1rem;
        border-radius: var(--radius-md);
        margin: 2rem auto;
        text-align: center;
        max-width: 600px;
    `;
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <strong>Error:</strong> ${message}
    `;
    container.appendChild(errorDiv);
}
