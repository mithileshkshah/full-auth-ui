import { Component } from '@angular/core';
import {
  ReactiveFormsModule
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-dashboard',
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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
