import { runScan } from "@/lib/scanner";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const target = typeof body?.target === "string" ? body.target : "";
    const result = await runScan(target);
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scan failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
