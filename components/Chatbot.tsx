"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs"; // On réutilise l'icône WhatsApp
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import heroBg from "@/public/img/hero-bg.webp";
import { OptimizedImage } from "./ui/OptimizedImage";

// --- CONSTANTES WHATSAPP ---
const WHATSAPP_NUMBER = "+21626315088";
const WHATSAPP_MESSAGE =
  "Bonjour, je souhaite discuter de mon projet web avec Soporis Group suite à notre échange sur le chat.";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  action?: "whatsapp" | null; // Ajout d'une propriété optionnelle pour l'action
}

const quickReplies = [
  "Quels sont vos tarifs ?",
  "Délai de réalisation ?",
  "Comment vous contacter ?",
  "Voir vos réalisations",
];

// On modifie la structure pour retourner un objet { text, action }
const botResponses: Record<string, { text: string; action?: "whatsapp" }> = {
  default: {
    text: "Merci pour votre message ! Pour une réponse personnalisée, le plus simple est de passer sur WhatsApp. Un membre de notre équipe vous répondra immédiatement.",
    action: "whatsapp", // C'est ici qu'on déclenche l'apparition du bouton
  },
  tarifs: {
    text: "Nos packs démarrent à partir de 499€ pour le pack Starter (site vitrine 5 pages). Le pack Pro est à 999€ et le pack Premium à partir de 1999€. Chaque projet fait l'objet d'un devis personnalisé gratuit !",
  },
  délai: {
    text: "Le délai dépend de la complexité : 2-3 semaines pour un site vitrine, 4-6 semaines pour un site élaboré, 2-3 mois pour une application web. Contactez-nous pour un planning précis !",
  },
  contact: {
    text: "Vous pouvez nous joindre par email à contact@soporisgroup.com ou via WhatsApp ci-dessous.",
    action: "whatsapp", // On peut aussi le mettre ici
  },
  réalisations: {
    text: "Découvrez nos projets sur la page Réalisations ! Nous avons travaillé avec des startups, PME et grandes entreprises sur des sites vitrines, e-commerce et applications web.",
  },
};

function getBotResponse(message: string): {
  text: string;
  action?: "whatsapp";
} {
  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes("tarif") ||
    lowerMessage.includes("prix") ||
    lowerMessage.includes("coût")
  ) {
    return botResponses.tarifs;
  }
  if (
    lowerMessage.includes("délai") ||
    lowerMessage.includes("temps") ||
    lowerMessage.includes("durée")
  ) {
    return botResponses.délai;
  }
  if (
    lowerMessage.includes("contact") ||
    lowerMessage.includes("joindre") ||
    lowerMessage.includes("email")
  ) {
    return botResponses.contact;
  }
  if (
    lowerMessage.includes("réalisation") ||
    lowerMessage.includes("portfolio") ||
    lowerMessage.includes("projet")
  ) {
    return botResponses.réalisations;
  }
  return botResponses.default;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! 👋 Je suis l'assistant de Soporis Group. Comment puis-je vous aider aujourd'hui ?",
      isBot: true,
      action: null,
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const response = getBotResponse(messageText);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.text,
        isBot: true,
        action: response.action || null, // On passe l'action si elle existe
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      WHATSAPP_MESSAGE,
    )}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Chat Button (Identique à avant) */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-2 md:bottom-15 right-5 md:right-10 z-50 flex items-center justify-center rounded-full shadow-2xl transition-all hover:ring-4 hover:ring-primary/20 ${
          isOpen ? "hidden" : ""
        }`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ouvrir le chat"
      >
        <Avatar className="w-14 h-14 border-2 border-primary cursor-pointer">
          <OptimizedImage
            src="https://res.cloudinary.com/db8hwgart/image/upload/f_auto,q_auto:best,w_48,h_48,c_fill,g_face/v1750759236/black-woman-7093911_1280_qn786k.jpg"
            alt="Support Avatar"
            width={48}
            height={48}
            isAvatar
            className="object-cover"
          />
          <AvatarFallback className="bg-secondary">
            <User className="w-8 h-8 text-primary" />
          </AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 rounded-full bg-animchatbot animate-ping opacity-25" />
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-10" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bg-card bottom-6 right-6 z-100 w-90 max-w-[calc(100vw-3rem)] border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Avatar className="w-10 h-10 border-2 border-primary">
                    <OptimizedImage
                      src="https://res.cloudinary.com/db8hwgart/image/upload/f_auto,q_auto:best,w_48,h_48,c_fill,g_face/v1750759236/black-woman-7093911_1280_qn786k.jpg"
                      alt="Support Avatar"
                      width={48}
                      height={48}
                      isAvatar
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-secondary">
                      <User className="w-5 h-5 text-primary" />
                    </AvatarFallback>{" "}
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-foreground">
                    Assistant Soporis
                  </h3>
                  <p className="text-xs text-primary-foreground/70">En ligne</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="relative h-80 overflow-hidden">
              {/* Background FIXE */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                  src={heroBg}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                  quality={60} // on peut baisser qualité pour chat bg
                  priority={false} // explicit
                />

                {/* Overlay pour lisibilité */}
                {/* <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" /> */}
              </div>

              {/* Scrollable messages */}
              <div className="relative z-10 h-full overflow-y-auto p-4 py-6 space-y-4">
                {messages.map((message: Message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${
                      message.isBot ? "" : "flex-row-reverse"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                      {message.isBot ? (
                        <Avatar className="w-8 h-8 border-2 border-primary">
                          <OptimizedImage
                            src="https://res.cloudinary.com/db8hwgart/image/upload/f_auto,q_auto:best,w_48,h_48,c_fill,g_face/v1750759236/black-woman-7093911_1280_qn786k.jpg"
                            alt="Support Avatar"
                            width={48}
                            height={48}
                            isAvatar
                            className="object-cover"
                          />
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <User className="w-4 h-4 text-soporis-gold" />
                      )}
                    </div>

                    {/* Message bubble */}
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      <div
                        className={`p-3 rounded-2xl text-sm shadow ${
                          message.isBot
                            ? "bg-secondary text-foreground rounded-tl-none"
                            : "bg-primary text-primary-foreground rounded-tr-none"
                        }`}
                      >
                        {message.text}
                      </div>

                      {/* WhatsApp CTA */}
                      {message.isBot && message.action === "whatsapp" && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={openWhatsApp}
                          className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm rounded-xl shadow w-fit"
                        >
                          <BsWhatsapp className="w-4 h-4" />
                          Discuter maintenant
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Replies et Input restent identiques... */}
            <div className="p-2 bg-soporis-gray-dark">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="text-xs px-3 py-1.5 bg-background rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border bg-primary">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-4 py-2 bg-secondary rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  variant="gold"
                  type="submit"
                  size="icon"
                  className="rounded-full w-10 h-10 cursor-pointer"
                >
                  <Send className="w-4 h-4 " />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
