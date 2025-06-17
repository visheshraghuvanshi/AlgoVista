
import { docsNavigation } from '@/app/docs/docs-navigation';
import { docsContentBySlug } from '@/lib/docs-content';
import { notFound } from 'next/navigation';
import { Callout } from '@/components/docs/Callout';
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
          h1: ({node, ...props}) => <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl mt-0 mb-8 pb-3 border-b border-border/70" {...props} />,
          h2: ({node, ...props}) => <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl mt-12 mb-6 pb-2 border-b border-border/60" {...props} />,
          h3: ({node, ...props}) => <h3 className="font-headline text-xl sm:text-2xl lg:text-3xl mt-10 mb-4" {...props} />,
          h4: ({node, ...props}) => <h4 className="font-semibold text-lg sm:text-xl mt-8 mb-2 text-foreground/90 dark:text-foreground/80" {...props} />,
          p: ({node, ...props}) => <p className="text-base leading-relaxed my-5 text-foreground/80 dark:text-foreground/70" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 my-5 space-y-2 text-foreground/80 dark:text-foreground/70" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-5 space-y-2 text-foreground/80 dark:text-foreground/70" {...props} />,
          li: ({node, ...props}) => <li className="mb-1.5" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="pl-4 italic border-l-4 border-primary/50 dark:border-accent/50 my-6 text-muted-foreground bg-muted/20 dark:bg-muted/10 py-2" {...props} />,
          code({node, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                style={oneDark} // oneDark is good for a modern, minimal feel.
                language={match[1]}
                PreTag="div"
                className="rounded-lg my-6 text-sm !bg-zinc-900 dark:!bg-zinc-800 shadow-md" // Custom background
                customStyle={{padding: '1rem'}}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="px-1.5 py-0.5 bg-muted dark:bg-muted/40 rounded font-code text-sm text-primary/90 dark:text-accent/90" {...props}>
                {children}
              </code>
            )
          },
          a: ({ node, ...props }) => (
            <a className="text-primary dark:text-accent hover:underline underline-offset-2 font-medium" {...props} />
          ),
          hr: ({node, ...props}) => <hr className="my-8 border-border/50" {...props} />,
        }}
        remarkPlugins={[remarkGfm]}
      >
        {/* Title is now part of the main content, rendered by h1 mapping above */}
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
