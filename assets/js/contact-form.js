document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData();
            formData.append('firstName', document.querySelector('input[placeholder="First Name*"]').value);
            formData.append('lastName', document.querySelector('input[placeholder="Last Name*"]').value);
            formData.append('phone', document.querySelector('input[placeholder="Phone Number*"]').value);
            formData.append('email', document.querySelector('input[placeholder="Email Address*"]').value);
            formData.append('serviceType', document.querySelector('input[placeholder="Service Type*"]').value);
            formData.append('message', document.querySelector('textarea[placeholder="Your Message"]').value);
            
            // Submit button
            const submitButton = document.querySelector('.vl-btn1[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Change button text while processing
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Send form data via AJAX
            fetch('process_form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show response message
                const messageElement = document.createElement('div');
                messageElement.className = data.success ? 'success-message' : 'error-message';
                messageElement.textContent = data.message;
                
                // Insert message after form
                contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
                
                // Reset form if successful
                if (data.success) {
                    contactForm.reset();
                }
                
                // Reset button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                // Remove message after 5 seconds
                setTimeout(() => {
                    messageElement.remove();
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Show error message
                const messageElement = document.createElement('div');
                messageElement.className = 'error-message';
                messageElement.textContent = 'An error occurred. Please try again later.';
                
                // Insert message after form
                contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
                
                // Reset button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                // Remove message after 5 seconds
                setTimeout(() => {
                    messageElement.remove();
                }, 5000);
            });
        });
    }
}); 