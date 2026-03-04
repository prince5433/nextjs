//lecture 10 catch all routes
export default async function File({ params }) {
  const { filePath } = await params;
  return (
    <h1>
      File <i>/{filePath?.join("/")}</i>
       {/*
      //yaha par hum filePath ko join kar rahe hai kyuki filePath ek array hai. Aur hum chahte hai ki wo URL ke format me aaye. Jaise ki agar filePath ["some", "path"] hai to hum chahte hai ki wo /some/path ke format me aaye. Isliye hum filePath ko join kar rahe hai with "/". Aur agar filePath undefined hai to hum "File /" ko render karenge.
       */}
    </h1>
  );
}

//optional catch all route me [[]] hota hai. Iska matlab ye hai ki ye route tab bhi match karega jab filePath parameter URL me nahi hoga. Jaise ki agar hum /files ke URL par jayenge to filePath parameter undefined hoga, lekin ye route fir bhi match karega aur hum "File /" ko render karenge. Aur agar hum /files/some/path ke URL par jayenge to filePath parameter ["some", "path"] hoga, aur hum "File /some/path" ko render karenge.
//root level pr optional catch all route banana possible nahi hai. Kyuki root level pr optional catch all route banane se ye route har URL ke sath match karega, aur isse routing me confusion ho sakta hai. Isliye root level pr optional catch all route banana allowed nahi hai.