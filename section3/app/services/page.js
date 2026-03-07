import Link from "next/link";
import { cookies } from "next/headers";

//forcefully dynamic rendering static pages
// export const dynamic = "force-dynamic";
//default value is auto which means dynamic if there is dynamic code and static if there is no dynamic code in the page. so we can use dynamic keyword to forcefully make static pages dynamic and static keyword to forcefully make dynamic pages static. but we can also make static pages dynamic by using some dynamic code in the page like using searchParams or cookies which are dynamic in nature. so we can use these methods to make static pages dynamic without using dynamic keyword.
//forcefully static rendering dynamic pages
// export const dynamic = "force-static";

//another method is below
const Services = async ({searchParams}) => {
    //ye hogya ek treeka using await searchParams statc pages ko dynamic krne ka
    // const search=await searchParams;
    // console.log("Search params:", search);

    //method 2 is using cookies to make static pages dynamic
    // const myCookie=await cookies();
    // console.log("My cookie: ", myCookie);


    console.log("Rendering Services page");
  return (
    <>
      <nav>
        <ul className="navbar">
          <li>
            <Link href="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="nav-link">
              About
            </Link>
          </li>
          <li>
            <Link href="/services" className="nav-link active">
              Services
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <h1>Our Services</h1>
        <ul className="services-list">
          <li>Web Development</li>
          <li>Mobile App Development</li>
          <li>Consulting Services</li>
          <li>Digital Marketing</li>
        </ul>
      </div>
    </>
  );
};

export default Services;