import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createOpenAI } from "npm:@ai-sdk/openai";
import { generateObject } from "npm:ai";
import { CandidateCVSchema } from "./cv.schema.ts";

const PORT = Deno.env.get("PORT") ?? "8000";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!OPENAI_API_KEY) {
  console.warn(
    "OPENAI_API_KEY not found in environment variables, defaulting back to using Pollinations AI"
  );
}
const baseURL = OPENAI_API_KEY
  ? "https://api.openai.com/v1"
  : "https://text.pollinations.ai/openai";

const apiKey = OPENAI_API_KEY ?? "pollinations";

export async function CVTextToJSON(content: string) {
  const openai = createOpenAI({
    baseURL,
    apiKey,
  });
  try {
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      prompt: `Using this CV information of the candidate give me a JSON object of the candidate's CV.\n${content}`,
      schema: CandidateCVSchema,
    });

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const app = new Hono();
app.use(cors());
app.get("/health", (c) => {
  return c.json({ status: "UP" }, 200);
});
app.post("/", async (c) => {
  const { content } = c.body;
  const cv_json = await CVTextToJSON(content);
  return c.json(cv_json, 200);
});

Deno.serve({ port: Number(PORT) }, app.fetch);
