export class AuthService {
    static isLoggedIn(): boolean {
      return !!localStorage.getItem('token');
    }
  
    static logout() {
      localStorage.removeItem('token');
    }
  }
  