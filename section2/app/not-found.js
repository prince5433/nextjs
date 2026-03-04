
//custom not found page lecture 13
//file name exactly same rhna chahiye not-found.js. Ye file automatically tab render hogi jab bhi koi user aise URL par jayega jo exist nahi karta hai. Isse hum apne application ke liye ek custom 404 page create kar sakte hai jo user ko better experience dega jab wo galat URL par jayega.
export default function NotFound() {
  return (
    <>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </>
  );
}