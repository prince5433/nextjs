export default async function Blog({ params }) {
  const { blogID } = await params;
  return (
    <>
      <h1>All Comments for Blog {blogID}</h1>
    </>
  );
}