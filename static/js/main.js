document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeHamburgerMenu();
    initializeEventsTabs();
    initializeBannerSlider();
    initializeFlashMessages();
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
 * Initialize banner slider functionality
 */
function initializeBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    // Show first slide
    slides[0].classList.add('active');
    
    // Function to show next slide
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Auto slide every 8 seconds (más pausado)
    setInterval(nextSlide, 8000);
}

/**
 * Initialize flash messages with auto-dismiss
 */
function initializeFlashMessages() {
    const flashMessages = document.querySelectorAll('.alert');
    
    if (!flashMessages.length) return;
    
    flashMessages.forEach(message => {
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
    });
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
