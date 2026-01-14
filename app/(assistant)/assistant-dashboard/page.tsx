// app/(admin)/assistant-dashboard/page.tsx
// app/(admin)/assistant-dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Suspense } from "react";
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton";

/* Utils */
const formatSimpleDate = (date: Date) =>
  format(date, "yyyy-MM-dd", { locale: fr });

const getStatusText = (status: string) =>
  ({
    pending: "En attente",
    confirmed: "Confirmé",
    cancelled: "Annulé",
    completed: "Terminé",
  }[status] || status);

const getStatusClass = (status: string) =>
  ({
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  }[status] || "bg-gray-100 text-gray-800");

/* ===================== STATS ===================== */
async function StatsCards() {
  const [
    totalAppointments,
    pendingAppointments,
    unreadMessages,
    totalMessages,
    confirmedToday,
    urgentMessages,
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "pending" } }),
    prisma.message.count({ where: { isRead: false } }),
    prisma.message.count(),
    prisma.appointment.count({
      where: {
        status: "confirmed",
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(24, 0, 0, 0)),
        },
      },
    }),
    prisma.message.count({
      where: {
        isRead: false,
        subject: { contains: "urgence", mode: "insensitive" },
      },
    }),
  ]);

  const stats = [
    {
      title: "Rendez-vous",
      value: totalAppointments,
      icon: Calendar,
      description: `${pendingAppointments} en attente`,
      color: "text-blue-600",
    },
    {
      title: "Messages non lus",
      value: unreadMessages,
      icon: MessageSquare,
      description: `${totalMessages} messages`,
      color: "text-green-600",
    },
    {
      title: "Confirmés aujourd'hui",
      value: confirmedToday,
      icon: CheckCircle,
      description: "Aujourd’hui",
      color: "text-purple-600",
    },
    {
      title: "Urgents",
      value: urgentMessages,
      icon: Clock,
      description: "À traiter",
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map(({ title, value, icon: Icon, description, color }) => (
        <Card key={title} className="max-w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground truncate">
              {title}
            </CardTitle>
            <Icon className={`h-4 w-4 ${color}`} />
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground truncate">
              {description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ===================== RDV ===================== */
async function RecentAppointmentsCard() {
  const recentAppointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <Card className="max-w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Rendez-vous récents
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {recentAppointments.map((apt) => (
          <div
            key={apt.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3 last:border-0"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{apt.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {apt.service}
              </p>
            </div>

            <div className="text-sm sm:text-right whitespace-nowrap">
              <p className="font-medium">
                {formatSimpleDate(apt.date)} {apt.timeSlot}
              </p>
              <span
                className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                  apt.status
                )}`}
              >
                {getStatusText(apt.status)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ===================== MESSAGES ===================== */
async function RecentMessagesCard() {
  const recentMessages = await prisma.message.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <Card className="max-w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages récents
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {recentMessages.map((msg) => (
          <div
            key={msg.id}
            className="flex gap-3 border-b pb-3 last:border-0 min-w-0"
          >
            <span
              className={`mt-2 h-2 w-2 rounded-full shrink-0 ${
                msg.isRead ? "bg-gray-300" : "bg-blue-500"
              }`}
            />

            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <p className="font-medium truncate">{msg.name}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(msg.createdAt, "dd/MM/yyyy", { locale: fr })}
                </span>
              </div>

              <p className="text-sm font-medium text-muted-foreground truncate">
                {msg.subject}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ===================== PAGE ===================== */
export default async function AssistantDashboard() {
  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Tableau de bord Assistant
        </h1>
        <p className="text-muted-foreground">
          Vue d’ensemble des rendez-vous et messages clients
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton type="stats" />}>
        <StatsCards />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Suspense fallback={<DashboardSkeleton type="appointments" />}>
          <RecentAppointmentsCard />
        </Suspense>

        <Suspense fallback={<DashboardSkeleton type="messages" />}>
          <RecentMessagesCard />
        </Suspense>
      </div>
    </div>
  );
}
