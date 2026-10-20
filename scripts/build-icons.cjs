const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Premium App Icon (512x512) - Bold, Iconic, Perfect for Mobile Home Screens
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient (Guncheong Indigo Slate) -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D3E50"/>
      <stop offset="50%" stop-color="#1B2836"/>
      <stop offset="100%" stop-color="#0F1722"/>
    </linearGradient>

    <!-- Jewel Box Body (Korean Traditional Black/Dark Teal Lacquerware) -->
    <linearGradient id="lacquer" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#243342"/>
      <stop offset="45%" stop-color="#182430"/>
      <stop offset="100%" stop-color="#0E161F"/>
    </linearGradient>

    <!-- Mother-of-Pearl (Najeon) Inlay Shimmer (뇌록 & 주홍 빛깔) -->
    <linearGradient id="najeon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3D836E"/>
      <stop offset="25%" stop-color="#5EBAA0"/>
      <stop offset="50%" stop-color="#A7E8D6"/>
      <stop offset="75%" stop-color="#E87C65"/>
      <stop offset="100%" stop-color="#3D836E"/>
    </linearGradient>

    <!-- Korean Brass Hardware Gold Gradient (황금 장석) -->
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3C4"/>
      <stop offset="30%" stop-color="#F3CA65"/>
      <stop offset="70%" stop-color="#BF8D24"/>
      <stop offset="100%" stop-color="#785307"/>
    </linearGradient>

    <!-- Brilliant Diamond Facet Gradients -->
    <linearGradient id="gemTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#CBEBFE"/>
    </linearGradient>
    <linearGradient id="gemLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7DD3FC"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="gemRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </linearGradient>
    <linearGradient id="gemCenter" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0F9FF"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>

    <!-- Radiant Glow Filter -->
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Squircle App Icon Base -->
  <rect width="512" height="512" rx="116" fill="url(#bg)"/>

  <!-- Subtle Inner Border Highlight -->
  <rect x="5" y="5" width="502" height="502" rx="112" fill="none" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="2.5"/>

  <!-- Subtle Dancheong Cloud Texture -->
  <path d="M 50 140 Q 80 110 115 130 Q 140 100 175 125" fill="none" stroke="#3D836E" stroke-width="3" stroke-opacity="0.25" stroke-linecap="round"/>
  <path d="M 337 400 Q 372 375 407 395 Q 432 370 462 390" fill="none" stroke="#DF684E" stroke-width="3" stroke-opacity="0.22" stroke-linecap="round"/>

  <!-- RADIANT GEM LIGHT RAYS -->
  <g filter="url(#glow)">
    <circle cx="256" cy="185" r="95" fill="#38BDF8" fill-opacity="0.25"/>
    <circle cx="256" cy="185" r="50" fill="#FFFFFF" fill-opacity="0.4"/>
    <line x1="256" y1="85" x2="256" y2="45" stroke="#FDE047" stroke-width="4.5" stroke-linecap="round" stroke-opacity="0.8"/>
    <line x1="165" y1="125" x2="135" y2="95" stroke="#FDE047" stroke-width="4" stroke-linecap="round" stroke-opacity="0.7"/>
    <line x1="347" y1="125" x2="377" y2="95" stroke="#FDE047" stroke-width="4" stroke-linecap="round" stroke-opacity="0.7"/>
    <line x1="120" y1="185" x2="85" y2="185" stroke="#FDE047" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.6"/>
    <line x1="392" y1="185" x2="427" y2="185" stroke="#FDE047" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.6"/>
  </g>

  <!-- OPEN CHEST LID (Angled Upward Behind Jewel) -->
  <g filter="url(#softShadow)">
    <path d="M 108 240 L 140 145 C 145 132 158 125 172 125 L 340 125 C 354 125 367 132 372 145 L 404 240 L 380 250 L 132 250 Z" fill="url(#lacquer)"/>
    <!-- Lid Interior Rim -->
    <path d="M 140 145 L 372 145 L 364 158 L 148 158 Z" fill="url(#najeon)"/>
  </g>

  <!-- THE GLOWING JEWEL (Prominent Diamond in Front of Lid, Above Chest) -->
  <g transform="translate(256, 185) scale(1.35)" filter="url(#glow)">
    <!-- Top table facet -->
    <polygon points="0,-45 36,-22 0,-12 -36,-22" fill="url(#gemTop)"/>
    <!-- Upper facets -->
    <polygon points="-36,-22 0,-12 -18,12 -46,0" fill="url(#gemLeft)"/>
    <polygon points="0,-12 36,-22 46,0 18,12" fill="url(#gemRight)"/>
    <polygon points="0,-12 18,12 0,42 -18,12" fill="url(#gemCenter)"/>
    <!-- Lower point facets -->
    <polygon points="-46,0 -18,12 0,55" fill="#0369A1"/>
    <polygon points="46,0 18,12 0,55" fill="#075985"/>
    <polygon points="-18,12 18,12 0,55" fill="#38BDF8" fill-opacity="0.95"/>

    <!-- Taegeuk Iridescence Core (Korean Heritage) -->
    <circle cx="-6" cy="10" r="5" fill="#EF4444" fill-opacity="0.95"/>
    <circle cx="6" cy="10" r="5" fill="#2563EB" fill-opacity="0.95"/>

    <!-- Sparkle Stars -->
    <polygon points="40,-35 44,-23 56,-19 44,-15 40,-3 36,-15 24,-19 36,-23" fill="#FFFFFF"/>
    <polygon points="-42,-8 -39,1 -29,4 -39,7 -42,16 -45,7 -55,4 -45,1" fill="#FFFBEB"/>
  </g>

  <!-- JEWEL BOX MAIN BODY (Front Chest) -->
  <g filter="url(#softShadow)">
    <rect x="96" y="246" width="320" height="175" rx="20" fill="url(#lacquer)"/>

    <!-- Inlaid Mother-of-Pearl Bands (Top & Bottom Najeon Rims) -->
    <rect x="96" y="246" width="320" height="14" rx="7" fill="url(#najeon)"/>
    <rect x="96" y="407" width="320" height="14" rx="7" fill="url(#najeon)"/>

    <!-- Traditional Decorative Floral Medallions (자개 꽃 문양) -->
    <circle cx="156" cy="333" r="16" fill="url(#najeon)" fill-opacity="0.5"/>
    <circle cx="156" cy="333" r="8" fill="url(#gold)"/>
    <circle cx="356" cy="333" r="16" fill="url(#najeon)" fill-opacity="0.5"/>
    <circle cx="356" cy="333" r="8" fill="url(#gold)"/>

    <!-- Traditional Korean Brass Corner Protectors (귀장석) -->
    <!-- Top-Left -->
    <polygon points="96,246 134,246 134,256 106,256 106,284 96,284" fill="url(#gold)"/>
    <!-- Top-Right -->
    <polygon points="416,246 378,246 378,256 406,256 406,284 416,284" fill="url(#gold)"/>
    <!-- Bottom-Left -->
    <polygon points="96,421 134,421 134,411 106,411 106,383 96,383" fill="url(#gold)"/>
    <!-- Bottom-Right -->
    <polygon points="416,421 378,421 378,411 406,411 406,383 416,383" fill="url(#gold)"/>

    <!-- Center Brass Lock Clasp (나비형 전통 자물쇠) -->
    <g transform="translate(256, 310)">
      <!-- Gold Backplate -->
      <circle cx="0" cy="0" r="32" fill="url(#gold)" filter="url(#softShadow)"/>
      <circle cx="0" cy="0" r="25" fill="#8C620C"/>
      <circle cx="0" cy="0" r="20" fill="url(#gold)"/>
      <!-- Keyhole -->
      <circle cx="0" cy="-3" r="6" fill="#1B2836"/>
      <polygon points="-3,-2 3,-2 4,9 -4,9" fill="#1B2836"/>
      <!-- Hanging Padlock Plate -->
      <rect x="-9" y="19" width="18" height="26" rx="5" fill="url(#gold)"/>
      <circle cx="0" cy="32" r="3.5" fill="#1B2836"/>
    </g>
  </g>
</svg>`;

// Maskable Icon (Full-bleed background with 20% safe zone padding)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D3E50"/>
      <stop offset="50%" stop-color="#1B2836"/>
      <stop offset="100%" stop-color="#0F1722"/>
    </linearGradient>
    <linearGradient id="lacquerM" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#243342"/>
      <stop offset="45%" stop-color="#182430"/>
      <stop offset="100%" stop-color="#0E161F"/>
    </linearGradient>
    <linearGradient id="najeonM" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3D836E"/>
      <stop offset="25%" stop-color="#5EBAA0"/>
      <stop offset="50%" stop-color="#A7E8D6"/>
      <stop offset="75%" stop-color="#E87C65"/>
      <stop offset="100%" stop-color="#3D836E"/>
    </linearGradient>
    <linearGradient id="goldM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3C4"/>
      <stop offset="30%" stop-color="#F3CA65"/>
      <stop offset="70%" stop-color="#BF8D24"/>
      <stop offset="100%" stop-color="#785307"/>
    </linearGradient>
    <linearGradient id="gemTopM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#CBEBFE"/>
    </linearGradient>
    <linearGradient id="gemLeftM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7DD3FC"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="gemRightM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </linearGradient>
    <linearGradient id="gemCenterM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0F9FF"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
    <filter id="glowM" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="softShadowM" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Edge-to-edge background for Android circle/squircle masking -->
  <rect width="512" height="512" fill="url(#bgM)"/>

  <!-- Centered & Scaled to 74% (Safe inside circle mask) -->
  <g transform="translate(256, 256) scale(0.74) translate(-256, -256)">
    <g filter="url(#glowM)">
      <circle cx="256" cy="185" r="95" fill="#38BDF8" fill-opacity="0.25"/>
      <circle cx="256" cy="185" r="50" fill="#FFFFFF" fill-opacity="0.4"/>
      <line x1="256" y1="85" x2="256" y2="45" stroke="#FDE047" stroke-width="4.5" stroke-linecap="round" stroke-opacity="0.8"/>
      <line x1="165" y1="125" x2="135" y2="95" stroke="#FDE047" stroke-width="4" stroke-linecap="round" stroke-opacity="0.7"/>
      <line x1="347" y1="125" x2="377" y2="95" stroke="#FDE047" stroke-width="4" stroke-linecap="round" stroke-opacity="0.7"/>
    </g>

    <g filter="url(#softShadowM)">
      <path d="M 108 240 L 140 145 C 145 132 158 125 172 125 L 340 125 C 354 125 367 132 372 145 L 404 240 L 380 250 L 132 250 Z" fill="url(#lacquerM)"/>
      <path d="M 140 145 L 372 145 L 364 158 L 148 158 Z" fill="url(#najeonM)"/>
    </g>

    <g transform="translate(256, 185) scale(1.35)" filter="url(#glowM)">
      <polygon points="0,-45 36,-22 0,-12 -36,-22" fill="url(#gemTopM)"/>
      <polygon points="-36,-22 0,-12 -18,12 -46,0" fill="url(#gemLeftM)"/>
      <polygon points="0,-12 36,-22 46,0 18,12" fill="url(#gemRightM)"/>
      <polygon points="0,-12 18,12 0,42 -18,12" fill="url(#gemCenterM)"/>
      <polygon points="-46,0 -18,12 0,55" fill="#0369A1"/>
      <polygon points="46,0 18,12 0,55" fill="#075985"/>
      <polygon points="-18,12 18,12 0,55" fill="#38BDF8" fill-opacity="0.95"/>
      <circle cx="-6" cy="10" r="5" fill="#EF4444" fill-opacity="0.95"/>
      <circle cx="6" cy="10" r="5" fill="#2563EB" fill-opacity="0.95"/>
      <polygon points="40,-35 44,-23 56,-19 44,-15 40,-3 36,-15 24,-19 36,-23" fill="#FFFFFF"/>
      <polygon points="-42,-8 -39,1 -29,4 -39,7 -42,16 -45,7 -55,4 -45,1" fill="#FFFBEB"/>
    </g>

    <g filter="url(#softShadowM)">
      <rect x="96" y="246" width="320" height="175" rx="20" fill="url(#lacquerM)"/>
      <rect x="96" y="246" width="320" height="14" rx="7" fill="url(#najeonM)"/>
      <rect x="96" y="407" width="320" height="14" rx="7" fill="url(#najeonM)"/>
      <circle cx="156" cy="333" r="16" fill="url(#najeonM)" fill-opacity="0.5"/>
      <circle cx="156" cy="333" r="8" fill="url(#goldM)"/>
      <circle cx="356" cy="333" r="16" fill="url(#najeonM)" fill-opacity="0.5"/>
      <circle cx="356" cy="333" r="8" fill="url(#goldM)"/>
      <polygon points="96,246 134,246 134,256 106,256 106,284 96,284" fill="url(#goldM)"/>
      <polygon points="416,246 378,246 378,256 406,256 406,284 416,284" fill="url(#goldM)"/>
      <polygon points="96,421 134,421 134,411 106,411 106,383 96,383" fill="url(#goldM)"/>
      <polygon points="416,421 378,421 378,411 406,411 406,383 416,383" fill="url(#goldM)"/>

      <g transform="translate(256, 310)">
        <circle cx="0" cy="0" r="32" fill="url(#goldM)"/>
        <circle cx="0" cy="0" r="25" fill="#8C620C"/>
        <circle cx="0" cy="0" r="20" fill="url(#goldM)"/>
        <circle cx="0" cy="-3" r="6" fill="#1B2836"/>
        <polygon points="-3,-2 3,-2 4,9 -4,9" fill="#1B2836"/>
        <rect x="-9" y="19" width="18" height="26" rx="5" fill="url(#goldM)"/>
        <circle cx="0" cy="32" r="3.5" fill="#1B2836"/>
      </g>
    </g>
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve(__dirname, '../public');

  // 1. Save icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg, 'utf8');
  console.log('Saved public/icon.svg');

  // 2. 512x512 standard
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated public/pwa-512x512.png');

  // 3. 192x192 standard
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated public/pwa-192x192.png');

  // 4. 180x180 for iOS Apple Touch Icon
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated public/apple-touch-icon.png');

  // 5. 512x512 maskable icon with safe-zone margin
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated public/pwa-maskable-512x512.png');

  // 6. 64x64 favicon
  await sharp(Buffer.from(standardSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated public/favicon.ico');

  console.log('All PWA icons built successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
