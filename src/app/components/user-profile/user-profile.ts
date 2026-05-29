import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

interface WishlistItem {
  id: number;
  nome: string;
  type: string;
  preco?: number;
  marca?: string;
}

interface PurchaseItem {
  id: number;
  produto: string;
  categoria: string;
  preco: number;
  data: string;
  status: 'Entregue' | 'Em trânsito' | 'Cancelado';
  codigoRastreio: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Navegação de abas internas
  activeProfileTab = signal<'perfil' | 'seguranca' | 'wishlist' | 'compras'>('perfil');

  // Estados para alteração de senha
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordErrorMessage = signal('');
  passwordSuccessMessage = signal('');
  isPasswordLoading = signal(false);

  // Estados de dados do usuário
  wishlistItems = signal<WishlistItem[]>([]);
  purchases = signal<PurchaseItem[]>([]);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserData(user.username);
  }

  setTab(tab: 'perfil' | 'seguranca' | 'wishlist' | 'compras'): void {
    this.activeProfileTab.set(tab);
    // Limpa estados de senha ao trocar de aba
    if (tab !== 'seguranca') {
      this.passwordErrorMessage.set('');
      this.passwordSuccessMessage.set('');
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
    }
  }

  loadUserData(username: string): void {
    // 1. Carrega Wishlist do localStorage
    const savedWish = localStorage.getItem(`wishlist_${username}`);
    this.wishlistItems.set(savedWish ? JSON.parse(savedWish) : []);

    // 2. Carrega Compras (se vazias, insere mocks bem acabados no localStorage)
    const savedPurchases = localStorage.getItem(`purchases_${username}`);
    if (savedPurchases) {
      this.purchases.set(JSON.parse(savedPurchases));
    } else {
      const mockPurchases: PurchaseItem[] = [
        {
          id: 10243,
          produto: 'Motor V8 4.0 Twin-Turbo Performance',
          categoria: 'Motores',
          preco: 45000.00,
          data: '15/05/2026',
          status: 'Entregue',
          codigoRastreio: 'BR847392019AA'
        },
        {
          id: 10582,
          produto: '2x Kit de Pistão Forjado IAPEL H-Beam',
          categoria: 'Pistões',
          preco: 2400.00,
          data: '26/05/2026',
          status: 'Em trânsito',
          codigoRastreio: 'BR901847291BB'
        }
      ];
      localStorage.setItem(`purchases_${username}`, JSON.stringify(mockPurchases));
      this.purchases.set(mockPurchases);
    }
  }

  // Remove um item da wishlist diretamente do perfil
  removeFromWishlist(item: WishlistItem): void {
    const user = this.authService.currentUser();
    if (!user) return;

    const updated = this.wishlistItems().filter(w => !(w.id === item.id && w.type === item.type));
    this.wishlistItems.set(updated);
    localStorage.setItem(`wishlist_${user.username}`, JSON.stringify(updated));
  }

  // Alteração de senha
  onChangePassword(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      this.passwordErrorMessage.set('Por favor, preencha todos os campos.');
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordErrorMessage.set('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordErrorMessage.set('A nova senha deve possuir no mínimo 6 caracteres.');
      return;
    }

    this.isPasswordLoading.set(true);
    this.passwordErrorMessage.set('');
    this.passwordSuccessMessage.set('');

    setTimeout(() => {
      // Simula alteração e validação da senha atual
      const usersStr = localStorage.getItem('registeredUsers');
      if (usersStr) {
        const users: User[] = JSON.parse(usersStr);
        const matchedUser = users.find(u => u.username.toLowerCase() === user.username.toLowerCase());
        
        if (!matchedUser || matchedUser.password !== this.currentPassword) {
          this.passwordErrorMessage.set('Senha atual incorreta.');
          this.isPasswordLoading.set(false);
          return;
        }
      }

      const success = this.authService.changePassword(user.username, this.newPassword);
      this.isPasswordLoading.set(false);

      if (success) {
        this.passwordSuccessMessage.set('Senha alterada com sucesso!');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
      } else {
        this.passwordErrorMessage.set('Erro ao alterar a senha. Tente novamente.');
      }
    }, 800);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
