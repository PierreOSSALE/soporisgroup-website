// app/(admin)/admin-packs/page.tsx
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
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Percent,
  Star,
  Loader2,
  GripVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getPacks,
  createPack,
  updatePack,
  deletePack,
} from "@/lib/actions/pack.actions";
import type { Pack } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export default function AdminPacksPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: undefined as number | undefined,
    features: "",
    isPopular: false,
    isPromo: false,
    promoLabel: "",
    promoEndDate: "",
    isActive: true,
    order: 1,
  });

  // Charger les packs
  const loadPacks = async () => {
    setIsLoading(true);
    try {
      const data = await getPacks();
      setPacks(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des packs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les packs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
  }, []);

  const handleOpenDialog = (pack?: Pack) => {
    if (pack) {
      setEditingPack(pack);
      setFormData({
        name: pack.name,
        description: pack.description,
        price: pack.price,
        originalPrice: pack.originalPrice || undefined,
        features: pack.features.join("\n"),
        isPopular: pack.isPopular,
        isPromo: pack.isPromo,
        promoLabel: pack.promoLabel || "",
        promoEndDate: pack.promoEndDate
          ? new Date(pack.promoEndDate).toISOString().split("T")[0]
          : "",
        isActive: pack.isActive,
        order: pack.order,
      });
    } else {
      const maxOrder =
        packs.length > 0 ? Math.max(...packs.map((p) => p.order)) : 0;
      setEditingPack(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        originalPrice: undefined,
        features: "",
        isPopular: false,
        isPromo: false,
        promoLabel: "",
        promoEndDate: "",
        isActive: true,
        order: maxOrder + 1,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price <= 0
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const featuresArray = formData.features.split("\n").filter((f) => f.trim());
    if (featuresArray.length === 0) {
      toast({
        title: "Erreur",
        description: "Ajoutez au moins une fonctionnalité",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const packData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice,
        features: featuresArray,
        isPopular: formData.isPopular,
        isPromo: formData.isPromo,
        promoLabel: formData.promoLabel || undefined,
        promoEndDate: formData.promoEndDate || undefined,
        isActive: formData.isActive,
        order: formData.order,
      };

      if (editingPack) {
        await updatePack(editingPack.id, packData);
        toast({
          title: "Pack modifié",
          description: "Le pack a été mis à jour avec succès.",
        });
      } else {
        await createPack(packData);
        toast({
          title: "Pack créé",
          description: "Le nouveau pack a été ajouté avec succès.",
        });
      }
      setIsDialogOpen(false);
      await loadPacks();
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
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce pack ?")) {
      return;
    }

    try {
      await deletePack(id);
      toast({
        title: "Pack supprimé",
        description: "Le pack a été supprimé avec succès.",
        variant: "destructive",
      });
      await loadPacks();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le pack",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (pack: Pack) => {
    try {
      await updatePack(pack.id, { isActive: !pack.isActive });
      toast({
        title: "Statut mis à jour",
        description: `Le pack a été ${
          !pack.isActive ? "activé" : "désactivé"
        }.`,
      });
      await loadPacks();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      });
    }
  };

  const togglePopular = async (pack: Pack) => {
    try {
      await updatePack(pack.id, { isPopular: !pack.isPopular });
      toast({
        title: "Statut mis à jour",
        description: `Le pack a été ${
          !pack.isPopular ? "marqué comme populaire" : "retiré des populaires"
        }.`,
      });
      await loadPacks();
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
          <h1 className="text-3xl font-bold">Gestion des packs</h1>
          <p className="text-muted-foreground">
            Gérez les packs de services proposés
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau pack
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPack ? "Modifier le pack" : "Nouveau pack"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="required">
                    Nom du pack
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Pack Starter"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="required">
                    Prix (€)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Décrivez ce pack..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">
                    Prix original (pour promotion)
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features" className="required">
                  Fonctionnalités (une par ligne)
                </Label>
                <Textarea
                  id="features"
                  rows={5}
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="Site vitrine jusqu'à 5 pages&#10;Design responsive&#10;Formulaire de contact"
                  disabled={isSubmitting}
                />
              </div>

              {/* Promotion section */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-accent" />
                  <h4 className="font-medium">Promotion</h4>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPromo">Activer la promotion</Label>
                  <Switch
                    id="isPromo"
                    checked={formData.isPromo}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPromo: checked })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                {formData.isPromo && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="promoLabel">Label promotion</Label>
                        <Input
                          id="promoLabel"
                          placeholder="Ex: -15%, Offre limitée"
                          value={formData.promoLabel}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              promoLabel: e.target.value,
                            })
                          }
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promoEndDate">Date de fin</Label>
                        <Input
                          id="promoEndDate"
                          type="date"
                          value={formData.promoEndDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              promoEndDate: e.target.value,
                            })
                          }
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="isPopular">Marquer comme populaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Mis en avant sur le site
                  </p>
                </div>
                <Switch
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPopular: checked })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Pack actif</Label>
                  <p className="text-sm text-muted-foreground">
                    Visible sur le site
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
                {editingPack ? "Enregistrer" : "Créer"}
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
                <TableHead>Pack</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Fonctionnalités</TableHead>
                <TableHead>Statuts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packs.length > 0 ? (
                packs
                  .sort((a, b) => a.order - b.order)
                  .map((pack) => (
                    <TableRow key={pack.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <span className="font-mono">{pack.order}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{pack.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {pack.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {pack.price.toFixed(0)}€
                          </p>
                          {pack.originalPrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              {pack.originalPrice.toFixed(0)}€
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {pack.features.slice(0, 2).map((feature, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {feature.substring(0, 20)}
                              {feature.length > 20 ? "..." : ""}
                            </Badge>
                          ))}
                          {pack.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{pack.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={pack.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {pack.isActive ? "Actif" : "Inactif"}
                          </Badge>
                          {pack.isPopular && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Populaire
                            </Badge>
                          )}
                          {pack.isPromo && (
                            <Badge variant="destructive" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {pack.promoLabel || "Promo"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(pack)}
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePopular(pack)}
                            title={
                              pack.isPopular
                                ? "Retirer des populaires"
                                : "Marquer comme populaire"
                            }
                          >
                            <Star
                              className={`h-4 w-4 ${
                                pack.isPopular
                                  ? "fill-yellow-400 text-yellow-400"
                                  : ""
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleActive(pack)}
                            title={pack.isActive ? "Désactiver" : "Activer"}
                          >
                            <Switch
                              checked={pack.isActive}
                              className="h-4 w-4"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(pack.id)}
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
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Aucun pack trouvé</p>
                      <p className="text-sm text-muted-foreground">
                        Créez votre premier pack
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
