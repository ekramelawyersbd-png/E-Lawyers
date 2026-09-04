import { useState } from 'react';
import { Linkedin, Facebook, Twitter, Mail, Copy, Check, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface SocialShareButtonsProps {
  url?: string;
  title: string;
  summary?: string;
  variant?: 'compact' | 'full' | 'banner';
  className?: string;
}

export function SocialShareButtons({
  url,
  title,
  summary,
  variant = 'compact',
  className = '',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Derive target URL
  const shareUrl = typeof window !== 'undefined' ? (url ? (url.startsWith('http') ? url : `${window.location.origin}${url}`) : window.location.href) : '';
  const shareTitle = title || 'Accounticca Legal & Tax Insights';
  const shareText = summary || `${shareTitle} - Essential legal and tax insights for Bangladesh.`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  // Compact variant for article header / meta row
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
          className="p-2 text-slate-500 hover:text-white hover:bg-[#0A66C2] rounded-lg transition-all duration-150 group relative"
        >
          <Linkedin className="w-4 h-4" />
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
          aria-label="Share on Facebook"
          className="p-2 text-slate-500 hover:text-white hover:bg-[#1877F2] rounded-lg transition-all duration-150 group relative"
        >
          <Facebook className="w-4 h-4" />
        </a>

        {/* X / Twitter */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X (Twitter)"
          aria-label="Share on X (Twitter)"
          className="p-2 text-slate-500 hover:text-white hover:bg-slate-900 rounded-lg transition-all duration-150 group relative"
        >
          <Twitter className="w-4 h-4" />
        </a>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          title="Share via WhatsApp"
          aria-label="Share via WhatsApp"
          className="p-2 text-slate-500 hover:text-white hover:bg-[#25D366] rounded-lg transition-all duration-150 group relative"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>

        {/* Copy Link */}
        <div className="relative">
          <button
            onClick={handleCopyLink}
            type="button"
            title="Copy link to clipboard"
            aria-label="Copy link to clipboard"
            className={cn(
              "p-2 rounded-lg transition-all duration-150 flex items-center gap-1",
              copied 
                ? "bg-emerald-100 text-emerald-700 font-bold" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          {copied && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[11px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none animate-in fade-in zoom-in-95">
              Link copied!
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full / Banner variant (rich card displayed under or along the article content)
  return (
    <section 
      aria-label="Social media sharing"
      className={cn(
        "bg-gradient-to-r from-slate-50 via-emerald-50/40 to-slate-50 border border-emerald-100 rounded-3xl p-6 sm:p-7 my-10 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-100/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share This Legal &amp; Tax Insight</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Know someone who would benefit from this analysis?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Share this statutory breakdown directly with your professional network or corporate team.
          </p>
        </div>

        {/* Native share button if supported */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="sm:self-center inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-sm shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share via Device</span>
          </button>
        )}
      </div>

      {/* Social Platforms Action Row */}
      <div className="pt-5 flex flex-wrap items-center gap-3">
        {/* LinkedIn Button */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0A66C2] hover:bg-[#084e96] shadow-sm hover:shadow transition-all duration-150 active:scale-95"
        >
          <Linkedin className="w-4 h-4" />
          <span>Share on LinkedIn</span>
        </a>

        {/* Facebook Button */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1877F2] hover:bg-[#0e5fc5] shadow-sm hover:shadow transition-all duration-150 active:scale-95"
        >
          <Facebook className="w-4 h-4" />
          <span>Facebook</span>
        </a>

        {/* X / Twitter Button */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black shadow-sm hover:shadow transition-all duration-150 active:scale-95"
        >
          <Twitter className="w-4 h-4" />
          <span>Post to X</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#1faa52] shadow-sm hover:shadow transition-all duration-150 active:scale-95"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span>WhatsApp</span>
        </a>

        {/* Email Button */}
        <a
          href={shareLinks.email}
          title="Share via Email"
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all duration-150"
        >
          <Mail className="w-4 h-4 text-slate-500" />
          <span>Email</span>
        </a>

        {/* Copy Link Button */}
        <div className="relative">
          <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 shadow-sm border",
              copied
                ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300/50"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? "Link Copied!" : "Copy Article Link"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
