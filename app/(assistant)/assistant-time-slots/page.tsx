// app/(assistant)/time-slots/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Clock,
  CalendarDays,
  Building2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  Download,
  FileText,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

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

const DAYS = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 0, label: "Dimanche" },
];

const DURATIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
  { value: 90, label: "90 minutes" },
  { value: 120, label: "120 minutes" },
];

export default function TimeSlotsPage() {
  const {
    timeSlots,
    blockedDates,
    loading,
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    addBlockedDate,
    deleteBlockedDate,
    getDayName,
    getFormattedOpeningHours,
    refreshSlots,
  } = useTimeSlots();

  const [searchTerm, setSearchTerm] = useState("");
  const [dayFilter, setDayFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [blockedDateReason, setBlockedDateReason] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [lastExportInfo, setLastExportInfo] = useState<string | null>(null);

  // Dialog states
  const [isAddSlotDialogOpen, setIsAddSlotDialogOpen] = useState(false);
  const [isAddBlockedDateDialogOpen, setIsAddBlockedDateDialogOpen] =
    useState(false);
  const [isEditSlotDialogOpen, setIsEditSlotDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  const [blockedDateToDelete, setBlockedDateToDelete] = useState<string | null>(
    null
  );

  // New slot form
  const [newSlot, setNewSlot] = useState({
    day_of_week: 1,
    start_time: "09:00",
    end_time: "17:00",
    duration_minutes: 30,
    is_active: true,
  });

  // Edit slot form
  const [editSlot, setEditSlot] = useState({
    id: "",
    day_of_week: 1,
    start_time: "09:00",
    end_time: "17:00",
    duration_minutes: 30,
    is_active: true,
  });

  const { toast } = useToast();

  // Load preferences from cookies on mount
  useEffect(() => {
    const savedDayFilter = getCookie("timeSlotsDayFilter");
    if (savedDayFilter) setDayFilter(savedDayFilter);

    const savedStatusFilter = getCookie("timeSlotsStatusFilter");
    if (savedStatusFilter) setStatusFilter(savedStatusFilter);

    const lastExport = getCookie("lastTimeSlotsExport");
    if (lastExport) setLastExportInfo(lastExport);
  }, []);

  // Save filter preferences to cookies
  useEffect(() => {
    setCookie("timeSlotsDayFilter", dayFilter);
  }, [dayFilter]);

  useEffect(() => {
    setCookie("timeSlotsStatusFilter", statusFilter);
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

  // Filter time slots
  const filteredTimeSlots = timeSlots.filter((slot) => {
    const matchesSearch = getDayName(slot.day_of_week)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDay =
      dayFilter === "all" || slot.day_of_week.toString() === dayFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && slot.is_active) ||
      (statusFilter === "inactive" && !slot.is_active);

    return matchesSearch && matchesDay && matchesStatus;
  });

  // Format time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}h${minutes !== "00" ? minutes : ""}`;
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-700 hover:bg-green-100"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Actif
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <XCircle className="h-3 w-3 mr-1" />
        Inactif
      </Badge>
    );
  };

  // Handle add slot
  const handleAddSlot = async () => {
    try {
      await addTimeSlot(newSlot);
      setIsAddSlotDialogOpen(false);
      setNewSlot({
        day_of_week: 1,
        start_time: "09:00",
        end_time: "17:00",
        duration_minutes: 30,
        is_active: true,
      });
      toast({
        title: "Créneau ajouté",
        description: "Le créneau horaire a été ajouté avec succès.",
      });
      await refreshSlots();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Impossible d'ajouter le créneau horaire.",
        variant: "destructive",
      });
    }
  };

  // Handle edit slot
  const handleEditSlot = async () => {
    try {
      await updateTimeSlot(editSlot.id, {
        day_of_week: editSlot.day_of_week,
        start_time: editSlot.start_time,
        end_time: editSlot.end_time,
        duration_minutes: editSlot.duration_minutes,
        is_active: editSlot.is_active,
      });
      setIsEditSlotDialogOpen(false);
      setSelectedSlot(null);
      toast({
        title: "Créneau mis à jour",
        description: "Le créneau horaire a été mis à jour avec succès.",
      });
      await refreshSlots();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Impossible de mettre à jour le créneau horaire.",
        variant: "destructive",
      });
    }
  };

  // Handle delete slot
  const handleDeleteSlot = async () => {
    if (!slotToDelete) return;

    try {
      await deleteTimeSlot(slotToDelete);
      setSlotToDelete(null);
      toast({
        title: "Créneau supprimé",
        description: "Le créneau horaire a été supprimé avec succès.",
      });
      await refreshSlots();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Impossible de supprimer le créneau horaire.",
        variant: "destructive",
      });
    }
  };

  // Handle add blocked date
  const handleAddBlockedDate = async () => {
    if (!selectedDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addBlockedDate(
        format(selectedDate, "yyyy-MM-dd"),
        blockedDateReason || undefined
      );
      setIsAddBlockedDateDialogOpen(false);
      setSelectedDate(undefined);
      setBlockedDateReason("");
      toast({
        title: "Date bloquée ajoutée",
        description: "La date a été bloquée avec succès.",
      });
      await refreshSlots();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter la date bloquée.",
        variant: "destructive",
      });
    }
  };

  // Handle delete blocked date
  const handleDeleteBlockedDate = async () => {
    if (!blockedDateToDelete) return;

    try {
      await deleteBlockedDate(blockedDateToDelete);
      setBlockedDateToDelete(null);
      toast({
        title: "Date débloquée",
        description: "La date a été débloquée avec succès.",
      });
      await refreshSlots();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de débloquer la date.",
        variant: "destructive",
      });
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Jour",
      "Heure début",
      "Heure fin",
      "Durée (min)",
      "Statut",
    ];
    const rows = filteredTimeSlots.map((slot) => [
      getDayName(slot.day_of_week),
      slot.start_time,
      slot.end_time,
      slot.duration_minutes,
      slot.is_active ? "Actif" : "Inactif",
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(";")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `creneaux-horaires_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Store export info in cookie
    const exportTime = format(new Date(), "dd/MM/yyyy à HH:mm", { locale: fr });
    setCookie("lastTimeSlotsExport", `CSV - ${exportTime}`);
    setLastExportInfo(`CSV - ${exportTime}`);
    toast({
      title: "Export CSV réussi",
      description: `${filteredTimeSlots.length} créneaux exportés`,
    });
  };

  // Export opening hours to PDF
  const exportOpeningHoursToPDF = () => {
    const openingHours = getFormattedOpeningHours();

    // Ici, vous pourriez utiliser jsPDF pour créer un PDF
    // Pour l'instant, on fait un export CSV simple
    const headers = ["Jour", "Horaires"];
    const rows = openingHours.map((item) => [item.day, item.hours]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(";")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `horaires-ouverture_${format(
      new Date(),
      "yyyy-MM-dd"
    )}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export des horaires réussi",
      description: "Les horaires d'ouverture ont été exportés.",
    });
  };

  // Open edit dialog
  const openEditDialog = (slot: any) => {
    setSelectedSlot(slot);
    setEditSlot({
      id: slot.id,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      duration_minutes: slot.duration_minutes,
      is_active: slot.is_active,
    });
    setIsEditSlotDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Titre et description */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des créneaux horaires
          </h1>
          <p className="text-muted-foreground">
            Configurez les horaires d'ouverture, les créneaux disponibles et les
            dates bloquées
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Créneaux actifs
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      timeSlots.filter((s) => s.is_active).length
                    )}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Jours ouverts
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      [
                        ...new Set(
                          timeSlots
                            .filter((s) => s.is_active)
                            .map((s) => s.day_of_week)
                        ),
                      ].length
                    )}
                  </p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Dates bloquées
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      blockedDates.length
                    )}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Durée moyenne
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : timeSlots.length > 0 ? (
                      `${Math.round(
                        timeSlots.reduce(
                          (sum, s) => sum + s.duration_minutes,
                          0
                        ) / timeSlots.length
                      )} min`
                    ) : (
                      "0 min"
                    )}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions principales */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-4">
            <Button onClick={() => setIsAddSlotDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un créneau
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsAddBlockedDateDialogOpen(true)}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Bloquer une date
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={exportOpeningHoursToPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Horaires
            </Button>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par jour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-60"
              />
            </div>
            {loading ? (
              <>
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </>
            ) : (
              <>
                <Select value={dayFilter} onValueChange={setDayFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Jour" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les jours</SelectItem>
                    {DAYS.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          {lastExportInfo && (
            <span className="text-xs text-muted-foreground self-end hidden sm:block">
              Dernier export: {lastExportInfo}
            </span>
          )}
        </div>

        {/* Tableau des créneaux */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jour</TableHead>
                  <TableHead>Horaires</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredTimeSlots.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchTerm ||
                      dayFilter !== "all" ||
                      statusFilter !== "all"
                        ? "Aucun créneau ne correspond aux filtres"
                        : "Aucun créneau horaire configuré. Commencez par en ajouter un."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTimeSlots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell className="font-medium">
                        {getDayName(slot.day_of_week)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {formatTime(slot.start_time)} -{" "}
                            {formatTime(slot.end_time)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {slot.duration_minutes} min
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(slot.is_active)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(slot)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSlotToDelete(slot.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Section des dates bloquées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Dates bloquées ({blockedDates.length})
              <Badge variant="outline" className="ml-2">
                {blockedDates.length} date(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : blockedDates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune date bloquée pour le moment</p>
                <p className="text-sm mt-1">
                  Les dates bloquées ne sont pas disponibles pour les
                  rendez-vous
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {blockedDates.map((blockedDate) => (
                  <div
                    key={blockedDate.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {format(
                          new Date(blockedDate.date),
                          "EEEE d MMMM yyyy",
                          { locale: fr }
                        )}
                      </p>
                      {blockedDate.reason && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {blockedDate.reason}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBlockedDateToDelete(blockedDate.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section des horaires d'ouverture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Horaires d'ouverture
              <Badge variant="outline" className="ml-2">
                Prévisualisation
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {getFormattedOpeningHours().map((item) => (
                  <div
                    key={item.day}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="font-medium">{item.day}</span>
                    <span
                      className={cn(
                        "text-sm",
                        item.hours === "Fermé"
                          ? "text-muted-foreground"
                          : "text-foreground"
                      )}
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog: Ajouter un créneau */}
        <Dialog
          open={isAddSlotDialogOpen}
          onOpenChange={setIsAddSlotDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un créneau horaire</DialogTitle>
              <DialogDescription>
                Configurez un nouveau créneau disponible pour les rendez-vous
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Jour</Label>
                <Select
                  value={newSlot.day_of_week.toString()}
                  onValueChange={(value) =>
                    setNewSlot({ ...newSlot, day_of_week: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heure de début</Label>
                  <Input
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, start_time: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heure de fin</Label>
                  <Input
                    type="time"
                    value={newSlot.end_time}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, end_time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Durée des créneaux</Label>
                <Select
                  value={newSlot.duration_minutes.toString()}
                  onValueChange={(value) =>
                    setNewSlot({
                      ...newSlot,
                      duration_minutes: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((duration) => (
                      <SelectItem
                        key={duration.value}
                        value={duration.value.toString()}
                      >
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Statut</Label>
                  <p className="text-sm text-muted-foreground">
                    Activez ou désactivez ce créneau
                  </p>
                </div>
                <Switch
                  checked={newSlot.is_active}
                  onCheckedChange={(checked) =>
                    setNewSlot({ ...newSlot, is_active: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddSlotDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAddSlot}>Ajouter le créneau</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Modifier un créneau */}
        <Dialog
          open={isEditSlotDialogOpen}
          onOpenChange={setIsEditSlotDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le créneau horaire</DialogTitle>
              <DialogDescription>
                Modifiez les paramètres de ce créneau
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Jour</Label>
                <Select
                  value={editSlot.day_of_week.toString()}
                  onValueChange={(value) =>
                    setEditSlot({ ...editSlot, day_of_week: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heure de début</Label>
                  <Input
                    type="time"
                    value={editSlot.start_time}
                    onChange={(e) =>
                      setEditSlot({ ...editSlot, start_time: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heure de fin</Label>
                  <Input
                    type="time"
                    value={editSlot.end_time}
                    onChange={(e) =>
                      setEditSlot({ ...editSlot, end_time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Durée des créneaux</Label>
                <Select
                  value={editSlot.duration_minutes.toString()}
                  onValueChange={(value) =>
                    setEditSlot({
                      ...editSlot,
                      duration_minutes: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((duration) => (
                      <SelectItem
                        key={duration.value}
                        value={duration.value.toString()}
                      >
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Statut</Label>
                  <p className="text-sm text-muted-foreground">
                    Activez ou désactivez ce créneau
                  </p>
                </div>
                <Switch
                  checked={editSlot.is_active}
                  onCheckedChange={(checked) =>
                    setEditSlot({ ...editSlot, is_active: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditSlotDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleEditSlot}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Ajouter une date bloquée */}
        <Dialog
          open={isAddBlockedDateDialogOpen}
          onOpenChange={setIsAddBlockedDateDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bloquer une date</DialogTitle>
              <DialogDescription>
                Les dates bloquées ne seront pas disponibles pour les
                rendez-vous
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date à bloquer</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <Label>Raison (optionnelle)</Label>
                <Textarea
                  placeholder="Ex: Jour férié, Congés, Événement..."
                  value={blockedDateReason}
                  onChange={(e) => setBlockedDateReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddBlockedDateDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAddBlockedDate} disabled={!selectedDate}>
                Bloquer la date
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Confirmation suppression créneau */}
        <Dialog
          open={!!slotToDelete}
          onOpenChange={() => setSlotToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le créneau horaire</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce créneau ? Cette action est
                irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSlotToDelete(null)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteSlot}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Confirmation suppression date bloquée */}
        <Dialog
          open={!!blockedDateToDelete}
          onOpenChange={() => setBlockedDateToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Débloquer la date</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir débloquer cette date ? Elle redeviendra
                disponible pour les rendez-vous.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setBlockedDateToDelete(null)}
              >
                Annuler
              </Button>
              <Button variant="default" onClick={handleDeleteBlockedDate}>
                Débloquer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Scroll button */}
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
      </div>
    </>
  );
}
