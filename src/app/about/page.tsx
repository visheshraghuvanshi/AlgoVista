
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Code, Users, Brain } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            About <span className="text-primary dark:text-accent">AlgoVista</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Our mission is to make learning Data Structures and Algorithms intuitive, engaging, and accessible for everyone.
          </p>
        </section>

        <section className="mb-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-3xl font-semibold mb-6 text-primary dark:text-accent">
              What is AlgoVista?
            </h2>
            <p className="text-lg text-foreground/80 mb-4">
              AlgoVista ("Algorithm" + "Vista") is a next-generation interactive learning platform designed to demystify complex computer science concepts. We believe that seeing algorithms in action is the key to truly understanding them.
            </p>
            <p className="text-lg text-foreground/80">
              Instead of just reading static code or abstract theories, learners can watch logic unfold step-by-step through dynamic visualizations, synchronized code highlighting, and the ability to test with custom inputs.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://placehold.co/500x350.png"
              alt="AlgoVista Concept Art"
              width={500}
              height={350}
              className="rounded-xl shadow-2xl object-cover"
              data-ai-hint="abstract nodes connections"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-headline text-3xl font-semibold mb-8 text-center text-primary dark:text-accent">
            Why We Built AlgoVista
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InfoCard
              icon={Brain}
              title="Enhance Understanding"
              description="Visual learning aids comprehension and retention of complex topics like recursion, graph traversals, and dynamic programming."
            />
            <InfoCard
              icon={Zap}
              title="Interactive Engagement"
              description="Passive learning is outdated. AlgoVista encourages active participation through custom inputs and real-time feedback."
            />
            <InfoCard
              icon={Users}
              title="For Everyone"
              description="Whether you're a student, a self-taught developer, or preparing for interviews, AlgoVista caters to all learning levels."
            />
          </div>
        </section>
        
        <section className="mb-16">
           <h2 className="font-headline text-3xl font-semibold mb-8 text-center text-primary dark:text-accent">
            Technology Stack
          </h2>
          <div className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-xl shadow-lg border">
            <ul className="space-y-4 text-lg">
              <TechListItem name="Next.js (App Router)" description="For a fast, modern React framework with server components and optimized routing." />
              <TechListItem name="TypeScript" description="To ensure code quality, maintainability, and a better developer experience." />
              <TechListItem name="Tailwind CSS" description="For rapid, utility-first UI development." />
              <TechListItem name="Shadcn/UI" description="Beautifully designed, accessible, and customizable React components." />
              <TechListItem name="Framer Motion" description="To create smooth and engaging animations for algorithm visualizations (planned)." />
            </ul>
          </div>
        </section>

        <section className="text-center">
          <h2 className="font-headline text-3xl font-semibold mb-4 text-primary dark:text-accent">
            Get Involved
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
            AlgoVista is an open-source project. We welcome contributions and feedback from the community!
          </p>
          {/* Add GitHub link or contact form/info here eventually */}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function InfoCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="mx-auto bg-primary/10 dark:bg-accent/10 p-3 rounded-full w-fit mb-4">
          <Icon className="h-8 w-8 text-primary dark:text-accent" />
        </div>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TechListItem({ name, description }: { name: string, description: string }) {
  return (
    <li className="flex flex-col sm:flex-row">
      <span className="font-semibold text-primary dark:text-accent w-full sm:w-1/3 mb-1 sm:mb-0">{name}:</span>
      <span className="text-muted-foreground w-full sm:w-2/3">{description}</span>
    </li>
  );
}
