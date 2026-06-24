/**
 * Entry point — works both as standalone server and Vercel function.
 *
 * For Vercel: export default app (Vercel auto-detects Hono).
 * For standalone: serve() when not on Vercel.
 */

import { serve } from "@hono/node-server";
import { app, API_KEY } from "./app.js";
import { getSummary } from "./data.js";

export default app;

if (!process.env.VERCEL) {
   const PORT = Number(process.env.PORT ?? 8787);
   serve({ fetch: app.fetch, port: PORT }, (info) => {
      console.log(`[IWKBU API Server] Running on http://localhost:${info.port}`);
      console.log(`[IWKBU API Server] API Key: ${API_KEY.substring(0, 8)}...`);
      console.log(`[IWKBU API Server] Records: ${JSON.stringify(getSummary())}`);
   });
}
