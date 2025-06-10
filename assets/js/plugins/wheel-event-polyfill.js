/**
 * Wheel Event Polyfill
 * This polyfill normalizes mouse wheel behavior across different browsers
 */
(function() {
  // Feature detection for wheel event
  var supportsWheel = 'onwheel' in document.createElement('div');
  
  if (supportsWheel) {
    // Wheel event is natively supported, no need for polyfill
    console.log('Wheel event natively supported');
    return;
  }
  
  console.log('Adding wheel event polyfill');
  
  // Reasonable pixel distance for a single scroll step
  var PIXEL_STEP = 10;
  var LINE_HEIGHT = 40;
  var PAGE_HEIGHT = 800;

  // Normalize wheel event across browsers
  function normalizeWheel(event) {
    var sX = 0, sY = 0,      // spinX, spinY
        pX = 0, pY = 0;      // pixelX, pixelY

    // Legacy
    if ('detail' in event) { sY = event.detail; }
    if ('wheelDelta' in event) { sY = -event.wheelDelta / 120; }
    if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
    if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

    // Side scrolling on Firefox
    if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    // Calculate pixels
    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in event) { pY = event.deltaY; }
    if ('deltaX' in event) { pX = event.deltaX; }

    if ((pX || pY) && event.deltaMode) {
      if (event.deltaMode === 1) {         // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {                             // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Return normalized values
    return {
      deltaX: pX,
      deltaY: pY,
      spinX: sX,
      spinY: sY
    };
  }

  // Store event listeners for cleanup
  var wheelListeners = [];
  
  // Handle the event and call the user's callback
  function handleWheel(event) {
    event = event || window.event;
    
    // Don't act on every event - only those specifically bound to 'wheel'
    for (var i = 0; i < wheelListeners.length; i++) {
      var listener = wheelListeners[i];
      
      if (event.currentTarget === listener.element) {
        // Create a normalized event object
        var normalizedEvent = normalizeWheel(event);
        
        // Create a property to match the standard wheel event
        normalizedEvent.preventDefault = function() {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            event.returnValue = false;
          }
        };
        
        normalizedEvent.stopPropagation = function() {
          if (event.stopPropagation) {
            event.stopPropagation();
          } else {
            event.cancelBubble = true;
          }
        };
        
        // Add the original event as a property
        normalizedEvent.originalEvent = event;
        
        // Call the listener with normalized values
        listener.callback.call(listener.element, normalizedEvent);
      }
    }
  }

  // Replace the standard addEventListener for 'wheel' events
  var addEventListener = Element.prototype.addEventListener;
  var removeEventListener = Element.prototype.removeEventListener;
  
  Element.prototype.addEventListener = function(type, callback, options) {
    if (type === 'wheel') {
      var element = this;
      
      // Store the listener for cleanup
      wheelListeners.push({
        element: element,
        callback: callback
      });
      
      // Bind to mousewheel events which are more widely supported
      if ('onmousewheel' in document) {
        // Webkit and IE support
        addEventListener.call(element, 'mousewheel', handleWheel, options);
      } else {
        // Firefox supports DOMMouseScroll
        addEventListener.call(element, 'DOMMouseScroll', handleWheel, options);
      }
    } else {
      // For all other event types, use the standard method
      addEventListener.call(this, type, callback, options);
    }
  };
  
  Element.prototype.removeEventListener = function(type, callback, options) {
    if (type === 'wheel') {
      var element = this;
      
      // Remove from our tracking array
      for (var i = wheelListeners.length - 1; i >= 0; i--) {
        if (wheelListeners[i].element === element && 
            wheelListeners[i].callback === callback) {
          wheelListeners.splice(i, 1);
        }
      }
      
      // Remove the actual event listeners
      if ('onmousewheel' in document) {
        removeEventListener.call(element, 'mousewheel', handleWheel, options);
      } else {
        removeEventListener.call(element, 'DOMMouseScroll', handleWheel, options);
      }
    } else {
      // For all other event types, use the standard method
      removeEventListener.call(this, type, callback, options);
    }
  };
  
  // Also support document-level wheel listeners
  var docAddEventListener = Document.prototype.addEventListener;
  var docRemoveEventListener = Document.prototype.removeEventListener;
  
  Document.prototype.addEventListener = Element.prototype.addEventListener;
  Document.prototype.removeEventListener = Element.prototype.removeEventListener;
  
  console.log('Wheel event polyfill installed');
})(); 