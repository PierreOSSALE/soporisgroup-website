// app/(admin)/admin-packs/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getPacks,
  createPack,
  updatePack,
  deletePack,
} from "@/lib/actions/pack.actions";
import { PackForm } from "@/components/features/packs/admin/PackForm";
import { PacksTable } from "@/components/features/packs/admin/PacksTable";
import { DeleteDialog } from "@/components/features/packs/admin/DeleteDialog";
import { SearchAndFilters } from "@/components/features/packs/admin/SearchAndFilters";
import { Plus } from "lucide-react";
import type { Pack, PackFormData } from "@/types/pack";

export default function AdminPacksPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [filteredPacks, setFilteredPacks] = useState<Pack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [packToDelete, setPackToDelete] = useState<Pack | null>(null);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activePromoTab, setActivePromoTab] = useState<"EUR" | "TND" | "CFA">(
    "EUR"
  );

  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [popularityFilter, setPopularityFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");

  const { toast } = useToast();

  const [formData, setFormData] = useState<PackFormData>({
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
    isPromoEUR: false,
    isPromoTND: false,
    isPromoCFA: false,
    promoLabelEUR: "",
    promoLabelTND: "",
    promoLabelCFA: "",
    promoEndDateEUR: "",
    promoEndDateTND: "",
    promoEndDateCFA: "",
    isActive: true,
    order: 1,
  });

  const loadPacks = async () => {
    setIsLoading(true);
    try {
      const data = await getPacks();
      setPacks(data || []);
      setFilteredPacks(data || []);
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

  // Filtrer les packs en fonction des critères
  useEffect(() => {
    let result = [...packs];

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (pack) =>
          pack.name.toLowerCase().includes(query) ||
          pack.description.toLowerCase().includes(query) ||
          pack.features.some((feature) => feature.toLowerCase().includes(query))
      );
    }

    // Filtre par statut
    if (statusFilter === "active") {
      result = result.filter((pack) => pack.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter((pack) => !pack.isActive);
    }

    // Filtre par popularité
    if (popularityFilter === "popular") {
      result = result.filter((pack) => pack.isPopular);
    } else if (popularityFilter === "not-popular") {
      result = result.filter((pack) => !pack.isPopular);
    }

    // Filtre par devise (avec promotion)
    if (currencyFilter !== "all") {
      result = result.filter((pack) => {
        const hasPromoInCurrency = (currency: "EUR" | "TND" | "CFA") => {
          const originalPrice =
            currency === "EUR"
              ? pack.originalPriceEUR
              : currency === "TND"
              ? pack.originalPriceTND
              : pack.originalPriceCFA;

          const price =
            currency === "EUR"
              ? pack.priceEUR
              : currency === "TND"
              ? pack.priceTND
              : pack.priceCFA;

          return originalPrice && originalPrice > (price || 0);
        };

        if (currencyFilter === "EUR") return hasPromoInCurrency("EUR");
        if (currencyFilter === "TND") return hasPromoInCurrency("TND");
        if (currencyFilter === "CFA") return hasPromoInCurrency("CFA");
        return true;
      });
    }

    // Trier par ordre d'affichage
    result.sort((a, b) => a.order - b.order);

    setFilteredPacks(result);
  }, [packs, searchQuery, statusFilter, popularityFilter, currencyFilter]);

  // Compter les filtres actifs
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (statusFilter !== "all") count++;
    if (popularityFilter !== "all") count++;
    if (currencyFilter !== "all") count++;
    return count;
  }, [searchQuery, statusFilter, popularityFilter, currencyFilter]);

  const handleOpenDialog = (pack?: Pack) => {
    if (pack) {
      setEditingPack(pack);
      const promoLabels = pack.promoLabel
        ? pack.promoLabel.split("|")
        : ["", "", ""];

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
        isPromo: pack.isPromo || false,
        isPromoEUR: !!(
          pack.originalPriceEUR && pack.originalPriceEUR > (pack.priceEUR || 0)
        ),
        isPromoTND: !!(
          pack.originalPriceTND && pack.originalPriceTND > (pack.priceTND || 0)
        ),
        isPromoCFA: !!(
          pack.originalPriceCFA && pack.originalPriceCFA > (pack.priceCFA || 0)
        ),
        promoLabelEUR: promoLabels[0] || "",
        promoLabelTND: promoLabels[1] || "",
        promoLabelCFA: promoLabels[2] || "",
        promoEndDateEUR: pack.promoEndDate
          ? new Date(pack.promoEndDate).toISOString().split("T")[0]
          : "",
        promoEndDateTND: pack.promoEndDateTND
          ? new Date(pack.promoEndDateTND).toISOString().split("T")[0]
          : "",
        promoEndDateCFA: pack.promoEndDateCFA
          ? new Date(pack.promoEndDateCFA).toISOString().split("T")[0]
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
        isPromoEUR: false,
        isPromoTND: false,
        isPromoCFA: false,
        promoLabelEUR: "",
        promoLabelTND: "",
        promoLabelCFA: "",
        promoEndDateEUR: "",
        promoEndDateTND: "",
        promoEndDateCFA: "",
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
      const promoLabel = `${formData.promoLabelEUR || ""}|${
        formData.promoLabelTND || ""
      }|${formData.promoLabelCFA || ""}`;

      const packData = {
        ...formData,
        features: featuresArray,
        promoLabel: promoLabel,
        promoEndDate: formData.promoEndDateEUR
          ? new Date(formData.promoEndDateEUR).toISOString()
          : null,
        promoEndDateTND: formData.promoEndDateTND
          ? new Date(formData.promoEndDateTND).toISOString()
          : null,
        promoEndDateCFA: formData.promoEndDateCFA
          ? new Date(formData.promoEndDateCFA).toISOString()
          : null,
        originalPriceEUR: formData.isPromoEUR
          ? formData.originalPriceEUR || null
          : null,
        originalPriceTND: formData.isPromoTND
          ? formData.originalPriceTND || null
          : null,
        originalPriceCFA: formData.isPromoCFA
          ? formData.originalPriceCFA || null
          : null,
        isPromo:
          formData.isPromoEUR || formData.isPromoTND || formData.isPromoCFA,
      };

      if (editingPack) {
        await updatePack(editingPack.id, packData);
        toast({
          title: "Pack modifié",
          description: "Le pack a été mis à jour.",
        });
      } else {
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

  const handleDeleteClick = (pack: Pack) => {
    setPackToDelete(pack);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!packToDelete) return;

    setIsDeleting(true);
    try {
      await deletePack(packToDelete.id);
      toast({
        title: "Pack supprimé",
        description: `Le pack "${packToDelete.name}" a été supprimé avec succès.`,
        variant: "destructive",
      });
      await loadPacks();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le pack. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPackToDelete(null);
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

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPopularityFilter("all");
    setCurrencyFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des packs tarifaires
        </h1>
        <p className="text-muted-foreground">
          Configurez vos offres commerciales avec des prix multi-devises et des
          promotions
        </p>
      </div>

      {/* En-tête avec bouton et statistiques */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ">
        {/* Barre de recherche et filtres */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          popularityFilter={popularityFilter}
          onPopularityFilterChange={setPopularityFilter}
          currencyFilter={currencyFilter}
          onCurrencyFilterChange={setCurrencyFilter}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />{" "}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Nouveau pack
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPack ? "Modifier le pack" : "Nouveau pack"}
              </DialogTitle>
            </DialogHeader>
            <PackForm
              formData={formData}
              setFormData={setFormData}
              editingPack={editingPack}
              isSubmitting={isSubmitting}
              activePromoTab={activePromoTab}
              setActivePromoTab={setActivePromoTab}
            />
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

      <PacksTable
        packs={filteredPacks}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteClick}
        onToggleActive={toggleActive}
        onTogglePopular={togglePopular}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        packToDelete={packToDelete}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
