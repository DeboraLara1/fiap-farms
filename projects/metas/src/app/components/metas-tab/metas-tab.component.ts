import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from '@angular/fire/firestore';

interface Meta {
  id?: string;
  titulo: string;
  descricao: string;
  tipo: 'vendas' | 'produtos' | 'lucro' | 'clientes';
  valorMeta: number;
  valorAtual: number;
  dataInicio: Date;
  dataFim: Date;
  status: 'ativa' | 'concluida' | 'atrasada';
  prioridade: 'baixa' | 'media' | 'alta';
  dataCriacao: Date;
}

@Component({
  selector: 'app-metas-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metas-tab.component.html',
  styleUrl: './metas-tab.component.scss'
})
export class MetasTabComponent implements OnInit {
  metas: Meta[] = [];

  novaMeta: Meta = {
    titulo: '',
    descricao: '',
    tipo: 'vendas',
    valorMeta: 0,
    valorAtual: 0,
    dataInicio: new Date(),
    dataFim: new Date(),
    status: 'ativa',
    prioridade: 'media',
    dataCriacao: new Date()
  };

  editando = false;
  metaEditando: Meta | null = null;

  tiposMeta = [
    { value: 'vendas', label: 'Vendas', icon: '💰' },
    { value: 'produtos', label: 'Produtos', icon: '📦' },
    { value: 'lucro', label: 'Lucro', icon: '📈' },
    { value: 'clientes', label: 'Clientes', icon: '👥' }
  ];

  prioridades = [
    { value: 'baixa', label: 'Baixa', color: '#28a745' },
    { value: 'media', label: 'Média', color: '#ffc107' },
    { value: 'alta', label: 'Alta', color: '#dc3545' }
  ];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.carregarMetasTempoReal();
  }

  carregarMetasTempoReal() {
    const metasRef = collection(this.firestore, 'metas');
    onSnapshot(metasRef, (snapshot) => {
      this.metas = snapshot.docs.map(doc => {
        const data = doc.data();
        function parseDate(val: any): Date {
          if (!val) return new Date();
          if (typeof val.toDate === 'function') return val.toDate();
          if (typeof val === 'string') return new Date(val);
          if (val instanceof Date) return val;
          return new Date();
        }
        return {
          id: doc.id,
          ...data,
          valorAtual: Number(data['valorAtual']) || 0,
          valorMeta: Number(data['valorMeta']) || 0,
          dataInicio: parseDate(data['dataInicio']),
          dataFim: parseDate(data['dataFim']),
          dataCriacao: parseDate(data['dataCriacao'])
        } as Meta;
      });
    });
  }

  async criarMeta() {
    if (this.validarMeta()) {
      const metasRef = collection(this.firestore, 'metas');
      await addDoc(metasRef, {
        ...this.novaMeta,
        dataCriacao: new Date()
      });

      this.limparFormulario();
    }
  }

  editarMeta(meta: Meta) {
    this.editando = true;
    this.metaEditando = { ...meta };
  }

  async salvarEdicao() {
    if (this.metaEditando && this.metaEditando.id) {
      const valorAtual = Number(this.metaEditando.valorAtual) || 0;
      const metaRef = doc(this.firestore, 'metas', this.metaEditando.id);
      await updateDoc(metaRef, {
        titulo: this.metaEditando.titulo,
        descricao: this.metaEditando.descricao,
        tipo: this.metaEditando.tipo,
        valorMeta: this.metaEditando.valorMeta,
        valorAtual: valorAtual,
        dataInicio: this.metaEditando.dataInicio,
        dataFim: this.metaEditando.dataFim,
        status: this.metaEditando.status,
        prioridade: this.metaEditando.prioridade
      });

      this.cancelarEdicao();
    }
  }

  cancelarEdicao() {
    this.editando = false;
    this.metaEditando = null;
  }

  async excluirMeta(id: string) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      const metaRef = doc(this.firestore, 'metas', id);
      await deleteDoc(metaRef);
    }
  }

  async atualizarProgresso(meta: Meta, novoValor: number) {
    if (meta.id) {
      const valorAtual = Number(novoValor) || 0;
      const metaRef = doc(this.firestore, 'metas', meta.id);
      await updateDoc(metaRef, {
        valorAtual: valorAtual,
        status: valorAtual >= meta.valorMeta ? 'concluida' : 'ativa'
      });
    }
  }

  validarMeta(): boolean {
    return this.novaMeta.titulo.trim() !== '' &&
           this.novaMeta.valorMeta > 0 &&
           this.novaMeta.dataFim > this.novaMeta.dataInicio;
  }

  limparFormulario() {
    this.novaMeta = {
      titulo: '',
      descricao: '',
      tipo: 'vendas',
      valorMeta: 0,
      valorAtual: 0,
      dataInicio: new Date(),
      dataFim: new Date(),
      status: 'ativa',
      prioridade: 'media',
      dataCriacao: new Date()
    };
  }

  calcularProgresso(meta: Meta): number {
    return Math.min((meta.valorAtual / meta.valorMeta) * 100, 100);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'concluida': return '#28a745';
      case 'atrasada': return '#dc3545';
      default: return '#007bff';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'concluida': return '✅ Concluída';
      case 'atrasada': return '⏰ Atrasada';
      default: return '🔄 Ativa';
    }
  }

  getTipoIcon(tipo: string): string {
    const tipoMeta = this.tiposMeta.find(t => t.value === tipo);
    return tipoMeta?.icon || '🎯';
  }

  getTipoLabel(tipo: string): string {
    const tipoMeta = this.tiposMeta.find(t => t.value === tipo);
    return tipoMeta?.label || 'Meta';
  }

  getPrioridadeColor(prioridade: string): string {
    const prioridadeMeta = this.prioridades.find(p => p.value === prioridade);
    return prioridadeMeta?.color || '#6c757d';
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  isMetaAtrasada(meta: Meta): boolean {
    return new Date() > meta.dataFim && meta.status !== 'concluida';
  }
}
