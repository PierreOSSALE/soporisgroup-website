// app/(marketing)/rendez-vous/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  Users,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { FaWhatsapp } from "react-icons/fa";

const meetingTypes = [
  {
    icon: Video,
    title: "Appel vidéo",
    description: "Rencontre en visioconférence via Google Meet ou Zoom",
    duration: "30 min",
    value: "video",
  },
  {
    icon: Phone,
    title: "Appel téléphonique",
    description: "Discussion rapide pour clarifier vos besoins",
    duration: "15 min",
    value: "phone",
  },
  {
    icon: Users,
    title: "Consultation approfondie",
    description: "Session détaillée pour les projets complexes",
    duration: "60 min",
    value: "consultation",
  },
];

const services = [
  "Site Web Vitrine",
  "E-commerce",
  "Application Web",
  "Refonte de site",
  "Maintenance",
  "Autre",
];

// Time slots disponibles (à remplacer par vos propres données)
const availableTimeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

// Dates indisponibles (exemple)
const unavailableDates = [
  new Date(2024, 0, 1), // Nouvel an
  new Date(2024, 11, 25), // Noël
];

const RendezVousPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMeetingType, setSelectedMeetingType] = useState<string>("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });

  const { toast } = useToast();

  // Dates disponibles uniquement du lundi au vendredi, pas de dates passées
  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ne pas permettre les dates passées
    if (date < today) return false;

    // Ne pas permettre les week-ends
    const day = date.getDay();
    if (day === 0 || day === 6) return false;

    // Vérifier les dates indisponibles
    return !unavailableDates.some(
      (unavailable) =>
        unavailable.getDate() === date.getDate() &&
        unavailable.getMonth() === date.getMonth() &&
        unavailable.getFullYear() === date.getFullYear()
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(2);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      // Créer un FormData avec les données correctes
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("company", formData.company);
      formDataToSend.append("service", formData.service || "Consultation");
      formDataToSend.append("date", format(selectedDate, "yyyy-MM-dd"));
      formDataToSend.append("timeSlot", selectedTime);
      formDataToSend.append("message", formData.message);
      // Le status "pending" est déjà défini dans l'action serveur

      const result = await createAppointment(null, formDataToSend);

      // Vérifier le résultat
      if (!result.success) {
        throw new Error(result.error);
      }

      setIsConfirmed(true);
      toast({
        title: "Demande de rendez-vous envoyée !",
        description: `Votre demande pour le ${format(
          selectedDate,
          "EEEE d MMMM yyyy",
          { locale: fr }
        )} à ${selectedTime} a été reçue.`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  if (isConfirmed) {
    return (
      <>
        {/* Breadcrumb */}
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
              <span className="text-soporis-navy font-medium">Rendez-vous</span>
            </nav>
          </div>
        </div>

        {/* Confirmation */}
        <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
          <AnimatedSection className="text-center max-w-lg">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary mb-4">
              Demande envoyée !
            </h1>
            <p className="text-muted-foreground mb-4">
              Votre demande de rendez-vous a été enregistrée avec succès.
            </p>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-2 text-left">
                  <p>
                    <strong>Date :</strong>{" "}
                    {selectedDate &&
                      format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                  <p>
                    <strong>Heure :</strong> {selectedTime}
                  </p>
                  <p>
                    <strong>Type :</strong>{" "}
                    {
                      meetingTypes.find((t) => t.value === selectedMeetingType)
                        ?.title
                    }
                  </p>
                  <p>
                    <strong>Service :</strong> {formData.service}
                  </p>
                </div>
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground mb-6">
              Vous recevrez un email de confirmation à {formData.email}
            </p>
            <Link href="/">
              <Button>Retour à l'accueil</Button>
            </Link>
          </AnimatedSection>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
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
            <span className="text-soporis-navy font-medium">Rendez-vous</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="py-8 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-4">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
              Prendre rendez-vous
            </h1>
            <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Réservez un créneau pour discuter de votre projet avec notre
              équipe d'experts.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Meeting Types */}
      <section className="py-16 bg-soporis-gray">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-soporis-navy mb-6">
              Choisissez le type de rendez-vous
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {meetingTypes.map((type) => (
              <StaggerItem key={type.title}>
                <div
                  onClick={() => {
                    setSelectedMeetingType(type.value);
                    setStep(1);
                  }}
                  className={cn(
                    "bg-card rounded-2xl p-8 border transition-all duration-300 text-center cursor-pointer group h-full",
                    selectedMeetingType === type.value
                      ? "border-primary shadow-card ring-2 ring-primary/20"
                      : "border-border hover:shadow-card"
                  )}
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 transition-colors",
                      selectedMeetingType === type.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 group-hover:bg-primary/20"
                    )}
                  >
                    <type.icon
                      className={cn(
                        "h-8 w-8",
                        selectedMeetingType === type.value
                          ? "text-white"
                          : "text-primary"
                      )}
                    />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-primary mb-2">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {type.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-soporis-gold">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{type.duration}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Booking Section */}
      {selectedMeetingType && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <AnimatedSection>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Sélectionnez une date
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => !isDateAvailable(date)}
                        locale={fr}
                        className="rounded-md border"
                        modifiers={{
                          available: (date) => isDateAvailable(date),
                        }}
                        modifiersStyles={{
                          available: {
                            backgroundColor: "#10b981",
                            color: "white",
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </AnimatedSection>

                {/* Time Slots & Form */}
                <AnimatedSection delay={0.1}>
                  {step === 1 && selectedDate && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Créneaux disponibles -{" "}
                          {format(selectedDate, "d MMMM", { locale: fr })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-3">
                          {availableTimeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              onClick={() => handleTimeSelect(time)}
                              className="w-full"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {step === 2 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Vos informations</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedDate &&
                            format(selectedDate, "EEEE d MMMM yyyy", {
                              locale: fr,
                            })}{" "}
                          à {selectedTime}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nom complet *</Label>
                              <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                  handleFormChange("name", e.target.value)
                                }
                                placeholder="Votre nom"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                  handleFormChange("email", e.target.value)
                                }
                                placeholder="votre@email.com"
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone">Téléphone</Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                  handleFormChange("phone", e.target.value)
                                }
                                placeholder="+33 1 23 45 67 89"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="company">Entreprise</Label>
                              <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) =>
                                  handleFormChange("company", e.target.value)
                                }
                                placeholder="Nom de votre entreprise"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="service">Service concerné *</Label>
                            <Select
                              value={formData.service}
                              onValueChange={(value) =>
                                handleFormChange("service", value)
                              }
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un service" />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service} value={service}>
                                    {service}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Message (optionnel)</Label>
                            <Textarea
                              id="message"
                              rows={3}
                              value={formData.message}
                              onChange={(e) =>
                                handleFormChange("message", e.target.value)
                              }
                              placeholder="Décrivez brièvement votre projet..."
                            />
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setStep(1)}
                              className="flex-1"
                            >
                              Retour
                            </Button>
                            <Button
                              type="submit"
                              disabled={
                                isSubmitting ||
                                !formData.name ||
                                !formData.email ||
                                !formData.service
                              }
                              className="flex-1"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Envoi en cours...
                                </>
                              ) : (
                                "Confirmer le rendez-vous"
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {!selectedDate && step === 1 && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Sélectionnez une date dans le calendrier pour voir les
                          créneaux disponibles.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Alternative Contact */}
      <section className="py-16 bg-soporis-gray">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <CalendarIcon className="h-12 w-12 text-soporis-gold mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-primary mb-4">
              Pas disponible sur ces créneaux ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Envoyez-nous un email avec vos disponibilités et nous trouverons
              un moment qui vous convient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contact@soporisgroup.com">
                <Button variant="default" size="lg">
                  Envoyer un email
                </Button>
              </a>
              <Link
                href="https://wa.me/+21626315088?text=Bonjour, je souhaite prendre rendez-vous avec Soporis Group."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-soporis-gold text-soporis-gold hover:bg-soporis-gold hover:text-white"
                >
                  <FaWhatsapp />
                  WhatsApp
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default RendezVousPage;
