import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { ForgotPasswordPayloadType } from '../../types/forgot-password-payload';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NzNotificationService);

  spinning = signal<boolean>(false);

  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      this.spinning.set(true);

      const payload: ForgotPasswordPayloadType =
        this.validateForm.getRawValue();

      this.authService
        .forgotPassword<ForgotPasswordPayloadType>(payload)
        .subscribe({
          next: (res: any) => {
            this.notification.success('Success', res?.message);
            this.spinning.set(false);
          },
          error: (err: HttpErrorResponse) => {
            this.notification.error('Error', err.error?.message);
            this.spinning.set(false);
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
