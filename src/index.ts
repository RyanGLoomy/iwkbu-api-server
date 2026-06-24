/**
 * Standalone server entry — for local development only.
 * On Vercel, use api/[[...route]].ts instead.
 */

import { serve } from "@hono/node-server";
import { app, API_KEY } from "./app.js";
import { getSummary } from "./data.js";

const PORT = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port: PORT }, (info) => {
   console.log(`[IWKBU API Server] Running on http://localhost:${info.port}`);
   console.log(`[IWKBU API Server] API Key: ${API_KEY.substring(0, 8)}...`);
   console.log(`[IWKBU API Server] Records: ${JSON.stringify(getSummary())}`);
});
