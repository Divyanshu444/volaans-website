// Industry Services Animation
document.addEventListener('DOMContentLoaded', function() {
    // Check if the industry services container exists
    const industryContainer = document.querySelector('.industry-services-container');
    if (!industryContainer) return;
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100,
            delay: 100
        });
    }
    
    // Get all industry sections and service items
    const industrySections = document.querySelectorAll('.industry-section');
    const serviceItems = document.querySelectorAll('.service-item');
    
    // Create intersection observer for industry sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Get service items within this industry section
                const items = entry.target.querySelectorAll('.service-item');
                
                // Add staggered animation to service items
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animated');
                        
                        // Add hover animations after elements are visible
                        item.addEventListener('mouseenter', () => {
                            item.style.transform = 'translateY(-8px)';
                        });
                        
                        item.addEventListener('mouseleave', () => {
                            item.style.transform = 'translateY(0)';
                        });
                    }, 150 * index);
                });
                
                // Unobserve after animation
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });
    
    // Observe each industry section
    industrySections.forEach(section => {
        sectionObserver.observe(section);
        
        // Add hover effect for section
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'translateY(-10px)';
        });
        
        section.addEventListener('mouseleave', () => {
            section.style.transform = 'translateY(0)';
        });
    });
    
    // Add click functionality to expand/collapse sections
    industrySections.forEach(section => {
        const header = section.querySelector('.industry-header');
        const services = section.querySelector('.industry-services');
        
        header.addEventListener('click', () => {
            // Toggle expanded class
            section.classList.toggle('expanded');
            
            // Close other sections when one is expanded
            if (section.classList.contains('expanded')) {
                industrySections.forEach(otherSection => {
                    if (otherSection !== section && otherSection.classList.contains('expanded')) {
                        otherSection.classList.remove('expanded');
                        otherSection.querySelector('.industry-services').style.maxHeight = '0';
                    }
                });
                
                // Animate height of services container
                services.style.maxHeight = services.scrollHeight + 'px';
                
                // Refresh hover effects after expanding
                setTimeout(() => {
                    const items = section.querySelectorAll('.service-item');
                    items.forEach((item, index) => {
                        item.style.opacity = 0;
                        setTimeout(() => {
                            item.style.opacity = 1;
                            item.style.transform = 'translateY(0)';
                        }, 50 * index);
                    });
                }, 100);
            } else {
                services.style.maxHeight = '0';
            }
            
            // Add animation to dropdown arrow
            const arrow = header.querySelector('.dropdown-arrow i');
            if (section.classList.contains('expanded')) {
                arrow.style.transform = 'rotate(180deg)';
            } else {
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    // Open the first section by default
    if (industrySections.length > 0) {
        const firstSection = industrySections[0];
        const firstServices = firstSection.querySelector('.industry-services');
        const firstArrow = firstSection.querySelector('.dropdown-arrow i');
        
        firstSection.classList.add('expanded');
        firstServices.style.maxHeight = firstServices.scrollHeight + 'px';
        firstArrow.style.transform = 'rotate(180deg)';
        
        // Animate first section's items
        setTimeout(() => {
            const items = firstSection.querySelectorAll('.service-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animated');
                }, 100 * index);
            });
        }, 500);
    }
    
    // Add hover effects to service items
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('hovered');
            const paragraph = item.querySelector('p');
            if (paragraph) {
                paragraph.style.transform = 'translateY(-3px)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hovered');
            const paragraph = item.querySelector('p');
            if (paragraph) {
                paragraph.style.transform = 'translateY(0)';
            }
        });
    });
}); 