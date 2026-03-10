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