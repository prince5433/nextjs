//lecture 12 meta data in next js\
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
  return (
    <>
      <h1>Blog {blogID}</h1>
    </>
  );
}