import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private apiUrl = 'https://book-e-sell-node-api.vercel.app/api/user/login';
  readonly errorMessage = signal<string>('');

  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);
  constructor() {
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('saved-Login-Form');
      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        const savedEmail = loadedFormData.email;
        setTimeout(() => {
          this.form().controls['email'].setValue(savedEmail);
        }, 1);
      }

      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) => {
            window.localStorage.setItem(
              'saved-Login-Form',
              JSON.stringify({ email: value.email })
            );
          },
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  onSubmit(_form: NgForm) {
    if (_form.invalid) {
      console.log('Form is invalid');
      return;
    }
    this.authService
      .login({
        email: _form.value.email,
        password: _form.value.password,
      })
      .subscribe({
        next: (res) => {
          _form.reset();
          this.errorMessage.set('');
          this.authService.redirectToHome();
          console.log('Login successful', res);
        },
        error: (err) => {
          console.error('Failed', err);
          this.errorMessage.set('Invalid email or password');
          alert('Invalid email or password');
        },
      });
    // Clears inputs and resets form state
  }
}
