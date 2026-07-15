export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-12 border-b border-slate-100 px-4 flex items-center gap-4">
            <div className="h-3 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}