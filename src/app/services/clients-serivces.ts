import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ClientsSerivces {
  constructor(private http:HttpClient) {
  }
  public  getclients(){
    return this.http.get("http://localhost:8080/clients");
  }
  public  searchclients(motcle:String){
    return this.http.get("http://localhost:8080/clients/search?motcle="+motcle);
  }
  public  ajouterclients(client:any){
    return this.http.post("http://localhost:8080/clients", client);
  }


}
