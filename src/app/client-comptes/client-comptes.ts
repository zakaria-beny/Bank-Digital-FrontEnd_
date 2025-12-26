import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsSerivces } from '../services/clients-serivces';

@Component({
  selector: 'app-client-comptes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-comptes.html',
  styleUrl: './client-comptes.css'
})
export class ClientComptes implements OnInit {
  client: any;
  comptes: any[] = [];
  clientId!: number;
  loading: boolean = true;

  constructor(
    private clientservice: ClientsSerivces,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['id'];
    this.loadClientAndComptes();
  }

  private loadClientAndComptes(): void {
    this.clientservice.getclientbyid(this.clientId).subscribe({
      next: (clientData: any) => {
        this.client = clientData;
        this.loadComptes();
      },
      error: (err: any) => {
        console.error(err);
        alert("Erreur lors du chargement du client");
        this.router.navigate(['/clients']);
      }
    });
  }

  private loadComptes(): void {
    this.clientservice.getcomptesbyClient(this.clientId).subscribe({
      next: (data: any) => {
        this.comptes = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  protected handleViewCompteDetails(compte: any): void {
    this.router.navigate(['/compte-details', compte.id]);
  }

  protected handleBack(): void {
    this.router.navigate(['/client-details', this.clientId]);
  }

  protected calculateTotalBalance(): number {
    return this.comptes.reduce((total, compte) => total + compte.solde, 0);
  }
}
