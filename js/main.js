document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeHamburgerMenu();
    initializeEventsTabs();
    initializeFlashMessages();
    renderUpcomingEvents();
    renderPastEvents();
    
    // Set current year in copyright
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

/**
 * Initialize hamburger menu functionality for mobile view
 */
function initializeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a menu item
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

/**
 * Initialize events tabs functionality
 */
function initializeEventsTabs() {
    const tabs = document.querySelectorAll('.events-tab');
    const contents = document.querySelectorAll('.events-content');

    if (!tabs.length || !contents.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

/**
 * Initialize flash messages with auto-dismiss
 */
function initializeFlashMessages() {
    const flashMessages = document.getElementById('flash-messages');
    
    // Example flash message (for demonstration)
    // You can remove this in production or trigger it based on form submissions
    /*
    setTimeout(() => {
        const message = createFlashMessage('success', 'Su mensaje ha sido enviado correctamente. Nos contactaremos a la brevedad.');
        flashMessages.appendChild(message);
    }, 2000);
    */
}

/**
 * Create a flash message element
 * @param {string} type - The type of message (success, error)
 * @param {string} text - The message text
 * @returns {HTMLElement} The message element
 */
function createFlashMessage(type, text) {
    const message = document.createElement('div');
    message.classList.add('alert', `alert-${type}`);
    message.textContent = text;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.classList.add('alert-close');
    closeBtn.addEventListener('click', () => {
        message.remove();
    });
    message.appendChild(closeBtn);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => {
            message.remove();
        }, 500);
    }, 5000);
    
    return message;
}

/**
 * Render upcoming events
 */
function renderUpcomingEvents() {
    const upcomingEventsGrid = document.getElementById('upcoming-events-grid');
    if (!upcomingEventsGrid) return;
    
    upcomingEventsData.forEach(event => {
        const eventCard = createEventCard(event);
        upcomingEventsGrid.appendChild(eventCard);
    });
}

/**
 * Render past events
 */
function renderPastEvents() {
    const pastEventsGrid = document.getElementById('past-events-grid');
    if (!pastEventsGrid) return;
    
    pastEventsData.forEach(event => {
        const eventCard = createEventCard(event);
        pastEventsGrid.appendChild(eventCard);
    });
}

/**
 * Create an event card
 * @param {Object} event - The event data
 * @returns {HTMLElement} The event card element
 */
function createEventCard(event) {
    const card = document.createElement('div');
    card.classList.add('event-card');
    
    card.innerHTML = `
        <div class="event-image">
            <img src="${event.image}" alt="${event.title}">
        </div>
        <div class="event-details">
            <h3 class="event-title">${event.title}</h3>
            <p class="event-date">${event.date}</p>
            <p class="event-description">${event.description}</p>
        </div>
    `;
    
    return card;
}

/**
 * Smooth scroll to element
 * @param {string} elementId - The ID of the element to scroll to
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        window.scrollTo({
            top: element.offsetTop - 80, // Adjust for header height
            behavior: 'smooth'
        });
    }
}