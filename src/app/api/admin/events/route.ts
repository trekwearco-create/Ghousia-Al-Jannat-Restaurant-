import { requireAdmin } from "@/lib/auth";
import { onNewOrder } from "@/lib/store";

export async function GET() {
  if (!(await requireAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  let cleanup: () => void = () => undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      send({ type: "hello" });
      cleanup = onNewOrder((order) => send({ type: "order", order }));
      const ping = setInterval(() => send({ type: "ping" }), 15000);
      const originalCleanup = cleanup;
      cleanup = () => {
        clearInterval(ping);
        originalCleanup();
      };
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
