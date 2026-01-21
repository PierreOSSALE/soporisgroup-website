// components/admin/blog/BlogFormContent.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthorSelector from "./AuthorSelector";

interface BlogFormContentProps {
  formData: any;
  onFormDataChange: (data: any) => void;
  onTitleChange: (title: string) => void;
  authors: any[];
  categories: string[];
}

const BlogFormContent = ({
  formData,
  onFormDataChange,
  onTitleChange,
  authors,
  categories,
}: BlogFormContentProps) => {
  return (
    <div className="grid gap-4 py-4">
      {/* Titre et Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Titre de l'article *
            <span className="text-muted-foreground text-xs font-normal ml-2">
              (50-70 caractères recommandé)
            </span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Ex: Les 10 meilleures pratiques de développement web en 2024"
            className="font-medium"
          />
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Doit être accrocheur et descriptif</span>
            <span>{formData.title.length}/70 caractères</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">
            URL de l'article (Slug) *
            <span className="text-muted-foreground text-xs font-normal ml-2">
              (Partie visible dans l'adresse)
            </span>
          </Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) =>
              onFormDataChange({ ...formData, slug: e.target.value })
            }
            placeholder="meilleures-pratiques-developpement-web-2024"
            className="font-mono text-sm"
          />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>✓ Utilisez des mots-clés principaux</p>
            <p>✓ Format : minuscules-separées-par-des-tirets</p>
            <p>✗ Évitez les accents et caractères spéciaux</p>
            <p>
              Exemple d'URL générée :{" "}
              <code className="text-primary">
                https://votredomaine.com/blog/{formData.slug || "votre-url"}
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Extrait et Auteur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="excerpt">
            Extrait / Description *
            <span className="text-muted-foreground text-xs font-normal ml-2">
              (Affiché dans les listes d'articles)
            </span>
          </Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) =>
              onFormDataChange({ ...formData, excerpt: e.target.value })
            }
            placeholder="Découvrez les 10 meilleures pratiques de développement web essentielles pour 2024. Apprenez comment optimiser vos projets, améliorer les performances et suivre les dernières tendances du secteur. Parfait pour les développeurs débutants et expérimentés."
            rows={3}
            maxLength={300}
            className="text-sm leading-relaxed"
          />
          <div className="text-xs text-muted-foreground flex justify-between items-center">
            <div>
              <span className="font-medium">Conseils :</span>
              <ul className="list-disc pl-4 mt-1">
                <li>Commencer par l'avantage principal</li>
                <li>Inclure 1-2 mots-clés importants</li>
                <li>Terminer par une promesse de valeur</li>
              </ul>
            </div>
            <div className="text-right">
              <div
                className={`font-medium ${formData.excerpt.length > 250 ? "text-amber-600" : "text-muted-foreground"}`}
              >
                {formData.excerpt.length}/300 caractères
              </div>
              <div className="text-[10px] mt-1">
                {formData.excerpt.length < 150
                  ? "⚠️ Trop court"
                  : formData.excerpt.length > 250
                    ? "⚠️ Proche de la limite"
                    : "✓ Longueur optimale"}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">
            Auteur *
            <span className="text-muted-foreground text-xs font-normal ml-2">
              (Qui a écrit cet article ?)
            </span>
          </Label>
          <AuthorSelector
            value={formData.authorId}
            onAuthorChange={(authorId) =>
              onFormDataChange({ ...formData, authorId })
            }
            onNewAuthor={(author) => {
              if (!authors.find((a) => a.id === author.id)) {
                authors.push(author);
              }
            }}
          />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>✓ Sélectionnez un auteur existant dans la liste</p>
            <p>✓ Ou créez un nouvel auteur avec le bouton "+"</p>
            <p>✗ Les articles sans auteur ne peuvent pas être publiés</p>
          </div>
        </div>
      </div>

      {/* Catégorie et Temps de lecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">
            Catégorie *
            <span className="text-muted-foreground text-xs font-normal ml-2">
              (Où classer cet article ?)
            </span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              onFormDataChange({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisissez une catégorie..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Les catégories disponibles :</p>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>
                <span className="font-medium">Développement Web</span> -
                Articles techniques, tutoriels code
              </li>
              <li>
                <span className="font-medium">Design UI/UX</span> - Design
                d'interface, expérience utilisateur
              </li>
              <li>
                <span className="font-medium">Marketing Digital</span> - SEO,
                réseaux sociaux, stratégie
              </li>
              <li>
                <span className="font-medium">Business</span> - Stratégie
                entreprise, productivité
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="readTime">
            Temps de lecture estimé *
            <span className="text-muted-foreground text-xs font-normal ml-2">
              (Affiché aux lecteurs)
            </span>
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="readTime"
              type="number"
              min="1"
              max="60"
              value={formData.readTime}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  readTime: parseInt(e.target.value) || 5,
                })
              }
              placeholder="Ex: 8"
              className="w-24"
            />
            <div className="text-sm">minutes</div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Guide d'estimation :</p>
            <ul className="list-disc pl-4">
              <li>
                <span className="font-medium">1-3 min</span> : Article très
                court (300-500 mots)
              </li>
              <li>
                <span className="font-medium">4-8 min</span> : Article moyen
                (500-1500 mots)
              </li>
              <li>
                <span className="font-medium">9-15 min</span> : Article long
                (1500-2500 mots)
              </li>
              <li>
                <span className="font-medium">15+ min</span> : Guide complet
                (2500+ mots)
              </li>
            </ul>
            <p className="mt-2">
              💡 Estimation automatique :{" "}
              {Math.ceil(formData.content.split(" ").length / 200)} min
            </p>
          </div>
        </div>
      </div>

      {/* URL de l'image principale */}
      <div className="space-y-2">
        <Label htmlFor="image">
          Image principale de l'article *
          <span className="text-muted-foreground text-xs font-normal ml-2">
            (L'image d'en-tête qui attire l'attention)
          </span>
        </Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) =>
            onFormDataChange({ ...formData, image: e.target.value })
          }
          placeholder="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop"
          className="font-mono text-sm"
        />
        <div className="text-xs text-muted-foreground space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border rounded p-2">
              <p className="font-medium text-green-600">✓ Recommandations :</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Ratio 2:1 (ex: 1200×600px)</li>
                <li>Haute qualité (min 800px large)</li>
                <li>Images libres de droits</li>
              </ul>
            </div>
            <div className="border rounded p-2">
              <p className="font-medium text-blue-600">
                🌐 Sources recommandées :
              </p>
              <ul className="list-disc pl-4 mt-1">
                <li>Unsplash (gratuit)</li>
                <li>Pexels (gratuit)</li>
                <li>Pixabay (gratuit)</li>
                <li>Shutterstock (payant)</li>
              </ul>
            </div>
            <div className="border rounded p-2">
              <p className="font-medium text-amber-600">⚠️ À éviter :</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Images pixellisées</li>
                <li>Logos/marques protégées</li>
                <li>Visages non autorisés</li>
                <li>Images lourdes (500KB)</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2 mt-2">
            <p className="font-medium text-blue-700 dark:text-blue-300">
              💡 Astuce rapide :
            </p>
            <p>
              Utilisez{" "}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                https://unsplash.com/fr/s/photos/
                {formData.category
                  ? formData.category.toLowerCase().replace(" ", "-")
                  : "technology"}
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Contenu avec guide de formatage complet */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="content" className="text-base">
            Contenu de l'article *
            <span className="text-muted-foreground text-xs font-normal ml-2">
              (Le cœur de votre article - utilisez le formatage ci-dessous)
            </span>
          </Label>
          <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            📝 Markdown activé
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 border-b flex justify-between items-center">
            <div className="text-sm font-medium">Éditeur de contenu</div>
            <div className="text-xs text-muted-foreground">
              {formData.content.split(" ").length} mots •{" "}
              {Math.ceil(formData.content.length / 1000)}KB
            </div>
          </div>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              onFormDataChange({ ...formData, content: e.target.value })
            }
            placeholder={`# Titre principal de l'article (H1)

Bienvenue dans cet article complet sur [votre sujet]. Cette introduction devrait captiver l'attention du lecteur en présentant le problème que vous allez résoudre ou la valeur que vous allez apporter.

## Pourquoi ce sujet est important aujourd'hui ? (H2)

Expliquez ici pourquoi ce sujet est d'actualité et pertinent pour votre audience. 
**Utilisez du texte en gras** pour mettre en valeur les points clés et *de l'italique* pour les termes techniques ou les citations.

### Les avantages principaux (H3)

- ✅ **Avantage 1** : Description détaillée du premier avantage
- 🚀 **Avantage 2** : Description du deuxième avantage avec des détails concrets
- 💡 **Avantage 3** : Troisième avantage avec des exemples pratiques

### Guide étape par étape (H3)

1. **Première étape** : Commencez par expliquer la première action à prendre
2. **Deuxième étape** : Détaillez la deuxième étape avec des conseils pratiques
3. **Troisième étape** : Terminez avec la dernière étape et les résultats attendus

## Section technique détaillée (H2)

Pour les parties techniques, utilisez des blocs de code :

\`\`\`javascript
// Exemple de code JavaScript
function calculerTVA(prixHT) {
  const tauxTVA = 0.20;
  return prixHT * (1 + tauxTVA);
}
\`\`\`

### Bonnes pratiques à suivre (H3)

> **Citation importante** : "Le succès n'est pas final, l'échec n'est pas fatal, c'est le courage de continuer qui compte." - Winston Churchill

## Conclusion (H2)

Récapitulez les points principaux de l'article et donnez un appel à l'action clair.

### Ressources supplémentaires (H3)

- [Lien vers une ressource externe](https://exemple.com/ressource-utile)
- [Documentation officielle](https://docs.exemple.com)
- [Outils recommandés](https://outils.exemple.com)

![Description alternative de l'image](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop)`}
            rows={20}
            className="font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none"
          />
        </div>

        {/* Guide de formatage complet */}
        <div className="border rounded-lg p-4 bg-muted/20">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              ?
            </span>
            Guide complet du formatage Markdown
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Colonne 1 : Titres et texte */}
            <div className="space-y-3">
              <div>
                <p className="font-medium mb-1">🏷️ Titres (hiérarchie)</p>
                <div className="space-y-1 pl-2">
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      # Titre principal
                    </code>
                    <span className="text-muted-foreground">
                      → H1 (1 seul par article)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      ## Section
                    </code>
                    <span className="text-muted-foreground">
                      → H2 (sections principales)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      ### Sous-section
                    </code>
                    <span className="text-muted-foreground">
                      → H3 (détails)
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-muted">
                <p className="font-medium text-xs mb-1">
                  ℹ️ Affichage des balises HTML :
                </p>
                <p className="text-xs text-muted-foreground">
                  Pour afficher des balises comme texte (ex:{" "}
                  <code>&lt;h2&gt;</code>, <code>&lt;title&gt;</code>), elles
                  seront automatiquement échappées et affichées correctement.
                  Pas besoin de les mettre dans des backticks.
                </p>
              </div>

              <div>
                <p className="font-medium mb-1">📝 Formatage de texte</p>
                <div className="space-y-1 pl-2">
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      **texte en gras**
                    </code>
                    <span className="text-muted-foreground">
                      → <strong>texte en gras</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      *texte en italique*
                    </code>
                    <span className="text-muted-foreground">
                      → <em>texte en italique</em>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      ~~texte barré~~
                    </code>
                    <span className="text-muted-foreground">
                      → <s>texte barré</s>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-1">💬 Citations</p>
                <div className="space-y-1 pl-2">
                  <code className="bg-muted px-2 py-1 rounded text-xs block">
                    &gt; Citation importante
                  </code>
                  <div className="text-muted-foreground pl-2 border-l-2 border-primary">
                    <blockquote className="italic">
                      Citation importante
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2 : Listes et éléments spéciaux */}
            <div className="space-y-3">
              <div>
                <p className="font-medium mb-1">📋 Listes</p>
                <div className="space-y-1 pl-2">
                  <div className="flex items-start gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs whitespace-nowrap">
                      - Élément de liste
                    </code>
                    <span className="text-muted-foreground">
                      → Liste à puces
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs whitespace-nowrap">
                      1. Premier point
                    </code>
                    <span className="text-muted-foreground">
                      → Liste numérotée
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs whitespace-nowrap">
                      - [ ] Case à cocher
                    </code>
                    <span className="text-muted-foreground">
                      → Checklist interactive
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-1">🔗 Liens et images</p>
                <div className="space-y-1 pl-2">
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      [texte](https://lien.com)
                    </code>
                    <span className="text-muted-foreground">
                      → Lien cliquable
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      ![alt](https://image.com)
                    </code>
                    <span className="text-muted-foreground">
                      → Image avec description
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-1">💻 Code et syntaxe</p>
                <div className="space-y-1 pl-2">
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      `code en ligne`
                    </code>
                    <span className="text-muted-foreground">
                      → Code dans le texte
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs whitespace-pre">
                      ```javascript\ncode\n```
                    </code>
                    <span className="text-muted-foreground">
                      → Bloc de code avec coloration
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-1">📊 Tableaux</p>
                <div className="space-y-1 pl-2">
                  <code className="bg-muted px-2 py-1 rounded text-xs block whitespace-pre">
                    {`| Colonne 1 | Colonne 2 |
|----------|----------|
| Donnée 1 | Donnée 2 |`}
                  </code>
                  <span className="text-muted-foreground">
                    → Tableau formaté
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-muted">
            <p className="font-medium text-xs mb-2">
              🎯 Conseils de rédaction :
            </p>
            <ul className="list-disc pl-4 text-xs space-y-1 text-muted-foreground">
              <li>Commencez chaque section par une phrase d'introduction</li>
              <li>Utilisez des sous-titres tous les 2-3 paragraphes</li>
              <li>Ajoutez des exemples concrets et des chiffres</li>
              <li>Terminez par un résumé et un appel à l'action</li>
              <li>Vérifiez l'orthographe et la grammaire</li>
              <li>Optimisez pour le référencement (SEO) avec des mots-clés</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Note sur la table des matières automatique */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full p-2">
            🔍
          </div>
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-300">
              Table des matières automatique
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              La table des matières est générée automatiquement à partir des
              titres (H2 et H3) de votre article. Vous n'avez rien à configurer
              ! Elle apparaîtra automatiquement dans la barre latérale de
              l'article.
            </p>
            <ul className="list-disc pl-4 mt-2 text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <li>
                Les titres{" "}
                <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                  ## Section
                </code>{" "}
                deviendront des entrées principales
              </li>
              <li>
                Les sous-titres{" "}
                <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                  ### Sous-section
                </code>{" "}
                seront indentés
              </li>
              <li>Les lecteurs pourront cliquer pour naviguer rapidement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogFormContent;
