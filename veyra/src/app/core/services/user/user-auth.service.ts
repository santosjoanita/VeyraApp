import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserKey = 'veyra_current_user';
  private readonly usersKey = 'veyra_users';
  private readonly redirectKey = 'redirectUrl';

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }

  login(usernameOrEmail: string, password: string): boolean {
    const users = this.getUsers();
    const validUser = users.find(
      (u: any) =>
        (u.email === usernameOrEmail || u.username === usernameOrEmail) && u.password === password,
    );

    if (!validUser) {
      return false;
    }

    localStorage.setItem(this.currentUserKey, JSON.stringify(validUser));
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): any | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  register(user: { username: string; email: string; password: string }): {
    success: boolean;
    message: string;
  } {
    const users = this.getUsers();

    if (users.some((u: any) => u.email === user.email || u.username === user.username)) {
      return { success: false, message: 'Username or E-mail already exist!' };
    }

    const newUser = {
      ...user,
      role: users.length === 0 ? 'admin' : 'worker',
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return { success: true, message: 'Registered with success. You can now Log In' };
  }

  setRedirectUrl(url: string): void {
    sessionStorage.setItem(this.redirectKey, url);
  }

  popRedirectUrl(): string | null {
    const url = sessionStorage.getItem(this.redirectKey);
    if (url) {
      sessionStorage.removeItem(this.redirectKey);
    }
    return url;
  }

  //TODO : TIRAR O ANY
  private getUsers(): any[] {
    const usersStr = localStorage.getItem(this.usersKey);
    return usersStr ? JSON.parse(usersStr) : [];
  }
}
