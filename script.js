// Modern JavaScript for Arielle Pivonka Art Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initArtworkShowcase();
    initSmoothScrolling();
    initFormHandling();
    initParallaxEffects();
    initLazyLoading();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.portfolio-item, .about-text, .commission-info, .contact-item, .stat');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Staggered animation for portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Artwork Showcase functionality
function initArtworkShowcase() {
    // Initialize Swiper
    const swiper = new Swiper('.swiper', {
        grabCursor: true,
        speed: 800,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        loop: true,
        autoplay: {
            delay: 8000,
            disableOnInteraction: false,
        },
        mousewheel: {
            invert: false,
            sensitivity: 1,
        },
        keyboard: {
            enabled: true,
        },
    });

    // Sidebar functionality
    const moreBtns = document.querySelectorAll('.more-btn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const boxContainers = document.querySelectorAll('.box-container');
    const body = document.querySelector('body');
    const mobileBoxes = document.querySelectorAll('.box-mobile');

    // Open sidebar
    moreBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            let modal = btn.getAttribute('data-modal');
            const sidebar = document.getElementById(modal);
            if (sidebar) {
                sidebar.style.display = 'block';
                sidebar.classList.add('active');
                body.classList.add('prevent-background-scroll');
                boxContainers.forEach((container) => {
                    container.style.display = 'none';
                });
            }
        });
    });

    // Close sidebar
    closeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const sidebar = btn.closest('.sidebar');
            if (sidebar) {
                sidebar.style.display = 'none';
                sidebar.classList.remove('active');
                body.classList.remove('prevent-background-scroll');
                boxContainers.forEach((container) => {
                    container.style.display = 'grid';
                });
            }
        });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('sidebar')) {
            e.target.style.display = 'none';
            e.target.classList.remove('active');
            body.classList.remove('prevent-background-scroll');
            boxContainers.forEach((container) => {
                container.style.display = 'grid';
            });
        }
    });

    // Mobile box functionality
    mobileBoxes.forEach((btn) => {
        btn.addEventListener('click', () => {
            let modal = btn.getAttribute('data-modal');
            const sidebar = document.getElementById(modal);
            if (sidebar) {
                sidebar.style.display = 'block';
                sidebar.classList.add('active');
                body.classList.add('prevent-background-scroll');
                boxContainers.forEach((container) => {
                    container.style.display = 'none';
                });
            }
        });
    });

    // Commission inquiry buttons
    const inquiryBtns = document.querySelectorAll('.inquiry-btn');
    inquiryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Scroll to commission section
            const commissionSection = document.getElementById('commission');
            if (commissionSection) {
                commissionSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Commission buttons in story sidebars
    const commissionBtns = document.querySelectorAll('.commission-btn');
    commissionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Scroll to commission section
            const commissionSection = document.getElementById('commission');
            if (commissionSection) {
                commissionSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add scroll prevention when sidebar is open
    const preventScrollClass = 'prevent-background-scroll';
    
    // Add CSS for scroll prevention
    if (!document.getElementById('scroll-prevention-style')) {
        const style = document.createElement('style');
        style.id = 'scroll-prevention-style';
        style.textContent = `
            .prevent-background-scroll {
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
}


// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling
function initFormHandling() {
    const forms = document.querySelectorAll('.glass-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            this.classList.add('loading');
            
            // Simulate form submission (replace with actual PHP handling)
            setTimeout(() => {
                // Reset form
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                this.classList.remove('loading');
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
            }, 2000);
        });
    });
}

// Parallax effects
function initParallaxEffects() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = function() {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(59, 130, 246, 0.9)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Portfolio item modal functionality
function initPortfolioModal() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const viewButton = item.querySelector('.btn-outline');
        
        if (viewButton) {
            viewButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;
                const image = item.querySelector('img').src;
                
                showPortfolioModal(title, description, image);
            });
        }
    });
}

// Portfolio modal
function showPortfolioModal(title, description, imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'portfolio-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-image">
                    <img src="${imageSrc}" alt="${title}">
                </div>
                <div class="modal-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        </div>
    `;
    
    // Style the modal
    const style = document.createElement('style');
    style.textContent = `
        .portfolio-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .modal-content {
            background: rgba(26, 26, 26, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            max-width: 800px;
            max-height: 90vh;
            overflow: hidden;
            position: relative;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.5rem;
            z-index: 1;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }
        
        .modal-image img {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .modal-info {
            padding: 2rem;
        }
        
        .modal-info h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: white;
            margin-bottom: 0.5rem;
        }
        
        .modal-info p {
            color: #888;
            font-size: 1rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 100);
    
    // Close functionality
    const closeModal = () => {
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // ESC key to close
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// Initialize portfolio modal
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioModal();
});

// Performance optimization
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Scroll-based animations and effects
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-background');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'https://via.placeholder.com/600x800/1a1a1a/ffffff?text=Abstract+Painting+1',
        'https://via.placeholder.com/600x800/2a2a2a/ffffff?text=Abstract+Painting+2'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker can be added here for offline functionality
    });
}
