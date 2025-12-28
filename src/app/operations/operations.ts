import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Import
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComptesServices } from '../services/comptes-serivces';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './operations.html',
  styleUrls: ['./operations.css']
})
export class Operations implements OnInit {
  compteId!: string;
  compte: any = null;
  operations: any[] = [];
  operationForm!: FormGroup;
  transferForm!: FormGroup;
  activeTab: string = 'history';
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private comptesService: ComptesServices,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef // 👈 INJECTED
  ) {}

  ngOnInit(): void {
    this.compteId = this.route.snapshot.params['id'];

    this.operationForm = this.fb.group({
      type: ['CREDIT', Validators.required],
      montant: [0, [Validators.required, Validators.min(1)]],
      description: ['']
    });

    this.transferForm = this.fb.group({
      compteDestination: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(1)]]
    });

    this.loadCompteDetails();
    this.loadOperations();
  }

  private loadCompteDetails(): void {
    this.comptesService.getcomptebyid(this.compteId).subscribe({
      next: (data) => {
        this.compte = data;
        this.loading = false;
        this.cd.detectChanges(); // 👈 FORCE UPDATE
      },
      error: () => {
        this.loading = false;
        alert("Erreur lors du chargement du compte");
        this.router.navigate(['/comptes']);
      }
    });
  }

  private loadOperations(): void {
    this.comptesService.getoperations(this.compteId).subscribe({
      next: (data) => {
        this.operations = data;
        this.cd.detectChanges(); // 👈 FORCE UPDATE
      },
      error: (err) => console.error(err)
    });
  }

  handleOperation(): void {
    if (this.operationForm.invalid) return;

    const formData = this.operationForm.value;
    const serviceCall = formData.type === 'CREDIT'
      ? this.comptesService.credit(this.compteId, formData.montant, formData.description)
      : this.comptesService.debit(this.compteId, formData.montant, formData.description);

    serviceCall.subscribe({
      next: () => {
        alert(`${formData.type} effectué avec succès`);
        this.operationForm.reset({ type: 'CREDIT', montant: 0, description: '' });
        this.loadCompteDetails();
        this.loadOperations();
        this.cd.detectChanges(); // 👈 FORCE UPDATE
      },
      error: (err) => {
        alert("Erreur: " + (err.error?.message || err.message));
        this.cd.detectChanges();
      }
    });
  }

  handleTransfer(): void {
    if (this.transferForm.invalid) return;

    const formData = this.transferForm.value;

    this.comptesService.transfer(
      this.compteId,
      formData.compteDestination,
      formData.montant
    ).subscribe({
      next: () => {
        alert("Virement effectué avec succès");
        this.transferForm.reset();
        this.loadCompteDetails();
        this.loadOperations();
        this.cd.detectChanges(); // 👈 FORCE UPDATE
      },
      error: (err) => {
        alert("Erreur: " + (err.error?.message || err.message));
        this.cd.detectChanges();
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  handleBack(): void {
    this.router.navigate(['/compte-details', this.compteId]);
  }
}
