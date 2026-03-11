# Tailwind CSS in Next.js — S6 Ep. 4

---

## 1. New Project mein Tailwind Setup

```bash
npx create-next-app@latest
```

- Project create karte waqt **Tailwind CSS** option aata hai → `Yes` press karo
- Bas itna karo — Tailwind automatically set up ho jaata hai
- Koi extra config nahi chahiye new project mein

> ✅ New project mein sirf ek option select karna hai, baaki sab Next.js khud handle karta hai

---

## 2. Tailwind V3 vs V4 — Key Difference

| | Tailwind V3 (Next.js 14) | Tailwind V4 (Latest) |
|---|---|---|
| Config file | ✅ `tailwind.config.js` hota hai | ❌ Nahi hota |
| Customization | JS file mein | CSS file mein |
| PostCSS config | `postcss.config.mjs` | `postcss.config.mjs` |

---

## 3. Old Version (Next.js 14) ka Project banana

```bash
npx create-next-app@14.2.26
```

- Yeh command old version ka project banata hai
- Isme `tailwind.config.js` file milti hai
- Tailwind version 3.x install hota hai

---

## 4. Custom Colors — Tailwind V3 (Old Way)

`tailwind.config.js` mein:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {        // ⚠️ extend ke andar likhna zaroori hai
      colors: {
        primary: "blue",   // ab bg-primary, text-primary use kar sakte ho
      }
    }
  }
}
```

> ⚠️ `extend` ke **bahar** likhoge toh Tailwind ke saare default colors **overwrite** ho jaayenge — sirf tumhare colors bachenge

```js
// ❌ Yeh mat karo — saare tailwind colors delete ho jaayenge
theme: {
  colors: {
    primary: "blue"
  }
}
```

---

## 5. Custom Colors — Tailwind V4 (New Way)

CSS file (`globals.css`) mein `@theme` ke andar likhte hain:

```css
@import "tailwindcss";

@theme {
  --color-primary: blue;   /* ab bg-primary use kar sakte ho */
}
```

- CSS variable style mein likhte hain (`--color-name`)
- String mein value mat do — normal CSS ki tarah likho

```css
/* ❌ Wrong */
--color-primary: "blue";

/* ✅ Correct */
--color-primary: blue;
```

---

## 6. Saare Default Colors Overwrite karna — V4

```css
@theme {
  --color-*: initial;          /* pehle saare colors reset karo */
  --color-background: white;
  --color-foreground: black;
  --color-primary: blue;       /* ab sirf yeh 3 colors bachenge */
}
```

---

## 7. Custom Breakpoint (Media Query) — V4

```css
@theme {
  --breakpoint-media500: 500px;   /* custom breakpoint banao */
}
```

Use karna:

```html
<div class="media500:bg-primary">...</div>
```

- Mobile first hai — `min-width: 500px` pe apply hoga
- 500px se kam width pe class apply nahi hogi

---

## 8. `inline` Keyword — V4

```css
@theme inline {
  --color-primary: var(--some-css-variable);
}
```

- Jab CSS variable **refer** kar rahe ho tab `inline` lagao
- Tailwind docs recommend karta hai — unexpected behavior se bachne ke liye
- Normal color value mein `inline` ki zaroorat nahi

---

## 9. Tailwind Extension — VS Code

Agar suggestions (IntelliSense) nahi aa rahi toh yeh extension install karo:

```
Tailwind CSS IntelliSense
```

- Install ke baad VS Code restart karo
- Uske baad `bg-`, `text-` likhne pe suggestions aane lagenge

---

## Summary

| Kaam | V3 (Old) | V4 (New) |
|---|---|---|
| Setup | `tailwind.config.js` | `globals.css` mein `@theme` |
| Custom color add | `extend.colors.primary` | `--color-primary: value` |
| Default colors overwrite | `theme.colors` (extend ke bahar) | `--color-*: initial` |
| Custom breakpoint | `extend.screens` | `--breakpoint-name: value` |
| Customization docs | tailwindcss.com/docs | tailwindcss.com/docs (v4) |

---

## Next Video → Tailwind Setup in Existing Next.js Project

# Tailwind CSS Setup in Existing Next.js Project — S6 Ep. 4

---

## 1. Setup Steps — Existing Project Mein Tailwind Add Karna

### Step 1 — Install karo
```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

### Step 2 — `postcss.mjs` file banao (root mein)
```js
// postcss.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
export default config
```

### Step 3 — `globals.css` mein Tailwind directive add karo
```css
/* globals.css ke top pe */
@import "tailwindcss";

/* Baaki existing styles neeche */
```

### Step 4 — Server restart karo + VS Code window reload karo
```bash
npm run dev
```
- VS Code mein `Ctrl+Shift+P` → **Reload Window** → Tailwind autocomplete kaam karega

---

## 2. New Project Mein Tailwind (Reference)

```bash
npx create-next-app@latest my-app --tailwind
```

- `--tailwind` flag → automatically sab setup ho jaata hai

---

## 3. Tailwind v4 — Global CSS mein Customization

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-heading: "Inter", sans-serif;
}
```

- Tailwind v4 mein `tailwind.config.js` ki zaroorat nahi — CSS variables se customize hota hai

---

## 4. Common Issue — Existing Styles Break Ho Sakti Hain
- Tailwind apne **CSS reset (Preflight)** se default browser styles remove karta hai
- `h1`, `h2` — font size chhoti ho jaati hai, bold nahi rehta
- Fix: Ya toh custom font-size CSS override karo ya Tailwind classes use karo

---

## 5. Styling Options Summary — Poora Section

| Method | Use Case | Scope |
|---|---|---|
| `globals.css` | Reset, fonts, CSS variables | Global |
| Plain CSS import | Page/component styles | Global (careful!) |
| CSS Modules (`.module.css`) | Component-specific styles | Scoped |
| SCSS (`.scss`) | Plain CSS + variables, nesting, mixins | Global |
| SCSS Modules (`.module.scss`) | Component-specific + SCSS features | Scoped |
| Tailwind CSS | Utility-first styling | Inline classes |

---

## Next Video → Image Optimization in Next.js (`<Image />` component)

# Image Optimization (`<Image />` Component) — S6 Ep. 5

---

## 1. Problem — Normal `<img>` Tag

```jsx
// Normal HTML image — no optimization
<img src="/ocean-mountain.jpg" />
```

- 4K image (4000×3000) → **1.5 MB** load hoti hai
- Chahe 300px card mein dikhao — poori 1.5 MB transfer hogi
- Slow loading, high bandwidth waste

---

## 2. Next.js `<Image />` Component

```jsx
import Image from "next/image"

<Image
  src="/ocean-mountain.jpg"
  width={400}
  height={300}
  alt="Ocean Mountain"
  quality={75}       // optional, default = 75
/>
```

**Required props:** `src`, `width`, `height`, `alt`

---

## 3. Compression Result

| | Normal `<img>` | `<Image />` |
|---|---|---|
| File size | 1.5 MB | ~86 KB |
| Compression ratio | — | ~18x chhota |
| Quality difference | — | Visible nahi hota |
| Format | Original (JPG) | WebP/AVIF (auto) |

> Behind the scenes → **`sharp`** npm library use hoti hai (Node.js image processing)

---

## 4. Quality Property

```jsx
<Image quality={75} />   // default — best balance
<Image quality={100} />  // max quality — bada size
<Image quality={1} />    // minimum quality — ~10 KB
```

- Default 75 → zyada cases ke liye perfect
- Change karne ki zaroorat usually nahi padti

---

## 5. Device Size Groups — How It Works

```
Aapne diya: width={400}
Next.js picks → nearest group = 640  (1x devices)
2x devices ke liye → nearest of 800 = 828
```

- Next.js ke fixed groups: 300, 384, 640, 750, 828, 1080, 1200...
- Jo closest group mile → usi resolution mein compress karke serve karta hai
- `srcset` attribute automatically set hota hai → responsive images

> Default groups theek hain — customize karna ho toh `next.config.js` mein `images.deviceSizes` set karo

---

## 6. External Images — Config Zaroori Hai

```jsx
// ❌ Direct external URL → Error aayega
<Image src="https://images.unsplash.com/photo-xyz.jpg" ... />
```

```js
// ✅ next.config.js mein allow karo
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
        pathname: "/**",   // optional — all paths allow
      },
      // Multiple servers ke liye aur objects add karo
    ],
  },
}
export default nextConfig
```

- Config change ke baad server restart karna padta hai

---

## 7. Custom Loader (Cloudinary jaise servers ke liye)

```jsx
"use client"  // loader use karne ke liye client component banana padega

const cloudinaryLoader = ({ src, width, quality }) => {
  return `https://cloudinary.com/image/upload/w_${width},q_${quality}/${src}`
}

<Image
  loader={cloudinaryLoader}
  src="image-id-123"   // sirf ID dena hai, full URL nahi
  width={400}
  height={300}
  alt="My Image"
/>
```

- `src` → image ID ya path (full URL nahi)
- Loader function → full URL build karke return karta hai
- Custom image servers ke liye useful (Cloudinary, Imgix, etc.)

---

## 8. `unoptimized` Prop — Avoid Karo

```jsx
<Image unoptimized ... />  // ❌ normal <img> jaisa behave karega
```

- Zaroorat pad jaaye toh use karo, warna mat karo

---

## 9. Local Images — Public Folder

```
public/
└── ocean-mountain.jpg

// Use karo:
<Image src="/ocean-mountain.jpg" ... />
```

---

## Key Takeaway
> Har jagah `<Image />` use karo normal `<img>` ki jagah — automatic compression, responsive sizes, aur WebP format milta hai bina kuch extra kiye

---

## ✅ Frontend Section Complete!
Next section → **API Routes (Backend in Next.js)**