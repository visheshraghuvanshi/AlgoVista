
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BookOpen, Compass, Zap, Code2, Github, SlidersHorizontal, Eye, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
          <BookOpen className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            AlgoVista Documentation
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Your guide to understanding and using AlgoVista's interactive algorithm visualizers.
          </p>
        </section>

        <div className="space-y-12">
          <DocsSection title="What is AlgoVista?" icon={Info}>
            <p>AlgoVista is an interactive learning platform designed to make complex computer science concepts, particularly data structures and algorithms, more intuitive and accessible. Instead of just reading static code or theories, AlgoVista allows you to see algorithms in action through dynamic visualizations, synchronized code highlighting, and customizable inputs.</p>
            <p className="mt-2">Our goal is to provide a clear, step-by-step view of how these fundamental concepts work, helping learners grasp them faster and more effectively.</p>
          </DocsSection>

          <DocsSection title="Navigating the Platform" icon={Compass}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold text-lg">Finding Visualizers</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-2">
                  <p>All available algorithm visualizers are listed on the <Button variant="link" asChild className="p-0 h-auto"><Link href="/visualizers">Visualizers page</Link></Button>.</p>
                  <p>You can use the search bar to find specific algorithms by name or keywords in their description. Additionally, you can filter visualizers by category (e.g., Sorting, Graphs, Trees) and difficulty level (Easy, Medium, Hard) to narrow down your search.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold text-lg">Algorithm Pages</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  <p>Each algorithm has its own dedicated page, typically accessed via a URL like <code>/visualizers/[algorithm-slug]</code> (e.g., <code>/visualizers/bubble-sort</code>).</p>
                  <p>On these pages, you'll find the interactive visualization panel, code panel, controls, and detailed information about the algorithm.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DocsSection>

          <DocsSection title="How to Use a Visualizer" icon={Zap}>
             <p className="mb-4 text-muted-foreground">Each visualizer page generally consists of several key components designed to provide a comprehensive learning experience:</p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold text-lg">Input Section / Controls Panel</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-2">
                  <p>This is where you provide data for the algorithm (e.g., an array of numbers, a graph structure string, values for data structure operations). Default values are often provided.</p>
                  <p>Controls typically include:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Play/Pause:</strong> Start or pause the step-by-step animation.</li>
                    <li><strong>Step:</strong> Manually advance the animation one step at a time.</li>
                    <li><strong>Reset:</strong> Resets the visualizer to its initial state with the current input or default input.</li>
                    <li><strong>Animation Speed Slider:</strong> Adjust the delay between animation steps.</li>
                    <li><strong>Operation-specific inputs:</strong> Some visualizers (like Linked Lists or Heaps) have dropdowns or input fields to select specific operations (e.g., Insert, Delete, Search) and provide values for those operations.</li>
                  </ul>
                   <p>Pay attention to placeholder text or labels for expected input formats (e.g., "comma-separated numbers", "node:neighbor1,neighbor2;...").</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold text-lg">Visualization Panel</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-2">
                  <p>This is the main canvas where the algorithm's execution is visualized. Depending on the algorithm, you might see:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Arrays:</strong> Represented as bars, with height corresponding to value. Colors indicate active elements, comparisons, swaps, or sorted portions.</li>
                    <li><strong>Trees/Graphs:</strong> Nodes and edges, with colors changing to show traversal paths, visited nodes, active nodes, etc.</li>
                    <li><strong>Linked Lists:</strong> Nodes with values and pointers, showing connections and how they change.</li>
                    <li><strong>Other Structures:</strong> Custom representations for specific data structures like Stacks, Queues, or Heaps (often as tree-like structures or linear arrays).</li>
                  </ul>
                  <p>Look for highlighted elements, changing colors, and pointer movements to understand the algorithm's logic flow.</p>
                   <p>Some visualizers also display auxiliary data like queues, stacks, or important variables (e.g., `currentMax`, `maxSoFar` in Kadane's) below or alongside the main visualization.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-semibold text-lg">Code Panel</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-2">
                  <p>This panel displays a conceptual code implementation of the algorithm, often in JavaScript or Python.</p>
                  <p>The currently executing line of code is highlighted in sync with the animation step in the visualization panel. This helps connect the visual changes to the underlying logic.</p>
                  <p>You can usually copy the code snippet using a "Copy" button.</p>
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-4">
                <AccordionTrigger className="font-semibold text-lg">"About [Algorithm]" Section</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-2">
                  <p>Below the interactive components, you'll find a card with detailed information about the algorithm, including:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>A longer description of how it works.</li>
                    <li>Typical use cases.</li>
                    <li>Time and Space complexity (Best, Average, Worst cases).</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DocsSection>
          
          <DocsSection title="Understanding Algorithms" icon={Eye}>
            <p>AlgoVista's primary aim is to make algorithms more intuitive through visual learning. While the platform provides descriptions and complexity analyses, the core learning experience comes from observing the step-by-step execution.</p>
            <p className="mt-2">Pay attention to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                <li>How data elements are compared or moved.</li>
                <li>The state of auxiliary data structures (like stacks, queues, or pointers).</li>
                <li>Which part of the code corresponds to the current visual action.</li>
                <li>How different inputs affect the algorithm's behavior.</li>
            </ul>
            <p className="mt-2">For a deeper dive into the theory behind each algorithm, the "About [AlgorithmName]" section on each visualizer page is a great resource. External resources like textbooks, academic papers, or other online tutorials can supplement your learning.</p>
          </DocsSection>

          <DocsSection title="Contributing to AlgoVista" icon={Github}>
            <p>AlgoVista is envisioned as an open-source project, and community contributions are highly welcome! Whether you're a student, developer, or educator, there are many ways to help improve the platform.</p>
            <div className="mt-4 space-y-2">
                <p><strong>How to Contribute:</strong></p>
                <ul className="list-disc list-inside ml-4 text-muted-foreground">
                    <li><strong>Report Bugs:</strong> If you find an issue with a visualizer or the website, please report it on our GitHub Issues page.</li>
                    <li><strong>Suggest Features:</strong> Have an idea for a new visualizer or an improvement to an existing one? Let us know!</li>
                    <li><strong>Code Contributions:</strong> Feel free to fork the repository, implement new features or visualizers, and submit a Pull Request.</li>
                    <li><strong>Documentation Improvements:</strong> Help us make these docs clearer and more comprehensive.</li>
                </ul>
                <div className="pt-2">
                     <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer"> 
                            <Github className="mr-2 h-4 w-4" /> Visit AlgoVista on GitHub (Link Coming Soon!)
                        </a>
                    </Button>
                </div>
            </div>
          </DocsSection>

           <DocsSection title="Troubleshooting / FAQ" icon={AlertCircle}>
            <p className="text-muted-foreground">This section is currently under development. Common questions and troubleshooting tips will be added here soon.</p>
            <p className="mt-2 text-muted-foreground">If you encounter any issues, please try refreshing the page or clearing your browser cache. For persistent problems, consider <Link href="/contact" className="text-primary hover:underline dark:text-accent">contacting us</Link> or opening an issue on GitHub.</p>
          </DocsSection>

        </div>
      </main>
      <Footer />
    </div>
  );
}

interface DocsSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function DocsSection({ title, icon: Icon, children }: DocsSectionProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl sm:text-3xl text-primary dark:text-accent flex items-center">
          <Icon className="mr-3 h-7 w-7" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-lg text-foreground/80 space-y-3">
        {children}
      </CardContent>
    </Card>
  );
}

