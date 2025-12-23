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
  styleUrl: './comptes.css'
})
export class Comptes implements OnInit {
  comptes: any[] = [];
  searchformGroup!: FormGroup;
  loading: boolean = false;

  constructor(
    private comptesservice: ComptesServices,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchformGroup = this.fb.group({
      motcle: this.fb.control("")
    });
    this.loadAllComptes();
  }

  private loadAllComptes(): void {
    this.loading = true;
    this.comptesservice.getcomptes().subscribe({
      next: (data: any) => {
        console.log('✅ Comptes chargés:', data);
        this.comptes = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Erreur chargement:', err);
        this.loading = false;
        this.comptes = [];

      }
    });
  }

  protected handleSearchComptes(): void {
    let kw = this.searchformGroup?.value.motcle || '';
    kw = kw.trim();

    console.log('🔍 Recherche avec:', kw);


    if (kw === '') {
      this.loadAllComptes();
      return;
    }

    this.loading = true;
    this.comptesservice.searchcomptes(kw).subscribe({
      next: (data: any) => {
        console.log('✅ Résultats recherche:', data);
        this.comptes = Array.isArray(data) ? data : [];
        this.loading = false;


        if (this.comptes.length === 0) {
          console.log('ℹ️ Aucun résultat trouvé');
        }
      },
      error: (err: any) => {
        console.error('❌ Erreur recherche:', err);
        this.loading = false;


        if (err.status === 404) {
          alert('Aucun compte trouvé pour cette recherche');
          this.comptes = [];
        } else if (err.status === 0) {
          alert('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
        } else {
          alert('Erreur lors de la recherche: ' + (err.error?.message || err.message || 'Erreur inconnue'));
        }
      }
    });
  }

  protected handleViewDetails(compte: any): void {
    if (!compte || !compte.id) {
      alert('ID de compte invalide');
      return;
    }
    this.router.navigate(['/compte-details', compte.id]);
  }

  protected handleEditCompte(compte: any): void {
    if (!compte || !compte.id) {
      alert('ID de compte invalide');
      return;
    }
    console.log('✏️ Modifier compte:', compte.id);
    this.router.navigate(['/edit-compte', compte.id]);
  }

  handleDeleteCompte(c: any) {
    let conf = confirm("Are you sure you want to delete this account?");
    if(!conf) return;

    this.comptesservice.deletecompte(c.id).subscribe({
      next: () => {



        this.comptes = this.comptes.filter(compte => compte.id !== c.id);

        alert("Compte supprimé avec succès");
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de la suppression");
      }
    });
  }

  protected handleNewCompte(): void {
    this.router.navigate(['/nouveau-compte']);
  }
}
