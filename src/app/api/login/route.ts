import { NextResponse } from "next/server";
import { account } from "@/lib/appwrite-server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const session = await account.createEmailPasswordSession(email, password);

    const response = NextResponse.json({
      success: true,
      userId: session.userId,
    });
    response.cookies.set("session_id", session.$id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 401 }
    );
  }
}
