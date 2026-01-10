"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
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
  createdAt: Date;
  updatedAt: Date;
}

export function useAppointmentsAdmin() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAppointments();

      // Convertir les null en undefined pour correspondre à l'interface
      const convertedData = data.map((apt) => ({
        ...apt,
        phone: apt.phone ?? undefined,
        company: apt.company ?? undefined,
        message: apt.message ?? undefined,
      })) as Appointment[];

      setAppointments(convertedData);
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
  }, [toast]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(id, status);

      // Mettre à jour localement
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );

      const statusLabels: Record<AppointmentStatus, string> = {
        [AppointmentStatus.pending]: "en attente",
        [AppointmentStatus.confirmed]: "confirmé",
        [AppointmentStatus.cancelled]: "annulé",
        [AppointmentStatus.completed]: "terminé",
      };

      toast({
        title: "Statut mis à jour",
        description: `Le rendez-vous est maintenant ${statusLabels[status]}.`,
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));

      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès.",
      });
    } catch (error: any) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous",
        variant: "destructive",
      });
    }
  };

  return {
    appointments,
    loading,
    refetch: fetchAppointments,
    updateStatus: handleUpdateStatus,
    deleteAppointment: handleDeleteAppointment,
  };
}
