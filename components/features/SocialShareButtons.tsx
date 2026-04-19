'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Share2,
  Link,
  Image as ImageIcon,
  MessageCircle,
  Send,
  Mail,
  Check,
  X,
  Users,
  Download,
} from 'lucide-react';
import {
  shareNative,
  shareToClipboard,
  generateRecipeShareText,
  generateWeekMenuText,
  generateShoppingListText,
  generateInviteLink,
  generateInviteMessage,
  captureElementAsImage,
  downloadImage,
  canUseNativeShare,
  getWhatsAppShareUrl,
  getTelegramShareUrl,
  getEmailShareUrl,
} from '@/lib/features/socialSharing';
import { Week, Meal } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

interface SocialShareButtonsProps {
  meal?: Meal;
  week?: Week;
  type: 'recipe' | 'week' | 'shopping' | 'invite';
  householdId?: string;
  inviterName?: string;
  className?: string;
}

export function SocialShareButtons({
  meal,
  week,
  type,
  householdId,
  inviterName,
  className,
}: SocialShareButtonsProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const shareText = (() => {
    switch (type) {
      case 'recipe':
        return meal ? generateRecipeShareText(meal) : '';
      case 'week':
        return week ? generateWeekMenuText(week) : '';
      case 'shopping':
        return week ? generateShoppingListText(week) : '';
      case 'invite':
        return householdId && inviterName
          ? generateInviteMessage(generateInviteLink(householdId, 'INVITE'), inviterName)
          : '';
      default:
        return '';
    }
  })();

  const shareTitle = (() => {
    switch (type) {
      case 'recipe':
        return meal?.name || 'Recept';
      case 'week':
        return `Weekmenu Week ${week?.weekNumber}`;
      case 'shopping':
        return `Boodschappenlijst Week ${week?.weekNumber}`;
      case 'invite':
        return 'Uitnodiging voor huishouden';
      default:
        return 'Delen via Rut';
    }
  })();

  const handleNativeShare = useCallback(async () => {
    const success = await shareNative({
      title: shareTitle,
      text: shareText,
    });
    if (!success) {
      setShowShareModal(true);
    }
  }, [shareTitle, shareText]);

  const handleCopyLink = useCallback(async () => {
    const success = await shareToClipboard(shareText);
    if (success) {
      setCopied(true);
      toast.success('Gekopieerd naar klembord');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Kon niet kopiëren');
    }
  }, [shareText]);

  const handleCaptureImage = useCallback(async () => {
    if (!contentRef.current) return;

    setIsCapturing(true);
    const dataUrl = await captureElementAsImage(contentRef.current);
    setIsCapturing(false);

    if (dataUrl) {
      const filename = `rut-${type}-${new Date().toISOString().split('T')[0]}.png`;
      downloadImage(dataUrl, filename);
      toast.success('Afbeelding gedownload');
    } else {
      toast.error('Kon geen afbeelding maken');
    }
  }, [type]);

  const handleWhatsAppShare = useCallback(() => {
    const url = getWhatsAppShareUrl(shareText);
    window.open(url, '_blank');
  }, [shareText]);

  const handleTelegramShare = useCallback(() => {
    const url = getTelegramShareUrl(shareText);
    window.open(url, '_blank');
  }, [shareText]);

  const handleEmailShare = useCallback(() => {
    const url = getEmailShareUrl(shareTitle, shareText);
    window.open(url, '_blank');
  }, [shareTitle, shareText]);

  return (
    <>
      <button
        onClick={canUseNativeShare() ? handleNativeShare : () => setShowShareModal(true)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 bg-[#4A90A4] text-white rounded-lg hover:bg-[#3a7a8c] transition-colors',
          className
        )}
      >
        <Share2 className="w-4 h-4" />
        <span>Delen</span>
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Delen</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content Preview */}
            <div className="p-4">
              <div
                ref={contentRef}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4"
              >
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                  {shareText}
                </pre>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-4 gap-3">
                <ShareOption
                  icon={Link}
                  label={copied ? 'Gekopieerd!' : 'Kopieer'}
                  onClick={handleCopyLink}
                  active={copied}
                />
                <ShareOption
                  icon={ImageIcon}
                  label="Afbeelding"
                  onClick={handleCaptureImage}
                  loading={isCapturing}
                />
                <ShareOption
                  icon={MessageCircle}
                  label="WhatsApp"
                  onClick={handleWhatsAppShare}
                  color="#25D366"
                />
                <ShareOption
                  icon={Send}
                  label="Telegram"
                  onClick={handleTelegramShare}
                  color="#0088cc"
                />
              </div>

              {/* Email Option */}
              <button
                onClick={handleEmailShare}
                className="w-full mt-3 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Delen via e-mail</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface ShareOptionProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  active?: boolean;
  loading?: boolean;
  color?: string;
}

function ShareOption({ icon: Icon, label, onClick, active, loading, color }: ShareOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-xl transition-colors',
        active
          ? 'bg-green-100 dark:bg-green-900/30'
          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
      )}
    >
      {loading ? (
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      ) : (
        <Icon
          className="w-6 h-6"
          style={{ color: active ? '#22c55e' : color }}
        />
      )}
      <span className={cn(
        'text-xs',
        active ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
      )}>
        {label}
      </span>
    </button>
  );
}

// Invite Link Generator Component
interface InviteLinkGeneratorProps {
  householdId: string;
  inviterName: string;
  className?: string;
}

export function InviteLinkGenerator({ householdId, inviterName, className }: InviteLinkGeneratorProps) {
  const [inviteCode, setInviteCode] = useState(() => generateInviteCode());
  const [copied, setCopied] = useState(false);

  const inviteLink = generateInviteLink(householdId, inviteCode);

  const handleCopy = async () => {
    const success = await shareToClipboard(inviteLink);
    if (success) {
      setCopied(true);
      toast.success('Uitnodigingslink gekopieerd');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    setInviteCode(generateInviteCode());
    toast.success('Nieuwe uitnodigingslink gegenereerd');
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700', className)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-[#4A90A4]" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Huishouden uitnodigen</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Nodig gezinsleden uit</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-400 truncate">
          {inviteLink}
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            copied
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-[#4A90A4] text-white hover:bg-[#3a7a8c]'
          )}
        >
          {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
        </button>
      </div>

      <button
        onClick={handleRegenerate}
        className="w-full mt-2 text-sm text-[#4A90A4] hover:text-[#3a7a8c]"
      >
        Genereer nieuwe link
      </button>
    </div>
  );
}

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
