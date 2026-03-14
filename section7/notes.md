# Route Handlers — Introduction & Backend Code in Next.js — S7 Ep. 1

---

## 1. API Routes vs Route Handlers

| | Old Next.js | New Next.js (App Router) |
|---|---|---|
| Name | API Routes | Route Handlers |
| Router | Pages Router | App Router |
| File | `pages/api/...` | `app/.../route.js` |

---

## 2. `page.js` vs `route.js`

```
app/
└── todos/
    ├── page.js    ← Page banata hai (UI)
    └── route.js   ← API endpoint banata hai
```

> ⚠️ Dono ek saath ek folder mein **nahi** rakh sakte — Next.js 15 mein error aata hai

---

## 3. `route.js` kab run hota hai?

- Server start hone pe nahi chalta
- **Jab us URL pe request aati hai tab chalta hai**
- Har request pe → function re-runs

```js
// app/todos/route.js
import { writeFile, readFile } from "fs/promises"

// Ye pure Node.js backend code hai
const contents = await readFile("hello.txt", "utf-8")
console.log(contents)  // → server terminal mein print hoga
```

---

## 4. Server Components mein bhi Backend Code Chal Sakta Hai

```js
// app/page.js (Server Component)
import { readFile } from "fs/promises"

export default async function Home() {
  const data = await readFile("hello.txt", "utf-8")
  // ye code server pe chalta hai — browser tak nahi pahunchta
  return <div>{data}</div>
}
```

- `route.js` sirf ek tarika hai — kisi bhi server component mein Node.js code chal sakta hai
- `process.cwd()` → current working directory (project root)

---

## 5. Route Handlers mein Kya Export Karna Padta Hai?

```js
// ✅ Named HTTP method functions export karo
export function GET(request) { ... }
export function POST(request) { ... }
export function PATCH(request) { ... }
export function DELETE(request) { ... }
```

- Default export allowed nahi
- Function name = HTTP method name (capital letters mein)

---

## 6. Key Takeaway
> `route.js` file mein poora Node.js environment available hai — file system, network, database, sab kuch. Next.js sirf predefined HTTP method functions export karne ki convention deta hai.

---

## Next Video → GET Route Handler properly banana (`/todos`)


# API Routes — GET Route Handler — S7 Ep. 2

---

## 1. Route Handler File — `route.js`

```
app/
├── todos/
│   └── route.js    ← API endpoint banta hai (/todos)
└── page.js
```

- Page banana ho → `page.js`
- API endpoint banana ho → `route.js`
- Dono ek saath ek folder mein nahi ho sakte

---

## 2. GET Handler — Basic Structure

```js
// app/todos/route.js
export function GET() {
  return Response.json(produceData)
}
```

---

## 3. Response Object — Teen Tarike

### Method 1 — `Response.json()` (Recommended ✅)
```js
import produceData from "../../produce.json"

export function GET() {
  return Response.json(produceData)
  // Automatically: JSON.stringify + Content-Type: application/json
}
```

### Method 2 — Manual `new Response()`
```js
export function GET() {
  return new Response(
    JSON.stringify({ message: "hello world" }),
    {
      headers: { "content-type": "application/json" },
    }
  )
}
```

### Method 3 — Plain string (❌ Avoid)
```js
return new Response("hello world")
// Browser ko pata nahi chalega ye JSON hai
// Content-Type: text/plain ho jaata hai
```

---

## 4. JSON Data File se Import karna

```js
// app/todos/route.js
import todosData from "../../todos.json"
// with { type: "json" }  ← pure JavaScript mein zaroor lagao
// Next.js mein yeh optional hai

export function GET() {
  return Response.json(todosData)
}
```

> ✅ Next.js mein JSON directly import ho jaata hai — `with { type: "json" }` optional

---

## 5. Status Code aur Status Text

```js
export function GET() {
  return Response.json(data, {
    status: 200,         // default — OK
    statusText: "OK",   // default text (change mat karo usually)
  })
}

// Common status codes:
// 200 → OK (GET success)
// 201 → Created (POST success)
// 500 → Internal Server Error
// 404 → Not Found
```

---

## 6. Content-Type Headers — MIME Types

| Content-Type | Browser ka behavior |
|---|---|
| `application/json` | JSON viewer |
| `text/plain` | Plain text |
| `video/mp4` | Video player |
| `audio/mp3` | Audio player |
| `application/pdf` | PDF viewer |
| `image/png` | Image display |

> **Rule:** Jo data bhejo → usi ka Content-Type set karo

---

## 7. Behind the Scenes — `Response` Object

- Ye JavaScript ka native `Response` class hai — Next.js ka nahi
- Browser mein `fetch()` karte ho toh jo response milti hai → same `Response` object
- `Response.json()` → shortcut method jो automatically stringify + header set karta hai

---

## Task (Next Video ke liye)
Single todo route banao:
- `GET /todos/1` → sirf ek todo return kare (id = 1 wala)

---

## Next Video → Single Item GET Route (`/todos/[id]`)

# Dynamic Route Handlers — S7 Ep. 3

---

## 1. Dynamic Route Handler — Folder Structure

```
app/
└── todos/
    ├── route.js          ← GET /todos (all todos)
    └── [id]/
        └── route.js      ← GET /todos/1, /todos/2, etc.
```

- Same concept as dynamic pages — folder name mein square brackets

---

## 2. Dynamic Segment Access karna

```js
// app/todos/[id]/route.js

export async function GET(_, context) {
  const { id } = await context.params  // params ek Promise hai → await karo

  // id type: string (URL se aata hai)
  console.log(id)  // "1", "2", "22" — string format mein
}
```

- First argument = `request` (abhi use nahi — `_` se ignore karo)
- Second argument = `context` object → `context.params` mein dynamic segments
- `params` ek **Promise** hai → `await` zaroori hai
- `id` value **string** hogi — number nahi

---

## 3. Find Operation — Sahi Tarika

```js
import todosData from "../../../todos.json"

export async function GET(_, context) {
  const { id } = await context.params

  // ✅ Sahi tarika — find by id (string vs string)
  const todo = todosData.find(todo => todo.id.toString() === id)

  // ❌ Galat tarika — index se fetch karna
  // const todo = todosData[id - 1]
  // Problem: delete ke baad index mismatch hoga
}
```

---

## 4. 404 Handle karna — Not Found Error

```js
export async function GET(_, context) {
  const { id } = await context.params
  const todo = todosData.find(todo => todo.id.toString() === id)

  if (!todo) {
    return Response.json(
      { error: "Todo not found" },
      { status: 404 }   // ← 404 = Not Found
    )
  }

  return Response.json(todo)  // 200 by default
}
```

---

## 5. String vs Number Comparison

```js
// Double equal (==) → type coercion → no conversion needed
todo.id == id  // ✅ works (but not recommended)

// Triple equal (===) → strict → convert karna padega
todo.id.toString() === id  // ✅ recommended
// ya
todo.id === Number(id)     // ✅ ye bhi theek hai
```

> `5..toString()` (double dot) — number literal pe directly method call ke liye double dot lagao, warna JS decimal samajhta hai. Variable mein store ho toh single dot kafi hai.

---

## 6. Common Mistakes — Index vs ID

```js
// ❌ Index-based (galat)
todosData[id - 1]
// Problem: id=22 ke liye index 21 pe kuch nahi → crash

// ✅ ID-based (sahi)
todosData.find(todo => todo.id.toString() === id)
// Works correctly regardless of order or gaps in IDs
```

---

## Next Video → Request Object — Properties aur Use Cases