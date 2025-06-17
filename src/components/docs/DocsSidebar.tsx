
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { docsNavigation, type NavItem } from '@/app/docs/docs-navigation';
import { cn } from '@/lib/utils';

interface DocsSidebarProps {
  onLinkClick?: () => void; // Optional callback for when a link is clicked (e.g., to close mobile drawer)
}

export function DocsSidebar({ onLinkClick }: DocsSidebarProps) {
  return (
    <nav className="w-full h-full py-6 pr-6 lg:py-8">
      <div className="space-y-4">
        {docsNavigation.map((section) => (
          <SidebarSection key={section.title} section={section} onLinkClick={onLinkClick} />
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
  const isSectionActive = section.children?.some(child => child.href && pathname.startsWith(child.href)) || false;
  const [isOpen, setIsOpen] = useState(isSectionActive);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-left rounded-md hover:bg-muted dark:hover:bg-muted/50",
          "text-base font-semibold text-foreground/80 dark:text-foreground/70"
        )}
      >
        <span>{section.title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isOpen && section.children && (
        <div className="pl-3 mt-1 space-y-1 border-l-2 border-border ml-3">
          {section.children.map((item) => (
            item.children ? (
              <SidebarSubSection key={item.title} item={item} onLinkClick={onLinkClick} parentPath={section.title}/>
            ) : (
              <Link
                key={item.href || item.title}
                href={item.href || '#'}
                onClick={onLinkClick}
                className={cn(
                  "block px-3 py-1.5 text-sm rounded-md hover:bg-muted dark:hover:bg-muted/50",
                  pathname === item.href ? "text-primary font-semibold dark:text-accent" : "text-muted-foreground"
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
  parentPath: string; // Used for initial open state checking
}

function SidebarSubSection({ item, onLinkClick, parentPath }: SidebarSubSectionProps) {
    const pathname = usePathname();
    const isSubSectionActive = item.children?.some(child => child.href && pathname.startsWith(child.href)) || false;
    const [isOpen, setIsOpen] = useState(isSubSectionActive);

    return (
        <div className="pl-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                "flex items-center justify-between w-full px-3 py-1.5 text-left rounded-md hover:bg-muted dark:hover:bg-muted/50",
                "text-sm font-medium text-foreground/70 dark:text-foreground/60"
                )}
            >
                <span>{item.title}</span>
                {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {isOpen && item.children && (
                <div className="pl-3 mt-1 space-y-1 border-l-2 border-border ml-3">
                {item.children.map((child) => (
                    <Link
                        key={child.href || child.title}
                        href={child.href || '#'}
                        onClick={onLinkClick}
                        className={cn(
                            "block px-3 py-1 text-xs rounded-md hover:bg-muted dark:hover:bg-muted/50",
                            pathname === child.href ? "text-primary font-semibold dark:text-accent" : "text-muted-foreground"
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
