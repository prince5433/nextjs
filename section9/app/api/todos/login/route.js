
import { signCookie } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Session from "@/models/sessionModel";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function POST(request) {
  await connectDB();
  const cookieStore = await cookies();
  const { email, password } = await request.json();
  try {
    const user = await User.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);// Compare the provided password with the hashed password stored in the database using bcrypt's compare function to validate the user's credentials

    if (!user || !isPasswordValid) {
      return Response.json(
        { error: "Invalid Credentials!" },
        {
          status: 400,
        }
      );
    }

    const session = await Session.create({ userId: user._id });// Create a new session for the authenticated user
    cookieStore.set("sid", signCookie(session.id), {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });

    return Response.json(
      { name: user.name, email: user.email },// Return a response with the user's name and email, and a 200 status code to indicate successful login
      {
        status: 200,
      }
    );
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
