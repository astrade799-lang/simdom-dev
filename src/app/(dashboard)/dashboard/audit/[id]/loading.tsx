export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
      <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-48 bg-slate-200 rounded-xl animate-pulse" />
      <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
    </div>
  )
}