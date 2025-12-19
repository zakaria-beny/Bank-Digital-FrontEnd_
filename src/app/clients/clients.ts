import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClientsSerivces } from '../services/clients-serivces';
import {FormBuilder, FormGroup } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, HttpClientModule,ReactiveFormsModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class Clients implements OnInit {

  clients: any ;
  searchformGroup!: FormGroup ;
  constructor(private clientservice: ClientsSerivces ,private fb:FormBuilder) {}

  ngOnInit(): void {
    this.searchformGroup=this.fb.group(
      { motcle :this.fb.control("")}

    )
    this.clientservice.getclients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  protected handleSearchClients() {


  }
}
