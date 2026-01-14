import { NextRequest, NextResponse } from "next/server";
import { sendDailyReminders } from "@/lib/email/email-service";

export async function GET(req: NextRequest) {
  // Méthode 1: Vérification par header
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Envoie les rappels (la fonction ne retourne rien)
    await sendDailyReminders();

    return NextResponse.json({
      success: true,
      message: "Rappels envoyés avec succès",
    });
  } catch (error: any) {
    console.error("Error in reminder route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
