// Sidebar Navigation
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// Generate navigation menu from sections
function generateNavMenu() {
    const sections = document.querySelectorAll('.content-section');
    const menuItems = [];
    
    sections.forEach((section, index) => {
        const header = section.querySelector('.section-header h2');
        if (header) {
            const id = section.id || `section-${index + 1}`;
            section.id = id;
            const text = header.textContent.trim();
            menuItems.push(`<li><a href="#${id}">${text}</a></li>`);
        }
    });
    
    navMenu.innerHTML = menuItems.join('');
    
    // Add click handlers
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const offset = 80; // Header height
                const targetPosition = targetSection.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                sidebar.classList.remove('active');
                
                // Update active nav item
                navMenu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

// Accordion functionality
function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            const accordion = item.closest('.accordion');
            
            // Close all accordions in the same container if needed
            // (Remove this if you want multiple open at once)
            if (accordion) {
                accordion.querySelectorAll('.accordion-item').forEach(accItem => {
                    if (accItem !== item) {
                        accItem.classList.remove('active');
                    }
                });
            }
            
            // Toggle clicked item
            item.classList.toggle('active');
        });
    });
}

// Progress bar
function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = Math.min(scrollPercent, 100) + '%';
    }
}

// Scroll to top button
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Active section highlighting
function updateActiveSection() {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = navMenu.querySelectorAll('a');
    const scrollPosition = window.pageYOffset + 150;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.id;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = navMenu.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

// Quiz functionality
function initQuizzes() {
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            const quizQuestion = this.closest('.quiz-question');
            const isCorrect = this.getAttribute('data-correct') === 'true';
            const explanation = quizQuestion.querySelector('.quiz-explanation');
            const allOptions = quizQuestion.querySelectorAll('.quiz-option');
            
            // If this option was already clicked, don't do anything
            if (this.disabled && this.classList.contains('correct')) {
                return;
            }
            
            // Mark the clicked option
            if (isCorrect) {
                // Disable all options
                allOptions.forEach(opt => {
                    opt.disabled = true;
                });
                
                this.classList.add('correct');
                // Show explanation only if correct
                if (explanation) {
                    explanation.classList.add('show');
                }
            } else {
                // Mark as incorrect - keep it marked in red
                this.classList.add('incorrect');
                this.disabled = true;
                
                // Don't show correct answer or explanation - user must keep trying
            }
        });
    });
}

// Hide intro section when scrolling down
function initScrollToHideIntro() {
    const introSection = document.getElementById('introSection');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide intro when scrolling down past a certain point
        if (scrollTop > 300 && scrollTop > lastScrollTop && introSection && !introSection.classList.contains('hidden')) {
            introSection.classList.add('hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    generateNavMenu();
    initAccordions();
    initScrollTop();
    initScrollAnimations();
    initQuizzes();
    initScrollToHideIntro();
    
    // Update progress and active section on scroll
    window.addEventListener('scroll', () => {
        updateProgressBar();
        updateActiveSection();
    });
    
    // Initial updates
    updateProgressBar();
    updateActiveSection();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close sidebar
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
    
    // M to toggle menu
    if (e.key === 'm' || e.key === 'M') {
        if (!e.ctrlKey && !e.metaKey) {
            sidebar.classList.toggle('active');
        }
    }
});


