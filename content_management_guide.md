# Volans Aqualie Website Content Management Guide

## Introduction

This guide provides instructions for maintaining and updating content on the Volans Aqualie website. It covers the structure of the site, how to add or modify content, and best practices to ensure consistency.

## Website Structure

The website consists of the following main HTML pages:

1. `index.html` - Homepage
2. `about.html` - About Us page
3. `service.html` - Services overview page
4. Additional pages for blog, contact, portfolio, etc.

## Content Sections

### Homepage Sections
- Hero banner with animations
- Company overview
- Services showcase
- AI Services section (special highlight)
- Portfolio preview
- Process workflow
- Testimonials
- Call-to-action areas
- Footer

### About Page Sections
- Company profile
- Core capabilities (11 key services)
- Industries served
- Partners section
- Team profiles
- Call-to-action

### Services Page Sections
- Service categories
- AI Services (special section)
- Industries served
- Portfolio examples

## How to Update Content

### Updating Text Content

1. Locate the HTML file for the page you want to update
2. Look for the content within paragraph tags (`<p>`) or heading tags (`<h1>`, `<h2>`, etc.)
3. Modify the text while maintaining the HTML structure
4. Save the file and test the changes in a browser

### Updating Images

1. Prepare your new image with similar dimensions to the one being replaced
2. Save the new image in the appropriate folder under `assets/img/`
3. Update the image path in the HTML file:
   ```html
   <img src="assets/img/your-folder/your-image.png" alt="Descriptive text">
   ```

### Adding New Services

1. In the relevant section, duplicate an existing service box
2. Update the heading, description, icon, and links
3. Ensure consistent styling and spacing

### Updating AI Services Section

The AI Services section has a special design with gradient background. To update:

1. Locate the AI Services section in the HTML file
2. Modify the service titles and descriptions
3. Maintain the styling with proper colors and spacing

## Content Guidelines

### Brand Voice
- Professional and authoritative
- Forward-thinking and innovative
- Solutions-oriented
- Clear and concise

### Key Messaging
- Digital transformation expertise
- Measurable business value
- Innovative solutions
- Advanced AI capabilities

### Image Guidelines
- Use high-quality, professional images
- Maintain consistent style and color scheme
- Ensure proper compression for web performance
- Include descriptive alt text for accessibility

## SEO Considerations

- Keep page titles under 60 characters
- Use descriptive meta descriptions (150-160 characters)
- Include relevant keywords naturally in headings and content
- Ensure all images have descriptive alt text
- Use semantic HTML structure

## Technical Notes

- The website uses HTML5, CSS3, and JavaScript
- Animations are powered by GSAP/Lottie
- Responsive design works across devices
- Keep load time under 3 seconds for best performance

## Contact for Support

If you need assistance with content updates or have technical questions, contact:

- Technical support: tech@volansaqualie.com
- Content team: content@volansaqualie.com 