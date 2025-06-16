import Link from 'next/link';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 mt-auto">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-headline text-xl font-bold text-primary dark:text-accent">
                AlgoVista
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              See Algorithms in Action.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end" aria-label="Footer">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </nav>
        </div>
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AlgoVista. All rights reserved.</p>
          <a
            href="https://github.com" // Replace with actual GitHub link later
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-foreground transition-colors mt-2 md:mt-0"
          >
            <Github className="h-5 w-5 mr-2" />
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
