# Design Guidelines for The Atlas Exports

## Design Approach
**Professional B2B Commerce System** - Drawing inspiration from established B2B platforms like Alibaba, TradeIndia, and modern product-focused interfaces. Emphasizes trust, clarity, and efficient product discovery while maintaining visual appeal for international buyers.

## Typography System

**Font Families:**
- Primary: Inter or DM Sans (clean, professional, excellent readability)
- Accent: Poppins (for headings, adds warmth and personality)

**Hierarchy:**
- Hero Headlines: 4xl to 6xl, bold weight
- Section Headers: 3xl to 4xl, semibold
- Subsections: xl to 2xl, medium weight
- Body Text: base to lg, regular weight
- Captions/Meta: sm to base, regular weight
- Product Cards: Title (lg semibold), Category badge (xs uppercase), Description (sm regular)

## Layout System

**Spacing Units:** Use Tailwind spacing of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-4 to p-8
- Section padding: py-12 to py-24
- Container gaps: gap-4 to gap-8
- Margins between sections: my-16 to my-24

**Container Strategy:**
- Max-width: 7xl for full-width sections with content
- Content sections: max-w-6xl centered
- Text content: max-w-4xl for readability
- Product grids: max-w-7xl

## Homepage Structure

**Hero Section (with Carousel):**
- Full-width carousel (80vh height) with 4-5 slides showcasing:
  - Company facility/warehouse
  - Featured products in use
  - Export containers/logistics
  - Team/quality control
  - Punjab agricultural landscape
- Auto-play with 5-second intervals
- Navigation: Bottom-centered dots, left/right arrow buttons (semi-transparent with blur backdrop)
- Overlay content: Centered text with company tagline, blurred button backgrounds
- Gradient overlay (subtle) to ensure text readability

**Quick Category Overview:**
- Grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile
- Large category cards with representative images, category name, item count
- Hover: Subtle scale transform

**Featured Products:**
- Horizontal scrollable carousel with 4-6 featured products
- Product cards with aspect-ratio images, title, category badge, price/MOQ info

**Trust Indicators:**
- Single row: Years in business, Countries served, Product categories, Satisfied clients
- Large numbers with icons, positioned between sections

**Call-to-Action Section:**
- Full-width section with background pattern
- Two-column: Left (compelling text about partnership), Right (Contact form preview or CTA buttons)

## Product Catalog Page

**Category Filter:**
- Sticky top bar with dropdown selector
- "All Categories" as default, then individual categories
- Active category badge displayed prominently
- Product count shown for each category

**Product Grid:**
- 3 columns desktop, 2 tablet, 1 mobile (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Cards with: Square/landscape product image, category badge (top-right), title, 2-line description, "View Details" and "Request Quote" buttons
- Consistent card height with image aspect ratio 4:3
- Hover: Slight shadow elevation, scale on image

**Product Detail Page:**
- Two-column layout: Left (Image gallery with main large image + thumbnail strip), Right (Title, category, description, Request Quote CTA)
- Below: Full-width specifications table (zebra striping for readability)
- Related products carousel at bottom

## Client Portal Page

**Layout Sections (vertical flow):**

1. **Portal Header:**
   - Hero banner (30vh) with portal title and description
   - Quick navigation pills to sections below

2. **Our Clients Grid:**
   - 4 columns desktop, 2 tablet, 1 mobile
   - Cards with company logo placeholder, name, country flag icon
   - Hover: Subtle border highlight

3. **Reviews/Testimonials:**
   - Two-column layout: Left (Testimonial carousel with quote cards, star rating, client name/company), Right (Add Review form)
   - Form: Name, Email, Company, Star rating selector, Comment textarea
   - Testimonial cards: Large quote marks, centered text, bottom attribution

4. **Contact Section:**
   - Split layout: Form (60%) | Social links + info (40%)
   - Social icons: Large, circular buttons for WhatsApp, LinkedIn, Instagram
   - Form fields: Proper spacing (gap-4), full-width inputs

## Admin Portal

**Dashboard Layout:**
- Sidebar navigation (fixed, 240px width): Logo at top, menu items with icons, logout at bottom
- Main content area: max-w-7xl with generous padding

**Data Tables:**
- Striped rows for readability
- Action buttons (Edit, Delete, Toggle) aligned right
- Filter/search bar above tables
- Pagination controls at bottom

**Forms:**
- Two-column layout for product/category forms where logical
- Full-width for text areas (descriptions, specifications)
- Image upload: Drag-drop zone or file selector with preview grid
- Clear section headers with dividing lines
- Form actions: Right-aligned (Cancel/Save buttons)

## Component Library

**Buttons:**
- Primary: Solid, medium padding (px-6 py-3), rounded-lg
- Secondary: Outlined, same padding
- Ghost: Text-only with hover background
- Icon buttons: Square (40x40px), rounded-md

**Cards:**
- Rounded corners (rounded-lg to rounded-xl)
- Consistent shadow (shadow-md to shadow-lg on hover)
- Padding: p-6 for content cards

**Forms:**
- Input fields: Full rounded (rounded-lg), proper spacing (mb-4)
- Labels: Semibold, mb-2
- Placeholders: Clear and helpful
- Error states: Red accent with message below field

**Badges:**
- Category badges: Small (px-3 py-1), rounded-full, uppercase text (text-xs)
- Status indicators: Dot + text combination

**Navigation:**
- Public navbar: Horizontal, max-w-7xl, logo left, menu center/right, sticky top
- Mobile: Hamburger menu, slide-in drawer
- Footer: 4-column layout (About, Quick Links, Products, Contact), social icons row at bottom

## Images

**Required Images:**
1. **Homepage Carousel (5 images):**
   - Punjab agricultural fields/warehouse facility
   - Export container loading
   - Product showcase (equipment on display)
   - Quality control/inspection process
   - International partnerships/handshake

2. **Product Images:** Each product needs 3-5 high-quality images showing different angles

3. **About Section:** Team photo, facility exterior, quality certifications

4. **Client Logos:** Placeholder company logos in Our Clients section

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, stacked)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns)

**Mobile Adaptations:**
- Carousel: Swipe-enabled, hide arrows, show dots
- Product grid: Single column, full-width cards
- Navigation: Hamburger menu
- Forms: Full-width fields, stacked labels

## Key Interactions

- Smooth scroll to sections
- Carousel auto-advance with pause on hover
- Form validation with inline feedback
- Loading states for admin actions
- Toast notifications for success/error messages
- Modal for product image gallery (click to expand)
- Dropdown filters with smooth transitions