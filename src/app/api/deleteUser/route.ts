import { NextResponse } from "next/server";
import { Types } from "mongoose";
import clientPromise from "@/lib/mongodb";

export async function DELETE(req: Request) {
  try {
    const { id }: { id: string } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const client = await clientPromise;
    const database = client.db("examDB");
    const collection = database.collection("examSubmissions");

    // Try to delete directly
    const result = await collection.deleteOne({ _id: new Types.ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
