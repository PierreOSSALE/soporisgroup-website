//app/(admin)/admin-blog/page.tsx
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getBlogArticles,
  createBlogArticle,
  updateBlogArticle,
  deleteBlogArticle,
} from "@/lib/actions/blog.actions";
import { BlogInput } from "@/lib/schema/blog.schema"; // <-- Correction de l'import
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Ajout du contenu
  category: string;
  author: string;
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  readTime: string;
}

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<BlogInput>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Design",
    author: "",
    readTime: "5 min",
    published: false,
    imageUrl: "",
  });

  const categories = [
    "Design",
    "Technique",
    "Business",
    "SEO",
    "Marketing",
    "Développement",
  ];

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const data = await getBlogArticles();
      setBlogs(data as BlogArticle[]);
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

  const handleOpenDialog = (blog?: BlogArticle) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content || blog.excerpt,
        category: blog.category,
        author: blog.author,
        readTime: blog.readTime,
        published: blog.published,
        imageUrl: blog.imageUrl || "",
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Design",
        author: "",
        readTime: "5 min",
        published: false,
        imageUrl: "",
      });
    }
    setIsDialogOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async () => {
    try {
      // Validation des champs requis
      if (
        !formData.title ||
        !formData.slug ||
        !formData.excerpt ||
        !formData.content ||
        !formData.category ||
        !formData.author
      ) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        });
        return;
      }

      const blogData: BlogInput = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        readTime: formData.readTime || "5 min",
        published: formData.published || false,
        imageUrl: formData.imageUrl || "",
      };

      if (editingBlog) {
        await updateBlogArticle(editingBlog.id, blogData);
        toast({
          title: "Article modifié",
          description: "L'article a été mis à jour avec succès.",
        });
      } else {
        await createBlogArticle(blogData);
        toast({
          title: "Article créé",
          description: "Le nouvel article a été ajouté avec succès.",
        });
      }

      await loadBlogs();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await deleteBlogArticle(id);
        await loadBlogs();
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

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd MMM yyyy", { locale: fr });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              {" "}
              <DialogHeader>
                <DialogTitle>
                  {editingBlog ? "Modifier l'article" : "Nouvel article"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4  max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title || ""}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Titre de l'article"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="slug-de-l-article"
                  />
                  <p className="text-xs text-muted-foreground">
                    Doit être en minuscules avec des tirets
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Extrait *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="Court résumé de l'article"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Contenu *</Label>
                  <Textarea
                    id="content"
                    value={formData.content || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Contenu complet de l'article"
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select
                      value={formData.category || "Design"}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Auteur *</Label>
                    <Input
                      id="author"
                      value={formData.author || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="Nom de l'auteur"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="readTime">Temps de lecture</Label>
                    <Input
                      id="readTime"
                      value={formData.readTime || "5 min"}
                      onChange={(e) =>
                        setFormData({ ...formData, readTime: e.target.value })
                      }
                      placeholder="5 min"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL de l'image</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, published: checked })
                    }
                  />
                  <Label htmlFor="published">Publier l'article</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleSubmit}>
                  {editingBlog ? "Enregistrer" : "Créer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                  Chargement des articles...
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Vues</TableHead> {/* <-- Colonne vues */}
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{blog.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {blog.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                          {blog.category}
                        </span>
                      </TableCell>
                      <TableCell>{blog.author}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">
                            {blog.views?.toLocaleString() || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(blog.createdAt)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            blog.published
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {blog.published ? "Publié" : "Brouillon"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(blog)}
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
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
