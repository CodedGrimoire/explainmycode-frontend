import { NextResponse } from "next/server";
import { connectDB } from "../../_lib/db";
import { User } from "../../_lib/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connectDB();
  try {
    const { uid, email } = await req.json();

    if (!uid || !email) {
      return NextResponse.json({ message: "uid and email are required" }, { status: 400 });
    }

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({ firebaseUid: uid, email });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
