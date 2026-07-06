export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return <div className="p-8 text-center text-muted">{message}</div>;
}
