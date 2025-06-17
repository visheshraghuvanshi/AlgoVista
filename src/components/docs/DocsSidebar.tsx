
"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { docsNavigation, type NavItem } from '@/app/docs/docs-navigation';
import { cn } from '@/lib/utils';

interface DocsSidebarProps {
  onLinkClick?: () => void;
}

export function DocsSidebar({ onLinkClick }: DocsSidebarProps) {
  return (
    <nav className="w-full h-full py-6 pr-4 lg:py-8"> {/* Reduced pr slightly for better fit */}
      <div className="space-y-3">
        {docsNavigation.map((section, index) => (
          <SidebarSection key={section.title + index} section={section} onLinkClick={onLinkClick} />
        ))}
      </div>
    </nav>
  );
}

interface SidebarSectionProps {
  section: NavItem;
  onLinkClick?: () => void;
}

function SidebarSection({ section, onLinkClick }: SidebarSectionProps) {
  const pathname = usePathname();
  
  // Check if any child or grandchild is active
  const isAnyChildActive = (items: NavItem[]): boolean => {
    return items.some(child => {
      if (child.href && pathname.startsWith(child.href)) return true;
      if (child.children) return isAnyChildActive(child.children);
      return false;
    });
  };
  
  const isSectionActive = section.children ? isAnyChildActive(section.children) : false;
  const [isOpen, setIsOpen] = useState(isSectionActive);

  // Effect to open section if a child becomes active
  useEffect(() => {
    if (isSectionActive && !isOpen) {
      setIsOpen(true);
    }
  }, [pathname, isSectionActive, isOpen]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2.5 text-left rounded-md hover:bg-muted/70 dark:hover:bg-muted/40 transition-colors",
          "font-headline text-base tracking-tight text-foreground/80 dark:text-foreground/70", // Updated font
           isOpen ? "text-primary dark:text-accent" : ""
        )}
      >
        <span>{section.title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {isOpen && section.children && (
        <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-border/50 ml-3">
          {section.children.map((item, index) => (
            item.children ? (
              <SidebarSubSection key={item.title + index} item={item} onLinkClick={onLinkClick} />
            ) : (
              <Link
                key={item.href || item.title}
                href={item.href || '#'}
                onClick={onLinkClick}
                className={cn(
                  "block px-3 py-1.5 text-sm rounded-md hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors",
                  pathname === item.href ? "text-primary dark:text-accent font-medium" : "text-muted-foreground hover:text-foreground/80 dark:hover:text-foreground/70"
                )}
              >
                {item.title}
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarSubSectionProps {
  item: NavItem;
  onLinkClick?: () => void;
}

function SidebarSubSection({ item, onLinkClick }: SidebarSubSectionProps) {
    const pathname = usePathname();

    const isAnyChildActive = (items: NavItem[]): boolean => {
      return items.some(child => child.href && pathname.startsWith(child.href));
    };
    const isSubSectionActive = item.children ? isAnyChildActive(item.children) : false;
    const [isOpen, setIsOpen] = useState(isSubSectionActive);

    useEffect(() => {
        if (isSubSectionActive && !isOpen) {
            setIsOpen(true);
        }
    }, [pathname, isSubSectionActive, isOpen]);

    return (
        <div className="pl-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                "flex items-center justify-between w-full px-3 py-1.5 text-left rounded-md hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors",
                "text-sm font-medium text-foreground/70 dark:text-foreground/60",
                 isOpen && item.children?.some(c => c.href === pathname) ? "text-primary dark:text-accent" : ""
                )}
            >
                <span>{item.title}</span>
                {isOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </button>
            {isOpen && item.children && (
                <div className="pl-3 mt-1 space-y-0.5 border-l-2 border-border/40 ml-3">
                {item.children.map((child, index) => (
                    <Link
                        key={child.href || child.title + index}
                        href={child.href || '#'}
                        onClick={onLinkClick}
                        className={cn(
                            "block px-3 py-1 text-xs rounded-md hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors",
                            pathname === child.href ? "text-primary dark:text-accent font-medium" : "text-muted-foreground hover:text-foreground/70 dark:hover:text-foreground/60"
                        )}
                    >
                    {child.title}
                    </Link>
                ))}
                </div>
            )}
        </div>
    );
}
