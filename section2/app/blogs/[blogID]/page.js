
//lecture 9 nested dynamic routes
export default async function Blog({ params }) {
  const { blogID } = await params;
  return (
    <>
      <h1>Blog {blogID}</h1>
    </>
  );
}