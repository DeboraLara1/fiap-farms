import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { LoadingComponent } from '../loading/loading';

@Component({
  selector: 'app-initializer',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <app-loading
      [show]="!initialized"
      message="Inicializando FIAP Farms...">
    </app-loading>

    <ng-container *ngIf="initialized">
      <ng-content></ng-content>
    </ng-container>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class AppInitializerComponent implements OnInit {
  @Output() initializationComplete = new EventEmitter<boolean>();

  initialized = false;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    try {
      await this.authService.waitForAuthInit();
      await this.authService.restoreSessionIfNeeded();
      this.initialized = true;
      this.initializationComplete.emit(true);

    } catch (error) {
      this.initialized = true;
      this.initializationComplete.emit(false);
    }
  }
}
