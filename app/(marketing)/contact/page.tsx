"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Route } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons rapidement.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };
  return (
    <>
      <div className="pt-38 pb-4 bg-soporis-white">
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
      </div>

      {/* Header */}
      <div className="pb-12 pt-4 bg-background">
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
          </div>{" "}
        </AnimatedSection>
      </div>

      {/* Contact Form & Info */}
      <section className="pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="font-display text-2xl font-bold text-primary mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nom complet
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Sujet
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="Sujet de votre message"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Décrivez votre projet..."
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full group"
                >
                  Envoyer le message
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                  <a
                    href="mailto:support@soporisgroup.com"
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-card transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Support</p>
                      <p className="text-muted-foreground">
                        support@soporisgroup.com
                      </p>
                    </div>
                  </a>
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
                  <Button variant="gold" size="lg">
                    Prendre rendez-vous
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
