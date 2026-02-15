import { NextResponse } from "next/server";
import { connectDB } from "../../../_lib/db";
import { User } from "../../../_lib/models/User";
import { Tutorial } from "../../../_lib/models/Tutorial";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    if (!uid) return NextResponse.json({ message: "uid is required" }, { status: 400 });

    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const tutorials = await Tutorial.find({ userId: user._id }).sort({ createdAt: -1 });
    return NextResponse.json(tutorials);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
