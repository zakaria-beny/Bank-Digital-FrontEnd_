import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../services/dashboardservice';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  stats: {
    totalClients: number;
    totalComptes: number;
    totalBalance: number;
    totalOperations: number;
    compteCourantCount: number;
    compteEpargneCount: number;
    activeAccounts: number;
    suspendedAccounts: number;
  } | null = null;

  loading = true;

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: []
  };

  public chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          font: {
            size: 14
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label: string = context.label ?? '';
            const value: number = Number(context.parsed ?? 0);
            const data: number[] = context.dataset.data as number[];
            const total: number = data.reduce(
              (sum: number, current: number) => sum + (Number(current) || 0),
              0
            );
            const percentage: string =
              total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        const courantCount = Number(data?.compteCourantCount || 0);
        const epargneCount = Number(data?.compteEpargneCount || 0);

        this.stats = {
          totalClients: Number(data?.totalClients || 0),
          totalComptes: courantCount + epargneCount,
          totalBalance: Number(data?.totalBalance || 0),
          totalOperations: Number(data?.totalOperations || 0),
          compteCourantCount: courantCount,
          compteEpargneCount: epargneCount,
          activeAccounts: courantCount + epargneCount,
          suspendedAccounts: 0
        };

        this.initializeChart();
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
        this.loading = false;
        alert('Erreur lors du chargement des statistiques');
      }
    });
  }

  private initializeChart(): void {
    if (!this.stats) return;

    this.pieChartData = {
      labels: ['Comptes Courants', 'Comptes Épargne'],
      datasets: [
        {
          data: [
            this.stats.compteCourantCount,
            this.stats.compteEpargneCount
          ],
          backgroundColor: ['#0d6efd', '#198754'],
          hoverBackgroundColor: ['#0b5ed7', '#157347'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    };
  }
}
