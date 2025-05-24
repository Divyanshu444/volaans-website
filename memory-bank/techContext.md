# Technical Context: Volans Aqualie Website

## Development Stack

1. **Frontend Technologies**
   - HTML5 for markup structure
   - CSS3 for styling and animations
   - JavaScript/jQuery for interactivity
   - Bootstrap framework for responsive layout
   - FontAwesome for icon library

2. **Animation Libraries**
   - AOS (Animate On Scroll) for scroll-triggered animations
   - GSAP for advanced animations
   - Custom CSS animations and transitions

3. **JavaScript Plugins**
   - Owl Carousel for content sliders
   - Magnific Popup for lightbox functionality
   - Slick Slider for responsive sliders
   - Swiper Bundle for touch sliders
   - Nice Select for enhanced select boxes

## Development Environment

1. **Version Control**
   - Git-based version control system
   - PowerShell scripts for git operations (refresh_git.ps1)

2. **Editor/IDE**
   - VS Code configuration (.vscode directory)
   - HTML/CSS/JavaScript specific settings

3. **Build/Deployment Tools**
   - PowerShell scripts for content updates (update_navigation.ps1)
   - Manual file editing and deployment

## Technical Architecture

1. **Static Site Structure**
   - No server-side processing
   - HTML files as discrete pages
   - Common components shared via code duplication
   - CSS and JavaScript loaded from shared resources

2. **Asset Management**
   - Organized directory structure
   - Centralized CSS and JavaScript
   - Image optimization for performance
   - Video content (gefion.mp4)
   - PDF case studies and resources

3. **Performance Considerations**
   - Image optimization
   - CSS/JS minification 
   - Lazy loading where appropriate
   - Responsive image strategies

## Technical Constraints

1. **Static-only Content**
   - No database backend
   - Content changes require direct file edits
   - Form handling likely via third-party service

2. **Browser Compatibility**
   - Support for modern browsers
   - Responsive design for all screen sizes
   - Touch-friendly mobile interfaces

3. **Maintenance Process**
   - Direct HTML editing
   - Documentation in markdown files
   - Manual testing across browsers

## Technical Dependencies

1. **Third-party Libraries**
   - Bootstrap 4/5 for layout framework
   - jQuery 3.7.1 for DOM manipulation
   - Various animation and UI libraries

2. **Content Dependencies**
   - Fonts (likely web fonts)
   - Icons (FontAwesome)
   - External resources (if any)

3. **External Services**
   - Social media integration
   - Likely third-party form handling
   - Analytics (likely Google Analytics)

## Technical Documentation

1. **Content Management Guide**
   - Outlined in content_management_guide.md
   - Guidelines for updating text, images, services
   - SEO considerations

2. **Implementation Documentation**
   - Outlined in content_implementation.md
   - Details of recent content changes
   - Navigation structure in navigation_changes.md

3. **File Organization**
   - HTML files in root directory
   - Assets in organized subdirectories
   - Documentation in markdown files
   - Script files for automation 