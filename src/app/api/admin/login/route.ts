import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const database = client.db("examDB");

    // find user by email
    const user = await database.collection("admins").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // compare hashed password
    const isMatch = await bcrypt.compare(password, user.password); // <-- user.password is hashed

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // success
    return NextResponse.json({ success: true, message: "Login successful",user: { email: user.email }, },{status:200});
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
