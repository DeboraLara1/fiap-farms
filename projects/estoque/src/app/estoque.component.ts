import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutosTabComponent } from './components/produtos-tab/produtos-tab.component';
import { VendasTabComponent } from './components/vendas-tab/vendas-tab.component';
import { DashboardTabComponent } from './components/dashboard-tab/dashboard-tab.component';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, RouterModule, ProdutosTabComponent, VendasTabComponent, DashboardTabComponent],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.scss'
})
export class EstoqueComponent {
  activeTab: 'produtos' | 'vendas' | 'dashboard' = 'produtos';

  totalProdutos = 0;
  totalVendas = 0;
  lucroTotal = 0;

  setActiveTab(tab: 'produtos' | 'vendas' | 'dashboard') {
    this.activeTab = tab;
  }
}
