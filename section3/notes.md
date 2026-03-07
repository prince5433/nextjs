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