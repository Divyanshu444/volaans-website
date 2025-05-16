// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Get random items from array
function getRandomItems(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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
                    tagsHTML += `<a href="blog.html?tag=${encodeURIComponent(tag)}">#${tag}</a>`;
                });
                tagsContainer.innerHTML = tagsHTML;
            }

            // Load recent posts in sidebar (3 random posts excluding current)
            loadRecentPosts(blogPost.id);

            // Load related posts in "read more latest blog" section
            loadRelatedPosts(blogPost.id, blogPost.category, blogPost.tags);
        }
    }
}

// Load recent posts in sidebar
function loadRecentPosts(currentPostId) {
    const recentPostsContainer = document.querySelector('.recent-posts');
    
    if (recentPostsContainer) {
        // Get posts other than the current one
        const otherPosts = blogData.filter(post => post.id !== currentPostId);
        // Get 3 random posts
        const recentPosts = getRandomItems(otherPosts, 3);
        
        // Clear existing content except the heading
        const heading = recentPostsContainer.querySelector('h3');
        recentPostsContainer.innerHTML = '';
        recentPostsContainer.appendChild(heading);
        
        // Add space after heading
        const spaceDiv = document.createElement('div');
        spaceDiv.className = 'space32';
        recentPostsContainer.appendChild(spaceDiv);
        
        // Add each recent post
        recentPosts.forEach(post => {
            const postHTML = `
                <div class="img1">
                    <img src="${post.featuredImage}" alt="${post.title}">
                </div>
                <div class="space24"></div>
                <div class="content-area">
                    <ul>
                        <li><a href="#"><img src="assets/img/icons/date1.svg" alt="">${post.date}</a></li>
                    </ul>
                    <div class="space14"></div>
                    <a href="blog-single.html?id=${post.id}">${post.title}</a>
                    <div class="space20"></div>
                    <a href="blog-single.html?id=${post.id}" class="readmore">Learn More <i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <div class="space30"></div>
            `;
            
            // Create a temporary div to hold the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = postHTML;
            
            // Append each child to the container
            while (tempDiv.firstChild) {
                recentPostsContainer.appendChild(tempDiv.firstChild);
            }
        });
    }
}

// Load related posts in "read more latest blog" section
function loadRelatedPosts(currentPostId, category, tags) {
    const relatedPostsContainer = document.querySelector('.vl-blog-1-area .row:not(:first-child)');
    
    if (relatedPostsContainer) {
        // Find related posts (same category or shared tags)
        const relatedPosts = blogData.filter(post => {
            if (post.id === currentPostId) return false; // Exclude current post
            
            // Check if same category or has shared tags
            const sameCategory = post.category === category;
            const sharedTags = post.tags.some(tag => tags.includes(tag));
            
            return sameCategory || sharedTags;
        });
        
        // If not enough related posts, just get random ones
        let postsToShow = relatedPosts.length >= 3 ? relatedPosts.slice(0, 3) : getRandomItems(blogData.filter(post => post.id !== currentPostId), 3);
        
        // Clear existing posts
        relatedPostsContainer.innerHTML = '';
        
        // Add related posts
        postsToShow.forEach(post => {
            const postHTML = `
                <div class="col-lg-4 col-md-6">
                    <div class="vl-blog-1-item">
                        <div class="vl-blog-1-thumb image-anime">
                            <img src="${post.featuredImage}" alt="${post.title}">
                        </div>
                        <div class="vl-blog-1-content">
                            <div class="vl-blog-meta">
                                <ul>
                                    <li><a href="#"><img src="assets/img/icons/date1.svg" alt=""> ${post.date}</a></li>
                                    <li><a href="#"><img src="assets/img/icons/user1.svg" alt=""> By ${post.author}</a></li>
                                </ul>
                            </div>
                            <div class="space14"></div>
                            <h4 class="vl-blog-1-title"><a href="blog-single.html?id=${post.id}">${post.title}</a></h4>
                            <div class="space20"></div>
                            <div class="vl-blog-1-icon">
                                <a href="blog-single.html?id=${post.id}">Learn More <i class="fa-solid fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Append to container
            relatedPostsContainer.innerHTML += postHTML;
        });
    }
}

// Update blog category tags in sidebar
function loadBlogCategories() {
    const categoriesContainer = document.querySelector('.blog-category2 ul:first-child');
    if (categoriesContainer) {
        // Get unique categories and count
        const categories = {};
        blogData.forEach(post => {
            if (categories[post.category]) {
                categories[post.category]++;
            } else {
                categories[post.category] = 1;
            }
        });
        
        // Clear container
        categoriesContainer.innerHTML = '';
        
        // Add category tags
        Object.entries(categories).forEach(([category, count]) => {
            const categoryTag = document.createElement('li');
            categoryTag.innerHTML = `<a href="blog.html?category=${encodeURIComponent(category)}">#${category}</a>`;
            categoriesContainer.appendChild(categoryTag);
        });
    }
    
    // Also update the main category list in the sidebar
    const mainCategoriesContainer = document.querySelector('.dynamic-categories');
    if (mainCategoriesContainer) {
        // Get categories with count
        const categories = {};
        blogData.forEach(post => {
            if (categories[post.category]) {
                categories[post.category]++;
            } else {
                categories[post.category] = 1;
            }
        });
        
        // Clear container
        mainCategoriesContainer.innerHTML = '';
        
        // Add category items
        Object.entries(categories).forEach(([category, count]) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="blog.html?category=${encodeURIComponent(category)}">${category} (${count})<i class="fa-solid fa-angle-right"></i></a>`;
            mainCategoriesContainer.appendChild(li);
        });
    }
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPost();
    loadBlogCategories();
}); 