import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, getDocs, query, orderBy } from '@angular/fire/firestore';

interface Venda {
  id?: string;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  cliente: string;
  dataVenda: Date;
  observacoes: string;
}

interface Produto {
  id: string;
  nome: string;
  precoVenda: number;
  quantidade: number;
  unidade: string;
}

@Component({
  selector: 'app-vendas-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendas-tab.component.html',
  styleUrl: './vendas-tab.component.scss'
})
export class VendasTabComponent implements OnInit {
  vendas: Venda[] = [];
  produtos: Produto[] = [];

  novaVenda: Venda = {
    produtoId: '',
    produtoNome: '',
    quantidade: 1,
    precoUnitario: 0,
    precoTotal: 0,
    cliente: '',
    dataVenda: new Date(),
    observacoes: ''
  };

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.carregarProdutos();
    this.carregarVendas();
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
    const q = query(vendasRef, orderBy('dataVenda', 'desc'));
    const snapshot = await getDocs(q);
    this.vendas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataVenda: doc.data()['dataVenda']?.toDate() || new Date()
    } as Venda));
  }

  onProdutoChange() {
    const produto = this.produtos.find(p => p.id === this.novaVenda.produtoId);
    if (produto) {
      this.novaVenda.produtoNome = produto.nome;
      this.novaVenda.precoUnitario = produto.precoVenda;
      this.calcularTotal();
    }
  }

  calcularTotal() {
    this.novaVenda.precoTotal = this.novaVenda.quantidade * this.novaVenda.precoUnitario;
  }

  async registrarVenda() {
    if (this.validarVenda()) {
      const vendasRef = collection(this.firestore, 'vendas');
      await addDoc(vendasRef, {
        ...this.novaVenda,
        dataVenda: new Date()
      });

      this.limparFormulario();
      this.carregarVendas();
      this.carregarProdutos(); 
    }
  }

  validarVenda(): boolean {
    const produto = this.produtos.find(p => p.id === this.novaVenda.produtoId);
    if (!produto) return false;

    return this.novaVenda.produtoId !== '' &&
           this.novaVenda.quantidade > 0 &&
           this.novaVenda.quantidade <= produto.quantidade &&
           this.novaVenda.cliente.trim() !== '';
  }

  limparFormulario() {
    this.novaVenda = {
      produtoId: '',
      produtoNome: '',
      quantidade: 1,
      precoUnitario: 0,
      precoTotal: 0,
      cliente: '',
      dataVenda: new Date(),
      observacoes: ''
    };
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getProdutoDisponivel(produto: Produto): boolean {
    return produto.quantidade > 0;
  }
}
