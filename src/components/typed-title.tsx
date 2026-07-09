interface TypedTitleProps {
  text: string;
  className?: string;
}

export function TypedTitle({ text, className = "" }: TypedTitleProps) {
  return (
    <span className={className}>
      <span className="typed-reveal">{text}</span>
      <span className="caret ml-1" aria-hidden="true" />
    </span>
  );
}
