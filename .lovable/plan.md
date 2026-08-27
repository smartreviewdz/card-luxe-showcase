# Ultra-Premium Google Review Page (design only)

A single mobile-first page at `/` matching the navy + gold card theme: deep midnight navy, gold foil accents, ivory lower section, heavy but tasteful animation. Everything is visual only — stars, buttons and social icons are styled and animated, but nothing submits or navigates.

## Sections (top to bottom)

1. **Hero band (navy)**
   - Gold-ringed Google badge with slow shimmer + soft glow pulse
   - Eyebrow "— AVIS VÉRIFIÉ —" with gold hairlines
   - Headline "LAISSEZ-NOUS VOTRE AVIS SUR GOOGLE" in an elegant serif
   - Row of 5 gold stars with staggered entrance and gentle twinkle
   - Curved gold-edged wave divider into the ivory section

2. **Business card block (ivory)**
   - Gold corner brackets framing a soft neumorphic logo tile with an animated smiley
   - Business name in navy serif + time-of-day greeting line
   - Subtle floating/parallax drift on scroll

3. **Rating selector**
   - "Comment avez-vous vécu votre expérience ?"
   - 5 large stars: hover/tap fills gold left-to-right with a spring bounce, sparkle burst on the selected one, and a caption that changes with the rating (purely local visual state)
   - Below it a gold "Publier mon avis" pill button with sheen sweep — decorative only

4. **Social block (dark navy card)**
   - Gold bracket corners, "— RESTONS CONNECTÉS —" eyebrow, two-line heading (sans + gold italic serif)
   - Instagram / Facebook / TikTok circular gold-ringed icons with label + caption, plus a centered Site Web circle
   - Hover: ring rotates, icon lifts, glow blooms. Non-clickable
   - Gold keyword strip (COULISSES · NOUVEAUTÉS · AVIS) and a small trust row (Officiel · Réponse rapide · Communauté)

5. **Footer**
   - "AVIFY STAT" wordmark in brushed metallic gradient with a gold diamond divider
   - Tagline "BETTER FEEDBACK. BETTER BUSINESSES."

## Motion system

- Scroll-reveal (fade + rise) on every section, staggered children
- Ambient: slow gold light sweep across the navy hero, faint drifting particles, breathing glow on the Google badge
- Micro-interactions: star spring fill, sheen on buttons, ring rotation on social circles
- Respects `prefers-reduced-motion`

## Technical notes

- Rewrites `src/routes/index.tsx` as the review page; supporting components under `src/components/review/`
- Design tokens added to `src/styles.css`: navy `oklch` scale, gold/champagne accents, ivory surface, gold gradient + glow shadow tokens; no hardcoded colors in components
- Fonts loaded via `<link>` in `src/routes/__root.tsx`: Cormorant Garamond (display serif) + Inter/Jost (UI sans)
- Animation with Motion for React (`motion`) plus CSS keyframes for ambient loops
- Google "G", stars, NFC/QR and social glyphs drawn as inline SVG/lucide — no image uploads embedded
- Route `head()` with a unique French title/description, og/twitter tags
- No backend, no forms, no working links
