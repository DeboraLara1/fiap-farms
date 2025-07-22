import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, User, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PersistenceService } from './persistence.service';

interface SessionData {
  uid: string;
  email: string | null;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  private authStateInitialized = false;
  private readonly AUTH_STATE_KEY = 'fiap_farms_auth_state';

  constructor(
    private auth: Auth,
    private router: Router,
    private persistenceService: PersistenceService
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
      this.authStateInitialized = true;

      if (user) {
        this.persistenceService.setSessionItem(this.AUTH_STATE_KEY, {
          uid: user.uid,
          email: user.email,
          timestamp: Date.now()
        } as SessionData);
      } else {
        this.persistenceService.removeSessionItem(this.AUTH_STATE_KEY);
      }
    });

    this.tryRestoreSession();
  }

  private async tryRestoreSession(): Promise<void> {
    if (this.hasValidSession()) {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!this.auth.currentUser) {
        this.persistenceService.removeSessionItem(this.AUTH_STATE_KEY);
      }
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string): Promise<void> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);

      this.persistenceService.removeSessionItem(this.AUTH_STATE_KEY);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const user = this.auth.currentUser;
    return !!user;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  waitForAuthInit(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.authStateInitialized) {
        resolve(!!this.auth.currentUser);
      } else {
        let subscription: any;
        subscription = this.user$.subscribe(user => {
          if (subscription) {
            subscription.unsubscribe();
          }
          resolve(!!user);
        });
      }
    });
  }

  isAuthStateInitialized(): boolean {
    return this.authStateInitialized;
  }

  hasValidSession(): boolean {
    const sessionData = this.persistenceService.getSessionItem<SessionData>(this.AUTH_STATE_KEY);
    if (!sessionData) return false;

    const sessionAge = Date.now() - sessionData.timestamp;
    const maxSessionAge = 24 * 60 * 60 * 1000;

    const isValid = sessionAge < maxSessionAge;
    return isValid;
  }

  async restoreSessionIfNeeded(): Promise<boolean> {
    if (this.hasValidSession() && !this.auth.currentUser) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return !!this.auth.currentUser;
    }
    return !!this.auth.currentUser;
  }
}
