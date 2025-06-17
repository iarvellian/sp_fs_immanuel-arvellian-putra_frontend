export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/60 z-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
