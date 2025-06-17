
import React from 'react';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalloutProps {
  type?: 'info' | 'warning' | 'best-practice';
  title?: string;
  children: React.ReactNode;
}

const calloutConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700 dark:text-blue-300',
    iconColor: 'text-blue-500 dark:text-blue-400',
    defaultTitle: 'ℹ️ Info',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-700/30',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    defaultTitle: '⚠️ Warning',
  },
  'best-practice': {
    icon: CheckCircle,
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    borderColor: 'border-green-500',
    textColor: 'text-green-700 dark:text-green-300',
    iconColor: 'text-green-500 dark:text-green-400',
    defaultTitle: '✅ Best Practice',
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const IconComponent = config.icon;

  return (
    <div className={cn("my-6 p-4 border-l-4 rounded-r-md", config.bgColor, config.borderColor)}>
      <div className="flex items-start">
        <IconComponent className={cn("h-5 w-5 mr-3 mt-0.5 shrink-0", config.iconColor)} />
        <div className="flex-1">
          {title && <h4 className={cn("font-semibold text-sm mb-1", config.textColor)}>{title}</h4>}
          {!title && <h4 className={cn("font-semibold text-sm mb-1", config.textColor)}>{config.defaultTitle}</h4>}
          <div className={cn("text-sm prose-sm max-w-none", config.textColor)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
