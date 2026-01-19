// components/admin/blog/BlogFormContent.tsx
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
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Ex: Les meilleures pratiques de design en 2024"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) =>
              onFormDataChange({ ...formData, slug: e.target.value })
            }
            placeholder="meilleures-pratiques-design-2024"
          />
          <p className="text-xs text-muted-foreground">
            Doit être en minuscules avec des tirets (ex: mon-article-blog)
          </p>
        </div>
      </div>

      {/* Extrait et Auteur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="excerpt">Extrait *</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) =>
              onFormDataChange({ ...formData, excerpt: e.target.value })
            }
            placeholder="Court résumé de l'article (150-200 caractères)"
            rows={2}
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground">
            {formData.excerpt.length}/200 caractères
          </p>
        </div>
        <div className="space-y-2">
          <AuthorSelector
            value={formData.authorId}
            onAuthorChange={(authorId) =>
              onFormDataChange({ ...formData, authorId })
            }
            onNewAuthor={(author) => {
              // Mettre à jour la liste locale des auteurs
              if (!authors.find((a) => a.id === author.id)) {
                authors.push(author);
              }
            }}
          />
        </div>
      </div>

      {/* Catégorie et Temps de lecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              onFormDataChange({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="readTime">Temps de lecture (minutes) *</Label>
          <Input
            id="readTime"
            type="number"
            min="1"
            max="60"
            value={formData.readTime}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                readTime: parseInt(e.target.value),
              })
            }
            placeholder="Ex: 5"
          />
        </div>
      </div>

      {/* URL de l'image */}
      <div className="space-y-2">
        <Label htmlFor="image">URL de l'image *</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) =>
            onFormDataChange({ ...formData, image: e.target.value })
          }
          placeholder="https://images.unsplash.com/photo-..."
        />
        <p className="text-xs text-muted-foreground">
          Utilisez des images haute qualité (ratio 2:1 recommandé)
        </p>
      </div>

      {/* Contenu avec guide de formatage */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="content">Contenu *</Label>
          <div className="text-xs text-muted-foreground">Markdown supporté</div>
        </div>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            onFormDataChange({ ...formData, content: e.target.value })
          }
          placeholder={`# Titre principal
## Sous-titre
Paragraphe normal...

**Texte en gras** et *texte en italique*

### Liste à puces
- Élément 1
- Élément 2
- Élément 3

### Liste numérotée
1. Premier point
2. Deuxième point
3. Troisième point

> Citation importante

[Texte du lien](https://exemple.com)

\`\`\`
// Code avec syntax highlighting
const example = "Hello World";
\`\`\`

![Description de l'image](https://image-url.com)`}
          rows={12}
          className="font-mono text-sm"
        />
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Guide de formatage :</strong>
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <code># Titre</code> pour un titre principal (h1)
            </li>
            <li>
              <code>## Sous-titre</code> pour un sous-titre (h2)
            </li>
            <li>
              <code>- Élément</code> pour une liste à puces
            </li>
            <li>
              <code>1. Point</code> pour une liste numérotée
            </li>
            <li>
              <code>**gras**</code> et <code>*italique*</code> pour le formatage
            </li>
            <li>
              <code>&gt; Citation</code> pour une citation
            </li>
            <li>
              <code>[texte](url)</code> pour un lien
            </li>
            <li>
              <code>![alt](url)</code> pour une image
            </li>
            <li>
              <code>```code```</code> pour du code
            </li>
          </ul>
        </div>
      </div>

      {/* Table des matières */}
      <div className="space-y-2">
        <Label htmlFor="tableOfContents">Table des matières (optionnel)</Label>
        <Textarea
          id="tableOfContents"
          value={
            Array.isArray(formData.tableOfContents)
              ? formData.tableOfContents.join("\n")
              : formData.tableOfContents
          }
          onChange={(e) =>
            onFormDataChange({
              ...formData,
              tableOfContents: e.target.value
                .split("\n")
                .filter((line) => line.trim()),
            })
          }
          placeholder={`Organisez vos contacts
Maîtriser les discussions de groupe
Utiliser les fonctionnalités multimédias`}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Une ligne par titre de section (sera converti en tableau)
        </p>
      </div>
    </div>
  );
};

export default BlogFormContent;
