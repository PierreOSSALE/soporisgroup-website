"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Home, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

const CancelAppointment = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    console.log("Token from URL:", token); // Pour debug

    if (!token) {
      setStatus("error");
      setMessage("Lien invalide. Aucun token fourni.");
      return;
    }

    const cancelAppointment = async () => {
      try {
        const response = await fetch(
          `/api/appointments/cancel?token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        console.log("API Response:", result); // Pour debug

        if (!response.ok) {
          throw new Error(result.error || "Erreur lors de l'annulation");
        }

        setStatus("success");
        setMessage(result.message);
        setAppointmentDetails(result.appointment);
      } catch (error: any) {
        console.error("Cancellation error:", error);
        setStatus("error");
        setMessage(
          error.message || "Une erreur est survenue lors de l'annulation."
        );
      }
    };

    cancelAppointment();
  }, [searchParams]);

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
          </nav>
        </div>
      </div>

      <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
        <AnimatedSection className="max-w-lg w-full">
          {status === "loading" && (
            <Card className="text-center">
              <CardContent className="pt-12 pb-12">
                <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
                <h1 className="text-2xl font-bold text-primary mb-2">
                  Annulation en cours...
                </h1>
                <p className="text-muted-foreground">Veuillez patienter</p>
              </CardContent>
            </Card>
          )}

          {status === "success" && (
            <Card className="text-center">
              <CardContent className="pt-12 pb-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-primary mb-2">
                  Rendez-vous annulé
                </h1>
                <p className="text-muted-foreground mb-6">{message}</p>

                {appointmentDetails && (
                  <div className="bg-muted rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Nom :</strong> {appointmentDetails.name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Date :</strong> {appointmentDetails.date}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Heure :</strong> {appointmentDetails.time_slot}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Service :</strong> {appointmentDetails.service}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Accueil
                    </Button>
                  </Link>
                  <Link href="/rendez-vous" className="flex-1">
                    <Button className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Nouveau rendez-vous
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "error" && (
            <Card className="text-center">
              <CardContent className="pt-12 pb-12">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-primary mb-2">Erreur</h1>
                <p className="text-muted-foreground mb-6">{message}</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Accueil
                    </Button>
                  </Link>
                  <Link href="/contact" className="flex-1">
                    <Button className="w-full">Nous contacter</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </AnimatedSection>
      </div>
    </>
  );
};

export default CancelAppointment;
