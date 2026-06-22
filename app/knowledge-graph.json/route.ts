import { knowledgeGraph } from "@/lib/kg";

export const dynamic = "force-static";

export function GET() {
  return Response.json(knowledgeGraph());
}
