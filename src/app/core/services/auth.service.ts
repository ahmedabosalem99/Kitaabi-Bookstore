import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../models/register-request.model';
import { loginRequest } from '../models/login-request.model';
import { User } from '../models/user';
import { UserRole } from '../models/UserRole';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';

  register<T = unknown>(payload: RegisterRequest): Observable<T> {
    return new Observable<T>((observer) => {
      // Check if the email already exists
      this.http.get<User[]>(`${this.apiUrl}?email=${payload.email}`).subscribe({
        next: (users) => {
          const user = users[0]; // your matched user
          if (user) {
            console.log('Email already exists!');
            alert('Email already exists!');
            observer.error('Email already exists!');
            observer.complete();
          } else {
            this.http.post<T>(this.apiUrl, payload).subscribe({
              next: (response) => {
                localStorage.setItem('user', JSON.stringify(response));
                console.log('Registration successful');
                this.redirectToHome();
                alert('Registration successful!');
                observer.next(response);
                observer.complete();
              },
              error: (err) => {
                alert('Registration failed!');
                observer.error(err);
              },
            });
          }
        },
        error: (err) => {
          alert('Error checking email!');
          observer.error(err);
        },
      });
    });
  }

  login<T = unknown>(payload: loginRequest): Observable<T> {
    return new Observable<T>((observer) => {
      this.http
        .get<any[]>(
          `http://localhost:3000/users?email=${payload.email}&password=${payload.password}`
        )
        .subscribe({
          next: (users) => {
            const user = users[0];
            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
              console.log('Login successful');
              observer.next(user as T);
            } else {
              console.log('Invalid credentials');
              observer.error('Invalid credentials');
            }
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          },
        });
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    console.log('Logout successful');
  }
  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
  redirectToLogin(): void {
    window.location.href = '/login'; // Redirect to the login page
  }
  redirectToHome(): void {
    window.location.href = ''; // Redirect to the home page
  }
  isAdmin(): boolean {
    const user = this.getUser();
    return user !== null && user.role === UserRole.Admin; // Check if the user is an admin
  }
}
