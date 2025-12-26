import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ComptesServices } from '../services/comptes-serivces'; // Check spelling
import { ClientsSerivces } from '../services/clients-serivces'; // Check spelling
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nouveau-compte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './nouveau-compte.html',
  styleUrls: ['./nouveau-compte.css']
})
export class NouveauCompte implements OnInit {
  noveauCompteFormGroup!: FormGroup;
  listClients: any[] = []; // Store the clients here

  constructor(
    private fb: FormBuilder,
    private compteService: ComptesServices,
    private clientService: ClientsSerivces,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.noveauCompteFormGroup = this.fb.group({
      type: ['COURANT', Validators.required], // Default to COURANT (matches Backend)
      clientId: [null, Validators.required],  // Must select a client
      solde: [0, [Validators.required, Validators.min(0)]],
      devise: ['MAD', Validators.required],
      decouvert: [0],
      tauxInteret: [0]
    });

    // 2. Load Clients (Required by Specification)
    this.clientService.getclients().subscribe({
      next: (data: any) => {
        this.listClients = data;
        console.log("Clients loaded:", data);
      },
      error: (err) => console.error("Error loading clients:", err)
    });
  }

  handleSaveCompte() {
    if (this.noveauCompteFormGroup.invalid) {
      alert("Veuillez remplir tous les champs obligatoires (Client, Solde, etc.)");
      return;
    }

    let formData = this.noveauCompteFormGroup.value;

    let compteDTO = {
      numeroCompte: "",
      solde: formData.solde,
      devise: formData.devise,
      type: formData.type,
      clientId: formData.clientId,
      decouvert: formData.type === 'COURANT' ? formData.decouvert : 0,
      tauxInteret: formData.type === 'EPARGNE' ? formData.tauxInteret : 0
    };


    this.compteService.ajoutercompte(compteDTO).subscribe({
      next: (resp) => {
        alert("Compte créé avec succès!");
        this.router.navigate(['/comptes']);
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de la création: " + (err.error?.message || "Erreur serveur"));
      }
    });
  }
}
