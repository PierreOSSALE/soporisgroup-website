// app/(admin)/admin-projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Search, Eye, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  toggleFeatured,
  changeStatus,
  getProjectById,
} from "@/lib/actions/project.actions";
import { useRouter } from "next/navigation";

// Définir un type pour l'admin qui correspond aux données retournées par getProjects()
type AdminProject = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  client: string;
  duration: string;
  pack: string;
  year: string;
  status: "draft" | "published" | "archived";
  imageUrl: string | null;
  featured: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Type pour les données du formulaire
type ProjectFormData = {
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  client: string;
  duration: string;
  pack: string;
  year: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  imageUrl: string;
  description: string;
  technologies: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
  screenshots: Array<{ url: string; caption: string }>;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(
    null
  );
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    subtitle: "",
    slug: "",
    category: "",
    client: "",
    duration: "",
    pack: "",
    year: new Date().getFullYear().toString(),
    status: "draft",
    featured: false,
    imageUrl: "",
    description: "",
    technologies: [],
    challenges: [],
    solutions: [],
    results: [],
    screenshots: [],
  });

  // Charger les projets
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      // Type assertion car getProjects() retourne seulement certains champs
      setProjects(data as unknown as AdminProject[]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = async (projectId?: string) => {
    if (projectId) {
      try {
        const project = await getProjectById(projectId);
        if (project) {
          setEditingProject(project as unknown as AdminProject);
          setFormData({
            title: project.title || "",
            subtitle: project.subtitle || "",
            slug: project.slug || "",
            category: project.category || "",
            client: project.client || "",
            duration: project.duration || "",
            pack: project.pack || "",
            year: project.year || new Date().getFullYear().toString(),
            status: project.status || "draft",
            featured: project.featured || false,
            imageUrl: project.imageUrl || "",
            description: project.description || "",
            technologies: (project.technologies as string[]) || [],
            challenges: (project.challenges as string[]) || [],
            solutions: (project.solutions as string[]) || [],
            results: (project.results as string[]) || [],
            screenshots:
              (project.screenshots as Array<{
                url: string;
                caption: string;
              }>) || [],
            testimonial: project.testimonial as
              | { quote: string; author: string; role: string }
              | undefined,
          });
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le projet",
          variant: "destructive",
        });
      }
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        subtitle: "",
        slug: "",
        category: "",
        client: "",
        duration: "",
        pack: "",
        year: new Date().getFullYear().toString(),
        status: "draft",
        featured: false,
        imageUrl: "",
        description: "",
        technologies: [],
        challenges: [],
        solutions: [],
        results: [],
        screenshots: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Préparer les données pour l'envoi
      const dataToSend = {
        ...formData,
        // S'assurer que les champs optionnels sont undefined s'ils sont vides
        imageUrl: formData.imageUrl || undefined,
        description: formData.description || undefined,
        testimonial: formData.testimonial?.quote
          ? formData.testimonial
          : undefined,
      };

      if (editingProject) {
        // Mise à jour
        await updateProject(editingProject.id, dataToSend);
        toast({
          title: "Succès",
          description: "Le projet a été mis à jour avec succès.",
        });
      } else {
        // Création
        await createProject(dataToSend);
        toast({
          title: "Succès",
          description: "Le projet a été créé avec succès.",
        });
      }

      // Recharger les projets
      await loadProjects();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete);
      toast({
        title: "Succès",
        description: "Le projet a été supprimé avec succès.",
      });
      // Recharger les projets
      await loadProjects();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le projet",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await toggleFeatured(id, featured);
      toast({
        title: "Succès",
        description: `Le projet a été ${
          featured ? "mis en vedette" : "retiré de la vedette"
        }.`,
      });
      // Recharger les projets
      await loadProjects();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le statut",
        variant: "destructive",
      });
    }
  };

  const handleChangeStatus = async (
    id: string,
    status: "draft" | "published" | "archived"
  ) => {
    try {
      await changeStatus(id, status);
      toast({
        title: "Succès",
        description: `Statut changé en ${getStatusLabel(status)}.`,
      });
      // Recharger les projets
      await loadProjects();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer le statut",
        variant: "destructive",
      });
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publié";
      case "draft":
        return "Brouillon";
      case "archived":
        return "Archivé";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "archived":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement des projets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Modifier le projet" : "Nouveau projet"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="mon-projet-exemple"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Sous-titre *</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData({ ...formData, client: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Site Vitrine">Site Vitrine</SelectItem>
                      <SelectItem value="Application Web">
                        Application Web
                      </SelectItem>
                      <SelectItem value="Landing Page">Landing Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pack">Pack *</Label>
                  <Select
                    value={formData.pack}
                    onValueChange={(value) =>
                      setFormData({ ...formData, pack: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pack Starter">Pack Starter</SelectItem>
                      <SelectItem value="Pack Business">
                        Pack Business
                      </SelectItem>
                      <SelectItem value="Pack Premium">Pack Premium</SelectItem>
                      <SelectItem value="Pack E-commerce">
                        Pack E-commerce
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée *</Label>
                  <Input
                    id="duration"
                    placeholder="Ex: 8 semaines"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Année *</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(
                      value: "draft" | "published" | "archived"
                    ) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de l'image</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
                <Label htmlFor="featured">Mettre en vedette</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                {editingProject ? "Enregistrer" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projets ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-center">Vedette</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.subtitle}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                      <Select
                        value={project.status}
                        onValueChange={(
                          value: "draft" | "published" | "archived"
                        ) => handleChangeStatus(project.id, value)}
                      >
                        <SelectTrigger className="h-6 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Brouillon</SelectItem>
                          <SelectItem value="published">Publié</SelectItem>
                          <SelectItem value="archived">Archivé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleToggleFeatured(project.id, !project.featured)
                      }
                    >
                      <Star
                        className={`h-4 w-4 ${
                          project.featured
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/realisations/${project.slug}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(project.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(project.id)}
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

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est
            irréversible.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
