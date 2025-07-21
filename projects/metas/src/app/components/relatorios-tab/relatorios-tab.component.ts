import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

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

interface RelatorioMetas {
  totalMetas: number;
  metasConcluidas: number;
  metasAtivas: number;
  metasAtrasadas: number;
  taxaSucesso: number;
  valorTotalMeta: number;
  valorTotalAtual: number;
  progressoGeral: number;
}

@Component({
  selector: 'app-relatorios-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorios-tab.component.html',
  styleUrl: './relatorios-tab.component.scss'
})
export class RelatoriosTabComponent implements OnInit {
  metas: Meta[] = [];
  relatorio: RelatorioMetas = {
    totalMetas: 0,
    metasConcluidas: 0,
    metasAtivas: 0,
    metasAtrasadas: 0,
    taxaSucesso: 0,
    valorTotalMeta: 0,
    valorTotalAtual: 0,
    progressoGeral: 0
  };

  filtroPeriodo: 'todos' | 'mes' | 'trimestre' | 'ano' = 'todos';
  filtroTipo: string = 'todos';

  tiposMeta = [
    { value: 'vendas', label: 'Vendas', icon: '💰', color: '#28a745' },
    { value: 'produtos', label: 'Produtos', icon: '📦', color: '#ffc107' },
    { value: 'lucro', label: 'Lucro', icon: '📈', color: '#17a2b8' },
    { value: 'clientes', label: 'Clientes', icon: '👥', color: '#6f42c1' }
  ];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.carregarMetas();
  }

  async carregarMetas() {
    const metasRef = collection(this.firestore, 'metas');
    const snapshot = await getDocs(metasRef);
    this.metas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataInicio: doc.data()['dataInicio']?.toDate() || new Date(),
      dataFim: doc.data()['dataFim']?.toDate() || new Date(),
      dataCriacao: doc.data()['dataCriacao']?.toDate() || new Date()
    } as Meta));

    this.calcularRelatorio();
  }

  calcularRelatorio() {
    const metasFiltradas = this.filtrarMetas();

    this.relatorio.totalMetas = metasFiltradas.length;
    this.relatorio.metasConcluidas = metasFiltradas.filter(m => m.status === 'concluida').length;
    this.relatorio.metasAtivas = metasFiltradas.filter(m => m.status === 'ativa').length;
    this.relatorio.metasAtrasadas = metasFiltradas.filter(m => m.status === 'atrasada').length;

    this.relatorio.taxaSucesso = this.relatorio.totalMetas > 0
      ? (this.relatorio.metasConcluidas / this.relatorio.totalMetas) * 100
      : 0;

    this.relatorio.valorTotalMeta = metasFiltradas.reduce((sum, meta) => sum + meta.valorMeta, 0);
    this.relatorio.valorTotalAtual = metasFiltradas.reduce((sum, meta) => sum + meta.valorAtual, 0);

    this.relatorio.progressoGeral = this.relatorio.valorTotalMeta > 0
      ? (this.relatorio.valorTotalAtual / this.relatorio.valorTotalMeta) * 100
      : 0;
  }

  filtrarMetas(): Meta[] {
    let filtradas = this.metas;

    const agora = new Date();
    switch (this.filtroPeriodo) {
      case 'mes':
        const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
        filtradas = filtradas.filter(m => m.dataCriacao >= inicioMes);
        break;
      case 'trimestre':
        const inicioTrimestre = new Date(agora.getFullYear(), Math.floor(agora.getMonth() / 3) * 3, 1);
        filtradas = filtradas.filter(m => m.dataCriacao >= inicioTrimestre);
        break;
      case 'ano':
        const inicioAno = new Date(agora.getFullYear(), 0, 1);
        filtradas = filtradas.filter(m => m.dataCriacao >= inicioAno);
        break;
    }

    if (this.filtroTipo !== 'todos') {
      filtradas = filtradas.filter(m => m.tipo === this.filtroTipo);
    }

    return filtradas;
  }

  getMetasPorTipo() {
    const metasFiltradas = this.filtrarMetas();
    const porTipo = this.tiposMeta.map(tipo => ({
      tipo: tipo.label,
      icon: tipo.icon,
      color: tipo.color,
      count: metasFiltradas.filter(m => m.tipo === tipo.value).length,
      concluidas: metasFiltradas.filter(m => m.tipo === tipo.value && m.status === 'concluida').length,
      ativas: metasFiltradas.filter(m => m.tipo === tipo.value && m.status === 'ativa').length,
      atrasadas: metasFiltradas.filter(m => m.tipo === tipo.value && m.status === 'atrasada').length
    }));

    return porTipo.filter(item => item.count > 0);
  }

  getMetasPorPrioridade() {
    const metasFiltradas = this.filtrarMetas();
    return [
      {
        prioridade: 'Alta',
        color: '#dc3545',
        count: metasFiltradas.filter(m => m.prioridade === 'alta').length,
        concluidas: metasFiltradas.filter(m => m.prioridade === 'alta' && m.status === 'concluida').length
      },
      {
        prioridade: 'Média',
        color: '#ffc107',
        count: metasFiltradas.filter(m => m.prioridade === 'media').length,
        concluidas: metasFiltradas.filter(m => m.prioridade === 'media' && m.status === 'concluida').length
      },
      {
        prioridade: 'Baixa',
        color: '#28a745',
        count: metasFiltradas.filter(m => m.prioridade === 'baixa').length,
        concluidas: metasFiltradas.filter(m => m.prioridade === 'baixa' && m.status === 'concluida').length
      }
    ].filter(item => item.count > 0);
  }

  getTopMetas() {
    const metasFiltradas = this.filtrarMetas();
    return metasFiltradas
      .sort((a, b) => (b.valorAtual / b.valorMeta) - (a.valorAtual / a.valorMeta))
      .slice(0, 5);
  }

  getMetasAtrasadas() {
    const metasFiltradas = this.filtrarMetas();
    return metasFiltradas
      .filter(m => m.status === 'atrasada' || (new Date() > m.dataFim && m.status !== 'concluida'))
      .sort((a, b) => b.dataFim.getTime() - a.dataFim.getTime());
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

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarPercentual(valor: number): string {
    return `${valor.toFixed(1)}%`;
  }

  getDiasRestantes(meta: Meta): number {
    const hoje = new Date();
    const fim = new Date(meta.dataFim);
    const diff = fim.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getDiasAtrasados(meta: Meta): number {
    return Math.abs(this.getDiasRestantes(meta));
  }

  isMetaAtrasada(meta: Meta): boolean {
    return new Date() > meta.dataFim && meta.status !== 'concluida';
  }
}
