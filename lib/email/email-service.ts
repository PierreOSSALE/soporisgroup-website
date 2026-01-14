// lib/email/email-service.ts
import { Resend } from "resend";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * CONFIGURATION DU THÈME (Extraction de globals.css)
 */
const theme = {
  navy: "hsl(220, 45%, 18%)",
  navyLight: "hsl(220, 35%, 30%)",
  gold: "hsl(38, 80%, 55%)",
  background: "hsl(210, 20%, 98%)",
  foreground: "hsl(220, 40%, 13%)",
  muted: "hsl(220, 15%, 45%)",
  white: "#ffffff",
  border: "hsl(220, 20%, 90%)",
  shadowCard: "0 8px 30px -8px rgba(15, 23, 42, 0.12)",
  radius: "10px",
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontSans: "'Inter', system-ui, -apple-system, sans-serif",
  gradientHero:
    "linear-gradient(135deg, hsl(220, 45%, 18%) 0%, hsl(220, 35%, 28%) 100%)",
};

const components = {
  detailsBox: `background-color: hsl(210, 20%, 94%); border-left: 3px solid hsl(38, 80%, 55%); padding: 25px; margin: 30px 0; border-radius: 4px;`,
  button: `display: inline-block; background: linear-gradient(135deg, hsl(220, 45%, 18%) 0%, hsl(220, 35%, 28%) 100%); color: #ffffff !important; padding: 16px 35px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.25);`,
  badge: `display: inline-block; padding: 4px 12px; background: hsl(38, 80%, 55%); color: hsl(220, 45%, 18%); font-size: 10px; font-weight: bold; border-radius: 20px; text-transform: uppercase; margin-bottom: 10px;`,
};

/**
 * LAYOUT MASTER (Structure HTML de Luxe)
 */
const getMasterLayout = (
  title: string,
  content: string,
  previewText: string
) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${theme.background}; font-family: ${theme.fontSans}; color: ${theme.foreground};">
  <div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${theme.background}; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: ${theme.white}; border-radius: ${theme.radius}; border: 1px solid ${theme.border}; box-shadow: ${theme.shadowCard}; overflow: hidden;">
          <tr>
            <td style="background: ${theme.gradientHero}; padding: 50px 40px; text-align: center;">
              <h1 style="margin: 0; font-family: ${theme.fontDisplay}; color: ${theme.white}; font-size: 26px; letter-spacing: 4px; text-transform: uppercase;">
                SOPORIS <span style="color: ${theme.gold};">GROUP</span>
              </h1>
              <div style="width: 30px; height: 1px; background: ${theme.gold}; margin: 15px auto;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="font-family: ${theme.fontDisplay}; font-size: 24px; color: ${theme.navy}; margin-top: 0; margin-bottom: 25px; text-align: center;">${title}</h2>
              <div style="font-size: 16px; line-height: 1.8; color: ${theme.foreground};">${content}</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #fcfcfd; border-top: 1px solid ${theme.border}; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: ${theme.muted}; letter-spacing: 1px;">&copy; 2026 SOPORIS GROUP &bull; EXCELLENCE DIGITALE</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * 1. ENVOI DES EMAILS DE FLUX (Création, Confirmation, Annulation)
 */
export async function sendAppointmentEmail(
  type: "created" | "confirmed" | "cancelled",
  appointment: any,
  adminEmail?: string,
  siteUrl?: string
) {
  const formattedDate = format(new Date(appointment.date), "EEEE d MMMM yyyy", {
    locale: fr,
  });
  let subject = "",
    title = "",
    content = "",
    preview = "";

  if (type === "created") {
    subject = "Demande reçue - Soporis Group";
    title = "Consultation en attente";
    preview = "Nous avons bien reçu votre demande de rendez-vous.";
    content = `
      <p>Cher(e) <strong>${appointment.name}</strong>,</p>
      <p>Votre demande pour le service <strong>${appointment.service}</strong> a été transmise à nos conseillers.</p>
      <div style="${components.detailsBox}">
        <span style="${components.badge}">Analyse en cours</span>
        <p style="margin: 5px 0;"><strong>Date :</strong> ${formattedDate}</p>
        <p style="margin: 5px 0;"><strong>Créneau :</strong> ${appointment.timeSlot}</p>
      </div>
      <p>Un membre de notre équipe reviendra vers vous pour valider cette séance.</p>`;
  } else if (type === "confirmed") {
    subject = "Confirmation de Séance - Soporis Group";
    title = "Rendez-vous Confirmé";
    preview = "Votre séance avec nos experts est confirmée.";
    content = `
      <p>Cher(e) <strong>${appointment.name}</strong>,</p>
      <p>Nous vous confirmons la tenue de votre séance stratégique.</p>
      <div style="${components.detailsBox}">
        <span style="${
          components.badge
        }; background: #10b981; color: white;">Confirmé</span>
        <p style="margin: 5px 0; font-size: 18px; font-family: ${
          theme.fontDisplay
        };"><strong>${formattedDate} à ${appointment.timeSlot}</strong></p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${siteUrl || "#"}" style="${
      components.button
    }">Accéder à mon espace</a>
      </div>`;
  } else if (type === "cancelled") {
    subject = "Annulation de Rendez-vous - Soporis Group";
    title = "Notification d'Annulation";
    content = `<p>Votre séance du ${formattedDate} a été annulée. Pour toute reprogrammation, visitez notre site.</p>`;
  }

  return await resend.emails.send({
    from: "Soporis Group <contact@emails.soporisgroup.com>",
    to: [appointment.email],
    subject,
    html: getMasterLayout(title, content, preview),
  });
}

/**
 * 2. AUTOMATISATION AVEC PRISMA (Rappels 24h avant)
 */
export async function sendDailyReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
  const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

  // PRISMA : Récupération des RDV de demain non notifiés
  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: startOfTomorrow, lte: endOfTomorrow },
      status: "confirmed",
      reminder_sent: false,
    },
  });

  for (const app of appointments) {
    try {
      const formattedDate = format(new Date(app.date), "EEEE d MMMM", {
        locale: fr,
      });

      await resend.emails.send({
        from: "Soporis Group <contact@emails.soporisgroup.com>",
        to: [app.email],
        subject: "Rappel : Votre séance de demain",
        html: getMasterLayout(
          "Rappel de Séance",
          `<p>Bonjour ${app.name}, nous vous rappelons votre rendez-vous de demain à <strong>${app.timeSlot}</strong>.</p>`,
          "À demain pour votre consultation Soporis."
        ),
      });

      // PRISMA : Mise à jour de l'état pour éviter les doublons
      await prisma.appointment.update({
        where: { id: app.id },
        data: { reminder_sent: true },
      });
    } catch (e) {
      console.error("Erreur rappel:", e);
    }
  }
}
