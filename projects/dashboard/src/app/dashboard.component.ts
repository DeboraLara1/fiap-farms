import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection,  query, orderBy,  onSnapshot } from '@angular/fire/firestore';
import { Chart } from 'chart.js';
import { SalesEvolutionChartComponent } from './components/sales-evolution-chart/sales-evolution-chart';
import { CategoryChartComponent } from './components/category-chart/category-chart';
import { TopProductsChartComponent } from './components/top-products-chart/top-products-chart';

interface Venda {
  id: string;
  produtoNome: string;
  quantidade: number;
  precoTotal: number;
  dataVenda: Date;
}

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  precoVenda: number;
  quantidade: number;
}

interface VendaData {
  data: Date;
  valor: number;
}

interface CategoriaData {
  categoria: string;
  valor: number;
}

interface ProdutoData {
  produto: string;
  valor: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SalesEvolutionChartComponent,
    CategoryChartComponent,
    TopProductsChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('vendasChart') vendasChartRef!: ElementRef;
  @ViewChild('categoriasChart') categoriasChartRef!: ElementRef;
  @ViewChild('produtosChart') produtosChartRef!: ElementRef;

  vendas: Venda[] = [];
  produtos: Produto[] = [];

  vendasData: VendaData[] = [];
  categoriasData: CategoriaData[] = [];
  topProdutosData: ProdutoData[] = [];

  totalVendas = 0;
  valorTotalVendas = 0;
  lucroTotal = 0;
  produtosVendidos = 0;
  mediaVendas = 0;

  periodoSelecionado = '7dias';
  periodoOptions = [
    { value: '7dias', label: 'Últimos 7 dias' },
    { value: '30dias', label: 'Últimos 30 dias' },
    { value: '90dias', label: 'Últimos 90 dias' },
    { value: 'todos', label: 'Todos os períodos' }
  ];

  vendasChart: Chart | null = null;
  categoriasChart: Chart | null = null;
  produtosChart: Chart | null = null;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    // Aguardar um pouco para garantir que a autenticação esteja inicializada
    setTimeout(() => {
      this.iniciarListenersTempoReal();
    }, 1000);
  }

  iniciarListenersTempoReal() {
    this.carregarVendasTempoReal();
    this.carregarProdutosTempoReal();
  }

  carregarVendasTempoReal() {
    const vendasRef = collection(this.firestore, 'vendas');
    const q = query(vendasRef, orderBy('dataVenda', 'desc'));
    onSnapshot(q, (snapshot) => {
      this.vendas = snapshot.docs.map(doc => {
        const data = doc.data();
        function parseDate(val: any): Date {
          if (!val) return new Date();
          if (typeof val.toDate === 'function') return val.toDate();
          if (typeof val === 'string') return new Date(val);
          if (val instanceof Date) return val;
          return new Date();
        }

        let precoTotal = Number(data['precoTotal']);
        if (isNaN(precoTotal) || precoTotal === 0) {
          const precoUnitario = Number(data['precoUnitario']) || 0;
          const quantidade = Number(data['quantidade']) || 0;
          precoTotal = precoUnitario * quantidade;
        }

        return {
          id: doc.id,
          ...data,
          precoTotal: precoTotal,
          quantidade: Number(data['quantidade']) || 0,
          dataVenda: parseDate(data['dataVenda'])
        } as Venda;
      });
      this.calcularMetricas();
      this.prepararDadosGraficos();
    }, (error) => {
      console.error('Erro ao carregar vendas:', error);
    });
  }

  carregarProdutosTempoReal() {
    const produtosRef = collection(this.firestore, 'produtos');
    onSnapshot(produtosRef, (snapshot) => {
      this.produtos = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          precoVenda: Number(data['precoVenda']) || 0,
          quantidade: Number(data['quantidade']) || 0
        } as Produto;
      });
      this.calcularMetricas();
      this.prepararDadosGraficos();
    }, (error) => {
      console.error('Erro ao carregar produtos:', error);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.enviarAlturaParaHost();
    }, 100);
    window.addEventListener('resize', () => {
      this.enviarAlturaParaHost();
    });
  }

  enviarAlturaParaHost() {
    if (window.parent) {
      window.parent.postMessage(
        { type: 'setHeight', height: document.body.scrollHeight },
        '*'
      );
    }
  }

  calcularMetricas() {
    const vendasFiltradas = this.filtrarVendasPorPeriodo();
    this.totalVendas = vendasFiltradas.length;
    this.valorTotalVendas = vendasFiltradas.reduce((sum, venda) => sum + venda.precoTotal, 0);
    this.produtosVendidos = vendasFiltradas.reduce((sum, venda) => sum + venda.quantidade, 0);

    this.lucroTotal = vendasFiltradas.reduce((sum, venda) => {
      const lucroVenda = venda.precoTotal * 0.3;
      return sum + lucroVenda;
    }, 0);

    this.mediaVendas = this.totalVendas > 0 ? this.valorTotalVendas / this.totalVendas : 0;
  }

  prepararDadosGraficos() {
    const vendasFiltradas = this.filtrarVendasPorPeriodo();
    this.vendasData = this.agruparVendasPorDia(vendasFiltradas);
    this.categoriasData = this.agruparProdutosPorCategoria();
    this.topProdutosData = this.getTopProdutosVendidos();
  }

  filtrarVendasPorPeriodo() {
    const hoje = new Date();
    let dataLimite = new Date();

    switch (this.periodoSelecionado) {
      case '7dias':
        dataLimite.setDate(hoje.getDate() - 7);
        break;
      case '30dias':
        dataLimite.setDate(hoje.getDate() - 30);
        break;
      case '90dias':
        dataLimite.setDate(hoje.getDate() - 90);
        break;
      case 'todos':
        return this.vendas;
    }

    const vendasFiltradas = this.vendas.filter(venda => venda.dataVenda >= dataLimite);
    return vendasFiltradas;
  }

  agruparVendasPorDia(vendas: Venda[]): VendaData[] {
    const vendasPorDia = new Map<string, number>();
    const hoje = new Date();
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];
      vendasPorDia.set(dataStr, 0);
    }

    vendas.forEach(venda => {
      const dataStr = venda.dataVenda.toISOString().split('T')[0];
      const valorAtual = vendasPorDia.get(dataStr) || 0;
      const novoValor = valorAtual + venda.precoTotal;
      vendasPorDia.set(dataStr, novoValor);
    });

    const resultado = Array.from(vendasPorDia.entries())
      .map(([data, valor]) => ({
        data: new Date(data),
        valor
      }))
      .sort((a, b) => a.data.getTime() - b.data.getTime());
    return resultado;
  }

  agruparProdutosPorCategoria(): CategoriaData[] {
    const categorias = new Map<string, number>();

    this.produtos.forEach(produto => {
      const valorAtual = categorias.get(produto.categoria) || 0;
      const valorProduto = produto.precoVenda * produto.quantidade;
      categorias.set(produto.categoria, valorAtual + valorProduto);
    });

    const resultado = Array.from(categorias.entries())
      .map(([categoria, valor]) => ({
        categoria,
        valor
      }))
      .sort((a, b) => b.valor - a.valor);

    return resultado;
  }

  getTopProdutosVendidos(): ProdutoData[] {
    const produtosVendidos = new Map<string, number>();
    this.vendas.forEach(venda => {
      const valorAtual = produtosVendidos.get(venda.produtoNome) || 0;
      produtosVendidos.set(venda.produtoNome, valorAtual + venda.precoTotal);
    });

    const resultado = Array.from(produtosVendidos.entries())
      .map(([produto, valor]) => ({
        produto,
        valor
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);
    return resultado;
  }

  onPeriodoChange() {
    this.calcularMetricas();
    this.prepararDadosGraficos();
  }

  getVendasRecentes() {
    return this.vendas.slice(0, 10);
  }

  formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR');
  }
}
