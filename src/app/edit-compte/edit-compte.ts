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
  compteId!: string;
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private comptesservice: ComptesServices,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef 
  ) {}

  get currentAccountType(): string {
    return this.editCompteFormGroup?.get('type')?.value || '';
  }

  private normalizeType(value: string | null | undefined): string {
    const v = (value || '').toUpperCase();
    if (v.includes('COURANT')) return 'COURANT';
    if (v.includes('EPARGNE') || v.includes('EPARGNE')) return 'EPARGNE';
    return v;
  }

  ngOnInit(): void {
    this.compteId = this.route.snapshot.params['id'];
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
        const backendType = this.normalizeType(data.type);

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
      taux?.setValue(0, { emitEvent: false });
    } else if (type === 'EPARGNE') {
      taux?.setValidators([Validators.required, Validators.min(0)]);
      dec?.clearValidators();
      dec?.setValue(0, { emitEvent: false });
    }

    dec?.updateValueAndValidity();
    taux?.updateValueAndValidity();
  }

  handleUpdateCompte(): void {
    if (this.editCompteFormGroup.invalid) return;

    const raw = this.editCompteFormGroup.getRawValue();
    const type: string = this.normalizeType(raw.type);

    const payload: any = {
      type,
      statut: raw.statut,
      devise: raw.devise,
      solde: raw.solde,
      dateCreation: raw.dateCreation,
      decouvert: type === 'COURANT' ? raw.decouvert : 0,
      tauxInteret: type === 'EPARGNE' ? raw.tauxInteret : 0
    };

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
