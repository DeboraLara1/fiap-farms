import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

interface VendaData {
  data: Date;
  valor: number;
}

@Component({
  selector: 'app-sales-evolution-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './sales-evolution-chart.html',
  styleUrls: ['./sales-evolution-chart.scss']
})
export class SalesEvolutionChartComponent implements OnInit, OnChanges {
  @Input() data: VendaData[] = [];
  @Input() period: string = '7dias';

  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Vendas (R$)',
      backgroundColor: 'rgba(102, 126, 234, 0.2)',
      borderColor: '#667eea',
      borderWidth: 3,
      pointBackgroundColor: '#667eea',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      fill: true,
      tension: 0.4
    }]
  };

  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
            return `R$ ${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          }
        }
      },
      y: {
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
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#667eea',
        hoverBorderColor: '#fff'
      }
    }
  };

  ngOnInit() {
    this.atualizarDados();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['period']) {
      this.atualizarDados();
    }
  }

  private atualizarDados() {
    if (this.data && this.data.length > 0) {
      this.lineChartData.labels = this.data.map(item =>
        this.formatarData(item.data)
      );
      this.lineChartData.datasets[0].data = this.data.map(item => item.valor);
      this.lineChartData = { ...this.lineChartData };
    } else {
      const ultimos7Dias = [];
      const hoje = new Date();
      for (let i = 6; i >= 0; i--) {
        const data = new Date(hoje);
        data.setDate(data.getDate() - i);
        ultimos7Dias.push({
          data,
          valor: 0
        });
      }

      this.lineChartData.labels = ultimos7Dias.map(item =>
        this.formatarData(item.data)
      );
      this.lineChartData.datasets[0].data = ultimos7Dias.map(item => item.valor);
    }
  }

  private formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  }
}
