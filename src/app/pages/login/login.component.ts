import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { LoginPayloadType } from '../../types/login-payload';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    NzLayoutModule,
    NzFlexModule,
    NzButtonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),

    password: this.fb.control('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  confirmValidator(control: AbstractControl): ValidationErrors {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== control.parent!.value.password) {
      return { confirm: true, error: true };
    }
    return {};
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      const payload: LoginPayloadType = this.validateForm.getRawValue();
      this.authService.login<LoginPayloadType>(payload).subscribe({
        next: (res) => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
