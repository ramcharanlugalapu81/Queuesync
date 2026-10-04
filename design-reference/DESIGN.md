---
name: Campus Queue Manager
colors:
  surface: '#00161a'
  surface-dim: '#00161a'
  surface-bright: '#223d42'
  surface-container-lowest: '#001114'
  surface-container-low: '#021f24'
  surface-container: '#062328'
  surface-container-high: '#122e33'
  surface-container-highest: '#1e393e'
  on-surface: '#cae8ee'
  on-surface-variant: '#bfc8c7'
  inverse-surface: '#cae8ee'
  inverse-on-surface: '#193439'
  outline: '#8a9292'
  outline-variant: '#404848'
  surface-tint: '#9bd0cf'
  primary: '#a3d9d8'
  on-primary: '#003737'
  primary-container: '#88bdbc'
  on-primary-container: '#144d4d'
  inverse-primary: '#326766'
  secondary: '#a4cdd9'
  on-secondary: '#06363f'
  secondary-container: '#264f59'
  on-secondary-container: '#96bfcb'
  tertiary: '#d8cdbc'
  on-tertiary: '#363024'
  tertiary-container: '#bcb2a2'
  on-tertiary-container: '#4b4438'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b6edeb'
  primary-fixed-dim: '#9bd0cf'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#164e4e'
  secondary-fixed: '#c0e9f6'
  secondary-fixed-dim: '#a4cdd9'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#234c56'
  tertiary-fixed: '#ece1d0'
  tertiary-fixed-dim: '#d0c5b4'
  on-tertiary-fixed: '#201b10'
  on-tertiary-fixed-variant: '#4d4639'
  background: '#00161a'
  on-background: '#cae8ee'
  surface-variant: '#1e393e'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system serves high-velocity academic and collegiate operations—such as registrar desks, financial aid centers, academic advising, and campus clinic lines. It replaces the anxiety, confusion, and static waitlists of physical queues with an orderly, intelligent, and soothing digital flow.

The personality balances collegiate authority with calm, modern technical precision:
- **Calm & Reassuring:** Neutralizing queue anxiety through deep, muted tones and luminous, readable status indicators.
- **Architectural & Deliberate:** Clear geometric rhythm, structured modular panels, and robust dark-mode surfaces that suggest dependable institutional infrastructure.
- **Modern Institutional:** Fusing corporate reliability with progressive digital service patterns, avoiding sterile institutional grayness in favor of oceanic teals and warm earthy anchors.

The aesthetic direction is **Refined Technical Glass & Tonal Minimalism**. It utilizes deep midnight-teal backgrounds layered with subtle warm umber translucent cards, precise 1px borders, and radiant seafoam teal indicators for active turns, wait times, and ticket confirmations.

## Colors

The palette is engineered exclusively for a high-focus, reduced-strain dark UI, derived directly from the classic corporate teal-and-umber study:

- **Primary (`#88BDBC` - Luminous Seafoam):** Serves as the primary beacon color for queue position counters, active ticket confirmations, focal CTAs, focused input outlines, and live status pulses.
- **Secondary (`#254E58` - Deep Ocean Teal):** Defines structural containers, active item fills, tertiary button backgrounds, and elevated card surfaces.
- **Tertiary (`#6E6658` - Muted Warm Taupe):** Powers neutral chips, subtle icon badges, peripheral divider lines, and category identifiers.
- **Neutral Canvas (`#112D32` - Deep Midnight Slate Teal):** The foundational application canvas, offering an atmospheric, non-glare canvas that recedes into the background.
- **Neutral Surface / Overlay (`#4F4A41` - Warm Charcoal Umber):** Applied as an anchoring tonal base for modals, dropdown sheets, and subtle layered elevations, preventing the teal palette from feeling cold or purely clinical.

Text contrast is preserved through a high-contrast off-white (`#F1F5F5`) for primary headings, light seafoam tint (`#D2E7E6`) for body, and a softened taupe-gray (`#9FA8A3`) for meta-captions and timestamps.

## Typography

Typography is set exclusively in **Plus Jakarta Sans**, chosen for its geometric foundation, open counters, and humanistic warmth. It delivers high-density legibility across kiosk displays, student smartphones, and desktop admin dispatchers.

- **Display & Queue Numbers:** Large ticket IDs (e.g., `A-104`, `FIN-42`) use `display-lg` with an extra-bold weight and tightened tracking (`-0.02em`) for instantaneous distance-reading on wall boards and mobile ticket headers.
- **Headlines:** Clean semi-bold styling guides the user through queue stages, department designations, and estimated wait durations.
- **Body & Form Copy:** Uses standard 400 weight with generous line-height to ensure instructional text and policies remain effortless to digest in high-stress campus environments.
- **Labels & Monospaced Metadata:** Status chips, estimated time metrics, and counter tags rely on `label-md` and `label-sm` with slight uppercase tracking (`+0.04em`) to establish visual order.

## Layout & Spacing

The layout is built upon an 8pt rhythmic base grid, utilizing a responsive multi-column system designed to translate cleanly across public hall kiosks, administrator boards, and student mobile devices:

- **Desktop & Administrative Dashboards:** 12-column fluid grid, 2rem outer margins, and 1.25rem gutters. Enables concurrent multi-queue monitoring, counter management sidebars, and real-time wait metrics.
- **Student Mobile View (Queue Tracker):** Single-column stacked viewport with 1rem outer margins and 0.75rem internal component spacing. Critical data (ticket number, wait time, counter destination) occupies the upper viewport fold.
- **Campus Kiosks & Signage Displays:** Scaled 8-column layout with 2.5rem margins and large touch targets, maintaining accessibility for fast walk-up check-ins.

## Elevation & Depth

Visual hierarchy uses a refined layering scheme suited for deep dark-mode teal environments:

1. **Base Tier (Ground):** Solid `#112D32`. The root background for pages and terminal views.
2. **Surface Tier (Cards & Queues):** `#163A40` with an atmospheric background tint blended with `#4F4A41` at 20% opacity. Borders are defined by 1px solid `#254E58` to provide crisp boundary separation without harsh lines.
3. **Elevated Tier (Active Queues & Modals):** `#1C444D` accompanied by a soft, diffused ambient glow: `0 12px 32px -4px rgba(17, 45, 50, 0.7), 0 0 16px -2px rgba(136, 189, 188, 0.12)`.
4. **Focused / Interactive Glow:** When a ticket is called or an input is selected, a subtle seafoam illumination is applied using `box-shadow: 0 0 0 2px #88BDBC, 0 0 20px rgba(136, 189, 188, 0.25)`.

## Shapes

The interface embraces a **level 2 (Rounded)** curvature profile:
- Primary interactive elements (buttons, inputs, and list rows) adopt `0.5rem` (`rounded-md`).
- Containment blocks (queue cards, status summaries, ticket vouchers) use `1rem` (`rounded-lg`).
- Overlays, dialog windows, and live kiosk pods utilize `1.5rem` (`rounded-xl`).
- Dynamic pills and live indicator badges remain fully pill-shaped (`9999px`) to immediately distinguish active status from structural cards.

## Components

### Buttons
- **Primary ("Join Queue", "Call Next"):** Solid `#88BDBC` fill, `#112D32` deep bold text, `0.5rem` border radius, and subtle glow on hover (`0 0 16px rgba(136, 189, 188, 0.3)`).
- **Secondary ("Transfer Ticket", "Step Aside"):** Outlined 1px `#6E6658` with a `#254E58` surface hover transition and `#D2E7E6` text.
- **Danger / Leave ("Cancel Place"):** Muted dark umber base (`#4F4A41`) transitioning to a desaturated warm rust on hover, maintaining subdued urgency without breaking palette coherence.

### Input Fields
- Dark slate fill (`#153339`), enclosed in a 1px border of `#254E58`.
- Placeholder text set to `#6E6658`.
- On focus: 1px border shifts to `#88BDBC` with an ethereal teal halo (`0 0 0 3px rgba(136, 189, 188, 0.15)`).

### Status Chips & Badges
- **Active / Serving:** Pill-shaped background of `#254E58` with `#88BDBC` text and an animated seafoam pulse dot.
- **Waiting / In-Line:** `#4F4A41` background with `#E2DED9` text and a subtle 1px border of `#6E6658`.
- **Delayed:** Tinted umber-stone chip with warm taupe labeling.

### Cards & Ticket Modules
- Built on `#163A40` surface with 1px border of `#254E58`.
- Header houses large-scale ticket identification (`display-lg-mobile` or `display-lg`) paired with department indicators.
- Internal divider lines rendered in thin 1px `#254E58`.

### Lists & Queue Tables
- Alternating subtle rows using `#112D32` and `#14353B`.
- Row hover triggers an elevation shift with 1px accent border in `#88BDBC` along the left margin to visually lock the selected student record.
- Touch-friendly 48px minimal vertical tap zone for tablet dispatch operators.

### Checkboxes & Radios
- Rounded square (checkbox) and circle (radio) with a 1.5px border of `#6E6658` on `#112D32`.
- Checked state fills with `#88BDBC` displaying a dark `#112D32` checkmark/indicator.