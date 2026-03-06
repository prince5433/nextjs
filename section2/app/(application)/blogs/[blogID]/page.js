//lecture 12 meta data in next js\

import { notFound } from "next/navigation";

//dynamic metadata ke liye hum generateMetadata function export karte hai. Ye function ek object return karta hai jisme hum title, description, keywords, author, etc. set kar sakte hai. Ye function params aur searchParams ko as arguments leta hai jisse hum dynamic metadata generate kar sakte hai based on the URL parameters ya query parameters.
export async function generateMetadata({ params }) {
  const { blogID } = await params;
  return {
    title: `Blog ${blogID}`,
  };
}
//lecture 9 nested dynamic routes
export default async function Blog({ params }) {
  const { blogID } = await params;
  //custom not found page banana lecture 13
  
//   if(blogID==="test") {//aggr blog id test hai to not found page dikhai dega. Aur agar blog id test nahi hai to blog page dikhai dega. Isse hum custom not found page create kar sakte hai based on certain conditions.
//     notFound();
//   }

//agr hm chahte hai ki sirf nu
if(!/^\d+$/.test(blogID)) { //agr blogID me sirf digits nahi hai to not found page dikhai dega. Aur agr blogID me sirf digits hai to blog page dikhai dega. Isse hum custom not found page create kar sakte hai based on the format of the URL parameter.
    notFound();
  }

  return (
    <>
      <h1>Blog {blogID}</h1>
    </>
  );
}