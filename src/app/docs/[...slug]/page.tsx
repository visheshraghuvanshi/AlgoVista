
import { docsNavigation } from '@/app/docs/docs-navigation';
import { docsContentBySlug } from '@/lib/docs-content';
import { notFound } from 'next/navigation';
import { Callout } from '@/components/docs/Callout'; // Import Callout
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// @ts-ignore Pkg has no types for this specific import path
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore Pkg has no types for this specific import path
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


// Function to recursively get all hrefs from the navigation structure
function getAllHrefs(navItems: typeof docsNavigation): string[] {
  let hrefs: string[] = [];
  navItems.forEach(item => {
    if (item.href) {
      hrefs.push(item.href);
    }
    if (item.children) {
      hrefs = hrefs.concat(getAllHrefs(item.children));
    }
  });
  return hrefs;
}

export async function generateStaticParams() {
  const allHrefs = getAllHrefs(docsNavigation);
  const validSlugs = Object.keys(docsContentBySlug);

  return allHrefs
    .filter(href => href.startsWith('/docs/')) 
    .map(href => href.substring('/docs/'.length)) 
    .filter(slug => validSlugs.includes(slug)) 
    .map(slugString => ({
      slug: slugString.split('/'),
    }));
}

interface DocsPageProps {
  params: {
    slug: string[];
  };
}

export default async function DocPage({ params }: DocsPageProps) {
  const slug = params.slug.join('/');
  const docContent = docsContentBySlug[slug];

  if (!docContent) {
    notFound();
  }
  
  const title = docContent.title || "Documentation";
  const markdown = docContent.content || "Content not found.";

  return (
    <article>
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl mt-8 mb-4 pb-2 border-b border-border" {...props} />,
          h2: ({node, ...props}) => <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl mt-10 mb-3 pb-1.5 border-b border-border" {...props} />,
          h3: ({node, ...props}) => <h3 className="font-headline text-xl sm:text-2xl lg:text-3xl mt-8 mb-2" {...props} />,
          h4: ({node, ...props}) => <h4 className="font-semibold text-lg mt-6 mb-1" {...props} />,
          p: ({node, ...props}) => <p className="my-4 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4 space-y-1" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="pl-4 italic border-l-4 border-border my-4 text-muted-foreground" {...props} />,
          code({node, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4 text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="px-1 py-0.5 bg-muted rounded font-code text-sm text-primary dark:text-accent" {...props}>
                {children}
              </code>
            )
          },
          a: ({ node, ...props }) => (
            <a className="text-primary dark:text-accent hover:underline" {...props} />
          ),
          // This setup does not automatically parse custom markdown for Callouts.
          // If you use MDX files (.mdx), you can import and use the Callout component directly in your content.
          // For now, with string markdown, callouts would need to be manually styled or parsed.
        }}
        remarkPlugins={[remarkGfm]} // For GitHub Flavored Markdown (tables, strikethrough, etc.)
      >
        {`# ${title}\n\n${markdown}`}
      </ReactMarkdown>
    </article>
  );
}

export async function generateMetadata({ params }: DocsPageProps) {
  const slug = params.slug.join('/');
  const docContent = docsContentBySlug[slug];
  const title = docContent?.title || "Docs";
  return {
    title: `${title} | AlgoVista Docs`,
  };
}

// Delete the old src/app/docs/page.tsx as it's replaced by layout and [...slug]/page.tsx
// This command assumes the file exists and will be handled by the system.
// If it doesn't exist or you want manual control, remove this line.
// delete: src/app/docs/page.tsx 
// Actually, I'll modify it to redirect instead of deleting.
