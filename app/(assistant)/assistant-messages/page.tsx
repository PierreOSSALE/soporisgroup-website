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
  Mail,
  MailOpen,
  Archive,
  Trash2,
  Reply,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getMessages,
  markAsRead,
  toggleArchive,
  deleteMessage,
} from "@/lib/actions/message.actions";
import type { Message } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssistantMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Charger les messages
  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getMessages();
      setMessages(data || []);

      // Calculer le nombre de messages non lus
      const unread =
        data?.filter((m) => !m.isRead && !m.isArchived).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch && !msg.isArchived;
    if (filter === "unread")
      return matchesSearch && !msg.isRead && !msg.isArchived;
    if (filter === "archived") return matchesSearch && msg.isArchived;
    return matchesSearch;
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      await loadMessages();
      toast({
        title: "Message marqué comme lu",
        description: "Le message a été marqué comme lu.",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer le message comme lu",
        variant: "destructive",
      });
    }
  };

  const handleToggleArchive = async (id: string) => {
    try {
      const message = messages.find((m) => m.id === id);
      await toggleArchive(id);
      await loadMessages();
      toast({
        title: message?.isArchived ? "Message restauré" : "Message archivé",
        description: message?.isArchived
          ? "Le message a été restauré."
          : "Le message a été archivé.",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'état du message",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (
      !confirm("Êtes-vous sûr de vouloir supprimer définitivement ce message ?")
    ) {
      return;
    }

    try {
      await deleteMessage(id);
      await loadMessages();
      toast({
        title: "Message supprimé",
        description: "Le message a été définitivement supprimé.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
    }
  };

  const openMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      await markAsRead(msg.id);
      loadMessages();
    }
  };

  return (
    <div className="space-y-6">
      {/* Titre et description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Messages des visiteurs
        </h1>
        <p className="text-muted-foreground">
          Gérez et répondez aux messages reçus via le formulaire de contact de
          votre site
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou sujet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                Tous ({messages.filter((m) => !m.isArchived).length})
              </SelectItem>
              <SelectItem value="unread">Non lus ({unreadCount})</SelectItem>
              <SelectItem value="archived">
                Archivés ({messages.filter((m) => m.isArchived).length})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!isLoading && unreadCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg">
            <Mail className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">
              {unreadCount} message{unreadCount > 1 ? "s" : ""} non lu
              {unreadCount > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Tableau des messages */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Expéditeur</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton loading
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-56" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
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
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <TableRow
                    key={message.id}
                    className={!message.isRead ? "bg-accent/5" : ""}
                  >
                    <TableCell>
                      {message.isRead ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-accent" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p
                          className={`${
                            !message.isRead ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {message.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {message.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p
                        className={`${
                          !message.isRead ? "font-semibold" : ""
                        } line-clamp-1`}
                      >
                        {message.subject}
                      </p>
                    </TableCell>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleArchive(message.id)}
                          title={message.isArchived ? "Restaurer" : "Archiver"}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        Aucun message trouvé
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {filter === "all"
                          ? "Tous les messages sont archivés"
                          : `Aucun message correspondant au filtre "${filter}"`}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="font-medium">{selectedMessage.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.email}
                  </p>
                  {selectedMessage.phone && (
                    <p className="text-sm text-muted-foreground">
                      {selectedMessage.phone}
                    </p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedMessage.createdAt).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
              <div className="py-4">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                  }}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Répondre
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleToggleArchive(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {selectedMessage.isArchived ? "Restaurer" : "Archiver"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
