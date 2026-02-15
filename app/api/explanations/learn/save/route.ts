import { NextResponse } from "next/server";
import { connectDB } from "../../../_lib/db";
import { User } from "../../../_lib/models/User";
import { Tutorial } from "../../../_lib/models/Tutorial";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { uid, topic, level, category, language, tutorial } = body || {};

    if (!uid) return NextResponse.json({ message: "uid is required" }, { status: 400 });
    if (!tutorial) return NextResponse.json({ message: "tutorial payload is required" }, { status: 400 });

    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const saved = await Tutorial.create({ userId: user._id, topic, level, category, language, tutorial });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
