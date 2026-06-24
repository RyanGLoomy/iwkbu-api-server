/**
 * Hono app definition — shared between standalone server and Vercel handler.
 */

import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import {
   COMPLIANCE_STATUS,
   getAllRecords,
   getRecordsByPlates,
   getSummary,
   regenerateData,
   type ComplianceRecord,
} from "./data.js";

const app = new Hono();

const API_KEY = process.env.IWKBU_API_KEY ?? "demo-iwkbu-api-key-2026";

app.use("*", async (c, next) => {
   if (c.req.path === "/health") return next();

   const auth = c.req.header("authorization") ?? "";
   const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";

   if (bearer !== API_KEY) {
      return c.json(
         {
            type: "https://iwkbu-api.example.com/errors/unauthorized",
            title: "Unauthorized",
            status: 401,
            detail: "Missing or invalid API key. Use Authorization: Bearer <key>.",
         },
         401,
         { "Content-Type": "application/problem+json" },
      );
   }

   return next();
});

app.get("/health", (c) => {
   return c.json({
      status: "ok",
      service: "iwkbu-api-server",
      version: "1.0.0",
      uptime: process.uptime(),
      records: getSummary(),
   });
});

const checkSchema = z.object({
   plates: z.array(z.string().min(3).max(12)).min(1).max(5000),
});

app.post("/compliance/check", zValidator("json", checkSchema), (c) => {
   const { plates } = c.req.valid("json");
   const records = getRecordsByPlates(plates);

   return c.json({
      records,
      source: "iwkbu-mock-api",
      fetched_at: new Date().toISOString(),
      count: records.length,
   });
});

app.get("/compliance/all", (c) => {
   const limit = Math.min(Number(c.req.query("limit") ?? "50"), 200);
   const offset = Number(c.req.query("offset") ?? "0");

   const all = getAllRecords();
   const data = all.slice(offset, offset + limit);

   return c.json({
      data,
      pagination: {
         total: all.length,
         limit,
         offset,
         has_more: offset + limit < all.length,
      },
   });
});

app.get("/compliance/:plate", (c) => {
   const plate = c.req.param("plate");
   const records = getRecordsByPlates([plate]);
   const record = records[0];

   if (!record) {
      return c.json(
         {
            type: "https://iwkbu-api.example.com/errors/not-found",
            title: "Not Found",
            status: 404,
            detail: `No compliance record found for plate: ${plate}`,
         },
         404,
         { "Content-Type": "application/problem+json" },
      );
   }

   return c.json(record);
});

app.post("/compliance/refresh", (c) => {
   regenerateData();
   return c.json({
      message: "Demo data regenerated",
      summary: getSummary(),
   });
});

export { app, API_KEY };
export type { ComplianceRecord };
export { COMPLIANCE_STATUS };
