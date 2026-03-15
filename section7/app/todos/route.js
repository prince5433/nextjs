// // // //backend part 1  lecture 44

// // // import http from "http";

// // // const server = http.createServer((req, res) => {
// // //   console.log(req.url);
// // //   res.end("Hello from new next.js server.");
// // // });

// // // server.listen(4000, () => {
// // //   console.log("Server started on port 4000");
// // // });


// // //backend part 2 lecture 45
// // import todosData from "../../todos";

// // export function GET() {
// //   return Response.json(todosData);

// //   //   return new Response(JSON.stringify(todosData), {
// //   //     headers: {
// //   //       "Content-Type": "application/json",
// //   //     },
// //   //     status: 200,
// //   //     statusText: "ProCodrr",
// //   //   });
// // }


// import todos from "../../todos";

// export function GET(request) {
//   console.log(request);
//   return Response.json(todos);
// }


// import { writeFile } from "node:fs/promises";
// import todos from "../../todos";

// export function GET() {
//   return Response.json(todos);
// }

// export async function POST(request) {
//   const todo = await request.json();
//   const newTodo = {
//     id: crypto.randomUUID(),
//     text: todo.text,
//     completed: false,
//   };

//   todos.push(newTodo);
//   await writeFile("todos.json", JSON.stringify(todos, null, 2));
//   return Response.json(newTodo);
// }


import { readFile, writeFile } from "node:fs/promises";
import todos from "../../todos";

export async function GET() {
  const todoJSONString = await readFile("./todos.json", "utf-8");
  const todos = JSON.parse(todoJSONString);
  return Response.json(todos);
}

export async function POST(request) {
  const todo = await request.json();
  const newTodo = {
    id: crypto.randomUUID(),
    text: todo.text,
    completed: false,
  };

  todos.push(newTodo);
  await writeFile("todos.json", JSON.stringify(todos, null, 2));
  return Response.json(newTodo, {
    status: 201,
  });
}