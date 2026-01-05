"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { BsWhatsapp } from "react-icons/bs";

const WHATSAPP_NUMBER = "+21626315088"; // Replace with actual number
const WHATSAPP_MESSAGE =
  "Bonjour, je souhaite discuter de mon projet web avec Soporis Group.";

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:bg-[#20BD5A] transition-colors group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contacter sur WhatsApp"
    >
      {/* <MessageCircle className="w-7 h-7 text-white" /> */}
      <BsWhatsapp className="w-7 h-7 text-white" />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        Discutons sur WhatsApp
      </span>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
    </motion.a>
  );
}
