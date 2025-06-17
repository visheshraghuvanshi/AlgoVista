
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 py-12">
      <div className="text-center max-w-md">
        <Frown className="mx-auto h-24 w-24 text-primary dark:text-accent mb-8" />
        <h1 className="font-headline text-6xl font-bold text-primary dark:text-accent mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-foreground/90 mb-4">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't seem to exist. It might have been moved, deleted, or you might have mistyped the URL.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
          <Link href="/">Go Back to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
