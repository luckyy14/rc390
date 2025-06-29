# MidnightTorque Design Language System (DLS)

## 🎨 Color Palette

| Token Name         | Hex Code   | Usage                                 |
|--------------------|------------|---------------------------------------|
| --color-primary    | #1A1A1A    | Matte black base, backgrounds         |
| --color-surface    | #121212    | Cards, modals, 3D shadowy containers  |
| --color-accent     | #FF6F00    | KTM orange, call-to-action, buttons   |
| --color-accent-hover | #FF8C1A  | Hover on orange, glows                |
| --color-white      | #FFFFFF    | Text, icons, contrast base            |
| --color-border     | #333333    | Dividers, outlines                    |
| --color-muted      | #555555    | Disabled, background text             |
| --color-text-main  | #E0E0E0    | Primary text on dark                  |
| --color-text-subtle| #BBBBBB    | Secondary text                        |

## 🔤 Typography

- **Font Stack:**  
  `font-family: 'Oswald', 'Rajdhani', 'Inter', sans-serif;`

| Style         | Size  | Usage                        |
|---------------|-------|-----------------------------|
| --font-hero   | 72px  | Homepage hero text           |
| --font-h1     | 48px  | Section headings             |
| --font-h2     | 36px  | Subsections                  |
| --font-h3     | 24px  | Card titles, labels          |
| --font-body   | 16px  | Regular text                 |
| --font-small  | 14px  | Captions, UI text            |

## 📐 Spacing & Layout

| Token         | Value  | Usage              |
|---------------|--------|-------------------|
| --spacing-xs  | 4px    | Fine adjustments  |
| --spacing-sm  | 8px    | Minor padding     |
| --spacing-md  | 16px   | Standard padding  |
| --spacing-lg  | 24px   | Section spacing   |
| --spacing-xl  | 48px   | Page margins      |
| --radius-lg   | 16px   | Big card corners  |
| --radius-sm   | 6px    | Buttons, inputs   |

## 🔲 Components & Styles

- **Buttons:** Orange background, rounded, bold Oswald, slight shadow
- **Cards:** Matte black surface, white text, glowing orange CTA
- **Inputs:** Border: #333, focus outline: #FF6F00
- **Nav:** Sticky dark nav with bold logo, orange hover underline
- **Modals:** Semi-glass with orange edge ring
- **Tags / Badges:** Rounded, KTM orange background, white text

## 💡 Visual Guidelines

1. **3D Integration Tips**
   - Use Three.js with dark HDRI lighting, subtle ground reflection.
   - Materials: MeshStandardMaterial with low roughness for the bike.
   - Lighting: Orange directional light + ambient matte black fill.
   - UI should not interfere with 3D canvas — keep floating UI minimal.

2. **Display Feel**
   - Add depth using glassmorphism with dark blur:
     ```css
     backdrop-filter: blur(20px);
     background: rgba(26, 26, 26, 0.5);
     ```
   - Orange strip under bike specs
   - Use grid layout for responsive display, like spotlighted bikes

## 🌐 Example CSS Variables

```css
:root {
  --color-primary: #1A1A1A;
  --color-surface: #121212;
  --color-accent: #FF6F00;
  --color-accent-hover: #FF8C1A;
  --color-white: #FFFFFF;
  --color-border: #333333;
  --color-muted: #555555;
  --color-text-main: #E0E0E0;
  --color-text-subtle: #BBBBBB;

  --font-hero: 72px;
  --font-h1: 48px;
  --font-h2: 36px;
  --font-h3: 24px;
  --font-body: 16px;
  --font-small: 14px;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 48px;

  --radius-lg: 16px;
  --radius-sm: 6px;
}
```

## ✅ Optional Add-ons

- **3D rendering:** three.js, react-three-fiber
- **Animation:** Framer Motion, GSAP
- **UI Framework:** Tailwind CSS (customized)
- **Fonts:** Google Fonts: Oswald, Rajdhani
- **Icons:** Lucide, FontAwesome

---
This file documents the MidnightTorque DLS for both designers and developers. Use these tokens and guidelines for all UI work to ensure consistency.
