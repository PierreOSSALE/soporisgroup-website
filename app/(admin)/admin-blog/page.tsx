// app/(admin)/admin-blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BlogTable from "@/components/features/blog/admin/BlogTable";
import BlogDialog from "@/components/features/blog/admin/BlogDialog";
import { getBlogPosts } from "@/lib/actions/blog.actions";
import { getAuthors } from "@/lib/actions/blog.actions";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const data = await getBlogPosts();
      const authorsData = await getAuthors();
      setBlogs(data);
      setAuthors(authorsData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenDialog = (blog?: any) => {
    if (blog) {
      setEditingBlog(blog);
    } else {
      setEditingBlog(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBlog(null);
  };

  const handleSuccess = () => {
    loadBlogs();
    handleCloseDialog();
  };

  return (
    <div className="space-y-6">
      {/* Titre et description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion du blog</h1>
        <p className="text-muted-foreground">
          Gérez les articles de votre blog, publiez et suivez les performances
        </p>
      </div>

      {/* Barre de recherche et bouton */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre, auteur ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      {/* Tableau des articles */}
      <Card>
        <CardContent className="p-0">
          <BlogTable
            blogs={filteredBlogs}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onEdit={handleOpenDialog}
            onDeleteSuccess={loadBlogs}
          />
        </CardContent>
      </Card>

      {/* Dialog pour créer/modifier */}
      <BlogDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingBlog={editingBlog}
        authors={authors}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
