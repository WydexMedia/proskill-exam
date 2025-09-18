import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function DELETE(req: Request) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const database = client.db("examDB");
        const collection = database.collection("submissions");

        const check = await collection.findOne({ email: email });
        if (check) {
            await collection.deleteOne({ email: email });
            return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Something Went Wrong" }, { status: 500 });
    }
}
