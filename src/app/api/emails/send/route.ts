import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendReply } from "@/lib/smtp-send";

export const dynamic = "force-dynamic";

/** POST — Send email reply */
export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { to, subject, bodyHtml, bodyText, inReplyTo, references } = body;

    if (!to || !subject || (!bodyHtml && !bodyText)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const saved = await sendReply({
      to,
      subject,
      bodyHtml: bodyHtml || `<p>${bodyText.replace(/\n/g, "<br>")}</p>`,
      bodyText: bodyText || "",
      inReplyTo,
      references,
    });

    return NextResponse.json({ success: true, id: saved.id });
  } catch (err: any) {
    console.error("Email send error:", err);
    return NextResponse.json(
      { error: err.message || "Send failed" },
      { status: 500 }
    );
  }
}
