# Design Brief: Zyro TV

## Direction

Zyro TV — Premium streaming platform with bold neon purple accents on deep black, glass-morphism cards, and Hulu-style horizontal scrolling layout.

## Tone

Clean, cinematic, tech-forward. Deep black background (#0a0a0a analog) with neon violet threading creates a premium, modern streaming experience. Minimalist content focus with glowing interactive accents.

## Differentiation

Glass-morphism cards with neon purple border glow on hover. 16:9 landscape aspect ratio with full-width hero banner. Clean typography and zero visual clutter — every element serves content discovery.

## Color Palette

| Token        | OKLCH           | Role                              |
| ------------ | --------------- | --------------------------------- |
| background   | 0.07 0.01 295   | Near-black, deep tech backdrop    |
| foreground   | 0.95 0.01 295   | High-contrast white text          |
| card         | 0.15 0.02 295   | Elevated surface, glass interior  |
| primary      | 0.6 0.28 295    | Neon purple, CTAs, accents        |
| accent       | 0.6 0.28 295    | Hover states, purple threading    |
| muted        | 0.2 0.015 295   | Secondary text, inactive states   |
| destructive  | 0.65 0.19 22    | Error/danger states               |

## Typography

- Display: Space Grotesk — Modern, geometric, tech-forward headings and hero text
- Body: General Sans — Clean, modern personality for content and UI labels
- Mono: Geist Mono — Stats, metadata, timestamps
- Scale: hero `text-5xl md:text-7xl font-bold`, h2 `text-3xl md:text-4xl font-bold`, label `text-sm font-semibold`, body `text-base`

## Elevation & Depth

Glassmorphic layers with subtle inset borders and blue glow effects. Primary background (0.07L) with elevated cards (0.15L) create visual hierarchy through lightness and transparency.

## Structural Zones

| Zone    | Background                | Border                           | Notes                                    |
| ------- | ------------------------- | -------------------------------- | ---------------------------------------- |
| Header  | card (0.15L) + glass      | Primary purple w/ alpha 0.2      | Top nav with logo, Browse tabs           |
| Hero    | background (0.07L)        | Gradient overlay                 | Full-width 16:9 cinematic banner         |
| Content | background (0.07L)        | —                                | Horizontal scrollable show rows          |
| Cards   | card (0.15L) + backdrop   | Purple accent on hover (0.3+ alpha) | Glass effect, 12px radius, 16:9       |
| Footer  | card (0.15L)              | Border top (0.25L)               | Minimal, same as header treatment        |

## Spacing & Rhythm

Section gaps 5rem (lg screens), content padding 2rem, card grid gap 1.5rem, horizontal scroll gap 1rem. Micro-spacing: button padding 0.75rem 1.5rem. Tight density for content focus.

## Component Patterns

- Buttons: 8px radius, primary purple, hover scale+glow, 0.3s transition
- Cards: 12px radius, 0.15L background, backdrop blur (12px), purple border on hover, smooth scale
- Badges: rounded-full, accent purple text on muted background, 0.2L

## Motion

- Entrance: `fade-in` 0.4s ease-out or `scale-in` 0.3s ease-out for modals
- Hover: scale(1.02) + purple glow, 0.3s smooth transition on all interactive elements
- Decorative: Subtle pulse on featured badges, gentle float on hero images

## Constraints

- No heavy shadows (glassmorphism relies on transparency + glow)
- Purple accent used sparingly for interactive states and primary CTAs
- All text at AA+ contrast (0.95L foreground on 0.07L background = 0.88 lightness diff)
- Rounded corners: 12px cards, 8px buttons, sharp inputs (0-2px)
- No likes/views icons, no creator sections, no watermarks

## Signature Detail

Neon purple border glow that intensifies on hover (via `box-shadow` with purple alpha) — creates a violet threading effect signaling interactivity and premium polish without overwhelming content focus.
