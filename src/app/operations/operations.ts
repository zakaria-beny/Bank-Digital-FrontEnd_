import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Import
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsSerivces } from '../services/clients-serivces';
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
  clients: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private comptesService: ComptesServices,
    private clientsService: ClientsSerivces,
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
    this.loadClients();
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

  private loadClients(): void {
    console.log('Starting to load clients...');
    this.clientsService.getclients().subscribe({
      next: (data: any) => {
        console.log('Raw clients API response:', data);
        
        // Handle different response structures
        let clientsData = data?.content || data || [];
        console.log('Parsed clients data:', clientsData);
        
        this.clients = clientsData;
        console.log('Final clients array:', this.clients);
        
        // Load accounts for each client
        this.loadAccountsForClients();
      },
      error: (err: any) => {
        console.error('Error loading clients:', err);
        this.errorMessage = "Erreur lors du chargement des clients: " + (err.message || 'Unknown error');
        this.cd.detectChanges();
      }
    });
  }

  private loadAccountsForClients(): void {
    console.log('Loading accounts for each client...');
    
    const accountPromises = this.clients.map(client => {
      return this.clientsService.getcomptesbyClient(client.id).toPromise()
        .then(accountsData => {
          console.log(`Accounts for client ${client.nom}:`, accountsData);
          client.comptes = accountsData?.content || accountsData || [];
          console.log(`Parsed accounts for ${client.nom}:`, client.comptes);
        })
        .catch(err => {
          console.error(`Error loading accounts for ${client.nom}:`, err);
          client.comptes = [];
        });
    });

    Promise.all(accountPromises).then(() => {
      console.log('All accounts loaded, updating UI...');
      console.log('Final clients with accounts:', this.clients);
      this.cd.detectChanges();
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
    
    // Check balance for debit operations
    if (formData.type === 'DEBIT' && formData.montant > this.compte.solde) {
      this.errorMessage = `Solde insuffisant! Solde actuel: ${this.compte.solde} ${this.compte.devise}`;
      this.clearMessagesAfterDelay();
      return;
    }

    const serviceCall = formData.type === 'CREDIT'
      ? this.comptesService.credit(this.compteId, formData.montant, formData.description)
      : this.comptesService.debit(this.compteId, formData.montant, formData.description);

    serviceCall.subscribe({
      next: () => {
        this.successMessage = `${formData.type === 'CREDIT' ? 'Dépôt' : 'Retrait'} effectué avec succès`;
        this.errorMessage = '';
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
    
    // Check balance
    if (formData.montant > this.compte.solde) {
      this.errorMessage = `Solde insuffisant! Solde actuel: ${this.compte.solde} ${this.compte.devise}`;
      this.clearMessagesAfterDelay();
      return;
    }

    // Check if transferring to same account
    if (formData.compteDestination === this.compteId) {
      this.errorMessage = "Impossible de transférer vers le même compte";
      this.clearMessagesAfterDelay();
      return;
    }

    this.comptesService.transfer(
      this.compteId,
      formData.compteDestination,
      formData.montant
    ).subscribe({
      next: () => {
        this.successMessage = "Virement effectué avec succès";
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

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
      this.cd.detectChanges();
    }, 5000);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
  }

  handleBack(): void {
    this.router.navigate(['/compte-details', this.compteId]);
  }
}
