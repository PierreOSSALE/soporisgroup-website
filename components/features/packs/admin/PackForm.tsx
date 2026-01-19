"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Percent, Euro, Currency as CurrencyIcon, Coins } from "lucide-react";
import type { Pack, PackFormData } from "@/types/pack";

interface PackFormProps {
  formData: PackFormData;
  setFormData: (data: PackFormData) => void;
  editingPack: Pack | null;
  isSubmitting: boolean;
  activePromoTab: "EUR" | "TND" | "CFA";
  setActivePromoTab: (tab: "EUR" | "TND" | "CFA") => void;
}

export function PackForm({
  formData,
  setFormData,
  editingPack,
  isSubmitting,
  activePromoTab,
  setActivePromoTab,
}: PackFormProps) {
  // Helper functions pour accéder aux valeurs par devise
  const getPromoDateValue = (currency: "EUR" | "TND" | "CFA"): string => {
    switch (currency) {
      case "EUR":
        return formData.promoEndDateEUR;
      case "TND":
        return formData.promoEndDateTND;
      case "CFA":
        return formData.promoEndDateCFA;
    }
  };

  const getPromoLabelValue = (currency: "EUR" | "TND" | "CFA"): string => {
    switch (currency) {
      case "EUR":
        return formData.promoLabelEUR;
      case "TND":
        return formData.promoLabelTND;
      case "CFA":
        return formData.promoLabelCFA;
    }
  };

  const getOriginalPriceValue = (
    currency: "EUR" | "TND" | "CFA"
  ): number | undefined => {
    switch (currency) {
      case "EUR":
        return formData.originalPriceEUR;
      case "TND":
        return formData.originalPriceTND;
      case "CFA":
        return formData.originalPriceCFA;
    }
  };

  const getIsPromoValue = (currency: "EUR" | "TND" | "CFA"): boolean => {
    switch (currency) {
      case "EUR":
        return formData.isPromoEUR;
      case "TND":
        return formData.isPromoTND;
      case "CFA":
        return formData.isPromoCFA;
    }
  };

  const updateFormData = (updates: Partial<PackFormData>) => {
    setFormData({ ...formData, ...updates });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="required">
            Nom du pack
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
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
              updateFormData({ order: parseInt(e.target.value) || 1 })
            }
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg bg-muted/20">
        <div className="space-y-2">
          <Label className="required text-xs uppercase font-bold flex items-center gap-1">
            <Euro className="h-3 w-3" /> Prix EUR (€)
          </Label>
          <Input
            type="number"
            step="0.01"
            value={formData.priceEUR}
            onChange={(e) =>
              updateFormData({ priceEUR: parseFloat(e.target.value) || 0 })
            }
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase font-bold flex items-center gap-1">
            <CurrencyIcon className="h-3 w-3" /> Prix TND (DT)
          </Label>
          <Input
            type="number"
            step="0.01"
            value={formData.priceTND}
            onChange={(e) =>
              updateFormData({ priceTND: parseFloat(e.target.value) || 0 })
            }
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase font-bold flex items-center gap-1">
            <Coins className="h-3 w-3" /> Prix CFA (FCFA)
          </Label>
          <Input
            type="number"
            step="1"
            value={formData.priceCFA}
            onChange={(e) =>
              updateFormData({ priceCFA: parseFloat(e.target.value) || 0 })
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
          onChange={(e) => updateFormData({ description: e.target.value })}
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
          onChange={(e) => updateFormData({ features: e.target.value })}
          disabled={isSubmitting}
        />
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-accent" />
          <h4 className="font-medium">Promotions par devise</h4>
        </div>

        <Tabs
          value={activePromoTab}
          onValueChange={(v) => setActivePromoTab(v as "EUR" | "TND" | "CFA")}
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="EUR" className="flex items-center gap-1">
              <Euro className="h-3 w-3" /> EUR
            </TabsTrigger>
            <TabsTrigger value="TND" className="flex items-center gap-1">
              <CurrencyIcon className="h-3 w-3" /> TND
            </TabsTrigger>
            <TabsTrigger value="CFA" className="flex items-center gap-1">
              <Coins className="h-3 w-3" /> CFA
            </TabsTrigger>
          </TabsList>

          {(["EUR", "TND", "CFA"] as const).map((currency) => (
            <TabsContent
              key={currency}
              value={currency}
              className="space-y-4 pt-4"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor={`isPromo${currency}`}>
                  Activer la promotion pour {currency}
                </Label>
                <Switch
                  id={`isPromo${currency}`}
                  checked={getIsPromoValue(currency)}
                  onCheckedChange={(c) => {
                    const updates: Partial<PackFormData> = {};
                    switch (currency) {
                      case "EUR":
                        updates.isPromoEUR = c;
                        break;
                      case "TND":
                        updates.isPromoTND = c;
                        break;
                      case "CFA":
                        updates.isPromoCFA = c;
                        break;
                    }
                    updateFormData(updates);
                  }}
                  disabled={isSubmitting}
                />
              </div>

              {getIsPromoValue(currency) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">
                      Prix original (
                      {currency === "EUR"
                        ? "€"
                        : currency === "TND"
                        ? "DT"
                        : "CFA"}
                      )
                    </Label>
                    <Input
                      type="number"
                      step={currency === "CFA" ? "1" : "0.01"}
                      value={getOriginalPriceValue(currency) || ""}
                      onChange={(e) => {
                        const updates: Partial<PackFormData> = {};
                        const value = e.target.value
                          ? parseFloat(e.target.value)
                          : undefined;
                        switch (currency) {
                          case "EUR":
                            updates.originalPriceEUR = value;
                            break;
                          case "TND":
                            updates.originalPriceTND = value;
                            break;
                          case "CFA":
                            updates.originalPriceCFA = value;
                            break;
                        }
                        updateFormData(updates);
                      }}
                      placeholder="Prix avant réduction"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Label promotion</Label>
                    <Input
                      placeholder="Ex: -15%"
                      value={getPromoLabelValue(currency)}
                      onChange={(e) => {
                        const updates: Partial<PackFormData> = {};
                        switch (currency) {
                          case "EUR":
                            updates.promoLabelEUR = e.target.value;
                            break;
                          case "TND":
                            updates.promoLabelTND = e.target.value;
                            break;
                          case "CFA":
                            updates.promoLabelCFA = e.target.value;
                            break;
                        }
                        updateFormData(updates);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Date fin promotion</Label>
                    <Input
                      type="date"
                      value={getPromoDateValue(currency)}
                      onChange={(e) => {
                        const updates: Partial<PackFormData> = {};
                        switch (currency) {
                          case "EUR":
                            updates.promoEndDateEUR = e.target.value;
                            break;
                          case "TND":
                            updates.promoEndDateTND = e.target.value;
                            break;
                          case "CFA":
                            updates.promoEndDateCFA = e.target.value;
                            break;
                        }
                        updateFormData(updates);
                      }}
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="flex items-center justify-between p-3 border rounded-lg">
        <Label>Marquer comme populaire</Label>
        <Switch
          checked={formData.isPopular}
          onCheckedChange={(c) => updateFormData({ isPopular: c })}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center justify-between p-3 border rounded-lg">
        <Label>Pack actif (visible)</Label>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(c) => updateFormData({ isActive: c })}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
