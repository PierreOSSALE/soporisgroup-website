// components/features/appointment/assistant/AppointmentDetailDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  Clock,
  Check,
  X,
  CheckCircle,
} from "lucide-react";
import { Appointment } from "@/hooks/useAppointmentsAdmin";

interface AppointmentDetailDialogProps {
  appointment: Appointment | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  formatDateTime: (date: Date, timeSlot: string) => string;
}

export default function AppointmentDetailDialog({
  appointment,
  onClose,
  onUpdateStatus,
  formatDateTime,
}: AppointmentDetailDialogProps) {
  if (!appointment) return null;

  return (
    <Dialog open={!!appointment} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails du rendez-vous</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-3 w-3" /> Nom
              </p>
              <p className="font-medium">{appointment.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Building className="h-3 w-3" /> Entreprise
              </p>
              <p className="font-medium">{appointment.company || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-3 w-3" /> Email
              </p>
              <p className="font-medium">{appointment.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-3 w-3" /> Téléphone
              </p>
              <p className="font-medium">{appointment.phone || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Service</p>
              <p className="font-medium">{appointment.service}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Date & Heure
              </p>
              <p className="font-medium flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {formatDateTime(appointment.date, appointment.timeSlot)}
              </p>
            </div>
          </div>
          {appointment.message && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Message</p>
              <p className="font-medium border rounded p-2 bg-muted/50">
                {appointment.message}
              </p>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            {appointment.status === "pending" && (
              <>
                <Button
                  className="flex-1"
                  onClick={() => {
                    onUpdateStatus(appointment.id, "confirmed");
                    onClose();
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirmer
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    onUpdateStatus(appointment.id, "cancelled");
                    onClose();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </>
            )}
            {appointment.status === "confirmed" && (
              <Button
                className="flex-1"
                onClick={() => {
                  onUpdateStatus(appointment.id, "completed");
                  onClose();
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marquer comme terminé
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
