import fs from "fs";
import path from "path";

// Function to create a copy of songBankLogo.png with different names for PWA
function copyLogoAsIcon(iconName, sourceLogo = "songBankLogo.png") {
  const sourcePath = path.join("public", sourceLogo);
  const targetPath = path.join("public", iconName);
  
  try {
    // Check if source logo exists
    if (!fs.existsSync(sourcePath)) {
      console.warn(`Warning: ${sourceLogo} not found in public directory`);
      return false;
    }
    
    // Copy the logo file
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Generated ${iconName} from ${sourceLogo}`);
    return true;
  } catch (error) {
    console.error(`Error generating ${iconName}:`, error.message);
    return false;
  }
}

// Generate all required PWA icons from songBankLogo.png
const icons = [
  { name: "pwa-192x192.png", size: 192 },
  { name: "pwa-512x512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-16x16.png", size: 16 },
];

console.log("Generating PWA icons from songBankLogo.png...");

// Ensure public directory exists
if (!fs.existsSync("public")) {
  fs.mkdirSync("public");
}

// Check if songBankLogo.png exists
const logoPath = path.join("public", "songBankLogo.png");
if (!fs.existsSync(logoPath)) {
  console.error("Error: songBankLogo.png not found in public directory");
  console.log("Please ensure songBankLogo.png is present in the public folder");
  process.exit(1);
}

// Generate all icons by copying songBankLogo.png
let successCount = 0;
icons.forEach((icon) => {
  if (copyLogoAsIcon(icon.name)) {
    successCount++;
  }
});

// Create a proper masked icon SVG for PWA maskable icons
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

// Create a favicon.ico equivalent by copying songBankLogo.png
if (copyLogoAsIcon("favicon.ico")) {
  successCount++;
}

console.log(`\nPWA icon generation complete!`);
console.log(`Successfully generated ${successCount} out of ${icons.length + 1} icons from songBankLogo.png`);
console.log(`\nNote: All icons are now based on your songBankLogo.png file.`);
console.log(`For optimal PWA experience, consider creating properly sized versions of your logo:`);
console.log(`- 192x192 for standard PWA icons`);
console.log(`- 512x512 for high-resolution displays`);
console.log(`- 180x180 for Apple devices`);
console.log(`- 32x32 and 16x16 for favicons`);
