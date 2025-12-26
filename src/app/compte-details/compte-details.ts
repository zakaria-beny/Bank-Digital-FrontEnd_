import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ComptesServices } from '../services/comptes-serivces';

@Component({
  selector: 'app-compte-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compte-details.html',
  styleUrl: './compte-details.css'
})
export class CompteDetails implements OnInit {
  compte: any = null;
  compteId!: number;
  loading: boolean = true;

  constructor(private comptesservice: ComptesServices, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.compteId = +this.route.snapshot.params['id'];
    this.loadData();
  }

  private loadData(): void {
    this.comptesservice.getcomptebyid(this.compteId).subscribe({
      next: (data: any) => {
        this.compte = data;
        this.loading = false;
      },
      error: () => this.router.navigate(['/comptes'])
    });
  }

  protected handleChangeStatus(newStatus: string): void {
    if (!confirm(`Passer au statut ${newStatus} ?`)) return;
    const updated = { ...this.compte, statut: newStatus };
    this.comptesservice.updatecompte(this.compteId, updated).subscribe({
      next: (data) => this.compte = data,
      error: () => alert("Erreur de mise à jour")
    });
  }

  protected handleOperations(): void {
    this.router.navigate(['/operations', this.compteId]);
  }

  protected handleEditCompte(): void {
    this.router.navigate(['/edit-compte', this.compteId]);
  }

  protected handleBack(): void {
    this.router.navigate(['/comptes']);
  }

  protected handleDeleteCompte(): void {
    if (confirm("Supprimer ce compte ?")) {
      this.comptesservice.deletecompte(this.compteId).subscribe({
        next: () => this.router.navigate(['/comptes']),
        error: () => alert("Erreur de suppression")
      });
    }
  }
}
