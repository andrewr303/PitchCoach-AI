import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import DeckCard from '@/components/DeckCard';
import SpeakerGuideView from '@/components/SpeakerGuideView';
import ProcessingCelebration from '@/components/ProcessingCelebration';
import FileUpload from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Plus, Presentation } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useUserProfile } from '@/hooks/useUserProfile';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface SlideGuideData {
  slideNumber: number;
  title: string;
  keyTalkingPoints: string[];
  transitionStatement: string;
  emphasisTopic: string;
  keywords: string[];
  stats?: string[];
  visualCue?: string;
  speakerReminder: {
    timing: string;
    energy: string;
  };
}

interface Deck {
  id: string;
  title: string;
  slideCount: number;
  createdAt: string;
  guides: SlideGuideData[];
  slideImages?: string[];
}

const Index = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [viewingGuide, setViewingGuide] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { profile } = useUserProfile();

  const extractTextFromPDF = async (file: File): Promise<{ texts: string[]; images: string[] }> => {
    const arrayBuffer = await file.arrayBuffer();
    let pdf;

    try {
      pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    } catch (error) {
      const shouldFallback =
        error instanceof Error &&
        /Setting up fake worker failed|Failed to fetch dynamically imported module/i.test(error.message);

      if (!shouldFallback) {
        throw error;
      }

      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    }

    const pageNumbers = Array.from({ length: pdf.numPages }, (_, index) => index + 1);
    const results = await Promise.all(
      pageNumbers.map(async (pageNumber) => {
        const page = await pdf.getPage(pageNumber);
        try {
          const textContent = await page.getTextContent();
          const text = textContent.items
            .map((item) => ('str' in item ? item.str : ''))
            .join(' ')
            .trim() || `Slide ${pageNumber}`;

          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport }).promise;
          const image = canvas.toDataURL('image/jpeg', 0.8);

          return { text, image };
        } finally {
          page.cleanup();
        }
      })
    );

    return {
      texts: results.map(r => r.text),
      images: results.map(r => r.image),
    };
  };

  const extractTextFromPPTX = async (file: File): Promise<string[]> => {
    const slideCount = Math.floor(Math.random() * 5) + 3;
    return Array.from({ length: slideCount }, (_, i) =>
      `Slide ${i + 1} content from ${file.name}`
    );
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(10);

      let slideTexts: string[];
      let slideImages: string[] | undefined;
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const result = await extractTextFromPDF(file);
        slideTexts = result.texts;
        slideImages = result.images;
      } else {
        slideTexts = await extractTextFromPPTX(file);
      }

      setProgress(30);

      const deckTitle = file.name.replace(/\.(pdf|pptx)$/i, '');

      setProgress(50);

      // Build user context from profile
      const userContext: Record<string, string> = {};
      if (profile.displayName) userContext.presenterName = profile.displayName;
      if (profile.companyName) userContext.companyName = profile.companyName;
      if (profile.role) userContext.role = profile.role;
      if (profile.bio) userContext.bio = profile.bio;
      if (profile.customInstructions) userContext.customInstructions = profile.customInstructions;

      const { data, error } = await supabase.functions.invoke('generate-guide', {
        body: {
          slideTexts,
          deckTitle,
          ...(Object.keys(userContext).length > 0 ? { userContext } : {}),
        },
      });

      if (error) {
        let detail: string | undefined;
        try {
          const ctx = (error as any).context;
          if (ctx instanceof Response) {
            const body = await ctx.json();
            detail = body?.error;
          }
        } catch {
          // fall through
        }
        throw new Error(detail || error.message || 'Failed to generate guides');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.guides) {
        throw new Error('No guides returned. Please try again.');
      }

      setProgress(90);

      const newDeck: Deck = {
        id: Date.now().toString(),
        title: deckTitle,
        slideCount: data.guides.length,
        createdAt: 'Just now',
        guides: data.guides,
        slideImages,
      };

      setProgress(100);
      setCurrentDeck(newDeck);
      setIsProcessing(false);
      setShowCelebration(true);

    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process file');
      setIsProcessing(false);
      setProgress(0);
    }
  }, []);

  const handleViewGuide = () => {
    if (currentDeck) {
      setDecks((prev) => [currentDeck, ...prev]);
    }
    setShowCelebration(false);
    setViewingGuide(true);
  };

  const handleBackToDashboard = () => {
    setViewingGuide(false);
    setCurrentDeck(null);
    setActiveSlide(0);
  };

  const handleNewDeck = () => {
    setViewingGuide(false);
    setCurrentDeck(null);
    setDecks([]);
  };

  // Guide View
  if (viewingGuide && currentDeck) {
    return (
      <SpeakerGuideView
        guides={currentDeck.guides}
        deckTitle={currentDeck.title}
        slideImages={currentDeck.slideImages}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onNewDeck={handleNewDeck} showNewButton={decks.length > 0} />

      <main className="flex-1 container py-8 px-4 md:px-6">
        {decks.length === 0 ? (
          <EmptyState
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
            progress={Math.min(progress, 100)}
          />
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Dashboard header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">Your Presentations</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {decks.length} deck{decks.length !== 1 ? 's' : ''} ready to practice
                </p>
              </div>
              <Button
                onClick={handleNewDeck}
                className="gap-2 gradient-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
              >
                <Plus className="h-4 w-4" />
                New Deck
              </Button>
            </div>

            {/* Recent Decks grid */}
            <div className="mb-10">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {decks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    title={deck.title}
                    slideCount={deck.slideCount}
                    createdAt={deck.createdAt}
                    onClick={() => {
                      setCurrentDeck(deck);
                      setViewingGuide(true);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Upload new section */}
            <div className="border-t border-border pt-8">
              <h3 className="text-lg font-display font-semibold text-foreground mb-4">Upload Another Deck</h3>
              <FileUpload
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
                progress={Math.min(progress, 100)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Celebration Modal */}
      {showCelebration && currentDeck && (
        <ProcessingCelebration
          deckTitle={currentDeck.title}
          slideCount={currentDeck.slideCount}
          guides={currentDeck.guides}
          onViewGuide={handleViewGuide}
        />
      )}
    </div>
  );
};

export default Index;
