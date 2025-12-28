import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsSerivces } from '../services/clients-serivces';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-comptes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-comptes.html',
  styleUrls: ['./client-comptes.css']
})
export class ClientComptes implements OnInit {
  client: any;
  comptes: any[] = [];
  clientId!: string;
  loading: boolean = false;
  errorMessage: string | null = null;
  searchTerm: string = '';

  constructor(
    private clientservice: ClientsSerivces,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['id'];
    this.loadClientComptes();
  }

  private loadClientComptes(): void {
    this.loading = true;
    this.errorMessage = null;

    // 1. Get Client First
    this.clientservice.getclientbyid(this.clientId).subscribe({
      next: (clientData) => {
        this.client = clientData;

        // 2. Then Get Accounts
        this.clientservice.getcomptesbyClient(this.clientId)
          .pipe(
            finalize(() => {
              this.loading = false;
              this.cd.detectChanges();
            })
          )
          .subscribe({
            next: (accountsData: any) => {
              console.log('Accounts API response:', accountsData);
              // Handle different response structures
              this.comptes = accountsData?.content || accountsData || [];
              console.log('Parsed accounts:', this.comptes);
            },
            error: (err) => {
              console.error("Error loading accounts:", err);
              this.errorMessage = "Erreur de chargement des comptes (Vérifiez la console)";
            }
          });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = "Client introuvable";
        console.error("Error loading client:", err);
      }
    });
  }

  // 👇 ADDED BACK: Needed by HTML
  protected handleViewCompteDetails(compte: any): void {
    this.router.navigate(['/compte-details', compte.id]);
  }

  // 👇 ADDED BACK: Needed by HTML
  protected calculateTotalBalance(): number {
    if (!this.comptes) return 0;
    return this.comptes.reduce((total, c) => total + (c.solde || 0), 0);
  }

  protected handleBack(): void {
    this.router.navigate(['/clients']);
  }

  protected searchClient(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.errorMessage = 'Veuillez entrer un ID de client';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Search only by ID
    this.clientservice.getclientbyid(this.searchTerm.trim()).subscribe({
      next: (client) => {
        this.client = client;
        this.clientId = client.id;
        this.loadClientComptes();
      },
      error: () => {
        this.errorMessage = 'Client introuvable avec cet ID';
        this.loading = false;
      }
    });
  }
}
