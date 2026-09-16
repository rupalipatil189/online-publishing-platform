import { Component, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],

  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);

  errorMessage = signal('');

  signupForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],

    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required, Validators.minLength(6)]],

    confirmPassword: ['', [Validators.required]],
  });

  signup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();

      return;
    }

    const { email, password, confirmPassword } = this.signupForm.getRawValue();

    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match.');

      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService
      .signup(email, password)
      .then(() => {
        this.loading.set(false);

        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.loading.set(false);
        this.errorMessage.set(this.getFirebaseError(error.code));
      });
  }

  loginWithGoogle(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService
      .loginWithGoogle()
      .then(() => {
        this.loading.set(false);

        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.loading.set(false);
        this.errorMessage.set(this.getFirebaseError(error.code));
      });
  }

  private getFirebaseError(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';

      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';

      case 'auth/invalid-email':
        return 'Please enter a valid email.';

      default:
        return 'Unable to create account. Please try again.';
    }
  }
}
