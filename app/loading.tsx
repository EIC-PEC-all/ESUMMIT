export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07130F] text-white">
      <div className="relative flex items-center justify-center">
        {/* Subtle spinning track */}
        <div className="h-12 w-12 rounded-full border-2 border-white/10 border-t-mint animate-spin" />
        <div className="absolute font-mono-data text-[9px] font-black tracking-widest text-mint uppercase">
          PEC
        </div>
      </div>
      <p className="mt-4 font-mono-data text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase">
        Loading E-Summit...
      </p>
    </div>
  )
}