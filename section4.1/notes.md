# Server Component inside Client Component — S4 Ep. 6

---

## 1. Problem — Import karo toh Server → Client ban jaata hai
- Agar koi Server Component ko Client Component mein **import** karo
- Toh woh automatically **Client Component** ban jaata hai
- Uska code browser ko bheja jaata hai — unnecessary overhead

---

## 2. Solution — Children Pattern

Server component ko **parent (server) se prop ke roop mein pass karo** — import mat karo client component mein directly

```
// ❌ GALAT — ServiceItem server → client ban jaata hai
"use client"
import ServiceItem from "./ServiceItem"  // yahan import = client ban gaya

export default function ServiceList() {
  return <ul><ServiceItem /></ul>
}
```

```
// ✅ SAHI — ServiceItem server component rehta hai
// page.js (Server Component)
import ServiceList from "./ServiceList"
import ServiceItem from "./ServiceItem"

export default function ServicesPage() {
  return (
    <ServiceList>
      {services.map(s => <ServiceItem key={s} service={s} />)}
    </ServiceList>
  )
}

// ServiceList.js (Client Component)
"use client"
export default function ServiceList({ children }) {
  return <ul>{children}</ul>
}
```

---

## 3. Children Pattern kaise kaam karta hai?

```
ServicesPage (Server) → ServiceItem render karta hai → children prop mein deta hai
     ↓
ServiceList (Client) → children receive karta hai → render karta hai
     ↓
ServiceItem → Server Component hi rehta hai — code browser ko nahi jaata
```

- **Key insight** → Jo cheez parent (server) mein render hoti hai, woh server pe hi rehti hai
- Client component sirf `{children}` ko display karta hai — khud render nahi karta

---

## 4. `children` prop — Do tarike

```js
// Tarika 1 — explicit prop
<ServiceList children={<ServiceItem />} />

// Tarika 2 — JSX children (preferred)
<ServiceList>
  <ServiceItem />
</ServiceList>
```

Dono same kaam karte hain — tarika 2 zyada clean hai

---

## 5. Proof — Code browser ko nahi jaata
- Server Component ka code → **JS bundle mein nahi aata**
- Client Component ka code → JS bundle mein aata hai
- Network tab mein JS files check karo — server component ka koi code nahi milega

---

## 6. Kab use karna hai yeh pattern?
- Jab **Client Component** (usePathname, useState, etc.) ke **andar** Server Component render karna ho
- **Context API aur Redux setup** mein bhi yahi pattern use hota hai — next video mein dekhenge

---

## Summary

| Approach | ServiceItem kaisa render hoga? |
|---|---|
| Client Component mein import karo | ❌ Client ban jaata hai |
| Children prop se pass karo | ✅ Server Component rehta hai |

---

## Next Video → Context API aur Redux setup in Next.js   

# Context API & Redux Setup in Next.js — S4 Ep. 7

---

## 1. Context API Setup — Steps

### Step 1 — Context folder banao
```
context/
└── ThemeContext.js   ← "use client" lagana zaroori hai
```

### Step 2 — Context + Provider banao

```js
"use client"
import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  // localStorage se default value lene ke liye (useEffect mein — server pe nahi chalega)
  useEffect(() => {
    setIsDark(localStorage.getItem("isDark") === "true")
  }, [])

  // isDark change hone pe HTML class toggle karo
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("isDark", isDark)
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook — import simple karne ke liye
export function useTheme() {
  return useContext(ThemeContext)
}
```

### Step 3 — `layout.js` mein wrap karo

```js
// app/layout.js
import { ThemeProvider } from "@/context/ThemeContext"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Step 4 — Client Component mein use karo

```js
// components/Header.js  ("use client" zaroori hai)
import { useTheme } from "@/context/ThemeContext"

export default function Header() {
  const { isDark, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{isDark ? "🌙" : "☀️"}</button>
}
```

---

## 2. Important Rules

**`localStorage` directly `useState` default mein mat daalo:**
```js
// ❌ Server pe localStorage nahi hota — error
const [isDark, setIsDark] = useState(localStorage.getItem("isDark"))

// ✅ useEffect mein daalo — sirf client pe chalega
useEffect(() => {
  setIsDark(localStorage.getItem("isDark") === "true")
}, [])
```

**Context sirf Client Components mein use ho sakta hai:**
```js
// ❌ Server Component mein — error aayega
import { useTheme } from "@/context/ThemeContext"
// "attempt to call useTheme from server component"

// ✅ Sirf Client Component mein import karo
"use client"
import { useTheme } from "@/context/ThemeContext"
```

---

## 3. Dark Mode CSS Pattern
- HTML element pe `dark` class add/remove karo
- Global CSS mein variable define karo:

```css
/* globals.css */
:root { --bg: white; --text: black; }
.dark { --bg: black; --text: white; }
```

- Server components bhi dark mode se affect honge — kyunki CSS global hai, JS nahi

---

## 4. Redux Setup — Same Pattern

```
store/
├── store.js       ← Redux store
└── counterSlice.js ← Reducer

app/layout.js      ← Provider yahan wrap karo
```

```js
// app/layout.js
import { ReduxProvider } from "@/store/Provider"  // "use client" wala wrapper

export default function RootLayout({ children }) {
  return (
    <html><body>
      <ReduxProvider>{children}</ReduxProvider>
    </body></html>
  )
}
```

- Redux `useSelector` / `useDispatch` → sirf **Client Components** mein kaam karta hai
- Server Component mein Redux state nahi use kar sakte

---

## 5. Summary

| | Context API | Redux |
|---|---|---|
| Provider wrap karo | `app/layout.js` mein | `app/layout.js` mein |
| Provider file | `"use client"` lagao | `"use client"` lagao |
| State use karo | `useContext` / custom hook | `useSelector` |
| Kahan use kar sakte | ✅ Client Component only | ✅ Client Component only |
| Server pe CSS effect | ✅ Global CSS se | ✅ Global CSS se |

---

## Next Section → Error Handling in Next.js