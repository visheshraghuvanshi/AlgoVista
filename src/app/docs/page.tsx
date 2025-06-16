
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            Documentation
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Coming Soon! Our comprehensive docs will guide you through AlgoVista's features and visualizations.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
