import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);

  errorMessage = signal('');

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required]],
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading.set(true);

    this.errorMessage.set('');

    const { email, password } = this.loginForm.getRawValue();

    this.authService
      .login(email, password)
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
      case 'auth/invalid-credential':
        return 'Invalid email or password.';

      case 'auth/user-not-found':
        return 'No account found with this email.';

      case 'auth/wrong-password':
        return 'Incorrect password.';

      case 'auth/email-already-in-use':
        return 'This email is already registered.';

      default:
        return 'Something went wrong. Please try again.';
    }
  }
}
