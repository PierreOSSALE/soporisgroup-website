// hooks/useAppointmentsAdmin.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentsByStatus,
  getUpcomingAppointments,
  getAppointmentsCountByStatus,
} from "@/lib/actions/appointment.actions";
import { AppointmentStatus } from "@prisma/client";

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  date: Date;
  timeSlot: string;
  message?: string;
  status: AppointmentStatus;
  cancellation_token?: string;
  reminder_sent: boolean;
  created_at: Date;
  updated_at: Date;
}

interface AppointmentsCount {
  [key: string]: number;
}

interface UseAppointmentsAdminProps {
  initialStatus?: AppointmentStatus;
  limit?: number;
  showUpcoming?: boolean;
}

export function useAppointmentsAdmin({
  initialStatus,
  limit,
  showUpcoming = false,
}: UseAppointmentsAdminProps = {}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [statusCounts, setStatusCounts] = useState<AppointmentsCount>({});
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    AppointmentStatus | "all"
  >(initialStatus || "all");
  const { toast } = useToast();

  // Fonction pour formater les dates
  const formatAppointmentDate = (appointment: any): Appointment => ({
    ...appointment,
    date: new Date(appointment.date),
    created_at: new Date(appointment.created_at),
    updated_at: new Date(appointment.updated_at),
    phone: appointment.phone ?? undefined,
    company: appointment.company ?? undefined,
    message: appointment.message ?? undefined,
    cancellation_token: appointment.cancellation_token ?? undefined,
  });

  // Charger les rendez-vous
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      let data;

      if (selectedStatus === "all") {
        data = await getAppointments();
      } else {
        data = await getAppointmentsByStatus(
          selectedStatus as AppointmentStatus
        );
      }

      // Convertir et formater les données
      const convertedData = data.map(formatAppointmentDate) as Appointment[];

      // Appliquer la limite si spécifiée
      const finalData = limit ? convertedData.slice(0, limit) : convertedData;

      setAppointments(finalData);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, limit, toast]);

  // Charger les prochains rendez-vous
  const fetchUpcomingAppointments = useCallback(async () => {
    if (!showUpcoming) return;

    try {
      const data = await getUpcomingAppointments(limit || 5);
      const formattedData = data.map(formatAppointmentDate) as Appointment[];
      setUpcomingAppointments(formattedData);
    } catch (error: any) {
      console.error("Error fetching upcoming appointments:", error);
    }
  }, [showUpcoming, limit]);

  // Charger les statistiques
  const fetchStatusCounts = useCallback(async () => {
    setStatsLoading(true);
    try {
      const counts = await getAppointmentsCountByStatus();
      setStatusCounts(counts);
    } catch (error: any) {
      console.error("Error fetching status counts:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchAppointments();
    fetchUpcomingAppointments();
    fetchStatusCounts();
  }, [fetchAppointments, fetchUpcomingAppointments, fetchStatusCounts]);

  // Recharger quand le statut change
  useEffect(() => {
    if (selectedStatus !== "all") {
      fetchAppointments();
    }
  }, [selectedStatus, fetchAppointments]);

  // Mettre à jour le statut d'un rendez-vous
  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      // Sauvegarder l'ancien état pour rollback si nécessaire
      const previousAppointments = [...appointments];

      // Mettre à jour localement immédiatement pour le feedback UI
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );

      if (showUpcoming) {
        setUpcomingAppointments((prev) =>
          prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
        );
      }

      // Appel API pour mettre à jour en base de données
      const updatedAppointment = await updateAppointmentStatus(id, status);

      // Mettre à jour les statistiques
      await fetchStatusCounts();

      // Messages selon le statut
      const statusMessages: Record<AppointmentStatus, string> = {
        [AppointmentStatus.pending]:
          "Le rendez-vous est maintenant en attente de confirmation.",
        [AppointmentStatus.confirmed]:
          "Le rendez-vous a été confirmé. Le créneau horaire est maintenant réservé.",
        [AppointmentStatus.cancelled]:
          "Le rendez-vous a été annulé. Le créneau horaire est de nouveau disponible.",
        [AppointmentStatus.completed]:
          "Le rendez-vous a été marqué comme terminé.",
      };

      toast({
        title: "Statut mis à jour",
        description: statusMessages[status],
      });

      // Recharger les données fraîches du serveur
      await fetchAppointments();
      if (showUpcoming) {
        await fetchUpcomingAppointments();
      }

      return updatedAppointment;
    } catch (error: any) {
      console.error("Error updating status:", error);

      // Rollback en cas d'erreur
      fetchAppointments();
      if (showUpcoming) {
        fetchUpcomingAppointments();
      }

      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Supprimer un rendez-vous
  const handleDeleteAppointment = async (id: string) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      // Sauvegarder pour rollback
      const appointmentToDelete = appointments.find((a) => a.id === id);

      // Supprimer localement immédiatement
      setAppointments((prev) => prev.filter((a) => a.id !== id));

      if (showUpcoming) {
        setUpcomingAppointments((prev) => prev.filter((a) => a.id !== id));
      }

      // Supprimer en base de données
      await deleteAppointment(id);

      // Mettre à jour les statistiques
      await fetchStatusCounts();

      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès.",
      });

      return appointmentToDelete;
    } catch (error: any) {
      console.error("Error deleting appointment:", error);

      // Recharger en cas d'erreur
      fetchAppointments();
      if (showUpcoming) {
        fetchUpcomingAppointments();
      }

      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le rendez-vous",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Filtrer les rendez-vous par date
  const filterByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return appointments.filter((apt) => {
        const aptDate = new Date(apt.date);
        return aptDate >= startDate && aptDate <= endDate;
      });
    },
    [appointments]
  );

  // Rechercher dans les rendez-vous
  const searchAppointments = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return appointments.filter(
        (apt) =>
          apt.name.toLowerCase().includes(lowerQuery) ||
          apt.email.toLowerCase().includes(lowerQuery) ||
          apt.service.toLowerCase().includes(lowerQuery) ||
          (apt.company && apt.company.toLowerCase().includes(lowerQuery)) ||
          apt.timeSlot.includes(query)
      );
    },
    [appointments]
  );

  // Obtenir les statistiques formatées
  const getFormattedStats = () => {
    const total = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      total,
      pending: statusCounts[AppointmentStatus.pending] || 0,
      confirmed: statusCounts[AppointmentStatus.confirmed] || 0,
      cancelled: statusCounts[AppointmentStatus.cancelled] || 0,
      completed: statusCounts[AppointmentStatus.completed] || 0,
    };
  };

  return {
    // Données
    appointments,
    upcomingAppointments,
    statusCounts: getFormattedStats(),

    // États
    loading,
    statsLoading,
    selectedStatus,

    // Actions
    setSelectedStatus,
    updateStatus: handleUpdateStatus,
    deleteAppointment: handleDeleteAppointment,

    // Fonctions utilitaires
    refresh: fetchAppointments,
    refreshStats: fetchStatusCounts,
    filterByDateRange,
    searchAppointments,

    // Informations
    totalCount: appointments.length,
    hasAppointments: appointments.length > 0,
  };
}
