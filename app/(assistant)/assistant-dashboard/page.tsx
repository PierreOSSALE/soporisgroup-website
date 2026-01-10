import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Fonction pour formater la date
const formatAppointmentDate = (date: Date) => {
  return format(date, "yyyy-MM-dd HH:mm:ss", { locale: fr });
};

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

export default async function AssistantDashboard() {
  // Récupérer les rendez-vous récents (les 5 derniers)
  const recentAppointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Récupérer les messages récents (les 5 derniers non archivés)
  const recentMessages = await prisma.message.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Calculer les statistiques
  const totalAppointments = await prisma.appointment.count();
  const pendingAppointments = await prisma.appointment.count({
    where: { status: "pending" },
  });

  const unreadMessages = await prisma.message.count({
    where: { isRead: false },
  });

  const totalMessages = await prisma.message.count();

  // Rendez-vous confirmés aujourd'hui
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const confirmedToday = await prisma.appointment.count({
    where: {
      status: "confirmed",
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Messages urgents (qui contiennent "urgence" dans le sujet)
  const urgentMessages = await prisma.message.count({
    where: {
      isRead: false,
      subject: {
        contains: "urgence",
        mode: "insensitive",
      },
    },
  });

  const stats = [
    {
      title: "Rendez-vous",
      value: totalAppointments,
      icon: Calendar,
      description: `${pendingAppointments} en attente`,
      trend: "+24%", // Vous pouvez calculer cela si vous avez des données historiques
      color: "text-blue-600",
    },
    {
      title: "Messages non lus",
      value: unreadMessages,
      icon: MessageSquare,
      description: `${totalMessages} messages totaux`,
      trend: "+5%", // Vous pouvez calculer cela si vous avez des données historiques
      color: "text-green-600",
    },
    {
      title: "Confirmés aujourd'hui",
      value: confirmedToday,
      icon: CheckCircle,
      description: "Rendez-vous confirmés",
      trend: "+15%", // Vous pouvez calculer cela si vous avez des données historiques
      color: "text-purple-600",
    },
    {
      title: "À traiter urgent",
      value: urgentMessages,
      icon: Clock,
      description: "Messages urgents",
      trend: "+3", // Vous pouvez calculer cela si vous avez des données historiques
      color: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Assistant</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des rendez-vous et messages clients
        </p>
      </div>

      {/* Statistiques */}
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
                  <span className="text-green-600 font-medium">
                    {stat.trend}
                  </span>
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tableaux */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rendez-vous récents */}
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
                    <p className="text-sm text-muted-foreground">
                      {apt.service}
                    </p>
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

        {/* Messages récents */}
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
      </div>
    </div>
  );
}
