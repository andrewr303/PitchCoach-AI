import React from 'react';
import { Presentation, Plus, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onNewDeck?: () => void;
  showNewButton?: boolean;
  deckTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ onNewDeck, showNewButton = true, deckTitle }) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-border/60">
      <div className="container flex h-15 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
            <Presentation className="h-[18px] w-[18px] text-primary-foreground" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              SmartPitch
            </span>
            <span className="font-display font-bold text-lg tracking-tight text-gradient-accent">
              Coach
            </span>
          </div>
          {deckTitle && (
            <>
              <div className="hidden md:block h-5 w-px bg-border ml-1" />
              <span className="hidden md:block text-sm text-muted-foreground truncate max-w-[200px]">
                {deckTitle}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showNewButton && (
            <Button
              onClick={onNewDeck}
              className="gap-2 gradient-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Deck</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground rounded-lg h-9 w-9"
          >
            <Settings className="h-[18px] w-[18px]" />
          </Button>
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
            <User className="h-[18px] w-[18px] text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
