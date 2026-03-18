# Authentication in Next.js — Introduction — S9 Ep. 1

---

## 1. Is Section Mein Kya Seekhenge?

- Login with password (email + password)
- Login with Google (OAuth)
- Register functionality
- Middleware
- Server Actions
- Next Auth

> **Prerequisite:** Cookies, Sessions, Authentication/Authorization pehle se aana chahiye

---

## 2. Traditional Setup — React + Node.js (Alag Servers)

```
React App (localhost:3000)        Node.js Server (localhost:4000)
   Browser → email/password   →   Server verifies DB
   Browser ← Set-Cookie header ←  Session ID cookie
   Browser → (auto cookie)    →   Protected routes
```

- Alag codebases, alag repositories
- CORS issues aate hain (cross-origin requests)
- Fix: server pe headers attach karo

---

## 3. Next.js Setup — Single Server (EJS jaisa)

```
Next.js Server (localhost:3000)
  ├── Serves HTML/CSS/JS (frontend)
  └── Handles API routes (backend)

Browser → /login (POST)  →  route.js (verify email+password)
Browser ← Set-Cookie     ←  Session ID in cookie
Browser → /dashboard     →  cookie auto-attached
```

- **No CORS** — same origin se request ja rahi hai
- Same codebase → frontend aur backend dono
- Cookie automatically store + attach hoti hai

---

## 4. Session ID vs JWT — Kyun Session ID?

| | Session ID | JWT |
|---|---|---|
| Revoke karna | ✅ Easy — DB se delete karo | ❌ Hard — expire ka wait |
| Stateless | ❌ DB lookup zaroori | ✅ Self-contained |
| Security | ✅ Better | ⚠️ Often misused |
| Recommended | ✅ Yes | ⚠️ Specific cases mein |

> JWT is not bad — **JWT ka misuse bad hai**. Session ID is the recommended approach for web apps.

---

## 5. Next.js vs EJS vs React+Node

| | EJS + Node | React + Node | Next.js |
|---|---|---|---|
| Server | ✅ One | ❌ Two | ✅ One |
| CORS | ✅ No issue | ⚠️ Issue | ✅ No issue |
| Frontend | ❌ Not modern | ✅ Modern | ✅ Modern |
| Backend freedom | ✅ Full | ✅ Full | ⚠️ Limited |
| Best for | Legacy | Production (serious) | Small/Indie projects |

> Companies mein serious backend ke liye Node.js + Express use karo — Next.js backend chhote projects ke liye theek hai

---

## 6. Authentication Flow in Next.js

```
1. User → Register → POST /api/register → DB mein user save
2. User → Login    → POST /api/login    → DB se verify → Session ID create → Set-Cookie
3. Browser → auto cookie attach karta hai sab requests mein
4. Protected route → cookie check karo → valid? allow : redirect to login
```

---

## Next Video → Register + Login Implementation (Password-based Auth)

# Authentication — Register Route — S9 Ep. 2

---

## 1. API Folder Convention

```
app/
├── api/              ← Sab route handlers yahan
│   ├── todos/
│   │   └── route.js
│   ├── todos/[id]/
│   │   └── route.js
│   └── register/
│       └── route.js
└── (pages)/
    ├── login/page.js
    └── register/page.js
```

> `/api/todos` → cleaner separation — pages aur APIs alag

---

## 2. User Model — `models/UserModel.js`

```js
import mongoose from "mongoose"

const userSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },  // unique index
  password: { type: String, required: true },
}

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
```

> ⚠️ `unique: true` tabhi kaam karta hai jab DB mein already duplicate values na hon. DB seedha saaf hone ke baad ek baar server restart karo.

---

## 3. Register Route — `app/api/register/route.js`

```js
import { connectDB } from "../../../lib/connectdb"
import User from "../../../models/UserModel"

export async function POST(request) {
  await connectDB()

  try {
    const user = await request.json()
    const newUser = await User.create(user)
    return Response.json(newUser, { status: 201 })
  } catch (error) {
    console.log(error)

    if (error.code === 11000) {
      // Duplicate key error → email already exists
      return Response.json(
        { error: "Email already exists" },
        { status: 409 }  // 409 Conflict
      )
    }

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
```

---

## 4. Register Page — Frontend Integration

```js
// app/register/page.js
"use client"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  async function handleRegister(formData) {
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(formData),   // { name, email, password }
      headers: { "Content-Type": "application/json" },
    })

    const data = await response.json()

    if (!data.error) {
      router.push("/login")  // Register ke baad login page pe redirect
    } else {
      // Error UI pe dikhao
      console.log(data.error)
    }
  }
}
```

---

## 5. MongoDB Error Codes

| Code | Meaning |
|---|---|
| `11000` | Duplicate key — unique field ka value already exists |

---

## 6. Important Notes

- Password **hash karke** save karo production mein (`bcrypt` library)
- Yahan plain string save kar rahe hain — Next.js concept ke liye
- Email validation, password strength — JavaScript level pe karo (Next.js ka feature nahi)
- `connectDB()` har route handler mein call karna zaroori hai

---

## Next Video → Login Route + Cookie/Session Implementation

# Cookies in Next.js — Set & Get — S9 Ep. 3

---

## 1. Cookie Kya Hai?

- HTTP response header `Set-Cookie` se browser mein save hoti hai
- Har next request mein browser **automatically** cookie attach karta hai
- Session ID store karne ke liye use hoti hai

---

## 2. Primitive Way — Response Header se Set karna

```js
// ❌ Raw header method (sirf samajhne ke liye)
return new Response(
  JSON.stringify(data),
  {
    headers: {
      "content-type": "application/json",
      "Set-Cookie": "name=procoder; Path=/; HttpOnly",
    },
  }
)
```

---

## 3. Next.js Way — `cookies()` Function ✅

```js
// app/api/todos/route.js
import { cookies } from "next/headers"

export async function GET(request) {
  const cookieStore = await cookies()

  // Cookie GET karna
  const userId = cookieStore.get("userId")         // {name, value} object
  const allCookies = cookieStore.getAll()           // Array of all cookies
  console.log(userId?.value)                        // "1234"

  // Cookie SET karna
  cookieStore.set("userId", "1234", {
    httpOnly: true,   // JS se access nahi hoga → XSS protection
    maxAge: 60 * 60 * 24 * 7,  // 7 din (seconds mein)
    path: "/",        // Sab routes pe accessible
  })
}
```

---

## 4. Cookie Options

| Option | Purpose |
|---|---|
| `httpOnly: true` | JavaScript se access nahi — XSS attacks se protection |
| `maxAge: seconds` | Kitne seconds baad expire hogi |
| `path: "/"` | Kis route pe accessible hogi |
| `secure: true` | Sirf HTTPS pe send hogi (production mein use karo) |

---

## 5. Same Site vs Cross Site

```js
// Same site (frontend + backend dono localhost:3000)
// → Cookies automatically save + send hoti hain
// → Extra config nahi chahiye

// Cross site (frontend: 3000, backend: 4000)
// → fetch mein credentials include karna padega
fetch("/api/todos", {
  credentials: "include",  // ← cross-origin cookies ke liye
})
```

---

## 6. `document.cookie` — Avoid Karo Sessions Ke Liye

```js
// ❌ JavaScript se cookie access → XSS attack mein steal ho sakti hai
document.cookie = "sessionId=abc123"

// ✅ Server se Set-Cookie header → httpOnly flag → JS access nahi
```

---

## 7. Cookie Store Methods

```js
const cookieStore = await cookies()

cookieStore.get("name")       // {name, value} | undefined
cookieStore.getAll()          // [{name, value}, ...]
cookieStore.set("key", "val", options)
cookieStore.delete("name")
```

---

## Next Video → Login Route — Session ID cookie set karna

# Authentication — Login + Cookie Session — S9 Ep. 4

---

## 1. Login Route — `app/api/login/route.js`

```js
import { connectDB } from "../../../lib/connectdb"
import User from "../../../models/UserModel"
import { cookies } from "next/headers"

export async function POST(request) {
  await connectDB()

  const { email, password } = await request.json()

  const user = await User.findOne({ email })

  // Email ya password galat → same error (security best practice)
  if (!user || user.password !== password) {
    return Response.json(
      { error: "Invalid credentials" },
      { status: 400 }
    )
  }

  // ✅ User verify → Session cookie set karo
  const cookieStore = await cookies()
  cookieStore.set("userId", user.id, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,  // 24 hours
  })

  return Response.json({ message: "Successfully logged in" })
}
```

---

## 2. Todo Model Update — User ID Field Add Karo

```js
// models/TodoModel.js
import mongoose from "mongoose"

const todoSchema = {
  text: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // MongoDB Object ID
    required: true,
  },
}

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema)
export default Todo
```

---

## 3. POST Route — User ID Save karo

```js
// app/api/todos/route.js
export async function POST(request) {
  await connectDB()
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value  // .value — string ID

  const user = await User.findById(userId)
  if (!user) {
    return Response.json({ error: "Please login" }, { status: 401 })
  }

  const { text } = await request.json()
  const newTodo = await Todo.create({ text, userId })

  const { id, completed } = newTodo
  return Response.json({ id, text, completed }, { status: 201 })
}
```

---

## 4. GET Route — Sirf Us User ke Todos

```js
export async function GET() {
  await connectDB()
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  const user = await User.findById(userId)
  if (!user) {
    return Response.json({ error: "Please login" }, { status: 401 })
  }

  // Sirf is user ke todos
  const allTodos = await Todo.find({ userId })
  const todos = allTodos.map(({ id, text, completed }) => ({ id, text, completed }))
  return Response.json(todos)
}
```

---

## 5. Frontend — 401 Pe Login Redirect

```js
// app/page.js (Client Component)
async function fetchTodos() {
  const response = await fetch("/api/todos")

  if (response.status === 401) {
    router.push("/login")  // Unauthorized → login page pe redirect
    return
  }

  const data = await response.json()
  setTodos(data.reverse())
}
```

---

## 6. Logout Task

```js
// Logout ke liye sirf cookie delete karo
const cookieStore = await cookies()
cookieStore.delete("userId")
return Response.json({ message: "Logged out" })
```

---

## 7. Reusable Auth Helper (Next Video)

```js
// lib/getUser.js
export async function getAuthUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  if (!userId) return null

  await connectDB()
  const user = await User.findById(userId)
  return user || null
}
```

---

## 8. Security Checklist

| Rule | Reason |
|---|---|
| `httpOnly: true` on session cookie | JavaScript se steal nahi ho sakti |
| "Invalid credentials" (not "email not found") | Attacker ko pata nahi chalega email exist karta hai |
| Every route mein user verify karo | Postman se bhi direct access prevent |
| User ke sirf apne todos dikhao | `Todo.find({ userId })` |
| Before edit/delete → owner verify karo | Other user ke todos edit/delete nahi kar sakta |

---

## Next Video → Reusable Auth Function + Middleware

# Reusable Auth Helper — `getLoggedInUser` — S9 Ep. 5

---

## 1. `lib/auth.js` — Reusable Function

```js
import { cookies } from "next/headers"
import { connectDB } from "./connectdb"
import User from "../models/UserModel"

export async function getLoggedInUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  const errorResponse = Response.json(
    { error: "Please login" },
    { status: 401 }
  )

  if (!userId) return errorResponse

  await connectDB()
  const user = await User.findById(userId)

  if (!user) return errorResponse

  return user  // ← User object return karo
}
```

---

## 2. Route Handler mein Use karna

```js
// Pattern — har route mein yahi pattern
const user = await getLoggedInUser()
if (user instanceof Response) return user  // ← Error response return karo
// Yahan se → user is guaranteed to be a valid user object
```

---

## 3. GET Route — Sirf Us User ke Todos

```js
export async function GET() {
  await connectDB()
  const user = await getLoggedInUser()
  if (user instanceof Response) return user

  const allTodos = await Todo.find({ userId: user.id })
  const todos = allTodos.map(({ id, text, completed }) => ({ id, text, completed }))
  return Response.json(todos)
}
```

---

## 4. POST Route — User ID Save karo

```js
export async function POST(request) {
  await connectDB()
  const user = await getLoggedInUser()
  if (user instanceof Response) return user

  const { text } = await request.json()
  const newTodo = await Todo.create({ text, userId: user.id })
  const { id, completed } = newTodo
  return Response.json({ id, text, completed }, { status: 201 })
}
```

---

## 5. PUT Route — Owner Check ke saath Update

```js
export async function PUT(request, context) {
  await connectDB()
  const user = await getLoggedInUser()
  if (user instanceof Response) return user

  const { id } = await context.params
  const editData = await request.json()

  // findByIdAndUpdate nahi — updateOne use karo (userId bhi check karo)
  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: id, userId: user.id },   // ← Owner verify
    editData,
    { new: true }
  )

  if (!updatedTodo) {
    return Response.json({ error: "Todo not found" }, { status: 404 })
  }

  const { id: todoId, text, completed } = updatedTodo
  return Response.json({ id: todoId, text, completed })
}
```

---

## 6. DELETE Route — Owner Check ke saath Delete

```js
export async function DELETE(_, context) {
  await connectDB()
  const user = await getLoggedInUser()
  if (user instanceof Response) return user

  const { id } = await context.params

  await Todo.deleteOne({ _id: id, userId: user.id })  // ← Owner verify

  return new Response(null, { status: 204 })
}
```

---

## 7. Express Middleware vs Next.js

| | Express | Next.js Route Handlers |
|---|---|---|
| Auth middleware | `app.use(authMiddleware)` | Har function mein `getLoggedInUser()` call |
| Request object | `req.user` set kar sakte ho | Request object modify nahi hota |
| Reuse | ✅ Single middleware | ✅ Single helper function |

> Next.js mein `middleware.js` bhi hai lekin Express wala nahi — alag video mein dekhenge

---

## 8. `instanceof Response` Pattern — Kyun?

```js
// getLoggedInUser() do cheezein return karta hai:
// 1. User object  → actual user
// 2. Response object → error response (401)

const user = await getLoggedInUser()
if (user instanceof Response) return user  // Route handler se response bhejo
// Neeche → user guaranteed valid hai
```

---

## Next Video → Next.js Middleware

# Signed Cookies — Cookie Tampering Prevention — S9 Ep. 6

---

## 1. Problem — Plain Cookie ID Tamper Ho Sakta Hai

```js
// Browser console mein koi bhi kar sakta hai:
document.cookie = "userId=otherUserId123"
// Ab dusre user ka account access ho gaya!
```

---

## 2. Solution — Signed Cookie (HMAC Signature)

```
Cookie = userId + "." + HMAC_signature(userId, secret)
Example: "abc123.b21f9a7e..."

Tamper kiya → signature match nahi karega → reject
```

---

## 3. `lib/auth.js` — `signCookie` aur `verifyCookie`

```js
import { createHmac } from "crypto"

const SECRET = process.env.COOKIE_SECRET  // .env file mein rakhna!

// Cookie sign karna
export function signCookie(value) {
  const signature = createHmac("sha256", SECRET)
    .update(value)
    .digest("hex")
  return `${value}.${signature}`
}

// Cookie verify karna
export function verifyCookie(signedCookie) {
  if (!signedCookie) return false

  const [value, cookieSignature] = signedCookie.split(".")

  // Expected signature dobara calculate karo
  const { signature } = signCookie(value).split(".")
  // Cleaner:
  const expectedSignature = createHmac("sha256", SECRET)
    .update(value)
    .digest("hex")

  if (expectedSignature !== cookieSignature) return false
  return value  // Valid → original value return karo
}
```

---

## 4. `.env` File — Secret Store karo

```bash
# .env
COOKIE_SECRET=your_very_random_secret_key_here_minimum_32_chars
```

```js
// Use karo:
process.env.COOKIE_SECRET
```

> `.env` file ko `.gitignore` mein daalo — GitHub pe kabhi push mat karo

---

## 5. Login Route — Signed Cookie Set karo

```js
import { signCookie } from "../../../lib/auth"
import { cookies } from "next/headers"

// Login success ke baad:
const cookieStore = await cookies()
cookieStore.set("userId", signCookie(user.id), {
  httpOnly: true,
  maxAge: 60 * 60 * 24,  // 24 hours
})
```

---

## 6. `getLoggedInUser` — Cookie Verify karo

```js
import { verifyCookie } from "./auth"

export async function getLoggedInUser() {
  const cookieStore = await cookies()
  const signedCookie = cookieStore.get("userId")?.value

  const errorResponse = Response.json({ error: "Please login" }, { status: 401 })

  if (!signedCookie) return errorResponse

  const userId = verifyCookie(signedCookie)  // False ya valid ID
  if (!userId) return errorResponse          // Tampered cookie → reject

  await connectDB()
  const user = await User.findById(userId)
  if (!user) return errorResponse

  return user
}
```

---

## 7. HMAC kya hai? (Basic Understanding)

- **HMAC** = Hash-based Message Authentication Code
- Same input + same secret = **always same output**
- Different input ya secret = completely different output
- One-way — signature se original value nikalna impossible
- JWT bhi internally HMAC use karta hai

---

## 8. Summary

```
Set cookie:    userId → signCookie(userId) → "abc.sig123" → browser mein store
Get cookie:    "abc.sig123" → verifyCookie() → "abc" ya false
If false:      reject (tampered) → 401 error
If valid:      User.findById("abc") → user object
```

---

## Next Video → Next.js Middleware

# Session Based Login in Next.js — (S? Ep. ?)

---

## 1. Problem — Sirf Cookie se kya dikkat hai?

- Cookie mein sirf `userId` tha — server ka koi control nahi tha
- Jab tak cookie hai, user logged in hai
- **Server se user ko logout nahi kar sakte the**

---

## 2. Solution — Server Side Session

- Login pe MongoDB mein ek **session document** create karo
- Cookie mein `userId` ki jagah `sessionId` bhejo
- Session delete karo → user automatically logout

> ✅ Ab server ka poora control — **kaun login hai, kaun nahi**

---

## 3. Session Model banana

```js
// models/Session.js (Todo model se duplicate karke banao)

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);
```

---

## 4. Login Route — Session Create karna

```js
// app/api/login/route.js

// pehle user verify karo...

// Session create karo
const session = await Session.create({
  userId: user._id,   // underscore _id use karo — ObjectId format mein store hoga
});

// Cookie mein sessionId bhejo (userId nahi)
cookies().set("sessionId", session.id);
```

---

## 5. Auth File — `getLoggedInUser` update karna

```js
// lib/auth.js

export async function getLoggedInUser() {
  const sessionId = cookies().get("sessionId")?.value;
  if (!sessionId) return null;

  // Session find karo
  const session = await Session.findById(sessionId);
  if (!session) return null;

  // Session se userId nikaalo, user find karo
  const user = await User.findById(session.userId);
  if (!user) return null;

  return user;
}
```

---

## 6. Multiple Sessions — Ek User, Multiple Devices

- Same user alag-alag browsers mein login kar sakta hai
- Har login pe **alag session document** banega
- Same `userId`, alag `sessionId`

```
Session 1 → userId: abc123  (Chrome)
Session 2 → userId: abc123  (Firefox)
```

- Kisi ek session ko delete karo → sirf us device se logout
- Admin bhi kar sakta hai — sabke sessions list karke delete karo

---

## 7. Automatic Session Expiry — TTL Index

Session model mein yeh add karo:

```js
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60,        // seconds mein — 60 = 1 minute
  }
});
```

### Common Time Values

```js
expires: 60           // 1 minute
expires: 3600         // 1 hour
expires: 3600 * 24    // 1 day
expires: 3600 * 24 * 7  // 1 week
```

> ⚠️ MongoDB **exact time pe delete nahi karta** — 1 minute ka extra buffer leta hai
> Example: `expires: 300` (5 min) set kiya → actual delete ~6 minutes mein hoga

---

## 8. TTL Index — Important Note

- Ek baar TTL index ban jaata hai toh **value change karne se update nahi hoga**
- Naya value apply karne ke liye:
  1. Purana TTL index **drop** karo (MongoDB Compass se)
  2. Server restart karo
  3. Naya login karo → naya index ban jaayega

---

## 9. Session mein Extra Info Store karna (Optional)

```js
const sessionSchema = new mongoose.Schema({
  userId: { ... },
  userAgent: String,    // browser info
  device: String,       // mobile / desktop
  createdAt: { ... }
});
```

---

## Assignment 🎯

**Max 2 devices pe login allow karo:**

- Login pe pehle us user ki **saari sessions find karo**
- Agar `sessions.length >= 2` toh **sabse purani session delete karo**
- Phir naya session create karo

```js
// Hint
const sessions = await Session.find({ userId: user._id }).sort({ createdAt: 1 });
if (sessions.length >= 2) {
  await Session.findByIdAndDelete(sessions[0]._id);  // oldest delete karo
}
// ab naya session create karo
```

---

## Summary

| Kaam | Kaise |
|---|---|
| Session create | `Session.create({ userId: user._id })` |
| Cookie mein bhejo | `sessionId` bhejo, `userId` nahi |
| User fetch | sessionId → session → userId → user |
| Manual logout | Session document delete karo DB se |
| Auto expiry | `expires: seconds` — TTL index |
| 1 week expiry | `expires: 3600 * 24 * 7` |

---

## Next Video → Logout Route banana

# User Endpoint & Profile Info — (S? Ep. ?)

---

## 1. Kya banayenge is video mein?

- `/api/user` endpoint banayenge
- Logged in user ka **name aur email** fetch karenge
- Home page pe user info show karenge (hardcoded nahi, dynamic)

---

## 2. User API Route banana

```
app/
└── api/
    └── user/
        └── route.js
```

```js
// app/api/user/route.js

import { connectDB } from "@/lib/db";
import { getLoggedInUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const user = await getLoggedInUser();
  if (!user) {
    return NextResponse.json({ error: "Please login" }, { status: 401 });
  }

  return NextResponse.json(user);
}
```

---

## 3. Password Response mein mat bhejo ⚠️

`getLoggedInUser()` mein `select` lagao taaki password UI tak na jaaye:

```js
// lib/auth.js

const user = await User.findById(session.userId)
  .select("-password -__v");   // password aur __v dono hata do

return user;
```

Response ab sirf yeh fields bhejega:

```json
{
  "_id": "...",
  "name": "Anurag Singh",
  "email": "anurag@gmail.com"
}
```

---

## 4. Frontend — User Info Fetch karna

```js
// app/page.js (ya jahan user info chahiye)

const [user, setUser] = useState(null);

useEffect(() => {
  fetchUser();
}, []);

async function fetchUser() {
  const res = await fetch("/api/user");
  const data = await res.json();

  if (data.error) {
    // login page pe redirect karo
    router.push("/login");
    return;
  }

  setUser(data);   // { name, email, _id }
}
```

UI mein use karna:

```jsx
<p>{user?.name}</p>
<p>{user?.email}</p>
```

---

## 5. Endpoint Test karna

| URL | Result |
|---|---|
| `/api/user` (logged in) | `{ _id, name, email }` |
| `/api/user` (not logged in / incognito) | `{ error: "Please login" }` |

---

## Summary

| Kaam | Code |
|---|---|
| User endpoint | `GET /api/user` |
| Password hide karna | `.select("-password -__v")` |
| Frontend fetch | `useEffect` mein `fetch("/api/user")` |
| Error handle | `data.error` check karo → redirect to login |

---

## Next Video → Logout Feature implement karna

> 🎯 **Try karo khud:** Next video se pehle logout feature implement karne ki koshish karo!

# Logout Feature in Next.js — (S? Ep. ?)

---

## 1. Logout ka Logic

1. Cookie se `sessionId` nikalo
2. DB mein us session ko **delete** karo
3. (Optional) Cookie bhi clear karo
4. User ko login page pe redirect karo

> ✅ Session delete hona **zaroori** hai — cookie delete karna optional hai

---

## 2. Logout API Route banana

```
app/
└── api/
    └── logout/
        └── route.js
```

```js
// app/api/logout/route.js

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import Session from "@/models/Session";
import { getUserSessionId } from "@/lib/auth";

export async function POST() {
  await connectDB();

  const sessionId = await getUserSessionId();

  // Session DB se delete karo
  await Session.findByIdAndDelete(sessionId);

  // Optional: Cookie bhi clear karo
  const cookieStore = await cookies();
  cookieStore.delete("sid");

  // 204 = No Content (logout success)
  return new Response(null, { status: 204 });
}
```

> ⚠️ Logout ke liye **POST** method use karo — convention hai

---

## 3. `getUserSessionId()` — Auth file mein helper function

```js
// lib/auth.js

export async function getUserSessionId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sid")?.value;
  if (!token) return null;

  const payload = verifyCookie(token);   // signature verify
  return payload;   // yeh sessionId hai
}
```

---

## 4. Frontend — Logout Button Handler

```js
// app/page.js (ya jahan logout button hai)

const handleLogout = async () => {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (response.status === 204) {
      router.push("/login");   // login page pe redirect
    }
  } catch (error) {
    console.error("Logout failed", error);
  }
};
```

```jsx
<button onClick={handleLogout}>Logout</button>
```

---

## 5. Cookie ka naam — Convention

Login karte waqt aur logout mein **same naam** use karo:

```js
// Login mein set karo
cookies().set("sid", session.id);   // sid = Session ID

// Logout mein delete karo
cookieStore.delete("sid");
```

> `sid` ya `sessionId` — jo naam rakho, consistently use karo sab jagah

---

## 6. Multiple Device Logout kaise kaam karta hai?

- Har device ka **alag session** hota hai DB mein
- Ek device se logout → sirf us device ka session delete
- Dono sessions delete → dono jagah se logout

```
Session 1 → deleted → Device 1 logout ✅
Session 2 → exists  → Device 2 still logged in ✅
```

---

## Summary

| Kaam | Code |
|---|---|
| Logout route | `POST /api/logout` |
| Session delete | `Session.findByIdAndDelete(sessionId)` |
| Cookie delete | `cookieStore.delete("sid")` |
| Success status | `204 No Content` |
| Redirect | `router.push("/login")` |

> 💡 Yeh concept sirf Next.js mein nahi — Node.js, Python, Java — **sab jagah same logic** hai. Session server se delete karo, cookie browser se clear karo.

---

## Next Video → (Upcoming)

# Password Hashing with Bcrypt — (S? Ep. ? — Last of Auth Section)

---

## 1. Problem — Plain Text Password kyun galat hai?

- DB mein password as-is string store ho raha tha → **bahut insecure**
- Agar DB leak ho jaaye → koi bhi login kar sakta hai
- Production mein deploy karne se pehle **hashing zaroori** hai

> ✅ Hashing = password ko unreadable format mein convert karna (one-way)
> ❌ Hash dekh ke original password **dobara generate nahi** ho sakta

---

## 2. bcrypt vs bcryptjs

| | `bcrypt` | `bcryptjs` |
|---|---|---|
| Language | C++ (behind scenes) | Pure JavaScript |
| Speed | ⚡ Fast | Thoda slow |
| Browser support | ❌ Nahi chalega | ✅ Frontend mein bhi |
| Use karo jab | Server / Node.js | Frontend ya browser |

```bash
npm install bcrypt
```

---

## 3. Register mein Password Hash karna

```js
// app/api/register/route.js

import bcrypt from "bcrypt";

export async function POST(req) {
  const user = await req.json();
  const { name, email, password } = user;

  // Password hash karo
  const hashedPassword = await bcrypt.hash(password, 10);
  // 10 = salt rounds (10 ya 12 recommended)

  // DB mein hashed password save karo
  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return NextResponse.json({ message: "Registered successfully" });
}
```

---

## 4. Login mein Password Compare karna

```js
// app/api/login/route.js

import bcrypt from "bcrypt";

// User find karo by email...

// Compare karo — direct == nahi chalega
const isPasswordValid = await bcrypt.compare(password, user.password);
//                                    ↑ user ne type kiya    ↑ DB ka hashed password

if (!user || !isPasswordValid) {
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

// login continue...
```

> ⚠️ `bcrypt.compare()` ek **promise** return karta hai → `await` lagana zaroori
> Returns: `true` (match) ya `false` (no match)

---

## 5. Login Response mein Password mat bhejo

```js
// ✅ Manually sirf name aur email bhejo
return NextResponse.json({
  name: user.name,
  email: user.email,
});

// ❌ Yeh mat karo — password bhi chala jaayega
return NextResponse.json(user);
```

---

## 6. Salt Rounds kya hota hai?

- `bcrypt.hash(password, 10)` — `10` = salt rounds
- Jitne zyada rounds → hash banana slow → zyada secure
- **10 ya 12** recommended value hai production ke liye

---

## Summary

| Kaam | Code |
|---|---|
| Install | `npm install bcrypt` |
| Hash karna | `await bcrypt.hash(password, 10)` |
| Compare karna | `await bcrypt.compare(inputPass, dbHash)` |
| Result | `true` / `false` |
| Response mein password | `.select("-password")` ya manually exclude karo |

---

## Auth Section Complete ✅

Is section mein yeh sab seekha:

- Register / Login / Logout
- Cookie issue karna (signed)
- Session based login (MongoDB)
- TTL index — auto session expiry
- Password hashing with bcrypt

---

## Next Section → Application Deploy karna (Production)

# Production ke liye App Prepare karna — (S? Ep. ? — Deploy Section)

---

## 1. Bug Fix — Null User pe Crash

**Problem:** Agar email exist nahi karta toh `user` null aata hai aur `user.password` pe crash ho jaata tha

```js
// ❌ Pehle — crash ho jaata tha
const isPasswordValid = await bcrypt.compare(password, user.password);
// user null hai toh yahan error

// ✅ Fix — pehle user check karo, phir password
if (!user) {
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

const isPasswordValid = await bcrypt.compare(password, user.password);

if (!isPasswordValid) {
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
```

---

## 2. Bug Fix — Register mein Password Response mein aa raha tha

```js
// ❌ Pehle — password bhi jaata tha
return NextResponse.json(newUser);

// ✅ Fix — manually sirf name aur email bhejo
return NextResponse.json({
  name: newUser.name,
  email: newUser.email,
});
```

---

## 3. DB URL ko `.env` mein move karo

```js
// ❌ Pehle — hardcoded URL
mongoose.connect("mongodb://localhost:27017/todo-app");

// ✅ Sahi tarika
mongoose.connect(process.env.DB_URL);
```

```env
# .env
DB_URL=mongodb://localhost:27017/todo-app
```

> ✅ `.env` file `.gitignore` mein already hoti hai — push nahi hoti

---

## 4. MongoDB Atlas Setup (Cloud Database)

Local `localhost` DB production mein kaam nahi karta — **MongoDB Atlas** use karo

### Steps:
1. [mongodb.com](https://mongodb.com) pe jaao → **Get Started**
2. Account banao → Cluster create karo
3. **Connect** → **Drivers** → Node.js → Connection string copy karo
4. URL mein database name add karo:

```
mongodb+srv://username:<password>@cluster.mongodb.net/todo-app
```

5. `<password>` ki jagah real password daalo

### Password kahan milega?
- **Database Access** → User edit karo → **Auto Generate** → Copy karo

---

## 5. Network Access — Vercel ke liye

Atlas by default sirf added IP addresses allow karta hai.  
Vercel ka IP dynamic hota hai (baar baar change hota hai) → **Allow from everywhere**

```
Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
```

> ⚠️ Allow from anywhere set karo toh **strong password** zaroori hai — connection string kisi ko mat dikhao

---

## 6. GitHub pe Push karna

```bash
# New repo create karo github.com pe, phir:

git init
git add .
git commit -m "todo app completed"
git remote add origin https://github.com/username/next-todo-app.git
git push -u origin main
```

> ✅ `.env` file automatically ignore hoti hai — secret safe rehta hai

---

## Summary — Production Checklist

| Kaam | Status |
|---|---|
| Null user bug fix | ✅ |
| Password response mein na aaye | ✅ |
| DB URL `.env` mein | ✅ |
| MongoDB Atlas connected | ✅ |
| Atlas Network Access — allow all IPs | ✅ |
| GitHub repo push kiya | ✅ |

---

## Next Video → Vercel pe Deploy karna 🚀

# Next.js App Deploy on Vercel — (S? Ep. ?)

---

## 1. Vercel kyun use karte hain?

- Next.js **Vercel ne hi banaya** hai — best compatibility
- **EC2 (AWS)** pe deploy kar sakte ho but kuch features kaam nahi karte:
  - ❌ Image optimization
  - ❌ CDN caching (pages fast serve nahi honge)
- Vercel pe yeh sab **automatically** milta hai
- **Free mein start** hota hai — personal projects aur small startups ke liye perfect

---

## 2. Vercel pe Deploy karne ke Steps

### Step 1 — Account banao
- [vercel.com](https://vercel.com) pe jaao
- **Continue with GitHub** se signup karo

### Step 2 — GitHub Repo Import karo
- Dashboard pe **Import Git Repository** option aayega
- GitHub connect karo → Repo select karo (next-todo-app)
- Vercel automatically detect kar leta hai ki yeh Next.js project hai

### Step 3 — Environment Variables add karo ⚠️
- `.env` file Vercel pe upload nahi hoti
- Deploy karte waqt manually add karo:

```
DB_URL = mongodb+srv://username:password@cluster.mongodb.net/todo-app
```

- **Settings → Environment Variables** mein baad mein bhi add/edit kar sakte ho

### Step 4 — Deploy karo
- **Deploy** button click karo
- Vercel automatically build karega (~1-2 minutes)
- Done! ✅ Ek URL milega — koi bhi duniya mein access kar sakta hai

---

## 3. Changes Deploy karna (Update karna)

Koi bhi change karo → **main branch mein push karo** → Vercel automatically redeploy kar deta hai

```bash
git add .
git commit -m "change app title"
git push origin main
```

> ✅ Push hote hi Vercel mein **naya deployment automatically start** ho jaata hai

---

## 4. Rollback karna

Agar galti se kuch deploy ho jaaye:

- Vercel Dashboard → **Deployments** tab
- Purani deployment select karo → **Instant Rollback**

---

## 5. Real-world Workflow (Team mein)

```
Developer → apni branch mein kaam karo
         → Pull Request raise karo
         → Senior/Lead review kare
         → Main mein merge ho
         → Auto deploy on Vercel ✅
```

> ⚠️ Production mein directly main branch pe commit mat karo — PR workflow follow karo

---

## 6. Custom Domain

- By default URL hoga: `your-app.vercel.app`
- Apna domain hai toh: **Settings → Domains → Add**
- Next video mein cover hoga

---

## Summary

| Kaam | Kaise |
|---|---|
| Deploy karna | GitHub repo import → env vars add → Deploy |
| Update karna | `git push origin main` → auto redeploy |
| Rollback | Deployments tab → Instant Rollback |
| Env variables | Vercel Dashboard → Settings → Environment Variables |
| Custom domain | Settings → Domains |

---

## Next Video → Custom Domain Connect karna 🌐

# Custom Domain Connect karna — (S? Ep. ? — Deploy Section Last)

---

## 1. Domain kahan se kharido?

- [GoDaddy](https://godaddy.com) ya koi bhi domain provider se kharido
- Account → **My Products** → apna domain dekho

---

## 2. Vercel mein Domain Add karna

1. Vercel Dashboard → Apna project open karo
2. **Settings → Domains → Add Domain**
3. Domain name daalo: `procoderlabs.com`
4. Environment select karo:
   - **Production** — live website ke liye ✅
   - **Preview** — testing ke liye (production se ek step pehle)
5. **Save** karo

---

## 3. DNS Records Add karna (GoDaddy mein)

Vercel `Invalid Configuration` dikhayega — usse fix karne ke liye 2 DNS records add karne padte hain:

### Record 1 — A Record (root domain ke liye)

| Type | Name | Value |
|---|---|---|
| A | `@` | Vercel ka IP address (Vercel dikhata hai) |

### Record 2 — CNAME Record (www ke liye)

| Type | Name | Value |
|---|---|---|
| CNAME | `www` | Vercel ka CNAME value (Vercel dikhata hai) |

> GoDaddy → **DNS Management** → **Add New Record**

---

## 4. Propagation Time

- Official time: **24-48 hours**
- Usually: **10-15 minutes** mein ho jaata hai
- SSL certificate bhi automatically generate ho jaata hai (🔒 Secure)

---

## 5. Verify karna

- Vercel Dashboard → Settings → Domains
- **Valid Configuration** dikhne lage → sab theek hai ✅
- Browser mein `https://yourdomain.com` kholo → 🔒 Secure hona chahiye

---

## Summary

| Kaam | Kahan |
|---|---|
| Domain kharido | GoDaddy ya koi bhi provider |
| Domain add karo | Vercel → Settings → Domains |
| A Record add karo | GoDaddy DNS → `@` → Vercel IP |
| CNAME Record add karo | GoDaddy DNS → `www` → Vercel CNAME |
| SSL certificate | Automatic — kuch time mein 🔒 |

---

## Deploy Section Complete ✅

Is section mein yeh sab seekha:

- Production ke liye app prepare karna (bug fixes, env vars, Atlas)
- Vercel pe deploy karna
- GitHub se auto-deploy setup
- Custom domain connect karna

---

## Next Section → Server Actions 🚀