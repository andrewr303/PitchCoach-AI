import React from 'react';
import { FileText, ArrowRight, Presentation, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeckCardProps {
  title: string;
  slideCount: number;
  createdAt: string;
  thumbnailUrl?: string;
  onClick?: () => void;
  className?: string;
}

const DeckCard: React.FC<DeckCardProps> = ({
  title,
  slideCount,
  createdAt,
  thumbnailUrl,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-card border border-border p-4 cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-0.5',
        className
      )}
    >
      {/* Thumbnail with gradient strip */}
      <div className="aspect-video rounded-xl bg-muted overflow-hidden mb-4 relative">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <Presentation className="h-10 w-10 text-primary/20 group-hover:text-primary/30 transition-colors" />
          </div>
        )}
        {/* Gradient strip at bottom of thumbnail */}
        <div className="absolute bottom-0 left-0 right-0 h-1 gradient-primary opacity-60" />
      </div>

      {/* Content */}
      <div className="space-y-2.5">
        <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>{slideCount} slides</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{createdAt}</span>
          </div>
        </div>
      </div>

      {/* Hover CTA overlay */}
      <div className="absolute right-3 bottom-3 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
          <ArrowRight className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
};

export default DeckCard;
