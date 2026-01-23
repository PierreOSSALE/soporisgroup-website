import React, { ReactNode, ReactElement, JSXElementConstructor } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Fonction pour échapper les balises HTML dans le texte normal
const escapeHtmlTagsInText = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

// Fonction pour générer un ID (identique à celle dans TableOfContents)
const generateId = (text: string): string => {
  // D'abord, échapper les balises pour éviter qu'elles ne perturbent la génération
  let cleanedText = text
    .replace(/<[^>]+>/g, "") // Supprimer les balises HTML
    .replace(/`([^`]+)`/g, "$1"); // Supprimer le code en ligne markdown

  return cleanedText
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Type pour les enfants React
type ReactChild = ReactNode | ReactNode[];

// Fonction helper pour extraire le texte des enfants React
const extractTextFromChildren = (children: ReactChild): string => {
  if (typeof children === "string") {
    return children;
  }

  if (typeof children === "number") {
    return children.toString();
  }

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }

  if (React.isValidElement(children)) {
    const element = children as ReactElement<
      any,
      string | JSXElementConstructor<any>
    >;
    if (element.props && element.props.children) {
      return extractTextFromChildren(element.props.children);
    }
  }

  return "";
};

// Composant pour échapper le texte dans les paragraphes et autres éléments de texte
const TextWithEscapedTags = ({ children }: { children: ReactChild }) => {
  const processNode = (node: ReactChild): ReactChild => {
    if (typeof node === "string") {
      // Échapper les balises HTML dans les chaînes de texte
      return escapeHtmlTagsInText(node);
    }

    if (typeof node === "number") {
      return node;
    }

    if (Array.isArray(node)) {
      return node.map(processNode);
    }

    if (React.isValidElement(node)) {
      const element = node as ReactElement<
        any,
        string | JSXElementConstructor<any>
      >;
      if (element.props && element.props.children) {
        return React.cloneElement(
          element,
          { ...element.props },
          processNode(element.props.children),
        );
      }
    }

    return node;
  };

  return <>{processNode(children)}</>;
};

const MarkdownRenderer = ({
  content,
  className = "",
}: MarkdownRendererProps) => {
  // Composants personnalisés pour ReactMarkdown
  const components = {
    h1: ({ node, children, ...props }: any) => {
      const text = extractTextFromChildren(children);
      const id = generateId(text);
      return (
        <h1
          id={id}
          className="text-4xl font-bold mt-10 mb-6 scroll-mt-32 relative group"
          {...props}
        >
          <a
            href={`#${id}`}
            className="absolute -left-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary text-xl"
            aria-hidden="true"
          >
            #
          </a>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }: any) => {
      const text = extractTextFromChildren(children);
      const id = generateId(text);
      return (
        <h2
          id={id}
          className="text-3xl font-bold mt-10 mb-4 text-foreground scroll-mt-32 relative group"
          {...props}
        >
          <a
            href={`#${id}`}
            className="absolute -left-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary text-lg"
            aria-hidden="true"
          >
            #
          </a>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      const text = extractTextFromChildren(children);
      const id = generateId(text);
      return (
        <h3
          id={id}
          className="text-2xl font-semibold mt-8 mb-3 scroll-mt-32 relative group"
          {...props}
        >
          <a
            href={`#${id}`}
            className="absolute -left-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
            aria-hidden="true"
          >
            #
          </a>
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }: any) => {
      const text = extractTextFromChildren(children);
      const id = generateId(text);
      return (
        <h4
          id={id}
          className="text-xl font-semibold mt-6 mb-2 scroll-mt-32 relative group"
          {...props}
        >
          <a
            href={`#${id}`}
            className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary text-sm"
            aria-hidden="true"
          >
            #
          </a>
          {children}
        </h4>
      );
    },
    // MODIFIER le composant p pour échapper les balises
    p: ({ node, children, ...props }: any) => (
      <p className="mb-6 leading-relaxed text-muted-foreground" {...props}>
        <TextWithEscapedTags>{children}</TextWithEscapedTags>
      </p>
    ),
    // MODIFIER le composant li pour échapper les balises
    li: ({ node, children, ...props }: any) => (
      <li className="text-muted-foreground" {...props}>
        <TextWithEscapedTags>{children}</TextWithEscapedTags>
      </li>
    ),
    // MODIFIER le composant blockquote pour échapper les balises
    blockquote: ({ node, children, ...props }: any) => (
      <blockquote
        className="border-l-4 border-primary pl-4 py-2 my-6 italic bg-muted/20"
        {...props}
      >
        <TextWithEscapedTags>{children}</TextWithEscapedTags>
      </blockquote>
    ),
    // MODIFIER le composant th pour échapper les balises
    th: ({ node, children, ...props }: any) => (
      <th
        className="border border-muted px-4 py-2 bg-muted/30 font-semibold"
        {...props}
      >
        <TextWithEscapedTags>{children}</TextWithEscapedTags>
      </th>
    ),
    // MODIFIER le composant td pour échapper les balises
    td: ({ node, children, ...props }: any) => (
      <td className="border border-muted px-4 py-2" {...props}>
        <TextWithEscapedTags>{children}</TextWithEscapedTags>
      </td>
    ),
    // Garder les autres composants inchangés
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc ml-6 mb-6 space-y-2" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal ml-6 mb-6 space-y-2" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <a
        className="text-primary hover:underline underline-offset-4"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");

      if (inline) {
        return (
          <code
            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }

      return !inline && match ? (
        <div className="my-6 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            style={atomDark}
            language={match[1]}
            PreTag="div"
            className="bg-gray-900! m-0!"
            customStyle={{
              padding: "1.5rem",
              fontSize: "0.875rem",
              borderRadius: "0.5rem",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono block p-4 my-4"
          {...props}
        >
          {children}
        </code>
      );
    },
    img: ({ node, ...props }: any) => (
      <div className="my-8 relative aspect-video">
        <OptimizedImage
          src={props.src}
          alt={props.alt || "Image"}
          fill
          className="w-full h-auto rounded-lg shadow-lg"
          sizes="(max-width: 768px) 100vw, 75vw"
        />
        {props.alt && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            {props.alt}
          </p>
        )}
      </div>
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse" {...props} />
      </div>
    ),
    hr: ({ node, ...props }: any) => (
      <hr className="my-8 border-muted" {...props} />
    ),
  };

  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
