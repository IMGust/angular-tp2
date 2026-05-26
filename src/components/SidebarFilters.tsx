"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

export const SidebarFilters: React.FC = () => {
  const {
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    materialFilter,
    setMaterialFilter,
    clearFilters,
    selectedCategory
  } = useCart();

  // Dynamic filter items depending on the currently selected category
  const getFilterOptions = () => {
    switch (selectedCategory) {
      case "Motor":
        return [
          { value: "Todos", label: "TODAS AS PEÇAS DE MOTOR" },
          { value: "Forjado", label: "FORJADOS (PISTÕES/BIELAS)" },
          { value: "Ferro", label: "BLOCO EM FERRO NODULAR" },
          { value: "Alumínio", label: "CABEÇOTE EM ALUMÍNIO" },
          { value: "RWD", label: "COMPATÍVEL TRAÇÃO (RWD)" }
        ];
      case "Turbo":
        return [
          { value: "Todos", label: "TODAS AS OPÇÕES DE TURBO" },
          { value: "Rolamento", label: "DUPLO ROLAMENTO CERÂMICO" },
          { value: "Inconel", label: "TURBINA DE INCONEL" },
          { value: "Aço", label: "AÇO INOX NITRETADO" },
          { value: "Gate", label: "VÁLVULA WASTEGATE / GATE" }
        ];
      case "Radiador":
        return [
          { value: "Todos", label: "TODOS OS RADIADORES" },
          { value: "Billet", label: "ALUMÍNIO BILLET 6061-T6" },
          { value: "Carbono", label: "SUPORTES EM CARBONO" },
          { value: "bar", label: "PRESSÃO MÁXIMA (BAR)" }
        ];
      case "Supercharger":
        return [
          { value: "Todos", label: "TODOS OS SUPERCHARGERS" },
          { value: "TVS", label: "ROTORES TVS" },
          { value: "Anodizado", label: "ALUMÍNIO ANODIZADO 7075" },
          { value: "Polia", label: "POLIA DE ACOPLAMENTO" }
        ];
      case "Veículo":
        return [
          { value: "Todos", label: "TODAS AS PEÇAS DE CHASSIS" },
          { value: "Carbono", label: "CARBONO DRY PRE-PREG" },
          { value: "Wishbone", label: "GEOMETRIA DUPLO WISHBONE" },
          { value: "Suspensão", label: "SUSPENSÃO INDEPENDENTE" }
        ];
      default:
        return [
          { value: "Todos", label: "TODOS OS COMPONENTES" },
          { value: "Alumínio", label: "ALUMÍNIO / BILLET" },
          { value: "Carbono", label: "FIBRA DE CARBONO" },
          { value: "Ferro", label: "FERRO NODULAR" },
          { value: "Aço", label: "AÇO INOX / INCONEL" }
        ];
    }
  };

  const filterOptions = getFilterOptions();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
  };

  return (
    <aside className="w-full lg:w-64 bg-white border border-gray-200 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-fit font-mono">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-brand-black">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>FILTROS ESPECÍFICOS</span>
        </div>
        <button
          onClick={clearFilters}
          className="text-[10px] text-gray-400 hover:text-brand-black transition-colors flex items-center gap-1 cursor-pointer"
          title="Resetar todos os filtros"
        >
          <RotateCcw className="h-2.5 w-2.5" />
          <span>LIMPAR</span>
        </button>
      </div>

      {/* Sorting */}
      <div className="mb-6">
        <label className="block text-[11px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
          ORDENAÇÃO TÉCNICA
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-brand-light border border-gray-200 text-xs py-2 px-3 rounded focus:outline-none focus:border-brand-black transition-all cursor-pointer text-brand-black font-mono"
        >
          <option value="default">PADRÃO</option>
          <option value="price-asc">PREÇO: CRESCENTE</option>
          <option value="price-desc">PREÇO: DECRESCENTE</option>
          <option value="name-asc">NOME: A-Z</option>
        </select>
      </div>

      {/* Price Slider */}
      <div className="mb-6">
        <div className="flex justify-between text-[11px] font-bold text-gray-400 tracking-wider mb-2">
          <span className="uppercase">FAIXA DE VALOR</span>
          <span className="text-brand-black">ATÉ $ {priceRange[1].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
        </div>
        <input
          type="range"
          min="0"
          max="15000"
          step="100"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full accent-brand-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-gray-400 mt-1">
          <span>$0.00</span>
          <span>$15,000.00</span>
        </div>
      </div>

      {/* Material Selection */}
      <div className="mb-2">
        <label className="block text-[11px] font-bold text-gray-400 tracking-wider mb-2.5 uppercase">
          MATERIAIS E COMPONENTES
        </label>
        <div className="space-y-1.5">
          {filterOptions.map((m) => {
            const isSelected = materialFilter === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setMaterialFilter(m.value)}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition-all flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? "bg-brand-black text-white"
                    : "hover:bg-brand-light text-gray-600 hover:text-brand-black"
                }`}
              >
                <span>{m.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
