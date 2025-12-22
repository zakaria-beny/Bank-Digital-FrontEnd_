import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClientsSerivces } from '../services/clients-serivces';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class Clients implements OnInit {

  clients: any;
  searchformGroup!: FormGroup;

  constructor(
    private clientservice: ClientsSerivces,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchformGroup = this.fb.group({
      motcle: this.fb.control("")
    });
    this.handleSearchClients();
  }

  protected handleSearchClients() {
    let kw = this.searchformGroup?.value.motcle;
    this.clientservice.searchclients(kw).subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  protected handleViewDetails(client: any) {
    this.router.navigate(['/client-details', client.id]);
  }

  protected handleEditClient(client: any) {
    this.router.navigate(['/edit-client', client.id]);
  }

  protected handleDeleteClient(client: any) {
    let confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmation) {
      this.clientservice.deleteclient(client.id).subscribe({
        next: () => {
          alert("Client supprimé avec succès");
          this.handleSearchClients();
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de la suppression");
        }
      });
    }
  }
}
