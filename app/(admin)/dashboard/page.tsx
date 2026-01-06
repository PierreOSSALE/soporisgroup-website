//app/(admin)/dashbord/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderKanban,
  FileText,
  Calendar,
  MessageSquare,
  TrendingUp,
  Users,
  Eye,
  DollarSign,
} from "lucide-react";
import {
  mockProjects,
  mockBlogs,
  mockAppointments,
  mockMessages,
  mockPacks,
} from "@/components/data/mockAdminData";

const stats = [
  {
    title: "Projets",
    value: mockProjects.length,
    icon: FolderKanban,
    description: `${
      mockProjects.filter((p) => p.status === "published").length
    } publiés`,
    trend: "+12%",
  },
  {
    title: "Articles",
    value: mockBlogs.length,
    icon: FileText,
    description: `${mockBlogs.reduce(
      (acc, b) => acc + b.views,
      0
    )} vues totales`,
    trend: "+8%",
  },
  {
    title: "Rendez-vous",
    value: mockAppointments.length,
    icon: Calendar,
    description: `${
      mockAppointments.filter((a) => a.status === "pending").length
    } en attente`,
    trend: "+24%",
  },
  {
    title: "Messages",
    value: mockMessages.length,
    icon: MessageSquare,
    description: `${mockMessages.filter((m) => !m.isRead).length} non lus`,
    trend: "+5%",
  },
];

export default function AdminDashboard() {
  const recentAppointments = mockAppointments.slice(0, 5);
  const recentMessages = mockMessages.filter((m) => !m.isArchived).slice(0, 5);

  return (
    <>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.trend}</span>
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Appointments */}
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
                      <p className="text-sm">{apt.date}</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          apt.status === "confirmed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : apt.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : apt.status === "cancelled"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
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

          {/* Recent Messages */}
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
                        msg.isRead ? "bg-muted" : "bg-accent"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{msg.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.receivedAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {msg.subject}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Promotions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Promotions actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockPacks
                .filter((pack) => pack.isPromo && pack.isActive)
                .map((pack) => (
                  <div
                    key={pack.id}
                    className="p-4 rounded-lg border border-accent bg-accent/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{pack.name}</h4>
                      <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded">
                        {pack.promoLabel}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{pack.price}€</span>
                      {pack.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {pack.originalPrice}€
                        </span>
                      )}
                    </div>
                    {pack.promoEndDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Expire le{" "}
                        {new Date(pack.promoEndDate).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
