export default function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-md border border-black/10 bg-black/5 px-4 py-3.5 backdrop-blur-xl">
      <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-accent" />
    </div>
  );
}
