// test-email.ts - Script complet avec toutes les dépendances
import dotenv from "dotenv";
import { Resend } from "resend";

// Charger les variables d'environnement
dotenv.config();

async function testResendDirect() {
  console.log("🚀 Test direct de Resend API...\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("❌ RESEND_API_KEY non trouvée dans .env");
    console.log("💡 Ajoutez: RESEND_API_KEY=votre_clé_api_ici");
    return;
  }

  console.log("🔑 Clé API détectée:", apiKey.substring(0, 10) + "...");

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: "Soporis Group <noreply@emails.soporisgroup.com>",
      to: ["votre-email@gmail.com"],
      subject: "Test direct Resend API",
      html: "<strong>Test d'envoi direct via Resend API</strong>",
      text: "Test d'envoi direct via Resend API",
    });

    if (error) {
      console.error("❌ Erreur Resend:", error);
      return;
    }

    console.log("✅ Email envoyé avec succès !");
    console.log("📧 ID:", data?.id);
    console.log("👤 De: noreply@emails.soporisgroup.com");
    console.log("📨 À: votre-email@gmail.com");
  } catch (error: any) {
    console.error("💥 Erreur inattendue:", error.message || error);
  }
}

// Test SMTP avec les bons types
async function testSMTPSimple() {
  console.log("\n🧪 Test SMTP simple...");

  // Import dynamique pour éviter les erreurs de types
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 587,
    secure: false,
    auth: {
      user: "resend",
      pass: process.env.RESEND_API_KEY || "",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Soporis Group" <noreply@emails.soporisgroup.com>',
      to: "votre-email@gmail.com",
      subject: "Test SMTP Resend",
      text: "Test SMTP réussi !",
      html: "<p>Test SMTP réussi !</p>",
    });

    console.log("✅ SMTP fonctionne !");
    console.log("📧 Message ID:", info.messageId);
  } catch (error: any) {
    console.error("❌ Erreur SMTP:", error.message);
  }
}

// Exécuter les tests
async function main() {
  console.log("📧 Test des configurations email\n" + "=".repeat(40));

  await testResendDirect();
  await testSMTPSimple();

  console.log("\n" + "=".repeat(40));
  console.log("🏁 Tous les tests terminés.");
}

main().catch(console.error);
