"use client";

import React from "react";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { Heart, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

// Technical Line-Art Drawings for each part to give a premium CAD/blueprint look
const TechnicalDrawing: React.FC<{ productId: string; category: string }> = ({ productId, category }) => {
  const strokeColor = "#05070c";
  const gridColor = "rgba(5, 7, 12, 0.03)";

  const renderBlueprint = () => {
    switch (productId) {
      case "rad-01":
        return (
          <g>
            <rect x="35" y="45" width="130" height="70" rx="3" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <rect x="45" y="55" width="110" height="50" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            {/* Fins */}
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={i} x1={50 + i * 7} y1="55" x2={50 + i * 7} y2="105" stroke={strokeColor} strokeWidth="0.8" opacity="0.65" />
            ))}
            {/* Pipe connections */}
            <rect x="30" y="52" width="5" height="12" rx="0.5" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <rect x="165" y="96" width="5" height="12" rx="0.5" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            {/* Pressure Cap */}
            <path d="M92 45h16v-4H92v4Z" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            {/* Specs tag */}
            <text x="50" y="125" className="font-mono text-[8px] fill-current opacity-45">CORES: 3x-ROW PASS | W: 650mm</text>
          </g>
        );
      case "rad-02":
        return (
          <g>
            <rect x="40" y="40" width="120" height="80" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            {/* Carbon brackets */}
            <path d="M30 40h10v80H30z" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 1" />
            <path d="M160 40h10v80H160z" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 1" />
            {/* Core tubes */}
            {Array.from({ length: 9 }).map((_, i) => (
              <rect key={i} x="45" y={48 + i * 8} width="110" height="3" fill="none" stroke={strokeColor} strokeWidth="0.8" opacity="0.8" />
            ))}
            {/* Outlets */}
            <path d="M45 40v-6h12v6" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M143 120v6h12v-6" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <text x="45" y="135" className="font-mono text-[8px] fill-current opacity-45">SERIE: PRO-GT | PRESS: 2.5 BAR</text>
          </g>
        );
      case "eng-01":
        return (
          <g>
            {/* V8 engine outline */}
            <path d="M40 70 L65 40 L135 40 L160 70 L140 120 L60 120 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="75" cy="53" r="6" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <circle cx="125" cy="53" r="6" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <circle cx="100" cy="100" r="14" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="100" cy="100" r="4" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            {/* Pistons lines */}
            <line x1="100" y1="100" x2="80" y2="60" stroke={strokeColor} strokeWidth="1.2" />
            <line x1="100" y1="100" x2="120" y2="60" stroke={strokeColor} strokeWidth="1.2" />
            {/* Oil Pan */}
            <rect x="75" y="120" width="50" height="12" rx="1" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <text x="45" y="145" className="font-mono text-[8px] fill-current opacity-45">V8 CYL BLOCK | DYN-BAL: 0.00g</text>
          </g>
        );
      case "eng-02":
        return (
          <g>
            <rect x="35" y="55" width="130" height="55" rx="1" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            {/* Dual overhead cams */}
            <circle cx="65" cy="45" r="8" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <circle cx="135" cy="45" r="8" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <line x1="65" y1="45" x2="135" y2="45" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" />
            {/* Valve guides */}
            <path d="M60 55 L55 75" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M70 55 L75 75" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M130 55 L125 75" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M140 55 L145 75" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            {/* Spark plug hole */}
            <rect x="96" y="55" width="8" height="25" fill="none" stroke={strokeColor} strokeWidth="1" />
            <text x="38" y="125" className="font-mono text-[8px] fill-current opacity-45">DOHC 16V CNC | IN: 35mm EX: 30mm</text>
          </g>
        );
      case "veh-01":
        return (
          <g>
            {/* Chassis outline */}
            <path d="M25 105 L32 90 L60 90 L85 55 L135 55 L160 85 L175 90 L175 105 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M40 90 L52 50 L95 50 L85 90" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 2" />
            {/* Wheels area */}
            <circle cx="50" cy="105" r="14" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 2" />
            <circle cx="150" cy="105" r="14" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 2" />
            {/* Crash Box */}
            <rect x="15" y="93" width="10" height="12" fill="none" stroke={strokeColor} strokeWidth="1" />
            <text x="35" y="135" className="font-mono text-[8px] fill-current opacity-45">MONOCOQUE CORE | TOR-RIG: 45KN/DEG</text>
          </g>
        );
      case "veh-02":
        return (
          <g>
            {/* Suspension dampers / arms */}
            <line x1="30" y1="50" x2="80" y2="85" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="30" y1="110" x2="80" y2="85" stroke={strokeColor} strokeWidth="1.5" />
            {/* Coils */}
            <rect x="75" y="70" width="30" height="30" rx="1" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            {/* Coil Springs */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="75" y1={73 + i * 6} x2="105" y2={73 + i * 6} stroke={strokeColor} strokeWidth="1.5" />
            ))}
            {/* Wheel hub */}
            <rect x="135" y="65" width="20" height="40" rx="1" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            {/* Connections */}
            <line x1="105" y1="85" x2="135" y2="85" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 1" />
            <text x="35" y="135" className="font-mono text-[8px] fill-current opacity-45">DOUBLE WISHBONE | ADJ-SPRING RATE</text>
          </g>
        );
      case "sup-01":
        return (
          <g>
            {/* Supercharger casing */}
            <rect x="35" y="50" width="100" height="60" rx="10" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <rect x="135" y="65" width="20" height="30" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <circle cx="145" cy="80" r="6" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="145" cy="80" r="1.5" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            {/* Internal lobes */}
            <circle cx="65" cy="80" r="15" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
            <circle cx="95" cy="80" r="15" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
            {/* Intake port */}
            <path d="M50 50 L75 35 L110 35 L115 50" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <text x="38" y="130" className="font-mono text-[8px] fill-current opacity-45">TVS-2300 | 4-LOBE ROTORS 160-DEG</text>
          </g>
        );
      case "sup-02":
        return (
          <g>
            {/* Pulley profile */}
            <circle cx="100" cy="80" r="35" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="100" cy="80" r="25" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 1" />
            <circle cx="100" cy="80" r="12" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            {/* Bolt holes */}
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * 2 * Math.PI) / 6;
              const x = 100 + 19 * Math.cos(angle);
              const y = 80 + 19 * Math.sin(angle);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="none" stroke={strokeColor} strokeWidth="1" />;
            })}
            <text x="38" y="135" className="font-mono text-[8px] fill-current opacity-45">DIA: 80.00mm | 8-RIB BELT DRIVE</text>
          </g>
        );
      case "turb-01":
        return (
          <g>
            {/* Turbo Snail Shell */}
            <path d="M100 80 C130 80 145 100 145 120 C145 140 120 150 100 150 C70 150 45 125 45 95 C45 65 75 40 105 40 C125 40 145 52 150 70" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="95" cy="95" r="20" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            {/* Blades */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 2 * Math.PI) / 8;
              const x1 = 95 + 4 * Math.cos(angle);
              const y1 = 95 + 4 * Math.sin(angle);
              const x2 = 95 + 18 * Math.cos(angle);
              const y2 = 95 + 18 * Math.sin(angle);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth="1" />;
            })}
            {/* Inlet opening */}
            <path d="M45 95 H35 V125 H49" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <text x="45" y="32" className="font-mono text-[8px] fill-current opacity-45">G35-BALL | EX-A/R: 0.82 WG: EXT</text>
          </g>
        );
      case "turb-02":
        return (
          <g>
            {/* Wastegate profile */}
            <rect x="50" y="60" width="50" height="35" rx="3" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <rect x="100" y="70" width="60" height="15" fill="none" stroke={strokeColor} strokeWidth="1" />
            {/* Spring element */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={i} x1={105 + i * 8} y1="70" x2={109 + i * 8} y2="85" stroke={strokeColor} strokeWidth="1" />
            ))}
            {/* Rod actuator */}
            <line x1="40" y1="77" x2="50" y2="77" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="25" y1="77" x2="40" y2="77" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 1" />
            {/* Diaphragm casing */}
            <path d="M50 50h4v55h-4z" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <text x="35" y="125" className="font-mono text-[8px] fill-current opacity-45">WG ACTUATOR | PISTON: 60mm</text>
          </g>
        );
      default:
        return (
          <g>
            {/* Generic placeholder technical line */}
            <rect x="40" y="40" width="120" height="80" rx="4" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="40" y1="40" x2="160" y2="120" stroke={strokeColor} strokeWidth="1" />
            <line x1="160" y1="40" x2="40" y2="120" stroke={strokeColor} strokeWidth="1" />
            <text x="50" y="85" className="font-mono text-[10px] fill-current">{category.toUpperCase()}</text>
          </g>
        );
    }
  };

  return (
    <div className="w-full h-44 relative bg-[#fbfbfb] border border-gray-100 rounded flex items-center justify-center overflow-hidden">
      {/* CAD technical design lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={gridColor} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Crosshair target lines */}
        <line x1="10" y1="10" x2="25" y2="10" stroke="#05070c" strokeWidth="0.8" opacity="0.3" />
        <line x1="10" y1="10" x2="10" y2="25" stroke="#05070c" strokeWidth="0.8" opacity="0.3" />
        <line x1="190" y1="166" x2="190" y2="151" stroke="#05070c" strokeWidth="0.8" opacity="0.3" />
        <line x1="190" y1="166" x2="175" y2="166" stroke="#05070c" strokeWidth="0.8" opacity="0.3" />
      </svg>
      {/* Blueprint drawing */}
      <svg viewBox="0 0 200 176" width="100%" height="100%" fill="none" className="relative z-10">
        {renderBlueprint()}
      </svg>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const [added, setAdded] = React.useState(false);
  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-brand-black transition-all duration-200 hover:-translate-y-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_12px_rgba(5,7,12,0.03)]"
      id={`product-card-${product.id}`}
    >
      {/* Favorite Button */}
      <button
        onClick={() => toggleFavorite(product.id)}
        className="absolute top-6 right-6 z-20 p-1.5 bg-white/80 hover:bg-white border border-gray-100 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-gray-300 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
        title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        id={`fav-btn-${product.id}`}
      >
        <Heart className={`h-3.5 w-3.5 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      {/* Part Technical Drawing */}
      <TechnicalDrawing productId={product.id} category={product.category} />

      {/* Part Specifications */}
      <div className="mt-4 flex-grow font-mono">
        <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase block mb-1">
          {product.category}
        </span>
        <h3 className="text-sm font-bold text-brand-black tracking-tight leading-tight group-hover:text-brand-black/90 transition-colors">
          {product.name}
        </h3>
        <p className="text-[10px] text-gray-400 tracking-wider mt-1 block">
          P/N: {product.partNumber}
        </p>

        {/* Minimalist Specs Block */}
        <div className="mt-3 py-2 border-t border-b border-gray-100 grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-gray-500">
          <div>
            <span className="text-gray-400">MATER:</span> {product.specs.material.split(" ")[0]}
          </div>
          <div>
            <span className="text-gray-400">PESO:</span> {product.specs.weight || "N/D"}
          </div>
          {product.specs.pressure && (
            <div className="col-span-2">
              <span className="text-gray-400">PRESSÃO:</span> {product.specs.pressure}
            </div>
          )}
          <div className="col-span-2 truncate">
            <span className="text-gray-400">COMPAT:</span> {product.specs.compatibility}
          </div>
        </div>
      </div>

      {/* Pricing & Checkout Action */}
      <div className="mt-4 flex items-center justify-between gap-2 pt-2">
        <div className="font-mono">
          <span className="text-[10px] text-gray-400 block tracking-wider">UNIT VALUE</span>
          <span className="text-sm font-bold text-brand-black">
            $ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex items-center gap-1.5 py-2 px-3.5 rounded text-[10px] font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer ${
            added
              ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
              : "bg-brand-black text-white hover:bg-brand-black/90 border border-brand-black"
          }`}
          id={`add-btn-${product.id}`}
        >
          {added ? (
            <>
              <Check className="h-3 w-3" />
              <span>SALVO</span>
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" />
              <span>ADICIONAR</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
