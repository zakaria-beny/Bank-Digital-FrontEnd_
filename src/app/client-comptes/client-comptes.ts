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
              this.comptes = accountsData;
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
      this.errorMessage = 'Veuillez entrer un ID ou un nom de client';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Try to find by ID first, then by name
    this.clientservice.getclientbyid(this.searchTerm.trim()).subscribe({
      next: (client) => {
        this.client = client;
        this.clientId = client.id;
        this.loadClientComptes();
      },
      error: () => {
        // If not found by ID, search by name
        this.clientservice.searchclients(this.searchTerm.trim(), 0, 10).subscribe({
          next: (response: any) => {
            if (response.content && response.content.length > 0) {
              const firstClient = response.content[0];
              this.client = firstClient;
              this.clientId = firstClient.id;
              this.loadClientComptes();
            } else {
              this.errorMessage = 'Aucun client trouvé avec cet ID ou ce nom';
              this.loading = false;
            }
          },
          error: () => {
            this.errorMessage = 'Erreur lors de la recherche du client';
            this.loading = false;
          }
        });
      }
    });
  }
}
