//app/(admin)/admin-messages/page.tsx
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
import {
  Search,
  Eye,
  Mail,
  MailOpen,
  Archive,
  Trash2,
  Reply,
} from "lucide-react";
import { mockMessages, AdminMessage } from "@/components/data/mockAdminData";
import { useToast } from "@/hooks/use-toast";

export default function AdminMessages() {
  const [messages, setMessages] = useState<AdminMessage[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(
    null
  );
  const { toast } = useToast();

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

  const markAsRead = (id: string) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

  const toggleArchive = (id: string) => {
    const msg = messages.find((m) => m.id === id);
    setMessages(
      messages.map((m) =>
        m.id === id ? { ...m, isArchived: !m.isArchived } : m
      )
    );
    toast({
      title: msg?.isArchived ? "Message restauré" : "Message archivé",
      description: msg?.isArchived
        ? "Le message a été restauré."
        : "Le message a été archivé.",
    });
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    toast({
      title: "Message supprimé",
      description: "Le message a été définitivement supprimé.",
      variant: "destructive",
    });
  };

  const openMessage = (message: AdminMessage) => {
    markAsRead(message.id);
    setSelectedMessage(message);
  };

  const unreadCount = messages.filter((m) => !m.isRead && !m.isArchived).length;

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
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg">
              <Mail className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">
                {unreadCount} message{unreadCount > 1 ? "s" : ""} non lu
                {unreadCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

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
                {filteredMessages.map((message) => (
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
                      {new Date(message.receivedAt).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
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
                          onClick={() => toggleArchive(message.id)}
                          title={message.isArchived ? "Restaurer" : "Archiver"}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
                    {new Date(selectedMessage.receivedAt).toLocaleDateString(
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
                  <p className="whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
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
                      toggleArchive(selectedMessage.id);
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
    </>
  );
}
