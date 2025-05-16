// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to filter and display blog posts
function filterAndDisplayBlogPosts() {
    // Check if we're on the blog listing page
    if (window.location.pathname.includes('blog.html')) {
        const category = getUrlParameter('category');
        const tag = getUrlParameter('tag');
        
        // If no filters are applied, no need to do anything
        if (!category && !tag) return;
        
        // Find the posts container
        const postsContainer = document.querySelector('.vl-blog-1-area .container .row:not(:first-child)');
        if (!postsContainer) return;
        
        // Filter the blog posts based on category or tag
        let filteredPosts = blogData;
        
        if (category) {
            filteredPosts = filteredPosts.filter(post => post.category === category);
            // Update page title
            document.title = `${category} Blog Posts | Digital Agency`;
            // Add filter indication
            const headingContainer = document.querySelector('.vl-blog-1-section-box h2');
            if (headingContainer) {
                headingContainer.textContent = `Category: ${category}`;
            }
        }
        
        if (tag) {
            filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
            // Update page title
            document.title = `${tag} Blog Posts | Digital Agency`;
            // Add filter indication
            const headingContainer = document.querySelector('.vl-blog-1-section-box h2');
            if (headingContainer) {
                headingContainer.textContent = `Tag: ${tag}`;
            }
        }
        
        // Clear existing posts
        postsContainer.innerHTML = '';
        
        // If no posts match the filter
        if (filteredPosts.length === 0) {
            postsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <h3>No posts found matching your criteria.</h3>
                    <div class="space20"></div>
                    <a href="blog.html" class="vl-btn1">View All Posts</a>
                </div>
            `;
            return;
        }
        
        // Display filtered posts
        filteredPosts.forEach(post => {
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
            
            postsContainer.innerHTML += postHTML;
        });
        
        // Add a "Clear Filter" button
        postsContainer.innerHTML += `
            <div class="col-12 text-center">
                <div class="space40"></div>
                <a href="blog.html" class="vl-btn1">Clear Filter</a>
                <div class="space20"></div>
            </div>
        `;
    }
}

// Run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', filterAndDisplayBlogPosts); 