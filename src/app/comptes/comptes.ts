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
  private allComptes: any[] = [];
  searchformGroup!: FormGroup;
  loading: boolean = false;
  errorMessage: string | null = null;

  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

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
    this.loadAllComptes(0);
  }

  private loadAllComptes(page: number = 0): void {
    this.loading = true;
    this.errorMessage = null; // Reset error on new load

    this.comptesservice.getcomptes(page, this.size)
      .pipe(
        // 👇 2. SAFETY SWITCH: This runs 100% of the time (Success OR Error)
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (data: any) => {
          this.page = page;

          if (Array.isArray(data)) {
            this.allComptes = data;
            this.totalElements = data.length;
            this.totalPages = Math.ceil(this.totalElements / this.size);

            if (this.totalPages === 0) {
              this.comptes = [];
              return;
            }

            if (this.page >= this.totalPages) {
              this.page = this.totalPages - 1;
            }

            this.comptes = this.allComptes.slice(this.page * this.size, (this.page + 1) * this.size);
            return;
          }

          this.allComptes = [];
          this.comptes = Array.isArray(data?.content) ? data.content : [];
          this.totalElements = Number(data?.totalElements ?? this.comptes.length);
          this.totalPages = Number(data?.totalPages ?? (this.comptes.length > 0 ? 1 : 0));
        },
        error: (err: any) => {
          console.error("Backend Error:", err);
          if (err?.status === 0) {
            this.errorMessage = 'Impossible de contacter le serveur (CORS ou serveur arrêté).';
          } else {
            const backendMsg = err?.error?.message || err?.error || null;
            const status = err?.status ? ` (HTTP ${err.status})` : '';
            this.errorMessage = backendMsg
              ? `Erreur de connexion${status}: ${backendMsg}`
              : (err?.message || `Erreur de connexion au serveur${status}`);
          }
          this.allComptes = [];
          this.comptes = [];
          this.totalElements = 0;
          this.totalPages = 0;
        }
      });
  }

  protected handleSearchComptes(): void {
    let kw = this.searchformGroup.value.motcle;

    if (!kw || kw.trim() === '') {
      this.loadAllComptes(0);
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.comptesservice.searchcomptes(kw, 0, this.size)
      .pipe(
        // 👇 2. SAFETY SWITCH for Search too
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (data: any) => {
          this.page = 0;

          if (Array.isArray(data)) {
            this.allComptes = data;
            this.totalElements = data.length;
            this.totalPages = Math.ceil(this.totalElements / this.size);
            this.comptes = this.allComptes.slice(0, this.size);
            return;
          }

          this.allComptes = [];
          this.comptes = Array.isArray(data?.content) ? data.content : [];
          this.totalElements = Number(data?.totalElements ?? this.comptes.length);
          this.totalPages = Number(data?.totalPages ?? (this.comptes.length > 0 ? 1 : 0));
        },
        error: (err: any) => {
          if (err.status === 404) {
            this.allComptes = [];
            this.comptes = [];
            this.totalElements = 0;
            this.totalPages = 0;
          } else {
            if (err?.status === 0) {
              this.errorMessage = 'Impossible de contacter le serveur (CORS ou serveur arrêté).';
            } else {
              const backendMsg = err?.error?.message || err?.error || null;
              const status = err?.status ? ` (HTTP ${err.status})` : '';
              this.errorMessage = backendMsg
                ? `Erreur lors de la recherche${status}: ${backendMsg}`
                : (err?.message || `Erreur lors de la recherche${status}`);
            }
            this.allComptes = [];
            this.comptes = [];
            this.totalElements = 0;
            this.totalPages = 0;
          }
        }
      });
  }

  protected handlePageChange(newPage: number): void {
    if (newPage < 0 || newPage >= this.totalPages) return;

    if (this.allComptes.length > 0) {
      this.page = newPage;
      this.comptes = this.allComptes.slice(this.page * this.size, (this.page + 1) * this.size);
      return;
    }

    const kw: string = (this.searchformGroup.value.motcle || '').trim();
    if (!kw) {
      this.loadAllComptes(newPage);
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.comptesservice
      .searchcomptes(kw, newPage, this.size)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (data: any) => {
          this.page = newPage;

          if (Array.isArray(data)) {
            this.comptes = data;
            this.totalElements = data.length;
            this.totalPages = data.length > 0 ? 1 : 0;
            return;
          }

          this.comptes = Array.isArray(data?.content) ? data.content : [];
          this.totalElements = Number(data?.totalElements ?? this.comptes.length);
          this.totalPages = Number(data?.totalPages ?? (this.comptes.length > 0 ? 1 : 0));
        },
        error: (err: any) => {
          console.error(err);
          this.comptes = [];
          this.totalElements = 0;
          this.totalPages = 0;
          this.errorMessage = err.message || "Erreur lors de la recherche";
        }
      });
  }

  protected handlePageSizeChange(newSize: number): void {
    this.size = newSize;

    if (this.allComptes.length > 0) {
      this.page = 0;
      this.totalPages = Math.ceil(this.totalElements / this.size);
      this.comptes = this.allComptes.slice(0, this.size);
      return;
    }

    this.handlePageChange(0);
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
