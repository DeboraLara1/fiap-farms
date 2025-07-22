import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';

interface Produto {
  id?: string;
  nome: string;
  categoria: string;
  precoCusto: number;
  precoVenda: number;
  quantidade: number;
  unidade: string;
  descricao: string;
  dataCadastro: Date;
}

@Component({
  selector: 'app-produtos-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos-tab.component.html',
  styleUrl: './produtos-tab.component.scss'
})
export class ProdutosTabComponent implements OnInit {
  produtos: Produto[] = [];
  novoProduto: Produto = {
    nome: '',
    categoria: '',
    precoCusto: 0,
    precoVenda: 0,
    quantidade: 0,
    unidade: 'kg',
    descricao: '',
    dataCadastro: new Date()
  };

  editando = false;
  produtoEditando: Produto | null = null;
  categorias = ['Grãos', 'Frutas', 'Verduras', 'Legumes', 'Laticínios', 'Carnes', 'Outros'];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  get nome(): string {
    return this.editando ? this.produtoEditando!.nome : this.novoProduto.nome;
  }

  set nome(value: string) {
    if (this.editando) {
      this.produtoEditando!.nome = value;
    } else {
      this.novoProduto.nome = value;
    }
  }

  get categoria(): string {
    return this.editando ? this.produtoEditando!.categoria : this.novoProduto.categoria;
  }

  set categoria(value: string) {
    if (this.editando) {
      this.produtoEditando!.categoria = value;
    } else {
      this.novoProduto.categoria = value;
    }
  }

  get precoCusto(): number {
    return this.editando ? this.produtoEditando!.precoCusto : this.novoProduto.precoCusto;
  }

  set precoCusto(value: number) {
    if (this.editando) {
      this.produtoEditando!.precoCusto = value;
    } else {
      this.novoProduto.precoCusto = value;
    }
  }

  get precoVenda(): number {
    return this.editando ? this.produtoEditando!.precoVenda : this.novoProduto.precoVenda;
  }

  set precoVenda(value: number) {
    if (this.editando) {
      this.produtoEditando!.precoVenda = value;
    } else {
      this.novoProduto.precoVenda = value;
    }
  }

  get quantidade(): number {
    return this.editando ? this.produtoEditando!.quantidade : this.novoProduto.quantidade;
  }

  set quantidade(value: number) {
    if (this.editando) {
      this.produtoEditando!.quantidade = value;
    } else {
      this.novoProduto.quantidade = value;
    }
  }

  get unidade(): string {
    return this.editando ? this.produtoEditando!.unidade : this.novoProduto.unidade;
  }

  set unidade(value: string) {
    if (this.editando) {
      this.produtoEditando!.unidade = value;
    } else {
      this.novoProduto.unidade = value;
    }
  }

  get descricao(): string {
    return this.editando ? this.produtoEditando!.descricao : this.novoProduto.descricao;
  }

  set descricao(value: string) {
    if (this.editando) {
      this.produtoEditando!.descricao = value;
    } else {
      this.novoProduto.descricao = value;
    }
  }

  async carregarProdutos() {
    const produtosRef = collection(this.firestore, 'produtos');
    const snapshot = await getDocs(produtosRef);
    this.produtos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Produto));
  }

  private removeUndefinedFields(obj: any) {
    Object.keys(obj).forEach(key => {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
  }

  async adicionarProduto() {
    if (this.validarProduto()) {
      const produtosRef = collection(this.firestore, 'produtos');
      const produtoParaSalvar = this.removeUndefinedFields({
        ...this.novoProduto,
        precoCusto: Number(String(this.novoProduto.precoCusto).replace(',', '.')),
        precoVenda: Number(String(this.novoProduto.precoVenda).replace(',', '.')),
        quantidade: Number(String(this.novoProduto.quantidade).replace(',', '.')),
        dataCadastro: new Date()
      });
      await addDoc(produtosRef, produtoParaSalvar);

      this.limparFormulario();
      this.carregarProdutos();
    }
  }

  editarProduto(produto: Produto) {
    this.editando = true;
    this.produtoEditando = { ...produto };
  }

  async salvarEdicao() {
    if (this.produtoEditando && this.produtoEditando.id) {
      const produtoRef = doc(this.firestore, 'produtos', this.produtoEditando.id);
      const produtoParaSalvar = this.removeUndefinedFields({
        nome: this.produtoEditando.nome,
        categoria: this.produtoEditando.categoria,
        precoCusto: Number(String(this.produtoEditando.precoCusto).replace(',', '.')),
        precoVenda: Number(String(this.produtoEditando.precoVenda).replace(',', '.')),
        quantidade: Number(String(this.produtoEditando.quantidade).replace(',', '.')),
        unidade: this.produtoEditando.unidade,
        descricao: this.produtoEditando.descricao
      });
      await updateDoc(produtoRef, produtoParaSalvar);

      this.cancelarEdicao();
      this.carregarProdutos();
    }
  }

  cancelarEdicao() {
    this.editando = false;
    this.produtoEditando = null;
  }

  async excluirProduto(id: string) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const produtoRef = doc(this.firestore, 'produtos', id);
      await deleteDoc(produtoRef);
      this.carregarProdutos();
    }
  }

  validarProduto(): boolean {
    return this.novoProduto.nome.trim() !== '' &&
           this.novoProduto.categoria !== '' &&
           this.novoProduto.precoCusto > 0 &&
           this.novoProduto.precoVenda > 0 &&
           this.novoProduto.quantidade >= 0;
  }

  limparFormulario() {
    this.novoProduto = {
      nome: '',
      categoria: '',
      precoCusto: 0,
      precoVenda: 0,
      quantidade: 0,
      unidade: 'kg',
      descricao: '',
      dataCadastro: new Date()
    };
  }

  calcularLucro(precoVenda: number, precoCusto: number): number {
    return precoVenda - precoCusto;
  }

  calcularMargemLucro(precoVenda: number, precoCusto: number): number {
    return ((precoVenda - precoCusto) / precoCusto) * 100;
  }
}
