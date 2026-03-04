//lecture 12 meta data in next js
export const metadata = {
  // title: "Technical Agency",
  //isse hr page pe same title dikhai dega. Agar hum chahte hai ki har page ka alag title ho to hum metadata ko har page component me export kar sakte hai. Jaise ki about page me hum "About Us" title export kar sakte hai, aur services page me "Our Services" title export kar sakte hai. Isse har page ka alag title dikhai dega.

  title: {
    default: "Technical Agency",
    template: "%s | Technical Agency"
  },
  descriptipn: "This is a technical agency website built with Next.js",
  //template me %s ka matlab hai ki ye placeholder hai jahan par page ka specific title aayega. Jaise ki agar about page me hum "About Us" title export karte hai, to template me %s ke jagah "About Us" aayega, aur final title "About Us | Technical Agency" ban jayega. Agar kisi page me specific title export nahi kiya gaya hai, to default title "Technical Agency" hi dikhai dega.
};


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