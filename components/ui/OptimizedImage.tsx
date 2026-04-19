'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  containerClassName,
  priority = false,
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generate a simple blur placeholder if none provided
  const defaultBlur = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YxZjVmOSIvPjwvc3ZnPg==';

  if (error) {
    return (
      <div 
        className={cn(
          "bg-gray-100 flex items-center justify-center",
          containerClassName
        )}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-gray-400 text-sm">Afbeelding niet beschikbaar</span>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        isLoading && "animate-pulse",
        containerClassName
      )}
      style={!fill ? { width, height } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL || defaultBlur}
        className={cn(
          "transition-all duration-300",
          isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

// Recipe image component with fixed aspect ratio
interface RecipeImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function RecipeImage({ src, alt, className }: RecipeImageProps) {
  if (!src) {
    return (
      <div className={cn(
        "bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center",
        className
      )}>
        <span className="text-4xl">🍽️</span>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      containerClassName={cn("relative aspect-video", className)}
    />
  );
}

// Avatar image component
interface AvatarImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarImage({ src, alt, size = 'md', className }: AvatarImageProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  if (!src) {
    return (
      <div className={cn(
        "bg-[#4A90A4] rounded-full flex items-center justify-center text-white font-semibold",
        sizeClasses[size],
        className
      )}>
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={cn("object-cover rounded-full", className)}
      containerClassName={cn("relative rounded-full overflow-hidden", sizeClasses[size], className)}
    />
  );
}