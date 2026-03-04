export default async function Comment({ params }) {
  const { blogID, commentID } = await params;
  return (
    <>
      <h1>Comment {commentID} for Blog {blogID}</h1>
    </>
  );
}
//slug basically matlab dynamic route create karna.
//slug ko square brackets me likhte hai. Jaise ki humne blogID aur commentID ko square brackets me likha hai. Iska matlab ye hai ki ye dono dynamic parameters hai jo URL se aayenge.
// Jese ki blogID aur commentID dynamic hai to humne unko square brackets me likha hai. Aur jab hum params ko access karenge to wo ek object return karega jisme blogID aur commentID dono honge.
//humne params ko async function me await kiya hai kyuki params ek promise return karta hai. Aur humne blogID aur commentID ko destructure kiya hai params object se. Ab hum in dono variables ko apne component me use kar sakte hai.