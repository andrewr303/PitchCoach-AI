import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2, FileType, Sparkles, Brain, PenTool, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
  progress?: number;
  className?: string;
}

const PROCESSING_STAGES = [
  { min: 0, max: 25, label: 'Reading your slides...', icon: FileText, detail: 'Extracting content from your deck' },
  { min: 25, max: 50, label: 'Analyzing structure...', icon: Brain, detail: 'Understanding slide flow & hierarchy' },
  { min: 50, max: 85, label: 'Crafting your guide...', icon: PenTool, detail: 'Generating talking points & transitions' },
  { min: 85, max: 100, label: 'Polishing & finalizing...', icon: Sparkles, detail: 'Adding finishing touches' },
];

const TIPS = [
  'Pausing between slides increases audience retention by 40%',
  'Eye contact for 3-5 seconds per person builds trust',
  'The best presentations tell a story with a clear arc',
  'Practice your transitions — they make or break the flow',
];

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isProcessing = false,
  progress = 0,
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragOver(true);
    } else if (e.type === 'dragleave') {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (isValidFile(file)) {
          setSelectedFile(file);
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (isValidFile(file)) {
          setSelectedFile(file);
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const isValidFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    const validType = validTypes.includes(file.type) || file.name.endsWith('.pptx') || file.name.endsWith('.pdf');
    if (!validType) {
      toast.error('Invalid file type. Please upload a PDF or PPTX file.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      return false;
    }
    return true;
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Processing state — rich multi-stage experience
  if (isProcessing) {
    const currentStageIndex = PROCESSING_STAGES.findIndex(s => progress <= s.max);
    const stage = PROCESSING_STAGES[Math.max(0, currentStageIndex)];
    const StageIcon = stage.icon;
    const tipIndex = Math.floor((progress / 100) * TIPS.length) % TIPS.length;

    return (
      <div className={cn('w-full', className)}>
        <div className="rounded-2xl border border-primary/20 bg-card p-8 shadow-lg shadow-primary/5">
          <div className="flex flex-col items-center gap-6">
            {/* Animated icon */}
            <div className="relative">
              <div className="absolute inset-0 h-18 w-18 rounded-2xl bg-primary/10 animate-ping opacity-30" />
              <div className="relative h-18 w-18 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-primary">
                <StageIcon className="h-8 w-8 text-primary-foreground animate-pulse" />
              </div>
            </div>

            {/* Stage label */}
            <div className="text-center">
              <p className="font-display font-semibold text-lg text-foreground">{stage.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{stage.detail}</p>
            </div>

            {/* Segmented progress bar */}
            <div className="w-full max-w-sm">
              <div className="flex gap-1.5 mb-3">
                {PROCESSING_STAGES.map((s, i) => {
                  const isCurrent = i === currentStageIndex;
                  const isComplete = i < currentStageIndex;
                  const segmentProgress = isCurrent
                    ? ((progress - s.min) / (s.max - s.min)) * 100
                    : 0;

                  return (
                    <div key={i} className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500 ease-out',
                          isComplete ? 'w-full gradient-primary' : isCurrent ? 'gradient-accent' : 'w-0'
                        )}
                        style={isCurrent ? { width: `${segmentProgress}%` } : undefined}
                      />
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center font-mono">{progress}% complete</p>
            </div>

            {/* Tip */}
            <div className="px-4 py-3 rounded-xl bg-muted/50 max-w-sm">
              <p className="text-xs text-muted-foreground text-center">
                <span className="font-semibold text-foreground/70">Tip:</span>{' '}
                {TIPS[tipIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // File selected state
  if (selectedFile && !isProcessing) {
    return (
      <div className={cn('w-full', className)}>
        <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/15 flex items-center justify-center">
              <FileText className="h-6 w-6 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={clearFile}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Remove file"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default upload zone
  return (
    <div className={cn('w-full', className)}>
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-300',
          isDragOver
            ? 'border-secondary bg-secondary/8 scale-[1.01] shadow-glow-accent'
            : 'border-border hover:border-primary/40 hover:bg-primary/[0.02] hover:shadow-sm'
        )}
      >
        <input
          type="file"
          onChange={handleFileInput}
          accept=".pdf,.pptx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Upload icon with shimmer effect */}
        <div className={cn(
          'h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300',
          isDragOver
            ? 'bg-secondary/15 scale-110'
            : 'bg-primary/8 animate-shimmer'
        )}>
          <Upload className={cn(
            'h-7 w-7 transition-colors duration-200',
            isDragOver ? 'text-secondary' : 'text-primary'
          )} />
        </div>

        <div className="text-center">
          <p className="font-display font-semibold text-foreground text-lg">
            {isDragOver ? 'Drop your deck here!' : 'Drop your presentation here'}
          </p>
          <p className="text-sm text-muted-foreground mt-1.5">or click to browse your files</p>
        </div>

        {/* File type badges */}
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
            <FileType className="h-3.5 w-3.5" />
            PDF
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
            <FileType className="h-3.5 w-3.5" />
            PPTX
          </div>
          <span className="px-3 py-1.5 text-xs text-muted-foreground/60">
            Max 30MB
          </span>
        </div>
      </label>
    </div>
  );
};

export default FileUpload;
