import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-brand-black text-white/50 border-t border-white/5 py-8 mt-auto font-mono text-[10px] tracking-wider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Trademark & Info */}
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-white font-bold tracking-[0.15em] uppercase">MOTOR-API CATALOG</span>
            <span>© {currentYear} MOTOR-API. TODOS OS DIREITOS RESERVADOS.</span>
          </div>

          {/* System Specs (Fitting the API Theme) */}
          <div className="flex items-center gap-6 text-center md:text-right text-[9px]">
            <div>
              <span className="text-white/30 block">API VERSION</span>
              <span className="text-white/70">v2.4.0-stable</span>
            </div>
            <div>
              <span className="text-white/30 block">LATENCY</span>
              <span className="text-white/70">0.02ms</span>
            </div>
            <div>
              <span className="text-white/30 block">STATUS</span>
              <span className="text-emerald-400 flex items-center gap-1 justify-center md:justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] text-white/30">
          <div>
            <span>SISTEMA DE DISTRIBUIÇÃO AUTOMOTIVA INDUSTRIAL HIGH-END</span>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white transition-colors">CONFIGURAÇÕES</Link>
            <Link href="/" className="hover:text-white transition-colors">TERMOS DE USO</Link>
            <Link href="/" className="hover:text-white transition-colors">API DOCS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
