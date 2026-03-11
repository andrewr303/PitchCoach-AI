import React from 'react';
import { Sparkles, Target, Mic, ArrowRight, Upload, Zap, Clock } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';

interface EmptyStateProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
  progress?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  onFileSelect,
  isProcessing,
  progress
}) => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Guides',
      description: 'Smart talking points, emphasis cues, and key stats for every slide',
      color: 'text-primary bg-primary/10',
    },
    {
      icon: Target,
      title: 'Seamless Transitions',
      description: 'Never stumble between slides again with natural bridge statements',
      color: 'text-secondary bg-secondary/10',
    },
    {
      icon: Mic,
      title: 'Practice Mode',
      description: 'Timed run-throughs with pacing feedback to nail your delivery',
      color: 'text-success bg-success/10',
    },
  ];

  const steps = [
    { number: '01', title: 'Upload', description: 'Drop your PDF or PPTX deck', icon: Upload },
    { number: '02', title: 'AI Generates', description: 'Get slide-by-slide coaching', icon: Zap },
    { number: '03', title: 'Practice', description: 'Rehearse with timer & cues', icon: Clock },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-8">
      <div className="max-w-3xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">AI-Powered Coaching</span>
          </div>
          <h1 className="text-display-sm md:text-display text-foreground mb-4 font-display">
            Transform slides into{' '}
            <span className="text-gradient">confident</span>{' '}
            presentations
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Upload your deck and get an AI-generated speaker guide with talking points, transitions, and delivery cues for every slide.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <FileUpload
            onFileSelect={onFileSelect}
            isProcessing={isProcessing}
            progress={progress}
          />
        </div>

        {/* How it works — 3 step flow */}
        <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <h2 className="text-overline text-muted-foreground uppercase text-center mb-6 tracking-widest">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex items-center gap-3 md:flex-col md:items-center md:text-center p-4">
                <div className="flex items-center gap-3 md:flex-col">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <step.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-overline text-primary font-mono">{step.number}</span>
                    <h3 className="font-display font-semibold text-foreground text-sm">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-2 top-8 h-4 w-4 text-border" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-card-hover"
            >
              <div className={`h-10 w-10 rounded-xl ${feature.color} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
