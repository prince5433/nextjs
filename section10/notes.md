# Server Actions in Next.js — Introduction (S? Ep. ? — New Section)

---

## 1. Server Actions kya hain?

- **API routes ka replacement** — route handlers ke bina server pe kaam karo
- Server pe run hone wale async functions hain
- Client se call karte hain → behind the scenes **network request** automatically jaati hai
- Database kaam, user register/login — sab server actions se ho sakta hai

> ✅ Code likha server action ka — call kiya client se — sab kuch Next.js khud handle karta hai

---

## 2. API Route vs Server Action

| | API Route | Server Action |
|---|---|---|
| Endpoint banani padti hai | ✅ Haan | ❌ Nahi |
| fetch() manually call karna | ✅ Haan | ❌ Nahi |
| Network request jaati hai | ✅ | ✅ (behind the scenes) |
| Server pe run hota hai | ✅ | ✅ |

---

## 3. Server Action banana (Server Component mein)

```js
// app/register/page.js (Server Component — "use client" nahi)

async function registerUser(formData) {
  "use server"   // ← yeh directive zaroori hai

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  console.log(name, email, password);   // server console mein dikhega
  // yahan DB kaam kar sakte ho
}

export default function RegisterPage() {
  return (
    <form action={registerUser}>   {/* action mein function pass karo */}
      <input name="name" />
      <input name="email" />
      <input name="password" type="password" />
      <button type="submit">Register</button>
    </form>
  );
}
```

> ⚠️ Har `input` field mein `name` prop **zaroori** hai — warna form data nahi milega

---

## 4. `formData.get()` se values nikalna

```js
// FormData pe direct .name nahi milega — .get() use karo
const name = formData.get("name");       // ✅
const email = formData.get("email");     // ✅

console.log(formData.name);              // ❌ undefined aayega
```

---

## 5. Button pe `formAction` use karna (Alternative)

```jsx
// Form pe action ki jagah button pe formAction
<form>
  <input name="name" />
  <button formAction={registerUser}>Register</button>
</form>
```

> Exact same behavior — sirf syntax alag

---

## 6. Behind the Scenes kya hota hai?

- Next.js form ke `submit` event ko **capture** karta hai (document level pe event listener)
- Form reload nahi hota — **Fetch/AJAX request** automatically jaati hai
- Server action ka code **browser bundle mein nahi** jaata — purely server pe run hota hai

---

## 7. Server Actions — Client Component mein ❌

```js
"use client"

// ❌ Yeh nahi hoga — error aayega
async function registerUser(formData) {
  "use server"
  // ...
}
```

**Error:** *Not allowed to define inline "use server" annotated Server Actions in Client Components*

### Solution — 2 ways:

1. **Alag file** mein server action banao (top pe `"use server"`) — **recommended**
2. **Parent server component** se prop ke roop mein pass karo

---

## Summary

| Concept | Detail |
|---|---|
| Directive | `"use server"` function ke andar ya file ke top pe |
| Form mein use | `<form action={serverFunction}>` |
| Button mein use | `<button formAction={serverFunction}>` |
| Data access | `formData.get("fieldName")` |
| Input name prop | Zaroori hai — warna undefined aata hai |
| Client component mein | Alag file mein define karo |

---

## Next Video → Server Actions in Client Component (alag file wala approach)

# Server Actions in Client Components — (S? Ep. ?)

---

## 1. Problem — Client Component mein Server Action define nahi ho sakta

```js
"use client"

// ❌ Error aayega
async function registerUser(formData) {
  "use server"
  // ...
}
```

**Error:** *Not allowed to define inline "use server" Server Actions in Client Components*

---

## 2. Solution — Alag File mein Server Action rakho

Server action ko **alag file** mein export karo — file ke **top pe** `"use server"` likho

```js
// actions/userAction.js

"use server"   // ← file ke top pe — sabhi functions server pe chalenge

export async function registerUser(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  console.log(name, email, password);

  return { message: "Got the data" };
}
```

---

## 3. Client Component mein Import karke Use karo

```js
// app/register/page.js

"use client"

import { registerUser } from "@/actions/userAction";

export default function RegisterPage() {
  return (
    <form action={registerUser}>
      <input name="name" />
      <input name="email" />
      <input name="password" type="password" />
      <button type="submit">Register</button>
    </form>
  );
}
```

> ⚠️ Har `input` mein `name` prop zaroori hai — warna server pe undefined aayega

---

## 4. Folder Structure — Convention

```
actions/
├── userAction.js     → register, login
├── todoAction.js     → create, delete todo
```

> ✅ `actions` folder banana best practice hai — `page.js` ki tarah mandatory nahi, sirf convention hai

---

## 5. Return Value

- Server action se jo return karo woh **response** ke roop mein frontend tak jaata hai
- **But** abhi hum usse code mein access nahi kar sakte directly
- Next video mein dekhenge kaise access karte hain

```js
// Server side
return { message: "Got the data" };   // frontend tak jaata hai
```

---

## 6. `formAction` vs `action` — Dono Valid Hain

```jsx
// Form pe (preferred ✅)
<form action={registerUser}>

// Button pe (alternative)
<button formAction={registerUser}>Submit</button>
```

---

## Summary

| Kaam | Kaise |
|---|---|
| Server action banana | Alag file — top pe `"use server"` |
| Client component mein use | Import karke `action={fn}` |
| Data access | `formData.get("fieldName")` |
| File name convention | `actions/userAction.js` |
| Return value access | Next video mein 👇 |

---

## Assignment 🎯

**Custom JS validation lagaao:**
- Name minimum 3 characters
- Password pattern match kare
- HTML `required` ya `type="email"` wali validation nahi — **JavaScript level validation**

---

## Next Video → Server Action ka Return Value access karna (Frontend pe)

# Server Action Return Value — `useActionState` Hook (S? Ep. ?)

---

## 1. Problem — Server Action ka Response Code mein Nahi Milta

- Network tab mein response dikh raha tha
- But code mein access nahi ho raha tha
- **Solution:** `useActionState` hook use karo

---

## 2. `useActionState` — Basic Usage

```js
import { useActionState } from "react";
import { registerUser } from "@/actions/userAction";

const [state, formAction, isPending] = useActionState(registerUser, {});
//      ↑          ↑           ↑
//   response   form pe       loading
//   aayega     lagao         state
```

| Value | Kya hai |
|---|---|
| `state` | Server action ka return value |
| `formAction` | Form ke `action` prop mein lagao |
| `isPending` | `true` jab request chal rahi ho |

> `{}` — dusra argument initial state hai — `undefined` se bachne ke liye empty object do

---

## 3. Form mein Use karna

```jsx
"use client"

import { useActionState } from "react";
import { registerUser } from "@/actions/userAction";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, {});

  return (
    <form action={formAction}>   {/* registerUser directly nahi — formAction lagao */}
      <input name="name" />
      <input name="email" />
      <input name="password" type="password" />

      {/* Success message */}
      {state?.message && <p className="text-green-500 text-xs">{state.message}</p>}

      {/* Error message */}
      {state?.error && <p className="text-red-500 text-xs">{state.error}</p>}

      {/* isPending se button disable karo */}
      <button
        type="submit"
        disabled={isPending}
        style={{ opacity: isPending ? 0.5 : 1, cursor: isPending ? "not-allowed" : "pointer" }}
      >
        Register
      </button>
    </form>
  );
}
```

---

## 4. Server Action — `prevState` + `formData`

`useActionState` use karne par function signature **change** ho jaata hai:

```js
// actions/userAction.js
"use server"

export async function registerUser(prevState, formData) {
//                                  ↑
//                       pehla argument prevState hoga (purana state)

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    // DB mein save karo...
    return { message: `${email} registered successfully` };
  } catch (error) {
    return { error: "Registration failed" };
  }
}
```

> ⚠️ Pehle argument mein `prevState` aata hai — direct `formData` nahi — yeh common mistake hai

---

## 5. `prevState` kya hota hai?

- Pichle submit ka `state` value — agli call mein `prevState` ban jaata hai
- Pehli baar `{}` (initial state) aata hai

```
1st submit → prevState: {}          → return { message: "abc registered" }
2nd submit → prevState: { message: "abc registered" } → return { message: "xyz registered" }
```

---

## 6. Status Code nahi milta — Important Note

```js
// ❌ Server actions mein status code set nahi kar sakte
// Request hamesha 200 hoti hai — chahe error ho ya success

// ✅ Yeh karo — response object mein error/message property bhejo
return { error: "Something went wrong" };
return { message: "Success!" };
```

---

## Summary

| Kaam | Code |
|---|---|
| Hook import | `import { useActionState } from "react"` |
| Hook use | `const [state, formAction, isPending] = useActionState(fn, {})` |
| Form pe lagao | `<form action={formAction}>` |
| Loading state | `disabled={isPending}` |
| Success show | `state?.message` |
| Error show | `state?.error` |
| Server action signature | `async function fn(prevState, formData)` |

---

## Assignment 🎯

**Client-side validation lagao:**
- Name minimum 3 characters
- Password pattern match kare
- Submit se pehle JS level pe check karo

---

## Next Video → Client-side + Server-side Validation in Server Actions

# Manual Server Action Call + Client-Side Validation — (S? Ep. ?)

---

## 1. Server Action Manually Call karna

Server action ko directly function ki tarah bhi call kar sakte hain:

```js
"use client"

import { registerUser } from "@/actions/userAction";

const handleFormAction = async (formData) => {
  // validation...

  const data = await registerUser(newUser);   // directly call kar sakte ho
  console.log(data);   // return value milta hai
};
```

> ⚠️ Jab directly call karo → plain object pass karo, FormData nahi
> Jab `action` prop mein lagao → FormData automatically milta hai

---

## 2. `action` prop vs `onSubmit` — Difference

```jsx
// ✅ action prop use karo (recommended)
// - formData directly milta hai
// - event.preventDefault() ki zaroorat nahi
// - new FormData() banana nahi padta

<form action={handleFormAction}>

// ❌ onSubmit use karo toh extra kaam karna padta hai
<form onSubmit={handleFormAction}>
// andar:
// event.preventDefault()
// const formData = new FormData(event.target)
// formData.get("name") ...
```

---

## 3. Client-Side Validation — Pattern

```js
const handleFormAction = async (formData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  // Error object banao
  const formErrors = {};

  if (name.length < 3) {
    formErrors.name = "Name should be at least 3 characters";
  }

  if (!email.includes("@")) {
    formErrors.email = "Please enter a valid email";
  }

  if (password.length < 8) {
    formErrors.password = "Password should be at least 8 characters";
  }

  // Agar koi bhi error hai toh aage mat jao
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;   // server action call nahi hoga
  }

  // No errors — errors clear karo aur server action call karo
  setErrors({});
  formAction({ name, email, password });   // useActionState ka formAction
};
```

---

## 4. Errors State + UI mein Show karna

```js
const [errors, setErrors] = useState({});
```

```jsx
<input name="name" />
{errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

<input name="email" />
{errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

<input name="password" type="password" />
{errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
```

---

## 5. HTML Default Validation Hatana

```jsx
// noValidate lagao — warna browser ki default validation chalegi
<form action={handleFormAction} noValidate>
```

---

## 6. `useActionState` + Manual Call — Combine karna

```js
const [state, formAction, isPending] = useActionState(registerUser, {});

const handleFormAction = async (formData) => {
  // validate...
  if (errors) return;

  // useActionState ka formAction call karo (directly registerUser nahi)
  formAction({ name, email, password });
  // return value state mein aayega, promise return nahi hoga
};
```

> `formAction` (useActionState wala) → return value `state` mein aata hai, promise nahi
> `registerUser` directly → `await` kar sako, promise return hota hai

---

## 7. `_prevState` — Mostly Use Nahi Hota

```js
// Server action mein pehla argument (prevState) mostly unused hota hai
export async function registerUser(_prevState, formData) {
  //                               ↑ underscore — convention for unused args
  const name = formData.get("name");
  // ...
}
```

---

## Summary

| Kaam | Tarika |
|---|---|
| Server action directly call | `await registerUser(plainObject)` |
| `action` prop wala call | `formData` automatically milta hai |
| Client validation | `formErrors` object banao → `Object.keys().length > 0` check karo |
| HTML validation hatana | `<form noValidate>` |
| Errors UI mein dikhao | `errors.name &&` conditionally render karo |

---

## Next Video → Zod Library se Validation (Client + Server Side)

# Zod Validation — Client + Server Side — S9/S10 Ep.

---

## 1. Zod Install karna

```bash
npm install zod
```

---

## 2. Schema File — `lib/schemas/userSchema.js`

```js
import { z } from "zod"

export const registerSchema = z.object({
  name: z.string()
    .min(3, "Name should be at least 3 characters")
    .max(100, "Name should be at max 100 characters"),

  email: z.string()
    .email("Please enter a valid email"),

  password: z.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must be at least 8 characters with uppercase, lowercase, and a number"
    ),
})
```

---

## 3. Validation karna — `safeParse`

```js
const result = registerSchema.safeParse(formData)

// result.success → true / false
// result.data    → validated clean data (extra fields removed!)
// result.error   → ZodError object (if failed)
```

> **Bonus:** Extra fields automatically strip ho jaate hain — sirf schema fields rakhta hai

---

## 4. Errors — Readable Format mein

```js
import { z } from "zod"

if (!result.success) {
  const fieldErrors = z.flattenError(result.error).fieldErrors
  // { name: ["..."], email: ["..."], password: ["..."] }
  setErrors(fieldErrors)
  return
}
```

---

## 5. Client-Side Validation (Before API Call)

```js
async function handleSubmit(formData) {
  const result = registerSchema.safeParse(formData)

  if (!result.success) {
    setErrors(z.flattenError(result.error).fieldErrors)
    return  // API call nahi hogi — instant feedback
  }

  // Validated data use karo
  await callServerAction(result.data)
}
```

---

## 6. Server-Side Validation (Server Action / Route Handler)

```js
// Server action ya route handler mein
import { registerSchema } from "../../lib/schemas/userSchema"
import { z } from "zod"

export async function registerAction(formData) {
  const result = registerSchema.safeParse(formData)

  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors
    }
  }

  // result.data → clean, validated data
  await User.create(result.data)
  return { message: "Registered successfully" }
}
```

---

## 7. State mein Errors Sync karna

```js
// useEffect se server errors → local error state sync karo
useEffect(() => {
  if (state?.errors) {
    setErrors(state.errors)
  }
}, [state?.errors])
```

---

## 8. Client vs Server Validation — Dono Zaroori Hain

| | Client Side | Server Side |
|---|---|---|
| Speed | ✅ Instant (no network) | ❌ Network round trip |
| Security | ❌ User disable kar sakta hai | ✅ Can't be bypassed |
| UX | ✅ Better | ❌ Slower feedback |

> **Rule:** Client validation for UX, Server validation for security — **dono lagao**

---

## 9. Same Schema — Dono Jagah Use Karo

```js
// ✅ Ek hi schema — client + server dono mein
import { registerSchema } from "../../lib/schemas/userSchema"
```

- DRY principle follow karo
- Schema change karo → dono jagah automatically update

---

## Next Video → Server Action se Register Functionality Complete karna

# Server Action — Register User in DB — S10 Ep.

---

## 1. Server Action — `actions/userActions.js`

```js
"use server"

import { z } from "zod"
import bcrypt from "bcrypt"
import { connectDB } from "../lib/connectdb"
import User from "../models/UserModel"
import { registerSchema } from "../lib/schemas/userSchema"
import { flattenError } from "zod"

export async function registerAction(prevState, formData) {
  // 1. Validate
  const result = registerSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    }
  }

  const { name, email, password } = result.data

  await connectDB()

  try {
    // 2. Hash password (production mein zaroori)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. User create karo
    await User.create({ name, email, password: hashedPassword })

    return {
      success: true,
      message: "User registered successfully",
    }
  } catch (error) {
    if (error.code === 11000) {
      return {
        success: false,
        errors: { email: ["Email already exists"] },
      }
    }
    return {
      success: false,
      errors: { name: ["Something went wrong"] },
    }
  }
}
```

---

## 2. Register Page — `app/register/page.js`

```js
"use client"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { registerAction } from "../../actions/userActions"
import { registerSchema } from "../../lib/schemas/userSchema"
import { z } from "zod"

export default function RegisterPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(registerAction, null)
  const [errors, setErrors] = useState({})

  // Server se aane wale errors sync karo
  useEffect(() => {
    if (state?.errors) setErrors(state.errors)
    if (state?.success) router.push("/login")  // Redirect on success
  }, [state])

  async function handleSubmit(formData) {
    // Client-side validation pehle
    const result = registerSchema.safeParse(Object.fromEntries(formData))
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors)
      return
    }
    setErrors({})
    formAction(formData)  // Server action call karo
  }

  return (
    <form action={handleSubmit}>
      <input name="name" />
      {errors.name && <p>{errors.name}</p>}

      <input name="email" type="email" />
      {errors.email && <p>{errors.email}</p>}

      <input name="password" type="password" />
      {errors.password && <p>{errors.password}</p>}

      <button type="submit">Register</button>
    </form>
  )
}
```

---

## 3. Return Values Convention — Server Action

```js
// Success
return { success: true, message: "User registered successfully" }

// Validation/DB Error
return {
  success: false,
  errors: {
    email: ["Email already exists"],  // Array format (Zod ke saath match)
    name: ["Something went wrong"],
  }
}
```

---

## 4. Plain Object Return — Not Response Object

```js
// ❌ Route handler mein hota hai
return Response.json(data)

// ✅ Server Action mein plain object return karo
return { success: true, message: "Done" }
```

---

## 5. Flow Summary

```
Form Submit
  → Client-side Zod validation (instant feedback)
  → If valid → Server Action call
  → Server-side Zod validation (security)
  → connectDB() → User.create()
  → Success → redirect to /login
  → Error → errors state update → UI pe dikhao
```

---

## Next Video → Server Action se Login Functionality

# Server Action — Login Functionality — S10 Ep.

---

## 1. Login Schema — `lib/schemas/userSchema.js`

```js
import { z } from "zod"

// Base schema — email + password
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Register schema — login schema extend karo + name add karo
export const registerSchema = loginSchema.extend({
  name: z.string()
    .min(3, "Name should be at least 3 characters")
    .max(100, "Name should be at max 100 characters"),
})
```

> **`extend()`** — existing schema mein extra fields add karo — reuse code!

---

## 2. Login Action — `actions/userActions.js`

```js
"use server"

import { z } from "zod"
import { connectDB } from "../lib/connectdb"
import User from "../models/UserModel"
import Session from "../models/SessionModel"
import { cookies } from "next/headers"
import { signCookie } from "../lib/auth"
import { loginSchema } from "../lib/schemas/userSchema"

export async function loginUser(prevState, formData) {
  // 1. Validate
  const result = loginSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    }
  }

  const { email, password } = result.data

  await connectDB()

  // 2. User find karo
  const user = await User.findOne({ email })
  if (!user || user.password !== password) {  // Prod: bcrypt.compare
    return {
      success: false,
      errors: { password: ["Invalid credentials"] },
    }
  }

  // 3. Session create karo + Cookie set karo
  const session = await Session.create({ userId: user.id })
  const cookieStore = await cookies()
  cookieStore.set("sessionId", signCookie(session.id), {
    httpOnly: true,
    maxAge: 60 * 60 * 24,  // 24 hours
  })

  return { success: true, message: "User logged in successfully" }
}
```

---

## 3. Login Page — `app/login/page.js`

```js
"use client"
import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "../../actions/userActions"
import { loginSchema } from "../../lib/schemas/userSchema"
import { z } from "zod"

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(loginUser, null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (state?.errors) setErrors(state.errors)
    if (state?.success) router.push("/")  // Home page pe redirect
  }, [state])

  async function handleFormAction(formData) {
    // Client-side validation
    const result = loginSchema.safeParse(Object.fromEntries(formData))
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors)
      return
    }
    setErrors({})
    formAction(formData)
  }

  return (
    <form action={handleFormAction} noValidate>
      <input name="email" type="email" />
      {errors.email && <p>{errors.email}</p>}

      <input name="password" type="password" />
      {errors.password && <p>{errors.password}</p>}

      <button type="submit">Login</button>
    </form>
  )
}
```

---

## 4. Security — Same Error for Both Email/Password

```js
// ✅ Sahi — attacker ko nahi pata kya galat tha
errors: { password: ["Invalid credentials"] }

// ❌ Galat — hint deta hai
errors: { email: ["Email not found"] }
errors: { password: ["Wrong password"] }
```

---

## 5. `noValidate` on Form

```jsx
<form action={handleFormAction} noValidate>
```

- Browser ka default HTML validation band karo
- Apni custom Zod validation use karo

---

## 6. Login vs Register — Redirect Difference

| Action | On Success → Redirect to |
|---|---|
| Register | `/login` |
| Login | `/` (home page) |

---

## Next Video → Server Action on Button (Logout functionality)

# Server Action Without Form (Logout Button) — S10 Ep.

---

## 1. Server Action — Button pe Call karna (No Form)

```js
// actions/userActions.js
"use server"

export async function logoutUser() {
  // No arguments needed — cookie automatically aati hai
  const cookieStore = await cookies()
  const signedSessionId = cookieStore.get("sessionId")?.value
  const sessionId = verifyCookie(signedSessionId)

  if (sessionId) {
    await connectDB()
    await Session.findByIdAndDelete(sessionId)
  }

  cookieStore.delete("sessionId")
  return { success: true }
}
```

---

## 2. Component mein Button pe Use karna

```js
// app/page.js
"use client"
import { logoutUser } from "../actions/userActions"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  async function handleLogout() {
    const response = await logoutUser()  // Server action directly call karo
    if (response.success) {
      router.push("/login")
    }
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}
```

---

## 3. Arguments Pass karna — Server Action mein

```js
// Server action mein argument receive karo
export async function deleteTodo(todoId) {
  await connectDB()
  await Todo.findByIdAndDelete(todoId)
  return { success: true }
}

// Component mein call karo
<button onClick={() => deleteTodo(todo.id)}>Delete</button>
```

---

## 4. Server Action — Form vs Button

| | Form ke saath | Button pe directly |
|---|---|---|
| Data source | `formData` (FormData object) | Arguments directly pass karo |
| Hook | `useActionState` | Direct `async` call |
| Use case | Register, Login forms | Logout, Delete, Toggle |

---

## 5. Server Actions — Best Practices

```js
// ✅ Mutations ke liye use karo
logoutUser()
deleteTodo(id)
createTodo({ text })
updateTodo(id, { text, completed })

// ⚠️ Read operations ke liye avoid karo (route handlers better hain)
getTodos()  // → route handler mein rakho
```

---

## 6. Section Summary — Server Actions

| Concept | Key Point |
|---|---|
| Form se call | `useActionState` + `action={formAction}` |
| Button se call | `onClick={() => serverAction(args)}` |
| Validation | Client (instant UX) + Server (security) — dono zaroori |
| Zod schema | Ek schema — dono jagah use |
| Error return | Plain object `{ success, errors, message }` — Response nahi |
| Redirect | `router.push()` `useEffect` mein state change pe |

---

## Next Section → Next.js Middleware