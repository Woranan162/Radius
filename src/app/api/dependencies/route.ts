import { NextResponse } from "next/server";
import { addDependency } from "@/lib/store/graph-store";

/** POST /api/dependencies — link services (source depends on target) */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, to } = body as { from?: string; to?: string };

    if (!from || !to) {
      return NextResponse.json(
        { error: "from and to service ids are required" },
        { status: 400 },
      );
    }

    const graph = await addDependency(from, to);
    return NextResponse.json({ ok: true, graph }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
