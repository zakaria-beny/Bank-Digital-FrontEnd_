import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Import
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ClientsSerivces } from '../services/clients-serivces';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-client.html',
  styleUrls: ['./edit-client.css']
})
export class EditClient implements OnInit {
  editClientFormGroup!: FormGroup;
  clientId!: string;

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientsSerivces,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef // 👈 INJECTED
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['id'];

    this.editClientFormGroup = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.clientservice.getclientbyid(this.clientId).subscribe({
      next: (data) => {
        this.editClientFormGroup.patchValue({
          nom: data.nom,
          email: data.email
        });
        this.cd.detectChanges(); // 👈 FORCE UPDATE
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors du chargement du client");
        this.router.navigate(['/clients']);
      }
    });
  }

  handleUpdateClient(): void {
    if (this.editClientFormGroup.invalid) return;

    const client = {
      id: this.clientId,
      ...this.editClientFormGroup.value
    };

    this.clientservice.updateclient(this.clientId, client).subscribe({
      next: () => {
        alert("Client mis à jour avec succès");
        this.router.navigate(['/client-details', this.clientId]);
        this.cd.detectChanges(); // 👈 FORCE UPDATE
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de la mise à jour");
        this.cd.detectChanges();
      }
    });
  }

  handleCancel(): void {
    this.router.navigate(['/client-details', this.clientId]);
  }
}
