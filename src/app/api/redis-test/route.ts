import { NextResponse } from "next/server";
import { getRedis } from "@/services/Redis";

export async function GET() {
  try {
    const redis = await getRedis();

    await redis.set("studynotion:test", "Redis connected successfully");
    const value = await redis.get("studynotion:test");

    return NextResponse.json({
      status: "success",
      redis: "connected",
      value,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
