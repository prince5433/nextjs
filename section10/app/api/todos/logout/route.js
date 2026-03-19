import { getUserSessionId } from "@/lib/auth";
import Session from "@/models/sessionModel";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();// Get the cookie store to manage cookies
  const sessionId = await getUserSessionId();// Get the session ID of the currently logged-in user
  await Session.findByIdAndDelete(sessionId);// Delete the session from the database to log the user out
  cookieStore.delete("sid");// Delete the session cookie from the client's browser
  return new Response(null, {// Return a response with no content and a 204 status code to indicate successful logout
    status: 204,
  });
}