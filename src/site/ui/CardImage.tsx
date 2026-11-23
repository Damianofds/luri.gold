import { assetUrl } from "../assets";

export function CardImage({ path, alt, className, eager = false }: {
  path: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const responsive = import.meta.env.PROD && !/^https?:\/\//i.test(path);
  const source = (width: number) => `${import.meta.env.BASE_URL}site-assets/cards/${path}.${width}.webp`;
  return (
    <img
      className={className}
      src={responsive ? source(640) : assetUrl(path)}
      srcSet={responsive ? [320, 640, 960].map((width) => `${source(width)} ${width}w`).join(", ") : undefined}
      sizes={responsive ? "(max-width: 990px) 50vw, (max-width: 1440px) 33vw, 480px" : undefined}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      width={640}
      height={640}
    />
  );
}
