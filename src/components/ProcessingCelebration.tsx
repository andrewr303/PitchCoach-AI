import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, Play, Eye, MessageSquare, ArrowRight, BarChart3, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface ProcessingCelebrationProps {
  deckTitle: string;
  slideCount: number;
  guides?: Array<{ keyTalkingPoints: string[]; stats?: string[]; transitionStatement: string; speakerReminder: { timing: string } }>;
  onViewGuide: () => void;
}

const ProcessingCelebration: React.FC<ProcessingCelebrationProps> = ({
  deckTitle,
  slideCount,
  guides,
  onViewGuide,
}) => {
  const [showContent, setShowContent] = useState(false);

  // Compute summary stats from actual guide data
  const talkingPointCount = guides?.reduce((sum, g) => sum + g.keyTalkingPoints.length, 0) ?? slideCount * 3;
  const transitionCount = guides?.filter(g => g.transitionStatement).length ?? slideCount;
  const statCount = guides?.reduce((sum, g) => sum + (g.stats?.length ?? 0), 0) ?? 0;

  useEffect(() => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#6336F5', '#F59E0B', '#10B981', '#3B82F6'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#6336F5', '#F59E0B', '#10B981', '#3B82F6'],
      });
    }, 250);

    setTimeout(() => setShowContent(true), 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md">
      <div
        className={`max-w-lg w-full mx-4 p-8 md:p-10 rounded-3xl bg-card border border-border shadow-2xl text-center transition-all duration-600 ease-out-expo ${
          showContent ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Success icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute h-20 w-20 rounded-2xl bg-success/15 animate-ping opacity-40" />
          <div className="relative h-20 w-20 rounded-2xl bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          Your Guide is Ready!
        </h2>
        <p className="text-muted-foreground mb-8">
          We've analyzed{' '}
          <span className="font-semibold text-foreground">{deckTitle}</span>{' '}
          and crafted your personalized speaker guide.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="text-2xl font-bold font-display text-primary">{slideCount}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Slides</div>
          </div>
          <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/10">
            <div className="text-2xl font-bold font-display text-secondary">{talkingPointCount}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Talking Points</div>
          </div>
          <div className="p-3 rounded-xl bg-success/5 border border-success/10">
            <div className="text-2xl font-bold font-display text-success">{transitionCount}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Transitions</div>
          </div>
          <div className="p-3 rounded-xl bg-info/5 border border-info/10">
            <div className="text-2xl font-bold font-display text-info">{statCount}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Key Stats</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onViewGuide}
            size="lg"
            className="w-full gap-2 gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 h-12 text-base rounded-xl"
          >
            <Play className="h-4 w-4" />
            Start Practicing
          </Button>
          <button
            onClick={onViewGuide}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="h-3.5 w-3.5" />
            Review Guide First
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessingCelebration;
