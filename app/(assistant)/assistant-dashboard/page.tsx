//app/(assistant/dashbord/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Clock, CheckCircle } from "lucide-react";
import {
  mockAppointments,
  mockMessages,
} from "@/components/data/mockAssistantData";

const stats = [
  {
    title: "Rendez-vous",
    value: mockAppointments.length,
    icon: Calendar,
    description: `${
      mockAppointments.filter((a) => a.status === "pending").length
    } en attente`,
    trend: "+24%",
    color: "text-blue-600",
  },
  {
    title: "Messages non lus",
    value: mockMessages.filter((m) => !m.isRead).length,
    icon: MessageSquare,
    description: `${mockMessages.length} messages totaux`,
    trend: "+5%",
    color: "text-green-600",
  },
  {
    title: "Confirmés aujourd'hui",
    value: mockAppointments.filter(
      (a) =>
        a.status === "confirmed" &&
        a.date === new Date().toISOString().split("T")[0]
    ).length,
    icon: CheckCircle,
    description: "Rendez-vous confirmés",
    trend: "+15%",
    color: "text-purple-600",
  },
  {
    title: "À traiter urgent",
    value: mockMessages.filter(
      (m) => !m.isRead && m.subject.toLowerCase().includes("urgence")
    ).length,
    icon: Clock,
    description: "Messages urgents",
    trend: "+3",
    color: "text-red-600",
  },
];

export default function AssistantDashboard() {
  const recentAppointments = mockAppointments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentMessages = mockMessages
    .filter((m) => !m.isArchived)
    .sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    )
    .slice(0, 5);

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
                      {apt.date} à {apt.time}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        apt.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : apt.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : apt.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {apt.status === "confirmed"
                        ? "Confirmé"
                        : apt.status === "pending"
                        ? "En attente"
                        : apt.status === "cancelled"
                        ? "Annulé"
                        : "Terminé"}
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
                        {new Date(msg.receivedAt).toLocaleDateString("fr-FR")}
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
