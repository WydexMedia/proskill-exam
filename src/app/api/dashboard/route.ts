// import dns from "node:dns";
// dns.setServers(['1.1.1.1']); // Cloudflare DNS
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("examDB");
  const submissions = await db
    .collection("examSubmissions")
    .find({})
    .sort({ submittedAt: -1 })
    .toArray();

  // Debug: Log certificate buffer length for each submission
  // console.log(
  //   submissions.map((s) => ({
  //     name: s.name,
  //     passed: s.passed,
  //     certLength: s.certificate ? Buffer.from(s.certificate).length : 0,
  //   }))
  // );

  // Convert certificate buffer to base64 string for download
  const mapped = submissions.map((s) => ({
    _id: s._id.toString(),
    name: s.name,
    email: s.email,
    mobile: s.mobile,
    batch: s.batch,
    tutor: s.tutor,
    score: s.score,
    passed: s.passed,
    type: s.type,
    submittedAt: s.submittedAt,
    certificate: s.certificate
      ? Buffer.from(s.certificate.buffer).toString("base64")
      : null,

    }));

  return NextResponse.json({ submissions: mapped });
}