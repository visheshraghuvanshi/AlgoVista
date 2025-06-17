
"use client";

import React, { useState, useEffect } from 'react';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, Search, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useRouter } from 'next/navigation'; // For redirecting to search page if needed
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea

// Simple in-memory search (replace with actual search if needed)
const searchDocs = (query: string) => {
  if(!query.trim()) return [];
  // This would be replaced by an actual search implementation
  // For now, just return a placeholder
  console.log("Searching for:", query);
  return [{title: `Search results for "${query}"...`, href:"/docs"}];
};


export default function DocsPageClient({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState(1); // 1 = normal, can be e.g., 0.9, 1.1
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{title: string, href: string}[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Client-side only effect for font size adjustment
    document.documentElement.style.fontSize = `${fontSize * 16}px`; // Assuming base is 16px
    return () => {
      document.documentElement.style.fontSize = ''; // Reset on unmount
    };
  }, [fontSize]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchResults(searchDocs(searchQuery));
    }
  };
  
  const openSearchModal = () => {
    setIsSearchModalOpen(true);
    setSearchQuery('');
    setSearchResults([]);
  }

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  }
  
  const onSidebarLinkClick = () => {
    setIsMobileSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 border-r border-border fixed top-16 left-0 h-[calc(100vh-4rem)] pt-0 overflow-y-auto">
        <DocsSidebar onLinkClick={onSidebarLinkClick} />
      </aside>

      {/* Sheet for Mobile Sidebar Navigation and its Trigger */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <div className="lg:pl-64 xl:pl-72 flex-1">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="fixed top-4 right-4 lg:top-6 lg:right-6 z-50 flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={openSearchModal} className="lg:hidden" aria-label="Open search"> <Search /> </Button>
              <ThemeToggle />
              {/* Font size adjusters - conceptual, can be enhanced */}
              {/* <Button variant="outline" size="icon" onClick={() => setFontSize(prev => Math.max(0.8, prev - 0.1))} aria-label="Decrease font size"><ZoomOut className="h-4 w-4" /></Button> */}
              {/* <Button variant="outline" size="icon" onClick={() => setFontSize(prev => Math.min(1.5, prev + 0.1))} aria-label="Increase font size"><ZoomIn className="h-4 w-4" /></Button> */}
              <SheetTrigger asChild className="lg:hidden">
                 <Button variant="outline" size="icon" aria-label="Open navigation menu"> <Menu /> </Button>
              </SheetTrigger>
            </div>
            
            <div className="hidden lg:block fixed top-4 right-24 xl:right-32 z-40 max-w-xs"> {/* Adjusted right positioning */}
              <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder="Search docs..."
                      className="pl-9 h-9 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </form>
              {searchQuery && searchResults.length > 0 && (
                  <div className="absolute mt-1 w-full bg-popover border rounded-md shadow-lg p-2 text-sm max-h-60 overflow-y-auto">
                      {searchResults.map(res => <a key={res.title} href={res.href} className="block p-1 hover:bg-accent">{res.title}</a>)}
                  </div>
              )}
            </div>
            
            <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none mt-12 lg:mt-4">
              {children}
            </div>
          </main>
        </div>

        <SheetContent side="left" className="w-72 p-0 flex flex-col lg:hidden bg-background z-[60]">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="font-headline text-xl text-primary dark:text-accent">AlgoVista Docs</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1"> {/* Ensures sidebar itself is scrollable if content overflows */}
            <DocsSidebar onLinkClick={onSidebarLinkClick} />
          </ScrollArea>
        </SheetContent>
      </Sheet>


       {/* Fullscreen Search Modal for Mobile */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm p-4 flex flex-col lg:hidden">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Search Documentation</h2>
                <Button variant="ghost" size="icon" onClick={closeSearchModal} aria-label="Close search"> <X /> </Button>
            </div>
            <form onSubmit={handleSearch} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search docs..."
                    className="pl-10 h-12 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                />
            </form>
            <div className="flex-1 overflow-y-auto">
                {searchResults.length > 0 ? (
                    searchResults.map(res => <a key={res.title} href={res.href} className="block p-2 hover:bg-accent rounded-md">{res.title}</a>)
                ) : (
                    searchQuery.trim() && <p className="text-muted-foreground">No results for "{searchQuery}".</p>
                )}
            </div>
        </div>
      )}

    </div>
  );
}

