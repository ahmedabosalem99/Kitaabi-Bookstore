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
    // Check if the email already exists

    const newUser: User = {
      id: '3',
      email: payload.email,
      Fname: payload.firstName,
      Lname: payload.lastName,
      password: payload.password,
      mobileNumber: payload.mobileNumber,
      role: UserRole.User,
      isVerify: false,
    };

    this.http
      .get<User[]>(`${this.apiUrl}?email=${newUser.email}`)
      .subscribe((users) => {
        const user = users[0]; // your matched user
        if (user) {
          console.log('Email already exists!');
          alert('Email already exists!');
          return; // or handle the error as needed
        }
      });

    return this.http.post<T>(this.apiUrl, newUser);
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
}
