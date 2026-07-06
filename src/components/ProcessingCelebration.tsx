import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessingCelebrationProps {
  deckTitle: string;
  slideCount: number;
  onViewGuide: () => void;
}

const ProcessingCelebration: React.FC<ProcessingCelebrationProps> = ({
  deckTitle,
  slideCount,
  onViewGuide,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-md">
      <div
        className={`max-w-md w-full mx-4 p-8 rounded-2xl glass-effect text-center transition-all duration-500 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Guide Ready</h2>
          <p className="text-muted-foreground text-sm">
            Analysis complete for <span className="font-medium text-foreground">{deckTitle}</span>.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-3 rounded-xl bg-background/50 border border-white/5">
            <div className="text-xl font-semibold text-foreground">{slideCount}</div>
            <div className="text-xs text-muted-foreground">Slides</div>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-white/5">
            <div className="text-xl font-semibold text-foreground">{slideCount * 3}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-white/5">
            <div className="text-xl font-semibold text-foreground">{slideCount}</div>
            <div className="text-xs text-muted-foreground">Transitions</div>
          </div>
        </div>

        <Button onClick={onViewGuide} size="lg" className="w-full glass-effect hover:bg-white/10 text-foreground border-white/20">
          View Guide
        </Button>
      </div>
    </div>
  );
};

export default ProcessingCelebration;
