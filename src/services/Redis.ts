import { createClient } from "redis";

let client: ReturnType<typeof createClient> | null = null;

export async function getRedis() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    });

    client.on("error", (err) => console.error("Redis Error:", err));
  }

  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}
