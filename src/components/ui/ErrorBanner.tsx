export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{message}</div>;
}
