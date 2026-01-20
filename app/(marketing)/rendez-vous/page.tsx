// app/(marketing)/rendez-vous/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  Users,
  Check,
  Loader2,
  Building2,
  AlertCircle,
  ArrowLeft, // Ajouté
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
import { format, isToday, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { FaWhatsapp } from "react-icons/fa";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDebounce } from "@/hooks/use-debounce";

const meetingTypes = [
  {
    icon: Video,
    title: "Appel vidéo",
    description: "Rencontre en visioconférence via Google Meet ou Zoom",
    duration: "30 min",
    value: "video",
    durationMinutes: 30,
  },
  {
    icon: Phone,
    title: "Appel téléphonique",
    description: "Discussion rapide pour clarifier vos besoins",
    duration: "15 min",
    value: "phone",
    durationMinutes: 15,
  },
  {
    icon: Users,
    title: "Consultation approfondie",
    description: "Session détaillée pour les projets complexes",
    duration: "60 min",
    value: "consultation",
    durationMinutes: 60,
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

const RendezVousPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMeetingType, setSelectedMeetingType] =
    useState<string>("video");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const debouncedDate = useDebounce(selectedDate, 300);

  const { toast } = useToast();
  const {
    getAvailableSlotsForDate,
    isDateAvailable,
    loading: timeSlotsLoading,
  } = useTimeSlots();

  // Obtenir la durée de la réunion selon le type sélectionné
  const getMeetingDuration = () => {
    const meetingType = meetingTypes.find(
      (t) => t.value === selectedMeetingType
    );
    return meetingType?.durationMinutes || 30;
  };

  // Charger les créneaux disponibles quand la date change
  useEffect(() => {
    let isMounted = true;

    const fetchAvailableSlots = async () => {
      if (debouncedDate) {
        setLoadingSlots(true);
        try {
          const slots = await getAvailableSlotsForDate(
            debouncedDate,
            getMeetingDuration()
          );
          if (isMounted) {
            setAvailableSlots(slots);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des créneaux:", error);
          if (isMounted) {
            setAvailableSlots([]);
          }
        } finally {
          if (isMounted) {
            setLoadingSlots(false);
          }
        }
      } else {
        if (isMounted) {
          setAvailableSlots([]);
        }
      }
    };

    fetchAvailableSlots();

    return () => {
      isMounted = false;
    };
  }, [debouncedDate, selectedMeetingType]);

  // Dates disponibles
  const isDateSelectable = useCallback(
    (date: Date) => {
      const today = startOfDay(new Date());
      const selectedDay = startOfDay(date);

      // Ne pas permettre les dates passées
      if (isBefore(selectedDay, today)) return false;

      // Vérifier si la date est disponible via le hook
      return isDateAvailable(date);
    },
    [isDateAvailable]
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
    setStep(1); // Toujours revenir à l'étape 1 quand on change de date
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
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date et une heure",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("company", formData.company);
      formDataToSend.append("service", formData.service || "Consultation");
      formDataToSend.append("date", format(selectedDate, "yyyy-MM-dd"));
      formDataToSend.append("timeSlot", selectedTime);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("meetingType", selectedMeetingType);
      formDataToSend.append("duration", getMeetingDuration().toString());

      const result = await createAppointment(null, formDataToSend);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const OpeningHours = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Horaires d'ouverture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lundi - Vendredi</span>
            <span className="font-medium">9h - 18h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Samedi</span>
            <span className="font-medium">9h - 14h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dimanche</span>
            <span className="font-medium">Fermé</span>
          </div>
        </div>
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Les créneaux sont générés automatiquement selon nos horaires
            d'ouverture. Pour aujourd'hui, les créneaux disponibles commencent
            dans 30 minutes.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const TimeSlotsSkeleton = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-12 bg-linear-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"
          />
        ))}
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
    </div>
  );

  const EmptyTimeSlots = ({ isToday }: { isToday: boolean }) => (
    <div className="text-center py-8">
      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground mb-2">
        Aucun créneau disponible pour cette date
      </p>
      {isToday && (
        <p className="text-sm text-muted-foreground">
          Les créneaux pour aujourd'hui commencent dans 30 minutes
        </p>
      )}
    </div>
  );

  // Calculer le type de rendez-vous actuel
  const currentMeetingType = meetingTypes.find(
    (t) => t.value === selectedMeetingType
  );

  if (isConfirmed) {
    return (
      <>
        {/* Confirmation */}
        <div className="min-h-[70vh] flex items-center justify-center pt-38 pb-20 px-4">
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
                    <strong>Durée :</strong> {getMeetingDuration()} minutes
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
      {/* Header */}
      <div className="pb-8 pt-38 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-4">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
              Prendre rendez-vous
            </h1>
            <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Réservez un créneau pour discuter de votre projet avec notre
              équipe.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Meeting Types */}
      <section className="py-16 bg-soporis-gray overflow-hidden">
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
                    // Si une date est déjà sélectionnée, réinitialiser l'heure
                    if (selectedDate) {
                      setSelectedTime("");
                      setStep(1); // Revenir aux créneaux
                    }
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
        <section className="py-16 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Calendar & Time Slots/Form */}
                <div className="lg:col-span-2">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <AnimatedSection>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Sélectionnez une date
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                          <div className="overflow-x-auto">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={handleDateSelect}
                              disabled={(date) => !isDateSelectable(date)}
                              locale={fr}
                              className="rounded-lg border"
                              fromDate={new Date()}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>

                    {/* Time Slots OU Formulaire */}
                    <AnimatedSection delay={0.1}>
                      <Card className="h-full">
                        <CardHeader>
                          {step === 1 ? (
                            <>
                              <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Créneaux disponibles
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {selectedDate
                                  ? format(selectedDate, "EEEE d MMMM", {
                                      locale: fr,
                                    }) +
                                    (isToday(selectedDate)
                                      ? " (aujourd'hui)"
                                      : "")
                                  : "Sélectionnez une date"}
                              </p>
                            </>
                          ) : (
                            <>
                              <CardTitle>Vos informations</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {selectedDate &&
                                  format(selectedDate, "EEEE d MMMM yyyy", {
                                    locale: fr,
                                  })}{" "}
                                à {selectedTime} ({getMeetingDuration()} min)
                              </p>
                            </>
                          )}
                        </CardHeader>
                        <CardContent>
                          {step === 1 ? (
                            // AFFICHER LES CRÉNEAUX
                            selectedDate ? (
                              loadingSlots ? (
                                <TimeSlotsSkeleton />
                              ) : availableSlots.length > 0 ? (
                                <>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {availableSlots.map((time) => (
                                      <Button
                                        key={time}
                                        variant={
                                          selectedTime === time
                                            ? "default"
                                            : "outline"
                                        }
                                        onClick={() => handleTimeSelect(time)}
                                        className="w-full h-12 text-base"
                                      >
                                        {time}
                                      </Button>
                                    ))}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-4 text-center">
                                    {getMeetingDuration()} minutes par créneau
                                  </p>
                                </>
                              ) : (
                                <EmptyTimeSlots
                                  isToday={isToday(selectedDate)}
                                />
                              )
                            ) : (
                              <div className="text-center py-8">
                                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                  Veuillez sélectionner une date pour voir les
                                  créneaux disponibles.
                                </p>
                              </div>
                            )
                          ) : (
                            // AFFICHER LE FORMULAIRE
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
                                      handleFormChange(
                                        "company",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nom de votre entreprise"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="service">
                                  Service concerné *
                                </Label>
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
                                <Label htmlFor="message">
                                  Message (optionnel)
                                </Label>
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

                              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setStep(1)}
                                  className="flex-1"
                                >
                                  <ArrowLeft className="mr-2 h-4 w-4" />
                                  Retour aux créneaux
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
                          )}
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  </div>
                </div>

                {/* Opening Hours & Info */}
                <div className="lg:col-span-1">
                  <AnimatedSection delay={0.2}>
                    <OpeningHours />

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Information importante
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Confirmation</h4>
                          <p className="text-sm text-muted-foreground">
                            Vous recevrez une confirmation par email avec les
                            détails du rendez-vous.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Annulation</h4>
                          <p className="text-sm text-muted-foreground">
                            Vous pouvez annuler ou modifier votre rendez-vous
                            jusqu'à 24h à l'avance.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Préparation</h4>
                          <p className="text-sm text-muted-foreground">
                            Préparez vos questions et documents pour profiter au
                            maximum de votre rendez-vous.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Alternative Contact */}
      <section className="py-16 bg-soporis-gray overflow-hidden">
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
                  <FaWhatsapp className="mr-2" />
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
