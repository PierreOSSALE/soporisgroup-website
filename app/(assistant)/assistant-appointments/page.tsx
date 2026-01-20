// app/(assistant)/assistant-appointments/page.tsx
"use client";

import { useState, useEffect } from "react";
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
import {
  Search,
  Eye,
  Check,
  X,
  CheckCircle,
  Download,
  FileText,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import {
  useAppointmentsAdmin,
  type Appointment,
} from "@/hooks/useAppointmentsAdmin";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Cookie helpers
const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
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

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Nom",
      "Email",
      "Téléphone",
      "Entreprise",
      "Service",
      "Date",
      "Heure",
      "Statut",
      "Message",
      "Date création",
    ];
    const rows = filteredAppointments.map((apt) => [
      apt.name,
      apt.email,
      apt.phone || "",
      apt.company || "",
      apt.service,
      formatDate(apt.date),
      apt.timeSlot,
      getStatusLabel(apt.status),
      apt.message || "",
      format(new Date(apt.created_at), "dd/MM/yyyy HH:mm", { locale: fr }),
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rendez-vous_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Store export info in cookie
    const exportTime = format(new Date(), "dd/MM/yyyy à HH:mm", { locale: fr });
    setCookie("lastAppointmentExport", `CSV - ${exportTime}`);
    setLastExportInfo(`CSV - ${exportTime}`);
    toast({
      title: "Export CSV réussi",
      description: `${filteredAppointments.length} rendez-vous exportés`,
    });
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Liste des Rendez-vous - Soporis Group", 14, 22);
    doc.setFontSize(10);
    doc.text(
      `Exporté le ${format(new Date(), "dd/MM/yyyy à HH:mm", { locale: fr })}`,
      14,
      30
    );
    doc.text(`Total: ${filteredAppointments.length} rendez-vous`, 14, 36);

    // Table
    const tableData = filteredAppointments.map((apt) => [
      apt.name,
      apt.email,
      apt.service,
      formatDate(apt.date),
      apt.timeSlot,
      getStatusLabel(apt.status),
    ]);

    autoTable(doc, {
      head: [["Nom", "Email", "Service", "Date", "Heure", "Statut"]],
      body: tableData,
      startY: 45,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [26, 54, 93] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`rendez-vous_${format(new Date(), "yyyy-MM-dd")}.pdf`);

    // Store export info in cookie
    const exportTime = format(new Date(), "dd/MM/yyyy à HH:mm", { locale: fr });
    setCookie("lastAppointmentExport", `PDF - ${exportTime}`);
    setLastExportInfo(`PDF - ${exportTime}`);
    toast({
      title: "Export PDF réussi",
      description: `${filteredAppointments.length} rendez-vous exportés`,
    });
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
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            {loading ? (
              <Skeleton className="h-10 w-40" />
            ) : (
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
            )}
          </div>
          {loading ? (
            <div className="flex flex-col sm:flex-row items-end gap-2">
              <div className="hidden sm:block">
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-end gap-2">
              {lastExportInfo && (
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Dernier export: {lastExportInfo}
                </span>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" onClick={exportToPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tableau */}
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
                {loading ? (
                  // Skeleton loading pour le tableau
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Aucun rendez-vous trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{apt.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {apt.company || apt.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{apt.service}</TableCell>
                      <TableCell>{formatDate(apt.date)}</TableCell>
                      <TableCell>{apt.timeSlot}</TableCell>
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
                                onClick={() =>
                                  updateStatus(apt.id, "confirmed")
                                }
                                title="Confirmer"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  updateStatus(apt.id, "cancelled")
                                }
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
                  ))
                )}
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
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="h-3 w-3" /> Nom
                    </p>
                    <p className="font-medium">{selectedAppointment.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building className="h-3 w-3" /> Entreprise
                    </p>
                    <p className="font-medium">
                      {selectedAppointment.company || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    <p className="font-medium">{selectedAppointment.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3 w-3" /> Téléphone
                    </p>
                    <p className="font-medium">
                      {selectedAppointment.phone || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{selectedAppointment.service}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" /> Date & Heure
                    </p>
                    <p className="font-medium flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {formatDateTime(
                        selectedAppointment.date,
                        selectedAppointment.timeSlot
                      )}
                    </p>
                  </div>
                </div>
                {selectedAppointment.message && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Message</p>
                    <p className="font-medium border rounded p-2 bg-muted/50">
                      {selectedAppointment.message}
                    </p>
                  </div>
                )}
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

        {/* Scroll button */}
        {!loading && (
          <Button
            onClick={scrollToPosition}
            className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50"
            size="icon"
          >
            {isAtBottom ? (
              <ArrowUp className="h-5 w-5" />
            ) : (
              <ArrowDown className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
    </>
  );
}
