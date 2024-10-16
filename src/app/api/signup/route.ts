import { NextResponse } from "next/server";
import { account, databases } from "@/lib/appwrite-server";
import { ID } from "appwrite";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Create user account
    const user = await account.create(ID.unique(), email, password, name);

    // Create email session (log in the user)
    const session = await account.createEmailPasswordSession(email, password);

    // Create player profile in the database
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID!,
      ID.unique(),
      {
        user_id: user.$id,
        name: name,
        email: email,
        // Add any other initial player data here
      }
    );

    const response = NextResponse.json({ success: true, userId: user.$id });
    response.cookies.set("session_id", session.$id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Signup failed" },
      { status: 400 }
    );
  }
}
