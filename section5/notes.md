# Error Handling in Next.js — S5 Ep. 1

---

## 1. Problem — Unhandled Error = Poora App Crash
- Kisi ek page pe error aaye → **poori application white screen** ho jaati hai
- Header, navbar, sab kuch chala jaata hai
- User kuch bhi nahi kar sakta

---

## 2. Solution — `error.js` File

Page ke **same folder** mein `error.js` banao:

```
app/blogs/[blogId]/
├── page.js       ← yahan error aata hai
└── error.js      ← error yahan catch hoga
```

```js
// error.js — MUST be a Client Component
"use client"

export default function Error({ error }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      {/* Development mein dekh sakte ho, production mein mat dikhao */}
      {/* <p>{error.message}</p> */}
      <p>Error ID: {error.digest}</p>
    </div>
  )
}
```

> ⚠️ `error.js` component **"use client"** hona zaroori hai — warna Next.js error dega

---

## 3. `error.js` kaise kaam karta hai?
- Next.js automatically page ko **Error Boundary** mein wrap karta hai
- Error aane pe → `error.js` ka component **fallback** ke roop mein dikhta hai
- Baaki app normal kaam karta rehta hai

```
Layout
└── Error Boundary (error.js)
    └── Page (page.js)  ← yahan error aaya
```

---

## 4. `error` Object ke Properties

| Property | Kya hai | Production mein |
|---|---|---|
| `error.message` | Human-readable error message | ❌ Empty/hidden |
| `error.digest` | Unique error ID (server log se match karo) | ✅ Available |
| `error.stack` | Stack trace | ❌ Limited info |

> **Production mein `error.message` UI pe mat dikhao** — sensitive server info leak ho sakti hai

---

## 5. Production mein Error Logging

```bash
# Standard output + errors dono file mein save karo
npm start > server.log 2>&1

# Append karo (restart pe delete na ho)
npm start >> server.log 2>&1
```

- `>` → overwrite karta hai
- `>>` → append karta hai
- `2>&1` → standard error ko standard output ke saath redirect karta hai

---

## 6. Error Handle karne ka Sahi Approach

```js
// ❌ Error throw karna — unexpected crash
if (blogId % 2 === 0) throw new Error("Blog ID must be odd")

// ✅ Gracefully return karna — better UX
if (blogId % 2 === 0) {
  return <p>Blog ID can only be an odd number.</p>
}
```

- `error.js` — **unexpected/unintentional errors** ke liye
- Known validation errors → directly component mein handle karo

---

## Next Video → Error se Recovery (reset/retry without full page reload)

# Error Recovery in Next.js — S5 Ep. 2

---

## 1. Teen Tarike — Error se Recover karna

---

### Tarika 1 — Message dikhao (Simplest)

```js
"use client"
export default function Error({ error }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>Try to reload this page.</p>
    </div>
  )
}
```

- User manually reload kare → error 50% chance pe fix ho jaata hai
- Sabse simple lekin best UX nahi

---

### Tarika 2 — Hard Reload Button

```js
"use client"
export default function Error() {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  )
}
```

- Poora page reload hota hai → simple but heavy

---

### Tarika 3 — Soft Reset (Best) ✅

```js
"use client"
import { useRouter } from "next/navigation"
import { startTransition } from "react"

export default function Error({ error, reset }) {
  const router = useRouter()

  function handleRetry() {
    startTransition(() => {
      router.refresh()  // server component dobara run hoga
      reset()           // error boundary reset hoga
    })
  }

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={handleRetry}>Try Again</button>
    </div>
  )
}
```

---

## 2. Tarika 3 kaise kaam karta hai?

```
User "Try Again" click karta hai
     ↓
router.refresh() → Server pe request jaati hai → Server component dobara run hota hai
     ↓
startTransition → Naya data aane ka wait karta hai
     ↓
reset() → Error boundary reset hoti hai → Naya data UI mein show hota hai
```

- Poora page reload nahi hota — **sirf component update hota hai**
- `startTransition` zaroori hai — bina iske component update nahi dikhta

---

## 3. Kyu `reset()` akela kaam nahi karta?

- `reset()` sirf **client-side** error boundary reset karta hai
- Server code dobara nahi chalaata
- `router.refresh()` server pe nayi request bhejta hai → fresh data aata hai
- **Dono saath** lagate hain tabhi properly fix hota hai

---

## 4. `startTransition` kyu chahiye?

- `router.refresh()` asynchronous hai — data aane mein time lagta hai
- Bina `startTransition` ke — component immediately reset ho jaata hai, naya data nahi aata
- `startTransition` ke saath — data aane ka wait karta hai, phir UI update hota hai

---

## Summary

| Method | Full Reload? | Server Code Runs? | Best For |
|---|---|---|---|
| Message only | ✅ Manual | ✅ On reload | Simple errors |
| `window.location.reload()` | ✅ Hard reload | ✅ Yes | Quick fix |
| `router.refresh()` + `reset()` + `startTransition` | ❌ No | ✅ Yes | **Best UX** |

---

## Next Video → Nested Route Error Handling

# Nested Route Error Handling in Next.js — S5 Ep. 3

---

## 1. Error Bubbling — Kaise kaam karta hai?
- Kisi child route mein error aaye → **parent route ka `error.js`** pakad leta hai
- Jitna upar jayenge `error.js`, utne zyada routes handle honge

---

## 2. `error.js` kahan rakho — Fark

### Option A — Child Folder mein (Narrow scope)
```
app/blogs/[blogId]/
├── page.js
├── layout.js
└── error.js   ← sirf is page ka error handle karega
                  layout.js ka code visible rehega
```

### Option B — Parent Folder mein (Wide scope)
```
app/blogs/
├── error.js   ← blogs/ aur blogs/[blogId]/ dono ke errors handle karega
│               lekin layout bhi replace ho jaata hai
└── [blogId]/
    ├── page.js
    └── layout.js
```

---

## 3. Component Hierarchy — Sabse Important ⚠️

```
Layout          ← sabse upar
└── Error Boundary (error.js)
    └── Page    ← sabse neeche
```

- **Page mein error** → Error Boundary pakdega, **Layout dikhta rehega** (agar error.js same folder mein ho)
- **Layout mein error** → Error Boundary pakad nahi sakta kyunki Layout upar hai

---

## 4. Layout ka Error Handle karna

```
app/blogs/
├── error.js        ← blogs/[blogId]/layout.js ka error handle karega
└── [blogId]/
    ├── page.js
    ├── layout.js   ← yahan error aata hai
    └── error.js    ← page.js ka error handle karega, layout visible rehega
```

- Layout ka error → **ek level upar** ka `error.js` pakdega
- Agar layout ka error pakadna ho toh `error.js` parent folder mein rakhna hoga

---

## 5. Global Error — App Level

```
app/
├── error.js        ← saare pages ke errors handle karega (root layout ke andar)
├── layout.js       ← root layout
└── page.js
```

- `app/error.js` → root layout ke andar ke saare errors handle karta hai
- Root layout ka error → **alag tarike se handle hoga** (next video)

---

## 6. Multiple `error.js` Files — Best Practice

```
app/
├── error.js              ← global fallback
└── blogs/
    ├── error.js          ← blogs section ka fallback (layout error bhi)
    └── [blogId]/
        ├── layout.js
        └── error.js      ← individual blog page ka fallback (layout visible rehega)
```

---

## 7. Quick Rule Summary

| Error kahan aaya | error.js kahan rakhein | Layout dikhega? |
|---|---|---|
| `page.js` | Same folder mein | ✅ Haan |
| `page.js` | Parent folder mein | ❌ Nahi |
| `layout.js` | Parent folder mein | Depends on hierarchy |
| Root `layout.js` | → Next video (global-error.js) | — |

---

## Next Video → Global Error Handling (Root Layout errors)

# Client-Side vs Server-Side Exceptions — S5 Ep. 4

---

## 1. Do Types ke Errors

| | Server-Side Exception | Client-Side Exception |
|---|---|---|
| Kahan aata hai | Server rendering fail hoti hai | Client rendering fail hoti hai |
| Production mein | ❌ Error message hidden | ✅ Error message visible in console |
| `error.digest` | ✅ Available | ❌ Nahi hota |
| Recovery | `router.refresh()` + `reset()` + `startTransition` | Sirf `reset()` kafi hai |
| Page white hota hai? | ✅ Haan | ✅ Haan (rendering block ho toh) |

---

## 2. Client-Side Errors — Do Types

### Type A — Console Error (Non-Critical)
```js
// Rendering block nahi hoti
onClick={() => console.log(undefinedVariable)}
```
- Sirf console mein red error aata hai
- Application normally chalta rehta hai
- Dev mode mein popup neeche corner mein aata hai, close karo → app chal raha hai

### Type B — Rendering Error (Critical)
```js
// Rendering block ho jaati hai → app white ho jaata hai
onClick={() => setFruits(null)}
// phir render mein fruits.map(...) → Cannot read properties of null
```
- Dev mode mein popup directly open hota hai (highlighted)
- Close karo → poori app white
- Hard reload karna padta hai

---

## 3. Client-Side Exception Handle karna

```js
// about/error.js
"use client"

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  )
}
```

> ✅ Client-side error ke liye **sirf `reset()`** kafi hai — `router.refresh()` aur `startTransition` ki zaroorat nahi

---

## 4. Kab `reset()` kafi hai vs kab `router.refresh()` chahiye?

| Error Type | Recovery Method |
|---|---|
| **Client Component** mein rendering error | `reset()` only |
| **Server Component** mein error | `router.refresh()` + `reset()` + `startTransition` |

- `reset()` → Component ko fresh render karta hai, default state se start karta hai
- Server error mein → server se naya data lana padta hai, isliye `router.refresh()` bhi chahiye

---

## 5. Production mein Difference

```
Server-side error → message hidden, sirf digest ID
Client-side error → full error message console mein visible (no sensitive server info)
```

- Client-side errors hide nahi kiye jaate — browser developer tools mein full details milti hain
- Server-side errors production mein deliberately hide hote hain — sensitive info protect karne ke liye

---

## 6. Quick Debug Tip
- Dev mode mein popup highlighted → **Rendering problem** (critical)
- Dev mode mein popup corner mein → **Console error** (non-critical)
- Hydration errors mostly browser extensions se aate hain → **Incognito mode** mein test karo

---

## Next Video → Global Error Handling (`global-error.js`)

# Global Error Handling (`global-error.js`) — S5 Ep. 5

---

## 1. Problem — Root Layout ka Error kaun handle karega?
- `error.js` sirf **page-level errors** handle karta hai
- Root `layout.js` ka error → `error.js` **nahi** pakad sakta (layout upar hai hierarchy mein)
- Iske liye → **`global-error.js`** file

---

## 2. `global-error.js` — Setup

```
app/
├── layout.js           ← root layout
├── error.js            ← home/nested pages ka error
├── global-error.js     ← root layout ka error (yeh sabse bada fallback hai)
└── page.js
```

```js
// app/global-error.js
"use client"

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2>Something went wrong in root layout!</h2>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </body>
    </html>
  )
}
```

> ⚠️ **`<html>` aur `<body>` tag MUST provide karo** — `global-error.js` root layout ko replace karta hai, isliye ye tags zaroor chahiye

---

## 3. `global-error.js` kab trigger hota hai?
- **Sirf Production mode mein** — development mein normal error popup aata hai
- Root `layout.js` mein error aane par
- `error.js` se bhi na pakde jaane wale errors

---

## 4. Restrictions in `global-error.js`

```js
// ❌ Ye sab kaam nahi karta global-error.js mein
import { useRouter } from "next/navigation"
startTransition(...)
router.refresh()

// ✅ Sirf yeh karo
window.location.reload()
```

- App Router mounted nahi hota yahan → hooks aur navigation APIs kaam nahi karti
- **Minimum JavaScript** rakho — zyada complex code mat daalo
- CSS import kar sakte ho styling ke liye

---

## 5. Styling in `global-error.js`
- Root layout ka CSS yahan automatically nahi aata
- CSS manually import karna padega:

```js
import "@/app/globals.css"

export default function GlobalError() {
  return (
    <html className="dark">
      <body>
        <h2>Something went wrong!</h2>
      </body>
    </html>
  )
}
```

---

## 6. Complete Error Handling Hierarchy

```
global-error.js         ← Root layout errors (Production only)
└── Root Layout
    └── error.js        ← App-level page errors
        └── blogs/
            ├── error.js    ← blogs section errors
            └── [blogId]/
                ├── layout.js
                └── error.js  ← individual page errors (layout visible rehega)
```

---

## 7. Summary — Poora Error Handling Section

| File | Handles | Works in Dev? |
|---|---|---|
| `page/error.js` | Page rendering errors | ✅ |
| `parent/error.js` | Nested route errors + layout (layout disappears) | ✅ |
| `global-error.js` | Root layout errors | ❌ Production only |
| `reset()` | Client-side recovery | ✅ |
| `router.refresh()` + `reset()` + `startTransition` | Server-side recovery | ✅ |
| `window.location.reload()` | Hard reload (global-error mein) | ✅ |

---

## Next Section → API Routes in Next.js

# CSS in Next.js (Global CSS) — S6 Ep. 1

---

## 1. Normal CSS Import karna

```js
// page.js ya kisi bhi component mein
import "./home.css"
import "./blog-id.css"
```

- Koi magic nahi — seedha import karo, kaam karega
- Next.js suggestions nahi deta CSS files ke liye — manually type karo

---

## 2. Important Behavior — CSS Global Ho Jaati Hai ⚠️

```
home.css sirf page.js mein import kiya
     ↓
User home page pe gaya → CSS load hui
     ↓
Ab user blog page pe gaya → CSS abhi bhi apply hogi!
```

- Ek baar CSS load ho jaaye → **poori application** pe apply hogi
- CSS file **jis page/component mein import ho** → tab tak nahi load hogi jab tak user us page pe na jaaye
- **Hard reload** karo toh CSS unload ho jaati hai (fresh start)

---

## 3. Import Order Matters

```js
// blog-id.css ke styles win karenge (neeche import kiya)
import "./home.css"
import "./blog-id.css"

// home.css ke styles win karenge (neeche import kiya)
import "./blog-id.css"
import "./home.css"
```

- Neeche wala import upar wale ko **overwrite** karta hai
- CSS `!important` se ye override kar sakte ho

---

## 4. Normal CSS ka Problem — Class Conflict

```css
/* blog-id.css */
.title { font-size: 2.5rem; }
```

- Agar kisi aur page pe bhi `.title` class ho → wahan bhi apply hoga!
- Ye globally pollute kar sakta hai

---

## 5. Solution — Parent Class + Nesting

```css
/* blog-id.css */
.blog-id {
  .title {
    font-size: 2.5rem;
    font-family: cursive;
  }
}
```

```js
// blog/[blogId]/page.js
export default function BlogPage() {
  return (
    <div className="blog-id">
      <h1 className="title">Blog Title</h1>
    </div>
  )
}
```

- `.title` sirf tab apply hoga jab `.blog-id` parent ho
- CSS Nesting modern browsers mein natively support hoti hai
- Conflict ka khatra kam ho jaata hai

---

## 6. Normal CSS Kab Use Karein?

| Use Case | Normal CSS | Module CSS |
|---|---|---|
| Global styles (fonts, colors, reset) | ✅ Best | ❌ Overkill |
| Component-specific styles | ⚠️ Parent class lagao | ✅ Better |
| Zero conflict guarantee | ❌ | ✅ |

---

## 7. Key Takeaway
> Normal CSS by default **global style** ki tarah behave karta hai — component-specific karna ho toh parent class ya CSS nesting use karo

---

## Next Video → CSS Modules (Scoped CSS) in Next.js

# CSS Modules in Next.js — S6 Ep. 2

---

## 1. CSS Modules kya hai?
- Normal CSS → globally apply hoti hai, class names conflict kar sakti hain
- CSS Modules → **automatically class names unique** ban jaate hain → **scoped styles**
- React mein bhi same concept — Next.js mein koi difference nahi

---

## 2. File Naming Convention

```
Normal CSS:  blog-id.css
CSS Module:  blog-id.module.css   ← .module. lagana zaroori hai
```

---

## 3. Import karna — Alag tarika

```js
// ❌ Normal CSS wala tarika — CSS Modules mein kaam nahi karega
import "./blog-id.module.css"

// ✅ CSS Modules ka sahi tarika
import styles from "./blog-id.module.css"
```

---

## 4. Classes Use karna

```js
// CSS module file
// blog-id.module.css
.title {
  font-size: 2.5rem;
  font-family: cursive;
}

// Component mein
export default function BlogPage() {
  return <h1 className={styles.title}>Blog Title</h1>
}
```

- `styles` ek object hai
- `styles.title` → automatically generated unique class name milti hai
- Behind the scenes: `.title` → `.blog-id_title__xyz123` jaisi class ban jaati hai

---

## 5. Element Selectors CSS Modules mein

```css
/* Ye bhi kaam karta hai — element selectors scoped nahi hote */
body {
  background-color: cadetblue;
}

/* Ye scoped hai — class name change hogi */
.title {
  color: yellow;
}
```

- **Element selectors** (`body`, `h1`, `p`) → globally apply hote hain, scoped nahi
- **Class selectors** (`.title`, `.card`) → scoped hote hain, rename hote hain

---

## 6. Multiple Modules — No Conflict!

```js
// home/page.js
import styles from "./home.module.css"
// styles.title → home_title__abc

// blogs/[blogId]/page.js
import styles from "./blog-id.module.css"
// styles.title → blogId_title__xyz
```

- Dono files mein `.title` class hai — **koi conflict nahi** kyunki names alag hain
- `styles.title` same naam se use karo dono mein — internally alag hoga

---

## 7. Normal CSS vs CSS Modules

| | Normal CSS | CSS Modules |
|---|---|---|
| Class scope | Global | Component-scoped |
| Conflict risk | ✅ High | ❌ None |
| Element selector | Global | Global |
| Import syntax | `import "./file.css"` | `import styles from "./file.module.css"` |
| Usage | `className="title"` | `className={styles.title}` |

---

## 8. Best Practice

```js
// ✅ Best — styles object se access karo
<div className={styles.title}>

// ⚠️ Avoid — destructure mat karo (variable conflict ho sakta hai)
const { title } = styles  // agar koi aur 'title' variable ho toh conflict
```

---

## Next Video → SCSS / SASS in Next.js

# SCSS / SASS in Next.js — S6 Ep. 3

---

## 1. Setup — Ek Command bas

```bash
npm install sass --save-dev
```

- Sirf yeh package install karo — koi extra config nahi
- Production mein SCSS → CSS mein convert ho jaata hai (dev dependency kafi hai)

---

## 2. SCSS vs SASS — Do Syntaxes

| | SCSS | SASS |
|---|---|---|
| Curly braces | ✅ Hain | ❌ Nahi (indentation based) |
| Looks like | CSS | Python |
| Commonly used | ✅ Companies mein | Rare |

- **SCSS use karo** — zyada popular aur familiar

---

## 3. File Extensions

```
Normal CSS:    home.css
SCSS:          home.scss
SCSS Module:   home.module.scss
```

---

## 4. SCSS Features — Example

```scss
// home.scss

// Variables
$primary-color: #fff;
$hot-pink: hotpink;

// Element styles
body {
  background-color: $hot-pink;
}

// Nesting (proper highlighting bhi milti hai)
.blog-id {
  .title {
    color: $primary-color;
    font-size: 2rem;
  }
  
  .para {
    background-color: cadetblue;
  }
}
```

> ✅ SCSS mein nesting highlight hoti hai — normal CSS file mein nesting ka proper highlighting nahi hota

---

## 5. Import karna

```js
// Normal SCSS (global)
import "./home.scss"

// SCSS Module (scoped)
import styles from "./home.module.scss"
import styles2 from "./another.module.scss"  // Multiple modules → alag naam do
```

---

## 6. SCSS Module Use karna

```scss
/* home.module.scss */
.para {
  background-color: cadetblue;
}
```

```js
import styles from "./home.module.scss"

export default function Home() {
  return <p className={styles.para}>Hello</p>
}
```

- CSS Modules ki tarah exactly kaam karta hai — sirf extension `.module.scss` hai

---

## 7. Customization (Advanced)

- `next.config.js` mein SCSS options pass kar sakte ho
- SCSS ke advanced features (mixins, functions) — separately seekhna padega

---

## Summary

| Feature | Steps |
|---|---|
| SCSS setup | `npm install sass --save-dev` |
| Global SCSS | `import "./file.scss"` |
| Scoped SCSS Module | `import styles from "./file.module.scss"` |
| Variables | `$var-name: value;` |
| Nesting | Normal CSS ki tarah — better highlighting |

---

## Next Video → Tailwind CSS Setup in Next.js