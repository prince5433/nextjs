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