// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <>
//     {/* <h1>Welcome to Next.js!</h1>
//     <Link href="/about">About</Link>{"  "}
//     <Link href="/services">Services</Link>
//     {/* agr a tag use karte to page reload hota lekin next me link use karte hai to page reload nahi hota */}
//     {/* react me link to hota hai lekin next me link href se hota hai */}
//     {/*folder banake usme page.js banate hai to wo page ban jata hai */}
    

//      {/* NESTED ROUTING */}
//      <h1>All Services</h1>
//      <p>
//       <Link href="/services/web-dev" >Web Development</Link>
//      </p>

//       <p>
//       <Link href="/services/seo" >Seo</Link>
//      </p>
    
//     </>
//   );
// }


import Link from "next/link";
//DYNAMIC ROUTING
export default async function Home({searchParams, params}) {
  console.log( await searchParams);
  console.log( await params);
  return (
    <>
      <h1>Technical Agency</h1>
      <p>
        <Link href="/blogs">Blogs</Link>
      </p>{" "}
      <p>
        <Link href="/about">About</Link>
      </p>{" "}
      <p>
        <Link href="/services">Services</Link>
      </p>
      
      {/* lecture 10 catch all routes */}
      <p>
        <Link href="/files">Files</Link>
      </p>
    </>
  );
}
