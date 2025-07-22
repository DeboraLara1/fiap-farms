import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

interface CategoriaData {
  categoria: string;
  valor: number;
}

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './category-chart.html',
  styleUrls: ['./category-chart.scss']
})
export class CategoryChartComponent implements OnInit, OnChanges {
  @Input() data: CategoriaData[] = [];

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  public doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false
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
      this.doughnutChartData.labels = this.data.map(item => item.categoria);
      this.doughnutChartData.datasets[0].data = this.data.map(item => item.valor);
      this.doughnutChartData = { ...this.doughnutChartData };
    } else {
      this.doughnutChartData.labels = ['Sem dados'];
      this.doughnutChartData.datasets[0].data = [1];
      this.doughnutChartData.datasets[0].backgroundColor = ['#E0E0E0'];
    }
  }
}
