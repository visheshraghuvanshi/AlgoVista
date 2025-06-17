
"use client"; // Error components must be Client Components

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AlgoVista - Error</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
        <style>
          {`
            body {
              font-family: Inter, sans-serif;
              min-height: 100vh;
              background-color: hsl(var(--background)); 
              color: hsl(var(--foreground)); 
              display: flex;
              flex-direction: column;
            }
            .font-headline { font-family: 'Space Grotesk', sans-serif; }
            .font-code { font-family: 'Source Code Pro', monospace; }
            .text-primary { color: hsl(var(--primary)); }
            .dark .text-accent { color: hsl(var(--accent)); }
            .text-destructive { color: hsl(var(--destructive)); }
            .bg-primary { background-color: hsl(var(--primary)); }
            .text-primary-foreground { color: hsl(var(--primary-foreground)); }
            .dark .bg-accent { background-color: hsl(var(--accent)); }
            .dark .text-accent-foreground { color: hsl(var(--accent-foreground)); }
          `}
        </style>
      </head>
      <body>
        <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
          <div className="text-center max-w-lg">
            <AlertTriangle className="mx-auto h-24 w-24 text-destructive mb-8" />
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-destructive mb-4">
              Something Went Wrong
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              An unexpected error occurred. Please try again, or go back to the homepage.
            </p>
            {process.env.NODE_ENV === 'development' && error?.message && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">Error Details (Dev Mode)</summary>
                <div className="mt-2 bg-muted/50 p-3 rounded-md text-xs text-destructive-foreground/80 dark:text-destructive-foreground/70">
                  <p className="font-code break-all">{error.message}</p>
                  {error.digest && <p className="font-code text-xs mt-1">Digest: {error.digest}</p>}
                </div>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => reset()}
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary dark:border-accent dark:text-accent dark:hover:bg-accent/10 dark:hover:text-accent"
              >
                Try Again
              </Button>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
                <Link href="/">Go Back to Homepage</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
