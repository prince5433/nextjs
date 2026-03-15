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

# Request Object in Route Handlers — S7 Ep. 3

---

## 1. Request Object kya hai?

- Ye Next.js ka specific feature **nahi** hai — JavaScript ka native `Request` class hai
- Same object jo `fetch()` ke andar banta hai
- Convention: pehle `req` likhte the (Node.js style), ab `request` likhte hain

```js
export async function GET(request) {
  console.log(request)  // → Request object
}
```

---

## 2. Request Object — Important Properties

```js
export async function GET(request) {
  console.log(request.method)   // "GET", "POST", "DELETE", etc.
  console.log(request.url)      // Full URL → "http://localhost:3000/todos"
  console.log(request.headers)  // All request headers
  console.log(request.body)     // ReadableStream (POST/PUT body ke liye)
}
```

---

## 3. Headers — Browser Automatically Attach Karta Hai

```
host: localhost:3000
connection: keep-alive
user-agent: Mozilla/5.0 ... Chrome/...
accept: text/html,...
accept-language: en-US,...
cookie: name=procoder; token=xyz;  ← agar cookies set hain toh
```

- Browser automatically ye headers attach karta hai
- `cookie` header tabhi aata hai jab cookies set hon
- `connection: keep-alive` → TCP connection maintain karne ke liye

---

## 4. `Request` Object Manually Banana (How fetch works internally)

```js
// Browser mein fetch karte waqt behind the scenes yeh hota hai:
const req = new Request("https://api.example.com/todos", {
  method: "POST",
  body: JSON.stringify({ name: "ProCoder" }),
})

const response = await fetch(req)  // Request object directly pass kar sakte ho
```

---

## 5. Route Handler mein Request Use karna

```js
export async function GET(request) {
  const url = request.url         // full URL
  const method = request.method   // "GET"
  
  // Query params nikalna
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get("filter")  // ?filter=active
  
  return Response.json({ url, method })
}
```

---

## 6. Kab Use Karna Hai?

| Zaroorat | Property |
|---|---|
| Full URL chahiye | `request.url` |
| HTTP method check | `request.method` |
| Request headers | `request.headers` |
| POST body data | `request.body` / `request.json()` |
| Cookies | `request.headers.get("cookie")` |
| Nahi chahiye | `_` (underscore se ignore karo) |

---

## Task (Next Video ke liye)
POST route banao `/todos` mein:
- Naya todo create karo
- `todos.json` file mein write karo (`writeFile` use karo)

---

## Next Video → POST Route Handler 

# POST Route Handler — S7 Ep. 4

---

## 1. POST Handler — Basic Structure

```js
// app/todos/route.js
import { writeFile } from "fs/promises"
import todosData from "../../todos.json"

export async function POST(request) {
  const todo = await request.json()  // Client se JSON body receive karo

  const newTodo = {
    id: crypto.randomUUID(),   // ✅ Unique ID (length+1 mat use karo)
    text: todo.text,
    completed: false,           // Server pe default set karo
  }

  todosData.push(newTodo)

  // File mein likhlo → persistent storage
  await writeFile("todos.json", JSON.stringify(todosData, null, 2))

  return Response.json(newTodo, { status: 201 })  // 201 = Created
}
```

---

## 2. Client se Data Receive karna

```js
const todo = await request.json()
// Postman mein body → raw → JSON:
// { "text": "Complete DSA" }
```

- `request.json()` → body ko parse karke object return karta hai
- `async/await` zaroori hai

---

## 3. `json.stringify` — Formatting ke liye

```js
JSON.stringify(data)           // Single line, no formatting
JSON.stringify(data, null, 2)  // ✅ 2-space indentation (readable format)
JSON.stringify(data, null, 10) // Max 10 spaces allowed
```

| Argument | Kya karta hai |
|---|---|
| 1st `data` | Object to convert |
| 2nd `replacer` | `null` → all fields include; Array → specific fields |
| 3rd `space` | Indentation spaces (max 10) |

---

## 4. ID Generation — Sahi Tarika

```js
// ❌ Galat — duplicate IDs aasakte hain
id: todosData.length + 1

// ✅ Sahi — always unique
id: crypto.randomUUID()
// → "550e8400-e29b-41d4-a716-446655440000"
```

- Length-based ID → ek item delete karo → next add pe duplicate ban sakta hai
- `crypto.randomUUID()` → Node.js mein natively available (no import needed)
- UUID ID ab string hai — number nahi → comparison mein `==` use karo

---

## 5. `writeFile` — Full File Replace Hoti Hai

```js
await writeFile("todos.json", JSON.stringify(todosData, null, 2))
```

- `writeFile` → poori file delete karke dobara likhta hai
- Efficient nahi → isliye future mein database (MongoDB) use karenge
- Path → relative to `process.cwd()` (project root)

---

## 6. Testing — Postman / Thunder Client

- Browser se sirf GET request bheji ja sakti hai (URL bar se)
- POST request test karne ke liye → **Postman** ya **Thunder Client** (VS Code extension)
- Method: POST → Body: raw → JSON format

---

## 7. 405 Method Not Allowed

- Agar `POST` function export nahi kiya aur POST request bheji → **405 Method Not Allowed**
- Next.js automatically ye error deta hai

---

## Task (Next Video ke liye)
PATCH route banao `/todos/[id]` mein:
- `text` ya `completed` property update karo
- Postman se PATCH request bheji → body mein `{ "text": "...", "completed": true }`

---

## Next Video → PATCH Route Handler (Update Todo)

# PUT / PATCH Route Handler (Edit Todo) — S7 Ep. 5

---

## 1. PUT vs PATCH — Kab Kya Use Karein?

| | PATCH | PUT |
|---|---|---|
| Use case | Ek ya do specific fields update | Poora object replace |
| Hamara case | Multiple fields allow → **PUT use karo** | ✅ |

> Practically dono kaam karte hain — convention ka farak hai

---

## 2. PUT Handler — Dynamic Route mein

```js
// app/todos/[id]/route.js
import { writeFile } from "fs/promises"
import todosData from "../../../todos.json"

export async function PUT(request, context) {
  const { id } = await context.params
  const editedTodoData = await request.json()

  // 1. ID change karne ki try → reject karo
  if (editedTodoData.id) {
    return Response.json(
      { error: "Changing id is not allowed" },
      { status: 403 }
    )
  }

  // 2. Existing todo find karo (index chahiye replace ke liye)
  const todoIndex = todosData.findIndex(todo => todo.id == id)

  if (todoIndex === -1) {
    return Response.json({ error: "Todo not found" }, { status: 404 })
  }

  // 3. Spread existing todo + overwrite with new data
  const updatedTodo = {
    ...todosData[todoIndex],   // purana data
    ...editedTodoData,         // nayi values overwrite karein
  }

  // 4. Wahi index pe replace karo (push mat karo!)
  todosData[todoIndex] = updatedTodo

  // 5. File mein save karo
  await writeFile("todos.json", JSON.stringify(todosData, null, 2))

  return Response.json(updatedTodo)
}
```

---

## 3. Common Mistake — `push` vs Index Replace

```js
// ❌ Galat — naya item add ho jaayega
todosData.push(updatedTodo)

// ✅ Sahi — wahi index pe replace karo
const todoIndex = todosData.findIndex(todo => todo.id == id)
todosData[todoIndex] = updatedTodo
```

---

## 4. Spread Pattern — Partial Update

```js
const updatedTodo = {
  ...todosData[todoIndex],  // id, text, completed (purana)
  ...editedTodoData,        // sirf jo client ne bheja wo overwrite hoga
}
```

- User sirf `text` bheje → `completed` preserve hoga
- User sirf `completed` bheje → `text` preserve hoga
- User `id` bhejne ki try kare → 403 return karo

---

## 5. Postman mein Test karna

```json
// PUT /todos/:id
// Body (raw JSON):
{
  "text": "Read books",
  "completed": true
}
```

---

## 6. Status Codes Used

| Situation | Status Code |
|---|---|
| Update successful | `200` (default) |
| ID change attempt | `403` Forbidden |
| Todo not found | `404` Not Found |

---

## Task (Next Video ke liye)
DELETE route banao `/todos/[id]` mein:
- Todo find karo by ID → array se remove karo → file mein save karo

---

## Next Video → DELETE Route Handler

# DELETE Route Handler — S7 Ep. 6

---

## 1. DELETE Handler

```js
// app/todos/[id]/route.js
import { writeFile } from "fs/promises"
import todosData from "../../../todos.json"

export async function DELETE(_, context) {
  const { id } = await context.params

  const todoIndex = todosData.findIndex(todo => todo.id == id)

  if (todoIndex === -1) {
    return Response.json({ error: "Todo not found" }, { status: 404 })
  }

  // Array se remove karo
  todosData.splice(todoIndex, 1)

  // File mein save karo
  await writeFile("todos.json", JSON.stringify(todosData, null, 2))

  // 204 — Success, No Content
  return new Response(null, { status: 204 })
}
```

---

## 2. `splice` — Array se Item Delete karna

```js
todosData.splice(todoIndex, 1)
// splice(startIndex, deleteCount)
// startIndex pe 1 item delete karo
```

---

## 3. Response — Delete ke baad kya bhejein?

```js
// ✅ Standard REST practice — 204 No Content
return new Response(null, { status: 204 })

// ❌ Yeh kaam nahi karega — null valid JSON nahi hai
return Response.json(null, { status: 204 })

// ✅ Agar deleted item return karna ho (optional)
return Response.json({ id, message: "Deleted successfully" })
```

> `Response.json()` mein valid JSON pass karna zaroori hai — `null` pass karo toh error aayega

---

## 4. Status Codes — Quick Reference

| Operation | Status Code | Meaning |
|---|---|---|
| GET success | 200 OK | Data mila |
| POST success | 201 Created | Naya item bana |
| PUT/PATCH success | 200 OK | Update ho gaya |
| DELETE success | 204 No Content | Delete ho gaya, kuch nahi bheja |
| Not Found | 404 Not Found | Item nahi mila |
| Forbidden | 403 Forbidden | Action allowed nahi |
| Bad Request | 400 Bad Request | Invalid data |

---

## 5. Complete CRUD Summary

| Operation | Method | Route | Handler File |
|---|---|---|---|
| Read All | GET | /todos | app/todos/route.js |
| Read One | GET | /todos/:id | app/todos/[id]/route.js |
| Create | POST | /todos | app/todos/route.js |
| Update | PUT | /todos/:id | app/todos/[id]/route.js |
| Delete | DELETE | /todos/:id | app/todos/[id]/route.js |

---

## Next Video → REST API ko Todo App UI mein Integrate 

# API Integration — GET & POST Todo — S7 Ep. 7

---

## 1. GET Integration — useEffect se Data Fetch karna

```js
"use client"
import { useState, useEffect } from "react"

export default function Home() {
  const [todos, setTodos] = useState([])  // default empty array

  useEffect(() => {
    fetchTodos()
  }, [])

  // useEffect callback async nahi ho sakta → separate function banao
  async function fetchTodos() {
    const response = await fetch("/todos")  // full URL nahi chahiye — same domain
    const todosData = await response.json()
    setTodos(todosData.reverse())  // reverse → latest first
  }
}
```

> **`/todos`** — sirf path dena kafi hai, `http://localhost:3000` auto-attach hota hai (same domain)

---

## 2. POST Integration — Naya Todo Add karna

```js
async function addTodo(todoText) {
  const response = await fetch("/todos", {
    method: "POST",
    body: JSON.stringify({ text: todoText }),
    headers: { "Content-Type": "application/json" },
  })

  const newTodo = await response.json()

  // UI mein front pe add karo
  setTodos(prev => [newTodo, ...prev])
}
```

- Backend se ID, `completed: false` automatically set hota hai
- Frontend se sirf `text` bhejna hai

---

## 3. `.reverse()` — Order Fix karna

```js
// Backend → oldest first order mein deta hai
// UI → latest first dikhana chahte hain

setTodos(todosData.reverse())
```

- `.reverse()` original array mutate karta hai → `.slice().reverse()` zyada safe hai (advanced)
- Simple case mein `.reverse()` theek hai

---

## 4. Mental Model — Client + Server Ek Jagah

```
page.js (Client Component — "use client")
  ↓ useEffect
  ↓ fetch("/todos")  →  app/todos/route.js (Server — GET handler)
  ↓ fetch("/todos", {method:"POST"})  →  app/todos/route.js (Server — POST handler)
```

- Dono ek hi Next.js project mein hain — confusing lagta hai lekin kaam alag hai
- `"use client"` wala code → browser mein chalta hai
- `route.js` → server pe chalta hai

---

## 5. Loading State (Optional Improvement)

```js
const [loading, setLoading] = useState(true)

async function fetchTodos() {
  setLoading(true)
  const res = await fetch("/todos")
  const data = await res.json()
  setTodos(data.reverse())
  setLoading(false)
}

if (loading) return <p>Loading...</p>
```

---

## Next Video → Edit & Delete Integration in UI

# API Integration — Edit & Delete Todo — S7 Ep. 8

---

## 1. DELETE Integration

```js
async function deleteTodo(id) {
  const response = await fetch(`/todos/${id}`, {
    method: "DELETE",
  })

  if (response.status === 204) {
    fetchTodos()  // UI refresh karo
  }
}
```

---

## 2. Toggle Completed (PUT)

```js
async function toggleTodo(todo) {
  const response = await fetch(`/todos/${todo.id}`, {
    method: "PUT",
    body: JSON.stringify({ completed: !todo.completed }),
    headers: { "Content-Type": "application/json" },
  })

  if (response.status === 200) {
    fetchTodos()  // UI refresh karo
  }
}
```

---

## 3. Update Text (PUT)

```js
async function updateTodo(id, newText) {
  const response = await fetch(`/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ text: newText }),
    headers: { "Content-Type": "application/json" },
  })

  if (response.status === 200) {
    fetchTodos()
  }
}
```

---

## 4. Important Bug Fix — File se Read karo, Variable se Nahi

**Problem:** GET route `import` se loaded variable use karta hai → delete ke baad stale data

```js
// ❌ Galat — imported variable stale ho jaata hai after delete
import todosData from "../../todos.json"
export function GET() {
  return Response.json(todosData)
}

// ✅ Sahi — har request pe file se fresh read karo
import { readFile } from "fs/promises"
export async function GET() {
  const todosJsonString = await readFile("todos.json", "utf-8")
  const todos = JSON.parse(todosJsonString)
  return Response.json(todos)
}
```

> Database use karne ke baad ye problem automatically solve ho jaati hai

---

## 5. Optimistic Update (Optional Improvement)

- Abhi: Action → API call → response → UI update (delay visible)
- Better: Action → UI update immediately → API call background mein
- RTK Query se automatic optimistic update milta hai

---

## 6. Complete Integration Flow

```
UI Action          →  fetch()  →  Route Handler  →  File Read/Write
deleteTodo(id)     →  DELETE /todos/:id  →  splice + writeFile
toggleTodo(todo)   →  PUT /todos/:id     →  findIndex + update + writeFile
updateTodo(id,txt) →  PUT /todos/:id     →  findIndex + update + writeFile
```

---

## Section Summary — Route Handlers (S7)

| Concept | Key Point |
|---|---|
| `route.js` | API endpoint banta hai (page nahi) |
| HTTP Methods | `GET`, `POST`, `PUT`, `DELETE` — named exports |
| Request body | `await request.json()` |
| Dynamic params | `await context.params` |
| Response | `Response.json(data)` ya `new Response(null, {status: 204})` |
| Unique ID | `crypto.randomUUID()` |
| Persistent storage | `writeFile` (file) → Next section: MongoDB |

---

## Next Section → MongoDB Database Integration