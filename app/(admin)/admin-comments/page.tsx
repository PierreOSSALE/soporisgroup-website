// app/(admin)/admin-comments/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  X,
  Eye,
  Trash2,
  MessageSquare,
  Clock,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  getPendingComments,
  approveComment,
  deleteComment,
} from "@/lib/actions/comment.actions";
import Link from "next/link";

interface CommentWithPost {
  id: string;
  author: string;
  email: string;
  content: string;
  createdAt: Date;
  approved: boolean;
  post: {
    title: string;
    slug: string;
  };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComment, setSelectedComment] =
    useState<CommentWithPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<{
    id: string;
    author: string;
  } | null>(null);
  const { toast } = useToast();

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingComments();
      setComments(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commentaires",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const filteredComments = comments.filter(
    (comment) =>
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleApprove = async (id: string) => {
    try {
      await approveComment(id);
      toast({
        title: "Commentaire approuvé",
        description: "Le commentaire est maintenant visible sur le site.",
      });
      loadComments();
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'approuver le commentaire",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (comment: CommentWithPost) => {
    setCommentToDelete({
      id: comment.id,
      author: comment.author,
    });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    try {
      await deleteComment(commentToDelete.id);
      toast({
        title: "Commentaire supprimé",
        description: "Le commentaire a été supprimé avec succès.",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      loadComments();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le commentaire",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Modération des commentaires
          </h1>
          <p className="text-muted-foreground">
            Approuvez ou rejetez les commentaires soumis sur vos articles
          </p>
        </div>

        <Badge variant="outline" className="px-3 py-1">
          <Clock className="h-3 w-3 mr-1" />
          {comments.length} en attente
        </Badge>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par auteur, email, contenu ou article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tableau des commentaires */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auteur</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton loading
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredComments.length > 0 ? (
                filteredComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {comment.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm line-clamp-2">{comment.content}</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-6 text-xs"
                            onClick={() => setSelectedComment(comment)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Voir plus
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Commentaire complet</DialogTitle>
                            <DialogDescription>
                              Soumis le {formatDate(comment.createdAt)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium">Auteur</p>
                              <p>
                                {comment.author} ({comment.email})
                              </p>
                            </div>
                            <Separator />
                            <div>
                              <p className="text-sm font-medium">Article</p>
                              <Link
                                href={`/blog/${comment.post.slug}`}
                                className="text-primary hover:underline"
                                target="_blank"
                              >
                                {comment.post.title}
                              </Link>
                            </div>
                            <Separator />
                            <div>
                              <p className="text-sm font-medium">Commentaire</p>
                              <p className="mt-2 p-3 bg-muted rounded-lg">
                                {comment.content}
                              </p>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => openDeleteDialog(comment)}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Supprimer
                              </Button>
                              <Button onClick={() => handleApprove(comment.id)}>
                                <Check className="h-4 w-4 mr-2" />
                                Approuver
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/blog/${comment.post.slug}`}
                        className="text-primary hover:underline text-sm"
                        target="_blank"
                      >
                        {comment.post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(comment.id)}
                          title="Approuver"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(comment)}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="space-y-2">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "Aucun commentaire ne correspond à votre recherche"
                          : "Aucun commentaire en attente de modération"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tous les commentaires ont été traités
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action
              est irréversible.
            </DialogDescription>
          </DialogHeader>

          {commentToDelete && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Auteur : {commentToDelete.author}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Le commentaire sera définitivement supprimé.
                </p>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setCommentToDelete(null);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer définitivement
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
