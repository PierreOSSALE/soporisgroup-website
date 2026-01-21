// components/features/appointment/assistant/ScrollToTopButton.tsx
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ScrollToTopButtonProps {
  isAtBottom: boolean;
  onClick: () => void;
}

export default function ScrollToTopButton({
  isAtBottom,
  onClick,
}: ScrollToTopButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50"
      size="icon"
    >
      {isAtBottom ? (
        <ArrowUp className="h-5 w-5" />
      ) : (
        <ArrowDown className="h-5 w-5" />
      )}
    </Button>
  );
}
