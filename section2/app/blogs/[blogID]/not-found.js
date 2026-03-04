"use client";
//lecture 13 not found page in next js
import { usePathname } from "next/navigation";

export default function BlogNotFound() {
  const a = usePathname();
  console.log(a);
  return (
    <>
      <h1>Blog Page not found!</h1>
      <p>Could not found the page you are looking for.</p>
    </>
  );
  //ye sirf dynamic routes ke liye hi kaam karega. Agar hum is component ko kisi static route me use karenge to ye component render nahi hoga. Kyuki not-found.js file sirf dynamic routes ke liye hi valid hai. Aur agar hum is component ko kisi static route me use karenge to Next.js automatically 404 page render karega.
  //blog not found m koi params nhi milta to hame url info k liye usePathname hook ka use karna padta hai. Ye hook hame current URL ka path return karta hai. Aur hum is path ko console me log kar sakte hai ya phir user ko dikhane ke liye use kar sakte hai.
  //and useclient ka use karna isliye zaruri hai kyuki usePathname hook sirf client side me hi kaam karta hai. Agar hum usePathname hook ko server side me use karenge to wo error dega. Isliye humne is component ke upar "use client" likha hai jisse ye component client side me render hoga aur usePathname hook sahi se kaam karega.
}