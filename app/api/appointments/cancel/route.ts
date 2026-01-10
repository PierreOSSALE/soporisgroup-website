import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAppointmentEmail } from "@/lib/email/email-service";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    console.log("Received cancellation request with token:", token);

    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 400 });
    }

    // Find appointment by cancellation token
    const appointment = await prisma.appointment.findUnique({
      where: { cancellation_token: token },
    });

    if (!appointment) {
      console.error("Appointment not found for token:", token);
      return NextResponse.json(
        { error: "Rendez-vous non trouvé ou lien invalide" },
        { status: 404 }
      );
    }

    if (appointment.status === "cancelled") {
      return NextResponse.json(
        { error: "Ce rendez-vous a déjà été annulé" },
        { status: 400 }
      );
    }

    // Cancel the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: "cancelled" },
    });

    console.log(`Appointment ${appointment.id} cancelled successfully`);

    // Send cancellation confirmation email
    try {
      await sendAppointmentEmail("cancelled", {
        name: appointment.name,
        email: appointment.email,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        service: appointment.service,
        company: appointment.company || undefined,
        phone: appointment.phone || undefined,
        message: appointment.message || undefined,
        cancellation_token: appointment.cancellation_token || undefined,
      });
      console.log("Cancellation email sent to", appointment.email);
    } catch (emailError) {
      console.error("Error sending cancellation email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Rendez-vous annulé avec succès",
      appointment: {
        name: appointment.name,
        date: appointment.date.toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time_slot: appointment.timeSlot,
        service: appointment.service,
      },
    });
  } catch (error: any) {
    console.error("Error in cancel appointment API:", error);
    return NextResponse.json(
      {
        error: error.message || "Une erreur est survenue lors de l'annulation",
      },
      { status: 500 }
    );
  }
}

// Vous pouvez aussi ajouter une méthode POST si nécessaire
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error:
        "Méthode POST non supportée. Utilisez GET avec le token dans l'URL",
    },
    { status: 405 }
  );
}
