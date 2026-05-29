import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  logout(): void {
    this.authService.logout();
    this.setTab('motores');
  }
}
