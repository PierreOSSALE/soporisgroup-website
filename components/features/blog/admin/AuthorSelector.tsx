// components/admin/blog/AuthorSelector.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Check, X, Loader2 } from "lucide-react";
import { searchAuthors, getOrCreateAuthor } from "@/lib/actions/blog.actions";
import { useDebounce } from "@/hooks/use-debounce";

// Interface alignée avec Prisma
interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string | null; // Accepter null
}

interface AuthorSelectorProps {
  value: string;
  onAuthorChange: (authorId: string) => void;
  onNewAuthor?: (author: Author) => void;
  className?: string;
}

const AuthorSelector = ({
  value,
  onAuthorChange,
  onNewAuthor,
  className = "",
}: AuthorSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [newAuthorMode, setNewAuthorMode] = useState(false);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    avatar: "",
    bio: "",
  });
  const [creatingAuthor, setCreatingAuthor] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Recherche d'auteurs
  useEffect(() => {
    const searchAuthorsList = async () => {
      if (!debouncedSearch.trim()) {
        setAuthors([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchAuthors(debouncedSearch);
        // Convertir les résultats pour correspondre à l'interface Author
        const formattedResults = results.map((author: any) => ({
          ...author,
          bio: author.bio || null, // Assurer que bio est null si undefined
        }));
        setAuthors(formattedResults);
        setShowResults(true);
      } catch (error) {
        console.error("Erreur de recherche:", error);
      } finally {
        setLoading(false);
      }
    };

    searchAuthorsList();
  }, [debouncedSearch]);

  // Fermer les résultats quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAuthor = (author: Author) => {
    onAuthorChange(author.id);
    setSearchQuery(author.name);
    setShowResults(false);
  };

  const handleCreateAuthor = async () => {
    if (!newAuthor.name.trim()) return;

    setCreatingAuthor(true);
    try {
      const author = await getOrCreateAuthor({
        name: newAuthor.name,
        avatar:
          newAuthor.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            newAuthor.name,
          )}&background=3b82f6&color=fff`,
        bio: newAuthor.bio || undefined,
      });

      onAuthorChange(author.id);
      if (onNewAuthor) onNewAuthor(author);

      setSearchQuery(author.name);
      setNewAuthorMode(false);
      setNewAuthor({ name: "", avatar: "", bio: "" });
    } catch (error) {
      console.error("Erreur création auteur:", error);
    } finally {
      setCreatingAuthor(false);
    }
  };

  const generateAvatarUrl = () => {
    if (!newAuthor.name.trim()) return "";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      newAuthor.name,
    )}&background=3b82f6&color=fff&size=256`;
  };

  return (
    <div className={`space-y-3 ${className}`} ref={containerRef}>
      {!newAuthorMode ? (
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="author-search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setShowResults(true);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim() || authors.length > 0) {
                    setShowResults(true);
                  }
                }}
                placeholder="Rechercher ou créer un auteur..."
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setNewAuthorMode(true)}
              title="Créer un nouvel auteur"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>

          {/* Résultats de recherche */}
          {showResults && (loading || authors.length > 0) && (
            <div className="absolute z-50 mt-1 w-full bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Recherche...
                  </span>
                </div>
              ) : (
                <>
                  {authors.map((author) => (
                    <button
                      key={author.id}
                      type="button"
                      className="w-full flex items-center gap-3 p-3 hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                      onClick={() => handleSelectAuthor(author)}
                    >
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{author.name}</p>
                        {author.bio && (
                          <p className="text-xs text-muted-foreground truncate">
                            {author.bio}
                          </p>
                        )}
                      </div>
                      {value === author.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}

                  {/* Option pour créer un nouvel auteur */}
                  <div className="border-t">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 p-3 hover:bg-accent hover:text-accent-foreground transition-colors text-left text-primary"
                      onClick={() => setNewAuthorMode(true)}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserPlus className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Créer "{searchQuery}"</p>
                        <p className="text-xs text-muted-foreground">
                          Nouvel auteur
                        </p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Nouvel auteur</h4>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setNewAuthorMode(false);
                setNewAuthor({ name: "", avatar: "", bio: "" });
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="new-author-name">Nom *</Label>
              <Input
                id="new-author-name"
                value={newAuthor.name}
                onChange={(e) => {
                  setNewAuthor({ ...newAuthor, name: e.target.value });
                  if (!newAuthor.avatar) {
                    setNewAuthor((prev) => ({
                      ...prev,
                      name: e.target.value,
                      avatar: generateAvatarUrl(),
                    }));
                  }
                }}
                placeholder="Nom complet de l'auteur"
              />
            </div>

            <div>
              <Label htmlFor="new-author-avatar">Avatar (URL)</Label>
              <div className="flex gap-3">
                <Input
                  id="new-author-avatar"
                  value={newAuthor.avatar}
                  onChange={(e) =>
                    setNewAuthor({ ...newAuthor, avatar: e.target.value })
                  }
                  placeholder="https://exemple.com/avatar.jpg"
                  className="flex-1"
                />
                {newAuthor.avatar && (
                  <div className="w-10 h-10 rounded-full overflow-hidden border">
                    <img
                      src={newAuthor.avatar}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Laissez vide pour générer automatiquement
              </p>
            </div>

            <div>
              <Label htmlFor="new-author-bio">Biographie (optionnel)</Label>
              <Input
                id="new-author-bio"
                value={newAuthor.bio}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, bio: e.target.value })
                }
                placeholder="Rôle, spécialité, etc."
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNewAuthorMode(false);
                setNewAuthor({ name: "", avatar: "", bio: "" });
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleCreateAuthor}
              disabled={!newAuthor.name.trim() || creatingAuthor}
              className="flex-1"
            >
              {creatingAuthor ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Création...
                </>
              ) : (
                "Créer l'auteur"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Aperçu de l'auteur sélectionné */}
      {value && !newAuthorMode && (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
          {authors.find((a) => a.id === value) && (
            <>
              <img
                src={authors.find((a) => a.id === value)?.avatar}
                alt={authors.find((a) => a.id === value)?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">
                  {authors.find((a) => a.id === value)?.name}
                </p>
                {authors.find((a) => a.id === value)?.bio && (
                  <p className="text-sm text-muted-foreground">
                    {authors.find((a) => a.id === value)?.bio}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onAuthorChange("");
                  setSearchQuery("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthorSelector;
