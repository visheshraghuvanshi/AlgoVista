
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Github } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <Mail className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="mt-6 text-xl text-muted-foreground mb-8">
            We're excited to hear from you! While we're still setting up direct contact channels, the best way to reach out, provide feedback, or inquire about contributions is through our community platforms.
          </p>
          
          <div className="space-y-6">
            <div>
              <h2 className="font-headline text-2xl font-semibold text-primary dark:text-accent mb-2">Feedback & Suggestions</h2>
              <p className="text-lg text-muted-foreground">
                Have ideas on how to make AlgoVista better? Found a bug? We'd love to know!
              </p>
              {/* Future: Link to a feedback board or GitHub issues */}
            </div>

            <div>
              <h2 className="font-headline text-2xl font-semibold text-primary dark:text-accent mb-2">Contributions</h2>
              <p className="text-lg text-muted-foreground">
                AlgoVista aims to be an open-source project. If you're interested in contributing, please check our GitHub repository (link in the footer).
              </p>
            </div>
            
            <div className="pt-4">
              <p className="text-lg text-muted-foreground">
                For general project updates and discussions, please visit our GitHub page.
              </p>
              <Button asChild size="lg" className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
                <a href="https://github.com/visheshraghuvanshi/AlgoVista" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" /> Visit GitHub
                </a>
              </Button>
            </div>
          </div>

           <p className="mt-12 text-md text-muted-foreground">
            A dedicated contact form and email address will be available here soon. Thank you for your patience!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

