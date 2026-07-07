import React, { useEffect, useState } from 'react';
import { AlertTriangle, Brain, KeyRound, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const AI_CONTEXT_STORAGE_KEY = 'pitchcoach_ai_context';

interface UserSettingsDialogProps {
  children: React.ReactNode;
}

const UserSettingsDialog: React.FC<UserSettingsDialogProps> = ({ children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [aiContext, setAiContext] = useState('');
  const [isSavingContext, setIsSavingContext] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (open) {
      setAiContext(localStorage.getItem(AI_CONTEXT_STORAGE_KEY) ?? '');
    }
  }, [open]);

  const handleSaveContext = () => {
    setIsSavingContext(true);
    const trimmedContext = aiContext.trim();

    if (trimmedContext) {
      localStorage.setItem(AI_CONTEXT_STORAGE_KEY, trimmedContext);
    } else {
      localStorage.removeItem(AI_CONTEXT_STORAGE_KEY);
    }

    setIsSavingContext(false);
    toast.success('AI context saved');
  };

  const handleResetPassword = async () => {
    setIsSendingReset(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.email) {
        throw new Error('No email address found for this account.');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send password reset email');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Delete your PitchCoach AI account? This permanently removes your login and cannot be undone.'
    );

    if (!confirmed) return;

    setIsDeletingAccount(true);
    try {
      const { error } = await supabase.functions.invoke('delete-account');
      if (error) throw error;

      localStorage.removeItem(AI_CONTEXT_STORAGE_KEY);
      await supabase.auth.signOut();
      toast.success('Account deleted');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete account');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account and personalize the coaching context PitchCoach AI uses for new decks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Context for AI</h3>
                <p className="text-sm text-muted-foreground">
                  Add reusable details like your role, audience, desired tone, industry, or presentation goals.
                </p>
              </div>
            </div>
            <Label htmlFor="ai-context" className="sr-only">Context for AI</Label>
            <Textarea
              id="ai-context"
              value={aiContext}
              onChange={(event) => setAiContext(event.target.value)}
              maxLength={1000}
              rows={6}
              placeholder="Example: I pitch to seed-stage investors. Keep guidance concise, confident, and metrics-focused."
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{aiContext.length}/1000 characters</span>
              <Button onClick={handleSaveContext} disabled={isSavingContext}>
                {isSavingContext ? 'Saving...' : 'Save context'}
              </Button>
            </div>
          </section>

          <section className="rounded-lg border border-border p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-secondary/10 p-2 text-secondary">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Reset password</h3>
                  <p className="text-sm text-muted-foreground">Send a password reset link to your account email.</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleResetPassword} disabled={isSendingReset}>
                {isSendingReset ? 'Sending...' : 'Send reset email'}
              </Button>
            </div>
          </section>

          <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-destructive/10 p-2 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Delete account</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your user account and sign out.</p>
                </div>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeletingAccount}>
                {isDeletingAccount ? 'Deleting...' : 'Delete account'}
              </Button>
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-destructive" />
              This action cannot be undone.
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsDialog;
