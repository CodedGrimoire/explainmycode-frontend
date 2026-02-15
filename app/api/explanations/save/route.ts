import { NextResponse } from "next/server";
import { connectDB } from "../../_lib/db";
import { User } from "../../_lib/models/User";
import { Explanation } from "../../_lib/models/Explanation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const {
      uid,
      code,
      explanation,
      language,
      complexity,
      summary,
      timeComplexity,
      spaceComplexity,
      logicBreakdown,
      edgeCases,
      bugs,
      beginnerExplanation,
      recommendation,
      optimizedVersion,
      keyConcepts,
    } = body;

    if (!uid) return NextResponse.json({ message: "uid is required" }, { status: 400 });

    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const saved = await Explanation.create({
      userId: user._id,
      code,
      explanation,
      language,
      complexity,
      summary,
      timeComplexity,
      spaceComplexity,
      logicBreakdown,
      edgeCases,
      bugs,
      beginnerExplanation,
      recommendation,
      optimizedVersion,
      keyConcepts,
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
