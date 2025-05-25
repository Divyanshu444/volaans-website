# System Patterns: Volans Aqualie Website

## Website Architecture
The Volans Aqualie website is built as a static HTML website with modern frontend technologies and follows these architectural patterns:

1. **Component-Based Structure**
   - Header component reused across all pages
   - Footer component reused across all pages
   - Sidebar/mobile menu component 
   - Service cards as reusable components
   - Industry section as a repeatable pattern

2. **Page Organization**
   - Consistent page structure across the site
   - Standard sections (hero, content, CTA, related content)
   - Self-contained HTML files with shared assets

3. **Asset Organization**
   - CSS files in assets/css/
   - JavaScript files in assets/js/
   - Images in assets/img/
   - Plugin files properly separated

## Design Patterns

1. **Resource Loading**
   - CSS files loaded in the head
   - JavaScript files loaded at the end of the body
   - Preloader for initial page loading
   - Lazy loading for images

2. **User Interface Patterns**
   - Card-based content presentation
   - Grid layouts for services and portfolio
   - Hamburger menu for mobile navigation
   - Sticky header on scroll
   - Back-to-top functionality

3. **Animation Patterns**
   - Fade-in animations on scroll (AOS)
   - Hover effects on interactive elements
   - Transition effects between states
   - Parallax backgrounds in some sections
   - Loading animations

4. **Navigation Patterns**
   - Primary navigation in header
   - Secondary navigation in footer
   - Social links in sidebar and footer
   - Breadcrumbs on inner pages
   - Call-to-action buttons

## Coding Patterns

1. **HTML Structure**
   - Semantic HTML5 tags (header, footer, section, etc.)
   - Clear class naming conventions
   - Proper nesting of elements
   - Consistent indentation
   - Commented section breaks

2. **CSS Organization**
   - Plugin CSS files loaded first
   - Main CSS file for global styles
   - Custom CSS for page-specific styles
   - Mobile-specific CSS for responsive design
   - Industry-specific CSS for specialized sections

3. **JavaScript Usage**
   - jQuery for DOM manipulation
   - Plugin initialization in a consistent pattern
   - Event handling for interactive elements
   - Animation control
   - Form validation

## Responsive Design

1. **Multi-Device Support**
   - Mobile-first approach
   - Breakpoints for different device sizes
   - Specific mobile optimizations
   - Touch-friendly elements

2. **Performance Optimization**
   - Compressed images
   - Minified CSS and JavaScript
   - Efficient loading order
   - Careful use of animations to avoid performance issues

## Content Management

1. **Update Process**
   - HTML files updated directly
   - PowerShell scripts for automation (update_navigation.ps1, refresh_git.ps1)
   - Documentation in markdown files (navigation_changes.md, content_implementation.md)
   - Git-based version control 