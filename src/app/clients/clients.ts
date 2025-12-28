import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClientsSerivces } from '../services/clients-serivces';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class Clients implements OnInit {

  clients: any[] = [];
  private allClients: any[] = [];
  searchformGroup!: FormGroup;
  loading: boolean = false;

  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  constructor(
    private clientservice: ClientsSerivces,
    private fb: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef // 👈 INJECTED HERE
  ) {}

  ngOnInit(): void {
    this.searchformGroup = this.fb.group({
      motcle: this.fb.control("")
    });
    this.handleSearchClients(0);
  }

  protected handleSearchClients(page: number = 0): void {
    const kw: string = (this.searchformGroup?.value?.motcle || '').trim();
    this.loading = true;

    this.clientservice
      .searchclients(kw, page, this.size)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (data: any) => {
          this.page = page;

          if (Array.isArray(data)) {
            this.allClients = data;
            this.totalElements = data.length;
            this.totalPages = Math.ceil(this.totalElements / this.size);

            if (this.totalPages === 0) {
              this.clients = [];
              return;
            }

            if (this.page >= this.totalPages) {
              this.page = this.totalPages - 1;
            }

            this.clients = this.allClients.slice(this.page * this.size, (this.page + 1) * this.size);
            return;
          }

          this.allClients = [];
          this.clients = Array.isArray(data?.content) ? data.content : [];
          this.totalElements = Number(data?.totalElements ?? this.clients.length);
          this.totalPages = Number(data?.totalPages ?? (this.clients.length > 0 ? 1 : 0));
        },
        error: (err) => {
          console.error(err);
          this.allClients = [];
          this.clients = [];
          this.totalElements = 0;
          this.totalPages = 0;
        }
      });
  }

  protected handleViewComptes(client: any): void {
    this.router.navigate(['/client-comptes', client.id]);
  }

  protected handlePageChange(newPage: number): void {
    if (newPage < 0 || newPage >= this.totalPages) return;

    if (this.allClients.length > 0) {
      this.page = newPage;
      this.clients = this.allClients.slice(this.page * this.size, (this.page + 1) * this.size);
      return;
    }

    this.handleSearchClients(newPage);
  }

  protected handlePageSizeChange(newSize: number): void {
    this.size = newSize;

    if (this.allClients.length > 0) {
      this.page = 0;
      this.totalPages = Math.ceil(this.totalElements / this.size);
      this.clients = this.allClients.slice(0, this.size);
      return;
    }

    this.handleSearchClients(0);
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
          this.handleSearchClients(this.page);
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de la suppression");
        }
      });
    }
  }
}
