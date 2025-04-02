document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
});

/**
 * Initialize gallery carousel functionality
 */
function initializeGallery() {
    const carousel = document.querySelector('.gallery-carousel-container');
    const slides = document.querySelectorAll('.gallery-slide');
    const dots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    if (!carousel || !slides.length) return;
    
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Set initial position
    updateCarousel();
    
    // Set active dot
    if (dots.length) {
        dots[0].classList.add('active');
    }
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
            updateCarousel();
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
            updateCarousel();
        });
    }
    
    // Dot navigation
    if (dots.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlide = index;
                updateCarousel();
            });
        });
    }
    
    // Touch events for mobile swipe
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    // Handle swipe direction
    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            // Swipe left
            currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
        } else if (touchEndX - touchStartX > 50) {
            // Swipe right
            currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
        }
        updateCarousel();
    }
    
    // Update carousel position and active dot
    function updateCarousel() {
        // Update slides position
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active dot
        if (dots.length) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }
    }
    
    // Auto slide every 5 seconds
    setInterval(function() {
        currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
        updateCarousel();
    }, 5000);
}
