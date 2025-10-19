import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AuthService } from '../../services/auth.service';
import { catchError, map, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  imports: [NzLayoutModule, NzFlexModule, NzButtonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);

  router = inject(Router);

  isLoggedIn = signal<boolean>(false);

  ngOnInit(): void {
    this.authService
      .authenticated()
      .pipe(
        map((res: any) => {
          // If we get a valid user response, allow access
          if (res?.user?.id) {
            // return true;
            this.isLoggedIn.set(true);
          }
        }),
        catchError(() => {
          // If API fails (e.g., expired token, unauthorized)

          return of(false);
        })
      )
      .subscribe();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['login']);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
}
