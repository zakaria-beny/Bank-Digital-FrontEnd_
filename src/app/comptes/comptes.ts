import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComptesServices } from '../services/comptes-serivces';

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

  constructor(private comptesservice: ComptesServices, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.searchformGroup = this.fb.group({ motcle: [""] });
    this.loadAllComptes();
  }

  private loadAllComptes(): void {
    this.loading = true;
    this.comptesservice.getcomptes().subscribe({
      next: (data: any) => {
        this.comptes = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.message || "Erreur de connexion";
        this.loading = false;
      }
    });
  }

  protected handleSearchComptes(): void {
    let kw = this.searchformGroup.value.motcle;
    if (!kw || kw.trim() === '') return this.loadAllComptes();
    this.loading = true;
    this.comptesservice.searchcomptes(kw).subscribe({
      next: (data: any) => {
        this.comptes = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.comptes = err.status === 404 ? [] : this.comptes;
      }
    });
  }

  protected handleViewDetails(compte: any): void { this.router.navigate(['/compte-details', compte.id]); }
  protected handleNewCompte(): void { this.router.navigate(['/nouveau-compte']); }

  handleDeleteCompte(c: any): void {
    if(!confirm("Supprimer ce compte ?")) return;
    this.comptesservice.deletecompte(c.id).subscribe({
      next: () => this.comptes = this.comptes.filter(compte => compte.id !== c.id),
      error: () => alert("Erreur lors de la suppression")
    });
  }
}
