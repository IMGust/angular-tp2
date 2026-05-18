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

  // Helper method to return SeaweedFS images or fall back to Unsplash
  getProductImage(item: any): string {
    if (item && item.imagens && item.imagens.length > 0) {
      return `http://localhost:8080/motor/images/download/${item.imagens[0].fid}`;
    }

    const tab = this.activeTab();
    const seed = item.id || 1;
    
    // Curated high quality automotive images based on categories
    const engineImages = [
      'https://images.unsplash.com/photo-1597404294360-fedede44308e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613214150384-8e9c3f6d0d15?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop'
    ];
    
    const pistonImages = [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop', // engineering parts
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop'
    ];

    const radiatorImages = [
      'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=600&auto=format&fit=crop', // machinery/cooling
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'
    ];

    const turboImages = [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop', // turbine/induction
      'https://images.unsplash.com/photo-1600706432502-75a0e273b885?q=80&w=600&auto=format&fit=crop'
    ];

    const vehicleImages = [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600&auto=format&fit=crop', // sports car
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop'
    ];

    switch (tab) {
      case 'motores':
        return engineImages[seed % engineImages.length];
      case 'pistoes':
        return pistonImages[seed % pistonImages.length];
      case 'radiadores':
        return radiatorImages[seed % radiatorImages.length];
      case 'turbos':
      case 'superchargers':
        return turboImages[seed % turboImages.length];
      case 'veiculos':
        return vehicleImages[seed % vehicleImages.length];
      default:
        return engineImages[0];
    }
  }

  logout(): void {
    this.authService.logout();
    this.setTab('motores');
  }
}
