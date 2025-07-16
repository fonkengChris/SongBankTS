import fs from "fs";

// Create a simple music note icon for SongLibrary using SVG
function createSVGIcon(size) {
  const scale = size / 512; // Base size for scaling
  const strokeWidth = Math.max(2, 8 * scale);
  const noteSize = 120 * scale;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="${size}" height="${size}" fill="url(#bg)" rx="${20 * scale}"/>
    
    <!-- Music note -->
    <g transform="translate(${size / 2}, ${size / 2})">
      <!-- Note head 1 -->
      <ellipse cx="${-noteSize / 3}" cy="${noteSize / 4}" rx="${
    noteSize / 6
  }" ry="${noteSize / 8}" fill="#ffffff"/>
      
      <!-- Stem -->
      <rect x="${-noteSize / 6 - strokeWidth / 2}" y="${
    noteSize / 4
  }" width="${strokeWidth}" height="${noteSize * 0.75}" fill="#ffffff"/>
      
      <!-- Note head 2 -->
      <ellipse cx="${noteSize / 3}" cy="${-noteSize / 3}" rx="${
    noteSize / 6
  }" ry="${noteSize / 8}" fill="#ffffff"/>
      
      <!-- Staff lines -->
      <g stroke="#4a90e2" stroke-width="${Math.max(1, 2 * scale)}" fill="none">
        ${[0, 1, 2, 3, 4]
          .map((i) => {
            const y = ((i - 2) * noteSize) / 8;
            return `<line x1="${-noteSize}" y1="${y}" x2="${noteSize}" y2="${y}"/>`;
          })
          .join("")}
      </g>
    </g>
  </svg>`;
}

// Create PNG-like icons using SVG (for simplicity)
function createPNGIcon(size) {
  const svg = createSVGIcon(size);
  // For now, we'll create SVG files with PNG names
  // In a real implementation, you'd convert SVG to PNG
  return svg;
}

// Generate all required icons
const icons = [
  { name: "pwa-192x192.png", size: 192 },
  { name: "pwa-512x512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-16x16.png", size: 16 },
];

console.log("Generating PWA icons...");

// Ensure public directory exists
if (!fs.existsSync("public")) {
  fs.mkdirSync("public");
}

icons.forEach((icon) => {
  const svgContent = createPNGIcon(icon.size);
  // For now, save as SVG with PNG extension (will work for most PWA purposes)
  fs.writeFileSync(`public/${icon.name}`, svgContent);
  console.log(`Generated ${icon.name}`);
});

// Create a proper masked icon SVG
const maskedIcon = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <mask id="mask">
      <rect width="16" height="16" fill="white"/>
      <circle cx="8" cy="8" r="6" fill="black"/>
    </mask>
  </defs>
  <rect width="16" height="16" fill="#000000" mask="url(#mask)"/>
  <circle cx="8" cy="8" r="6" fill="#ffffff"/>
</svg>`;

fs.writeFileSync("public/masked-icon.svg", maskedIcon);
console.log("Generated masked-icon.svg");

// Create a favicon.ico equivalent (SVG)
const favicon = createSVGIcon(32);
fs.writeFileSync("public/favicon.ico", favicon);
console.log("Generated favicon.ico");

console.log("All PWA icons generated successfully!");
console.log(
  "Note: Icons are generated as SVG files with PNG extensions for simplicity."
);
console.log(
  "For production, consider converting these to actual PNG files using an image processing tool."
);
