// app/api/appointments/available-slots/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/actions/appointment.actions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const slots = await getAvailableSlots(date);

    return NextResponse.json({ date, slots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
