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