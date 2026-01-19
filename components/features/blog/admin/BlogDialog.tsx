// components/admin/blog/BlogDialog.tsx
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
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog.actions";

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBlog: any | null;
  authors: any[];
  onSuccess: () => void;
}

const BlogDialog = ({
  open,
  onOpenChange,
  editingBlog,
  authors,
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
    tableOfContents: [] as string[],
  });
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

  useEffect(() => {
    if (editingBlog) {
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
        tableOfContents: Array.isArray(editingBlog.tableOfContents)
          ? editingBlog.tableOfContents
          : [],
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

      if (editingBlog) {
        await updateBlogPost(editingBlog.id, formData);
        toast({
          title: "Article modifié",
          description: "L'article a été mis à jour avec succès.",
        });
      } else {
        await createBlogPost(formData);
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
          authors={authors}
          categories={categories}
        />

        <div className="flex items-center justify-between">
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
