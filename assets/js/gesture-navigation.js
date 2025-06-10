/**
 * Gesture Navigation - Handles trackpad and touchscreen swipe gestures for page navigation
 */
console.log('Gesture Navigation Script Loaded'); // Debug message to verify script loading

document.addEventListener('DOMContentLoaded', function() {
  console.log('Gesture Navigation DOM Content Loaded'); // Debug message for DOM ready
  
  // Configuration
  const config = {
    minSwipeDistance: 50, // Reduced from 100 to make it more sensitive
    maxSwipeTime: 800,     // Increased from 500 to allow more time for gestures
    preventScrollX: false,  // Changed to false to avoid conflicts with native scrolling
    showFirstTimeNotification: true,  // Show notification to first-time visitors
    useAlternativeTrackpadMethod: true // Use an alternative method for trackpad detection
  };

  // Store navigation links for easy access
  const navLinks = {
    next: null,
    prev: null
  };

  // Find navigation links on the page (customize these selectors based on your actual navigation)
  function findNavigationLinks() {
    console.log('Finding navigation links...'); // Debug
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
    
    // If no navigation links were found, try to use common pages
    if (!navLinks.next && !navLinks.prev) {
      useCommonPagesNavigation();
    }
    
    console.log('Navigation links detected:', navLinks);
  }

  // Try to infer navigation from current page structure
  function inferNavigationFromCurrentPage() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    console.log('Inferring navigation from:', pageName); // Debug
    
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
  
  // Fallback to use common website pages for navigation
  function useCommonPagesNavigation() {
    console.log('Using common pages navigation'); // Debug
    
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    // Define common pages in navigation order
    const commonPages = [
      'index.html',
      'about.html',
      'service.html',
      'project.html',
      'blog.html',
      'contact.html'
    ];
    
    // Find current page index
    const currentIndex = commonPages.indexOf(pageName);
    
    if (currentIndex !== -1) {
      // Set next page if not the last page
      if (currentIndex < commonPages.length - 1) {
        navLinks.next = commonPages[currentIndex + 1];
      }
      
      // Set previous page if not the first page
      if (currentIndex > 0) {
        navLinks.prev = commonPages[currentIndex - 1];
      }
    }
  }

  // Variables to track touch events
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  
  // Alternative trackpad method variables
  let lastPageX = 0;
  let horizontalMovement = 0;
  let mouseMoveCount = 0;
  let mouseDownTime = 0;
  let isTrackpadGesture = false;
  
  // Handle touch start
  function handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
    console.log('Touch start detected at:', touchStartX, touchStartY); // Debug
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
    
    console.log('Touch end detected, distance X:', distanceX); // Debug
    
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
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 30) { // Reduced threshold from 50 to 30
      console.log('Trackpad gesture detected, deltaX:', e.deltaX); // Debug
      
      if (config.preventScrollX) {
        e.preventDefault();
      }
      
      // We use deltaX in opposite direction because scroll right means go to previous page
      // and scroll left means go to next page in natural scrolling
      processSwipe(-e.deltaX);
    }
  }
  
  // Alternative trackpad detection using mouse events
  function setupAlternativeTrackpadMethod() {
    console.log('Setting up alternative trackpad method');
    
    // Mouse down - start tracking
    document.addEventListener('mousedown', function(e) {
      // Only trigger for left button
      if (e.button !== 0) return;
      
      lastPageX = e.pageX;
      horizontalMovement = 0;
      mouseMoveCount = 0;
      mouseDownTime = Date.now();
      isTrackpadGesture = false;
      
      console.log('Mouse down at:', lastPageX);
    });
    
    // Mouse move - track horizontal movement
    document.addEventListener('mousemove', function(e) {
      if (!mouseDownTime) return;
      
      // Calculate horizontal movement
      const deltaX = e.pageX - lastPageX;
      horizontalMovement += deltaX;
      lastPageX = e.pageX;
      mouseMoveCount++;
      
      // Check if this looks like a trackpad gesture
      // Trackpad gestures typically have many small movements
      if (mouseMoveCount > 5 && Math.abs(horizontalMovement) > 50) {
        isTrackpadGesture = true;
      }
    });
    
    // Mouse up - check if it was a trackpad gesture
    document.addEventListener('mouseup', function(e) {
      if (!mouseDownTime) return;
      
      const elapsedTime = Date.now() - mouseDownTime;
      
      console.log('Mouse up, horizontal movement:', horizontalMovement, 'moves:', mouseMoveCount, 'time:', elapsedTime);
      
      // Check if this was likely a trackpad gesture
      if (isTrackpadGesture && elapsedTime < config.maxSwipeTime) {
        console.log('Alternative trackpad gesture detected');
        processSwipe(horizontalMovement);
      }
      
      // Reset tracking
      mouseDownTime = 0;
      horizontalMovement = 0;
      mouseMoveCount = 0;
    });
  }
  
  // Process the swipe based on direction and distance
  function processSwipe(distance) {
    if (Math.abs(distance) < config.minSwipeDistance) return;
    
    console.log('Processing swipe, distance:', distance); // Debug
    
    if (distance > 0) {
      // Swiped right - go to previous page
      if (navLinks.prev) {
        console.log('Navigating to previous page:', navLinks.prev);
        window.location.href = navLinks.prev;
      } else {
        console.log('No previous page available');
        showNavigationFeedback('No previous page');
      }
    } else {
      // Swiped left - go to next page
      if (navLinks.next) {
        console.log('Navigating to next page:', navLinks.next);
        window.location.href = navLinks.next;
      } else {
        console.log('No next page available');
        showNavigationFeedback('No next page');
      }
    }
  }
  
  // Show navigation feedback when no navigation is available
  function showNavigationFeedback(message) {
    // Create feedback element if it doesn't exist
    let feedback = document.getElementById('gesture-nav-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'gesture-nav-feedback';
      feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(feedback);
    }
    
    // Set message and show
    feedback.textContent = message;
    feedback.style.opacity = '1';
    
    // Hide after a delay
    setTimeout(() => {
      feedback.style.opacity = '0';
    }, 1500);
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
      
      /* Notification styles */
      .gesture-notification {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 14px;
        text-align: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 90%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .gesture-notification.show {
        opacity: 1;
      }
      
      .gesture-notification-close {
        margin-left: 15px;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
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

  // Show first-time notification about gesture navigation
  function showFirstTimeNotification() {
    // Check if user has seen the notification before
    if (localStorage.getItem('gesture_navigation_seen')) {
      return;
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'gesture-notification';
    
    // Detect device type for appropriate message
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTrackpadDevice = !isMobile && !/Tablet|iPad/i.test(navigator.userAgent);
    
    // Set appropriate message based on device
    let message = '';
    if (isMobile) {
      message = 'Swipe left or right to navigate between pages';
    } else if (isTrackpadDevice) {
      message = 'Use trackpad horizontal swipe gestures to navigate between pages';
    } else {
      message = 'Use horizontal swipe gestures to navigate between pages';
    }
    
    notification.innerHTML = `
      <span>${message}</span>
      <span class="gesture-notification-close">&times;</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification after a short delay
    setTimeout(() => {
      notification.classList.add('show');
    }, 1500);
    
    // Set up close button
    const closeButton = notification.querySelector('.gesture-notification-close');
    closeButton.addEventListener('click', () => {
      notification.classList.remove('show');
      // Remember that user has seen the notification
      localStorage.setItem('gesture_navigation_seen', 'true');
      
      // Remove element after fade out
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.classList.remove('show');
        
        // Remember that user has seen the notification
        localStorage.setItem('gesture_navigation_seen', 'true');
        
        // Remove element after fade out
        setTimeout(() => {
          if (document.body.contains(notification)) {
            notification.remove();
          }
        }, 300);
      }
    }, 8000);
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
    
    // Setup alternative trackpad method if enabled
    if (config.useAlternativeTrackpadMethod) {
      setupAlternativeTrackpadMethod();
    }
    
    // Setup visual feedback
    setupSwipeFeedback();
    
    // Show first-time notification if enabled
    if (config.showFirstTimeNotification) {
      showFirstTimeNotification();
    }
    
    console.log('Gesture navigation initialized with links:', navLinks);
  }
  
  // Start the initialization
  init();
}); 