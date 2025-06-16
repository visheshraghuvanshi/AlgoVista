
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            Contact Us
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Coming Soon! We'll provide ways to get in touch for feedback, contributions, or inquiries.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            In the meantime, you can find the project on GitHub (link in footer).
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
