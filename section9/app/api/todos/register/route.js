import { connectDB } from "@/lib/connectDB";
import User from "@/models/userModel";
import bcrypt from "bcrypt";

export async function POST(request) {
  await connectDB();
  const user = await request.json();// Parse the incoming request body as JSON to get the user data
  try {
    const { name, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);// Hash the user's password using bcrypt with a salt rounds of 10 for security
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,// Create a new user in the database with the provided name, email, and hashed password
    });
    return Response.json(newUser, {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return Response.json(
        { error: "Email already exists" },
        {
          status: 409,
        }
      );
    } else {
      return Response.json(
        { error: "Something went wrong" },
        {
          status: 500,
        }
      );
    }
  }
}