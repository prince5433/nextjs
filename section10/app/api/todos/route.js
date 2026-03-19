import { getLoggedInUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Todo from "@/models/todoModel";
import User from "@/models/userModel";
import { cookies } from "next/headers";

export async function GET() {
  await connectDB();
  const user = await getLoggedInUser();
  if (user instanceof Response) {// If getLoggedInUser returns a Response, it means the user is not authenticated, so we return that response directly.
    return user;
  }
  const allTodos = await Todo.find({ userId: user.id });

  return Response.json(
    allTodos.map(({ id, text, completed }) => ({ id, text, completed }))
  );
}

export async function POST(request) {
  await connectDB();
  const user = await getLoggedInUser();
  if (user instanceof Response) return user;

  const todo = await request.json();
  const { id, text, completed } = await Todo.create({
    text: todo.text,
    userId: user.id,
  });

  return Response.json(
    { id, text, completed },
    {
      status: 201,
    }
  );
}