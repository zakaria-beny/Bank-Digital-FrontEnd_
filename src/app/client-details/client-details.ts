import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsSerivces } from '../services/clients-serivces';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-details.html',
  styleUrl: './client-details.css'
})
export class ClientDetails implements OnInit {
  client: any;
  clientId!: number;
  loading: boolean = true;

  constructor(
    private clientservice: ClientsSerivces,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['id'];
    this.loadClientDetails();
  }

  private loadClientDetails(): void {
    this.clientservice.getclientbyid(this.clientId).subscribe({
      next: (data) => {
        this.client = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors du chargement des détails du client");
        this.router.navigate(['/clients']);
      }
    });
  }

  protected handleViewComptes(): void {
    this.router.navigate(['/client-comptes', this.clientId]);
  }

  protected handleEditClient(): void {
    this.router.navigate(['/edit-client', this.clientId]);
  }

  protected handleDeleteClient(): void {
    let confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmation) {
      this.clientservice.deleteclient(this.clientId).subscribe({
        next: () => {
          alert("Client supprimé avec succès");
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de la suppression");
        }
      });
    }
  }

  protected handleBack(): void {
    this.router.navigate(['/clients']);
  }
}
