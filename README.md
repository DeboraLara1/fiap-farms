# 🌱 FIAP Farms - Sistema de Gestão Agrícola

Um sistema completo de gestão agrícola desenvolvido em Angular com Firebase, oferecendo controle de estoque, vendas, metas e relatórios em tempo real.

## 🎯 Visão Geral

O **FIAP Farms** é uma aplicação web moderna desenvolvida para gestão completa de fazendas e propriedades agrícolas. O sistema oferece:

- **Dashboard Interativo** com métricas em tempo real
- **Gestão de Estoque** de produtos agrícolas
- **Controle de Vendas** com histórico detalhado
- **Sistema de Metas** para planejamento e acompanhamento
- **Relatórios Avançados** com gráficos e análises
- **Autenticação Segura** com Firebase Auth

## 🏗️ Arquitetura do Sistema

### Estrutura Modular
O projeto utiliza uma arquitetura **monorepo** com múltiplas aplicações Angular:

```
fiap-farms/
├── projects/
│   ├── host/              # Aplicação principal (porta 4200)
│   ├── dashboard/         # Dashboard de métricas (porta 4201)
│   ├── estoque/           # Gestão de estoque (porta 4202)
│   └── metas/             # Sistema de metas (porta 4203)
├── package.json
└── angular.json
```

### Padrões Utilizados
- **Micro Frontends**: Cada módulo é uma aplicação independente
- **Component-Based Architecture**: Componentes reutilizáveis
- **Real-time Data**: Sincronização em tempo real com Firestore
- **Responsive Design**: Interface adaptável para diferentes dispositivos

## 🚀 Funcionalidades

### 📊 Dashboard
- **Métricas em Tempo Real**: Total de vendas, valor total, lucro estimado
- **Gráficos Interativos**: Evolução de vendas, produtos por categoria, top produtos
- **Filtros por Período**: 7 dias, 30 dias, 90 dias, todos os períodos
- **Atualização Automática**: Dados sincronizados em tempo real

### 📦 Gestão de Estoque
- **Cadastro de Produtos**: Nome, categoria, preço, quantidade
- **Controle de Categorias**: Grãos, Laticínios, Frutas, Verduras
- **Acompanhamento de Quantidades**: Entrada e saída de produtos
- **Alertas de Estoque Baixo**: Notificações automáticas

### 💰 Controle de Vendas
- **Registro de Vendas**: Produto, quantidade, preço, data
- **Histórico Completo**: Todas as transações com filtros
- **Cálculo Automático**: Totais e médias calculadas automaticamente
- **Relatórios Detalhados**: Análise de performance de vendas

### 🎯 Sistema de Metas
- **Definição de Metas**: Vendas, produtos, lucro, clientes
- **Acompanhamento de Progresso**: Atualização em tempo real
- **Sistema de Prioridades**: Alta, média, baixa
- **Relatórios de Performance**: Taxa de sucesso e progresso geral

### 📈 Relatórios
- **Métricas Gerais**: Total de metas, concluídas, ativas, atrasadas
- **Análise por Tipo**: Performance por categoria de meta
- **Análise por Prioridade**: Foco em metas de alta prioridade
- **Filtros Avançados**: Por período e tipo de meta

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 20**: Framework principal
- **TypeScript**: Linguagem de programação
- **SCSS**: Pré-processador CSS
- **Chart.js**: Biblioteca de gráficos
- **ng2-charts**: Integração Angular + Chart.js
- **Angular Material**: Componentes UI

### Backend & Banco de Dados
- **Firebase**: Plataforma backend
- **Firestore**: Banco de dados NoSQL
- **Firebase Auth**: Autenticação de usuários
- **Firebase Hosting**: Deploy e hospedagem (A implementar ainda : TODO)

### Ferramentas de Desenvolvimento
- **Angular CLI**: Ferramentas de linha de comando
- **Concurrently**: Execução simultânea de múltiplos servidores
- **Prettier**: Formatação de código

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (gerenciador de pacotes)
- **Git** (controle de versão)
- **Angular CLI** (globalmente)

## ⚙️ Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/DeboraLara1/fiap-farms.git
cd fiap-farms
```

### 2. Instale as Dependências
```bash
npm install --legacy-peer-deps
```

### 3. Verifique a Instalação
```bash
ng version
```

## 🚀 Executando o Projeto

### Desenvolvimento

#### Opção 1: Executar Todos os Projetos Simultaneamente
```bash
npm run start:all
```

Isso iniciará todos os servidores:
- **Host**: http://localhost:4200
- **Dashboard**: http://localhost:4201
- **Estoque**: http://localhost:4202
- **Metas**: http://localhost:4203

#### Opção 2: Executar Projetos Individualmente
```bash
# Aplicação principal
ng serve host --port 4200

# Dashboard
ng serve dashboard --port 4201

# Estoque
ng serve estoque --port 4202

# Metas
ng serve metas --port 4203
```

### Build de Produção
```bash
# Build de todos os projetos
npm run build

# Build específico
ng build host --configuration production
ng build dashboard --configuration production
ng build estoque --configuration production
ng build metas --configuration production
```

## 📁 Estrutura do Projeto

```
fiap-farms/
├── projects/
│   ├── host/                          # Aplicação principal
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── pages/             # Páginas principais
│   │   │   │   │   ├── home/          # Página inicial
│   │   │   │   │   ├── login/         # Página de login
│   │   │   │   │   ├── register/      # Página de registro
│   │   │   │   │   └── *-shell/       # Shells dos módulos
│   │   │   │   ├── shared/            # Recursos compartilhados
│   │   │   │   │   ├── guards/        # Guards de autenticação
│   │   │   │   │   ├── interceptors/  # Interceptors HTTP
│   │   │   │   │   └── services/      # Serviços compartilhados
│   │   │   │   └── components/        # Componentes globais
│   │   │   ├── environment.ts         # Configurações de ambiente
│   │   │   └── main.ts                # Ponto de entrada
│   │   └── public/                    # Assets públicos
│   │
│   ├── dashboard/                     # Módulo de Dashboard
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/        # Componentes de gráficos
│   │   │   │   │   ├── category-chart/
│   │   │   │   │   ├── profit-summary/
│   │   │   │   │   ├── sales-evolution-chart/
│   │   │   │   │   └── top-products-chart/
│   │   │   │   └── dashboard.component.ts
│   │   │   └── main.ts
│   │
│   ├── estoque/                       # Módulo de Estoque
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/        # Componentes de estoque
│   │   │   │   │   ├── dashboard-tab/
│   │   │   │   │   ├── produtos-tab/
│   │   │   │   │   └── vendas-tab/
│   │   │   │   └── estoque.component.ts
│   │   │   └── main.ts
│   │
│   ├── metas/                         # Módulo de Metas
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/        # Componentes de metas
│   │   │   │   │   ├── metas-tab/
│   │   │   │   │   ├── notificacoes-tab/
│   │   │   │   │   └── relatorios-tab/
│   │   │   │   └── metas.component.ts
│   │   │   └── main.ts
│   │
│   └── shared/                        # Bibliotecas compartilhadas
│       └── src/
│           └── lib/
│               └── guards/            # Guards reutilizáveis
│
├── package.json                       # Dependências e scripts
├── angular.json                       # Configuração do Angular
├── tsconfig.json                      # Configuração do TypeScript
└── README.md                          # Este arquivo
```

## 🔥 API e Banco de Dados

### Estrutura do Firestore

#### Coleção: `produtos`
```typescript
interface Produto {
  id: string;
  nome: string;
  categoria: string;
  precoVenda: number;
  quantidade: number;
  dataCriacao: Date;
}
```

#### Coleção: `vendas`
```typescript
interface Venda {
  id: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  dataVenda: Date;
}
```

#### Coleção: `metas`
```typescript
interface Meta {
  id: string;
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
```

### Operações Principais

#### Leitura em Tempo Real
```typescript
// Exemplo de listener em tempo real
onSnapshot(collection(firestore, 'vendas'), (snapshot) => {
  const vendas = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
});
```

#### Escrita de Dados
```typescript
// Exemplo de criação de documento
await addDoc(collection(firestore, 'produtos'), {
  nome: 'Tomate',
  categoria: 'Verduras',
  precoVenda: 5.50,
  quantidade: 100,
  dataCriacao: new Date()
});
```

## 🌐 Deploy

### Firebase Hosting

1. **Instale o Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Faça Login**
```bash
firebase login
```

3. **Inicialize o Projeto**
```bash
firebase init hosting
```

4. **Configure o Build**
```bash
# Build de produção
ng build host --configuration production
ng build dashboard --configuration production
ng build estoque --configuration production
ng build metas --configuration production
```

5. **Deploy TODO**
.....

## 🐛 Solução de Problemas

### Problemas Comuns

#### Erro de Dependências
Se encontrar conflitos de dependências, use:
```bash
npm install --legacy-peer-deps
```
