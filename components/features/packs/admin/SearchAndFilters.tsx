"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  popularityFilter: string;
  onPopularityFilterChange: (value: string) => void;
  currencyFilter: string;
  onCurrencyFilterChange: (value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  onStatusFilterChange,
  onPopularityFilterChange,
  onCurrencyFilterChange,
}: SearchAndFiltersProps) {
  return (
    <div className="flex items-center gap-8 space-y-4">
      {/* Filtres */}
      {/* <div className="flex items-center gap-2 p-2">
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs uniquement</SelectItem>
              <SelectItem value="inactive">Inactifs uniquement</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onPopularityFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Popularité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="popular">Populaires</SelectItem>
              <SelectItem value="not-popular">Non populaires</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onCurrencyFilterChange}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes devises</SelectItem>
              <SelectItem value="EUR">Euro (€)</SelectItem>
              <SelectItem value="TND">Dinar (DT)</SelectItem>
              <SelectItem value="CFA">CFA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      {/* Barre de recherche */}
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, description ou fonctionnalité..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 md:w-96"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
