// app/(assistant)/assistant-appointments/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAppointmentsAdmin } from "@/hooks/useAppointmentsAdmin";
import { useToast } from "@/hooks/use-toast";
import SearchAndFilters from "@/components/features/appointment/assistant/SearchAndFilters";
import AppointmentsTable from "@/components/features/appointment/assistant/AppointmentsTable";
import AppointmentDetailDialog from "@/components/features/appointment/assistant/AppointmentDetailDialog";
import ExportButtons from "@/components/features/appointment/assistant/ExportButtons";
import ScrollToTopButton from "@/components/features/appointment/assistant/ScrollToTopButton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Appointment } from "@/hooks/useAppointmentsAdmin";
import { AppointmentStatus } from "@prisma/client";

// Cookie helpers
const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )};expires=${expires};path=/`;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop()!.split(";").shift()!);
  return null;
};

export default function AssistantAppointments() {
  const { appointments, loading, updateStatus, deleteAppointment } =
    useAppointmentsAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [lastExportInfo, setLastExportInfo] = useState<string | null>(null);
  const { toast } = useToast();

  // Load preferences from cookies on mount
  useEffect(() => {
    const savedFilter = getCookie("appointmentsFilter");
    if (savedFilter) setStatusFilter(savedFilter);

    const lastExport = getCookie("lastAppointmentExport");
    if (lastExport) setLastExportInfo(lastExport);
  }, []);

  // Save filter preference to cookie
  useEffect(() => {
    setCookie("appointmentsFilter", statusFilter);
  }, [statusFilter]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollTop + windowHeight >= docHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.company &&
        apt.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  const formatDateTime = (date: Date, timeSlot: string) => {
    try {
      const dateStr = format(new Date(date), "EEEE d MMMM yyyy", {
        locale: fr,
      });
      return `${dateStr} à ${timeSlot}`;
    } catch {
      return `${date} à ${timeSlot}`;
    }
  };

  // Wrapper pour convertir string en AppointmentStatus
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      // Convertir le string en AppointmentStatus
      const appointmentStatus = status as AppointmentStatus;
      await updateStatus(id, appointmentStatus);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      throw error;
    }
  };

  const handleExportSuccess = (type: "CSV" | "PDF", count: number) => {
    const exportTime = format(new Date(), "dd/MM/yyyy à HH:mm", { locale: fr });
    setCookie("lastAppointmentExport", `${type} - ${exportTime}`);
    setLastExportInfo(`${type} - ${exportTime}`);
    toast({
      title: `Export ${type} réussi`,
      description: `${count} rendez-vous exportés`,
    });
  };

  const scrollToPosition = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Titre et description */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des rendez-vous
          </h1>
          <p className="text-muted-foreground">
            Gérez les rendez-vous pris par vos clients et suivez leur statut
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          loading={loading}
          lastExportInfo={lastExportInfo}
          onExportCSV={function (): void {
            throw new Error("Function not implemented.");
          }}
          onExportPDF={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        {/* Export Buttons (avec données pour l'export) */}
        <ExportButtons
          appointments={filteredAppointments}
          formatDate={formatDate}
          getStatusLabel={(status: string) => {
            switch (status) {
              case "confirmed":
                return "Confirmé";
              case "pending":
                return "En attente";
              case "cancelled":
                return "Annulé";
              case "completed":
                return "Terminé";
              default:
                return status;
            }
          }}
          onExportSuccess={handleExportSuccess}
        />

        {/* Tableau */}
        <AppointmentsTable
          appointments={filteredAppointments}
          loading={loading}
          updateStatus={handleUpdateStatus} // Utiliser le wrapper
          setSelectedAppointment={setSelectedAppointment}
          formatDate={formatDate}
        />

        {/* Détails Dialog */}
        <AppointmentDetailDialog
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdateStatus={handleUpdateStatus} // Utiliser le wrapper
          formatDateTime={formatDateTime}
        />

        {/* Scroll button */}
        {!loading && (
          <ScrollToTopButton
            isAtBottom={isAtBottom}
            onClick={scrollToPosition}
          />
        )}
      </div>
    </>
  );
}
