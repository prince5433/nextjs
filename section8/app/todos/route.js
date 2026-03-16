// import { readFile, writeFile } from "node:fs/promises";
// import todos from "../../todos";
// import { connectDB } from "@/lib/connectDB";
// import Todo from "@/models/todoModel";

// export async function GET() {
//   await connectDB();
//   // const result = await Todo.find();
//   // console.log(result);
//   const newTodo = await Todo.create({
//     text: "Learn TypeScript",
//   });

//   console.log(newTodo);
//   console.log("object");
//   console.log("Hii");

//   const todoJSONString = await readFile("./todos.json", "utf-8");
//   const todos = JSON.parse(todoJSONString);
//   return Response.json(newTodo);
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
//   return Response.json(newTodo, {
//     status: 201,
//   });
// }



import { connectDB } from "@/lib/connectDB";
import Todo from "@/models/todoModel";

export async function GET() {
  await connectDB();
  const allTodos = await Todo.find();

  return Response.json(
    allTodos.map(({ id, text, completed }) => ({ id, text, completed }))
    //map badically array ke har element pe function apply karta hai aur uska result return karta hai. Yaha pe hum har todo object se sirf id, text, aur completed properties ko extract kar rahe hain aur ek naya object bana rahe hain jisme sirf ye properties hain. Isse hum unnecessary data ko response me nahi bhej rahe hain.
    
  );
}

export async function POST(request) {
  await connectDB();

  const todo = await request.json();
  const { id, text, completed } = await Todo.create({ text: todo.text });

  return Response.json(
    { id, text, completed },
    {
      status: 201,
    }
  );
}