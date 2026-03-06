# Routing in Next.js — S2 Ep. 1

---

## 1. File Structure Basics
- `app/page.js` → Home route (`/`)
- `app/layout.js` → Root layout file, har page pe apply hota hai
- Layout file mein `html` aur `body` tag zaroori hain — delete karne pe error aata hai
- Page ka actual content `page.js` mein hota hai, jo layout ke `{children}` mein render hota hai

---

## 2. Nayi Page/Route Banana
Koi bhi new route banane ke liye:
1. `app/` ke andar ek **folder** banao (folder ka naam = URL)
2. Us folder mein `page.js` file banao
3. Us file mein ek React component **default export** karo

```
app/
├── page.js          → /
├── about/
│   └── page.js      → /about
└── services/
    └── page.js      → /services
```

- Component ka naam matter nahi karta (convention mein folder ka naam dete hain)
- JS mein `.js` ya `.jsx`, TypeScript mein `.tsx` extension use karo (`.ts` kaam nahi karta)

---

## 3. Navigation — Anchor Tag vs Link Component

**Anchor tag (`<a>`)** → Page fully reload hota hai, client-side routing nahi hoti

**Link Component** → `next/link` se import karo, page reload nahi hota

- React Router Dom mein `to` attribute hota hai, Next.js Link mein **`href`** attribute use hota hai
- Bas `<a>` ki jagah `<Link href="/about">` likho — bas itna kaafi hai

---

## 4. Key Points
- Folder ka naam → URL define karta hai
- `page.js` → us URL ka content define karta hai
- Navigations ke liye hamesha `Link` component use karo, `<a>` tag nahi
- Next video → Nested Routing (`/posts/1` jaise routes)

# Nested Routing in Next.js — S2 Ep. 2

---

## 1. Nested Routing kya hai?
- Kisi route ke andar aur routes banana, jaise `/services/webdev`, `/services/seo`
- Iske liye parent folder ke andar ek aur folder banao aur usme `page.js` rakho

```
app/
└── services/
    ├── page.js          → /services
    ├── webdev/
    │   └── page.js      → /services/webdev
    └── seo/
        └── page.js      → /services/seo
```

---

## 2. Link dena Nested Routes ko
- Next.js mein **poora path** dena padta hai → `href="/services/webdev"`
- React Router Dom ki tarah `./webdev` (relative path) kaam nahi karta Next.js mein
- Agar dynamic path chahiye toh JS se current path extract karke full path manually banana padta hai

---

## 3. Case Sensitivity
- Routes **case sensitive** hote hain
- `/services/SEO` aur `/services/seo` alag hain
- Convention → hamesha **lowercase** folder names use karo

---

## 4. Limitation
- Agar thousands of pages hon (jaise social media posts) toh har ek ke liye alag folder banana possible nahi
- Iske liye **Dynamic Routing** use hota hai → Next Episode

# Dynamic Routing in Next.js — S2 Ep. 3

---

## 1. Dynamic Routes kya hain?
- Jab thousands of pages ho (jaise blogs) toh har ek ke liye alag folder banana possible nahi
- Dynamic routes ek hi file se infinite pages handle karte hain
- Folder ka naam **square brackets** mein likhte hain → `[blog]`

```
app/
└── blogs/
    └── [blog]/
        └── page.js   → /blogs/anything, /blogs/123, /blogs/abc
```

---

## 2. `params` — Dynamic Value Kaise Milti Hai

- Har page component ko props mein `params` milta hai (ye ek **Promise** hai)
- Component ko `async` banana padta hai, phir `await params` se value milti hai
- Square bracket mein jo naam diya → wahi `params` object ki key ban jaati hai

```
Folder naam: [blog]
URL: /blogs/nextjs-tutorial

params = { blog: "nextjs-tutorial" }
```

- Value nikalne ke liye destructure karo → `const { blog } = await params`

---

## 3. `searchParams` — Query String Values

- URL mein `?name=anurag&age=25` jaisi values `searchParams` mein milti hain
- Ye bhi Promise hai → `await searchParams` se value milti hai
- Ab ke liye zaroorat nahi, future mein use hoga

---

## 4. Naming Convention

- Parent folder → **plural** (`blogs`)
- Dynamic folder → **singular** (`[blog]`) ya semantic naam (`[blogId]`, `[slug]`)
- `[anything]` jaisa naam mat do — proper meaningful naam do

---

## 5. Limitations
- `/blogs/123` → ✅ Works
- `/blogs/123/extra` → ❌ Nahi chalega — sirf ek level dynamic hai
- Iske liye **Catch-All Routes** use hote hain → agle episodes mein

---

## 6. Slug kya hota hai?
- Square bracket mein jo dynamic path banate hain usse **slug** kehte hain
- e.g. `[blog]`, `[blogId]`, `[slug]` — ye sab slugs hain

# Nested Dynamic Routing in Next.js — S2 Ep. 4

---

## 1. Nested Dynamic Routes kya hain?
- Jab ek dynamic route ke andar aur ek dynamic route ho
- Example: Blog ke andar comments, aur comment ki bhi individual page

```
app/
└── blogs/
    └── [blogId]/
        ├── page.js              → /blogs/123
        └── comments/
            ├── page.js          → /blogs/123/comments
            └── [commentId]/
                └── page.js      → /blogs/123/comments/10
```

---

## 2. Route banana — Important Rule
- Sirf file banane se route nahi banta (e.g. `comments.js` kaam nahi karega)
- Route ke liye **folder** banana zaroori hai, us folder mein `page.js` rakho

---

## 3. `params` mein kya milta hai?

- Child route ko apne saath **parent ke saare slugs bhi milte hain** `params` mein
- Parent route ko child ke slugs nahi milte

```
/blogs/mobiles/comments/10

Child (commentId) ka params:
{ blogId: "mobiles", commentId: "10" }

Parent (blogId) ka params:
{ blogId: "mobiles" }   ← commentId nahi milta
```

---

## 4. Use Case
- Blog → Comments → Individual Comment
- Product → Reviews → Individual Review
- Jab parent aur child dono dynamic hon tab nested dynamic routes use karo

# Catch-All Routes in Next.js — S2 Ep. 5

---

## 1. Catch-All Routes kya hain?
- Jab route ka nesting level fixed na ho (infinite levels) tab use hota hai
- Example: File manager jahan path kuch bhi ho sakta hai → `/files/images/png/test.png`
- Normal dynamic route `[id]` sirf ek level handle karta hai — catch-all route sab levels handle karta hai

---

## 2. Required Catch-All Route
- Folder naam → `[...filePath]` (3 dots + naam, square bracket mein)
- `params` mein us naam ki key milti hai jiska value **array** hota hai

```
URL: /files/images/png/test.png
params = { filePath: ["images", "png", "test.png"] }
```

- Array ko join karke full path bana sakte ho → `filePath.join("/")`
- **Required** matlab → path mein kuch na kuch hona zaroori hai, sirf `/files` pe nahi khunega

---

## 3. Optional Catch-All Route
- Folder naam → `[[...filePath]]` (double square bracket)
- Sirf `/files` pe bhi khuléga, path dena **optional** hai
- Agar koi path na ho toh `filePath` → `undefined` aata hai (isliye `?` use karo)

```
/files         → filePath = undefined
/files/images  → filePath = ["images"]
```

---

## 4. Required vs Optional

| | Required `[...slug]` | Optional `[[...slug]]` |
|---|---|---|
| `/files` | ❌ Nahi khuléga | ✅ Khuléga |
| `/files/abc` | ✅ Khuléga | ✅ Khuléga |

---

## 5. Important Rules
- Required aur Optional catch-all route **same level** pe saath nahi rakh sakte
- Optional catch-all route **root level** (`app/`) pe nahi rakh sakte — `page.js` se conflict hota hai
- Hard-coded routes ki **priority zyada** hoti hai dynamic/catch-all routes se
  - e.g. `/services` folder hai toh wahi khuléga, catch-all override nahi karega

---

## 6. Use Cases
- File manager / Google Drive jaisi app
- Docs website jahan URL depth variable ho (e.g. `/docs/a/b/c/d`)
- Koi bhi app jahan nesting infinite ho sakti ho

# Reusable Layouts in Next.js — S2 Ep. 6

---

## 1. `layout.js` kya hai?
- Har page ke saath ek common wrapper hota hai — yahi `layout.js` hai
- Root `layout.js` → `app/layout.js` — har page pe automatically apply hota hai
- `{children}` prop ke zariye actual page ka content render hota hai
- Agar `children` render na karo → page ka content nahi dikhega, sirf layout dikhega

---

## 2. Root Layout ke Rules
- `app/layout.js` mein `<html>` aur `<body>` tag **zaroori** hain
- Kisi bhi nested layout mein `<html>` ya `<body>` tag **nahi** dena — error aata hai
- Nested layouts mein `<main>`, `<section>`, `<aside>` jaisa koi bhi tag use kar sakte ho

---

## 3. Nested Layout — Route-Specific Common UI
- Kisi specific route ke sabhi pages pe common UI dikhana ho toh us folder mein `layout.js` banao
- Example: `app/services/layout.js` → services aur uske andar ke sabhi pages pe apply hoga

```
app/
├── layout.js              → sab pages pe (header/footer)
└── services/
    ├── layout.js          → sirf services ke pages pe
    ├── page.js
    ├── webdev/page.js
    └── seo/page.js
```

---

## 4. Layout Nesting ka Flow
- Root layout render hota hai → uske andar nested layout → uske andar actual page
- Parent layout ko child ka content `{children}` mein milta hai
- Root layout → services layout → services/seo page (is order mein wrap hota hai)

---

## 5. Title/Metadata
- `<title>` tag directly layout mein mat likho — Next.js recommend nahi karta
- Iske liye **Metadata API** use hoti hai → Next Episode mein cover hoga

# Metadata API in Next.js — S2 Ep. 7

---

## 1. Metadata kya hai?
- Page ke `<head>` tag mein jo information hoti hai — title, description, etc. — wahi metadata hai
- Directly `<title>` ya `<meta>` tag layout mein mat likho — Next.js recommend nahi karta
- Iske liye **Metadata API** use hoti hai

---

## 2. Static Metadata Set karna
- `layout.js` ya `page.js` se `metadata` naam ka object export karo

```
export const metadata = {
  title: "Technical Agency",
  description: "Hello World",
}
```

- Root `layout.js` mein set karo → sabhi pages pe apply hoga
- Kisi specific `page.js` mein set karo → sirf us page pe apply hoga
- Page ka metadata, layout ke metadata ko **override** karta hai

---

## 3. Title Template
- Har page pe company name repeat karne ki bajay root layout mein template set karo

```
export const metadata = {
  title: {
    default: "Technical Agency",
    template: "%s | Technical Agency",
  },
}
```

- `%s` ki jagah individual page ka title aata hai
- e.g. About page mein `title: "About"` set karo → tab tab dikhega **"About | Technical Agency"**
- Home page pe title mat set karo → default `"Technical Agency"` dikhega

---

## 4. Absolute Title
- Agar template ko ignore karke bilkul alag title set karna ho

```
export const metadata = {
  title: {
    absolute: "My Files",
  },
}
```

- Company name nahi aayega — sirf `"My Files"` dikhega

---

## 5. Dynamic Metadata — `generateMetadata` Function
- Dynamic pages (e.g. `[blogId]`) mein params ke basis par title set karna ho toh `generateMetadata` function export karo

```
export async function generateMetadata({ params }) {
  const { blogId } = await params
  return {
    title: `Blog ${blogId}`,
  }
}
```

- Ye function `params` aur `searchParams` receive karta hai
- Isse dynamic title set hoti hai har page ke liye alag alag

---

## 6. Kahan set karein?

| Situation | Kahan set karein |
|-----------|-----------------|
| Sabhi pages pe same title | `app/layout.js` |
| Specific static page ka title | `page.js` mein `metadata` export |
| Dynamic page ka title | `page.js` mein `generateMetadata` function |
| Template ko override karna | `title: { absolute: "..." }` |


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

# Next.js Route Groups — S2 Ep. 9

---

## 1. Route Groups kya hain?
- App folder ke routes ko **logical categories** mein group karne ka tarika
- Grouping se **URL nahi badalta** — sirf folder structure organize hota hai
- Folder ka naam parentheses mein likhte hain → `(folderName)`

---

## 2. Normal Folder vs Route Group

- Agar `marketing` naam ka folder banao aur usme `about` rakho → URL ban jaata hai `/marketing/about`
- Agar `(marketing)` naam ka folder banao aur usme `about` rakho → URL rehta hai `/about`
- Parentheses wala folder **route mein count nahi hota**

---

## 3. Folder Structure Example

```
app/
├── (marketing)/
│   ├── about/
│   └── services/
└── (application)/
    ├── blogs/
    └── files/
```

- `/about` → `(marketing)/about/page.js`
- `/blogs` → `(application)/blogs/page.js`
- URLs same rehte hain, sirf code logically organized hota hai

---

## 4. Route Groups se Alag Layout Dikhana

Har route group ka apna `layout.js` ho sakta hai — matlab alag header/footer:

- `(marketing)/layout.js` → marketing pages ka alag header/footer
- `(application)/layout.js` → application pages ka alag header/footer
- Root `layout.js` mein sirf `<html>` aur `<body>` rakho, header/footer hata do

> ⚠️ Root `layout.js` mein `html` aur `body` tag zaroori hain — group layout mein nahi hote, wahan sirf fragment (`<>`) use karo

---

## 5. Not Found Page pe Header/Footer hatana

- Root `layout.js` se header/footer hata do
- `not-found.js` root level pe hai → koi layout nahi milta → header/footer automatically nahi aata
- Nested route ka `not-found.js` (e.g. `blogs/[blogId]/not-found.js`) us group ka layout inherit karta hai → wahan header/footer dikhega

---

## 6. Home Page kis Group mein rakhe?

- `page.js` ko jis group ke folder mein rakho, usi ka layout apply hoga
- e.g. `(application)/page.js` → application wala header/footer dikhega home pe
- Flexible hai — apni zaroorat ke hisaab se decide karo

---

## 7. Use Cases

- `(auth)` group → login, register, forgot-password routes
- `(marketing)` group → about, services, landing pages
- `(application)` group → dashboard, blogs, files — jo user actually use karta hai

# Private Folders in Next.js — S2 Ep. 10

---

## 1. Private Folders kya hain?
- `app/` folder mein koi bhi folder banao jisme `page.js` ho → route ban jaata hai
- Agar kisi folder ko route banana nahi hai (jaise components, utils, helpers) toh use **private folder** banao
- Private folder banane ke liye folder naam ke aage **underscore** lagao → `_components`

---

## 2. Kaise kaam karta hai?
- `_components/page.js` banao → `/components` route **nahi** banega
- Next.js underscore wale folders ko routing se **exclude** kar deta hai
- Lekin us folder ke components ko import karke use kar sakte ho normally

---

## 3. Agar underscore wala route chahiye ho?
- URL mein `%5f` use karo — ye underscore ka URL-encoded form hai
- `%5fcomponents` → `/\_components` route ban jaega
- Ye rare case hai, generally zaroorat nahi padti

---

## 4. Better Convention — Components folder bahar rakho
- `_components` app ke andar rakhne ki jagah `components/` folder **app ke bahar** rakho
- Bahar hone ki wajah se routing mein interfere hi nahi karta
- Import paths bhi kaam karte hain — Next.js `src/` ya root level se import support karta hai

---

## 5. Kab Private Folder use karein?
- Jab components, utils, helpers ko `app/` ke andar hi rakhna ho
- Agar accidentally `page.js` ban jaaye toh route na bane
- Generally prefer karein → components folder `app/` ke **bahar** rakho