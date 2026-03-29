# TechSports - Under Construction Landing Page

## Overview
This is a polished "Under Construction" landing page built with Material 3 expressive theme, featuring smooth animations, dark mode support, and a Google-like design aesthetic.

## Features
✨ **Material 3 Expressive Theme** - Following Google's latest design guidelines
🌓 **Dark/Light Mode** - Toggle between themes with smooth transitions
🎬 **Rich Animations** - Powered by Framer Motion
  - Floating gradient backgrounds
  - Pulsing construction icon
  - Staggered content reveal
  - Animated progress bar
  - Smooth hover effects
📱 **Fully Responsive** - Optimized for all screen sizes
🚀 **Production Ready** - Built and optimized with Next.js

## Tech Stack
- Next.js 16.2.1 (App Router)
- React 19.2.4
- Material-UI v7 (MUI)
- Framer Motion 12.38.0
- TypeScript
- TailwindCSS

## Running the Application

### Development Mode
\`\`\`bash
pnpm dev
\`\`\`
Then open http://localhost:3000

### Production Mode
\`\`\`bash
# Build the app
pnpm build

# Start production server
pnpm start
\`\`\`
Then open http://localhost:3000

## Key Components

### Theme System
- `app/theme.ts` - Material 3 color palette and component styles
- `app/ThemeRegistry.tsx` - Theme provider with dark/light mode toggle
- Persists theme preference in localStorage
- Detects system color scheme preference

### Main Component
- `app/components/UnderConstruction.tsx` - Landing page with:
  - Animated gradient backgrounds
  - Theme toggle button
  - Construction icon with glow effect
  - Progress indicator showing 67% completion
  - Call-to-action buttons
  - Responsive layout

## Customization

### Colors
Edit `app/theme.ts` to customize the Material 3 color palette.

### Progress
Change the progress percentage in `UnderConstruction.tsx`:
\`\`\`typescript
animate={{ width: '67%' }} // Change this value
\`\`\`

### Content
Update text, buttons, and animations in `app/components/UnderConstruction.tsx`.

## Design Philosophy
- Material 3 expressive design language
- Soft, rounded corners (28px border radius)
- Elevated surfaces with subtle shadows
- Gradient backgrounds for visual interest
- Smooth, meaningful animations
- High contrast for accessibility

Enjoy your beautiful under construction page! 🎉

## 🎨 Animation Features

### Bouncing & Morphing Shapes
The landing page features a sophisticated Material 3 expressive shape animation system:

**Features:**
- 🎯 **8 Dynamic Shapes** - Bouncing smoothly across the screen
- 🔄 **Shape Morphing** - Transforms between Material 3 border radius values:
  - Sharp corners (0px)
  - Small rounded (8px) 
  - Medium rounded (16px)
  - Large rounded (28px - Material 3 expressive)
  - Pill shapes (50% - fully rounded)
- 🌈 **Color Variations** - Uses Material 3 palette colors with transparency
- 🎭 **Rotation Animation** - Each shape rotates while moving
- ⚡ **Spring Physics** - Smooth, organic motion using spring animations
- 🎪 **Blur & Glow** - Backdrop blur and glowing shadows for depth
- 🌓 **Theme Aware** - Different colors for dark and light modes

**How it Works:**
- Each shape independently moves to random positions
- Shapes morph their border radius at different intervals
- Uses Framer Motion's spring physics for natural movement
- Low opacity and blur create a subtle, polished background effect

**Customization:**
Edit `app/components/BouncingShapes.tsx` to adjust:
- Number of shapes: Change `SHAPES_COUNT`
- Speed: Modify `duration` values
- Colors: Update the `colors` array
- Size range: Adjust `size` calculation
- Blur amount: Change `filter` and `backdropFilter` values

The animation creates a dynamic, modern feel while maintaining Material 3's expressive design language! 🚀
