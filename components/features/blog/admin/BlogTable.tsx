// components/admin/blog/BlogTable.tsx
"use client";

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
import { Pencil, Trash2, Eye, Calendar } from "lucide-react";
import { deleteBlogPost } from "@/lib/actions/blog.actions";
import { useToast } from "@/hooks/use-toast";
import BlogStatusBadge from "./BlogStatusBadge";
import BlogCategoryBadge from "./BlogCategoryBadge";

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

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await deleteBlogPost(id);
        onDeleteSuccess();
        toast({
          title: "Article supprimé",
          description: "L'article a été supprimé avec succès.",
          variant: "destructive",
        });
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Impossible de supprimer l'article",
          variant: "destructive",
        });
      }
    }
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Auteur</TableHead>
          <TableHead>Vues</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
            <TableCell colSpan={7} className="text-center py-8">
              <div className="space-y-2">
                <p className="text-muted-foreground">Aucun article trouvé</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm
                    ? `Aucun résultat pour "${searchTerm}"`
                    : "Créez votre premier article pour commencer"}
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{blog.title}</p>
                  <p className="text-sm text-muted-foreground">{blog.slug}</p>
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
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{blog.author.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">
                    {blog.views?.toLocaleString() || 0}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  {formatDate(blog.publishedAt)}
                </div>
              </TableCell>
              <TableCell>
                <BlogStatusBadge
                  published={blog.published}
                  publishedAt={blog.publishedAt}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(blog)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(blog.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default BlogTable;
