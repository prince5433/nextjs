import { writeFile } from "node:fs/promises";
import todos from "../../../todos";

export async function GET(_, { params }) {
  const { id } = await params;
  const todo = todos.find((todo) => id === todo.id);

  if (!todo) {
    return Response.json(
      { error: "Todo not found" },
      {
        status: 404,
      }
    );
  }
  return Response.json(todo);
}

export async function PUT(request, { params }) {
  const editTodoData = await request.json();
  const { id } = await params;
  const todoIndex = todos.findIndex((todo) => id === todo.id);
  const todo = todos[todoIndex];

  if (editTodoData.id) {
    return Response.json(
      { error: "Changing ID is not allow." },
      {
        status: 403,
      }
    );
  }

  const editedTodo = { ...todo, ...editTodoData };
  todos[todoIndex] = editedTodo;

  await writeFile("todos.json", JSON.stringify(todos, null, 2));
  return Response.json(editedTodo);
}

export async function DELETE(_, { params }) {
  const { id } = await params;
  const todoIndex = todos.findIndex((todo) => id === todo.id);

  todos.splice(todoIndex, 1);
  //splice basically removes the element from the array and returns it. So we can use it to get the deleted todo if we want to return it in the response. But in this case, we are just returning a 204 No Content response, so we don't need to return the deleted todo.
  //splice syntax: array.splice(start, deleteCount, item1, item2, ...);
  await writeFile("todos.json", JSON.stringify(todos, null, 2));
  return new Response(null, {
    status: 204,
  });
}