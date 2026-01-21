"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import BlogFormContent from "./BlogFormContent";
import {
  createBlogPost,
  updateBlogPost,
  getAuthors,
} from "@/lib/actions/blog.actions";
import { extractHeadingsFromMarkdown } from "@/lib/utils/markdown";

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBlog: any | null;
  initialAuthors: any[];
  onSuccess: () => void;
}

// Définir le type pour tableOfContents
interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

const BlogDialog = ({
  open,
  onOpenChange,
  editingBlog,
  initialAuthors,
  onSuccess,
}: BlogDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Design",
    authorId: "",
    readTime: 5,
    image: "",
    published: false,
    tableOfContents: [] as TableOfContentsItem[],
  });
  const [authors, setAuthors] = useState(initialAuthors || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Design",
    "Technique",
    "Business",
    "SEO",
    "Marketing",
    "Développement",
    "UI/UX",
    "Technology",
    "Features",
  ];

  // Charger les auteurs si nécessaire
  useEffect(() => {
    if (open && Array.isArray(authors) && authors.length === 0) {
      loadAuthors();
    }
  }, [open]);

  const loadAuthors = async () => {
    try {
      const fetchedAuthors = await getAuthors();
      setAuthors(fetchedAuthors || []);
    } catch (error) {
      console.error("Erreur chargement auteurs:", error);
      setAuthors([]);
    }
  };

  useEffect(() => {
    if (editingBlog) {
      // Convertir le tableOfContents si c'est un tableau de strings
      let tableOfContents: TableOfContentsItem[] = [];
      if (Array.isArray(editingBlog.tableOfContents)) {
        if (editingBlog.tableOfContents.length > 0) {
          if (typeof editingBlog.tableOfContents[0] === "string") {
            // Convertir les strings en objets
            tableOfContents = editingBlog.tableOfContents.map(
              (text: string, index: number) => ({
                id: `heading-${index}`,
                text,
                level: 2,
              }),
            );
          } else {
            // Déjà des objets
            tableOfContents = editingBlog.tableOfContents;
          }
        }
      }

      setFormData({
        title: editingBlog.title || "",
        slug: editingBlog.slug || "",
        excerpt: editingBlog.excerpt || "",
        content: editingBlog.content || "",
        category: editingBlog.category || "Design",
        authorId: editingBlog.authorId || editingBlog.author?.id || "",
        readTime: editingBlog.readTime || 5,
        image: editingBlog.image || "",
        published: editingBlog.published || false,
        tableOfContents,
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Design",
        authorId: "",
        readTime: 5,
        image: "",
        published: false,
        tableOfContents: [],
      });
    }
  }, [editingBlog]);

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

  // Fonction pour générer la table des matières à partir du contenu
  const generateTableOfContents = (content: string): TableOfContentsItem[] => {
    return extractHeadingsFromMarkdown(content);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validation
      if (
        !formData.title ||
        !formData.slug ||
        !formData.excerpt ||
        !formData.content ||
        !formData.category ||
        !formData.authorId
      ) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        });
        return;
      }

      // Générer la table des matières à partir du contenu
      const tableOfContents = generateTableOfContents(formData.content);

      // Préparer les données pour l'API
      const apiData = {
        ...formData,
        tableOfContents,
      };

      if (editingBlog) {
        await updateBlogPost(editingBlog.id, apiData);
        toast({
          title: "Article modifié",
          description: "L'article a été mis à jour avec succès.",
        });
      } else {
        await createBlogPost(apiData);
        toast({
          title: "Article créé",
          description: "Le nouvel article a été ajouté avec succès.",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingBlog ? "Modifier l'article" : "Nouvel article"}
          </DialogTitle>
        </DialogHeader>

        <BlogFormContent
          formData={formData}
          onFormDataChange={setFormData}
          onTitleChange={handleTitleChange}
          authors={authors || []}
          categories={categories}
        />

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, published: checked })
              }
            />
            <Label htmlFor="published">
              {formData.published
                ? "Publier l'article"
                : "Enregistrer comme brouillon"}
            </Label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting
                ? "Enregistrement..."
                : editingBlog
                  ? "Enregistrer"
                  : "Créer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDialog;
