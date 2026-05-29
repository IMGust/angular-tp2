import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado de autenticação reativo usando Signals do Angular
  readonly isLoggedIn = signal<boolean>(localStorage.getItem('adminLoggedIn') === 'true');

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true');
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('adminLoggedIn');
    this.isLoggedIn.set(false);
  }
}
