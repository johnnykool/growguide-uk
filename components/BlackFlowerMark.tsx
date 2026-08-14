import { useId } from "react";

interface BlackFlowerMarkProps {
  className?: string;
  title?: string;
}

export default function BlackFlowerMark({
  className,
  title,
}: BlackFlowerMarkProps) {
  const id = useId();
  const titleId = title ? `black-flower-title-${id}` : undefined;

  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-labelledby={titleId}
      aria-hidden={title ? undefined : true}
      focusable="false"
      data-black-flower="true"
      fill="currentColor"
    >
      {title && <title id={titleId}>{title}</title>}
      <path d="M16 13.9c-3.2-2.5-3.5-6.7 0-10.9 3.5 4.2 3.2 8.4 0 10.9Z" />
      <path d="M18 14.6c.5-4.1 3.8-6.9 9-6.9-1.1 5.3-4.6 7.8-9 6.9Z" />
      <path d="M17.3 18.2c4-1 7.9 1.2 9.6 6.3-5.3.5-8.9-1.8-9.6-6.3Z" />
      <path d="M14.7 18.2c-.7 4.5-4.3 6.8-9.6 6.3 1.7-5.1 5.6-7.3 9.6-6.3Z" />
      <path d="M14 14.6c-4.4.9-7.9-1.6-9-6.9 5.2 0 8.5 2.8 9 6.9Z" />
      <circle cx="16" cy="16" r="3.1" />
    </svg>
  );
}
