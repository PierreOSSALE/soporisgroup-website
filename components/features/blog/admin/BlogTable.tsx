// components/admin/blog/BlogTable.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pencil,
  Trash2,
  Eye,
  Calendar,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { deleteBlogPost } from "@/lib/actions/blog.actions";
import { useToast } from "@/hooks/use-toast";
import BlogStatusBadge from "./BlogStatusBadge";
import BlogCategoryBadge from "./BlogCategoryBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BlogTableProps {
  blogs: any[];
  isLoading: boolean;
  searchTerm: string;
  onEdit: (blog: any) => void;
  onDeleteSuccess: () => void;
}

const BlogTable = ({
  blogs,
  isLoading,
  searchTerm,
  onEdit,
  onDeleteSuccess,
}: BlogTableProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (blog: any) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    setIsDeleting(true);
    try {
      await deleteBlogPost(blogToDelete.id);
      onDeleteSuccess();
      toast({
        title: "✅ Article supprimé",
        description: `"${blogToDelete.title}" a été supprimé définitivement.`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible de supprimer l'article",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBlogToDelete(null);
    setIsDeleting(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Non publié";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-70">Titre</TableHead>
            <TableHead className="w-30">Catégorie</TableHead>
            <TableHead className="w-40">Auteur</TableHead>
            <TableHead className="w-20">Vues</TableHead>
            <TableHead className="w-30">Date</TableHead>
            <TableHead className="w-25">Statut</TableHead>
            <TableHead className="w-25 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : blogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="font-medium text-foreground">
                      Aucun article trouvé
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {searchTerm
                        ? `Aucun résultat pour "${searchTerm}"`
                        : "Commencez par créer votre premier article"}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            blogs.map((blog) => (
              <TableRow key={blog.id} className="group hover:bg-muted/50">
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {blog.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      /blog/{blog.slug}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <BlogCategoryBadge category={blog.category} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      className="w-6 h-6 rounded-full border"
                    />
                    <span className="text-sm">{blog.author.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      {blog.views?.toLocaleString() || 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{formatDate(blog.publishedAt)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <BlogStatusBadge
                    published={blog.published}
                    publishedAt={blog.publishedAt}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(blog)}
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      title="Modifier"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Dialog
                      open={deleteDialogOpen && blogToDelete?.id === blog.id}
                      onOpenChange={(open) => {
                        if (!open) handleDeleteCancel();
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(blog)}
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-hidden p-0">
                        {/* Header */}
                        <DialogHeader className="p-6 pb-4">
                          <DialogTitle className="flex items-center gap-2 text-destructive text-base sm:text-lg">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            Confirmer la suppression
                          </DialogTitle>
                        </DialogHeader>

                        {/* Scrollable content */}
                        <div className="px-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                          <DialogDescription asChild>
                            <div className="space-y-6">
                              {/* Article info */}
                              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                <p className="font-medium text-foreground wrap-break-word">
                                  {blogToDelete?.title}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {blogToDelete &&
                                      formatDate(blogToDelete.publishedAt)}
                                  </span>

                                  <span className="hidden sm:inline">•</span>

                                  <span className="inline-flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {blogToDelete?.views?.toLocaleString() ||
                                      0}{" "}
                                    vues
                                  </span>
                                </div>
                              </div>

                              {/* Warning */}
                              <div className="space-y-2">
                                <p className="font-medium text-foreground">
                                  ⚠️ Cette action est irréversible
                                </p>

                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  <li>
                                    L'article sera{" "}
                                    <span className="font-semibold">
                                      définitivement supprimé
                                    </span>
                                  </li>
                                  <li>
                                    Tous les commentaires associés seront
                                    supprimés
                                  </li>
                                  <li>
                                    Les statistiques de vues seront perdues
                                  </li>
                                  <li className="break-all">
                                    L'URL /blog/{blogToDelete?.slug} ne sera
                                    plus accessible
                                  </li>
                                </ul>
                              </div>

                              {/* Recommendation */}
                              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                <p className="text-sm font-medium flex items-center gap-2 text-amber-800 dark:text-amber-300">
                                  <AlertTriangle className="h-4 w-4 shrink-0" />
                                  Recommandation
                                </p>
                                <p className="text-sm mt-1 text-amber-700 dark:text-amber-400">
                                  Pour conserver l'article mais le masquer aux
                                  visiteurs, utilisez plutôt le statut{" "}
                                  <span className="font-medium">
                                    "Brouillon"
                                  </span>
                                  .
                                </p>
                              </div>
                            </div>
                          </DialogDescription>
                        </div>

                        {/* Footer */}
                        <DialogFooter
                          className="
    p-6
    border-t
    flex flex-col-reverse
    sm:flex-row
    gap-2
    sm:justify-between
  "
                        >
                          <div className="text-xs sm:text-sm text-muted-foreground truncate">
                            ID : {blogToDelete?.id}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleDeleteCancel}
                              disabled={isDeleting}
                              className="w-full sm:w-auto gap-2"
                            >
                              <X className="h-4 w-4" />
                              Annuler
                            </Button>

                            <Button
                              type="button"
                              variant="destructive"
                              onClick={handleDeleteConfirm}
                              disabled={isDeleting}
                              className="w-full sm:w-auto gap-2"
                            >
                              {isDeleting ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                  Suppression...
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4" />
                                  Supprimer définitivement
                                </>
                              )}
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default BlogTable;
