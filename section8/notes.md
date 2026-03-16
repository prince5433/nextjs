# MongoDB Connection with Next.js (Mongoose) — S8 Ep. 1

---

## 1. Setup

```bash
npm install mongoose
```

---

## 2. `lib/connectdb.js` — Connection Function

```js
// lib/connectdb.js
import mongoose from "mongoose"

const DB_URI = "mongodb://admin:admin@localhost:27017/todo-app?authSource=admin"
// Atlas users: full connection string from Atlas dashboard

export const connectDB = async () => {
  // Already connected? Return karo — dobara connect mat karo
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected")
    return
  }

  try {
    await mongoose.connect(DB_URI)
    console.log("Database connected")
  } catch (error) {
    console.log("Database not connected", error)
    process.exit(1)  // Critical error → app band karo
  }
}
```

---

## 3. `mongoose.connection.readyState` Values

| Value | Meaning |
|---|---|
| `0` | Disconnected |
| `1` | Connected ✅ |
| `2` | Connecting |
| `3` | Disconnecting |
| `99` | Uninitialized |

---

## 4. Har Route Handler mein Connect karo

```js
// app/todos/route.js
import { connectDB } from "../../lib/connectdb"

export async function GET() {
  await connectDB()  // ← pehle connect karo
  // ... baaki logic
}

export async function POST(request) {
  await connectDB()  // ← har handler mein lagao
  // ... baaki logic
}
```

> **Kyun har handler mein?** Serverless deployment (Vercel) mein har function independently run hoti hai — koi shared memory nahi

---

## 5. Database Name — Do Tarike

```js
// Method 1: Connection string mein dena
"mongodb://localhost:27017/todo-app"

// Method 2: dbName option mein dena
await mongoose.connect(DB_URI, { dbName: "todo-app" })
```

- Atlas string mein `?authSource=admin` add karo agar auth issue aaye

---

## 6. Mongoose ka Kaam — Model ke baad Database Create Hota Hai

- `mongoose.connect()` se sirf connection hota hai
- **Database + Collection tabhi banta hai jab pehla document insert ho**
- Model banana zaroori hai → next video

---

## 7. Connection Reuse — Development Mode Issue

```
Without if-check:
  Request 1 → connect() → connected
  Request 2 → connect() → connected (again! extra connection)

With if-check (readyState === 1):
  Request 1 → connect() → connected
  Request 2 → already connected → skip ✅
```

---

## Next Video → Mongoose Model banana (Schema + CRUD with MongoDB)

# Mongoose Model in Next.js — S8 Ep. 2

---

## 1. Model File — `models/TodoModel.js`

```js
// models/TodoModel.js
import mongoose from "mongoose"

const todoSchema = {
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,   // POST mein completed nahi bhejna padega
  },
}

// ✅ Next.js fix — model overwrite error prevent karo
const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema)

export default Todo
```

---

## 2. Next.js Specific Issue — Model Overwrite Error

```
Error: Cannot overwrite `Todo` model once compiled.
```

**Kab aata hai?** Development mein code change → hot reload → model dobara banana try karta hai

```js
// ❌ Galat — har reload pe naya model banana try karega
const Todo = mongoose.model("Todo", todoSchema)

// ✅ Sahi — pehle check karo, model exist kare toh reuse karo
const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema)
```

- `mongoose.models` → sab bane hue models ka object
- Agar `mongoose.models.Todo` exist kare → wahi use karo
- Nahi toh naya model banao

---

## 3. Model Use karna — Route Handler mein

```js
// app/todos/route.js
import { connectDB } from "../../lib/connectdb"
import Todo from "../../models/TodoModel"

export async function GET() {
  await connectDB()               // ← pehle connect karo
  const todos = await Todo.find() // ← database se fetch
  return Response.json(todos)
}

export async function POST(request) {
  await connectDB()
  const { text } = await request.json()

  const newTodo = await Todo.create({ text })  // completed: false automatically (default)
  return Response.json(newTodo, { status: 201 })
}
```

---

## 4. Mongoose Methods

```js
Todo.find()                    // Sab documents
Todo.findById(id)              // ID se ek document
Todo.create({ text, ... })     // Naya document banana
Todo.findByIdAndUpdate(id, data, { new: true })  // Update + updated doc return
Todo.findByIdAndDelete(id)     // Delete
```

---

## 5. MongoDB Auto-added Fields

```json
{
  "_id": "ObjectId(...)",    // MongoDB auto-generates
  "text": "Learn TypeScript",
  "completed": false,
  "__v": 0                   // Mongoose version key (ignore karo)
}
```

- `_id` → manual `id` nahi banana
- `__v` → mongoose internal version tracking (change tracking ke liye)

---

## 6. Collection Naming — Auto Plural

| Model Name | Collection Created |
|---|---|
| `"Todo"` | `todos` |
| `"Person"` | `people` |
| `"User"` | `users` |

---

## Next Video → CRUD Routes MongoDB ke saath properly implement karna

// app/todos/route.js
import { connectDB } from "../../lib/connectdb"
import Todo from "../../models/TodoModel"

export async function GET() {
  await connectDB()

  const allTodos = await Todo.find()

  // _id (ObjectId) ko id (string) mein convert karo
  const todos = allTodos.map(({ id, text, completed }) => ({
    id,         // Mongoose ka hidden 'id' property → string version of _id
    text,
    completed,
  }))

  return Response.json(todos)
}

# MongoDB CRUD — Update & Delete (PUT & DELETE) — S8 Ep. 4

---

## 1. PUT Route — `findByIdAndUpdate()`

```js
// app/todos/[id]/route.js
import { connectDB } from "../../../lib/connectdb"
import Todo from "../../../models/TodoModel"

export async function PUT(request, context) {
  await connectDB()
  const { id } = await context.params
  const editData = await request.json()

  const editedTodo = await Todo.findByIdAndUpdate(
    id,
    editData,          // sirf changed fields pass karo — spread nahi
    { new: true }      // ← updated document return karo (nahi diya toh old milega)
  )

  const { id: todoId, text, completed } = editedTodo
  return Response.json({ id: todoId, text, completed })
}
```

---

## 2. DELETE Route — `findByIdAndDelete()`

```js
export async function DELETE(_, context) {
  await connectDB()
  const { id } = await context.params

  await Todo.findByIdAndDelete(id)

  return new Response(null, { status: 204 })
}
```

---

## 3. GET Single Route — `findById()`

```js
export async function GET(_, context) {
  await connectDB()
  const { id } = await context.params

  const todo = await Todo.findById(id)  // ← await zaroori! Promise hai

  if (!todo) {
    return Response.json({ error: "Todo not found" }, { status: 404 })
  }

  const { id: todoId, text, completed } = todo
  return Response.json({ id: todoId, text, completed })
}
```

> ❗ `await` mat bhulo — `findById()` Promise return karta hai, uske bina `circular structure JSON` error aata hai

---

## 4. `findByIdAndUpdate` Options

```js
Todo.findByIdAndUpdate(id, updateData, {
  new: true,            // Updated document return karo (default: old)
  runValidators: true,  // Schema validators run karo on update (default: false)
})
```

---

## 5. MongoDB vs File — Kya Hatana Hai

```js
// ❌ Remove karo
import { readFile, writeFile } from "fs/promises"
import todosData from "../../todos.json"

// ✅ Sirf yahi rakho
import Todo from "../../models/TodoModel"
import { connectDB } from "../../lib/connectdb"
```

- `todos.json` file completely delete karo

---

## 6. Complete CRUD — Mongoose Methods Summary

| Operation | Method |
|---|---|
| Read All | `Todo.find()` |
| Read One | `Todo.findById(id)` |
| Create | `Todo.create({ text })` |
| Update | `Todo.findByIdAndUpdate(id, data, { new: true })` |
| Delete | `Todo.findByIdAndDelete(id)` |

---

## 7. Connection String — Environment Variable Mein Rakhna Chahiye

```js
// ❌ Direct file mein
const DB_URI = "mongodb://admin:admin@localhost/todo-app"

// ✅ .env file mein
// .env
MONGODB_URI=mongodb://admin:admin@localhost/todo-app

// connectdb.js mein
const DB_URI = process.env.MONGODB_URI
```

- `.env` file → `.gitignore` mein add karo
- MongoDB Atlas credentials kabhi GitHub pe push mat karo
- Next section mein properly setup karenge

---

## Section Summary — MongoDB with Next.js (S8)

| Topic | Key Point |
|---|---|
| `connectDB()` | Har route handler mein call karo |
| `readyState === 1` check | Duplicate connections prevent karo |
| Model overwrite fix | `mongoose.models.Todo \|\| mongoose.model(...)` |
| `_id` vs `id` | `id` = string version, UI ke liye use karo |
| `{ new: true }` | Update ke baad updated doc chahiye toh lagao |

---

## Next Section → Authentication & Authorization in Next.js