import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';

interface Notificacao {
  id?: string;
  titulo: string;
  mensagem: string;
  tipo: 'meta' | 'venda' | 'estoque' | 'sistema';
  prioridade: 'baixa' | 'media' | 'alta';
  lida: boolean;
  dataCriacao: Date;
  dataLeitura?: Date;
  acao?: string;
  link?: string;
}

interface ConfiguracaoNotificacao {
  id?: string;
  tipo: string;
  ativo: boolean;
  email: boolean;
  push: boolean;
  som: boolean;
}

@Component({
  selector: 'app-notificacoes-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notificacoes-tab.component.html',
  styleUrl: './notificacoes-tab.component.scss'
})
export class NotificacoesTabComponent implements OnInit {
  notificacoes: Notificacao[] = [];
  configuracoes: ConfiguracaoNotificacao[] = [];
  filtroTipo: string = 'todas';
  mostrarLidas: boolean = true;

  tiposNotificacao = [
    { value: 'meta', label: 'Metas', icon: '🎯', color: '#667eea' },
    { value: 'venda', label: 'Vendas', icon: '💰', color: '#28a745' },
    { value: 'estoque', label: 'Estoque', icon: '📦', color: '#ffc107' },
    { value: 'sistema', label: 'Sistema', icon: '⚙️', color: '#6c757d' }
  ];

  prioridades = [
    { value: 'baixa', label: 'Baixa', color: '#28a745' },
    { value: 'media', label: 'Média', color: '#ffc107' },
    { value: 'alta', label: 'Alta', color: '#dc3545' }
  ];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.carregarNotificacoes();
    this.carregarConfiguracoes();
  }

  async carregarNotificacoes() {
    const notificacoesRef = collection(this.firestore, 'notificacoes');
    const snapshot = await getDocs(notificacoesRef);
    this.notificacoes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataCriacao: doc.data()['dataCriacao']?.toDate() || new Date(),
      dataLeitura: doc.data()['dataLeitura']?.toDate() || undefined
    } as Notificacao));
  }

  async carregarConfiguracoes() {
    const configRef = collection(this.firestore, 'configuracoes_notificacoes');
    const snapshot = await getDocs(configRef);
    this.configuracoes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ConfiguracaoNotificacao));

    if (this.configuracoes.length === 0) {
      await this.criarConfiguracoesPadrao();
    }
  }

  async criarConfiguracoesPadrao() {
    const configRef = collection(this.firestore, 'configuracoes_notificacoes');
    const configsPadrao = [
      { tipo: 'meta', ativo: true, email: true, push: true, som: true },
      { tipo: 'venda', ativo: true, email: false, push: true, som: false },
      { tipo: 'estoque', ativo: true, email: true, push: true, som: true },
      { tipo: 'sistema', ativo: true, email: true, push: false, som: false }
    ];

    for (const config of configsPadrao) {
      await addDoc(configRef, config);
    }

    this.carregarConfiguracoes();
  }

  async marcarComoLida(notificacao: Notificacao) {
    if (notificacao.id) {
      const notifRef = doc(this.firestore, 'notificacoes', notificacao.id);
      await updateDoc(notifRef, {
        lida: true,
        dataLeitura: new Date()
      });
      this.carregarNotificacoes();
    }
  }

  async marcarTodasComoLidas() {
    const notificacoesNaoLidas = this.notificacoes.filter(n => !n.lida);

    for (const notificacao of notificacoesNaoLidas) {
      await this.marcarComoLida(notificacao);
    }
  }

  async excluirNotificacao(id: string) {
    if (confirm('Tem certeza que deseja excluir esta notificação?')) {
      const notifRef = doc(this.firestore, 'notificacoes', id);
      await deleteDoc(notifRef);
      this.carregarNotificacoes();
    }
  }

  async limparNotificacoesLidas() {
    if (confirm('Tem certeza que deseja limpar todas as notificações lidas?')) {
      const notificacoesLidas = this.notificacoes.filter(n => n.lida);

      for (const notificacao of notificacoesLidas) {
        if (notificacao.id) {
          const notifRef = doc(this.firestore, 'notificacoes', notificacao.id);
          await deleteDoc(notifRef);
        }
      }

      this.carregarNotificacoes();
    }
  }

  async atualizarConfiguracao(config: ConfiguracaoNotificacao) {
    if (config.id) {
      const configRef = doc(this.firestore, 'configuracoes_notificacoes', config.id);
      await updateDoc(configRef, {
        ativo: config.ativo,
        email: config.email,
        push: config.push,
        som: config.som
      });
    }
  }

  getNotificacoesFiltradas(): Notificacao[] {
    let filtradas = this.notificacoes;

    if (this.filtroTipo !== 'todas') {
      filtradas = filtradas.filter(n => n.tipo === this.filtroTipo);
    }

    if (!this.mostrarLidas) {
      filtradas = filtradas.filter(n => !n.lida);
    }

    return filtradas.sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime());
  }

  getNotificacoesNaoLidas(): number {
    return this.notificacoes.filter(n => !n.lida).length;
  }

  getNotificacoesLidas(): number {
    return this.notificacoes.filter(n => n.lida).length;
  }

  getNotificacoesAltaPrioridade(): number {
    return this.notificacoes.filter(n => n.prioridade === 'alta').length;
  }

  getTipoIcon(tipo: string): string {
    const tipoNotif = this.tiposNotificacao.find(t => t.value === tipo);
    return tipoNotif?.icon || '🔔';
  }

  getTipoLabel(tipo: string): string {
    const tipoNotif = this.tiposNotificacao.find(t => t.value === tipo);
    return tipoNotif?.label || 'Notificação';
  }

  getTipoColor(tipo: string): string {
    const tipoNotif = this.tiposNotificacao.find(t => t.value === tipo);
    return tipoNotif?.color || '#6c757d';
  }

  getPrioridadeColor(prioridade: string): string {
    const prioridadeNotif = this.prioridades.find(p => p.value === prioridade);
    return prioridadeNotif?.color || '#6c757d';
  }

  formatarData(data: Date): string {
    const agora = new Date();
    const diff = agora.getTime() - data.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'Agora mesmo';
    if (minutos < 60) return `${minutos} min atrás`;
    if (horas < 24) return `${horas}h atrás`;
    if (dias < 7) return `${dias} dias atrás`;

    return data.toLocaleDateString('pt-BR');
  }

  getConfiguracao(tipo: string): ConfiguracaoNotificacao | undefined {
    return this.configuracoes.find(c => c.tipo === tipo);
  }
}
