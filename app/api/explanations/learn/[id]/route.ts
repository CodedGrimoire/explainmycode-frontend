import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../_lib/db";
import { Tutorial } from "../../../_lib/models/Tutorial";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const tutorial = await Tutorial.findById(id);
  if (!tutorial) return NextResponse.json({ message: "Tutorial not found" }, { status: 404 });

  return NextResponse.json(tutorial);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const deleted = await Tutorial.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ message: "Tutorial not found" }, { status: 404 });

  return NextResponse.json({ message: "Tutorial deleted" });
}
