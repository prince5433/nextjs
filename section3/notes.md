# Rendering Paradigms in Next.js — S3 Ep. 1

---

## 1. Rendering kya hai?
- HTML kahan generate hoti hai — server pe ya client (browser) pe — yahi rendering paradigm decide karta hai
- Next.js sabhi paradigms support karta hai: SSR, CSR, SSG, ISR
- Ye section Next.js ka sabse confusing part hai kyunki React sirf CSR karta hai, Express sirf SSR, lekin Next.js dono karta hai

---

## 2. Server-Side Rendering (SSR) — Purana Traditional Way
- HTML **server pe generate** hoti hai aur poori bhar ke browser ko bheji jaati hai
- Browser ko javascript execute nahi karni padti page dikhane ke liye — HTML as-is show ho jaati hai
- Har page ka alag HTML file hoti hai server pe
- SEO better hoti hai — crawlers ko full HTML content milta hai, content samajhna easy hota hai
- Drawback — page navigation pe pura page reload hota tha, slow feel aati thi

---

## 3. Client-Side Rendering (CSR) — React/Vite ka Tarika
- Server se sirf ek **empty HTML file** aati hai jisme sirf `<div id="root">` hota hai — koi content nahi
- Saath mein ek bada **JavaScript bundle** aata hai jisme saare pages ka code hota hai
- Browser JS execute karta hai → `document.createElement` se DOM banata hai → page dikhta hai
- Angular, React, Vue — inhi frameworks ne CSR popular banaya (2009-10 ke baad)
- **Fayde:** App-like feel, page reload nahi hota navigation pe, responsive aur fast lagta hai
- **Drawbacks:**
  - JS execute hone tak page blank/white dikhta hai
  - JS disable karo → page bilkul blank
  - SEO weak — crawlers ko empty HTML milti hai, content nahi dikhta
  - Bundle size bada hone pe first load slow hota hai

---

## 4. React (Vite) Production Build — Kya hota hai?
- `npm run build` karo → `dist/` folder mein sirf **4 files** generate hoti hain:
  - `index.html` — ek hi HTML file (empty, sirf div#root)
  - `main.js` — saare pages ka combined JS bundle
  - `style.css` — CSS file
  - `favicon.ico`
- Chahe `/about` jao ya `/services` — **same 4 files** aati hain server se
- Server ko URL ki parwah nahi — har request pe same files serve karta hai
- Client (browser) URL dekh ke decide karta hai kya render karna hai

---

## 5. Next.js Production Build — Kya hota hai?
- `npm run build` karo → `.next/server/app/` folder mein **alag alag HTML files** generate hoti hain:
  - `index.html` — home page
  - `about.html` — about page (full content ke saath)
  - `services.html` — services page (full content ke saath)
- Har HTML file mein us page ka **poora content** already written hota hai
- Server URL dekh ke corresponding HTML file serve karta hai
- Browser ko JS execute nahi karni padti pehle — content already present hota hai

---

## 6. Next.js — SSR + CSR Dono Saath (Best of Both Worlds)

### Pehli Visit / Page Refresh pe:
- Jis page pe user hai → us page ka **full HTML server se aata hai** → fast first load, SEO good
- Saath mein **JavaScript files** bhi aati hain
- Saath mein baaki pages ka **RSC Payload** bhi aata hai (jinka link current page pe visible hai)

### Navigation pe (Link click karne pe):
- Pura page reload nahi hota
- Already fetched **RSC Payload** use hota hai → client-side rendering hoti hai
- Fast, app-like experience milta hai — React ki tarah

---

## 7. RSC Payload (React Server Component Payload) kya hai?
- Ye poora HTML nahi hota — ek **lightweight text format** mein component ka data hota hai
- Content-Type: `text/x-component`
- Jab user navigate kare us page pe → JavaScript files is RSC data ko use karke page banati hain
- Ye HTML se bahut **chhota** hota hai — isliye fast load hota hai
- `.rsc` extension wali files server mein hoti hain — ye RSC payloads hain

### Konsa page ka RSC fetch hota hai?
- Next.js by default **sirf unhi pages ka RSC prefetch** karta hai jinke links current page pe **visible** hain
- Jo links scroll karke neeche hain aur visible nahi — unka RSC tab fetch hoga jab visible honge
- Ye bandwidth waste nahi hone deta

---

## 8. Practically kya hota hai jab page refresh karte hain?

- **Jis page pe ho** → us page ka full **HTML** aata hai server se
- **Baaki visible link wale pages** → unka **RSC payload** aata hai
- Jab un pages pe navigate karo → RSC payload use karke **client-side rendering** hoti hai (no reload)
- Agar un pages pe directly refresh karo → unka **HTML** aata hai server se

---

## 9. SSG aur ISR kya hain?
- **SSG (Static Site Generation)** → HTML server pe generate hoti hai lekin **build time pe** — runtime pe nahi
- **ISR (Incremental Static Regeneration)** → SSG ka updated version — pages time-to-time automatically regenerate hote hain
- Dono server-side ke hi part hain — client pe kuch nahi hota
- Detail agle episodes mein cover hoga

---

## 10. CSR vs SSR vs Next.js Comparison

| | CSR (React/Vite) | SSR (Traditional) | Next.js |
|---|---|---|---|
| HTML source | Empty (div#root only) | Full content | Full content |
| SEO | Weak | Strong | Strong |
| First load speed | Slow (JS execute hona padta) | Fast | Fast |
| Navigation | Fast (no reload) | Slow (full reload) | Fast (RSC + CSR) |
| JS disabled | Page blank | Page dikhta hai | Page dikhta hai |
| Files served | Same 4 files har page pe | Alag HTML har page ke liye | Alag HTML + RSC payload |
| Server | URL ignore karta hai | URL dekhta hai | URL dekhta hai |

---

## 11. Key Takeaways
- Next.js ka server **URL dekhta hai** aur corresponding page ka HTML serve karta hai
- React/Vite ka server URL **ignore** karta hai — har request pe same files
- Next.js mein **pehla load SSR**, subsequent navigation **CSR** hoti hai
- RSC payload HTML se chhota hota hai → navigation fast hoti hai
- Aage dekhenge: Client Components, Server Components, Static vs Dynamic Rendering

# Static vs Dynamic Rendering in Next.js — S3 Ep. 2

---

## 1. Static Rendering
- **Build time** pe hota hai — jab `npm run build` chalate hain
- Static routes (about, blogs, services, home) ke HTML files build time pe generate ho jaate hain
- Server pe already ready HTML stored rehta hai → request aane pe instantly serve hota hai
- Code ek baar run hota hai — runtime pe dobara nahi chalta
- `npm run build` output mein **○ (empty circle)** symbol → static page

---

## 2. Dynamic Rendering
- **Run time** pe hota hai — jab user actual request karta hai
- Dynamic routes (e.g. `/blogs/[blogId]`) ke liye har request pe fresh code run hota hai
- Build ke waqt HTML nahi banta — server pe request aane pe generate hota hai
- `npm run build` output mein **F** symbol → dynamic page
- Console log dynamic pages ka sirf server terminal mein dikhta hai, static ka nahi

---

## 3. Dono Kab Hote Hain?

| | Static Rendering | Dynamic Rendering |
|---|---|---|
| Kab | Build time (`npm run build`) | Run time (har request pe) |
| Kaun se pages | Hard-coded routes | Dynamic routes `[param]` |
| Speed | Instant (pre-generated) | Thoda slow (on-the-fly) |
| Console log | Sirf build time pe | Har request pe |

---

## 4. Client-Side Rendering saath mein bhi hota hai
- Next.js mein SSR aur CSR dono saath kaam karte hain
- Jis page pe hain → uska full HTML server se aata hai (SSR)
- Doosre pages ke links visible hain → unka **RSC Payload** prefetch hota hai
- Jab user navigate kare → RSC payload se client-side rendering hoti hai (no full reload)
- Dynamic page pe navigate karo → server pe fetch call jaati hai, fresh RSC payload aata hai

---

## 5. Development vs Production Mode
- **Development** (`npm run dev`) → har request pe code run hota hai, static pages bhi baar baar run hote hain
- **Production** (`npm run build` + `npm start`) → static pages sirf ek baar build time pe run hote hain
- Production mein static pages ka console log terminal mein nahi dikhta
- Dynamic pages ka console log production mein bhi har request pe terminal mein dikhta hai

# Static Site Generation (SSG) in Next.js — S3 Ep. 3

---

## 1. SSG kya hai?
- Dynamic pages jo normally run time pe render hote hain, unhe **build time pe pre-generate** karna
- Result → user ke request pe server already ready HTML bhejta hai, JS run nahi karna padta
- Performance bahut improve hoti hai

---

## 2. `generateStaticParams` Function
- Dynamic route ke `page.js` mein ye function export karo
- Ye function ek **array of objects** return karta hai
- Har object mein slug ka naam key hota hai aur page ID value hoti hai

```
app/blogs/[blogId]/page.js mein:

export function generateStaticParams() {
  return [
    { blogId: "1" },
    { blogId: "2" },
    { blogId: "3" },
  ]
}
```

- Values **string** mein deni hoti hain — number dene pe error aata hai
- `npm run build` pe Next.js ye function call karta hai aur har value ke liye alag HTML generate karta hai

---

## 3. API se Dynamic Data fetch karke SSG
- Function ko `async` banao aur fetch API call karo
- Response ka data map karke array of objects return karo

```
export async function generateStaticParams() {
  const res = await fetch("https://api.example.com/blogs")
  const data = await res.json()
  return data.map((item) => ({ blogId: item.id.toString() }))
}
```

- Build time pe API call hoti hai → saare pages statically generate ho jaate hain

---

## 4. Build Output mein kya dikhta hai?
- SSG pages ke liye **filled circle (●)** symbol dikhta hai
- Dynamic pages ke liye **F** symbol dikhta hai
- `.next/server/app/blogs/` folder mein har statically generated page ka HTML file milta hai

---

## 5. SSG ke baad kya hota hai?
- Statically generated pages ke liye server JavaScript nahi chalaata — seedha HTML bhejta hai
- Jo pages statically generate nahi hue (e.g. `/blogs/201` agar sirf 200 generate kiye) → **dynamically render** hote hain
- Production mein statically generated pages ke liye console log terminal mein nahi aata

---

## 6. SSG ka Limitation
- Agar page ka content frequently update hota ho → SSG kaam nahi karega
- Blogs jaise content ke liye perfect hai (ek baar likhte hain, baad mein rarely change hota hai)
- Frequently changing content ke liye → **ISR (Incremental Static Regeneration)** → Next Episode

# `dynamicParams` in Next.js SSG — S3 Ep. 4

---

## 1. Default Behaviour (dynamicParams = true)
- Build time pe jo pages generate hue (e.g. 200 pages), unke alawa agar user kisi **naye page** pe jaaye
- Toh woh page **runtime pe on-the-fly generate** ho jaata hai
- Ek baar generate hone ke baad, dobara server se nahi banaya jaata — **existing page serve** hota hai

---

## 2. `dynamicParams` Variable
- Ye ek exported variable hai jo control karta hai ki build time ke baad naye pages banen ya nahi

```js
export const dynamicParams = false  // default: true
```

- **`true` (default)** → Naye pages runtime pe bhi generate hote hain
- **`false`** → Sirf build time ke pages accessible hain, baaki sab → **404 Not Found**

---

## 3. `false` kab use karein?
- Jab hume pata ho ki pages ki count **increase nahi hogi**
- Sirf wahi pages dikhane hain jo build time pe generate hue the
- Example: Fixed product list, static blog archive

---

## 4. `true` kab rakho?
- Jab backend mein **data badhta rehta ho** (naye blogs, naye products)
- Naye pages automatically runtime pe generate hote rahein
- Default hai, kuch likhna nahi padta

---

## 5. Important Note — Development vs Production
- Development mode mein **koi bhi page statically generate nahi hota**
- Har page dynamically render hota hai dev mein
- `dynamicParams` test karne ke liye **`npm run build` → `npm start`** zaroori hai

---

## 6. Summary Table

| dynamicParams | Build time pages | Runtime new pages |
|---|---|---|
| `true` (default) | ✅ Generate hote hain | ✅ On-the-fly generate |
| `false` | ✅ Generate hote hain | ❌ 404 Not Found |

---

## Next Episode → ISR (Incremental Static Regeneration)


# Incremental Site Regeneration (ISR) in Next.js — S3 Ep. 5

---

## 1. ISR kya hai?
- SSG ka **extended version** hai — sirf SSG wale pages pe kaam karta hai
- Static pages ko **automatically regenerate** karta hai ek fixed time interval ke baad
- Bina rebuild kiye page ka content update ho sakta hai

---

## 2. `revalidate` Variable
- Page file mein ek variable export karo

```js
export const revalidate = 5  // seconds mein, default: false
```

- **`false` (default)** → Page kabhi regenerate nahi hoga jab tak dobara build na karo
- **Number (e.g. 5)** → Har 5 seconds baad page regenerate hoga (jab koi user aaye)

---

## 3. ISR kaise kaam karta hai? (Twist ⚠️)
- Revalidate time pass hone ke baad **server page background mein generate karta hai**
- Lekin jo user us waqt aaya → use **purana (stale) page** milta hai
- **Agle user** ko naya generated page milta hai
- Flow:

```
5 sec pass hue → User aaya → Purana page serve hua + Background mein naya generate
→ Next user aaya → Naya page milta hai
```

---

## 4. Revalidate time calculate karna

```js
export const revalidate = 60        // 1 minute
export const revalidate = 60 * 60   // 1 hour
export const revalidate = 60 * 60 * 24      // 1 day
export const revalidate = 60 * 60 * 24 * 30 // 1 month
```

- Content kitni baar change hota hai usi hisaab se value set karo
- Roz change hota hai → daily revalidate, monthly → monthly

---

## 5. Fetch Level pe Revalidate
- Page level ke alawa **individual fetch call** pe bhi revalidate set kar sakte ho

```js
const res = await fetch("https://api.example.com/data", {
  next: { revalidate: 5 }
})
```

- Page level vs fetch level ka exact difference → Data Fetching wale video mein
- Zyada tar cases mein dono same behave karte hain

---

## 6. Development vs Production
- **Dev mode** (`npm run dev`) → Har request pe page regenerate hota hai, revalidate ka koi effect nahi
- **Production** (`npm run build` + `npm start`) → Tab hi ISR kaam karta hai

---

## 7. Important Rules
- ISR **sirf SSG ke saath** kaam karta hai
- Agar page statically generated nahi hai toh `revalidate` ka koi effect nahi hoga
- SSG nahi → ISR ka koi matlab nahi

---

## Summary

| revalidate value | Behaviour |
|---|---|
| `false` (default) | Kabhi regenerate nahi, sirf build time pe |
| `5` (number) | Har 5 sec baad next user ke liye regenerate |
| `60 * 60 * 24` | Daily regenerate |


# Dynamically Rendering Static Pages in Next.js — S3 Ep. 6

---

## 1. Concept kya hai?
- By default → **static routes** = statically rendered, **dynamic routes** (`[id]`) = dynamically rendered
- Lekin hum **static routes ko forcefully dynamic** bana sakte hain
- Aur kuch specific methods use karne se page **automatically dynamic** ho jaata hai

---

## 2. Method 1 — `force-dynamic` Variable

```js
export const dynamic = "force-dynamic"
```

- Ye export karne se page hamesha dynamically render hoga — chahe kuch bhi ho
- Build output mein **F** symbol aayega (dynamic)
- `.next/server/app/` folder mein us page ki HTML file generate nahi hogi

---

## 3. Method 2 — Dynamic APIs use karna (Auto behaviour)
Kuch Next.js functions use karne par page **automatically dynamic** ho jaata hai:

**a) `searchParams` props await karna**
```js
export default async function Page({ searchParams }) {
  const search = await searchParams  // sirf await karne se dynamic ho jaata hai
}
```

**b) `cookies()` function from `next/headers`**
```js
import { cookies } from "next/headers"

export default async function Page() {
  const myCookies = await cookies()
}
```

**c) `headers()` function from `next/headers`**
- HTTP request headers read karne ke liye
- Ye bhi use karte hi page dynamic ho jaata hai

> ⚠️ Sirf variable banana dynamic nahi banata — **await karna zaroori hai**

---

## 4. `dynamic` Variable ke saare Values

| Value | Behaviour |
|---|---|
| `"auto"` **(default)** | Dynamic APIs use karo toh dynamic, warna static |
| `"force-dynamic"` | Hamesha dynamic, chahe kuch bhi ho |
| `"force-static"` | Hamesha static — dynamic APIs empty values return karengi |
| `"error"` | Static hona zaroori — dynamic API use karo toh **build time error** |

---

## 5. `force-static` kya karta hai?
- Page static rehta hai even if `cookies()` ya `searchParams` use karo
- Lekin in methods ki **real values nahi milti** — empty return hota hai
- Browser request build time pe nahi hoti, toh cookie/search data available nahi hota

---

## 6. `error` kya karta hai?
- Agar page mein koi bhi dynamic API (`cookies`, `searchParams`, etc.) use ho
- Toh **build time pe error** aata hai
- Use case: Ensure karna chahte ho ki page kabhi dynamic na ho — strict enforcement

---

## 7. Next.js Documentation Reference
- Sab dynamic APIs ki list docs mein milti hai:
  `nextjs.org → Docs → Rendering → Server Components → Dynamic Rendering`
- Yaad karne ki zaroorat nahi — docs mein dekh lo jab chahiye

# Streaming in Next.js — S3 Ep. 7

---

## 1. Problem — Blocking Components
- Agar koi component slow API se data fetch karta hai
- Toh **poora page tab tak load nahi hota** jab tak woh component ready na ho
- Chahe baaki sab components fast ho — ek slow component sab ko rok deta hai

---

## 2. Streaming kya hai?
- Server se content **chunks (tukdon) mein** browser ko bheja jaata hai
- Jo component ready ho gaya → woh turant browser mein render ho jaata hai
- Baaki components ke liye **fallback (loading state)** dikhta rehta hai
- Result → Page responsive lagta hai, user hang feel nahi karta

---

## 3. `Suspense` se Streaming implement karna

```js
import { Suspense } from "react"
import Views from "@/components/views"
import Likes from "@/components/likes"
import Comments from "@/components/comments"

export default function BlogsPage() {
  return (
    <div>
      <h1>Blogs</h1>

      <Suspense fallback={<p>Loading views...</p>}>
        <Views />
      </Suspense>

      <Suspense fallback={<p>Loading likes...</p>}>
        <Likes />
      </Suspense>

      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments />
      </Suspense>
    </div>
  )
}
```

- Har blocking component ko **alag `<Suspense>` mein wrap karo**
- `fallback` mein koi bhi string, div, ya custom component de sakte ho

---

## 4. Custom Loading Component banana

```js
// components/loading.js
export default function Loading({ children }) {
  return <div>Loading {children}...</div>
}
```

```js
// page mein use karo
<Suspense fallback={<Loading>views</Loading>}>
  <Views />
</Suspense>
```

- Isse loading state ko properly style kar sakte ho
- Spinner, skeleton, ya kuch bhi daal sakte ho

---

## 5. Network mein kya dikhta hai?
- Ek hi **request** jaati hai server pe
- Lekin **response stream hota hai** — ek ke baad ek chunks aate hain
- Same response mein line count badhti rehti hai jaise components ready hote hain
- Alag-alag request nahi jaati — **single stream mein sab aata hai**

---

## 6. Kab use karna chahiye?
- **Hamesha** jab component API se data fetch kar raha ho
- API fast bhi ho toh bhi Suspense lagao — future-proof rehta hai
- Jo components slow hain unhe wrap karo → baaki page instantly load hoga

---

## 7. Summary

| Without Streaming | With Streaming |
|---|---|
| Slowest component ka wait karo | Har component apni speed se load hota hai |
| Page 9 sec baad ek saath aata hai | Page turant aata hai, parts dhire-dhire fill hote hain |
| User ko hang feel hota hai | User ko responsive feel hota hai |

# Client vs Server Components in Next.js — S3 Ep. 8

---

## 1. Server Components (Default)
- Next.js mein **har component by default server component** hota hai
- Sirf server pe execute hota hai — browser ko code nahi bheja jaata
- `window`, `localStorage`, event handlers — kuch bhi browser-specific use nahi kar sakte
- Console log → **terminal mein** dikhta hai, browser mein nahi

---

## 2. Client Components
- Client component **server pe bhi aur browser pe bhi** execute hota hai
- Server pe pehle execute hota hai (initial HTML ke liye), phir browser pe bhi
- Iska **poora code browser ko bheja jaata hai**
- Browser-specific APIs aur interactivity use kar sakte hain

---

## 3. Client Component kaise banate hain?

```js
"use client"  // file ke bilkul top pe likhna hai — line 1 ya 2

export default function Likes() {
  // ab browser APIs aur hooks use kar sakte ho
}
```

> ⚠️ `"use client"` mein space hona zaroori hai — dash ya alag format kaam nahi karega

---

## 4. Kab Client Component banana padta hai?

| Use Case | Client Component chahiye? |
|---|---|
| `useState`, `useEffect` hooks | ✅ Haan |
| `onClick`, `onChange` event handlers | ✅ Haan |
| `window`, `localStorage`, `document` access | ✅ Haan |
| Sirf data fetch karke render karna | ❌ Nahi — Server Component kafi hai |

---

## 5. `typeof` se Browser APIs safely access karna
- Server pe `localStorage` directly access karna → **ReferenceError**
- Safe tarika:

```js
if (typeof localStorage !== "undefined") {
  console.log(localStorage)
}

if (typeof window !== "undefined") {
  console.log(window)
}
```

- `typeof` operator undefined variables pe error nahi deta — `"undefined"` string return karta hai

---

## 6. `async/await` Client Components mein nahi chalta

```js
// ❌ Yeh nahi chalega
"use client"
export default async function MyComponent() { ... }

// ✅ async component sirf Server Component mein kaam karta hai
```

---

## 7. Parent Client → Saare Children Client ban jaate hain

```
BlogsPage ("use client") ← parent client hai
├── Likes    ← automatically client ban gaya
├── Views    ← automatically client ban gaya
└── Comments ← automatically client ban gaya
```

- Parent ko client banate hi **usme import kiye saare components** client ban jaate hain
- Unka code bhi browser ko bheja jaata hai → **bundle size badhta hai**

---

## 8. Best Practice — Smallest Unit ko Client banao

```
BlogsPage (Server) ✅
├── Views    (Server) ✅
├── Comments (Server) ✅
└── LikeButton (Client) ✅ ← sirf isko client banao jahan interactivity chahiye
```

- **Poore page ko client mat banao** — sirf woh chota sa component client banao jisme click/state chahiye
- Baaki sab server component rehne do → browser ko kam code bheja jaayega → fast page

---

## 9. Production mein kya hota hai?
- **Server component** ka code → kabhi browser ko nahi jaata
- **Client component** ka code → minified JS file mein browser ko bheja jaata hai
- Dev mode mein sab jaata hai (debugging ke liye) — production mein sirf client component ka code jaata hai

---

## Summary

| | Server Component | Client Component |
|---|---|---|
| Default | ✅ Haan | ❌ Nahi |
| Server pe run | ✅ | ✅ |
| Browser pe run | ❌ | ✅ |
| Code browser ko jaata hai | ❌ | ✅ |
| Hooks (`useState`) | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| `async/await` | ✅ | ❌ |

# Hydration in Next.js — S3 Ep. 9

---

## 1. Hydration kya hai?
- **Pre-rendered HTML pages mein interactivity add karne ka process**
- Server se plain HTML aata hai browser mein → phir JavaScript us HTML ke saath connect hoti hai → event listeners attach hote hain
- Yahi process **hydration** kehlata hai

---

## 2. Kaise kaam karta hai?

```
Server → Plain HTML generate karta hai (button, links sab HTML mein hain)
     ↓
Browser → HTML receive karta hai → page dikhta hai
     ↓
JavaScript bundle aata hai → HTML elements dhundh ke event listeners attach karta hai
     ↓
Ab page fully interactive hai (clicks, nav sab kaam karta hai)
```

---

## 3. Hydration sirf Client Components mein hoti hai? — ❌ Nahi
- Server-only page pe bhi hydration hoti hai
- Reason → **Next.js ke `<Link>` tags** pe click event listeners lagte hain
- Ye default anchor behavior (full page reload) rok ke **client-side navigation** karte hain
- Isliye links hone par bhi hydration zaroori hai

---

## 4. Kya bina kisi Client Component aur Links ke bhi Hydration hoti hai?
- **Haan** — Development mode mein Next.js check karta hai ki:
  > "Server ne jo HTML bheja tha, wahi browser pe render ho raha hai ya nahi?"
- Agar mismatch ho → **Hydration Error** aata hai

---

## 5. Hydration Error kab aata hai?
- Jab server ka rendered HTML aur browser ka rendered HTML **alag ho**
- Common cause → Browser extensions (e.g. Dark Mode extension) jo DOM modify kar dete hain
- Agar extension page ka HTML badal de → server HTML ≠ client HTML → Error

---

## 6. Summary

| Situation | Hydration hoti hai? |
|---|---|
| Client component hai page pe | ✅ Haan |
| Sirf `<Link>` tags hain (no client component) | ✅ Haan |
| Koi link ya client component nahi | ✅ Haan (dev mode mein check hota hai) |
| Server aur client HTML match nahi karte | ⚠️ Hydration Error |

---

## Next Episode → Hydration Errors detail mein — kyu aate hain, kaise fix karte hain

# Hydration Errors in Next.js — S3 Ep. 10

---

## 1. Hydration Error kab aata hai?
- **Ek hi reason** → Server ne jo HTML bheja aur client ne jo HTML render kiya — **dono match nahi karte**
- Yeh mismatch different cheezein cause kar sakti hain

---

## 2. Common Causes of Hydration Error

**a) Browser-specific condition (`typeof window`)**
```js
// ❌ Server pe "server" render hoga, client pe "client" — mismatch!
if (typeof window === "undefined") {
  return <p>server</p>
} else {
  return <p>client</p>
}
```

**b) `Math.random()` use karna**
```js
// ❌ Server pe alag value, client pe alag value
return <p>{Math.random()}</p>
```

**c) `Date.now()` use karna**
```js
// ❌ Server pe alag timestamp, client pe alag timestamp
return <p>{Date.now()}</p>
```

**d) Browser Extensions**
- Dark mode ya koi aur extension jo DOM modify kare → server HTML ≠ client HTML → Error

---

## 3. Hydration Error sirf Development mein dikhta hai
- **Production mode** mein koi error nahi dikhta user ko
- Lekin **user experience kharab** hota hai — page ka content change hota hai load ke baad (**CLS — Content Layout Shift**)
- Slow network pe clearly dikhta hai — ek value aati hai phir suddenly badal jaati hai
- Next.js dev mode mein batata hai ki "tum kuch galat kar rahe ho"

---

## 4. Hydration Error kyun important hai?

```
Server HTML bhejta hai → Browser HTML dikhata hai (fast)
     ↓
JavaScript aata hai → Hydration hoti hai → Poora component dobara run hota hai client pe
     ↓
Agar output alag nikla → DOM change ho jaata hai → User ko "flash" dikhta hai
```

- Yeh **bad UX** hai — user ko lagta hai page toot raha hai

---

## 5. Error kaise fix karein?
- **Same output** server aur client dono pe produce karo
- Browser-specific code ko **`useEffect`** mein daalo (sirf client pe chalta hai)
- `Math.random()` ya `Date.now()` ka output agar render karna ho → server pe consistent value lo

---

## 6. Kab Error nahi aata?
```js
// ✅ Date.now() use kiya lekin DOM mein render nahi kiya — no error
const timestamp = Date.now()
if (timestamp) return <p>5</p>  // hamesha same output
```
- Agar output same rahe server aur client pe → koi error nahi

---

## 7. Development mein Hydration Issues avoid karne ka tip
- **Incognito mode** mein develop karo — extensions DOM modify nahi karte
- Ya extension temporarily off karo

---

## Section Summary — Rendering Paradigms Complete ✅

| Concept | Kya hai |
|---|---|
| **SSR** | Server pe har request pe render |
| **SSG** | Build time pe pre-render |
| **ISR** | SSG + time-based regeneration |
| **Dynamic Rendering** | Runtime pe render (force-dynamic, cookies, searchParams) |
| **Streaming** | Suspense se chunks mein content bhejo |
| **Server Component** | Sirf server pe run, code browser ko nahi jaata |
| **Client Component** | Server + client dono pe run, code browser ko jaata hai |
| **Hydration** | Pre-rendered HTML mein interactivity add karna |

---

## Next Section → Data Fetching in Next.js (fetch API + external libraries)