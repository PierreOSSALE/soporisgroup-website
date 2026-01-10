// app/(admin)/admin-services/page.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/actions/service.actions";
import type { Service } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    price: "",
    slug: "",
    color: "#3B82F6",
    isActive: true,
    order: 1,
    features: [] as string[],
  });

  // Charger les services
  const loadServices = async () => {
    setIsLoading(true);
    try {
      const data = await getServices();
      setServices(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        price: service.price,
        slug: service.slug,
        color: service.color || "#3B82F6",
        isActive: service.isActive,
        order: service.order,
        features: service.features || [],
      });
    } else {
      const maxOrder =
        services.length > 0 ? Math.max(...services.map((s) => s.order)) : 0;
      setEditingService(null);
      setFormData({
        title: "",
        description: "",
        icon: "Palette",
        price: "",
        slug: "",
        color: "#3B82F6",
        isActive: true,
        order: maxOrder + 1,
        features: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.slug.trim()
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
        toast({
          title: "Service modifié",
          description: "Le service a été mis à jour avec succès.",
        });
      } else {
        await createService(formData);
        toast({
          title: "Service créé",
          description: "Le nouveau service a été ajouté avec succès.",
        });
      }
      setIsDialogOpen(false);
      await loadServices();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }

    try {
      await deleteService(id);
      toast({
        title: "Service supprimé",
        description: "Le service a été supprimé avec succès.",
        variant: "destructive",
      });
      await loadServices();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le service",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await updateService(service.id, { isActive: !service.isActive });
      toast({
        title: "Statut mis à jour",
        description: `Le service a été ${
          !service.isActive ? "activé" : "désactivé"
        }.`,
      });
      await loadServices();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des services</h1>
          <p className="text-muted-foreground">
            Gérez les services proposés par l'agence
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Modifier le service" : "Nouveau service"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="required">
                    Titre
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ex: Création de site web"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="required">
                    Slug (URL)
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="Ex: creation-site-web"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="required">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Décrivez le service..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icône (nom Lucide)</Label>
                  <Input
                    id="icon"
                    placeholder="Ex: Palette, Code, Globe"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix</Label>
                  <Input
                    id="price"
                    placeholder="Ex: À partir de 1500€"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Couleur (hex)</Label>
                  <Input
                    id="color"
                    placeholder="#3B82F6"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Ordre d'affichage</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 1,
                      })
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">
                  Fonctionnalités (une par ligne)
                </Label>
                <Textarea
                  id="features"
                  rows={3}
                  value={formData.features.join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: e.target.value
                        .split("\n")
                        .filter((f) => f.trim()),
                    })
                  }
                  placeholder="Chaque ligne est une fonctionnalité"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Statut</Label>
                  <p className="text-sm text-muted-foreground">
                    Ce service sera visible sur le site
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingService ? "Enregistrer" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tableau */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Ordre</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Fonctionnalités</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length > 0 ? (
                services
                  .sort((a, b) => a.order - b.order)
                  .map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <span className="font-mono">{service.order}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{service.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{service.price}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {service.features
                            .slice(0, 2)
                            .map((feature, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          {service.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              service.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {service.isActive ? "Actif" : "Inactif"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(service)}
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleActive(service)}
                            title={service.isActive ? "Désactiver" : "Activer"}
                          >
                            <Switch
                              checked={service.isActive}
                              className="h-4 w-4"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(service.id)}
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
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        Aucun service trouvé
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Créez votre premier service
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
