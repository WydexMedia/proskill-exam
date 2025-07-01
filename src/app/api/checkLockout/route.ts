import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("examDB");

    // Find the most recent submission for this email
    const lastSubmission = await db.collection("examSubmissions")
      .find({ email })
      .sort({ submittedAt: -1 })
      .limit(1)
      .toArray();

    if (lastSubmission.length === 0) {
      return NextResponse.json({ allowed: true });
    }

    const lastTime = new Date(lastSubmission[0].submittedAt);
    const now = new Date();
    const diffMs = now.getTime() - lastTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return NextResponse.json({ allowed: false, hoursRemaining: 24 - diffHours });
    }

    return NextResponse.json({ allowed: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
