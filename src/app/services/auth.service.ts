import { Injectable, signal, computed } from '@angular/core';

export interface User {
  username: string;
  password?: string;
  name: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Array de usuários cadastrados mantido no localStorage
  private getRegisteredUsers(): User[] {
    const usersStr = localStorage.getItem('registeredUsers');
    if (!usersStr) {
      const defaultUsers: User[] = [
        { username: 'admin', password: 'admin123', name: 'Gustavo', email: 'admin@exemplo.com' }
      ];
      localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(usersStr);
  }

  // Estado de autenticação reativo usando Signals do Angular
  readonly isLoggedIn = signal<boolean>(localStorage.getItem('adminLoggedIn') === 'true');

  // Sinal para o usuário atual logado
  readonly currentUser = signal<User | null>(
    localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')!)
      : null
  );

  // Sinal computado para verificar se o usuário atual é Administrador
  readonly isAdmin = computed(() => {
    const user = this.currentUser();
    return user !== null && user.username.toLowerCase() === 'admin';
  });

  login(username: string, password: string): boolean {
    const users = this.getRegisteredUsers();
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({ username: user.username, name: user.name, email: user.email }));
      this.currentUser.set({ username: user.username, name: user.name, email: user.email });
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  register(username: string, password: string, name: string, email: string): { success: boolean; message: string } {
    const users = this.getRegisteredUsers();

    // Validação de duplicidade de usuário
    const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
      return { success: false, message: 'Este nome de usuário já está em uso.' };
    }

    // Validação de duplicidade de e-mail
    const emailExists = users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return { success: false, message: 'Este e-mail já está em uso.' };
    }

    // Adiciona o novo usuário
    const newUser: User = { username, password, name, email };
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    return { success: true, message: 'Usuário cadastrado com sucesso!' };
  }

  changePassword(username: string, newPassword: string): boolean {
    const users = this.getRegisteredUsers();
    const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      const currentUser = this.currentUser();
      if (currentUser && currentUser.username.toLowerCase() === username.toLowerCase()) {
        const updatedUser = { ...currentUser, password: newPassword };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUser.set(updatedUser);
      }
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }
}
