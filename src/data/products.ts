export interface Product {
  id: string;
  name: string;
  category: "Radiador" | "Motor" | "Veículo" | "Supercharger" | "Turbo";
  price: number;
  partNumber: string;
  specs: {
    material: string;
    weight: string;
    dimensions: string;
    pressure?: string;
    compatibility: string;
  };
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "rad-01",
    name: "Radiador Aeroflow X-Series",
    category: "Radiador",
    price: 450.00,
    partNumber: "RAD-AERO-X95",
    specs: {
      material: "Alumínio Billet 6061-T6",
      weight: "4.8 kg",
      dimensions: "650mm x 420mm x 50mm",
      pressure: "2.2 bar",
      compatibility: "Universal Race Fit"
    },
    description: "Radiador de alta eficiência projetado para dissipação térmica extrema. Construção robusta com brasagem a vácuo e colmeia de triplo passe."
  },
  {
    id: "rad-02",
    name: "Radiador Monobloco Pro-Cool",
    category: "Radiador",
    price: 620.00,
    partNumber: "RAD-MONO-PC4",
    specs: {
      material: "Alumínio / Suportes em Fibra de Carbono",
      weight: "3.9 kg",
      dimensions: "720mm x 450mm x 55mm",
      pressure: "2.5 bar",
      compatibility: "Chassis Modular GT"
    },
    description: "Estrutura ultra-leve com tanques laterais usinados em CNC. Desenvolvido para equipes de endurance esportivo."
  },
  {
    id: "eng-01",
    name: "Motor de Bloco Curto V8 Apex-500",
    category: "Motor",
    price: 8200.00,
    partNumber: "ENG-V8-AP500",
    specs: {
      material: "Ferro Nodular Reforçado / Pistões Forjados",
      weight: "165.0 kg",
      dimensions: "840mm x 720mm x 680mm",
      compatibility: "Plataformas Tração Traseira RWD"
    },
    description: "Bloco de motor usinado de alta precisão. Equipado com pistões forjados I-Beam, bielas H-Beam e virabrequim equilibrado dinamicamente."
  },
  {
    id: "eng-02",
    name: "Cabeçote de Fluxo Rápido 16V CNC",
    category: "Motor",
    price: 1850.00,
    partNumber: "ENG-HEAD-16VCNC",
    specs: {
      material: "Alumínio Aeroespacial A356-T6",
      weight: "18.5 kg",
      dimensions: "480mm x 220mm x 140mm",
      compatibility: "Motores L4 DOHC Série K"
    },
    description: "Dutos de admissão e escape trabalhados em CNC de 5 eixos. Ângulos de válvula otimizados e molas de titânio de alta taxa de retorno."
  },
  {
    id: "veh-01",
    name: "Monocoque Chassis Carbono-X",
    category: "Veículo",
    price: 12500.00,
    partNumber: "VEH-CHAS-CX90",
    specs: {
      material: "Fibra de Carbono Dry Pre-Preg",
      weight: "72.0 kg",
      dimensions: "2850mm x 1120mm x 950mm",
      compatibility: "Protótipos Categoria LMP/Formula"
    },
    description: "Monocoque de segurança integrado com célula de sobrevivência aprovada pelas regulamentações de segurança internacionais."
  },
  {
    id: "veh-02",
    name: "Kit Suspensão Ajustável Track-Line",
    category: "Veículo",
    price: 3400.00,
    partNumber: "VEH-SUSP-TL2K",
    specs: {
      material: "Aço Cromo-Molibdênio 4130 / Alumínio",
      weight: "22.0 kg",
      dimensions: "Geometria Duplo Wishbone",
      compatibility: "Esportivos Médios / Cup Series"
    },
    description: "Kit completo de suspensão independente com braços ajustáveis e juntas esféricas do tipo esférico industrial de alta carga."
  },
  {
    id: "sup-01",
    name: "Supercompressor TVS-2300 Bolt-On",
    category: "Supercharger",
    price: 4800.00,
    partNumber: "SUP-TVS-2300",
    specs: {
      material: "Carcaça Alumínio Fundido / Rotores TVS",
      weight: "28.0 kg",
      dimensions: "420mm x 310mm x 250mm",
      pressure: "0.8 - 1.4 bar",
      compatibility: "Motores V8 5.0 / 6.2L"
    },
    description: "Supercompressor de deslocamento positivo com rotores de 4 lóbulos. Resposta instantânea de torque e intercooler água-ar integrado."
  },
  {
    id: "sup-02",
    name: "Polia de Pressão Regulável CNC",
    category: "Supercharger",
    price: 180.00,
    partNumber: "SUP-PUL-CNC80",
    specs: {
      material: "Alumínio Anodizado 7075-T6",
      weight: "0.45 kg",
      dimensions: "Diâmetro 80mm - 8 Costelas",
      compatibility: "Superchargers TVS/M90"
    },
    description: "Polia de acoplamento rápido e alta aderência. Reduz a patinação da correia sob rotações elevadas."
  },
  {
    id: "turb-01",
    name: "Turbocompressor G-35 Rolamentado",
    category: "Turbo",
    price: 2100.00,
    partNumber: "TRB-G35-BALL",
    specs: {
      material: "Inconel (Turbina) / Alumínio Billet (Rotor)",
      weight: "8.5 kg",
      dimensions: "290mm x 240mm x 210mm",
      pressure: "1.0 - 2.8 bar",
      compatibility: "Motores 2.0L a 4.5L"
    },
    description: "Rotor de compressão forjado de nova geração. Sistema de duplo rolamento cerâmico de esferas e carcaça quente em aço inoxidável."
  },
  {
    id: "turb-02",
    name: "Válvula Gate Eletrônica Wastegate",
    category: "Turbo",
    price: 380.00,
    partNumber: "TRB-WG-EL60",
    specs: {
      material: "Aço Inox Nitretado / Atuador Liga Aço",
      weight: "1.8 kg",
      dimensions: "Pistão de 60mm",
      pressure: "0.5 - 3.0 bar",
      compatibility: "Coletores de Escape T4/V-Band"
    },
    description: "Controle preciso de pressão via solenóide de alta frequência. Resposta imediata comandável diretamente pela ECU do motor."
  }
];
