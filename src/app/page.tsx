"use client";

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Code2, SlidersHorizontal, ArrowRight } from "lucide-react";
import Image from 'next/image';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex-row items-center space-x-3 pb-3">
        <div className="p-2 bg-primary/10 dark:bg-accent/10 rounded-md">
          <Icon className="h-6 w-6 text-primary dark:text-accent" />
        </div>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-background to-secondary/5 dark:from-background dark:to-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block text-primary dark:text-accent">See How Code Works.</span>
                <span className="block text-foreground/80">Learn Faster.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
                AlgoVista demystifies Data Structures and Algorithms with real-time animations,
                visual metaphors, and a modern learning experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
                  <Link href="/visualizers">
                    Visualize Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">Explore Features</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              {/* Placeholder for Lottie animation or illustrative SVG */}
              <div className="aspect-square bg-muted/50 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                 <Image 
                    src="https://placehold.co/600x400.png" 
                    alt="Abstract algorithm visualization" 
                    width={600} 
                    height={400}
                    className="object-cover"
                    data-ai-hint="abstract network"
                  />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold">Why AlgoVista?</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Go beyond static code. Understand complex algorithms step-by-step.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Eye}
                title="Visual Algorithms"
                description="Watch algorithms come to life with dynamic, interactive visualizations. See every comparison, swap, and step."
              />
              <FeatureCard
                icon={Code2}
                title="Interactive Code Syncing"
                description="Code panels highlight the exact lines of execution in sync with animations. Understand the logic flow effortlessly."
              />
              <FeatureCard
                icon={SlidersHorizontal}
                title="Customizable Experience"
                description="Test algorithms with your own custom inputs, control animation speed, and switch between themes for optimal learning."
              />
            </div>
             <div className="text-center mt-12">
                <Button asChild size="lg" variant="link" className="text-primary dark:text-accent">
                  <Link href="/visualizers">
                    Start Visualizing Algorithms <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
