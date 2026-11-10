# Salim Azmi — Brand Guidelines

Version 1.0 · October 2026

A monochrome identity for a personal design portfolio: black, white and grey only, large grotesk type, and small monospace labels. The work shown on the site brings the colour; the brand stays quiet around it.

---

## 1. Brand essence

| | |
| --- | --- |
| **Who** | Salim Azmi, designer: websites, brand identities and print |
| **Positioning** | Branding and digital design for businesses that want to look professional from day one |
| **Personality** | Confident, precise, calm, direct |
| **Voice** | Short sentences. Plain words. No hype. Show the work, then say one clear thing about it. |
| **Based in** | Morocco, working with clients in Morocco, France and abroad |

**Tagline options**

- Designer of brand identities and websites for businesses that want to look ready from day one.
- Brands and websites that work as hard as you do.
- Design for businesses that want to look ready.

---

## 2. Logo

The identity has two parts. Both files are single-colour vector paths, so they can be filled with any colour from the palette.

| Asset | File | Use it for |
| --- | --- | --- |
| **Wordmark** | `wordmark.svg` — "salimazmi", lowercase | Site header, footer, documents, invoices, email signature |
| **Brandmark** | `brandmark.svg` — the single-storey "a" | Favicon, social avatars, watermark on images, small spaces |

### Usage

- **Lockup:** the wordmark is the primary logo. Use the brandmark alone only where the wordmark would be smaller than its minimum size.
- **Colour:** white on black (primary), black on white (secondary), or grey on black for quiet uses such as watermarks. Never in colour.
- **Clear space:** keep empty space around the logo at least equal to the height of the letter "a" in the wordmark, on all sides.
- **Minimum size:** wordmark 80 px wide on screen (20 mm in print); brandmark 16 px (5 mm).
- **Favicon:** brandmark in white on a black square with 20% padding.

### Don't

- Stretch, skew, rotate or outline the logo
- Add shadows, gradients or effects
- Put it on busy photos without a dark overlay
- Recolour it outside the palette
- Retype the wordmark in a font: always use the SVG file

### Cropping the SVG files

The original exports sit on a 1000 × 1000 artboard with lots of empty space. The `wordmark.svg` and `brandmark.svg` files delivered with this guide are already cropped to these values:

```html
<!-- Wordmark, tight crop -->
<svg viewBox="196 448 608 104">…paths…</svg>

<!-- Brandmark, tight crop -->
<svg viewBox="362 334 276 294">…path…</svg>
```

Both delivered files use `fill="currentColor"`, so the logo takes the text colour of its container.

---

## 3. Colour

Black, white and grey only. Colour comes from the projects in the portfolio, never from the interface.

| Token | Name | HEX | RGB | Use |
| --- | --- | --- | --- | --- |
| `--black` | Ink | `#0A0A0A` | 10, 10, 10 | Main background, primary text on light |
| `--grey-900` | Graphite | `#161616` | 22, 22, 22 | Cards and sections on black |
| `--grey-800` | Charcoal | `#262626` | 38, 38, 38 | Borders and dividers on black |
| `--grey-600` | Slate | `#5C5C5C` | 92, 92, 92 | Secondary text and labels on white |
| `--grey-500` | Steel | `#8A8A8A` | 138, 138, 138 | Secondary text and labels on black |
| `--grey-200` | Mist | `#D9D9D9` | 217, 217, 217 | Borders on white |
| `--grey-100` | Paper | `#F2F2F2` | 242, 242, 242 | Light sections, image backgrounds |
| `--white` | White | `#FFFFFF` | 255, 255, 255 | Primary text on black, light backgrounds |

**Proportion:** about 70% black, 25% white, 5% grey. The site is dark-first; use white sections sparingly to change rhythm, for example on a case study page.

**Contrast:** white on Ink and Ink on white pass WCAG AAA. Steel `#8A8A8A` on Ink and Slate `#5C5C5C` on white both pass AA for small text. Don't use Steel on white: it fails for small text.

```css
:root {
  --black:    #0A0A0A;
  --grey-900: #161616;
  --grey-800: #262626;
  --grey-600: #5C5C5C;
  --grey-500: #8A8A8A;
  --grey-200: #D9D9D9;
  --grey-100: #F2F2F2;
  --white:    #FFFFFF;
}
```

---

## 4. Typography

Two families: a neo-grotesk for everything big and readable, and a monospace for small labels. This is the same pairing as large-name portfolio sites: huge clean sans-serif name, small uppercase mono details.

| Role | Font | Free source | Premium alternative |
| --- | --- | --- | --- |
| **Display and text** | **Inter Tight** | Google Fonts | Neue Haas Grotesk Display, Helvetica Now Display |
| **Labels and details** | **Geist Mono** | Google Fonts | Söhne Mono, Favorit Mono |

```html
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500&family=Geist+Mono:wght@400&display=swap" rel="stylesheet">
```

### Type scale (desktop)

| Style | Font | Size / line height | Weight | Tracking | Example use |
| --- | --- | --- | --- | --- | --- |
| **Hero** | Inter Tight | `clamp(5rem, 18vw, 20rem)` / 0.9 | 500 | -0.04em | Your name on the home page |
| **H1** | Inter Tight | 72 / 76 px | 500 | -0.03em | Page titles, project names |
| **H2** | Inter Tight | 40 / 46 px | 500 | -0.02em | Section titles |
| **H3** | Inter Tight | 24 / 30 px | 500 | -0.01em | Card titles |
| **Lead** | Inter Tight | 22 / 30 px | 400 | -0.01em | Intro sentence under the header |
| **Body** | Inter Tight | 17 / 26 px | 400 | 0 | Case study text |
| **Nav** | Inter Tight | 15 / 20 px | 400 | 0 | Menu links, "Let's talk" |
| **Label** | Geist Mono | 12 / 16 px | 400 | 0.04em, UPPERCASE | "Based in Morocco", client, services |

### Rules

- Two weights only: 400 and 500. No bold.
- Big type is the decoration. Don't add icons or illustrations to fill space.
- Labels are always mono and uppercase; nothing else is.
- Left-align text. Centre only short mono labels.

```css
--font-sans: "Inter Tight", "Helvetica Neue", Arial, sans-serif;
--font-mono: "Geist Mono", ui-monospace, "SFMono-Regular", monospace;
```

---

## 5. Layout and grid

- **Grid:** 12 columns, 24 px gutters, 24 px side margins on desktop (16 px on mobile).
- **Spacing scale:** 4, 8, 16, 24, 32, 48, 64, 96, 128 px.
- **Header:** logo left, navigation centred (Home · Works · About · Contact), "Let's talk" right. 24 px from the top.
- **Hero:** the name runs edge to edge at the bottom of the first screen, the lead sentence top left, a mono location label bottom left and a scroll arrow bottom right.
- **Corners:** 0 px. Sharp edges everywhere, including images and buttons.
- **Lines:** 1 px Charcoal `#262626` on black, Mist `#D9D9D9` on white.

---

## 6. Interface elements

| Element | Style |
| --- | --- |
| **Primary button** | White fill, Ink text, Inter Tight 15 px, 14 × 24 px padding, no radius. Hover: Paper `#F2F2F2`. |
| **Secondary button** | Transparent, 1 px white border, white text. Hover: white fill, Ink text. |
| **Text link** | White, underline 1 px with 4 px offset. Hover: Steel. |
| **Project card** | Image at 4:3, then project name (H3) and a mono label row: `CLIENT · YEAR · SERVICE`. |
| **Divider** | 1 px Charcoal line, full width. |
| **Cursor / hover on images** | Slight zoom (1.03) over 400 ms, no colour overlays. |

---

## 7. Imagery

- Project images carry the colour; everything around them stays monochrome.
- Show work in context: the website on a laptop or phone, the brochure on a table, the business card in a hand.
- Neutral backgrounds (Paper or Ink) behind mock-ups.
- Portrait of Salim: black and white, natural light, plain background.

---

## 8. Voice examples

| Do | Don't |
| --- | --- |
| "Website and brand identity for ISWOOD, a wood company in Meknès." | "We created an amazing, innovative digital experience!" |
| "Let's talk." | "Contact us now for a free consultation!!!" |
| "13 projects from one client referral chain." | "The best designer in Morocco." |

---

## 9. Files

| File | Contents |
| --- | --- |
| `wordmark.svg` | "salimazmi" wordmark, single colour |
| `brandmark.svg` | "a" brandmark, single colour |
| `salim-azmi-brand-guidelines.md` | This document |

---

## 10. Visual sample

The brand identity sample (logo, colour, typography, website hero and applications) is on the Salim Azmi Brand Identity design canvas.
