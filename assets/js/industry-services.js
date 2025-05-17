// Industry Services Animation
document.addEventListener('DOMContentLoaded', function() {
    // Check if the industry services container exists
    const industryContainer = document.querySelector('.industry-services-container');
    if (!industryContainer) return;
    
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
                    }, 100 * index);
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
    });
    
    // Add click functionality to expand/collapse sections (optional)
    industrySections.forEach(section => {
        const header = section.querySelector('.industry-header');
        const services = section.querySelector('.industry-services');
        
        header.addEventListener('click', () => {
            // Toggle expanded class
            section.classList.toggle('expanded');
            
            // Animate height of services container
            if (section.classList.contains('expanded')) {
                services.style.maxHeight = services.scrollHeight + 'px';
            } else {
                services.style.maxHeight = '0';
            }
        });
    });
}); 