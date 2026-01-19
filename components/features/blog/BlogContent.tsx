// components/blog/BlogContent.tsx
interface BlogContentProps {
  content: string;
}

const BlogContent = ({ content }: BlogContentProps) => {
  // Parse content into sections
  const sections = content.split(/(?=## )/g);

  return (
    <div className="blog-prose max-w-none">
      {sections.map((section, index) => {
        if (section.startsWith("## ")) {
          const lines = section.split("\n");
          const title = lines[0].replace("## ", "");
          const content = lines.slice(1).join("\n");

          return (
            <div key={index} id={title.toLowerCase().replace(/\s+/g, "-")}>
              <h2 className="text-2xl font-semibold mt-8 mb-4">{title}</h2>
              {content.split("\n").map((paragraph, pIndex) => {
                if (paragraph.startsWith("- ")) {
                  return (
                    <ul key={pIndex} className="list-disc ml-6 mb-3">
                      <li className="text-muted-foreground">
                        {paragraph.replace("- ", "")}
                      </li>
                    </ul>
                  );
                }
                if (paragraph.trim()) {
                  return (
                    <p
                      key={pIndex}
                      className="text-muted-foreground mb-4 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          );
        }

        return (
          <div key={index}>
            {section.split("\n").map((paragraph, pIndex) => {
              if (paragraph.trim()) {
                return (
                  <p
                    key={pIndex}
                    className="text-muted-foreground mb-4 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default BlogContent;
