
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BookOpen, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Documentation
          </h1>
          <p className="mt-6 text-xl text-muted-foreground mb-8">
            Our comprehensive documentation is currently under construction. We're working hard to provide you with detailed guides, API references, and tutorials to help you get the most out of AlgoVista.
          </p>
          <div className="space-y-4">
            <h2 className="font-headline text-2xl font-semibold text-primary dark:text-accent">What to Expect:</h2>
            <ul className="list-disc list-inside text-lg text-muted-foreground text-left max-w-md mx-auto space-y-2">
              <li>Guides on using each algorithm visualizer.</li>
              <li>Explanations of visualization features and controls.</li>
              <li>Information on how to contribute to AlgoVista.</li>
              <li>Technical details for developers.</li>
            </ul>
          </div>
          <p className="mt-10 text-lg text-muted-foreground">
            Please check back soon! In the meantime, you can explore the visualizers directly.
          </p>
          <Button asChild size="lg" className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
            <Link href="/visualizers">
              Explore Visualizers
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
