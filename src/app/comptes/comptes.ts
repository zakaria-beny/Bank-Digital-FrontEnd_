import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComptesServices } from '../services/comptes-serivces';
import { finalize } from 'rxjs/operators'; // 👈 1. IMPORT THIS

@Component({
  selector: 'app-comptes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comptes.html',
  styleUrls: ['./comptes.css']
})
export class Comptes implements OnInit {
  comptes: any[] = [];
  searchformGroup!: FormGroup;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private comptesservice: ComptesServices,
    private fb: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchformGroup = this.fb.group({
      motcle: [""]
    });
    this.loadAllComptes();
  }

  private loadAllComptes(): void {
    this.loading = true;
    this.errorMessage = null; // Reset error on new load

    this.comptesservice.getcomptes()
      .pipe(
        // 👇 2. SAFETY SWITCH: This runs 100% of the time (Success OR Error)
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (data: any) => {
          this.comptes = Array.isArray(data) ? data : [];
        },
        error: (err: any) => {
          console.error("Backend Error:", err);
          this.errorMessage = err.message || "Erreur de connexion au serveur";
        }
      });
  }

  protected handleSearchComptes(): void {
    let kw = this.searchformGroup.value.motcle;

    if (!kw || kw.trim() === '') {
      this.loadAllComptes();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.comptesservice.searchcomptes(kw)
      .pipe(
        // 👇 2. SAFETY SWITCH for Search too
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (data: any) => {
          this.comptes = Array.isArray(data) ? data : [];
        },
        error: (err: any) => {
          if (err.status === 404) {
            this.comptes = [];
          } else {
            this.errorMessage = err.message || "Erreur lors de la recherche";
          }
        }
      });
  }

  protected handleViewDetails(compte: any): void {
    this.router.navigate(['/compte-details', compte.id]);
  }

  protected handleNewCompte(): void {
    this.router.navigate(['/nouveau-compte']);
  }

  handleDeleteCompte(c: any): void {
    if(!confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) return;

    this.comptesservice.deletecompte(c.id).subscribe({
      next: (resp) => {
        this.comptes = this.comptes.filter(compte => compte.id !== c.id);
        alert("Compte supprimé avec succès");
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de la suppression");
      }
    });
  }
}
