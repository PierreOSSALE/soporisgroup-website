// components/ui/OptimizedImage.tsx
import NextImage, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  isHero?: boolean;
  isAvatar?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  isHero = false,
  isAvatar = false,
  width,
  height,
  quality = 85,
  className = "",
  ...props
}: OptimizedImageProps) {
  // Déterminer la qualité optimale
  const optimizedQuality = isAvatar ? 75 : isHero ? 90 : quality;

  // Dimensions par défaut pour avatars
  const optimizedWidth = isAvatar ? 48 : width;
  const optimizedHeight = isAvatar ? 48 : height;

  return (
    <NextImage
      src={src}
      alt={alt}
      width={optimizedWidth}
      height={optimizedHeight}
      quality={optimizedQuality}
      priority={isHero}
      loading={isHero ? "eager" : "lazy"}
      className={`object-cover ${className}`}
      sizes={
        isHero
          ? "100vw"
          : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      }
      {...props}
    />
  );
}
