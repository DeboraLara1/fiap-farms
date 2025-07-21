import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MetasTabComponent } from './components/metas-tab/metas-tab.component';
import { NotificacoesTabComponent } from './components/notificacoes-tab/notificacoes-tab.component';
import { RelatoriosTabComponent } from './components/relatorios-tab/relatorios-tab.component';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MetasTabComponent,
    NotificacoesTabComponent,
    RelatoriosTabComponent
  ],
  templateUrl: './metas.component.html',
  styleUrl: './metas.component.scss'
})
export class MetasComponent {
  activeTab: 'metas' | 'notificacoes' | 'relatorios' = 'metas';

  totalMetas = 0;
  metasConcluidas = 0;
  notificacoes = 0;

  setActiveTab(tab: 'metas' | 'notificacoes' | 'relatorios') {
    this.activeTab = tab;
  }
}
