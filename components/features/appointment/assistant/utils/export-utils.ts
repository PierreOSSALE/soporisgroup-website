// components/features/appointment/assistant/utils/export-utils.ts
import { Appointment } from "@/hooks/useAppointmentsAdmin";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToCSV = (
  appointments: Appointment[],
  formatDate: (date: Date) => string,
  getStatusLabel: (status: string) => string,
) => {
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
  const rows = appointments.map((apt) => [
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
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"),
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

  return appointments.length;
};

export const exportToPDF = (
  appointments: Appointment[],
  formatDate: (date: Date) => string,
  getStatusLabel: (status: string) => string,
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Liste des Rendez-vous - Soporis Group", 14, 22);
  doc.setFontSize(10);
  doc.text(
    `Exporté le ${format(new Date(), "dd/MM/yyyy à HH:mm", { locale: fr })}`,
    14,
    30,
  );
  doc.text(`Total: ${appointments.length} rendez-vous`, 14, 36);

  // Table
  const tableData = appointments.map((apt) => [
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

  return appointments.length;
};
