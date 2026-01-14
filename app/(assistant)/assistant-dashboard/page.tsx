// app/(admin)/assistant-dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Suspense } from "react";
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton";

// Fonction pour formater la date simple
const formatSimpleDate = (date: Date) => {
  return format(date, "yyyy-MM-dd", { locale: fr });
};

// Fonction pour obtenir le texte du statut
const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmé";
    case "cancelled":
      return "Annulé";
    case "completed":
      return "Terminé";
    default:
      return status;
  }
};

// Fonction pour obtenir la classe CSS du statut
const getStatusClass = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Composant pour les statistiques
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
    prisma.appointment.count({
      where: { status: "pending" },
    }),
    prisma.message.count({
      where: { isRead: false },
    }),
    prisma.message.count(),
    // Rendez-vous confirmés aujourd'hui
    (async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return await prisma.appointment.count({
        where: {
          status: "confirmed",
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      });
    })(),
    // Messages urgents
    prisma.message.count({
      where: {
        isRead: false,
        subject: {
          contains: "urgence",
          mode: "insensitive",
        },
      },
    }),
  ]);

  const stats = [
    {
      title: "Rendez-vous",
      value: totalAppointments,
      icon: Calendar,
      description: `${pendingAppointments} en attente`,
      trend: "+24%",
      color: "text-blue-600",
    },
    {
      title: "Messages non lus",
      value: unreadMessages,
      icon: MessageSquare,
      description: `${totalMessages} messages totaux`,
      trend: "+5%",
      color: "text-green-600",
    },
    {
      title: "Confirmés aujourd'hui",
      value: confirmedToday,
      icon: CheckCircle,
      description: "Rendez-vous confirmés",
      trend: "+15%",
      color: "text-purple-600",
    },
    {
      title: "À traiter urgent",
      value: urgentMessages,
      icon: Clock,
      description: "Messages urgents",
      trend: "+3",
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{stat.trend}</span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Composant pour les rendez-vous récents
async function RecentAppointmentsCard() {
  const recentAppointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Rendez-vous récents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAppointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0"
            >
              <div>
                <p className="font-medium">{apt.name}</p>
                <p className="text-sm text-muted-foreground">{apt.service}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatSimpleDate(apt.date)} {apt.timeSlot}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                    apt.status
                  )}`}
                >
                  {getStatusText(apt.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour les messages récents
async function RecentMessagesCard() {
  const recentMessages = await prisma.message.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages récents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start gap-3 border-b border-border pb-3 last:border-0"
            >
              <div
                className={`h-2 w-2 mt-2 rounded-full ${
                  msg.isRead ? "bg-gray-300" : "bg-blue-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{msg.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {format(msg.createdAt, "dd/MM/yyyy", { locale: fr })}
                  </span>
                </div>
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {msg.subject}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {msg.message.substring(0, 50)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AssistantDashboard() {
  return (
    <div className="space-y-6">
      {/* Titre et description */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tableau de bord Assistant
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des rendez-vous et messages clients en temps réel
        </p>
      </div>

      {/* Statistiques avec skeleton */}
      <Suspense fallback={<DashboardSkeleton type="stats" />}>
        <StatsCards />
      </Suspense>

      {/* Tableaux avec skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
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
