/**
 * Test Gesture Support
 * This script tests the browser's support for various gesture events
 */

(function() {
  console.log('Testing gesture and event support...');
  
  // Create test container
  const testContainer = document.createElement('div');
  testContainer.id = 'gesture-test-container';
  testContainer.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    max-width: 350px;
    max-height: 300px;
    overflow-y: auto;
  `;
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: #333;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 3px 8px;
    font-size: 10px;
    cursor: pointer;
  `;
  closeButton.onclick = function() {
    testContainer.style.display = 'none';
    localStorage.setItem('gesture_test_closed', 'true');
  };
  
  // Check if user already closed this
  if (localStorage.getItem('gesture_test_closed')) {
    return;
  }
  
  testContainer.appendChild(closeButton);
  
  // Create test results section
  const resultsDiv = document.createElement('div');
  resultsDiv.id = 'gesture-test-results';
  testContainer.appendChild(resultsDiv);
  
  // Append to body
  document.body.appendChild(testContainer);
  
  // Add test result
  function addResult(test, result, details = '') {
    const resultElem = document.createElement('div');
    resultElem.innerHTML = `<strong>${test}:</strong> <span style="color: ${result ? '#8AFF8A' : '#FF8A8A'}">${result ? 'Supported' : 'Not supported'}</span> ${details}`;
    resultsDiv.appendChild(resultElem);
  }
  
  // Add event log
  function logEvent(type, event) {
    const logElem = document.createElement('div');
    logElem.style.cssText = `
      border-left: 2px solid #666;
      padding-left: 5px;
      margin: 5px 0;
      font-size: 10px;
    `;
    
    // Format event data
    let details = '';
    if (event.deltaX !== undefined) details += `deltaX: ${Math.round(event.deltaX)} `;
    if (event.deltaY !== undefined) details += `deltaY: ${Math.round(event.deltaY)} `;
    if (event.wheelDelta !== undefined) details += `wheelDelta: ${Math.round(event.wheelDelta)} `;
    if (event.detail !== undefined) details += `detail: ${event.detail} `;
    
    logElem.innerHTML = `<span style="color: #AAFFAA">${type}</span>: ${details}`;
    resultsDiv.appendChild(logElem);
    
    // Auto-scroll to bottom
    resultsDiv.scrollTop = resultsDiv.scrollHeight;
  }
  
  // Test features
  function runTests() {
    const div = document.createElement('div');
    
    // Test Passive Event Listener support
    let passiveSupported = false;
    try {
      const options = Object.defineProperty({}, 'passive', {
        get: function() {
          passiveSupported = true;
          return true;
        }
      });
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {
      passiveSupported = false;
    }
    addResult('Passive Events', passiveSupported);
    
    // Test wheel event
    addResult('Wheel Event', 'onwheel' in div);
    
    // Test mousewheel event
    addResult('MouseWheel Event', 'onmousewheel' in div);
    
    // Test DOMMouseScroll event (Firefox)
    addResult('DOMMouseScroll', typeof document.onDOMMouseScroll !== 'undefined');
    
    // Test touch events
    addResult('Touch Events', 'ontouchstart' in window);
    
    // Test horizontal scrolling
    const horizontalScrollSupported = 'deltaX' in new WheelEvent('wheel');
    addResult('Horizontal Scroll', horizontalScrollSupported);
    
    // Test preventDefault on wheel events
    let preventDefaultWorks = false;
    const testListener = function(e) {
      e.preventDefault();
      preventDefaultWorks = true;
    };
    document.addEventListener('wheel', testListener, { passive: false });
    // We can't actually test this without triggering a real wheel event
    addResult('preventDefault', 'Unknown (requires user interaction)');
    document.removeEventListener('wheel', testListener);
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Listen for wheel events
    document.addEventListener('wheel', function(e) {
      logEvent('wheel', e);
    }, { passive: true });
    
    // Listen for mousewheel events (older browsers)
    document.addEventListener('mousewheel', function(e) {
      logEvent('mousewheel', e);
    }, { passive: true });
    
    // Listen for DOMMouseScroll (Firefox)
    document.addEventListener('DOMMouseScroll', function(e) {
      logEvent('DOMMouseScroll', e);
    }, { passive: true });
    
    // Listen for touch events
    document.addEventListener('touchstart', function(e) {
      logEvent('touchstart', { deltaX: e.touches[0].clientX, deltaY: e.touches[0].clientY });
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
      logEvent('touchmove', { deltaX: e.touches[0].clientX, deltaY: e.touches[0].clientY });
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
      logEvent('touchend', { });
    }, { passive: true });
  }
  
  // Run tests
  runTests();
  setupEventListeners();
  
  // Add title
  const titleElem = document.createElement('div');
  titleElem.innerHTML = '<strong>Gesture Test Tool</strong><br>Move your trackpad/mouse or touch the screen to see events';
  titleElem.style.cssText = `
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #555;
    text-align: center;
  `;
  resultsDiv.insertBefore(titleElem, resultsDiv.firstChild);
  
  // Add instructions
  const instructionsElem = document.createElement('div');
  instructionsElem.innerHTML = 'Try swiping <strong>horizontally</strong> on your trackpad';
  instructionsElem.style.cssText = `
    margin: 10px 0;
    padding: 5px;
    background-color: #333;
    border-radius: 3px;
    text-align: center;
  `;
  resultsDiv.insertBefore(instructionsElem, titleElem.nextSibling);
})(); 