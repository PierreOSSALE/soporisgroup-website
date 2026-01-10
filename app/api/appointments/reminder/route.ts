import { NextRequest, NextResponse } from "next/server";
import { sendReminderEmails } from "@/lib/email/email-service";

export async function GET(req: NextRequest) {
  // Méthode 1: Vérification par header
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Méthode 2: Vérification par query param (moins sécurisé)
  // const { searchParams } = new URL(req.url);
  // const secret = searchParams.get('secret');
  // if (secret !== process.env.CRON_SECRET) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const results = await sendReminderEmails();

    return NextResponse.json({
      success: true,
      message: `Rappels envoyés: ${
        results.filter((r) => r.status === "sent").length
      }`,
      results,
    });
  } catch (error: any) {
    console.error("Error in reminder route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
