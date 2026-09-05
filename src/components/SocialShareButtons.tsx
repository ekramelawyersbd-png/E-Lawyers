import { useState } from 'react';
import { Linkedin, Facebook, Twitter, Mail, Copy, Check, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';

// Standard official WhatsApp icon
function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.004 0C5.378 0 .008 5.37.008 12c0 2.115.55 4.183 1.597 6.002L.004 24l6.195-1.626C8.016 23.364 9.98 24 12.004 24c6.626 0 11.996-5.37 11.996-12S18.63 0 12.004 0zm0 21.84c-1.802 0-3.568-.485-5.112-1.402l-.367-.218-3.676.964.981-3.584-.239-.38C2.65 15.65 2.16 13.856 2.16 12 2.16 6.574 6.578 2.16 12.004 2.16c5.426 0 9.84 4.414 9.84 9.84s-4.414 9.84-9.84 9.84z"/>
      <path d="M17.472 14.382c-.301-.15-1.782-.88-2.057-.98-.275-.1-.475-.15-.675.15-.2.3-.775.98-.95 1.18-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.49-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.131-.611.136-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525s-.675-1.625-.925-2.225c-.244-.585-.492-.505-.675-.514-.175-.009-.375-.009-.575-.009s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.115 3.23 5.124 4.53.715.31 1.273.495 1.708.634.718.228 1.371.196 1.888.118.577-.087 1.782-.728 2.033-1.43.25-.702.25-1.303.175-1.43-.075-.127-.275-.202-.575-.352z"/>
    </svg>
  );
}

interface SocialShareButtonsProps {
  url?: string;
  title: string;
  summary?: string;
  variant?: 'top-bar' | 'bottom-bar' | 'compact' | 'full' | 'banner';
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
  const shareText = summary ? `${shareTitle} — ${summary}` : `${shareTitle} | Essential Bangladesh Legal & Tax Insights by Accounticca`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
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

  // 1. Top Social Sharing Bar: Clean, sleek bar with explicit LinkedIn, Facebook, and WhatsApp buttons
  if (variant === 'top-bar') {
    return (
      <div 
        id="top-article-social-share-bar"
        aria-label="Article social sharing bar (top)"
        className={cn(
          "bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs",
          className
        )}
      >
        {/* Label with professional context */}
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs sm:text-sm">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-900">Share Article:</span>
          <span className="hidden md:inline text-xs text-slate-500 font-normal">Disseminate to your professional network</span>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* LinkedIn */}
          <a
            id="top-share-linkedin-btn"
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on LinkedIn"
            aria-label="Share on LinkedIn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0A66C2] hover:bg-[#084e96] shadow-xs hover:shadow transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <Linkedin className="w-3.5 h-3.5 shrink-0" />
            <span>LinkedIn</span>
          </a>

          {/* Facebook */}
          <a
            id="top-share-facebook-btn"
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on Facebook"
            aria-label="Share on Facebook"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#1877F2] hover:bg-[#0e5fc5] shadow-xs hover:shadow transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <Facebook className="w-3.5 h-3.5 shrink-0" />
            <span>Facebook</span>
          </a>

          {/* WhatsApp */}
          <a
            id="top-share-whatsapp-btn"
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            title="Share via WhatsApp"
            aria-label="Share via WhatsApp"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#1faa52] shadow-xs hover:shadow transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
            <span>WhatsApp</span>
          </a>

          {/* Copy Link Button */}
          <div className="relative">
            <button
              id="top-share-copy-btn"
              type="button"
              onClick={handleCopyLink}
              title="Copy link to clipboard"
              aria-label="Copy link to clipboard"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border cursor-pointer",
                copied
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              )}
            >
              {copied ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
            {copied && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[11px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none animate-in fade-in zoom-in-95">
                Link copied!
              </div>
            )}
          </div>

          {/* Native Share button if supported */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              type="button"
              onClick={handleNativeShare}
              title="Share using your device"
              aria-label="Share using your device"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Share2 className="w-3 h-3 text-emerald-600" />
              <span className="hidden sm:inline">Device</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Compact variant for article meta row or sidebars
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

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          title="Share via WhatsApp"
          aria-label="Share via WhatsApp"
          className="p-2 text-slate-500 hover:text-white hover:bg-[#25D366] rounded-lg transition-all duration-150 group relative"
        >
          <WhatsAppIcon className="w-4 h-4" />
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

  // 3. Bottom Social Sharing Bar / Banner: High-impact professional dissemination section
  return (
    <section 
      id="bottom-article-social-share-bar"
      aria-label="Professional social sharing and dissemination bar (bottom)"
      className={cn(
        "bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-50 border border-emerald-100/90 rounded-3xl p-6 sm:p-7 my-10 shadow-xs",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-100/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Professional Networking &amp; Content Dissemination</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Share this statutory analysis with your legal &amp; accounting network
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
            Help fellow advocates, chartered accountants, and corporate leaders navigate statutory compliance and regulatory changes in Bangladesh.
          </p>
        </div>

        {/* Native share button if supported */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="sm:self-center inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share via Device</span>
          </button>
        )}
      </div>

      {/* Social Platforms Action Row */}
      <div className="pt-5 flex flex-wrap items-center gap-3">
        {/* LinkedIn Button - Primary professional channel */}
        <a
          id="bottom-share-linkedin-btn"
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0A66C2] hover:bg-[#084e96] shadow-xs hover:shadow transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <Linkedin className="w-4 h-4 shrink-0" />
          <span>Share on LinkedIn</span>
        </a>

        {/* Facebook Button */}
        <a
          id="bottom-share-facebook-btn"
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1877F2] hover:bg-[#0e5fc5] shadow-xs hover:shadow transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <Facebook className="w-4 h-4 shrink-0" />
          <span>Share on Facebook</span>
        </a>

        {/* WhatsApp Button - Very popular for chamber & audit firms */}
        <a
          id="bottom-share-whatsapp-btn"
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#1faa52] shadow-xs hover:shadow transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0" />
          <span>Share via WhatsApp</span>
        </a>

        {/* X / Twitter Button */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black shadow-xs hover:shadow transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <Twitter className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Post on X</span>
        </a>

        {/* Email Button */}
        <a
          href={shareLinks.email}
          title="Share via Email"
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-all duration-150 cursor-pointer"
        >
          <Mail className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Email</span>
        </a>

        {/* Copy Link Button */}
        <div className="relative">
          <button
            id="bottom-share-copy-btn"
            type="button"
            onClick={handleCopyLink}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 shadow-xs border cursor-pointer",
              copied
                ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300/50"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            )}
          >
            {copied ? <Check className="w-4 h-4 shrink-0" /> : <Copy className="w-4 h-4 text-slate-500 shrink-0" />}
            <span>{copied ? "Link Copied!" : "Copy Article Link"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

