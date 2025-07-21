import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-dashboard-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-tab.component.html',
  styleUrl: './dashboard-tab.component.scss'
})
export class DashboardTabComponent implements OnInit {
  produtos: Produto[] = [];
  vendas: Venda[] = [];

  // Estatísticas
  totalProdutos = 0;
  totalVendas = 0;
  valorTotalVendas = 0;
  lucroTotal = 0;
  produtosBaixoEstoque = 0;

  // Dados para gráficos
  produtosPorCategoria: { categoria: string; quantidade: number }[] = [];
  topProdutosVendidos: { nome: string; quantidade: number; valor: number }[] = [];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.carregarDados();
  }

  async carregarDados() {
    await Promise.all([
      this.carregarProdutos(),
      this.carregarVendas()
    ]);
    this.calcularEstatisticas();
  }

  async carregarProdutos() {
    const produtosRef = collection(this.firestore, 'produtos');
    const snapshot = await getDocs(produtosRef);
    this.produtos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Produto));
  }

  async carregarVendas() {
    const vendasRef = collection(this.firestore, 'vendas');
    const snapshot = await getDocs(vendasRef);
    this.vendas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataVenda: doc.data()['dataVenda']?.toDate() || new Date()
    } as Venda));
  }

  calcularEstatisticas() {
    // Estatísticas básicas
    this.totalProdutos = this.produtos.length;
    this.totalVendas = this.vendas.length;
    this.valorTotalVendas = this.vendas.reduce((sum, venda) => sum + venda.precoTotal, 0);

    // Calcular lucro total
    this.lucroTotal = this.vendas.reduce((sum, venda) => {
      const produto = this.produtos.find(p => p.id === venda.produtoId);
      if (produto) {
        const lucroUnitario = produto.precoVenda - produto.precoCusto;
        return sum + (lucroUnitario * venda.quantidade);
      }
      return sum;
    }, 0);

    // Produtos com baixo estoque
    this.produtosBaixoEstoque = this.produtos.filter(p => p.quantidade < 10).length;

    // Produtos por categoria
    this.calcularProdutosPorCategoria();

    // Top produtos vendidos
    this.calcularTopProdutosVendidos();
  }

  calcularProdutosPorCategoria() {
    const categorias = new Map<string, number>();

    this.produtos.forEach(produto => {
      const count = categorias.get(produto.categoria) || 0;
      categorias.set(produto.categoria, count + 1);
    });

    this.produtosPorCategoria = Array.from(categorias.entries()).map(([categoria, quantidade]) => ({
      categoria,
      quantidade
    }));
  }

  calcularTopProdutosVendidos() {
    const vendasPorProduto = new Map<string, { quantidade: number; valor: number }>();

    this.vendas.forEach(venda => {
      const produto = vendasPorProduto.get(venda.produtoId) || { quantidade: 0, valor: 0 };
      produto.quantidade += venda.quantidade;
      produto.valor += venda.precoTotal;
      vendasPorProduto.set(venda.produtoId, produto);
    });

    this.topProdutosVendidos = Array.from(vendasPorProduto.entries())
      .map(([produtoId, dados]) => {
        const produto = this.produtos.find(p => p.id === produtoId);
        return {
          nome: produto?.nome || 'Produto não encontrado',
          quantidade: dados.quantidade,
          valor: dados.valor
        };
      })
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);
  }

  getProdutosBaixoEstoque() {
    return this.produtos.filter(p => p.quantidade < 10);
  }

  getVendasRecentes() {
    return this.vendas
      .sort((a, b) => new Date(b.dataVenda).getTime() - new Date(a.dataVenda).getTime())
      .slice(0, 5);
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
