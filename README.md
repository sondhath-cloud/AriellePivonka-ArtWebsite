# Arielle Pivonka - Artist Portfolio Website

A sophisticated, ultra-modern artist portfolio website featuring glassmorphism design, smooth animations, and interactive elements.

## 🎨 Features

- **Ultra-modern glassmorphism design** with sophisticated black/gray/white color scheme
- **Smooth animations and hover effects** throughout the site
- **Responsive design** optimized for all devices
- **Interactive portfolio gallery** with filtering capabilities
- **Secure contact forms** with PHP backend
- **Commission request system** for custom artwork
- **Modern typography** using Inter font family
- **SEO optimized** with proper meta tags and structure

## 🚀 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Styling**: Custom CSS with glassmorphism effects
- **Fonts**: Inter font family from Google Fonts
- **Hosting**: Compatible with SiteWorks shared hosting

## 📁 Project Structure

```
AriellePivonka-Art-Website/
├── index.html              # Main website structure
├── styles.css              # Sophisticated CSS styling
├── script.js               # Interactive JavaScript
├── contact.php              # Contact form handler
├── commission.php          # Commission request handler
├── database_setup.sql      # MySQL database structure
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## 🛠️ Installation & Setup

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sondhath-cloud/AriellePivonka-ArtWebsite.git
   cd AriellePivonka-Art-Website
   ```

2. **Start local server**
   ```bash
   python3 -m http.server 8001
   ```

3. **View website**
   Open `http://localhost:8001` in your browser

### Production Deployment (SiteWorks Hosting)

1. **Upload files** to your `public_html` directory
2. **Create MySQL database** using phpMyAdmin
3. **Run database setup**
   ```sql
   -- Import database_setup.sql in phpMyAdmin
   ```
4. **Update configuration**
   - Edit `contact.php` and `commission.php`
   - Update database credentials
   - Update email addresses
5. **Test forms** to ensure proper functionality

## 🎯 Key Sections

### Hero Section
- Immersive landing with smooth animations
- Call-to-action buttons for portfolio and commissions
- Scroll indicator with bounce animation

### Portfolio Gallery
- Filterable artwork showcase
- Hover effects with overlay information
- Modal popups for detailed artwork views
- Categories: Paintings, Drawings, Mixed Media

### About Artist
- Professional presentation with statistics
- Responsive grid layout
- Glassmorphism cards with hover effects

### Commission Request
- Specialized form for custom artwork
- Medium selection and size specifications
- Detailed project description area
- Auto-reply email system

### Contact Form
- Secure contact system with validation
- Spam protection and rate limiting
- Professional email notifications
- Auto-reply functionality

## 🎨 Design Features

- **Glassmorphism Effects**: Translucent cards with backdrop blur
- **Smooth Animations**: CSS transitions and JavaScript animations
- **Modern Typography**: Inter font family with proper scaling
- **Responsive Grid**: CSS Grid and Flexbox layouts
- **Interactive Elements**: Hover states and smooth transitions
- **Accessibility**: Proper focus states and semantic HTML

## 🔧 Customization

### Colors
Update CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #1a1a1a;
    --secondary-color: #2a2a2a;
    --accent-color: #ffffff;
    /* ... other variables */
}
```

### Content
- Update artist information in `index.html`
- Replace placeholder images with actual artwork
- Modify contact details and social media links
- Customize commission options and pricing

### Database
- Modify `database_setup.sql` for additional fields
- Update PHP files for new database structure
- Add artwork management features

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Features

- Input sanitization and validation
- CSRF protection
- Rate limiting for forms
- Spam detection (honeypot)
- SQL injection prevention
- XSS protection

## 📧 Email Configuration

The website uses PHP's `mail()` function compatible with SiteWorks hosting:

- **Contact Form**: Sends to artist's email with auto-reply
- **Commission Requests**: Priority notifications with detailed information
- **Professional Templates**: HTML email formatting
- **Spam Protection**: Rate limiting and validation

## 🚀 Performance

- **Optimized Images**: Lazy loading for portfolio images
- **Minified Assets**: Compressed CSS and JavaScript
- **Efficient Animations**: Hardware-accelerated CSS transitions
- **Responsive Images**: Proper sizing for different devices
- **Fast Loading**: Optimized for SiteWorks shared hosting

## 📝 License

This project is created for Arielle Pivonka's artist portfolio. All rights reserved.

## 👨‍💻 Developer

Created with ❤️ for showcasing contemporary art in a modern, sophisticated way.

---

**Live Demo**: [View Website](http://localhost:8002) (when running locally)

**GitHub**: [sondhath-cloud/AriellePivonka-ArtWebsite](https://github.com/sondhath-cloud/AriellePivonka-ArtWebsite)
