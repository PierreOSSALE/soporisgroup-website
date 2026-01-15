// app/(admin)/admin-projects/page.tsx
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
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  Star,
  X,
  Link as LinkIcon,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

// Types pour les champs JSON
type Screenshot = {
  url: string;
  caption: string;
};

type Testimonial = {
  quote: string;
  author: string;
  role: string;
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
  screenshots: Screenshot[];
  testimonial?: Testimonial;
};

// Fonction helper pour parser les champs JSON
const parseJsonField = <T,>(field: any, defaultValue: T): T => {
  if (!field) return defaultValue;
  if (Array.isArray(field)) return field as T;
  if (typeof field === "object") return field as T;

  try {
    return JSON.parse(field as string) as T;
  } catch {
    return defaultValue;
  }
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
    testimonial: undefined,
  });

  const [newTechnology, setNewTechnology] = useState("");
  const [newChallenge, setNewChallenge] = useState("");
  const [newSolution, setNewSolution] = useState("");
  const [newResult, setNewResult] = useState("");
  const [newScreenshot, setNewScreenshot] = useState<Screenshot>({
    url: "",
    caption: "",
  });
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    quote: "",
    author: "",
    role: "",
  });

  // Charger les projets
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
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
            technologies: parseJsonField<string[]>(project.technologies, []),
            challenges: parseJsonField<string[]>(project.challenges, []),
            solutions: parseJsonField<string[]>(project.solutions, []),
            results: parseJsonField<string[]>(project.results, []),
            screenshots: parseJsonField<Screenshot[]>(project.screenshots, []),
            testimonial: parseJsonField<Testimonial | undefined>(
              project.testimonial,
              undefined
            ),
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
        testimonial: undefined,
      });
    }
    setIsDialogOpen(true);
  };

  // Fonctions pour gérer les listes
  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTechnology.trim()],
      });
      setNewTechnology("");
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  const addChallenge = () => {
    if (newChallenge.trim()) {
      setFormData({
        ...formData,
        challenges: [...formData.challenges, newChallenge.trim()],
      });
      setNewChallenge("");
    }
  };

  const removeChallenge = (index: number) => {
    setFormData({
      ...formData,
      challenges: formData.challenges.filter((_, i) => i !== index),
    });
  };

  const addSolution = () => {
    if (newSolution.trim()) {
      setFormData({
        ...formData,
        solutions: [...formData.solutions, newSolution.trim()],
      });
      setNewSolution("");
    }
  };

  const removeSolution = (index: number) => {
    setFormData({
      ...formData,
      solutions: formData.solutions.filter((_, i) => i !== index),
    });
  };

  const addResult = () => {
    if (newResult.trim()) {
      setFormData({
        ...formData,
        results: [...formData.results, newResult.trim()],
      });
      setNewResult("");
    }
  };

  const removeResult = (index: number) => {
    setFormData({
      ...formData,
      results: formData.results.filter((_, i) => i !== index),
    });
  };

  const addScreenshot = () => {
    if (newScreenshot.url.trim() && newScreenshot.caption.trim()) {
      setFormData({
        ...formData,
        screenshots: [...formData.screenshots, { ...newScreenshot }],
      });
      setNewScreenshot({ url: "", caption: "" });
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData({
      ...formData,
      screenshots: formData.screenshots.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    try {
      // Validation des champs requis
      if (
        !formData.title ||
        !formData.slug ||
        !formData.category ||
        !formData.client
      ) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      // Préparer les données pour l'envoi
      const dataToSend = {
        ...formData,
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

  return (
    <div className="space-y-6">
      {/* Titre et description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des projets
        </h1>
        <p className="text-muted-foreground">
          Gérez et organisez vos réalisations, modifiez leur statut et
          mettez-les en vedette
        </p>
      </div>

      {/* Barre de recherche et bouton */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un projet, client ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
          {isLoading && <Skeleton className="h-10 w-40" />}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Modifier le projet" : "Nouveau projet"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Section Informations de base */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informations de base</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Ex: E-commerce Mode Luxe"
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
                      placeholder="ecommerce-mode-luxe"
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
                    placeholder="Description courte du projet"
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
                      placeholder="Ex: Maison Élégance"
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
                        <SelectItem value="Sites Web">Sites Web</SelectItem>
                        <SelectItem value="UI/UX">UI/UX</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Application Web">
                          Application Web
                        </SelectItem>
                        <SelectItem value="Landing Page">
                          Landing Page
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                        <SelectItem value="Starter">Starter</SelectItem>
                        <SelectItem value="Pro">Pro</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL de l'image principale</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/photo-..."
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description complète</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    placeholder="Description détaillée du projet..."
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

              {/* Accordion pour les champs supplémentaires */}
              <Accordion type="multiple" className="w-full">
                {/* Technologies */}
                <AccordionItem value="technologies">
                  <AccordionTrigger>Technologies</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newTechnology}
                          onChange={(e) => setNewTechnology(e.target.value)}
                          placeholder="Ajouter une technologie (ex: React)"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addTechnology())
                          }
                        />
                        <Button type="button" onClick={addTechnology}>
                          Ajouter
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.technologies.map((tech, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                          >
                            {tech}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => removeTechnology(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Défis */}
                <AccordionItem value="challenges">
                  <AccordionTrigger>Défis rencontrés</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newChallenge}
                          onChange={(e) => setNewChallenge(e.target.value)}
                          placeholder="Ajouter un défi"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addChallenge())
                          }
                        />
                        <Button type="button" onClick={addChallenge}>
                          Ajouter
                        </Button>
                      </div>
                      <ul className="space-y-2">
                        {formData.challenges.map((challenge, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between p-2 bg-secondary rounded"
                          >
                            <span>{challenge}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeChallenge(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Solutions */}
                <AccordionItem value="solutions">
                  <AccordionTrigger>Solutions apportées</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newSolution}
                          onChange={(e) => setNewSolution(e.target.value)}
                          placeholder="Ajouter une solution"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addSolution())
                          }
                        />
                        <Button type="button" onClick={addSolution}>
                          Ajouter
                        </Button>
                      </div>
                      <ul className="space-y-2">
                        {formData.solutions.map((solution, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between p-2 bg-secondary rounded"
                          >
                            <span>{solution}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSolution(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Résultats */}
                <AccordionItem value="results">
                  <AccordionTrigger>Résultats obtenus</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newResult}
                          onChange={(e) => setNewResult(e.target.value)}
                          placeholder="Ajouter un résultat"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addResult())
                          }
                        />
                        <Button type="button" onClick={addResult}>
                          Ajouter
                        </Button>
                      </div>
                      <ul className="space-y-2">
                        {formData.results.map((result, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between p-2 bg-secondary rounded"
                          >
                            <span>{result}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeResult(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Captures d'écran */}
                <AccordionItem value="screenshots">
                  <AccordionTrigger>Captures d'écran</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>URL de l'image</Label>
                          <Input
                            value={newScreenshot.url}
                            onChange={(e) =>
                              setNewScreenshot({
                                ...newScreenshot,
                                url: e.target.value,
                              })
                            }
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Légende</Label>
                          <Input
                            value={newScreenshot.caption}
                            onChange={(e) =>
                              setNewScreenshot({
                                ...newScreenshot,
                                caption: e.target.value,
                              })
                            }
                            placeholder="Description de l'image"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={addScreenshot}
                        disabled={!newScreenshot.url || !newScreenshot.caption}
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Ajouter la capture
                      </Button>

                      <div className="space-y-3">
                        {formData.screenshots.map((screenshot, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-secondary rounded"
                          >
                            <div>
                              <p className="text-sm font-medium truncate max-w-md">
                                {screenshot.url}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {screenshot.caption}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeScreenshot(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Témoignage */}
                <AccordionItem value="testimonial">
                  <AccordionTrigger>Témoignage client</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Citation</Label>
                        <Textarea
                          value={formData.testimonial?.quote || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              testimonial: {
                                ...formData.testimonial,
                                quote: e.target.value,
                                author: formData.testimonial?.author || "",
                                role: formData.testimonial?.role || "",
                              } as Testimonial,
                            })
                          }
                          placeholder="Citation du client..."
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Auteur</Label>
                          <Input
                            value={formData.testimonial?.author || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                testimonial: {
                                  ...formData.testimonial,
                                  author: e.target.value,
                                  quote: formData.testimonial?.quote || "",
                                  role: formData.testimonial?.role || "",
                                } as Testimonial,
                              })
                            }
                            placeholder="Nom du client"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rôle</Label>
                          <Input
                            value={formData.testimonial?.role || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                testimonial: {
                                  ...formData.testimonial,
                                  role: e.target.value,
                                  quote: formData.testimonial?.quote || "",
                                  author: formData.testimonial?.author || "",
                                } as Testimonial,
                              })
                            }
                            placeholder="Rôle (ex: Directeur, CEO)"
                          />
                        </div>
                      </div>
                      {formData.testimonial?.quote && (
                        <div className="p-3 bg-primary/10 rounded border border-primary/20">
                          <p className="italic">
                            "{formData.testimonial.quote}"
                          </p>
                          <p className="mt-2 font-semibold">
                            {formData.testimonial.author}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formData.testimonial.role}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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

      {/* Tableau des projets */}
      <Card>
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-4 rounded-full mx-auto" />
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
              ) : filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        Aucun projet trouvé
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm
                          ? `Aucun résultat pour "${searchTerm}"`
                          : "Créez votre premier projet pour commencer"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
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
                ))
              )}
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
