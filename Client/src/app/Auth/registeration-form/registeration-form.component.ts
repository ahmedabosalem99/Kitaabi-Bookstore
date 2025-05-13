import {
  afterNextRender,
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { RegisterRequest } from '../../core/models/register-request.model';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmPasswordValidatorDirective } from '../../core/validators/confirm-password-validator.directive';
import { debounceTime, first } from 'rxjs';
import { RouterLink } from '@angular/router';
import { UserRole } from '../../core/models/UserRole';

@Component({
  selector: 'app-registeration-form',
  standalone: true,
  imports: [FormsModule, ConfirmPasswordValidatorDirective, RouterLink],
  templateUrl: './registeration-form.component.html',
  styleUrl: './registeration-form.component.css',
})
export class RegisterationFormComponent implements AfterViewInit {
  private authService = inject(AuthService);

  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  email = '';

  /*** local storage feature*/
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);
  subscription: any;
  phone: any;

  constructor() {
    afterNextRender(() => {
      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) => {
            window.localStorage.setItem(
              'saved-Register-Form',
              JSON.stringify({
                email: value.email,
                firstName: value.firstName,
                lastName: value.lastName,
              })
            );
          },
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  ngAfterViewInit(): void {
    // Step 1: Retrieve saved data from local storage
    const savedForm = localStorage.getItem('saved-Register-form');

    if (savedForm) {
      const loadedFormData = JSON.parse(savedForm); // Convert saved string back to object
      const savedEmail = loadedFormData.email; // Extract saved email
      const savedFirstName = loadedFormData.firstName; // Extract saved first name
      const savedLastName = loadedFormData.lastName; // Extract saved last name

      // Step 2: Set the saved value into the form
      setTimeout(() => {
        this.form()?.controls['email']?.setValue(savedEmail);
        this.form()?.controls['firstName']?.setValue(savedFirstName);
        this.form()?.controls['lastName']?.setValue(savedLastName);
      }, 1);
    }

    // Step 3: Subscribe to form changes and save to local storage
    this.subscription = this.form()
      .valueChanges?.pipe(debounceTime(500)) // Save only after the user stops typing for 500ms
      .subscribe((value) => {
        localStorage.setItem(
          'saved-Register-form',
          JSON.stringify({
            email: value.email,
            firstName: value.firstName,
            lastName: value.lastName,
          })
        );
      });
  }

  /*  end  */

  onSubmit(_form: NgForm) {
    if (_form.invalid) {
      console.log('Form is invalid');
      return;
    }
    const IsEmailCreatedState = this.authService
      .register({
        Fname: _form.value.firstName,
        Lname: _form.value.lastName,
        email: _form.value.email,
        password: _form.value.password,
        mobileNumber: _form.value.mobileNumber,
        role: UserRole.User,
        isVerify: false,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });

    _form.reset(); // Clears inputs and resets form state
  }
}
