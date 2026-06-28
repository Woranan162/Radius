import { NextResponse } from "next/server";
import { deleteService } from "@/lib/store/graph-store";

type RouteContext = { params: Promise<{ id: string }> };

/** DELETE /api/services/:id — remove a service and cascade dependencies */
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const graph = await deleteService(id);
    return NextResponse.json({
      ok: true,
      removedId: id,
      serviceCount: graph.services.length,
      services: graph.services,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
