import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

interface ProdutoData {
  produto: string;
  valor: number;
}

@Component({
  selector: 'app-top-products-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './top-products-chart.html',
  styleUrls: ['./top-products-chart.scss']
})
export class TopProductsChartComponent implements OnInit, OnChanges {
  @Input() data: ProdutoData[] = [];

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Vendas (R$)',
      backgroundColor: [
        '#667eea',
        '#764ba2',
        '#f093fb',
        '#f5576c',
        '#4facfe'
      ],
      borderColor: [
        '#667eea',
        '#764ba2',
        '#f093fb',
        '#f5576c',
        '#4facfe'
      ],
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  public barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            return `R$ ${context.parsed.x.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderDash: [5, 5]
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          },
          callback: (value: any) => {
            return `R$ ${value}`;
          }
        },
        beginAtZero: true
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          }
        }
      }
    }
  };

  ngOnInit() {
    this.atualizarDados();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.atualizarDados();
    }
  }

  private atualizarDados() {
    if (this.data && this.data.length > 0) {
      this.barChartData.labels = this.data.map(item => item.produto);
      this.barChartData.datasets[0].data = this.data.map(item => item.valor);
      this.barChartData = { ...this.barChartData };
    } else {
      this.barChartData.labels = ['Sem dados'];
      this.barChartData.datasets[0].data = [0];
      this.barChartData.datasets[0].backgroundColor = ['#E0E0E0'];
      this.barChartData.datasets[0].borderColor = ['#E0E0E0'];
    }
  }
}
