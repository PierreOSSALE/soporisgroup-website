//
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  loading: boolean;
  lastExportInfo: string | null;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export default function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  loading,
  lastExportInfo,
  onExportCSV,
  onExportPDF,
}: SearchAndFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>
        {loading ? (
          <Skeleton className="h-10 w-40" />
        ) : (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmé</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      {loading ? (
        <div className="flex flex-col sm:flex-row items-end gap-2">
          <div className="hidden sm:block">
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-end gap-2">
          {/* {lastExportInfo && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              Dernier export: {lastExportInfo}
            </span>
          )} */}
        </div>
      )}
    </div>
  );
}
