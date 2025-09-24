# Rainbow Spider Animation

This is a complete HTML5 canvas animation featuring a rainbow spider that crawls on a web. The animation uses a physics engine (VerletJS) to create realistic movement.

## Files Included:
- `index.html` - The main HTML file with the canvas element
- `script.js` - The complete JavaScript code with physics engine and animation

## How to Use on Your Website:

### Option 1: Direct Integration
1. Upload both files to your website
2. Open `index.html` in a web browser to see the animation
3. The canvas will automatically resize to fit the viewport

### Option 2: Embed in Existing Page
1. Copy the canvas element: `<canvas id="web"></canvas>`
2. Copy the script tag: `<script src="path/to/script.js"></script>`
3. Add the CSS styles to your page:
   ```css
   canvas {
     display: block;
   }
   ```

### Option 3: Iframe Embed
1. Upload the files to your server
2. Embed using an iframe:
   ```html
   <iframe src="path/to/index.html" width="100%" height="600" frameborder="0"></iframe>
   ```

## Features:
- Responsive canvas that adapts to screen size
- Interactive physics-based animation
- Rainbow color cycling effects
- Realistic spider movement with 8 legs
- Dynamic web structure

## Browser Compatibility:
- Modern browsers with HTML5 canvas support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (responsive design)
