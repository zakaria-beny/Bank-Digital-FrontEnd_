import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Import
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

  constructor(
    private comptesservice: ComptesServices,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef // 👈 INJECTED
  ) {}

  ngOnInit(): void {
    this.compteId = +this.route.snapshot.params['id'];
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.comptesservice.getcomptebyid(this.compteId).subscribe({
      next: (data: any) => {
        this.compte = data;
        this.loading = false;
        this.cd.detectChanges(); // 👈 FORCE UPDATE (Fixes spinner)
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/comptes']);
      }
    });
  }

  protected handleChangeStatus(newStatus: string): void {
    if (!confirm(`Passer au statut ${newStatus} ?`)) return;

    // Optimistic update (optional, but makes it feel faster)
    const oldStatus = this.compte.statut;
    this.compte.statut = newStatus;

    const updated = { ...this.compte, statut: newStatus };

    this.comptesservice.updatecompte(this.compteId, updated).subscribe({
      next: (data) => {
        this.compte = data;
        this.cd.detectChanges(); // 👈 FORCE UPDATE (Refreshes status badge immediately)
      },
      error: () => {
        this.compte.statut = oldStatus; // Revert on error
        alert("Erreur de mise à jour");
        this.cd.detectChanges();
      }
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
