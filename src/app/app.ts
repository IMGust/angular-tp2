import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  
  // Transforma os eventos de navegação em um sinal com a URL atual
  private readonly currentUrl = toSignal(
    this.router.events.pipe(map(() => this.router.url)),
    { initialValue: '/' }
  );

  // Determina se a sidebar e cabeçalho administrativo devem ser exibidos
  protected readonly showAdminLayout = computed(() => {
    const url = this.currentUrl();
    const isPublicRoute = url === '/' || url === '/login';
    return this.authService.isLoggedIn() && !isPublicRoute;
  });

  // Computa as informações do botão com base na URL
  protected readonly actionInfo = computed(() => {
    const url = this.currentUrl();
    
    if (url.includes('/pistoes')) return { label: 'Novo Pistão', link: '/pistoes/novo' };
    if (url.includes('/radiadores')) return { label: 'Novo Radiador', link: '/radiadores/novo' };
    if (url.includes('/turbos')) return { label: 'Novo Turbo', link: '/turbos/novo' };
    if (url.includes('/superchargers')) return { label: 'Novo Supercharger', link: '/superchargers/novo' };
    if (url.includes('/veiculos')) return { label: 'Novo Veículo', link: '/veiculos/novo' };
    
    // Padrão para motores ou qualquer outra página
    return { label: 'Novo Motor', link: '/motores/novo' };
  });

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

