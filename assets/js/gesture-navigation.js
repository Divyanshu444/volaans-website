/**
 * Gesture Navigation - Handles trackpad and touchscreen swipe gestures for page navigation
 */
console.log('Gesture Navigation Script Loaded'); // Debug message to verify script loading

document.addEventListener('DOMContentLoaded', function() {
  console.log('Gesture Navigation DOM Content Loaded'); // Debug message for DOM ready
  
  // Configuration
  const config = {
    minSwipeDistance: 30, // Further reduced for better sensitivity
    maxSwipeTime: 1000,   // Increased to allow more time for gestures
    preventScrollX: false, // Don't prevent horizontal scrolling
    showFirstTimeNotification: true,  // Show notification to first-time visitors
    useAlternativeTrackpadMethod: true, // Use an alternative method for trackpad detection
    debugMode: true  // Enable debug logging
  };

  // Store navigation links for easy access
  const navLinks = {
    next: null,
    prev: null
  };

  // Find navigation links on the page (customize these selectors based on your actual navigation)
  function findNavigationLinks() {
    console.log('Finding navigation links...'); // Debug
    
    // Reset navigation links
    navLinks.next = null;
    navLinks.prev = null;
    
    // These selectors should match your actual navigation elements
    // They might be different on your site - adjust as needed
    const allLinks = document.querySelectorAll('a');
    
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent.toLowerCase();
      
      // Skip if no href or href is just anchor
      if (!href || href === '#' || href.startsWith('#')) return;
      
      // Check for next page links
      if ((text.includes('next') || 
          link.classList.contains('next') || 
          link.parentElement.classList.contains('next'))) {
        navLinks.next = href;
        console.log('Found next link via text/class:', href);
      }
      
      // Check for previous page links
      if ((text.includes('prev') || 
          text.includes('previous') || 
          link.classList.contains('prev') || 
          link.parentElement.classList.contains('prev'))) {
        navLinks.prev = href;
        console.log('Found prev link via text/class:', href);
      }
    });
    
    console.log('Direct navigation links found:', navLinks);
    
    // If no direct navigation links were found, try to infer from page structure
    if (!navLinks.next && !navLinks.prev) {
      console.log('No direct navigation links found, trying to infer...');
      inferNavigationFromCurrentPage();
    }
    
    // If still no navigation links, use common pages fallback
    if (!navLinks.next && !navLinks.prev) {
      console.log('No navigation inferred, using common pages fallback...');
      useCommonPagesNavigation();
    }
    
    console.log('Final navigation links:', navLinks);
  }

  // Try to infer navigation from current page structure
  function inferNavigationFromCurrentPage() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    console.log('Inferring navigation from:', pageName); // Debug
    
    // Common page naming patterns for numbered pages
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
      console.log('Inferred numbered page navigation:', { pageNumber, navLinks });
    } else {
      console.log('No numbered page pattern found, will use common pages navigation');
    }
  }
  
  // Fallback to use common website pages for navigation
  function useCommonPagesNavigation() {
    console.log('Using common pages navigation'); // Debug
    
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    // Handle empty pathname or just filename
    const actualPageName = pageName || 'index.html';
    
    console.log('Current page name:', actualPageName); // Debug
    
    // Special case for service.html - check if user came from industry grid
    if (actualPageName === 'service.html') {
      // Check the referrer to see if we came from index.html
      const referrer = document.referrer;
      const referrerPath = referrer ? new URL(referrer).pathname.split('/').pop() : '';
      
      // If referrer is index.html or we have a industry grid click stored, set prev directly to index.html
      if (referrerPath === 'index.html' || sessionStorage.getItem('from_industry_grid') === 'true') {
        navLinks.prev = 'index.html';
        console.log('Setting direct navigation back to index.html from services');
        return;
      }
    }
    
    // Define common pages in navigation order - updated to match actual site structure
    const commonPages = [
      'index.html',
      'about.html',
      'service.html',
      'project.html',
      'Case_Study.html',
      'blog.html',
      'contact.html'
    ];
    
    // Add special cases for pages not in main navigation
    const specialCases = {
      'index2.html': { prev: 'index.html', next: 'about.html' },
      'blog-single.html': { prev: 'blog.html', next: null },
      'project-single.html': { prev: 'project.html', next: 'Case_Study.html' },
      'service-single.html': { prev: 'service.html', next: 'project.html' },
      'It-Services.html': { prev: 'service.html', next: 'project.html' },
      'blog2.html': { prev: 'blog.html', next: null },
      'team.html': { prev: 'about.html', next: 'service.html' },
      'testimonial.html': { prev: 'about.html', next: 'service.html' },
      'faq.html': { prev: 'blog.html', next: null },
      'contact.html': { prev: 'blog.html', next: null },
      '404.html': { prev: 'index.html', next: null }
    };
    
    // Check for special cases first
    if (specialCases[actualPageName]) {
      const specialCase = specialCases[actualPageName];
      navLinks.prev = specialCase.prev;
      navLinks.next = specialCase.next;
      console.log('Applied special case navigation for:', actualPageName);
      return;
    }
    
    // Find current page index in common pages
    const currentIndex = commonPages.indexOf(actualPageName);
    
    if (currentIndex !== -1) {
      // Set next page if not the last page
      if (currentIndex < commonPages.length - 1) {
        navLinks.next = commonPages[currentIndex + 1];
      } else {
        navLinks.next = null; // Last page
      }
      
      // Set previous page if not the first page
      if (currentIndex > 0) {
        navLinks.prev = commonPages[currentIndex - 1];
      } else {
        navLinks.prev = null; // First page
      }
    }
    
    console.log('Applied common pages navigation. Current index:', currentIndex, 'Links:', navLinks);
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
    
    // Check if the touch is on an interactive element (links, buttons, etc.)
    const target = e.target;
    const isInteractiveElement = target.closest('a') || 
                                target.closest('button') || 
                                target.closest('.service-branding-boxesarea') ||
                                target.closest('.portfolio-boxarea') ||
                                target.closest('[role="button"]');
    
    // If touching an interactive element, don't process as a navigation gesture
    if (isInteractiveElement) {
      touchStartX = 0;
      touchStartY = 0;
      console.log('Touch start on interactive element, ignoring for gesture navigation');
      return;
    }
    
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
    console.log('Touch start detected at:', touchStartX, touchStartY); // Debug
  }
  
  // Handle touch end
  function handleTouchEnd(e) {
    if (!touchStartX || !touchStartY) return;
    
    // Check if the touch end is on an interactive element
    const target = e.target;
    const isInteractiveElement = target.closest('a') || 
                                target.closest('button') || 
                                target.closest('.service-branding-boxesarea') ||
                                target.closest('.portfolio-boxarea') ||
                                target.closest('[role="button"]');
    
    // If ending on an interactive element, don't process as a navigation gesture
    if (isInteractiveElement) {
      touchStartX = 0;
      touchStartY = 0;
      console.log('Touch end on interactive element, ignoring for gesture navigation');
      return;
    }
    
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
    // Check if the event target is an interactive element
    const target = e.target;
    const isInteractiveElement = target.closest('a') || 
                                target.closest('button') || 
                                target.closest('.service-branding-boxesarea') ||
                                target.closest('.portfolio-boxarea') ||
                                target.closest('[role="button"]') ||
                                target.closest('input') ||
                                target.closest('textarea') ||
                                target.closest('select');
    
    // Don't process gesture if on interactive element
    if (isInteractiveElement) {
      if (config.debugMode) {
        console.log('Trackpad gesture on interactive element, ignoring');
      }
      return;
    }
    
    // Only process horizontal scrolling with improved logic
    const horizontalDominant = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const significantHorizontal = Math.abs(e.deltaX) > 20; // Reduced threshold for better sensitivity
    
    if (horizontalDominant && significantHorizontal) {
      if (config.debugMode) {
        console.log('Trackpad gesture detected, deltaX:', e.deltaX, 'deltaY:', e.deltaY);
      }
      
      if (config.preventScrollX) {
        e.preventDefault();
      }
      
      // We use deltaX in opposite direction because scroll right means go to previous page
      // and scroll left means go to next page in natural scrolling
      processSwipe(-e.deltaX);
    } else if (config.debugMode) {
      console.log('Wheel event ignored - deltaX:', e.deltaX, 'deltaY:', e.deltaY, 'horizontal dominant:', horizontalDominant, 'significant:', significantHorizontal);
    }
  }
  
  // Alternative trackpad detection using mouse events
  function setupAlternativeTrackpadMethod() {
    console.log('Setting up alternative trackpad method');
    
    // Mouse down - start tracking
    document.addEventListener('mousedown', function(e) {
      // Only trigger for left button
      if (e.button !== 0) return;
      
      // Check if the mouse is on an interactive element
      const target = e.target;
      const isInteractiveElement = target.closest('a') || 
                                  target.closest('button') || 
                                  target.closest('.service-branding-boxesarea') ||
                                  target.closest('.portfolio-boxarea') ||
                                  target.closest('[role="button"]');
      
      // If on an interactive element, don't track for gesture navigation
      if (isInteractiveElement) {
        mouseDownTime = 0;
        console.log('Mouse down on interactive element, ignoring for gesture navigation');
        return;
      }
      
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
      
      // Check if mouse moved over an interactive element
      const target = e.target;
      const isInteractiveElement = target.closest('a') || 
                                  target.closest('button') || 
                                  target.closest('.service-branding-boxesarea') ||
                                  target.closest('.portfolio-boxarea') ||
                                  target.closest('[role="button"]');
      
      // If over an interactive element during move, cancel the tracking
      if (isInteractiveElement) {
        mouseDownTime = 0;
        horizontalMovement = 0;
        mouseMoveCount = 0;
        console.log('Mouse moved over interactive element, cancelling gesture tracking');
        return;
      }
      
      // Calculate horizontal movement
      const deltaX = e.pageX - lastPageX;
      horizontalMovement += deltaX;
      lastPageX = e.pageX;
      mouseMoveCount++;
      
      // Check if this looks like a trackpad gesture
      // Trackpad gestures typically have many small movements
      if (mouseMoveCount > 3 && Math.abs(horizontalMovement) > 30) {
        isTrackpadGesture = true;
        if (config.debugMode) {
          console.log('Trackpad gesture detected via mouse events, movement:', horizontalMovement);
        }
      }
    });
    
    // Mouse up - check if it was a trackpad gesture
    document.addEventListener('mouseup', function(e) {
      if (!mouseDownTime) return;
      
      // Check if mouse up is on an interactive element
      const target = e.target;
      const isInteractiveElement = target.closest('a') || 
                                  target.closest('button') || 
                                  target.closest('.service-branding-boxesarea') ||
                                  target.closest('.portfolio-boxarea') ||
                                  target.closest('[role="button"]');
      
      // If ending on an interactive element, don't process as gesture
      if (isInteractiveElement) {
        mouseDownTime = 0;
        horizontalMovement = 0;
        mouseMoveCount = 0;
        console.log('Mouse up on interactive element, cancelling gesture');
        return;
      }
      
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
    if (config.debugMode) {
      console.log('processSwipe called with distance:', distance, 'minSwipeDistance:', config.minSwipeDistance);
    }
    
    if (Math.abs(distance) < config.minSwipeDistance) {
      if (config.debugMode) {
        console.log('Swipe distance too small, ignoring');
      }
      return;
    }
    
    console.log('Processing swipe, distance:', distance, 'navLinks:', navLinks); // Debug
    
    if (distance > 0) {
      // Swiped right - go to previous page
      if (navLinks.prev) {
        console.log('Navigating to previous page:', navLinks.prev);
        // Add a small delay to allow for visual feedback
        setTimeout(() => {
          window.location.href = navLinks.prev;
        }, 100);
      } else {
        console.log('No previous page available');
        showNavigationFeedback('No previous page available');
      }
    } else {
      // Swiped left - go to next page
      if (navLinks.next) {
        console.log('Navigating to next page:', navLinks.next);
        // Add a small delay to allow for visual feedback
        setTimeout(() => {
          window.location.href = navLinks.next;
        }, 100);
      } else {
        console.log('No next page available');
        showNavigationFeedback('No next page available');
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
    console.log('Initializing gesture navigation...');
    
    // Find the navigation links
    findNavigationLinks();
    
    // Log the final navigation state for debugging
    console.log('Gesture navigation initialization complete:');
    console.log('- Current page:', window.location.pathname);
    console.log('- Previous page:', navLinks.prev);
    console.log('- Next page:', navLinks.next);
    
    // Only set up event listeners if we have navigation links
    if (navLinks.next || navLinks.prev) {
      console.log('Setting up gesture event listeners...');
      
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
    } else {
      console.log('No navigation links available, gesture navigation disabled for this page');
    }
    
    console.log('Gesture navigation initialized with links:', navLinks);
  }
  
  // Start the initialization
  init();
}); 