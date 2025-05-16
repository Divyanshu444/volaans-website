// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Load blog post based on ID
function loadBlogPost() {
    // Check if we're on the blog-single page
    if (window.location.pathname.includes('blog-single.html')) {
        const blogId = parseInt(getUrlParameter('id'));
        
        // If no ID is provided, default to the first blog post
        const postId = isNaN(blogId) ? 1 : blogId;
        
        // Find the blog post with matching ID
        const blogPost = blogData.find(post => post.id === postId);
        
        // If blog post found, update the page content
        if (blogPost) {
            // Update blog title in the document title
            document.title = `${blogPost.title} | Digital Agency`;
            
            // Update blog post title
            const titleElement = document.querySelector('.vl-blog-details-title');
            if (titleElement) {
                titleElement.textContent = blogPost.title;
            }
            
            // Update blog post metadata
            const dateElement = document.querySelector('.vl-blog-meta-date');
            if (dateElement) {
                dateElement.textContent = blogPost.date;
            }
            
            const authorElement = document.querySelector('.vl-blog-meta-author');
            if (authorElement) {
                authorElement.textContent = blogPost.author;
            }
            
            const categoryElement = document.querySelector('.vl-blog-meta-category');
            if (categoryElement) {
                categoryElement.textContent = blogPost.category;
            }
            
            // Update featured image
            const featuredImage = document.querySelector('.vl-blog-detail-img img');
            if (featuredImage) {
                featuredImage.src = blogPost.featuredImage;
                featuredImage.alt = blogPost.title;
            }
            
            // Update blog content
            const contentElement = document.querySelector('.vl-blog-details-text');
            if (contentElement) {
                contentElement.innerHTML = blogPost.content;
            }
            
            // Update tags
            const tagsContainer = document.querySelector('.vl-blog-details-tags');
            if (tagsContainer) {
                let tagsHTML = '';
                blogPost.tags.forEach(tag => {
                    tagsHTML += `<a href="blog.html?tag=${encodeURIComponent(tag)}">${tag}</a>`;
                });
                tagsContainer.innerHTML = tagsHTML;
            }
        }
    }
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadBlogPost); 