interface BrandMarkProps {
  className?: string;
  title?: string;
}

export default function BrandMark({ className, title }: BrandMarkProps) {
  const titleId = title ? "rainline-gg-title" : undefined;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-labelledby={titleId}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title && <title id={titleId}>{title}</title>}
      <path d="M14 8v17c0 15 10 27 25 27h11V37H38" />
      <path d="M30 8v13c0 10 7 18 17 18h7V26H43" />
    </svg>
  );
}
