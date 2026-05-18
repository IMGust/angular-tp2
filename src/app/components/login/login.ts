import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Estados locais usando signals para reatividade moderna
  username = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  onSubmit(): void {
    if (!this.username() || !this.password()) {
      this.errorMessage.set('Por favor, preencha todos os campos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Simulando um pequeno delay para uma transição elegante
    setTimeout(() => {
      const success = this.authService.login(this.username(), this.password());
      this.isLoading.set(false);

      if (success) {
        this.router.navigate(['/motores']);
      } else {
        this.errorMessage.set('Usuário ou senha incorretos.');
      }
    }, 800);
  }
}
