
import { redirect } from 'next/navigation';

// The base /docs route will redirect to the first "Getting Started" page.
export default function DocsRootPage() {
  redirect('/docs/getting-started/what-is-algovista');
}
