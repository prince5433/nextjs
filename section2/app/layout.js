
//lecture 11 building reusable layout in next js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ background: "teal" }}>Header</header>
        {children}
        <footer style={{ background: "brown" }}>Footer</footer>
      </body>
    </html>
    //ye header aur footer har page pr dikhai denge kyuki humne unko root layout me rakha hai. Aur jo bhi content hum page component me likhenge wo header ke niche aur footer ke upar dikhai dega kyuki humne {children} ko header ke niche aur footer ke upar rakha hai.
    //bs root layout me hi html aur body tag use kar sakte hai. Aur har page component ko root layout ke andar wrap karna hota hai. Isse hum ek consistent layout create kar sakte hai jo har page pr dikhai dega.
  );
}