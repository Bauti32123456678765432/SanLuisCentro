document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
});

/**
 * Initialize gallery carousel functionality
 */
function initializeGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    const galleryNav = document.getElementById('gallery-nav');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    if (!galleryContainer || !galleryNav) return;
    
    // Create gallery slides
    galleryImages.forEach((image, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.classList.add('gallery-slide');
        
        slide.innerHTML = `
            <div class="gallery-image">
                <img src="${image.thumbnail}" alt="${image.title}">
            </div>
            <h3 class="gallery-title">${image.title}</h3>
            <p class="gallery-description">${image.description}</p>
        `;
        
        // Add slide to container
        galleryContainer.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (index === 0) dot.classList.add('active');
        
        // Add click event to dot
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        // Add dot to nav
        galleryNav.appendChild(dot);
    });
    
    // Set initial state
    let currentSlide = 0;
    const slides = galleryContainer.querySelectorAll('.gallery-slide');
    const dots = galleryNav.querySelectorAll('.gallery-dot');
    
    if (!slides.length) return;
    
    // Set initial slide
    slides[0].style.display = 'flex';
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none'; // Ensure each slide is hidden
            slide.style.transform = 'translateX(100%)';
            slide.style.opacity = '0';
        });

        // Show selected slide
        slides[index].style.display = 'flex'; // Make sure it is visible
        slides[index].style.transform = 'translateX(0)';
        slides[index].style.opacity = '1';

        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');

        // Update current slide
        currentSlide = index;
    }
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }
    
    // Touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    galleryContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (touchEndX < touchStartX) {
            // Swipe left - next slide
            goToSlide(currentSlide + 1);
        } else if (touchEndX > touchStartX) {
            // Swipe right - previous slide
            goToSlide(currentSlide - 1);
        }
    }
    
    // Initialize gallery
    goToSlide(0);
}