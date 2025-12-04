# World of Warcraft Blog & Guides Design Guidelines

## Design Approach
**Reference-Based: World of Warcraft UI & Blizzard Entertainment**

Drawing inspiration from WoW's iconic interface, official WoW website, and Blizzard's design language. The design should evoke the epic fantasy atmosphere of Azeroth while maintaining modern web usability.

## Core Design Principles
1. **Epic Fantasy Immersion** - Transport users into the World of Warcraft universe
2. **Ornate Yet Functional** - Decorative borders and textures that don't compromise readability
3. **Hierarchical Information** - Clear content structure inspired by WoW's quest log and interface panels
4. **Rich Visual Storytelling** - Heavy use of game imagery and atmospheric elements

## Typography

**Primary Font**: Serif font with fantasy character (similar to Morpheus or Crimson Text via Google Fonts)
- Headings: Bold, large scale (text-4xl to text-6xl)
- Article titles: text-2xl to text-3xl, medium weight
- Body text: Sans-serif for readability (Inter or Open Sans), text-base to text-lg
- UI elements: All-caps treatment for navigation and buttons

**Hierarchy**:
- Hero headlines: text-5xl/text-6xl, bold
- Section headings: text-3xl/text-4xl, semibold
- Article titles: text-2xl, medium
- Body content: text-lg, regular, generous line-height (leading-relaxed)

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Section padding: py-16 to py-24 on desktop, py-12 on mobile
- Component spacing: gap-6 to gap-8 for grids
- Content padding: px-6 to px-8

**Container Strategy**:
- Full-width sections with max-w-7xl inner containers
- Article content: max-w-4xl for optimal reading
- Admin forms: max-w-2xl

## Page-Specific Layouts

### Homepage/Main Blog Listing
**Hero Section** (80vh):
- Large dramatic WoW landscape image (Azeroth vista, raid scene, or cinematic screenshot)
- Centered ornate title treatment with subtitle
- Primary CTA button with decorative border treatment
- Overlay gradient for text readability

**Featured Articles Section**:
- 3-column grid (lg:grid-cols-3, md:grid-cols-2, grid-cols-1)
- Card design with thick decorative borders mimicking WoW UI panels
- Hover effect: subtle lift and glow
- Each card: category badge, featured image, title, excerpt, read time

**Recent Guides Grid**:
- 2-column layout with larger cards
- Class/specialization icons integration
- Author avatar with character class styling

**Category Navigation**:
- Horizontal scrollable pill-style filters
- Icons for each category (Guides, Raids, PvP, Class Guides, News, Lore)

### Article Detail Page
- Wide hero image related to article topic (full-bleed, 50vh)
- Breadcrumb navigation with WoW-style arrow separators
- Article metadata bar: author, date, category, reading time
- Single-column content area with generous margins
- Decorative section dividers between content blocks
- Sidebar (desktop only): Related articles, category navigation, author bio
- Rich text styling: styled blockquotes, code blocks with WoW tooltip aesthetic

### Admin Panel
- Dark themed dashboard with sidebar navigation
- Article editor with split view: form on left, preview on right
- Rich text editor toolbar with WoW-inspired button styling
- Category management with drag-to-reorder functionality
- Image upload area with preview thumbnails
- Published/Draft toggle with distinctive visual states

### Search Results
- Search bar with prominent placement, WoW-style input field
- Real-time filtering feedback
- Results in card grid format matching main listing
- Empty state with WoW-themed illustration and helpful text

## Component Library

### Navigation
- Sticky header with semi-transparent backdrop blur
- Logo area with WoW faction symbol or custom game-inspired logo
- Horizontal menu with hover underline effects
- Search icon that expands to search bar
- Mobile: Hamburger menu with slide-out drawer featuring ornate panel design

### Cards (Article/Guide Cards)
- Thick bordered containers (border-4)
- Image with 16:9 aspect ratio, object-cover
- Category badge positioned top-left on image
- Content padding: p-6
- Title, excerpt (line-clamp-3), metadata row
- "Read More" link with arrow icon

### Buttons
- Primary: Large, bold, with subtle texture overlay
- Secondary: Outlined with thick border
- Admin actions: Smaller, functional styling
- All buttons: Uppercase text, letter-spacing

### Forms (Admin Panel)
- Large input fields with WoW-style borders
- Label positioning above inputs
- Textarea for content with minimum height
- Dropdown selectors with custom styling
- File upload areas with drag-and-drop visual cues

### Badges
- Category badges: Rounded corners, bold text, varied per category
- Status indicators: Published (gold accent), Draft (silver/gray accent)

### Modals/Overlays
- Centered with ornate border treatment
- Backdrop with dark overlay
- Close button in top-right corner with X icon
- Confirm/Cancel actions at bottom

## Images

**Required Images**:

1. **Homepage Hero**: Epic WoW landscape - Stormwind, Orgrimmar, or Shadowlands vista (1920x1080)
2. **Article Featured Images**: Various WoW screenshots - raids, dungeons, characters, landscapes (800x450 per article)
3. **Category Icons**: Class symbols, faction crests, activity icons
4. **Decorative Elements**: Corner ornaments, divider graphics, panel textures from WoW UI
5. **Placeholder Content**: Various WoW character and environment screenshots for demo articles

**Image Treatment**:
- Subtle vignette overlays on hero images
- Consistent aspect ratios across card thumbnails
- Lazy loading for performance

## Interactions & Animations

**Minimal, Purposeful Animations**:
- Card hover: Slight elevation (scale-105, shadow increase)
- Button hover: Subtle glow effect
- Page transitions: Smooth fade-in for content
- Image loading: Skeleton placeholders with shimmer
- NO complex scroll-triggered animations

## Accessibility
- Maintain WCAG AA contrast ratios despite dark themed elements
- Focus states: Visible outline with WoW-inspired styling
- Alt text for all images
- Semantic HTML throughout
- Keyboard navigation support for all interactive elements

## Multi-Column Strategy
- Homepage featured grid: 3 columns desktop, 2 tablet, 1 mobile
- Related articles sidebar: Single column
- Admin dashboard stats: 4 columns desktop, 2 tablet, 1 mobile
- Search results: Same as main grid (3/2/1)

This design creates an immersive WoW experience while maintaining modern web standards and usability. The ornate fantasy aesthetic is balanced with clean content hierarchy for excellent readability.