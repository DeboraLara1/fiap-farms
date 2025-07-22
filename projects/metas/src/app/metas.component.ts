import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MetasTabComponent } from './components/metas-tab/metas-tab.component';
import { NotificacoesTabComponent } from './components/notificacoes-tab/notificacoes-tab.component';
import { RelatoriosTabComponent } from './components/relatorios-tab/relatorios-tab.component';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  valorMeta: number;
  valorAtual: number;
  dataInicio: Date;
  dataFim: Date;
  status: string;
  prioridade: string;
  dataCriacao: Date;
}

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  prioridade: string;
  lida: boolean;
  dataCriacao: Date;
  dataLeitura?: Date;
  acao?: string;
  link?: string;
}

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

  constructor(private firestore: Firestore) {
    this.carregarDados();
  }

  async carregarDados() {
    const metasRef = collection(this.firestore, 'metas');
    const notificacoesRef = collection(this.firestore, 'notificacoes');
    const [metasSnap, notificacoesSnap] = await Promise.all([
      getDocs(metasRef),
      getDocs(notificacoesRef)
    ]);
    const metas = metasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Meta[];
    const notificacoes = notificacoesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notificacao[];
    this.totalMetas = metas.filter(m => m.status === 'ativa').length;
    this.metasConcluidas = metas.filter(m => m.status === 'concluida').length;
    this.notificacoes = notificacoes.length;
  }

  setActiveTab(tab: 'metas' | 'notificacoes' | 'relatorios') {
    this.activeTab = tab;
    this.carregarDados(); 
  }
}
