
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header'; // Import the main header
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { docsContentBySlug } from '@/lib/docs-content';
import Link from 'next/link';

// Actual client-side search function
const searchDocs = (query: string): { title: string, href: string, slug: string }[] => {
  if (!query.trim()) return [];
  const lowerCaseQuery = query.toLowerCase();
  const results: { title: string, href: string, slug: string }[] = [];

  for (const slug in docsContentBySlug) {
    const doc = docsContentBySlug[slug];
    if (doc.title.toLowerCase().includes(lowerCaseQuery) || doc.content.toLowerCase().includes(lowerCaseQuery)) {
      results.push({ title: doc.title, href: `/docs/${slug}`, slug });
    }
  }
  return results;
};

export default function DocsPageClient({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ title: string, href: string, slug: string }[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDesktopSearchFocused, setIsDesktopSearchFocused] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchDocs(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const openSearchModal = () => {
    setIsSearchModalOpen(true);
    setSearchQuery('');
    setSearchResults([]);
  }

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }
  
  const onSidebarLinkClick = () => {
    setIsMobileSidebarOpen(false); 
  }

  const onSearchResultClick = () => {
    closeSearchModal(); 
    setIsDesktopSearchFocused(false); 
    setSearchQuery(''); 
    setSearchResults([]);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header /> {/* Add the global Header component here */}
      <div className="flex flex-1 pt-16"> {/* Add pt-16 (h-16) to offset for the fixed global header */}
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          {/* Desktop Sidebar */}
          {/* Adjusted top to 8rem (h-16 for global header + h-16 for docs header) */}
          <aside className="hidden lg:block w-64 xl:w-72 border-r border-border/70 fixed top-[8rem] left-0 h-[calc(100vh-8rem)] pt-0 bg-card/30 dark:bg-card/50">
            <ScrollArea className="h-full">
              <DocsSidebar onLinkClick={onSidebarLinkClick} />
            </ScrollArea>
          </aside>

          {/* Main content area including the top bar */}
          {/* Adjusted pl for desktop sidebar */}
          <div className="lg:pl-64 xl:pl-72 flex-1 flex flex-col">
            {/* Docs Specific Top Bar - sticky below the global Header */}
            {/* Adjusted top to 4rem (h-16) to stick below the global header */}
            <header className="sticky top-16 z-30 flex items-center justify-between lg:justify-end h-16 px-4 sm:px-6 lg:px-8 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center gap-x-3 md:gap-x-4 ml-auto">
                {/* Desktop Search */}
                <div className="hidden lg:block relative">
                  <form onSubmit={handleSearchSubmit}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search documentation..."
                      className="h-9 pl-9 pr-3 text-sm w-64 xl:w-72"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsDesktopSearchFocused(true)}
                    />
                  </form>
                  {isDesktopSearchFocused && searchQuery && (
                    <div className="absolute mt-1.5 w-full bg-popover border rounded-md shadow-xl p-2 text-sm max-h-80 overflow-y-auto z-50">
                      {searchResults.length > 0 ? (
                        searchResults.map(res => (
                          <Link key={res.slug} href={res.href} onClick={onSearchResultClick}
                                className="block p-2 hover:bg-muted rounded-sm transition-colors">
                            {res.title}
                          </Link>
                        ))
                      ) : (
                        <p className="p-2 text-muted-foreground">No results for "{searchQuery}".</p>
                      )}
                       <Button variant="ghost" size="sm" onClick={() => setIsDesktopSearchFocused(false)} className="w-full mt-1 text-xs">Close</Button>
                    </div>
                  )}
                </div>
                {/* Mobile Search Trigger */}
                <Button variant="ghost" size="icon" onClick={openSearchModal} className="lg:hidden" aria-label="Open search">
                  <Search className="h-5 w-5" />
                </Button>
                <ThemeToggle />
                {/* Mobile Menu Trigger */}
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="icon" aria-label="Open navigation menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </div>
            </header>
            
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="prose dark:prose-invert max-w-none text-foreground/90 dark:text-foreground/80">
                {children}
              </div>
            </main>
          </div>

          {/* Mobile Sidebar Content */}
          <SheetContent side="left" className="w-72 p-0 flex flex-col lg:hidden bg-card z-[60] mt-16"> {/* Add mt-16 to position below global header */}
            <SheetHeader className="p-4 border-b border-border/70">
              <SheetTitle className="font-headline text-xl tracking-tight text-primary dark:text-accent">AlgoVista Docs</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1">
              <DocsSidebar onLinkClick={onSidebarLinkClick} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Fullscreen Search Modal for Mobile */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm p-4 flex flex-col lg:hidden pt-20"> {/* Add pt-20 to position below global header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-xl font-semibold text-primary dark:text-accent">Search Documentation</h2>
                <Button variant="ghost" size="icon" onClick={closeSearchModal} aria-label="Close search">
                  <X className="h-5 w-5" />
                </Button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Type to search..."
                    className="pl-10 pr-4 h-12 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                />
            </form>
            <ScrollArea className="flex-1 -mx-4">
              <div className="px-4">
                {searchResults.length > 0 ? (
                    searchResults.map(res => (
                        <Link key={res.slug} href={res.href} onClick={onSearchResultClick}
                              className="block p-3 hover:bg-muted rounded-md transition-colors text-sm">
                            {res.title}
                        </Link>
                    ))
                ) : (
                    searchQuery.trim() && <p className="p-3 text-muted-foreground text-sm">No results found for "{searchQuery}".</p>
                )}
                {!searchQuery.trim() && <p className="p-3 text-muted-foreground text-sm">Start typing to see results.</p>}
              </div>
            </ScrollArea>
        </div>
      )}
    </div>
  );
}

