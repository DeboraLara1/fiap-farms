import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutosTabComponent } from './components/produtos-tab/produtos-tab.component';
import { VendasTabComponent } from './components/vendas-tab/vendas-tab.component';
import { DashboardTabComponent } from './components/dashboard-tab/dashboard-tab.component';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  precoCusto: number;
  precoVenda: number;
  quantidade: number;
  unidade: string;
}

interface Venda {
  id: string;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  dataVenda: Date;
}

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

  constructor(private firestore: Firestore) {
    this.carregarDados();
  }

  async carregarDados() {
    const produtosRef = collection(this.firestore, 'produtos');
    const vendasRef = collection(this.firestore, 'vendas');
    const [produtosSnap, vendasSnap] = await Promise.all([
      getDocs(produtosRef),
      getDocs(vendasRef)
    ]);
    const produtos = produtosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Produto[];
    const vendas = vendasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Venda[];
    this.totalProdutos = produtos.length;
    this.totalVendas = vendas.length;
    this.lucroTotal = vendas.reduce((sum, venda) => {
      const produto = produtos.find((p: Produto) => p.id === venda.produtoId);
      if (produto) {
        const lucroUnitario = (produto.precoVenda - produto.precoCusto) || 0;
        return sum + (lucroUnitario * (venda.quantidade || 0));
      }
      return sum;
    }, 0);
  }

  setActiveTab(tab: 'produtos' | 'vendas' | 'dashboard') {
    this.activeTab = tab;
    this.carregarDados(); 
  }
}
