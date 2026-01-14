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
import { Skeleton } from "@/components/ui/skeleton";

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
    priceEUR: 0,
    originalPriceEUR: undefined as number | undefined,
    priceTND: 0,
    originalPriceTND: undefined as number | undefined,
    priceCFA: 0,
    originalPriceCFA: undefined as number | undefined,
    features: "",
    isPopular: false,
    isPromo: false,
    promoLabel: "",
    promoEndDate: "",
    isActive: true,
    order: 1,
  });

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
        priceEUR: pack.priceEUR || 0,
        originalPriceEUR: pack.originalPriceEUR || undefined,
        priceTND: pack.priceTND || 0,
        originalPriceTND: pack.originalPriceTND || undefined,
        priceCFA: pack.priceCFA || 0,
        originalPriceCFA: pack.originalPriceCFA || undefined,
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
      setEditingPack(null);
      setFormData({
        name: "",
        description: "",
        priceEUR: 0,
        originalPriceEUR: undefined,
        priceTND: 0,
        originalPriceTND: undefined,
        priceCFA: 0,
        originalPriceCFA: undefined,
        features: "",
        isPopular: false,
        isPromo: false,
        promoLabel: "",
        promoEndDate: "",
        isActive: true,
        order:
          packs.length > 0 ? Math.max(...packs.map((p) => p.order)) + 1 : 1,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.priceEUR <= 0
    ) {
      toast({
        title: "Erreur",
        description:
          "Veuillez remplir les champs obligatoires (Nom, Description et Prix EUR)",
        variant: "destructive",
      });
      return;
    }

    const featuresArray = formData.features.split("\n").filter((f) => f.trim());
    setIsSubmitting(true);

    try {
      const packData = {
        ...formData,
        features: featuresArray,
        promoEndDate: formData.promoEndDate
          ? new Date(formData.promoEndDate).toISOString()
          : null,
        promoLabel: formData.promoLabel || null,
        originalPriceEUR: formData.originalPriceEUR ?? null,
        originalPriceTND: formData.originalPriceTND ?? null,
        originalPriceCFA: formData.originalPriceCFA ?? null,
      };

      if (editingPack) {
        // @ts-ignore
        await updatePack(editingPack.id, packData);
        toast({
          title: "Pack modifié",
          description: "Le pack a été mis à jour.",
        });
      } else {
        // @ts-ignore
        await createPack(packData);
        toast({
          title: "Pack créé",
          description: "Le nouveau pack a été ajouté.",
        });
      }
      setIsDialogOpen(false);
      await loadPacks();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce pack ?")) return;
    try {
      await deletePack(id);
      toast({ title: "Pack supprimé", variant: "destructive" });
      await loadPacks();
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const toggleActive = async (pack: Pack) => {
    try {
      await updatePack(pack.id, { isActive: !pack.isActive });
      await loadPacks();
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const togglePopular = async (pack: Pack) => {
    try {
      await updatePack(pack.id, { isPopular: !pack.isPopular });
      await loadPacks();
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Titre et description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des packs tarifaires
        </h1>
        <p className="text-muted-foreground">
          Configurez vos offres commerciales avec des prix multi-devises et des
          promotions
        </p>
      </div>

      {/* En-tête avec bouton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {isLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : (
          <div className="hidden sm:block"></div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Nouveau pack
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPack ? "Modifier le pack" : "Nouveau pack"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Ordre d'affichage</Label>
                  <Input
                    id="order"
                    type="number"
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

              {/* Section Prix Multi-devises */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg bg-muted/20">
                <div className="space-y-2">
                  <Label className="required text-xs uppercase font-bold">
                    Prix EUR (€)
                  </Label>
                  <Input
                    type="number"
                    value={formData.priceEUR}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceEUR: parseFloat(e.target.value) || 0,
                      })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold">
                    Prix TND (DT)
                  </Label>
                  <Input
                    type="number"
                    value={formData.priceTND}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceTND: parseFloat(e.target.value) || 0,
                      })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold">
                    Prix CFA (FCFA)
                  </Label>
                  <Input
                    type="number"
                    value={formData.priceCFA}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceCFA: parseFloat(e.target.value) || 0,
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
                  rows={3}
                  disabled={isSubmitting}
                />
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
                    onCheckedChange={(c) =>
                      setFormData({ ...formData, isPromo: c })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                {formData.isPromo && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Original EUR</Label>
                      <Input
                        type="number"
                        value={formData.originalPriceEUR || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalPriceEUR: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Label</Label>
                      <Input
                        placeholder="Ex: -15%"
                        value={formData.promoLabel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            promoLabel: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Date fin</Label>
                      <Input
                        type="date"
                        value={formData.promoEndDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            promoEndDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label>Marquer comme populaire</Label>
                <Switch
                  checked={formData.isPopular}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, isPopular: c })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label>Pack actif (visible)</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, isActive: c })
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
                <TableHead>Prix (EUR/TND/CFA)</TableHead>
                <TableHead>Fonctionnalités</TableHead>
                <TableHead>Statuts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton loading pour le tableau
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-6" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        <Skeleton className="h-5 w-10 rounded-full" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : packs.length > 0 ? (
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
                          <p className="font-medium">{pack.priceEUR}€</p>
                          <p className="text-[10px] text-muted-foreground">
                            {pack.priceTND} DT / {pack.priceCFA} CFA
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {pack.features.slice(0, 2).map((f, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {f.substring(0, 15)}...
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant={pack.isActive ? "default" : "secondary"}
                          >
                            {pack.isActive ? "Actif" : "Inactif"}
                          </Badge>
                          {pack.isPopular && (
                            <Badge variant="outline">
                              <Star className="h-3 w-3 mr-1" /> Pop
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
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePopular(pack)}
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
                            className="text-red-600"
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
                        Créez votre premier pack tarifaire pour commencer
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
