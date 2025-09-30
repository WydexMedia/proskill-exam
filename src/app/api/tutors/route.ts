// app/api/tutors/route.ts
import { NextRequest, NextResponse } from "next/server";

// const tutors = {
//   "Resin Tutors": ["Rishana", "Asna", "Sumayya", "Hamna"],
//   "Mehandi Tutor": ["Jasira"],
//   "Digital Marketing": ["Brijesh"],
// } ;

// export function GET(req: NextRequest) {
//   const category = req.nextUrl.searchParams.get("category"); // e.g., "Mehandi Tutor"
//   if (!category) return NextResponse.json(tutors, { status: 200 });

//   // Return matching category or empty if not found
//   const result = tutors[category as keyof typeof tutors] ?? [];
//   return NextResponse.json({ [category]: result }, { status: 200 });
// }

const tutors: Record<string, string[]> = {
  "Resin Tutors": ["Rishana", "Asna", "Sumayya", "Hamna"],
  "Mehandi Tutor": ["Jasira"],
  "Digital Marketing": ["Brijesh"],
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
