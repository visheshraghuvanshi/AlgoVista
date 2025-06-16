
"use client"; // Required for useState and useEffect

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // Set the date only on the client-side to avoid hydration mismatch
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <ShieldCheck className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
            <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
              Privacy Policy
            </h1>
          </div>
          
          <div className="space-y-6 text-foreground/80 text-lg">
            {lastUpdated && (
              <p className="text-muted-foreground"><strong>Last Updated:</strong> {lastUpdated}</p>
            )}
            
            <p>AlgoVista ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our website and services (collectively, the "Service"). Our core principle is to collect as little user data as possible.</p>
            
            <PrivacySection title="Information We Do Not Collect">
              <p>AlgoVista is designed with user privacy at its core. We do not require user accounts, and therefore, **we do not collect any Personally Identifiable Information (PII)** such as your name, email address, phone number, or physical address.</p>
            </PrivacySection>
            
            <PrivacySection title="Information Collected Automatically (Non-Personal)">
              <p>Like most websites, we may collect non-personally identifiable information that your browser sends whenever you visit our Service. This data is used in an aggregated form for analytical purposes, such as understanding how users interact with AlgoVista, improving our Service, and ensuring its stability and security. This information does not identify you personally. This may include:</p>
              <ul className="list-disc list-inside space-y-1 pl-6 mt-2">
                <li>Your device's Internet Protocol (IP) address (anonymized or truncated where feasible).</li>
                <li>Browser type and version.</li>
                <li>The pages of our Service that you visit.</li>
                <li>The time and date of your visit.</li>
                <li>The time spent on those pages.</li>
                <li>Other standard web log information for diagnostics and traffic analysis.</li>
              </ul>
            </PrivacySection>

            <PrivacySection title="Theme Preferences & Local Storage">
              <p>AlgoVista allows you to toggle between light and dark themes. This preference, along with potentially other non-sensitive UI preferences (like animation speed if implemented), is stored locally in your browser's <code>localStorage</code>. This information is not transmitted to our servers and is used solely to remember your choices for subsequent visits from the same browser.</p>
            </PrivacySection>

            <PrivacySection title="Cookies">
              <p>We do not use cookies for tracking or advertising purposes. Essential cookies may be used by the Next.js framework or underlying functionalities (like theme persistence if `next-themes` uses them) to ensure the proper operation of the website. These are functional and not used to track your activity across other sites.</p>
            </PrivacySection>

            <PrivacySection title="Third-Party Services">
              <p>We may use third-party services for:</p>
              <ul className="list-disc list-inside space-y-1 pl-6 mt-2">
                <li>**Hosting:** Firebase App Hosting (or similar) hosts our application.</li>
                <li>**Analytics (Future):** We may use a privacy-focused analytics tool in the future to understand service usage without collecting PII.</li>
              </ul>
              <p className="mt-2">These services have their own privacy policies, and we encourage you to review them. We select third-party services with a strong commitment to data privacy.</p>
            </PrivacySection>

            <PrivacySection title="Data Security">
              <p>While we do not collect PII, we are committed to ensuring the security of any data that is processed (like aggregated analytics or locally stored preferences). We implement reasonable administrative, technical, and physical safeguards to protect any non-personal information from loss, misuse, unauthorized access, disclosure, alteration, or destruction.</p>
            </PrivacySection>

            <PrivacySection title="Children's Privacy">
              <p>AlgoVista is an educational tool suitable for a wide audience, including students. It is not specifically directed at children under the age of 13 (or the relevant age in your jurisdiction). We do not knowingly collect any personal information from children. If you believe we might have inadvertently collected any information from or about a child, please contact us so we can take appropriate action.</p>
            </PrivacySection>
            
            <PrivacySection title="Changes to This Privacy Policy">
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
            </PrivacySection>
            
            <PrivacySection title="Contact Us">
              <p>If you have any questions about this Privacy Policy or our privacy practices, please refer to our <a href="/contact" className="text-primary dark:text-accent hover:underline">Contact page</a> or the project's GitHub repository (link in the footer).</p>
            </PrivacySection>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface PrivacySectionProps {
  title: string;
  children: React.ReactNode;
}

function PrivacySection({ title, children }: PrivacySectionProps) {
  return (
    <section>
      <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-foreground pt-4 pb-2 mb-2 border-b border-border/70">
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
