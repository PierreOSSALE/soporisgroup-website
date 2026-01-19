"use client";

import { useState } from "react";
import {
  Share2,
  LinkIcon,
  Copy,
  Check,
  MessageSquare,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  url?: string;
  title?: string;
  excerpt?: string;
}

const ShareButtons = ({
  url: initialUrl,
  title = "Check out this article",
  excerpt = "I found this interesting article and wanted to share it with you.",
}: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const currentUrl =
    initialUrl || (typeof window !== "undefined" ? window.location.href : "");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);

      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const shareOnWhatsApp = () => {
    const text = `${title}: ${currentUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const shareByEmail = () => {
    const subject = title;
    const body = `${excerpt}\n\n${currentUrl}`;
    const url = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const shareOnTwitter = () => {
    const text = `${title} ${currentUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">
          Partager avec vos amis
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="icon"
          className="h-9 w-9"
          onClick={shareOnWhatsApp}
          title="Partager sur WhatsApp"
        >
          <MessageSquare className="w-4 h-4" />
        </Button>

        <Button
          variant="default"
          size="icon"
          className="h-9 w-9"
          onClick={shareByEmail}
          title="Partager par email"
        >
          <Mail className="w-4 h-4" />
        </Button>

        <Button
          variant="default"
          size="icon"
          className="h-9 w-9"
          onClick={shareOnTwitter}
          title="Partager sur Twitter"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Button>

        <Button
          variant="default"
          size="icon"
          className="h-9 w-9"
          onClick={shareOnLinkedIn}
          title="Partager sur LinkedIn"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </Button>

        <Button
          variant="default"
          size="icon"
          className="h-9 w-9"
          onClick={handleCopyLink}
          title="Copier le lien"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <LinkIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
