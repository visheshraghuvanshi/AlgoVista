
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Frown, SearchSlash } from 'lucide-react'; // Using Frown as SearchSlash may not exist

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 py-12">
      <div className="text-center max-w-md">
        <Frown className="mx-auto h-24 w-24 text-primary dark:text-accent mb-8" />
        <h1 className="font-headline text-5xl sm:text-6xl font-bold text-primary dark:text-accent mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you&apos;re looking for doesn’t exist. It might have been moved, deleted, or you might have mistyped the URL.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
            <Link href="/">← Go Home</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary dark:border-accent dark:text-accent dark:hover:bg-accent/10 dark:hover:text-accent">
            <Link href="/visualizers">Try a Visualizer</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

