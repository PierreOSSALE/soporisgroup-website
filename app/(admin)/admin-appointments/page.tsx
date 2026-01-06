//app/(admin)/admin-appointments/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Check, X, CheckCircle } from "lucide-react";
import {
  mockAppointments,
  AdminAppointment,
} from "@/components/data/mockAdminData";
import { useToast } from "@/hooks/use-toast";

export default function AdminAppointments() {
  const [appointments, setAppointments] =
    useState<AdminAppointment[]>(mockAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<AdminAppointment | null>(null);
  const { toast } = useToast();

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: AdminAppointment["status"]) => {
    setAppointments(
      appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    toast({
      title: "Statut mis à jour",
      description: `Le rendez-vous a été marqué comme ${
        status === "confirmed"
          ? "confirmé"
          : status === "cancelled"
          ? "annulé"
          : status === "completed"
          ? "terminé"
          : "en attente"
      }.`,
    });
  };

  const getStatusColor = (status: AdminAppointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: AdminAppointment["status"]) => {
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
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{apt.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.company}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{apt.service}</TableCell>
                    <TableCell>{apt.date}</TableCell>
                    <TableCell>{apt.time}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          apt.status
                        )}`}
                      >
                        {getStatusLabel(apt.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedAppointment(apt)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {apt.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(apt.id, "confirmed")}
                              title="Confirmer"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(apt.id, "cancelled")}
                              title="Annuler"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {apt.status === "confirmed" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateStatus(apt.id, "completed")}
                            title="Marquer comme terminé"
                          >
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog
          open={!!selectedAppointment}
          onOpenChange={() => setSelectedAppointment(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Détails du rendez-vous</DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{selectedAppointment.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entreprise</p>
                    <p className="font-medium">{selectedAppointment.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedAppointment.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{selectedAppointment.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{selectedAppointment.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date & Heure
                    </p>
                    <p className="font-medium">
                      {selectedAppointment.date} à {selectedAppointment.time}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="font-medium">{selectedAppointment.message}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  {selectedAppointment.status === "pending" && (
                    <>
                      <Button
                        className="flex-1"
                        onClick={() => {
                          updateStatus(selectedAppointment.id, "confirmed");
                          setSelectedAppointment(null);
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          updateStatus(selectedAppointment.id, "cancelled");
                          setSelectedAppointment(null);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </>
                  )}
                  {selectedAppointment.status === "confirmed" && (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        updateStatus(selectedAppointment.id, "completed");
                        setSelectedAppointment(null);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marquer comme terminé
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
