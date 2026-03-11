import React, { useState, useEffect } from 'react';
import { User, Building2, Briefcase, FileText, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useUserProfile, UserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

interface ProfilePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ open, onOpenChange }) => {
  const { profile, email, loading, saving, saveProfile } = useUserProfile();
  const [form, setForm] = useState<UserProfile>(profile);

  useEffect(() => {
    if (open) setForm(profile);
  }, [open, profile]);

  const handleSave = async () => {
    const result = await saveProfile(form);
    if (result.success) {
      toast.success('Profile saved');
      onOpenChange(false);
    } else {
      toast.error(result.error ?? 'Failed to save profile');
    }
  };

  const update = (field: keyof UserProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </DialogTitle>
          <DialogDescription>
            Add context about yourself to personalize your coaching experience. All fields are optional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Email</Label>
            <p className="text-sm">{email}</p>
          </div>

          <Separator />

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="displayName" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Name
            </Label>
            <Input
              id="displayName"
              placeholder="Your name"
              value={form.displayName}
              onChange={(e) => update('displayName', e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Company */}
          <div className="space-y-1.5">
            <Label htmlFor="companyName" className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              Company
            </Label>
            <Input
              id="companyName"
              placeholder="Your company or organization"
              value={form.companyName}
              onChange={(e) => update('companyName', e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label htmlFor="role" className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              Role / Title
            </Label>
            <Input
              id="role"
              placeholder="e.g. VP of Sales, Founder, Product Manager"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Bio / Context */}
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              About / Context
            </Label>
            <Textarea
              id="bio"
              placeholder="Brief background that helps the AI coach you better — e.g. industry, audience you typically present to, experience level"
              value={form.bio}
              onChange={(e) => update('bio', e.target.value)}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{form.bio.length}/500</p>
          </div>

          <Separator />

          {/* Custom AI Instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="customInstructions" className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              Custom AI Instructions
            </Label>
            <p className="text-xs text-muted-foreground">
              Tell the AI coach how you'd like your guides tailored — tone, focus areas, level of detail, or anything else.
            </p>
            <Textarea
              id="customInstructions"
              placeholder="e.g. Keep talking points casual and conversational. Focus heavily on data storytelling. Always suggest audience engagement moments. Use simple language — my audience is non-technical."
              value={form.customInstructions}
              onChange={(e) => update('customInstructions', e.target.value)}
              maxLength={1000}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">{form.customInstructions.length}/1000</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePanel;
