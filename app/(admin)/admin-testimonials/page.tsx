// app/(admin)/admin-testimonials/page.tsx
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
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonials,
} from "@/lib/actions/testimonial.actions";
import { TestimonialInput } from "@/lib/schema/testimonial.schema";
import { Skeleton } from "@/components/ui/skeleton";

// Type basé sur votre schéma Zod
type Testimonial = {
  id: string;
  author: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(
    null
  );
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    author: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatar: "",
    isActive: true,
  });

  // Charger les témoignages
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les témoignages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        author: testimonial.author,
        role: testimonial.role,
        company: testimonial.company,
        content: testimonial.content,
        rating: testimonial.rating,
        avatar: testimonial.avatar || "",
        isActive: testimonial.isActive,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        author: "",
        role: "",
        company: "",
        content: "",
        rating: 5,
        avatar: "",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Préparer les données pour l'envoi
      const dataToSend: TestimonialInput = {
        ...formData,
        rating: Number(formData.rating), // S'assurer que c'est un nombre
        avatar: formData.avatar || undefined, // undefined si vide
      };

      if (editingTestimonial) {
        // Mise à jour
        await updateTestimonial(editingTestimonial.id, dataToSend);
        toast({
          title: "Succès",
          description: "Le témoignage a été mis à jour avec succès.",
        });
      } else {
        // Création
        await createTestimonial(dataToSend);
        toast({
          title: "Succès",
          description: "Le nouveau témoignage a été ajouté avec succès.",
        });
      }

      // Recharger les témoignages
      await loadTestimonials();
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
    setTestimonialToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!testimonialToDelete) return;

    try {
      await deleteTestimonial(testimonialToDelete);
      toast({
        title: "Succès",
        description: "Le témoignage a été supprimé avec succès.",
      });
      // Recharger les témoignages
      await loadTestimonials();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le témoignage",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateTestimonial(id, { isActive: !currentStatus });
      toast({
        title: "Succès",
        description: `Témoignage ${!currentStatus ? "activé" : "désactivé"}.`,
      });
      // Recharger les témoignages
      await loadTestimonials();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le statut",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Titre et description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des témoignages clients
        </h1>
        <p className="text-muted-foreground">
          Gérez les avis et témoignages de vos clients pour renforcer votre
          crédibilité
        </p>
      </div>

      {/* Bouton d'ajout */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau témoignage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial
                  ? "Modifier le témoignage"
                  : "Nouveau témoignage"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">
                    Entreprise <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Entreprise XYZ"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Rôle / Poste <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="CEO, Développeur..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">URL de l'avatar (optionnel)</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  Témoignage <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  rows={4}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Mon témoignage..."
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Note <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Note actuelle : {formData.rating}/5
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active">Témoignage actif</Label>
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                {editingTestimonial ? "Enregistrer" : "Créer"}
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
                <TableHead>Auteur</TableHead>
                <TableHead>Témoignage</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Actif</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton loading pour le tableau
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Skeleton
                            key={star}
                            className="h-4 w-4 rounded-full"
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-10 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : testimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        Aucun témoignage pour le moment.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Commencez par ajouter un premier témoignage client
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2 text-sm">
                        {testimonial.content}
                      </p>
                    </TableCell>
                    <TableCell>{renderStars(testimonial.rating)}</TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(testimonial.createdAt)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={testimonial.isActive}
                        onCheckedChange={() =>
                          toggleActive(testimonial.id, testimonial.isActive)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(testimonial)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(testimonial.id)}
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
            Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est
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
