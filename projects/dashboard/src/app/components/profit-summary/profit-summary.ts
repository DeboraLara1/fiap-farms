import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profit-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profit-summary.html',
  styleUrl: './profit-summary.scss'
})
export class ProfitSummary {
  totalProfit = 55000;
  bestProduct = 'Produto D';
}
