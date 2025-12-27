import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Import
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ComptesServices } from '../services/comptes-serivces';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-compte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-compte.html',
  styleUrls: ['./edit-compte.css']
})
export class EditCompte implements OnInit {
  editCompteFormGroup!: FormGroup;
  compteId!: number;
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private comptesservice: ComptesServices,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef // 👈 INJECTED
  ) {}

  get currentAccountType(): string {
    return this.editCompteFormGroup?.get('type')?.value || '';
  }

  ngOnInit(): void {
    this.compteId = +this.route.snapshot.params['id'];
    this.initForm();
    this.loadCompte();
  }

  private initForm(): void {
    this.editCompteFormGroup = this.fb.group({
      id: [{value: '', disabled: true}],
      numeroCompte: [{value: '', disabled: true}],
      type: ['', Validators.required],
      statut: ['', Validators.required],
      devise: ['MAD', Validators.required],
      solde: [0, [Validators.required, Validators.min(0)]],
      dateCreation: ['', Validators.required],
      decouvert: [0],
      tauxInteret: [0]
    });

    this.editCompteFormGroup.get('type')?.valueChanges.subscribe(value => {
      this.applyConditionalValidators(value);
    });
  }

  private loadCompte(): void {
    this.loading = true;
    this.comptesservice.getcomptebyid(this.compteId).subscribe({
      next: (data: any) => {
        const dateOnly = data.dateCreation ? data.dateCreation.split('T')[0] : '';
        const backendType = data.type ? data.type.toUpperCase() : '';

        this.editCompteFormGroup.patchValue({
          id: data.id,
          numeroCompte: data.numeroCompte,
          type: backendType,
          statut: data.statut,
          devise: data.devise || 'MAD',
          solde: data.solde,
          dateCreation: dateOnly,
          decouvert: data.decouvert || 0,
          tauxInteret: data.tauxInteret || 0
        });

        this.applyConditionalValidators(backendType);
        this.loading = false;
        this.cd.detectChanges(); // 👈 FORCE UPDATE
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/comptes']);
      }
    });
  }

  private applyConditionalValidators(type: string): void {
    const dec = this.editCompteFormGroup.get('decouvert');
    const taux = this.editCompteFormGroup.get('tauxInteret');

    if (type === 'COURANT') {
      dec?.setValidators([Validators.required, Validators.min(0)]);
      taux?.clearValidators();
    } else if (type === 'EPARGNE') {
      taux?.setValidators([Validators.required, Validators.min(0)]);
      dec?.clearValidators();
    }

    dec?.updateValueAndValidity();
    taux?.updateValueAndValidity();
  }

  handleUpdateCompte(): void {
    if (this.editCompteFormGroup.invalid) return;
    const payload = this.editCompteFormGroup.getRawValue();
    this.comptesservice.updatecompte(this.compteId, payload).subscribe({
      next: () => {
        alert("Mis à jour avec succès !");
        this.router.navigate(['/compte-details', this.compteId]);
        this.cd.detectChanges(); // 👈 FORCE UPDATE
      },
      error: (err) => {
        alert("Erreur: " + err.message);
        this.cd.detectChanges();
      }
    });
  }

  handleCancel(): void {
    this.router.navigate(['/compte-details', this.compteId]);
  }
}
