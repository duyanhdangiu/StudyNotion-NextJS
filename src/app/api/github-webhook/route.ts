import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { spawn } from "child_process";

export const runtime = "nodejs";

const PROJECT =
  "/home/io-duyanh2108-sixforce/htdocs/duyanh.sixforce.io.vn";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    const signature = req.headers.get("x-hub-signature-256");
    const event = req.headers.get("x-github-event");

    const body = await req.text();

    const expectedSignature =
      "sha256=" +
      crypto.createHmac("sha256", secret).update(body).digest("hex");

    if (
      !signature ||
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    if (event === "ping") {
      return NextResponse.json({ message: "pong" });
    }

    if (event !== "push") {
      return NextResponse.json({ message: "Event ignored" });
    }

    const payload = JSON.parse(body);

    if (payload.ref !== "refs/heads/main") {
      return NextResponse.json({ message: "Branch ignored" });
    }

    const child = spawn(
      "/bin/bash",
      [
        "-lc",
        `${PROJECT}/deploy.sh >> ${PROJECT}/deploy-webhook.log 2>&1`,
      ],
      {
        cwd: PROJECT,
        detached: true,
        stdio: "ignore",
      }
    );

    child.unref();

    return NextResponse.json(
      {
        status: "accepted",
        message: "Deployment started",
      },
      { status: 202 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: String(error),
      },
      { status: 500 }
    );
  }
}
