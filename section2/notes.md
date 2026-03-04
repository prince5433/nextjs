# Next.js Custom Not Found Page — S2 Ep. 8

---

## 1. Default 404 Behavior
- Koi bhi undefined path (e.g. `/abc`, `/xyz`) open karo → Next.js apna **default black 404 page** dikhata hai
- Ye development ke liye theek hai, but production mein site ke look & feel se match nahi karta
- Global `layout.js` ka **header/footer 404 page pe bhi apply** hota hai

---

## 2. `notFound()` — Programmatic Trigger
- Kisi condition ke basis par manually 404 page trigger karne ke liye `notFound()` function use karo
- Ye `next/navigation` se import hota hai
- Example: `blogId === 'test'` ho toh `notFound()` call karo

---

## 3. Regex se Invalid Routes Block karna
- Sirf numbers wale blog IDs allow karne ke liye regex use karo → `/^\d+$/`
- `.test(blogId)` → `true` ya `false` return karta hai
- `!` (NOT) operator lagao taaki invalid input pe `notFound()` call ho

**Regex Breakdown:**
| Part | Meaning |
|------|---------|
| `^` | String ka start |
| `\d` | Koi bhi digit (0-9) |
| `+` | Ek ya zyada digits |
| `$` | String ka end |

---

## 4. Custom Not Found Page banana
- `app/not-found.js` file banao → default black Next.js 404 page replace ho jaata hai
- Component ka naam matter nahi karta (`export default` hai)
- Ye page site ke global layout ke saath match karega

---

## 5. Route-Specific Not Found Page
- Kisi specific dynamic route ke liye alag not-found message dikhana ho toh us folder ke andar `not-found.js` rakho
- e.g. `app/blogs/[blogId]/not-found.js`
- ⚠️ Sirf **dynamic routes** (`[param]`) mein kaam karta hai — static routes mein root wala `not-found.js` use hota hai

---

## 6. `not-found.js` mein `params` nahi milta
- `not-found.js` ko `params` prop nahi milta — `undefined` aata hai
- Isliye agar URL ka koi part dikhana ho toh **`usePathname` hook** use karo

---

## 7. Dynamic URL Info Dikhana
- `app/blogs/[blogId]/not-found.js` mein `usePathname` hook use karo (`next/navigation` se import hota hai)
- File ke top pe `'use client'` likhna zaroori hai
- `usePathname()` poora URL return karta hai (e.g. `/blogs/12a`)
- `pathname.split('/')` se specific part nikalo
- ⚠️ Client components mein `async/await` kaam nahi karta

---

## 8. Header/Footer Remove karna Not-Found Page se
- Abhi global `layout.js` ka header/footer har page pe aata hai including not-found
- Isko hatane ke liye **Route Groups** concept use hoga → Covered in **Next Episode: S2 Ep. 9**