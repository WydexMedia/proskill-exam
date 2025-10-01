// app/api/tutors/route.ts
import { NextRequest, NextResponse } from "next/server";

const tutors: Record<string, string[]> = {
  "Resin Tutors": ["Rishana", "Asna", "Sumayya", "Hamna"],
  "Mehandi Tutor": ["Jasira"],
  "Digital Marketing": ["Brijesh"],
  "Ocean Tutors":["Hamna"]
};

// Handle GET requests
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");

  if (category) {
    const result = tutors[category] ?? [];
    return NextResponse.json({ [category]: result }, { status: 200 });
  }

  // if no category, return all tutors
  return NextResponse.json(tutors, { status: 200 });
}
