"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { Product } from "../../data/products";
import { 
  ShieldAlert, 
  Cpu, 
  Terminal as TerminalIcon, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  Check, 
  RotateCcw,
  Sparkles,
  Server,
  Layers,
  Database,
  Eye,
  FileText
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { products, addProduct, deleteProduct } = useCart();
  
  // Security state
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "cadastro" | "lista" | "simulador">("dashboard");

  // General Form States
  const [category, setCategory] = useState<"Motor" | "Pistão" | "Radiador" | "Supercharger" | "Turbo" | "Veículo">("Motor");
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodPartNumber, setProdPartNumber] = useState("");
  const [prodDescription, setProdDescription] = useState("");

  // Quarkus Field States
  // Motor Attributes
  const [motorCilindrada, setMotorCilindrada] = useState("5.0");
  const [motorPotencia, setMotorPotencia] = useState("500");
  const [motorTorque, setMotorTorque] = useState("650");
  const [motorTaxaCompressao, setMotorTaxaCompressao] = useState("10.5");
  const [motorRpmMax, setMotorRpmMax] = useState("7500");

  // Pistao Attributes
  const [pistaoMaterial, setPistaoMaterial] = useState("Forjado 2618");
  const [pistaoDiametro, setPistaoDiametro] = useState("85.5");
  const [pistaoCurso, setPistaoCurso] = useState("86.0");
  const [pistaoVolumeDomo, setPistaoVolumeDomo] = useState("-5.0");
  const [pistaoMarca, setPistaoMarca] = useState("Aero Racing");
  const [pistaoIdMotor, setPistaoIdMotor] = useState("1");

  // Radiador Attributes
  const [radiadorTipo, setRadiadorTipo] = useState("Alumínio Billet");
  const [radiadorCapFluido, setRadiadorCapFluido] = useState("4.5");
  const [radiadorDissipacao, setRadiadorDissipacao] = useState("45000");
  const [radiadorFileiras, setRadiadorFileiras] = useState("3");
  const [radiadorMarca, setRadiadorMarca] = useState("Pro-Cool");
  const [radiadorIdMotor, setRadiadorIdMotor] = useState("1");

  // SuperCharger Attributes
  const [superFabricante, setSuperFabricante] = useState("Eaton");
  const [superTipo, setSuperTipo] = useState("SCREW"); // Enum: CENTRIFUGAL, ROOTS, SCREW
  const [superTamanhoPolia, setSuperTamanhoPolia] = useState("80.0");
  const [superPadraoCorreia, setSuperPadraoCorreia] = useState("8PK");
  const [superIdAcionamento, setSuperIdAcionamento] = useState("1"); // CORREIA

  // Turbo Attributes
  const [turboFabricante, setTurboFabricante] = useState("Garrett");
  const [turboTipo, setTurboTipo] = useState("SINGLE"); // SINGLE, TWIN, VARIABLE
  const [turboBoost, setTurboBoost] = useState("2.2");
  const [turboIntercooler, setTurboIntercooler] = useState(true);
  const [turboQuantidade, setTurboQuantidade] = useState("1");
  const [turboLadoEscape, setTurboLadoEscape] = useState("0.82");
  const [turboLadoAdmissao, setTurboLadoAdmissao] = useState("0.70");
  const [turboIdFlange, setTurboIdFlange] = useState("2"); // V_BAND
  const [turboIdMancal, setTurboIdMancal] = useState("1"); // ROLAMENTO
  const [turboIdWastegate, setTurboIdWastegate] = useState("2"); // EXTERNA
  const [turboIdRefrigeracao, setTurboIdRefrigeracao] = useState("1"); // AGUA

  // Veiculo Attributes
  const [veiculoNome, setVeiculoNome] = useState("Corolla");
  const [veiculoModelo, setVeiculoModelo] = useState("XEI");
  const [veiculoAno, setVeiculoAno] = useState("2024");

  // General Notification / Status
  const [notification, setNotification] = useState("");
  const [quarkusPayload, setQuarkusPayload] = useState<any>(null);

  // Security Check
  useEffect(() => {
    const checkAdmin = () => {
      const logged = localStorage.getItem("motor_api_logged_in") === "true";
      const admin = localStorage.getItem("motor_api_is_admin") === "true";
      if (!logged || !admin) {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, []);

  // Sync / Generate live Quarkus JSON DTO
  useEffect(() => {
    let payload: any = {};
    if (category === "Motor") {
      payload = {
        nome: prodName || "Motor V8 Apex-500",
        cilindrada: parseFloat(motorCilindrada) || 0,
        potencia: parseInt(motorPotencia) || 0,
        torque: parseFloat(motorTorque) || 0,
        taxaCompressao: parseFloat(motorTaxaCompressao) || 0,
        rpmMax: parseInt(motorRpmMax) || 0,
        preco: parseFloat(prodPrice) || 0,
        idRadiadores: [],
        idPistoes: [],
        idVeiculos: [],
        idSobrealimentacao: null
      };
    } else if (category === "Pistão") {
      payload = {
        material: pistaoMaterial,
        diametro: parseFloat(pistaoDiametro) || 0,
        curso: parseFloat(pistaoCurso) || 0,
        volumeDomo: parseFloat(pistaoVolumeDomo) || 0,
        marca: pistaoMarca || "Aero Racing",
        preco: parseFloat(prodPrice) || 0,
        idMotor: parseInt(pistaoIdMotor) || null
      };
    } else if (category === "Radiador") {
      payload = {
        tipo: radiadorTipo,
        capacidadeFluidoLitros: parseFloat(radiadorCapFluido) || 0,
        dissipacaoTermicaBTU: parseFloat(radiadorDissipacao) || 0,
        fileiras: parseInt(radiadorFileiras) || 0,
        marca: radiadorMarca || "Pro-Cool",
        preco: parseFloat(prodPrice) || 0,
        idMotor: parseInt(radiadorIdMotor) || null
      };
    } else if (category === "Supercharger") {
      payload = {
        id: null,
        tipoSupercharger: superTipo,
        tamanhoPolia: parseFloat(superTamanhoPolia) || 0,
        padraoCorreia: superPadraoCorreia,
        idTipoAcionamento: parseInt(superIdAcionamento) || 1,
        fabricante: superFabricante || "Eaton"
      };
    } else if (category === "Turbo") {
      payload = {
        id: null,
        tipoTurbo: turboTipo,
        pressaoBoost: parseFloat(turboBoost) || 0,
        possuiIntercooler: turboIntercooler,
        quantidade: parseInt(turboQuantidade) || 1,
        fabricante: turboFabricante || "Garrett",
        ladoEscape: parseFloat(turboLadoEscape) || 0,
        ladoAdmissao: parseFloat(turboLadoAdmissao) || 0,
        idTipoFlange: parseInt(turboIdFlange) || 1,
        idTipoMancal: parseInt(turboIdMancal) || 1,
        idTipoWastegate: parseInt(turboIdWastegate) || 1,
        idSistemaRefrigeracao: parseInt(turboIdRefrigeracao) || 1
      };
    } else if (category === "Veículo") {
      payload = {
        id: null,
        nome: veiculoNome || "Corolla",
        modelo: veiculoModelo || "XEI",
        ano: parseInt(veiculoAno) || 2024
      };
    }
    setQuarkusPayload(payload);
  }, [
    category, prodName, prodPrice, motorCilindrada, motorPotencia, motorTorque,
    motorTaxaCompressao, motorRpmMax, pistaoMaterial, pistaoDiametro, pistaoCurso,
    pistaoVolumeDomo, pistaoMarca, pistaoIdMotor, radiadorTipo, radiadorCapFluido,
    radiadorDissipacao, radiadorFileiras, radiadorMarca, radiadorIdMotor, superFabricante,
    superTipo, superTamanhoPolia, superPadraoCorreia, superIdAcionamento, turboFabricante,
    turboTipo, turboBoost, turboIntercooler, turboQuantidade, turboLadoEscape, turboLadoAdmissao,
    turboIdFlange, turboIdMancal, turboIdWastegate, turboIdRefrigeracao, veiculoNome,
    veiculoModelo, veiculoAno
  ]);

  const handleLogout = () => {
    localStorage.removeItem("motor_api_logged_in");
    localStorage.removeItem("motor_api_is_admin");
    router.push("/login");
  };

  const handleRegisterComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      setNotification("ERRO: O NOME DO COMPONENTE É OBRIGATÓRIO.");
      return;
    }

    const priceNum = parseFloat(prodPrice) || 0;
    
    // Map custom technical attributes into standard specs interface of the Product
    let specs: any = {
      material: "Liga Padrão / Aço",
      weight: "1.0 kg",
      dimensions: "Padrão",
      compatibility: "Universal"
    };

    if (category === "Motor") {
      specs = {
        material: "Ferro Nodular / Cabeçote de Alumínio",
        weight: "140.0 kg",
        dimensions: `${motorCilindrada}L Cilindrada`,
        compatibility: `RWD Modular / Potência: ${motorPotencia} HP`
      };
    } else if (category === "Pistão") {
      specs = {
        material: pistaoMaterial,
        weight: "0.45 kg",
        dimensions: `D: ${pistaoDiametro}mm / C: ${pistaoCurso}mm`,
        compatibility: `ID Motor: ${pistaoIdMotor} / Domo: ${pistaoVolumeDomo}cc`
      };
    } else if (category === "Radiador") {
      specs = {
        material: `Alumínio / ${radiadorTipo}`,
        weight: "4.2 kg",
        dimensions: `Tanque Duplo / ${radiadorFileiras} Fileiras`,
        pressure: `${radiadorCapFluido} Litros / Dissipação: ${radiadorDissipacao} BTU`,
        compatibility: `ID Motor: ${radiadorIdMotor}`
      };
    } else if (category === "Supercharger") {
      specs = {
        material: `Carcaça Alumínio / Rotores ${superTipo}`,
        weight: "26.0 kg",
        dimensions: `Polia ${superTamanhoPolia}mm / Correia ${superPadraoCorreia}`,
        pressure: "1.2 bar",
        compatibility: `Acionamento Tipo ${superIdAcionamento} / Fabricante: ${superFabricante}`
      };
    } else if (category === "Turbo") {
      specs = {
        material: `Inconel / Rotor Billet / Fab: ${turboFabricante}`,
        weight: "9.0 kg",
        dimensions: `Escape: A/R ${turboLadoEscape} / Admissão: A/R ${turboLadoAdmissao}`,
        pressure: `${turboBoost} bar max / ${turboQuantidade}x Turbo`,
        compatibility: `Flange ID: ${turboIdFlange} / Mancal ID: ${turboIdMancal} / Refrigerado por ${turboIdRefrigeracao === "1" ? "Água" : "Óleo"}`
      };
    } else if (category === "Veículo") {
      specs = {
        material: "Monocoque Fibra de Carbono / Aço Reforçado",
        weight: "1100 kg",
        dimensions: `Ano Modelo: ${veiculoAno}`,
        compatibility: `Chassis ${veiculoModelo} / Fabricante: ${veiculoNome}`
      };
    }

    // Determine category matching standard enum
    let resolvedCategory: "Radiador" | "Motor" | "Veículo" | "Supercharger" | "Turbo" = "Motor";
    if (category === "Pistão") {
      resolvedCategory = "Motor"; // Map Pistao into Engine category
    } else if (category === "Radiador") {
      resolvedCategory = "Radiador";
    } else if (category === "Supercharger") {
      resolvedCategory = "Supercharger";
    } else if (category === "Turbo") {
      resolvedCategory = "Turbo";
    } else if (category === "Veículo") {
      resolvedCategory = "Veículo";
    }

    const newProduct: Product = {
      id: `${category.toLowerCase().substring(0,3)}-${Date.now()}`,
      name: prodName,
      category: resolvedCategory,
      price: priceNum,
      partNumber: prodPartNumber || `PART-${category.toUpperCase().substring(0,3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      specs,
      description: prodDescription || `Componente técnico do tipo ${category} registrado em conformidade com o back-end Quarkus.`
    };

    addProduct(newProduct);

    setNotification(`SUCESSO: COMPONENTE REGISTRADO NO BANCO LOCAL E MAPEADO COM SUCESSO!`);
    
    // Clear dynamic main fields
    setProdName("");
    setProdPrice("");
    setProdPartNumber("");
    setProdDescription("");
    
    // Open simulador tab to let them see
    setTimeout(() => {
      setNotification("");
      setActiveTab("lista");
    }, 2000);
  };

  // Security gate rendering if checking
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-black text-emerald-500 font-mono flex items-center justify-center">
        <div className="text-center p-8 border border-emerald-950 rounded bg-zinc-950/40">
          <TerminalIcon className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-xs uppercase tracking-widest">Iniciando protocolo de segurança...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-black text-red-500 font-mono flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center p-8 border border-red-900 rounded bg-red-950/10 shadow-[0_0_50px_rgba(239,68,68,0.05)]">
          <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-red-600 animate-pulse" />
          <h1 className="text-lg font-bold tracking-widest uppercase mb-2">ACESSO NÃO AUTORIZADO // 403</h1>
          <p className="text-xs text-zinc-500 leading-relaxed uppercase mb-6">
            Seu terminal não possui credenciais administrativas válidas para acessar a console de engenharia industrial.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-red-950/40 border border-red-800 text-red-400 hover:bg-red-900 hover:text-white px-4 py-2 rounded text-xs transition-all uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao login</span>
          </Link>
        </div>
      </div>
    );
  }

  // Count items for statistics
  const countByCategory = (cat: string) => {
    return products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* CAD Blueprint grids decorative background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="admin-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-grid)" />
        </svg>
      </div>

      {/* Admin Top Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 border border-zinc-800 text-emerald-500 rounded">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-zinc-500 tracking-wider uppercase font-bold">Terminal Central de Engenharia</span>
              </div>
              <h1 className="text-md font-bold tracking-widest text-zinc-100 uppercase">
                MOTOR-API // PAINEL DE CONTROLE
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              href="/"
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded text-[10px] tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="h-3 w-3" />
              <span>Ver Catálogo</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/60 hover:border-red-800 text-red-400 rounded text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
            >
              Desconectar
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-60 flex-shrink-0 flex flex-col gap-4">
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-lg p-4 flex flex-col gap-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2 block border-b border-zinc-900 pb-1.5">
              Menu de Módulos
            </span>
            
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left py-2 px-3 rounded text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors ${activeTab === "dashboard" ? "bg-zinc-900 text-emerald-400 border-l-2 border-emerald-500" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100"}`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab("cadastro")}
              className={`w-full text-left py-2 px-3 rounded text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors ${activeTab === "cadastro" ? "bg-zinc-900 text-emerald-400 border-l-2 border-emerald-500" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100"}`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Cadastrar Item</span>
            </button>

            <button
              onClick={() => setActiveTab("lista")}
              className={`w-full text-left py-2 px-3 rounded text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors ${activeTab === "lista" ? "bg-zinc-900 text-emerald-400 border-l-2 border-emerald-500" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100"}`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Banco Ativo ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("simulador")}
              className={`w-full text-left py-2 px-3 rounded text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors ${activeTab === "simulador" ? "bg-zinc-900 text-emerald-400 border-l-2 border-emerald-500" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100"}`}
            >
              <TerminalIcon className="h-3.5 w-3.5" />
              <span>Simulador Quarkus</span>
            </button>
          </div>

          {/* System status widget */}
          <div className="bg-zinc-900/20 border border-zinc-900/50 rounded-lg p-4 font-mono text-[9px] text-zinc-500 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="uppercase">BACKEND CONNECT</span>
              <span className="text-emerald-500 font-bold uppercase flex items-center gap-1">
                <Server className="h-2.5 w-2.5" /> COERENTE
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-900 pt-1.5">
              <span>ESTRUTURA DTO</span>
              <span className="text-zinc-400 font-bold">100% VALIDA</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SESSÃO ID</span>
              <span className="text-zinc-400">0xAC79-88F</span>
            </div>
          </div>
        </aside>

        {/* Tab Content Display Area */}
        <section className="flex-1 min-w-0">
          
          {notification && (
            <div className="mb-6 p-4 rounded bg-emerald-950/20 border border-emerald-800 text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.03)] animate-pulse">
              <span>{notification}</span>
              <Check className="h-4 w-4" />
            </div>
          )}

          {/* Tab 1: Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Componentes Totais</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-zinc-100">{products.length}</span>
                    <span className="text-[9px] text-zinc-500 uppercase">Unidades</span>
                  </div>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Motores & Peças</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-zinc-100">{countByCategory("Motor")}</span>
                    <span className="text-[9px] text-zinc-500 uppercase">Modelos</span>
                  </div>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Turbocompressores</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-zinc-100">{countByCategory("Turbo")}</span>
                    <span className="text-[9px] text-zinc-500 uppercase">Tipos</span>
                  </div>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Veículos & Chassis</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-zinc-100">{countByCategory("Veículo")}</span>
                    <span className="text-[9px] text-zinc-500 uppercase">Classes</span>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="p-4 bg-zinc-950 border border-zinc-800 text-emerald-500 rounded-full flex-shrink-0">
                  <Server className="h-8 w-8 animate-pulse" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">Backend quarkus-tp2 Conectado</span>
                    <span className="bg-emerald-950/50 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-800 uppercase">Ativo</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed uppercase">
                    O front-end está modelado em perfeita simetria com as classes Java de persistência Hibernate do Quarkus. Você pode cadastrar componentes mecanicos localmente e simular a comunicação REST no painel lateral.
                  </p>
                </div>
              </div>

              {/* Category distribution visualizer */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-lg p-6">
                <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-200 mb-6 flex items-center gap-2">
                  <Database className="h-3.5 w-3.5" />
                  <span>Distribuição no Catálogo Industrial</span>
                </h3>
                
                <div className="space-y-4">
                  {[
                    { name: "Motor (inclui Pistão)", count: countByCategory("Motor"), pct: Math.round((countByCategory("Motor") / Math.max(1, products.length)) * 100) },
                    { name: "Turbo", count: countByCategory("Turbo"), pct: Math.round((countByCategory("Turbo") / Math.max(1, products.length)) * 100) },
                    { name: "Radiador", count: countByCategory("Radiador"), pct: Math.round((countByCategory("Radiador") / Math.max(1, products.length)) * 100) },
                    { name: "Supercharger", count: countByCategory("Supercharger"), pct: Math.round((countByCategory("Supercharger") / Math.max(1, products.length)) * 100) },
                    { name: "Veículo", count: countByCategory("Veículo"), pct: Math.round((countByCategory("Veículo") / Math.max(1, products.length)) * 100) }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5 font-mono">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-zinc-300 uppercase">{item.name}</span>
                        <span className="text-zinc-500">{item.count} itens ({item.pct}%)</span>
                      </div>
                      <div className="h-2 bg-zinc-950 rounded overflow-hidden border border-zinc-900 flex">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500" 
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Register Component Form */}
          {activeTab === "cadastro" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Registration Form */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-lg p-6">
                <div className="mb-6">
                  <span className="text-[10px] text-zinc-500 tracking-wider uppercase block">Console do Engenheiro</span>
                  <h3 className="text-xs font-bold tracking-widest text-zinc-200 uppercase">
                    Novo Componente Técnico
                  </h3>
                </div>

                <form onSubmit={handleRegisterComponent} className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">
                      Categoria / Tipo de Entidade (Quarkus)
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value as any);
                        setNotification("");
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer uppercase font-mono"
                    >
                      <option value="Motor">Motor (Motor.java)</option>
                      <option value="Pistão">Pistão (Pistao.java)</option>
                      <option value="Radiador">Radiador (Radiador.java)</option>
                      <option value="Supercharger">Supercharger (SuperCharger.java)</option>
                      <option value="Turbo">Turbo (Turbo.java)</option>
                      <option value="Veículo">Veículo (Veiculo.java)</option>
                    </select>
                  </div>

                  {/* General Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">
                        Nome do Componente
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Bloco Forjado V8 5.0"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs placeholder-zinc-700 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">
                        Preço Unitário (R$)
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        placeholder="Ex: 8500.00"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs placeholder-zinc-700 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">
                        Código / Part Number
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: ENG-V8-AP500 (Opcional)"
                        value={prodPartNumber}
                        onChange={(e) => setProdPartNumber(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs placeholder-zinc-700 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">
                        Fabricante / Marca
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Garrett, Apex Racing"
                        value={
                          category === "Motor" ? prodName.split(" ")[0] || "Apex" :
                          category === "Pistão" ? pistaoMarca :
                          category === "Radiador" ? radiadorMarca :
                          category === "Supercharger" ? superFabricante :
                          category === "Turbo" ? turboFabricante :
                          veiculoNome
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (category === "Pistão") setPistaoMarca(val);
                          else if (category === "Radiador") setRadiadorMarca(val);
                          else if (category === "Supercharger") setSuperFabricante(val);
                          else if (category === "Turbo") setTurboFabricante(val);
                          else setVeiculoNome(val);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs placeholder-zinc-700 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">
                      Descrição Ficha Técnica
                    </label>
                    <textarea
                      placeholder="Descrição sumária do item, aplicação e tolerâncias mecânicas."
                      rows={2}
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs placeholder-zinc-700 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* DYNAMIC FORM SEGMENTS PER CATEGORY */}
                  <div className="border-t border-zinc-900 pt-4 space-y-4">
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Cpu className="h-3 w-3" /> ATRIBUTOS EXCLUSIVOS DO ENTITY ({category.toUpperCase()})
                    </span>

                    {category === "Motor" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Cilindrada (L)</label>
                          <input type="number" step="0.1" value={motorCilindrada} onChange={(e)=>setMotorCilindrada(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Potência (HP)</label>
                          <input type="number" value={motorPotencia} onChange={(e)=>setMotorPotencia(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Torque (Nm)</label>
                          <input type="number" step="0.1" value={motorTorque} onChange={(e)=>setMotorTorque(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Taxa Compressão</label>
                          <input type="number" step="0.1" value={motorTaxaCompressao} onChange={(e)=>setMotorTaxaCompressao(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">RPM Máxima</label>
                          <input type="number" value={motorRpmMax} onChange={(e)=>setMotorRpmMax(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                      </div>
                    )}

                    {category === "Pistão" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Material Base</label>
                          <select value={pistaoMaterial} onChange={(e)=>setPistaoMaterial(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono uppercase">
                            <option value="Forjado 2618">Forjado 2618-T6</option>
                            <option value="Forjado 4032">Forjado 4032</option>
                            <option value="Fundido Eutético">Fundido Hipereutético</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">ID Motor Vínculo</label>
                          <input type="number" value={pistaoIdMotor} onChange={(e)=>setPistaoIdMotor(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Diâmetro (mm)</label>
                          <input type="number" step="0.1" value={pistaoDiametro} onChange={(e)=>setPistaoDiametro(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Curso do Pistão (mm)</label>
                          <input type="number" step="0.1" value={pistaoCurso} onChange={(e)=>setPistaoCurso(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Volume do Domo (cc)</label>
                          <input type="number" step="0.1" value={pistaoVolumeDomo} onChange={(e)=>setPistaoVolumeDomo(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                      </div>
                    )}

                    {category === "Radiador" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Tipo de Brasagem</label>
                          <input type="text" value={radiadorTipo} onChange={(e)=>setRadiadorTipo(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Fluido (Litros)</label>
                          <input type="number" step="0.1" value={radiadorCapFluido} onChange={(e)=>setRadiadorCapFluido(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Dissipação (BTU)</label>
                          <input type="number" value={radiadorDissipacao} onChange={(e)=>setRadiadorDissipacao(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Números de Fileiras</label>
                          <input type="number" value={radiadorFileiras} onChange={(e)=>setRadiadorFileiras(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">ID Motor Compatível</label>
                          <input type="number" value={radiadorIdMotor} onChange={(e)=>setRadiadorIdMotor(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                      </div>
                    )}

                    {category === "Supercharger" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Arquitetura de Rotores</label>
                          <select value={superTipo} onChange={(e)=>setSuperTipo(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono">
                            <option value="SCREW">PARAFUSO DUPLO (SCREW)</option>
                            <option value="ROOTS">DE TRÊS LÓBULOS (ROOTS)</option>
                            <option value="CENTRIFUGAL">CENTRIFUGO (CENTRIFUGAL)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Tamanho Polia (mm)</label>
                          <input type="number" step="0.1" value={superTamanhoPolia} onChange={(e)=>setSuperTamanhoPolia(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Padrão Correia</label>
                          <input type="text" value={superPadraoCorreia} onChange={(e)=>setSuperPadraoCorreia(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">ID Tipo Acionamento</label>
                          <select value={superIdAcionamento} onChange={(e)=>setSuperIdAcionamento(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono">
                            <option value="1">CORREIA (ID 1)</option>
                            <option value="2">ENGRENAGEM DIRETA (ID 2)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {category === "Turbo" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Layout do Turbo</label>
                          <select value={turboTipo} onChange={(e)=>setTurboTipo(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono">
                            <option value="SINGLE">SIMPLES (SINGLE)</option>
                            <option value="TWIN">BI-TURBO (TWIN)</option>
                            <option value="VARIABLE">GEOMETRIA VARIAVEL (VARIABLE)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Boost Máximo (bar)</label>
                          <input type="number" step="0.1" value={turboBoost} onChange={(e)=>setTurboBoost(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Turbo Quantidade</label>
                          <input type="number" value={turboQuantidade} onChange={(e)=>setTurboQuantidade(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Escape A/R</label>
                          <input type="number" step="0.01" value={turboLadoEscape} onChange={(e)=>setTurboLadoEscape(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Admissão A/R</label>
                          <input type="number" step="0.01" value={turboLadoAdmissao} onChange={(e)=>setTurboLadoAdmissao(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Intercooler integrado?</label>
                          <select value={turboIntercooler ? "yes" : "no"} onChange={(e)=>setTurboIntercooler(e.target.value === "yes")} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono">
                            <option value="yes">SIM</option>
                            <option value="no">NÃO</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Flange ID</label>
                          <select value={turboIdFlange} onChange={(e)=>setTurboIdFlange(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono">
                            <option value="1">T3 / T4 (ID 1)</option>
                            <option value="2">V-BAND (ID 2)</option>
                            <option value="3">MONO (ID 3)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Mancal ID</label>
                          <select value={turboIdMancal} onChange={(e)=>setTurboIdMancal(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono">
                            <option value="1">ROLAMENTO CERÂMICO (ID 1)</option>
                            <option value="2">BUCHA / CASQUILHO (ID 2)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Refrigeração ID</label>
                          <select value={turboIdRefrigeracao} onChange={(e)=>setTurboIdRefrigeracao(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono">
                            <option value="1">ÁGUA + ÓLEO (ID 1)</option>
                            <option value="2">EXCLUSIVA ÓLEO (ID 2)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {category === "Veículo" && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Fabricante</label>
                          <input type="text" value={veiculoNome} onChange={(e)=>setVeiculoNome(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Modelo Chassis</label>
                          <input type="text" value={veiculoModelo} onChange={(e)=>setVeiculoModelo(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Ano de Fabricação</label>
                          <input type="number" value={veiculoAno} onChange={(e)=>setVeiculoAno(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono" />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 rounded text-[11px] font-bold tracking-widest transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer mt-6 uppercase"
                  >
                    <Check className="h-4 w-4 stroke-[2.5]" />
                    <span>Cadastrar & Sincronizar</span>
                  </button>
                </form>
              </div>

              {/* Live Quarkus Code integration preview */}
              <div className="flex flex-col gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex-1 flex flex-col justify-between font-mono">
                  
                  {/* Console Top Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <TerminalIcon className="h-4 w-4 text-emerald-400" />
                      <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
                        CONSOLE DE SINAL QUARKUS (REAL-TIME DTO)
                      </span>
                    </div>
                    <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900 font-bold uppercase">
                      Pronto
                    </span>
                  </div>

                  {/* REST endpoint path representation */}
                  <div className="bg-zinc-950 border border-zinc-850 p-2.5 rounded text-[10px] mb-4">
                    <span className="text-purple-400 font-bold uppercase">MÉTODO: </span>
                    <span className="text-emerald-400 font-bold">POST</span>
                    <span className="text-zinc-500 block sm:inline sm:ml-4">
                      <span className="text-zinc-400 font-bold">ENDPOINT: </span>
                      <span className="text-blue-400 font-bold">
                        http://localhost:8080/api/{category === "Pistão" ? "pistao" : category === "Veículo" ? "veiculo" : category.toLowerCase()}
                      </span>
                    </span>
                  </div>

                  {/* Highlighted JSON code box */}
                  <div className="flex-1 bg-zinc-950 border border-zinc-850 p-4 rounded text-[10px] text-emerald-300 leading-relaxed overflow-x-auto select-all max-h-96 min-h-64 font-mono">
                    <pre>{JSON.stringify(quarkusPayload, null, 2)}</pre>
                  </div>

                  {/* Foot Note */}
                  <div className="mt-4 pt-3 border-t border-zinc-800 text-[9px] text-zinc-500 leading-normal uppercase">
                    Ao clicar em cadastrar, este DTO serializado é convertido em um objeto tipado no client e armazenado na persistência local, replicando de forma idêntica o comportamento de recepção da classe 
                    <span className="text-zinc-400 font-bold"> {category === "Pistão" ? "PistaoResource.java" : category === "Supercharger" ? "SuperChargerResource.java" : `${category}Resource.java`}</span> do backend.
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* Tab 3: Active Active Database Table list */}
          {activeTab === "lista" && (
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-lg p-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] text-zinc-500 tracking-wider uppercase block">Banco de Dados Ativo</span>
                  <h3 className="text-xs font-bold tracking-widest text-zinc-200 uppercase">
                    Componentes Cadastrados no Sistema
                  </h3>
                </div>
                
                <span className="text-[10px] bg-zinc-900 border border-zinc-850 text-zinc-400 px-3 py-1.5 rounded font-bold uppercase">
                  {products.length} Componentes Ativos
                </span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-zinc-900 rounded bg-zinc-950/40">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[9px]">
                      <th className="p-3">Código</th>
                      <th className="p-3">Nome / Detalhe</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Materiais / Especificação</th>
                      <th className="p-3 text-right">Preço</th>
                      <th className="p-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-600 uppercase">
                          Nenhum componente cadastrado no terminal local.
                        </td>
                      </tr>
                    ) : (
                      products.map((item, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/20 text-zinc-300">
                          <td className="p-3 font-bold text-zinc-500 whitespace-nowrap">{item.partNumber}</td>
                          <td className="p-3">
                            <span className="block text-zinc-100 font-bold uppercase">{item.name}</span>
                            <span className="block text-[9px] text-zinc-500 mt-0.5 line-clamp-1">{item.description}</span>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] uppercase tracking-wider font-bold">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3 text-[10px]">
                            <span className="block text-zinc-400"><strong className="text-zinc-500">Mat:</strong> {item.specs.material}</span>
                            <span className="block text-zinc-500 mt-0.5 text-[9px]"><strong className="text-zinc-600">Dim:</strong> {item.specs.dimensions}</span>
                          </td>
                          <td className="p-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                            R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => {
                                deleteProduct(item.id);
                                setNotification("SUCESSO: COMPONENTE DELETADO COM PROTOCOLO DE SEGURANÇA.");
                                setTimeout(() => setNotification(""), 1500);
                              }}
                              className="p-1.5 bg-red-950/20 hover:bg-red-950/60 border border-red-900/40 text-red-400 hover:text-white rounded transition-colors cursor-pointer"
                              title="Remover Componente"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Tab 4: Simulation walkthrough */}
          {activeTab === "simulador" && (
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-lg p-6 space-y-6">
              <div>
                <span className="text-[10px] text-zinc-500 tracking-wider uppercase block">Simulação de Fluxo</span>
                <h3 className="text-xs font-bold tracking-widest text-zinc-200 uppercase">
                  Terminal de Integração Quarkus API
                </h3>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed uppercase">
                Este painel ilustra de que forma os componentes criados no front-end são mapeados para a arquitetura de endpoints do backend Quarkus. Ao realizar chamadas HTTP no backend real, o Quarkus recebe e desserializa as seguintes estruturas de dados JSON nas classes de recurso REST:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Endpoint block 1 */}
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded font-mono">
                  <div className="flex items-center justify-between mb-3 text-[10px] border-b border-zinc-900 pb-2">
                    <span className="text-emerald-400 font-bold uppercase">POST /api/motor</span>
                    <span className="text-zinc-500">MotorResource.java</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed uppercase mb-3">
                    Cadastra um bloco de motor padrão ou forjado. Permite mapear listas de IDs de radiadores, pistões e veículos compatíveis de forma relacional.
                  </p>
                  <div className="bg-zinc-900/50 p-2.5 rounded text-[8px] text-emerald-300 overflow-x-auto max-h-24">
                    <pre>{`public record MotorDTO(
  Long id, String nome, Double cilindrada, Integer potencia, 
  Double torque, Double taxaCompressao, Integer rpmMax, Double preco,
  List<Long> idRadiadores, List<Long> idPistoes, List<Long> idVeiculos, 
  Long idSobrealimentacao
) {}`}</pre>
                  </div>
                </div>

                {/* Endpoint block 2 */}
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded font-mono">
                  <div className="flex items-center justify-between mb-3 text-[10px] border-b border-zinc-900 pb-2">
                    <span className="text-emerald-400 font-bold uppercase">POST /api/pistao</span>
                    <span className="text-zinc-500">PistaoResource.java</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed uppercase mb-3">
                    Registra um kit de pistões forjados ou fundidos, vinculando-o diretamente à chave estrangeira de um motor cadastrado por meio do campo <strong className="text-zinc-400">idMotor</strong>.
                  </p>
                  <div className="bg-zinc-900/50 p-2.5 rounded text-[8px] text-emerald-300 overflow-x-auto max-h-24">
                    <pre>{`public record PistaoDTO(
  String material, Double diametro, Double curso, 
  Double volumeDomo, String marca, BigDecimal preco, Long idMotor
) {}`}</pre>
                  </div>
                </div>

                {/* Endpoint block 3 */}
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded font-mono">
                  <div className="flex items-center justify-between mb-3 text-[10px] border-b border-zinc-900 pb-2">
                    <span className="text-emerald-400 font-bold uppercase">POST /api/turbo</span>
                    <span className="text-zinc-500">TurboResource.java</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed uppercase mb-3">
                    Cria uma entidade de turbocompressor herdada de Sobrealimentacao, incluindo especificações físicas detalhadas e chaves de junção para flanges, mancais e wastegate.
                  </p>
                  <div className="bg-zinc-900/50 p-2.5 rounded text-[8px] text-emerald-300 overflow-x-auto max-h-24">
                    <pre>{`public record TurboDTO(
  Long id, TipoTurbo tipoTurbo, Double pressaoBoost, Boolean possuiIntercooler,
  Integer quantidade, String fabricante, Double ladoEscape, Double ladoAdmissao,
  Integer idTipoFlange, Integer idTipoMancal, Integer idTipoWastegate, Integer idSistemaRefrigeracao
) {}`}</pre>
                  </div>
                </div>

                {/* Endpoint block 4 */}
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded font-mono">
                  <div className="flex items-center justify-between mb-3 text-[10px] border-b border-zinc-900 pb-2">
                    <span className="text-emerald-400 font-bold uppercase">POST /api/radiador</span>
                    <span className="text-zinc-500">RadiadorResource.java</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed uppercase mb-3">
                    Adiciona tanques de arrefecimento e radiadores de alta eficiência associados a um bloco de motor específico.
                  </p>
                  <div className="bg-zinc-900/50 p-2.5 rounded text-[8px] text-emerald-300 overflow-x-auto max-h-24">
                    <pre>{`public record RadiadorDTO(
  String tipo, Double capacidadeFluidoLitros, Double dissipacaoTermicaBTU,
  Integer fileiras, String marca, BigDecimal preco, Long idMotor
) {}`}</pre>
                  </div>
                </div>

              </div>

            </div>
          )}

        </section>

      </main>

      {/* Admin Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-12 relative z-10 text-[9px] text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <span>MOTOR-API CONTROLE ADMINISTRATIVO DE COMPONENTES</span>
          <span className="flex items-center gap-1"><Server className="h-3 w-3" /> CONEXÃO ESTRUTURADA // HIBERNATE JPA & RESTEASY</span>
          <span>© 2026 MOTOR-API</span>
        </div>
      </footer>

    </div>
  );
}
