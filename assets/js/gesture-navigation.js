/**
 * Gesture Navigation - Handles trackpad and touchscreen swipe gestures for page navigation
 */
document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const config = {
    minSwipeDistance: 100, // Minimum distance required to be considered a swipe
    maxSwipeTime: 500,     // Maximum time in ms for a swipe to be valid
    preventScrollX: true   // Prevent horizontal scrolling when swiping
  };

  // Store navigation links for easy access
  const navLinks = {
    next: null,
    prev: null
  };

  // Find navigation links on the page (customize these selectors based on your actual navigation)
  function findNavigationLinks() {
    // These selectors should match your actual navigation elements
    // They might be different on your site - adjust as needed
    const allLinks = document.querySelectorAll('a');
    
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent.toLowerCase();
      
      // Check for next page links
      if ((text.includes('next') || 
          link.classList.contains('next') || 
          link.parentElement.classList.contains('next')) && 
          href && href !== '#') {
        navLinks.next = href;
      }
      
      // Check for previous page links
      if ((text.includes('prev') || 
          text.includes('previous') || 
          link.classList.contains('prev') || 
          link.parentElement.classList.contains('prev')) && 
          href && href !== '#') {
        navLinks.prev = href;
      }
    });
    
    // Fallback - try to determine pages from current URL
    if (!navLinks.next || !navLinks.prev) {
      inferNavigationFromCurrentPage();
    }
    
    console.log('Navigation links detected:', navLinks);
  }

  // Try to infer navigation from current page structure
  function inferNavigationFromCurrentPage() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    // Common page naming patterns
    const pagePatterns = [
      { regex: /page-(\d+)\.html/, group: 1 },
      { regex: /(\d+)\.html/, group: 1 },
      { regex: /-(\d+)\.html/, group: 1 }
    ];
    
    // Try to extract page number
    let pageNumber = null;
    for (const pattern of pagePatterns) {
      const match = pageName.match(pattern.regex);
      if (match) {
        pageNumber = parseInt(match[pattern.group]);
        break;
      }
    }
    
    // If we have a page number, generate next/prev links
    if (pageNumber) {
      const basePath = currentPath.replace(/\d+\.html$/, '');
      if (!navLinks.next) {
        navLinks.next = `${basePath}${pageNumber + 1}.html`;
      }
      if (!navLinks.prev && pageNumber > 1) {
        navLinks.prev = `${basePath}${pageNumber - 1}.html`;
      }
    }
  }

  // Variables to track touch events
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  
  // Handle touch start
  function handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
  }
  
  // Handle touch end
  function handleTouchEnd(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();
    
    // Calculate distance and time
    const distanceX = touchEndX - touchStartX;
    const distanceY = Math.abs(touchEndY - touchStartY);
    const elapsedTime = touchEndTime - touchStartTime;
    
    // Only process if it was a horizontal swipe (more horizontal than vertical)
    if (Math.abs(distanceX) > distanceY && elapsedTime < config.maxSwipeTime) {
      processSwipe(distanceX);
    }
    
    // Reset values
    touchStartX = 0;
    touchStartY = 0;
  }
  
  // Handle trackpad wheel events (horizontal scrolling)
  function handleTrackpadGesture(e) {
    // Only process horizontal scrolling
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 50) {
      if (config.preventScrollX) {
        e.preventDefault();
      }
      
      // We use deltaX in opposite direction because scroll right means go to previous page
      // and scroll left means go to next page in natural scrolling
      processSwipe(-e.deltaX);
    }
  }
  
  // Process the swipe based on direction and distance
  function processSwipe(distance) {
    if (Math.abs(distance) < config.minSwipeDistance) return;
    
    if (distance > 0) {
      // Swiped right - go to previous page
      if (navLinks.prev) {
        console.log('Navigating to previous page:', navLinks.prev);
        window.location.href = navLinks.prev;
      }
    } else {
      // Swiped left - go to next page
      if (navLinks.next) {
        console.log('Navigating to next page:', navLinks.next);
        window.location.href = navLinks.next;
      }
    }
  }
  
  // Add visual feedback for swipe gestures
  function setupSwipeFeedback() {
    // Create swipe indicators
    const swipeIndicatorLeft = document.createElement('div');
    swipeIndicatorLeft.className = 'swipe-indicator left';
    swipeIndicatorLeft.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const swipeIndicatorRight = document.createElement('div');
    swipeIndicatorRight.className = 'swipe-indicator right';
    swipeIndicatorRight.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Add to body
    document.body.appendChild(swipeIndicatorLeft);
    document.body.appendChild(swipeIndicatorRight);
    
    // Add CSS for indicators
    const style = document.createElement('style');
    style.textContent = `
      .swipe-indicator {
        position: fixed;
        top: 50%;
        width: 50px;
        height: 50px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        transform: translateY(-50%) scale(0);
        transition: transform 0.2s ease;
        z-index: 9999;
        pointer-events: none;
      }
      
      .swipe-indicator.left {
        left: 20px;
      }
      
      .swipe-indicator.right {
        right: 20px;
      }
      
      .swipe-indicator.active {
        transform: translateY(-50%) scale(1);
      }
    `;
    document.head.appendChild(style);
    
    // Show indicator based on touch position
    document.addEventListener('touchmove', function(e) {
      if (!touchStartX) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      
      // Only show indicator if swipe is significant
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0 && navLinks.prev) {
          swipeIndicatorLeft.classList.add('active');
        } else if (deltaX < 0 && navLinks.next) {
          swipeIndicatorRight.classList.add('active');
        }
      }
    });
    
    // Hide indicators when touch ends
    document.addEventListener('touchend', function() {
      swipeIndicatorLeft.classList.remove('active');
      swipeIndicatorRight.classList.remove('active');
    });
  }

  // Initialize gesture detection
  function init() {
    // Find the navigation links
    findNavigationLinks();
    
    // Set up event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Use passive: false for wheel to allow preventDefault
    document.addEventListener('wheel', handleTrackpadGesture, { passive: false });
    
    // Setup visual feedback
    setupSwipeFeedback();
    
    console.log('Gesture navigation initialized');
  }
  
  // Start the initialization
  init();
}); 