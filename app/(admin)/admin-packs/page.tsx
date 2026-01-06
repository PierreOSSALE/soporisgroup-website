//app/(admin)/admin-packs/page.tsx
"use client";

import { useState } from "react";
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
import { Plus, Pencil, Trash2, Tag, Percent } from "lucide-react";
import { mockPacks, AdminPack } from "@/components/data/mockAdminData";
import { useToast } from "@/hooks/use-toast";

export default function AdminPacks() {
  const [packs, setPacks] = useState<AdminPack[]>(mockPacks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<AdminPack | null>(null);
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
  });

  const handleOpenDialog = (pack?: AdminPack) => {
    if (pack) {
      setEditingPack(pack);
      setFormData({
        name: pack.name,
        description: pack.description,
        price: pack.price,
        originalPrice: pack.originalPrice,
        features: pack.features.join("\n"),
        isPopular: pack.isPopular,
        isPromo: pack.isPromo,
        promoLabel: pack.promoLabel || "",
        promoEndDate: pack.promoEndDate || "",
        isActive: pack.isActive,
      });
    } else {
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
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const packData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      originalPrice: formData.originalPrice,
      features: formData.features.split("\n").filter((f) => f.trim()),
      isPopular: formData.isPopular,
      isPromo: formData.isPromo,
      promoLabel: formData.promoLabel || undefined,
      promoEndDate: formData.promoEndDate || undefined,
      isActive: formData.isActive,
    };

    if (editingPack) {
      setPacks(
        packs.map((p) => (p.id === editingPack.id ? { ...p, ...packData } : p))
      );
      toast({
        title: "Pack modifié",
        description: "Le pack a été mis à jour avec succès.",
      });
    } else {
      const newPack: AdminPack = {
        id: Date.now().toString(),
        ...packData,
      };
      setPacks([...packs, newPack]);
      toast({
        title: "Pack créé",
        description: "Le nouveau pack a été ajouté avec succès.",
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setPacks(packs.filter((p) => p.id !== id));
    toast({
      title: "Pack supprimé",
      description: "Le pack a été supprimé avec succès.",
      variant: "destructive",
    });
  };

  const toggleActive = (id: string) => {
    setPacks(
      packs.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-end">
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
                    <Label htmlFor="name">Nom du pack</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseInt(e.target.value),
                        })
                      }
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features">
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
                    />
                  </div>
                  {formData.isPromo && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Prix original (€)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          value={formData.originalPrice || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              originalPrice: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promoLabel">Label promo</Label>
                        <Input
                          id="promoLabel"
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
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isPopular">Marquer comme populaire</Label>
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPopular: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Pack actif</Label>
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
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
                  {editingPack ? "Enregistrer" : "Créer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pack</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Promo</TableHead>
                  <TableHead>Populaire</TableHead>
                  <TableHead>Actif</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packs.map((pack) => (
                  <TableRow key={pack.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{pack.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pack.features.length} fonctionnalités
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold">{pack.price}€</span>
                        {pack.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {pack.originalPrice}€
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {pack.isPromo && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
                          <Tag className="h-3 w-3" />
                          {pack.promoLabel}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {pack.isPopular && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                          Populaire
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={pack.isActive}
                        onCheckedChange={() => toggleActive(pack.id)}
                      />
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
                          onClick={() => handleDelete(pack.id)}
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
      </div>
    </>
  );
}
