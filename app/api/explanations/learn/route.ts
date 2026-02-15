import { NextResponse } from "next/server";
import { connectDB } from "../../_lib/db";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { topic, level = "beginner", category = "algorithm", language = "javascript" } = body || {};

    if (!topic || !topic.trim()) {
      return NextResponse.json({ message: "topic is required" }, { status: 400 });
    }

    const prompt = [
      `Create a compact study card for the ${category} "${topic}" tailored for ${level} learners.`,
      "Return ONLY valid JSON (no markdown/backticks) matching this shape:",
      "{",
      '  "title": "Readable title for the concept",',
      '  "level": "beginner | medium | hard",',
      '  "category": "algorithm | data structure",',
      '  "theory": "3-5 sentences explaining the intuition and when it matters",',
      '  "implementationSteps": ["step 1", "step 2", "step 3"],',
      '  "pseudocodeB64": "base64-encoded pseudocode text",',
      '  "codeExample": { "language": "preferred code language", "codeB64": "base64-encoded code snippet" },',
      '  "useCases": ["when to use it", "another good use"],',
      '  "complexity": { "time": "O(...)" , "space": "O(...)" },',
      '  "tips": ["practical tip or pitfall", "one more improvement"],',
      '  "relatedConcepts": ["related topic", "another"]',
      "}",
      "Rules: all free-text (theory, pseudocodeB64 decoded, codeExample.codeB64 decoded) must be concise; codeExample under 30 lines.",
      "Do NOT include raw newlines in JSON strings; encode multi-line text in base64 fields only.",
      `Preferred language for codeExample: ${language}.`,
    ].join("\n");

    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({ message: "GROQ request failed", detail }, { status: 502 });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ message: "Invalid response from GROQ" }, { status: 502 });
    }

    try {
      const stripped = content.replace(/```json|```/gi, "").trim();
      const jsonStart = stripped.indexOf("{");
      const jsonEnd = stripped.lastIndexOf("}") + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        return NextResponse.json({ message: "AI returned no JSON object", raw: content }, { status: 502 });
      }

      let cleanText = stripped.slice(jsonStart, jsonEnd);
      cleanText = cleanText.replace(/\n\s*\.replace\([^)]*\)/g, "");

      const parsed = JSON.parse(cleanText);

      if (parsed?.pseudocodeB64) {
        parsed.pseudocode = Buffer.from(parsed.pseudocodeB64, "base64").toString("utf8");
      }
      if (parsed?.codeExample?.codeB64) {
        parsed.codeExample.code = Buffer.from(parsed.codeExample.codeB64, "base64").toString("utf8");
      }

      return NextResponse.json(parsed);
    } catch (err) {
      return NextResponse.json({ message: "AI returned invalid JSON", raw: content }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
