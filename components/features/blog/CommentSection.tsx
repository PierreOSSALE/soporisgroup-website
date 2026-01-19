// components/features/blog/CommentSection.tsx
"use client";

import { useState } from "react";
import { MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { createComment } from "@/lib/actions/comment.actions";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  avatar?: string;
}

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
}

const CommentSection = ({
  postId,
  initialComments = [],
}: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un email valide",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Utiliser directement la Server Action
      await createComment({
        postId,
        author: name.trim(),
        email: email.trim(),
        content: content.trim(),
      });

      // Vider le formulaire
      setName("");
      setEmail("");
      setContent("");

      toast({
        title: "Commentaire envoyé",
        description:
          "Votre commentaire a été soumis et sera publié après modération.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le commentaire",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        Commentaires ({comments.length})
      </h2>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 bg-muted/30 rounded-xl p-6"
      >
        <h3 className="text-lg font-medium text-foreground mb-4">
          Laisser un commentaire
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />
          <Input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            required
          />
        </div>
        <Textarea
          placeholder="Votre commentaire..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4 min-h-30"
          maxLength={1000}
          required
        />
        <Button type="submit" disabled={isSubmitting} className="rounded-full">
          {isSubmitting ? "Envoi en cours..." : "Publier le commentaire"}
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Les commentaires sont modérés avant publication.
        </p>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 p-4 bg-card rounded-xl border border-border"
            >
              <Avatar className="w-10 h-10 shrink-0">
                {comment.avatar ? (
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">
                    {comment.author}
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {comment.createdAt}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
