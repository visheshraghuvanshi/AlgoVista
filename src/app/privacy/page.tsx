
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent mb-8 text-center">
            Privacy Policy
          </h1>
          <div className="space-y-6 text-muted-foreground">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <p>AlgoVista ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our website and services (collectively, the "Service").</p>
            
            <h2 className="font-headline text-2xl font-semibold text-foreground pt-4">Information We Don't Collect</h2>
            <p>AlgoVista is designed with user privacy at its core. We do not require user accounts, and therefore, we do not collect any Personally Identifiable Information (PII) such as your name, email address, phone number, or physical address.</p>
            
            <h2 className="font-headline text-2xl font-semibold text-foreground pt-4">Information Collected Automatically</h2>
            <p>Like most websites, we may collect non-personally identifiable information that your browser sends whenever you visit our Service. This may include:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Your device's Internet Protocol (IP) address (anonymized where possible)</li>
              <li>Browser type and version</li>
              <li>The pages of our Service that you visit</li>
              <li>The time and date of your visit</li>
              <li>The time spent on those pages</li>
              <li>Other standard web log information</li>
            </ul>
            <p>This data is used in an aggregated form for analytical purposes, such as understanding how users interact with AlgoVista, improving our Service, and ensuring its stability and security. This information does not identify you personally.</p>

            <h2 className="font-headline text-2xl font-semibold text-foreground pt-4">Theme Preferences</h2>
            <p>AlgoVista allows you to toggle between light and dark themes. This preference is stored locally in your browser's <code>localStorage</code>. This information is not transmitted to our servers and is used solely to remember your theme choice for subsequent visits from the same browser.</p>

            <h2 className="font-headline text-2xl font-semibold text-foreground pt-4">Cookies</h2>
            <p>We do not use cookies for tracking or advertising purposes. Essential cookies may be used by Next.js or other underlying framework functionalities to ensure the proper operation of the website. Your theme preference is stored in <code>localStorage</code>, not cookies.</p>

            <h2 className="font-headline text-2xl font-semibold text-foreground pt-4">Third-Party Services</h2>
            <p>We may use third-party services for hosting (e.g., Firebase App Hosting) or analytics (e.g., a privacy-focused analytics tool in the future). These services have their own privacy policies, and we encourage you to review them.</p>

            <h2 className="font-headline text-2xl font-semibold text-foreground pt-4">Data Security</h2>
            <p>While we do not collect PII, we are committed to ensuring the security of any data that is processed. We implement reasonable administrative, technical, and physical safeguards to protect any non-personal information from loss, misuse, unauthorized access, disclosure, alteration, or destruction.</p>

            <h2 className="font-headline text-2xl font-semibold text-foreground pt-4">Children's Privacy</h2>
            <p>AlgoVista is not intended for children under the age of 13. We do not knowingly collect any information from children under 13. If you believe we might have any information from or about a child under 13, please contact us.</p>
            
            <h2 className="font-headline text-2xl font-semibold text-foreground pt-4">Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
            
            <h2 className="font-headline text-2xl font-semibold text-foreground pt-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please refer to our Contact page or the project's GitHub repository (link in the footer).</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
