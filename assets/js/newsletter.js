/**
 * Newsletter subscription handler
 * Provides both server-side storage and localStorage fallback
 */
function initializeNewsletterSubscription() {
    const newsletterForms = document.querySelectorAll('form[id="newsletterForm"]');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the input field (could be different IDs in different forms)
            const emailInput = this.querySelector('input[type="email"]') || this.querySelector('input[placeholder="Email"]');
            
            if (!emailInput) {
                console.error('Email input field not found');
                return;
            }
            
            const email = emailInput.value.trim();
            
            if (email === '') {
                alert('Please enter your email address');
                return;
            }
            
            // Validate email format with simple regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Option 1: Using AJAX to send to PHP script (if server-side available)
            if (window.fetch) {
                const formData = new FormData();
                formData.append('email', email);
                
                fetch('subscribe.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    showSuccessMessage();
                    emailInput.value = '';
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Fallback to localStorage if server request fails
                    saveEmailToLocalStorage(email);
                    showSuccessMessage();
                    emailInput.value = '';
                });
            } else {
                // Option 2: Fallback for browsers without fetch - use localStorage
                saveEmailToLocalStorage(email);
                showSuccessMessage();
                emailInput.value = '';
            }
        });
    });
}

/**
 * Save email to localStorage as a fallback
 */
function saveEmailToLocalStorage(email) {
    try {
        // Get existing subscribers or initialize empty array
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        
        // Add new subscriber with timestamp
        subscribers.push({
            email: email,
            date: new Date().toISOString()
        });
        
        // Save back to localStorage
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        
        console.log('Email saved to localStorage:', email);
        return true;
    } catch (error) {
        console.error('Failed to save email to localStorage:', error);
        return false;
    }
}

/**
 * Show success message to user
 */
function showSuccessMessage() {
    alert('Thanks for subscribing to our newsletter!');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeNewsletterSubscription); 