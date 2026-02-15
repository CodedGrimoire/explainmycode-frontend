import { NextResponse } from "next/server";
import { connectDB } from "../../_lib/db";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connectDB();
  try {
    const { code, language } = await req.json();

    if (!code) {
      return NextResponse.json({ message: "code is required" }, { status: 400 });
    }

    const prompt = [
      "Explain the following code in a structured technical format.",
      "",
      `Code:\n${code}`,
      "",
      `Language:\n${language || "unspecified"}`,
      "",
      "Return ONLY valid JSON in the following structure:",
      "{",
      '  "summary": "2-4 line explanation of what the code does",',
      '  "timeComplexity": "Big-O time complexity with reason",',
      '  "spaceComplexity": "Big-O space complexity with reason",',
      '  "logicBreakdown": [',
      '    "step 1",',
      '    "step 2",',
      '    "step 3"',
      "  ],",
      '  "edgeCases": [',
      '    "edge case 1",',
      '    "edge case 2"',
      "  ],",
      '  "bugs": [',
      '    "possible bug 1",',
      '    "possible bug 2"',
      "  ],",
      '  "beginnerExplanation": "Simple explanation a beginner can understand",',
      '  "recommendation": "one concise recommendation to improve the code",',
      '  "optimizedVersion": "Improved or more efficient version of the code (same language)",',
      '  "keyConcepts": [',
      '    "concept 1",',
      '    "concept 2",',
      '    "concept 3"',
      "  ]",
      "}",
      "",
      "STRICT RULES:",
      "- Return ONLY JSON",
      "- No markdown",
      "- No numbering",
      "- No explanation outside JSON",
      "- No backticks",
      "- No headings",
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
      const errorText = await response.text();
      return NextResponse.json({ message: "GROQ request failed", detail: errorText }, { status: 502 });
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

      const cleanText = stripped.slice(jsonStart, jsonEnd);
      const parsed = JSON.parse(cleanText);

      return NextResponse.json(parsed);
    } catch (err) {
      return NextResponse.json({ message: "AI returned invalid JSON", raw: content }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
