import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {ClientsSerivces } from '../services/clients-serivces';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-noveau-client',
  imports: [ReactiveFormsModule],
  templateUrl: './noveau-client.html',
  styleUrl: './noveau-client.css',
  standalone: true

})
export class NoveauClient implements OnInit{
  noveauClientFormGroup !:FormGroup ;

  constructor(private fb:FormBuilder,private  clientservice : ClientsSerivces) {
  }

  ngOnInit(): void {
this.noveauClientFormGroup =this.fb.group({
  nom: this.fb.control(null,[Validators.required , Validators.minLength(4)]),
  email :this.fb.control(null,[ Validators.required ,Validators.email]),
})    }

  protected handleSaveClient() {
let client=this.noveauClientFormGroup.value;
this.clientservice.ajouterclients(client).subscribe({
  next: data => {
    alert("Client saved successfully");

  },
  error: err => {
    alert(err);
  }
})

  }
}
