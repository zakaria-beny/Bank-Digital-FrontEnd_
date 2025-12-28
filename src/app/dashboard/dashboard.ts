import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../services/dashboardservice';
import { AuthService } from '../services/auth-serivce';
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

  stats: any = null;
  loading: boolean = false; // Default to false to prevent initial freeze
  errorMessage: string | null = null;

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: []
  };

  public chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cd: ChangeDetectorRef // 👈 Inject it here
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  logout(): void {
    this.authService.logout();
  }

  loadDashboardStats(): void {
    this.loading = true; // Turn on spinner
    this.errorMessage = null;
    const start = performance.now();

    this.dashboardService.getStats().subscribe({
      next: (data: any) => {
        console.log(`[dashboard] /dashboard/stats OK in ${Math.round(performance.now() - start)}ms`);
        console.log("1. Data received:", data); // Debug log

        // Map the data
        const courantCount = Number(data?.compteCourantCount || 0);
        const epargneCount = Number(data?.compteEpargneCount || 0);

        this.stats = {
          totalClients: Number(data?.totalClients || 0),
          totalComptes: courantCount + epargneCount,
          totalBalance: Number(data?.totalBalance || 0),
          totalOperations: Number(data?.totalOperations || 0),
          compteCourantCount: courantCount,
          compteEpargneCount: epargneCount,
          activeAccounts: Number(data?.activeAccounts || 0),
          suspendedAccounts: Number(data?.suspendedAccounts || 0)
        };

        this.initializeChart();

        // 👇 CRITICAL: Stop loading and Force Update
        this.loading = false;
        this.cd.detectChanges(); // Forces the HTML to refresh
        console.log("2. Loading set to false, UI should update");
      },
      error: (err) => {
        console.log(`[dashboard] /dashboard/stats ERROR in ${Math.round(performance.now() - start)}ms`);
        console.error('Error:', err);
        if (err?.status === 0) {
          this.errorMessage = "Impossible de contacter le serveur (CORS ou serveur arrêté).";
        } else {
          const backendMsg = err?.error?.message || err?.error || null;
          const status = err?.status ? ` (HTTP ${err.status})` : '';
          this.errorMessage = backendMsg
            ? `Erreur lors du chargement${status}: ${backendMsg}`
            : `Erreur lors du chargement${status}.`;
        }
        this.loading = false;
        this.cd.detectChanges(); // Force update even on error
      }
    });
  }

  private initializeChart(): void {
    if (!this.stats) return;

    this.pieChartData = {
      labels: ['Comptes Courants', 'Comptes Épargne'],
      datasets: [
        {
          data: [this.stats.compteCourantCount, this.stats.compteEpargneCount],
          backgroundColor: ['#0d6efd', '#198754'],
          hoverBackgroundColor: ['#0b5ed7', '#157347'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    };
  }
}
