import { useImageLoader } from '../hooks/useImageLoader';
import { ImageOff, Loader2 } from 'lucide-react';

export function MarkdownImage(props: any) {
  const { node, ...rest } = props;
  const { isLoaded, hasError } = useImageLoader(rest.src);
  
  return (
    <span className="my-8 flex flex-col items-center max-w-[70%] mx-auto w-full relative">
      {!isLoaded && !hasError && (
        <span className="w-full aspect-[4/3] sm:aspect-video bg-slate-100 flex items-center justify-center rounded-2xl border border-slate-200 animate-pulse">
           <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </span>
      )}
      {hasError && (
        <span className="w-full aspect-[4/3] sm:aspect-video bg-slate-50 flex flex-col items-center justify-center text-slate-400 rounded-2xl border border-slate-200">
          <ImageOff className="w-8 h-8 mb-2 text-slate-300" />
          <span className="text-sm">Image could not be loaded</span>
        </span>
      )}
      <img 
        {...rest} 
        className={`rounded-2xl border border-slate-200 shadow-md object-cover w-full transition-opacity duration-300 ${
          isLoaded && !hasError ? 'opacity-100' : 'hidden'
        }`} 
      />
      {rest.alt && isLoaded && !hasError && (
        <span className="text-center text-sm text-slate-500 mt-3 font-medium block">
          {rest.alt}
        </span>
      )}
    </span>
  );
}
