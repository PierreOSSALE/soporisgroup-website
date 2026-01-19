// app/(marketing)/contact/ContactClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Mail, Send, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Route } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { createMessage } from "@/lib/actions/message.actions";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Appel à l'action serveur pour créer le message
      await createMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
        isRead: false,
        isArchived: false,
      });

      toast({
        title: "Message envoyé avec succès !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* <div className="pt-38 pb-4 bg-soporis-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-soporis-navy font-medium">Contact</span>
          </nav>
        </div>
      </div> */}

      {/* Header */}
      <div className="pb-12 pt-38 bg-background">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-4">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
              Contactez-nous
            </h1>
            <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une question ? Un projet ? N'hésitez pas à nous contacter, nous
              vous répondrons rapidement.
            </p>
          </div>
        </AnimatedSection>
      </div>

      {/* Contact Form & Info */}
      <section className="pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 border border-border h-auto md:max-h-160">
              <h2 className="font-display text-2xl font-bold text-primary mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nom complet *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Votre nom"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="votre@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Téléphone (optionnel)
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="06 12 34 56 78"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Sujet *
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="Sujet de votre message"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Décrivez votre projet..."
                    rows={5}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <Send className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary mb-6">
                  Nos coordonnées
                </h2>
                <div className="space-y-4">
                  <a
                    href="mailto:contact@soporisgroup.com"
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-card transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Email</p>
                      <p className="text-muted-foreground">
                        contact@soporisgroup.com
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Téléphone</p>
                      <p className="text-muted-foreground">+216 263 150 88</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Box */}
              <div className="bg-primary rounded-2xl p-8 text-center">
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-4">
                  Préférez-vous un appel ?
                </h3>
                <p className="text-primary-foreground/80 mb-6">
                  Réservez un créneau pour discuter de votre projet avec notre
                  équipe.
                </p>
                <Link href={"/rendez-vous" as Route}>
                  <Button variant="gold" size="lg" className="w-full">
                    Prendre rendez-vous
                  </Button>
                </Link>
              </div>

              {/* Informations supplémentaires */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-display text-lg font-bold text-primary mb-3">
                  Horaires d'ouverture
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="font-medium text-foreground">
                      9h - 18h
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Samedi</span>
                    <span className="font-medium text-foreground">
                      10h - 14h
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="font-medium text-foreground">Fermé</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    * Les champs marqués d'un astérisque sont obligatoires.
                    <br />
                    Nous nous engageons à répondre à votre message sous 24h
                    ouvrées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
