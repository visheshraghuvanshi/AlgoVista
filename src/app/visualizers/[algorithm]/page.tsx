// This dynamic route is deprecated.
// Each algorithm now has its own dedicated page in /visualizers/[algorithm-slug]/page.tsx
// This file can be safely deleted if no longer referenced.
import { notFound } from 'next/navigation';

export default function AlgorithmPage() {
  notFound();
}
