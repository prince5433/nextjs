// "use client";// This is a client component because of the "use client" directive at the top

// import { useEffect, useState } from "react";

// const Posts = () => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     //useEffect hook is used to perform side effects in function components. It runs after the component renders and can be used to fetch data, set up subscriptions, or manually change the DOM in React components.
//     async function fetchPosts() {
//       const response = await fetch(
//         "https://jsonplaceholder.typicode.com/posts?_limit=5"
//       );
//       const data = await response.json();
//       setPosts(data);
//     }

//     fetchPosts();
//   }, []);

//   return (
//     <>
//       <h1>Posts</h1>
//       <div className="posts-container">
//         {posts.map(({ id, title, body }) => (
//           <div className="post-card" key={id}>
//             <h2>{title}</h2>
//             <p>{body}</p>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Posts;



//paralle dat fecthing

"use client";

import { useEffect, useState } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5"
      );
      const data = await response.json();
      setPosts(data);
    }

    fetchPosts();
  }, []);

  return (
    <>
      <h1>Posts</h1>
      <div className="posts-container">
        {posts.map(({ id, title, body }) => (
          <div className="post-card" key={id}>
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Posts;
