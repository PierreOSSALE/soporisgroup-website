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
  detailsBox: `background-color: hsl(210, 20%, 94%); border-left: 3px solid hsl(38, 80%, 55%); padding: 12.5px; margin: 10px 0; border-radius: 4px;`,
  button: `display: inline-block; background: linear-gradient(135deg, hsl(220, 45%, 18%) 0%, hsl(220, 35%, 28%) 100%); color: #ffffff !important; padding: 8px 16.5px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.25);`,
  badge: `display: inline-block; padding: 4px 12px; background: hsl(38, 80%, 55%); color: hsl(220, 45%, 18%); font-size: 10px; font-weight: bold; border-radius: 10px; text-transform: uppercase; margin-bottom: 10px;`,
  infoBox: `background-color: hsl(210, 20%, 96%); border: 1px solid hsl(220, 20%, 85%); border-radius: 6px; padding: 15px; margin: 20px 0; font-size: 14px; line-height: 1.6;`,
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Soporis Group</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 8px !important; }
      .header { padding: 30px 20px !important; }
      .content { padding: 30px 20px !important; }
      .footer { padding: 20px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${theme.background}; font-family: ${theme.fontSans}; color: ${theme.foreground}; line-height: 1.6;">
  <div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${theme.background}; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: ${theme.white}; border-radius: ${theme.radius}; border: 1px solid ${theme.border}; box-shadow: ${theme.shadowCard}; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td class="header" style="background: ${theme.gradientHero}; padding: 50px 40px; text-align: center;">
              <h1 style="margin: 0; font-family: ${theme.fontDisplay}; color: ${theme.white}; font-size: 26px; letter-spacing: 2px; text-transform: uppercase;">
                SOPORIS <span style="color: ${theme.gold};">GROUP</span>
              </h1>
              <div style="width: 30px; height: 2px; background: ${theme.gold}; margin: 15px auto;"></div>
              <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8); letter-spacing: 1px;">Excellence Digitale</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content" style="padding: 50px 40px;">
              <h2 style="font-family: ${theme.fontDisplay}; font-size: 24px; color: ${theme.navy}; margin-top: 0; margin-bottom: 25px; text-align: center;">${title}</h2>
              <div style="font-size: 16px; line-height: 1.7; color: ${theme.foreground};">
                ${content}
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer" style="padding: 30px 40px; background-color: #f8f9fa; border-top: 1px solid ${theme.border}; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 14px; color: ${theme.muted};">
                Pour toute question, contactez-nous à :<br>
                <a href="mailto:contact@soporisgroup.com" style="color: ${theme.gold}; text-decoration: none; font-weight: 600;">contact@soporisgroup.com</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: ${theme.muted}; letter-spacing: 0.5px;">
                &copy; 2026 SOPORIS GROUP • Tous droits réservés
              </p>
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
    subject =
      "Confirmation de réception de votre demande de rendez-vous - Soporis Group";
    title = "Demande de rendez-vous reçue";
    preview =
      "Nous accusons réception de votre demande de rendez-vous avec Soporis Group.";

    content = `
      <p>Cher(e) <strong>${appointment.name}</strong>,</p>
      
      <p>Nous vous remercions pour votre demande de rendez-vous concernant le service <strong>${
        appointment.service
      }</strong>.</p>
      
      <div style="${components.detailsBox}">
        <span style="${components.badge}">Demande reçue</span>
        <p style="margin: 8px 0;"><strong>📅 Date :</strong> ${formattedDate}</p>
        <p style="margin: 8px 0;"><strong>⏰ Heure :</strong> ${
          appointment.timeSlot
        }</p>
        <p style="margin: 8px 0;"><strong>💼 Service :</strong> ${
          appointment.service
        }</p>
      </div>
      
      <p><strong>Prochaine étape :</strong> Notre équipe va maintenant examiner votre demande et confirmer votre rendez-vous dans les plus brefs délais. Vous recevrez un email de confirmation une fois votre créneau validé.</p>
      
      <div style="${components.infoBox}">
        <strong>ℹ️ Informations importantes :</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Vous pouvez annuler ou modifier votre rendez-vous jusqu'à 24 heures avant la date prévue</li>
          <li>Préparez vos questions et documents pour optimiser notre temps ensemble</li>
          <li>Un rappel vous sera envoyé 24 heures avant votre rendez-vous</li>
        </ul>
      </div>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="${siteUrl || "https://soporisgroup.com"}" style="${
      components.button
    }">VISITER NOTRE SITE</a>
      </p>
      
      <p>Cordialement,<br>
      <strong>L'équipe Soporis Group</strong></p>`;
  } else if (type === "confirmed") {
    subject = "Confirmation de votre rendez-vous - Soporis Group";
    title = "Rendez-vous confirmé";
    preview =
      "Votre rendez-vous avec Soporis Group est confirmé. Détails ci-joints.";

    content = `
      <p>Cher(e) <strong>${appointment.name}</strong>,</p>
      
      <p>Nous sommes ravis de vous confirmer votre rendez-vous pour discuter de votre projet <strong>${
        appointment.service
      }</strong>.</p>
      
      <div style="${components.detailsBox}">
        <span style="${
          components.badge
        }; background: #10b981; color: white;">✅ Confirmé</span>
        <p style="margin: 10px 0; font-size: 18px; font-family: ${
          theme.fontDisplay
        }; color: ${theme.navy};">
          <strong>${formattedDate}<br>
          à ${appointment.timeSlot}</strong>
        </p>
      </div>
      
      <p><strong>Préparation :</strong></p>
      <ul style="margin: 15px 0; padding-left: 20px;">
        <li>Préparez vos objectifs et questions principales</li>
        <li>Rassemblez les documents pertinents pour votre projet</li>
        <li>Notez vos contraintes et délais</li>
      </ul>
      
      <div style="${components.infoBox}">
        <strong>📞 Informations de contact :</strong><br>
        Si vous avez besoin de modifier ou d'annuler votre rendez-vous, veuillez nous contacter au moins 24 heures à l'avance à l'adresse : <a href="mailto:contact@soporisgroup.com" style="color: ${
          theme.gold
        }; font-weight: 600;">contact@soporisgroup.com</a>
      </div>
      
      <p><strong>Plateforme de visioconférence :</strong><br>
      Le lien de la réunion vous sera envoyé par email 30 minutes avant le début du rendez-vous.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${siteUrl || "https://soporisgroup.com"}" style="${
      components.button
    }">ACCÉDER À NOTRE PLATEFORME</a>
      </p>
      
      <p>Nous avons hâte de collaborer avec vous.<br><br>
      Cordialement,<br>
      <strong>L'équipe Soporis Group</strong></p>`;
  } else if (type === "cancelled") {
    subject = "Annulation de votre rendez-vous - Soporis Group";
    title = "Rendez-vous annulé";
    preview = "Votre rendez-vous avec Soporis Group a été annulé.";

    content = `
      <p>Cher(e) <strong>${appointment.name}</strong>,</p>
      
      <p>Nous vous informons que votre rendez-vous prévu le <strong>${formattedDate} à ${
      appointment.timeSlot
    }</strong> a été annulé.</p>
      
      <div style="${components.detailsBox}">
        <span style="${
          components.badge
        }; background: #ef4444; color: white;">Annulé</span>
        <p style="margin: 8px 0;"><strong>Service :</strong> ${
          appointment.service
        }</p>
        <p style="margin: 8px 0;"><strong>Date initiale :</strong> ${formattedDate} à ${
      appointment.timeSlot
    }</p>
      </div>
      
      <p>Si vous souhaitez reprogrammer un rendez-vous, nos équipes restent à votre disposition pour trouver un nouveau créneau qui convient à votre agenda.</p>
      
      <div style="${components.infoBox}">
        <strong>Reprendre rendez-vous :</strong><br>
        Vous pouvez prendre un nouveau rendez-vous directement sur notre site ou nous contacter pour convenir d'une nouvelle date.
      </div>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${siteUrl || "https://soporisgroup.com"}/rendez-vous" style="${
      components.button
    }">PRENDRE UN NOUVEAU RENDEZ-VOUS</a>
      </p>
      
      <p>Nous espérons avoir l'opportunité de collaborer avec vous prochainement.<br><br>
      Cordialement,<br>
      <strong>L'équipe Soporis Group</strong></p>`;
  }

  try {
    return await resend.emails.send({
      from: "Soporis Group <contact@emails.soporisgroup.com>",
      to: [appointment.email],
      subject,
      html: getMasterLayout(title, content, preview),
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}

/**
 * 2. AUTOMATISATION AVEC PRISMA (Rappels 24h avant)
 */
export async function sendDailyReminders() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

    // Récupération des RDV de demain non notifiés
    const appointments = await prisma.appointment.findMany({
      where: {
        date: { gte: startOfTomorrow, lte: endOfTomorrow },
        status: "confirmed",
        reminder_sent: false,
      },
    });

    console.log(`📧 Envoi de rappels pour ${appointments.length} rendez-vous`);

    for (const app of appointments) {
      try {
        const formattedDate = format(new Date(app.date), "EEEE d MMMM", {
          locale: fr,
        });

        const reminderContent = `
          <p>Bonjour <strong>${app.name}</strong>,</p>
          
          <p>Ceci est un rappel concernant votre rendez-vous de demain avec Soporis Group.</p>
          
          <div style="${components.detailsBox}">
            <span style="${components.badge}; background: #3b82f6; color: white;">🔔 Rappel</span>
            <p style="margin: 8px 0; font-size: 16px;">
              <strong>${formattedDate} à ${app.timeSlot}</strong><br>
              <span style="font-size: 14px;">Service : ${app.service}</span>
            </p>
          </div>
          
          <p><strong>Préparation :</strong></p>
          <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Vérifiez votre connexion internet et votre matériel</li>
            <li>Ayez vos documents prêts à partager</li>
            <li>Le lien de visioconférence vous sera envoyé 30 minutes avant le rendez-vous</li>
          </ul>
          
          <div style="${components.infoBox}">
            <strong>Besoin de modifier ?</strong><br>
            Pour annuler ou reporter votre rendez-vous, veuillez nous contacter rapidement à <a href="mailto:contact@soporisgroup.com" style="color: ${theme.gold}; font-weight: 600;">contact@soporisgroup.com</a>
          </div>
          
          <p>Nous avons hâte de vous rencontrer demain.<br><br>
          Cordialement,<br>
          <strong>L'équipe Soporis Group</strong></p>`;

        await resend.emails.send({
          from: "Soporis Group <contact@emails.soporisgroup.com>",
          to: [app.email],
          subject: `Rappel : Votre rendez-vous demain à ${app.timeSlot} - Soporis Group`,
          html: getMasterLayout(
            "Rappel de rendez-vous",
            reminderContent,
            "Rappel de votre rendez-vous de demain avec Soporis Group"
          ),
        });

        // Mise à jour de l'état pour éviter les doublons
        await prisma.appointment.update({
          where: { id: app.id },
          data: { reminder_sent: true },
        });

        console.log(`✅ Rappel envoyé à ${app.email}`);
      } catch (e) {
        console.error(`❌ Erreur d'envoi de rappel pour ${app.email}:`, e);
      }
    }

    return { success: true, count: appointments.length };
  } catch (error) {
    console.error("Erreur générale dans sendDailyReminders:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

/**
 * 3. Email de notification pour l'admin
 */
export async function sendAdminNotification(appointment: any) {
  const formattedDate = format(new Date(appointment.date), "EEEE d MMMM yyyy", {
    locale: fr,
  });

  const content = `
    <p><strong>Nouvelle demande de rendez-vous reçue :</strong></p>
    
    <div style="${components.detailsBox}">
      <p style="margin: 5px 0;"><strong>👤 Client :</strong> ${
        appointment.name
      }</p>
      <p style="margin: 5px 0;"><strong>📧 Email :</strong> ${
        appointment.email
      }</p>
      <p style="margin: 5px 0;"><strong>📞 Téléphone :</strong> ${
        appointment.phone || "Non renseigné"
      }</p>
      <p style="margin: 5px 0;"><strong>🏢 Entreprise :</strong> ${
        appointment.company || "Non renseignée"
      }</p>
      <hr style="border: none; border-top: 1px solid ${
        theme.border
      }; margin: 10px 0;">
      <p style="margin: 5px 0;"><strong>📅 Date :</strong> ${formattedDate}</p>
      <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${
        appointment.timeSlot
      }</p>
      <p style="margin: 5px 0;"><strong>💼 Service :</strong> ${
        appointment.service
      }</p>
    </div>
    
    ${
      appointment.message
        ? `
    <div style="${components.infoBox}">
      <strong>📝 Message du client :</strong><br>
      ${appointment.message}
    </div>
    `
        : ""
    }
    
    <p style="text-align: center; margin-top: 25px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/appointments" style="${
    components.button
  }">GÉRER LES RENDEZ-VOUS</a>
    </p>`;

  try {
    return await resend.emails.send({
      from: "Soportis Group <contact@emails.soporisgroup.com>",
      to: [process.env.ADMIN_EMAIL || "contact@soporisgroup.com"],
      subject: `Nouvelle demande de rendez-vous : ${appointment.name} - ${formattedDate} ${appointment.timeSlot}`,
      html: getMasterLayout(
        "Nouvelle demande de rendez-vous",
        content,
        "Nouvelle demande de rendez-vous reçue sur le site Soporis Group"
      ),
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification admin:", error);
  }
}
