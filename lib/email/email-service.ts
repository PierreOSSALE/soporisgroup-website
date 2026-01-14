import { Resend } from "resend";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { prisma } from "@/lib/prisma"; // <-- Ajout de l'import

const resend = new Resend(process.env.RESEND_API_KEY);

// Styles communs pour les emails (déplacés au niveau du module)
const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const headerStyle = `
  background: linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%);
  color: white;
  padding: 30px;
  text-align: center;
  border-radius: 12px 12px 0 0;
`;

const contentStyle = `
  background: #ffffff;
  padding: 30px;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 12px 12px;
`;

const detailsStyle = `
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

interface AppointmentEmailData {
  name: string;
  email: string;
  date: Date;
  timeSlot: string;
  service: string;
  company?: string;
  phone?: string;
  message?: string;
  cancellation_token?: string;
}

const formatDate = (date: Date): string => {
  return format(date, "EEEE d MMMM yyyy", { locale: fr });
};

export async function sendAppointmentEmail(
  type: "created" | "confirmed" | "cancelled",
  appointment: AppointmentEmailData,
  adminEmail?: string,
  siteUrl?: string
) {
  const formattedDate = formatDate(appointment.date);

  switch (type) {
    case "created":
      // Email au client
      await resend.emails.send({
        from: "Soporis <contact@emails.soporisgroup.com>",
        to: [appointment.email],
        subject: `Demande de rendez-vous reçue - ${formattedDate}`,
        html: `
          <div style="${baseStyles}">
            <div style="${headerStyle}">
              <h1 style="margin: 0; font-size: 24px;">Demande de rendez-vous reçue</h1>
            </div>
            <div style="${contentStyle}">
              <p style="font-size: 16px; color: #374151;">Bonjour ${
                appointment.name
              },</p>
              <p style="color: #6b7280;">Nous avons bien reçu votre demande de rendez-vous. Nous la traiterons dans les plus brefs délais.</p>
              
              <div style="${detailsStyle}">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">Récapitulatif</h3>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Date :</strong> ${formattedDate}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Heure :</strong> ${
                  appointment.timeSlot
                }</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Service :</strong> ${
                  appointment.service
                }</p>
                ${
                  appointment.company
                    ? `<p style="margin: 5px 0; color: #4b5563;"><strong>Entreprise :</strong> ${appointment.company}</p>`
                    : ""
                }
              </div>
              
              <p style="color: #6b7280;">Vous recevrez un email de confirmation une fois votre rendez-vous validé.</p>
              
              <p style="margin-top: 30px; color: #6b7280;">
                Cordialement,<br>
                <strong>L'équipe Soporis</strong>
              </p>
            </div>
          </div>
        `,
      });

      // Notification admin
      if (adminEmail) {
        await resend.emails.send({
          from: "Soporis <contact@emails.soporisgroup.com>",
          to: [adminEmail],
          subject: `🆕 Nouvelle demande de RDV - ${appointment.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a365d;">Nouvelle demande de rendez-vous</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Client</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${
                  appointment.name
                }</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${
                  appointment.email
                }</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Téléphone</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${
                  appointment.phone || "Non renseigné"
                }</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Entreprise</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${
                  appointment.company || "Non renseignée"
                }</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formattedDate}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Heure</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${
                  appointment.timeSlot
                }</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Service</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${
                  appointment.service
                }</td></tr>
                ${
                  appointment.message
                    ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Message</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.message}</td></tr>`
                    : ""
                }
              </table>
            </div>
          `,
        });
      }
      break;

    case "confirmed":
      const cancelUrl =
        appointment.cancellation_token && siteUrl
          ? `${siteUrl}/annuler-rdv?token=${appointment.cancellation_token}`
          : null;

      await resend.emails.send({
        from: "Soporis <contact@emails.soporisgroup.com>",
        to: [appointment.email],
        subject: `✅ Rendez-vous confirmé - ${formattedDate}`,
        html: `
          <div style="${baseStyles}">
            <div style="${headerStyle}">
              <h1 style="margin: 0; font-size: 24px;">✅ Rendez-vous confirmé</h1>
            </div>
            <div style="${contentStyle}">
              <p style="font-size: 16px; color: #374151;">Bonjour ${
                appointment.name
              },</p>
              <p style="color: #6b7280;">Excellente nouvelle ! Votre rendez-vous a été confirmé.</p>
              
              <div style="${detailsStyle}">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">Détails du rendez-vous</h3>
                <p style="margin: 5px 0; color: #4b5563;"><strong>📅 Date :</strong> ${formattedDate}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>🕐 Heure :</strong> ${
                  appointment.timeSlot
                }</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>📋 Service :</strong> ${
                  appointment.service
                }</p>
              </div>
              
              ${
                cancelUrl
                  ? `
              <div style="margin: 20px 0; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>Besoin d'annuler ?</strong><br>
                  <a href="${cancelUrl}" style="color: #b45309; text-decoration: underline;">Cliquez ici pour annuler votre rendez-vous</a>
                </p>
              </div>
              `
                  : ""
              }
              
              <p style="color: #6b7280;">N'hésitez pas à nous contacter si vous avez des questions.</p>
              
              <p style="margin-top: 30px; color: #6b7280;">
                À très bientôt,<br>
                <strong>L'équipe Soporis</strong>
              </p>
            </div>
          </div>
        `,
      });
      break;

    case "cancelled":
      await resend.emails.send({
        from: "Soporis <contact@emails.soporisgroup.com>",
        to: [appointment.email],
        subject: `Rendez-vous annulé - ${formattedDate}`,
        html: `
          <div style="${baseStyles}">
            <div style="${headerStyle
              .replace("#1a365d", "#dc2626")
              .replace("#2d4a7c", "#ef4444")}">
              <h1 style="margin: 0; font-size: 24px;">Rendez-vous annulé</h1>
            </div>
            <div style="${contentStyle}">
              <p style="font-size: 16px; color: #374151;">Bonjour ${
                appointment.name
              },</p>
              <p style="color: #6b7280;">Nous vous informons que votre rendez-vous a été annulé.</p>
              
              <div style="${detailsStyle}">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">Rendez-vous concerné</h3>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Date :</strong> ${formattedDate}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Heure :</strong> ${
                  appointment.timeSlot
                }</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Service :</strong> ${
                  appointment.service
                }</p>
              </div>
              
              <p style="color: #6b7280;">Si vous souhaitez prendre un nouveau rendez-vous, n'hésitez pas à visiter notre site.</p>
              
              <p style="margin-top: 30px; color: #6b7280;">
                Cordialement,<br>
                <strong>L'équipe Soporis</strong>
              </p>
            </div>
          </div>
        `,
      });
      break;
  }
}

export async function sendReminderEmails() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // Récupérer les rendez-vous confirmés pour demain sans rappel envoyé
  const appointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: new Date(tomorrowStr),
        lt: new Date(new Date(tomorrowStr).getTime() + 24 * 60 * 60 * 1000),
      },
      status: "confirmed",
      reminder_sent: false,
    },
  });

  const results = [];

  for (const appointment of appointments) {
    try {
      const formattedDate = formatDate(appointment.date);

      await resend.emails.send({
        from: "Soporis <contact@emails.soporisgroup.com>",
        to: [appointment.email],
        subject: `⏰ Rappel : Votre rendez-vous demain - ${formattedDate}`,
        html: `
          <div style="${baseStyles}">
            <div style="${headerStyle}">
              <h1 style="margin: 0; font-size: 24px;">⏰ Rappel de rendez-vous</h1>
            </div>
            <div style="${contentStyle}">
              <p style="font-size: 16px; color: #374151;">Bonjour ${appointment.name},</p>
              <p style="color: #6b7280;">Nous vous rappelons que vous avez un rendez-vous prévu <strong>demain</strong>.</p>
              
              <div style="${detailsStyle}">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">Détails du rendez-vous</h3>
                <p style="margin: 5px 0; color: #4b5563;"><strong>📅 Date :</strong> ${formattedDate}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>🕐 Heure :</strong> ${appointment.timeSlot}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>📋 Service :</strong> ${appointment.service}</p>
              </div>
              
              <p style="color: #6b7280;">N'hésitez pas à nous contacter si vous avez des questions ou si vous devez modifier votre rendez-vous.</p>
              
              <p style="margin-top: 30px; color: #6b7280;">
                À demain !<br>
                <strong>L'équipe Soporis</strong>
              </p>
            </div>
          </div>
        `,
      });

      // Marquer le rappel comme envoyé
      await prisma.appointment.update({
        where: { id: appointment.id },
        data: { reminder_sent: true },
      });

      results.push({
        id: appointment.id,
        email: appointment.email,
        status: "sent",
      });
    } catch (error: any) {
      console.error(`Error sending reminder to ${appointment.email}:`, error);
      results.push({
        id: appointment.id,
        email: appointment.email,
        status: "error",
        error: error.message,
      });
    }
  }

  return results;
}
