import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 40"
        className="h-8 w-auto"
        
      >
        <circle cx="20" cy="20" r="18" fill="hsl(var(--primary))" />
        <path d="M20 2 A 18 18 0 0 0 20 38 A 18 18 0 0 0 20 2 Z" stroke="white" strokeOpacity="0.3" fill="none" />
        <path d="M2 20 H 38" stroke="white" strokeOpacity="0.3" fill="none" />

        <circle cx="20" cy="20" r="18" fill="url(#grad)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
        <defs>
            <radialGradient id="grad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" style={{stopColor: "hsl(var(--primary))", stopOpacity: 0.2}} />
            <stop offset="100%" style={{stopColor: "hsl(var(--primary))", stopOpacity: 1}} />
            </radialGradient>
        </defs>

        
        <circle cx="12" cy="15" r="1.5" fill="white" fillOpacity="0.8"/>
        <circle cx="28" cy="15" r="1.5" fill="white" fillOpacity="0.8"/>
        <circle cx="15" cy="25" r="1.5" fill="white" fillOpacity="0.8"/>
        <circle cx="25" cy="25" r="1.5" fill="white" fillOpacity="0.8"/>
        <circle cx="20" cy="10" r="1.5" fill="white" fillOpacity="0.8"/>
        <circle cx="20" cy="30" r="1.5" fill="white" fillOpacity="0.8"/>
        <circle cx="8" cy="22" r="1.5" fill="white" fillOpacity="0.8"/>
        
        <path d="M12 15 L 20 10 L 28 15 L 25 25 L 20 30 L 15 25 L 8 22 L 12 15" stroke="rgba(255,255,255,0.5)" strokeWidth="0.75" fill="none"/>
        <path d="M20 10 L 15 25" stroke="rgba(255,255,255,0.5)" strokeWidth="0.75" fill="none"/>
         <path d="M20 10 L 25 25" stroke="rgba(255,255,255,0.5)" strokeWidth="0.75" fill="none"/>

        <text x="48" y="27" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="hsl(var(--primary))">
          GL
        </text>
        
        <circle cx="100" cy="20" r="10" fill="hsl(var(--primary))" />
        <path d="M95 20 l4 4 l8 -8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />

        <text x="114" y="27" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="hsl(var(--primary))">
          BC
        </text>
         <text x="145" y="27" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="hsl(var(--accent))">
          ART
        </text>
      </svg>
    </div>
  );
}
