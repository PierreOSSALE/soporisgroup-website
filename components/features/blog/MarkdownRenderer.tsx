// components/blog/MarkdownRenderer.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({
  content,
  className = "",
}: MarkdownRendererProps) => {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold mt-8 mb-6" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl font-bold mt-10 mb-4 text-foreground"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-semibold mt-8 mb-3" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-xl font-semibold mt-6 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p
              className="mb-4 leading-relaxed text-muted-foreground"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-muted-foreground" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 py-2 my-4 italic bg-muted/20"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
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
          img: ({ node, ...props }) => (
            <div className="my-8">
              <img
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
                {...props}
              />
              {props.alt && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {props.alt}
                </p>
              )}
            </div>
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-muted px-4 py-2 bg-muted/30 font-semibold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-muted px-4 py-2" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-muted" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
