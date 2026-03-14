// // //backend part 1  lecture 44

// // import http from "http";

// // const server = http.createServer((req, res) => {
// //   console.log(req.url);
// //   res.end("Hello from new next.js server.");
// // });

// // server.listen(4000, () => {
// //   console.log("Server started on port 4000");
// // });


// //backend part 2 lecture 45
// import todosData from "../../todos";

// export function GET() {
//   return Response.json(todosData);

//   //   return new Response(JSON.stringify(todosData), {
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     status: 200,
//   //     statusText: "ProCodrr",
//   //   });
// }


import todos from "../../todos";

export function GET(request) {
  console.log(request);
  return Response.json(todos);
}