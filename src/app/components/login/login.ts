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
  isRegisterMode = signal(false);
  name = signal('');
  email = signal('');
  username = signal('');
  password = signal('');
  confirmPassword = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  toggleMode(): void {
    this.isRegisterMode.update(val => !val);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.username.set('');
    this.password.set('');
    this.name.set('');
    this.email.set('');
    this.confirmPassword.set('');
  }

  onSubmit(): void {
    if (this.isRegisterMode()) {
      this.handleRegister();
    } else {
      this.handleLogin();
    }
  }

  private handleLogin(): void {
    if (!this.username() || !this.password()) {
      this.errorMessage.set('Por favor, preencha todos os campos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Simulando um pequeno delay para uma transição elegante
    setTimeout(() => {
      const success = this.authService.login(this.username(), this.password());
      this.isLoading.set(false);

      if (success) {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/motores']);
        } else {
          this.router.navigate(['/perfil']);
        }
      } else {
        this.errorMessage.set('Usuário ou senha incorretos.');
      }
    }, 800);
  }

  private handleRegister(): void {
    if (!this.name() || !this.email() || !this.username() || !this.password() || !this.confirmPassword()) {
      this.errorMessage.set('Por favor, preencha todos os campos.');
      return;
    }

    // Validação básica do formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.errorMessage.set('Por favor, insira um e-mail válido.');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('As senhas não coincidem.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    setTimeout(() => {
      const result = this.authService.register(
        this.username(),
        this.password(),
        this.name(),
        this.email()
      );
      this.isLoading.set(false);

      if (result.success) {
        const registeredUsername = this.username();
        this.toggleMode(); // Volta para o login
        this.successMessage.set('Cadastro realizado com sucesso! Faça login para entrar.');
        // Preenche o campo de usuário cadastrado para facilidade do usuário
        this.username.set(registeredUsername);
      } else {
        this.errorMessage.set(result.message);
      }
    }, 800);
  }
}
