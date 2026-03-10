# Client Component mein Data Fetching — S4 Ep. 1

---

## 1. Client Component mein Data Fetching
- Bilkul **React jaisa** — koi extra Next.js-specific cheez nahi
- `useState` + `useEffect` + `fetch` — same pattern

---

## 2. Code Pattern

```js
"use client"
import { useState, useEffect } from "react"

export default function PostsPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      const data = await response.json()
      setPosts(data)
    }
    fetchPosts()  // useEffect ke andar async function seedha nahi bana sakte
  }, [])  // empty array = sirf ek baar run hoga

  return (
    <div className="posts-container">
      {posts.map(({ id, title, body }) => (
        <div key={id} className="post-card">
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
      ))}
    </div>
  )
}
```

> ⚠️ `useEffect` callback ko directly `async` nahi bana sakte — andar ek alag async function banao aur call karo

---

## 3. API Response limit karna
- URL mein query param lagao:

```
https://jsonplaceholder.typicode.com/posts?_limit=5
```

---

## 4. Client-Side Fetching mein kya hota hai?

```
Server → Blank HTML bhejta hai (div empty hota hai)
     ↓
Browser → JavaScript run karta hai
     ↓
useEffect chalta hai → API call jaati hai
     ↓
Data aata hai → setState → React DOM update karta hai
```

- **View Page Source** karoge toh content **nahi dikhega** — sirf empty div hoga
- Saara HTML client pe generate hota hai

---

## 5. Client-Side Fetching ki Limitation
- SEO ke liye achha nahi — search engine ko content nahi milta
- Initial load pe blank page dikhta hai jab tak data na aaye
- **Server Component mein data fetching → zyada clean aur better** (next video)

---

## Next Video → Server Component mein Data Fetching

# Server Component mein Data Fetching — S4 Ep. 2

---

## 1. Server Component mein Fetching — Kitna Clean hai!
- **Koi `useState` nahi, koi `useEffect` nahi**
- Component ko `async` bana do aur directly `await fetch()` karo — bas itna

```js
// app/todos/page.js  — NO "use client" needed
export default async function TodosPage() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
  const todos = await response.json()

  return (
    <div className="todo-container">
      {todos.map(({ id, title, completed }) => (
        <div key={id} className="todo-item">
          <input type="checkbox" checked={completed} readOnly />
          <p>{title}</p>
        </div>
      ))}
    </div>
  )
}
```

> ⚠️ Checkbox pe `onChange` nahi dena toh `readOnly` attribute lagana zaroori hai — warna React error dega

---

## 2. Client vs Server Fetching — Fark

| | Client Component | Server Component |
|---|---|---|
| Hooks chahiye | ✅ useState + useEffect | ❌ Kuch nahi |
| API call kahan hoti hai | Browser mein | Server mein |
| View Page Source mein content | ❌ Empty div | ✅ Poora HTML |
| Network tab mein API call | ✅ Visible | ❌ Nahi dikhti |
| SEO | ❌ Kharab | ✅ Achha |

---

## 3. Next.js ka `fetch` — Normal fetch nahi hai!
- Next.js apna **extended version of fetch** provide karta hai
- Extra options support karta hai jo normal browser fetch mein nahi hote

```js
const response = await fetch("https://api.example.com/data", {
  next: { revalidate: 5 }  // ISR — har 5 sec baad revalidate
})
```

- `next.revalidate` → ISR enable karta hai us specific request ke liye
- Agar `revalidate` nahi diya → page **statically generated** hoga (build time pe)

---

## 4. Next.js fetch vs Normal fetch

```
Normal Node.js fetch  → fetch (simple function)
Next.js fetch         → async patched fetch (extended with caching + revalidation)
```

- Next.js ne fetch ko "patch" kiya hai — isliye `next: { revalidate }` option pass kar sakte hain

---

## 5. Server Component mein Direct Database Connection bhi possible hai!
- Server component ka code browser ko kabhi nahi jaata
- Isliye directly **database se connect** kar sakte ho — koi API endpoint ki zaroorat nahi
- (Aage ke videos mein cover hoga)

---

## Next Video → (Context API / Redux / State Management in Next.js)

# Loading State in Server Components — S4 Ep. 3

---

## 1. Problem — Slow API pe Blank Page
- Server component jab slow API call karta hai → poora page **blank** rehta hai jab tak response na aaye
- User ko kuch nahi dikhta — bad UX

---

## 2. Solution — `loading.js` File

- Page ke **same folder** mein `loading.js` file banao
- Jo component yahan se export hoga → woh **automatically loading state** mein dikhega

```
app/todos/
├── page.js       ← main page
└── loading.js    ← loading state (auto detect karta hai Next.js)
```

```js
// app/todos/loading.js
export default function Loading() {
  return (
    <div>
      <h1>Todos</h1>
      <p>Loading todos...</p>
    </div>
  )
}
```

- Bas itna karo — Next.js **automatically** use karega jab page ka data load ho raha ho
- File ka naam exact **`loading.js`** hona chahiye
- Component ka naam kuch bhi ho sakta hai (convention: `Loading`)

---

## 3. Shimmer Effect Loading (Better UX)

```js
// loading.js mein shimmer skeleton
export default function Loading() {
  return (
    <ul>
      {Array(5).fill(0).map((_, i) => (
        <li key={i} className="shimmer-item"></li>
      ))}
    </ul>
  )
}
```

- `Array(5).fill(0).map(...)` → 5 placeholder items banata hai
- CSS mein shimmer animation lagao → real content jaisa loading feel aata hai

---

## 4. Delay test karne ka trick
- Apni API mein artificial delay ke liye:

```
https://procoder.vercel.app?sleep=2000
```

- `sleep=2000` → 2 second baad response dega
- Loading state test karna easy ho jaata hai

---

## 5. `loading.js` vs `Suspense` — Kab kya use karein?
- Dono se **same kaam** ho sakta hai
- Difference aur use cases → **Next Video** mein cover honge

---

## Next Video → `loading.js` vs `Suspense` — Difference aur kab kya use karein

# Suspense vs `loading.js` — S4 Ep. 4

---

## 1. Core Difference

| | `loading.js` | `Suspense` |
|---|---|---|
| Kab use karo | Poora **page** blocking ho | **Component** blocking ho |
| Kaise kaam karta hai | Page-level loading state | Component-level loading state |
| Granularity | Coarse (whole page) | Fine (individual component) |

---

## 2. `loading.js` — Page Level Loading
- Jab page ka main component itself slow ho (API call page mein directly ho)
- Next.js automatically use karta hai

```
app/todos/
├── page.js      ← slow API yahan hai → poora page block hota hai
└── loading.js   ← tab tak yeh dikhta hai
```

---

## 3. `Suspense` — Component Level Loading
- Har blocking component ko **alag component** mein todlo
- Phir har component ko `<Suspense>` mein wrap karo

```js
// page.js — koi API call nahi, sirf structure
import { Suspense } from "react"
import TodoItems from "./components/TodoItems"
import SlowComponent2s from "./components/SlowComponent2s"
import SlowComponent3s from "./components/SlowComponent3s"

export default function TodosPage() {
  return (
    <div>
      <h1>Todos</h1>
      <Suspense fallback={<p>Loading todos...</p>}>
        <TodoItems />
      </Suspense>
      <Suspense fallback={<p>Loading data 1...</p>}>
        <SlowComponent2s />
      </Suspense>
      <Suspense fallback={<p>Loading data 2...</p>}>
        <SlowComponent3s />
      </Suspense>
    </div>
  )
}
```

---

## 4. Components mein API Call karna (Suspense ke saath)

```js
// components/TodoItems.js
export default async function TodoItems() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
  const todos = await res.json()
  return (
    <ul>
      {todos.map(({ id, title, completed }) => (
        <li key={id}>{title}</li>
      ))}
    </ul>
  )
}
```

- Har component apna API call khud karta hai
- Page level pe koi blocking nahi hoti

---

## 5. Parallel API Calls — Automatic!
- Jab API calls **alag-alag components** mein hoti hain toh sab **parallel** hoti hain
- Sequential nahi hota — ek ka wait nahi karna doosre ko
- 2s + 3s = **3 seconds** total (sequential hota toh 5 seconds lagte)

```
Page load hota hai →
├── TodoItems    → instantly request jaati hai → 0s mein aata hai
├── SlowComp2s   → instantly request jaati hai → 2s mein aata hai
└── SlowComp3s   → instantly request jaati hai → 3s mein aata hai
```

---

## 6. Kab Component Breakdown karo?

- ✅ **Karo** → Jab UI allow kare ki parts alag-alag load ho sakein
- ✅ **Karo** → Jab performance improve karni ho (parallel calls)
- ❌ **Mat karo** → Jab sab data ek saath dikhana zaroori ho (next video mein `Promise.all` se handle karenge)

---

## Next Video → `Promise.all` se Parallel API Calls — bina breakdown ke bhi fast loading

# Parallel API Calls in Next.js — S4 Ep. 5

---

## 1. Problem — Sequential API Calls Slow hoti hain

```js
// ❌ Sequential — ek ke baad ek, total = 0s + 2s + 3s = 5s
const res1 = await fetch("...todos")
const res2 = await fetch("...sleep=2000")
const res3 = await fetch("...sleep=3000")
```

- Har `await` ruk jaata hai jab tak response na aaye
- Independent APIs bhi ek ke baad ek call hoti hain — wasteful!

---

## 2. Solution — `Promise.all` se Parallel Calls

```js
// ✅ Parallel — sab ek saath, total = max(0s, 2s, 3s) = 3s
const [res1, res2, res3] = await Promise.all([
  fetch("...todos"),
  fetch("...sleep=2000"),
  fetch("...sleep=3000")
])

const [todos, data2s, data3s] = await Promise.all([
  res1.json(),
  res2.json(),
  res3.json()
])
```

- `Promise.all` → ek array of promises leta hai, sab parallel chalte hain
- Sab resolve hone ke baad ek saath array milti hai

---

## 3. Clean Helper Function banana

```js
// Ek reusable async function
const fetchData = async (url) => {
  const response = await fetch(url)
  return await response.json()
}

// URLs ki array banao
const urls = [
  "https://jsonplaceholder.typicode.com/todos?_limit=5",
  "https://procoder.vercel.app?sleep=2000",
  "https://procoder.vercel.app?sleep=3000"
]

// Ek hi line mein sab parallel call
const [todos, data2s, data3s] = await Promise.all(urls.map(fetchData))
```

---

## 4. Sequential vs Parallel — Kab kya use karein?

| Situation | Approach |
|---|---|
| APIs **independent** hain, component breakdown possible | ✅ Alag components + Suspense (best) |
| APIs **independent** hain, breakdown possible nahi | ✅ `Promise.all` (parallel) |
| API 2 ka request API 1 ke **response pe depend** karta hai | Sequential await (koi option nahi) |

---

## 5. Performance Comparison

```
5 APIs × 1s each:
Sequential  → 1+1+1+1+1 = 5 seconds
Parallel    → max(1,1,1,1,1) = 1 second
```

---

## Next Video → Error Handling in Data Fetching