import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MotorService } from '../../services/motor.service';
import { PistaoService } from '../../services/pistao.service';
import { RadiadorService } from '../../services/radiador.service';
import { TurboService } from '../../services/turbo.service';
import { SuperChargerService } from '../../services/super-charger.service';
import { VeiculoService } from '../../services/veiculo.service';

type CatalogTab = 'motores' | 'pistoes' | 'radiadores' | 'turbos' | 'superchargers' | 'veiculos';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.css'
})
export class ProductCatalog implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly motorService = inject(MotorService);
  private readonly pistaoService = inject(PistaoService);
  private readonly radiadorService = inject(RadiadorService);
  private readonly turboService = inject(TurboService);
  private readonly superChargerService = inject(SuperChargerService);
  private readonly veiculoService = inject(VeiculoService);

  // States
  activeTab = signal<CatalogTab>('motores');
  searchQuery = signal('');
  isLoading = signal(false);
  items = signal<any[]>([]);
  selectedItem = signal<any | null>(null);
  wishlist = signal<any[]>([]);

  // Shopping Cart States
  cart = signal<any[]>([]);
  isCartOpen = signal(false);
  isCheckoutStep = signal(false);
  checkoutSuccess = signal(false);
  isProcessingCheckout = signal(false);

  // Form Fields
  endereco = signal('');
  numero = signal('');
  local = signal('Casa');
  referencia = signal('');
  metodoPagamento = signal('credito');

  // Card Info (Decorativo/Premium)
  numCartao = signal('');
  nomeCartao = signal('');
  validadeCartao = signal('');
  cvvCartao = signal('');

  // Cart Computes
  cartCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantidade, 0);
  });

  cartSubtotal = computed(() => {
    return this.cart().reduce((sum, item) => sum + (item.preco || 0) * item.quantidade, 0);
  });

  // Computed signal for filtered items based on search query
  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allItems = this.items();
    if (!query) return allItems;

    return allItems.filter(item => {
      // Search matching different model attributes
      const name = (item.nome || item.modelo || item.material || item.tipo || item.tipoTurbo || item.tipoSupercharger || '').toLowerCase();
      const brand = (item.marca || item.fabricante || '').toLowerCase();
      return name.includes(query) || brand.includes(query);
    });
  });

  ngOnInit(): void {
    this.loadTabItems();
    this.loadWishlist();
  }

  setTab(tab: CatalogTab): void {
    this.activeTab.set(tab);
    this.searchQuery.set('');
    this.selectedItem.set(null);
    this.loadTabItems();
  }

  loadTabItems(): void {
    this.isLoading.set(true);
    const tab = this.activeTab();

    const handleResponse = {
      next: (page: any) => {
        this.items.set(page.content || []);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error(`Erro ao carregar itens da aba ${tab}:`, err);
        this.items.set([]);
        this.isLoading.set(false);
      }
    };

    // Chamadas dinâmicas dependendo do serviço correspondente
    switch (tab) {
      case 'motores':
        this.motorService.findAll(0, 100).subscribe(handleResponse);
        break;
      case 'pistoes':
        this.pistaoService.findAll(0, 100).subscribe(handleResponse);
        break;
      case 'radiadores':
        this.radiadorService.findAll(0, 100).subscribe(handleResponse);
        break;
      case 'turbos':
        this.turboService.findAll(0, 100).subscribe(handleResponse);
        break;
      case 'superchargers':
        this.superChargerService.findAll(0, 100).subscribe(handleResponse);
        break;
      case 'veiculos':
        this.veiculoService.findAll(0, 100).subscribe(handleResponse);
        break;
    }
  }

  activeImageIndex = signal<number>(0);

  openDetails(item: any): void {
    this.activeImageIndex.set(0);
    this.selectedItem.set(item);
  }

  closeDetails(): void {
    this.activeImageIndex.set(0);
    this.selectedItem.set(null);
  }

  // Retorna a imagem selecionada na galeria do modal de detalhes, ou fallback
  getSelectedProductImage(item: any): string {
    if (item && item.imagens && item.imagens.length > 0) {
      const idx = this.activeImageIndex();
      const img = item.imagens[idx] || item.imagens[0];
      return `http://localhost:8080/motor/images/download/${img.fid}`;
    }
    return this.getProductImage(item);
  }

  isIcon(url: string): boolean {
    return url ? (url.endsWith('.png') && !url.includes('http://localhost:8080')) : false;
  }

  // Helper method to return SeaweedFS images or fall back to Unsplash/Local Icons
  getProductImage(item: any): string {
    if (item && item.imagens && item.imagens.length > 0) {
      return `http://localhost:8080/motor/images/download/${item.imagens[0].fid}`;
    }

    const tab = this.activeTab();
    const seed = item.id || 1;

    switch (tab) {
      case 'motores':
        return 'motor.png';
      case 'pistoes':
        return 'pistao.png';
      case 'radiadores':
        return 'radiador.png';
      case 'turbos':
        return 'turbo.png';
      case 'superchargers':
        return 'turbo.png';
      case 'veiculos':
        const vehicleImages = [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop'
        ];
        return vehicleImages[seed % vehicleImages.length];
      default:
        return 'motor.png';
    }
  }

  loadWishlist(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      const saved = localStorage.getItem(`wishlist_${currentUser.username}`);
      this.wishlist.set(saved ? JSON.parse(saved) : []);
    } else {
      this.wishlist.set([]);
    }
  }

  isInWishlist(item: any): boolean {
    return this.wishlist().some(w => w.id === item.id && w.type === this.activeTab());
  }

  toggleWishlist(item: any): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    let currentList = [...this.wishlist()];
    const itemIndex = currentList.findIndex(w => w.id === item.id && w.type === this.activeTab());

    if (itemIndex !== -1) {
      currentList.splice(itemIndex, 1);
    } else {
      currentList.push({
        id: item.id,
        nome: item.nome || item.modelo || (this.activeTab() === 'pistoes' ? 'Pistão Forjado' : '') || (this.activeTab() === 'radiadores' ? 'Radiador de Alumínio' : '') || (this.activeTab() === 'turbos' ? 'Turbina Performance' : '') || (this.activeTab() === 'superchargers' ? 'Supercharger Mecânico' : ''),
        type: this.activeTab(),
        preco: item.preco,
        marca: item.marca || item.fabricante || ''
      });
    }

    this.wishlist.set(currentList);
    localStorage.setItem(`wishlist_${currentUser.username}`, JSON.stringify(currentList));
  }

  toggleCart(): void {
    this.isCartOpen.update(val => !val);
    if (!this.isCartOpen()) {
      // Reseta etapa do checkout ao fechar
      this.isCheckoutStep.set(false);
      this.checkoutSuccess.set(false);
    }
  }

  addToCart(item: any): void {
    let currentCart = [...this.cart()];
    const existingIndex = currentCart.findIndex(c => c.id === item.id && c.type === this.activeTab());

    const itemName = item.nome || item.modelo || (this.activeTab() === 'pistoes' ? 'Pistão Forjado' : '') || (this.activeTab() === 'radiadores' ? 'Radiador de Alumínio' : '') || (this.activeTab() === 'turbos' ? 'Turbina Performance' : '') || (this.activeTab() === 'superchargers' ? 'Supercharger Mecânico' : '');

    if (existingIndex !== -1) {
      currentCart[existingIndex] = {
        ...currentCart[existingIndex],
        quantidade: currentCart[existingIndex].quantidade + 1
      };
    } else {
      currentCart.push({
        id: item.id,
        nome: itemName,
        preco: item.preco || 0,
        type: this.activeTab(),
        quantidade: 1,
        imagem: this.getProductImage(item)
      });
    }

    this.cart.set(currentCart);
    this.isCartOpen.set(true); // Abre o carrinho automaticamente
  }

  removeFromCart(item: any): void {
    const updated = this.cart().filter(c => !(c.id === item.id && c.type === item.type));
    this.cart.set(updated);
    if (updated.length === 0) {
      this.isCheckoutStep.set(false);
    }
  }

  updateCartQuantity(item: any, delta: number): void {
    let currentCart = [...this.cart()];
    const idx = currentCart.findIndex(c => c.id === item.id && c.type === item.type);
    if (idx !== -1) {
      const newQty = currentCart[idx].quantidade + delta;
      if (newQty <= 0) {
        currentCart.splice(idx, 1);
      } else {
        currentCart[idx] = {
          ...currentCart[idx],
          quantidade: newQty
        };
      }
      this.cart.set(currentCart);
      if (currentCart.length === 0) {
        this.isCheckoutStep.set(false);
      }
    }
  }

  proceedToCheckout(): void {
    if (!this.authService.isLoggedIn()) {
      this.isCartOpen.set(false);
      this.router.navigate(['/login']);
      return;
    }
    this.isCheckoutStep.set(true);
  }

  submitCheckout(): void {
    if (!this.endereco() || !this.numero() || !this.local() || !this.referencia() || !this.metodoPagamento()) {
      alert('Por favor, preencha todos os campos do endereço e pagamento.');
      return;
    }

    const user = this.authService.currentUser();
    if (!user) return;

    this.isProcessingCheckout.set(true);

    setTimeout(() => {
      // 1. Grava no histórico de compras do usuário logado
      const savedPurchases = localStorage.getItem(`purchases_${user.username}`);
      let purchasesList = savedPurchases ? JSON.parse(savedPurchases) : [];

      // Gera código de rastreamento simulado
      const trackCode = 'BR' + Math.floor(100000000 + Math.random() * 900000000) + 'AA';
      const orderId = Math.floor(10000 + Math.random() * 90000);

      // Agrupa nomes dos itens no pedido
      const itemsDescription = this.cart()
        .map(c => `${c.quantidade}x ${c.nome}`)
        .join(', ');

      const mainCategory = this.cart()[0]?.type === 'motores' ? 'Motores' : 'Peças';

      const newPurchase = {
        id: orderId,
        produto: itemsDescription,
        categoria: mainCategory,
        preco: this.cartSubtotal(),
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'Em trânsito',
        codigoRastreio: trackCode,
        entregaInfo: {
          endereco: this.endereco(),
          numero: this.numero(),
          local: this.local(),
          referencia: this.referencia(),
          metodoPagamento: this.metodoPagamento() === 'credito' ? 'Cartão de Crédito' : 'Cartão de Débito'
        }
      };

      purchasesList.unshift(newPurchase); // Adiciona no início da lista
      localStorage.setItem(`purchases_${user.username}`, JSON.stringify(purchasesList));

      // 2. Limpa o carrinho e avança para a tela de sucesso
      this.cart.set([]);
      this.isProcessingCheckout.set(false);
      this.checkoutSuccess.set(true);

      // Reset dos campos do formulário
      this.endereco.set('');
      this.numero.set('');
      this.local.set('Casa');
      this.referencia.set('');
      this.metodoPagamento.set('credito');
      this.numCartao.set('');
      this.nomeCartao.set('');
      this.validadeCartao.set('');
      this.cvvCartao.set('');
    }, 1500);
  }

  logout(): void {
    this.authService.logout();
    this.wishlist.set([]);
    this.cart.set([]);
    this.setTab('motores');
  }
}
