"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  Star,
  ToggleRight,
  GripVertical,
  Euro,
  Currency as CurrencyIcon,
  Coins,
  Search,
} from "lucide-react";
import type { Pack } from "@/types/pack";

interface PacksTableProps {
  packs: Pack[];
  isLoading: boolean;
  onEdit: (pack: Pack) => void;
  onDelete: (pack: Pack) => void;
  onToggleActive: (pack: Pack) => void;
  onTogglePopular: (pack: Pack) => void;
}

export function PacksTable({
  packs,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
  onTogglePopular,
}: PacksTableProps) {
  const formatPriceDisplay = (pack: Pack, currency: "EUR" | "TND" | "CFA") => {
    const price =
      currency === "EUR"
        ? pack.priceEUR
        : currency === "TND"
        ? pack.priceTND
        : pack.priceCFA;
    const originalPrice =
      currency === "EUR"
        ? pack.originalPriceEUR
        : currency === "TND"
        ? pack.originalPriceTND
        : pack.originalPriceCFA;

    const safePrice = price ?? 0;
    const safeOriginalPrice = originalPrice ?? 0;
    const hasPromo = safeOriginalPrice > 0 && safeOriginalPrice > safePrice;

    if (hasPromo) {
      return (
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground line-through">
            {safeOriginalPrice}
            {currency === "EUR" ? "€" : currency === "TND" ? "DT" : "CFA"}
          </span>
          <span className="font-medium text-green-600">
            {safePrice}
            {currency === "EUR" ? "€" : currency === "TND" ? "DT" : "CFA"}
          </span>
        </div>
      );
    }

    return (
      <span className="font-medium">
        {safePrice}
        {currency === "EUR" ? "€" : currency === "TND" ? "DT" : "CFA"}
      </span>
    );
  };

  const getPromoLabel = (pack: Pack, currency: "EUR" | "TND" | "CFA") => {
    if (!pack.promoLabel) return null;
    const labels = pack.promoLabel.split("|");
    const index = currency === "EUR" ? 0 : currency === "TND" ? 1 : 2;
    return labels[index] || null;
  };

  if (packs.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Aucun pack trouvé</h3>
              <p className="text-sm text-muted-foreground">
                Essayez de modifier vos critères de recherche ou créez un
                nouveau pack.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordre</TableHead>
              <TableHead>Pack</TableHead>
              <TableHead>Prix (EUR/TND/CFA)</TableHead>
              <TableHead>Promotions</TableHead>
              <TableHead>Fonctionnalités</TableHead>
              <TableHead>Statuts</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
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
              : packs
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
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Euro className="h-3 w-3 text-muted-foreground" />
                            {formatPriceDisplay(pack, "EUR")}
                          </div>
                          <div className="flex items-center gap-2">
                            <CurrencyIcon className="h-3 w-3 text-muted-foreground" />
                            {formatPriceDisplay(pack, "TND")}
                          </div>
                          <div className="flex items-center gap-2">
                            <Coins className="h-3 w-3 text-muted-foreground" />
                            {formatPriceDisplay(pack, "CFA")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getPromoLabel(pack, "EUR") && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              <Euro className="h-3 w-3 mr-1" />{" "}
                              {getPromoLabel(pack, "EUR")}
                            </Badge>
                          )}
                          {getPromoLabel(pack, "TND") && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              <CurrencyIcon className="h-3 w-3 mr-1" />{" "}
                              {getPromoLabel(pack, "TND")}
                            </Badge>
                          )}
                          {getPromoLabel(pack, "CFA") && (
                            <Badge
                              variant="outline"
                              className="bg-purple-50 text-purple-700 border-purple-200"
                            >
                              <Coins className="h-3 w-3 mr-1" />{" "}
                              {getPromoLabel(pack, "CFA")}
                            </Badge>
                          )}
                          {!getPromoLabel(pack, "EUR") &&
                            !getPromoLabel(pack, "TND") &&
                            !getPromoLabel(pack, "CFA") && (
                              <span className="text-xs text-muted-foreground">
                                Aucune promo
                              </span>
                            )}
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
                            onClick={() => onEdit(pack)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onTogglePopular(pack)}
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
                            onClick={() => onToggleActive(pack)}
                          >
                            <ToggleRight
                              className={`h-4 w-4 ${
                                pack.isActive
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(pack)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
