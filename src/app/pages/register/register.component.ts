import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { USER_ROLE } from '../../enum/user-role.enum';
import { AuthService } from '../../services/auth.service';
import { User } from '../../types/user';

@Component({
  selector: 'app-register',
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    username: this.fb.control(
      '',
      [Validators.required],
      [this.usernameAsyncValidator(this.authService, 500)]
    ),

    password: this.fb.control('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirm: this.fb.control('', [this.confirmValidator]),
  });

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateForm.controls.confirm.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  usernameAsyncValidator(authService: AuthService, waitMs: number) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value?.trim();
      if (
        !value ||
        this.validateForm.controls['username'].errors?.['duplicated']
      )
        return of(null); // skip empty values

      return timer(waitMs).pipe(
        switchMap(() =>
          authService.usernameExists(value).pipe(
            map((response) => {
              return response.data.exist ? { duplicated: true } : null;
            })
          )
        )
      );
    };
  }

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
      const { confirm, ...rest } = this.validateForm.getRawValue();
      this.authService
        .register<User>({ ...rest, role: USER_ROLE.USER })
        .subscribe({
          next: (res) => {
            console.log(res);
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
