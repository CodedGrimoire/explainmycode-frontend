import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../_lib/db";
import { Explanation } from "../../_lib/models/Explanation";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }
  const explanation = await Explanation.findById(id);
  if (!explanation) return NextResponse.json({ message: "Explanation not found" }, { status: 404 });
  return NextResponse.json(explanation);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }
  await Explanation.findByIdAndDelete(id);
  return NextResponse.json({ message: "Explanation deleted" });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid explanation id" }, { status: 400 });
  }
  const { explanation, complexity, language } = await req.json();

  const updated = await Explanation.findByIdAndUpdate(
    id,
    { explanation, complexity, language },
    { returnDocument: "after" }
  );

  if (!updated) return NextResponse.json({ message: "Explanation not found" }, { status: 404 });
  return NextResponse.json(updated);
}
