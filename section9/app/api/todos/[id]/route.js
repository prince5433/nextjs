import Todo from "@/models/todoModel";
import User from "@/models/userModel";
import { connectDB } from "@/lib/connectDB";
import { cookies } from "next/headers";

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;
  const user = await User.findById(userId);
  return user ? userId : null;
}

export async function GET(_, { params }) {
  await connectDB();

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return Response.json({ error: "Please login" }, { status: 401 });
  }

  const { id } = await params;
  const todo = await Todo.findById(id);
  if (!todo || todo.userId.toString() !== userId) {
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
  await connectDB();

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return Response.json({ error: "Please login" }, { status: 401 });
  }

  const { id } = await params;
  const todo = await Todo.findById(id);
  if (!todo || todo.userId.toString() !== userId) {
    return Response.json({ error: "Todo not found" }, { status: 404 });
  }

  const editTodoData = await request.json();
  const editedTodo = await Todo.findByIdAndUpdate(id, editTodoData, {
    new: true,
  });

  return Response.json(editedTodo);
}

export async function DELETE(_, { params }) {
  await connectDB();

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return Response.json({ error: "Please login" }, { status: 401 });
  }

  const { id } = await params;
  const todo = await Todo.findById(id);
  if (!todo || todo.userId.toString() !== userId) {
    return Response.json({ error: "Todo not found" }, { status: 404 });
  }

  await Todo.findByIdAndDelete(id);
  return new Response(null, {
    status: 204,
  });
}
