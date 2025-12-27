import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ClientsSerivces {
  private host = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  // 👇 1. Helper to create headers with the Token
  private getHeaders() {
    const token = localStorage.getItem('token'); // Get token from AuthService storage
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '' // Attach Bearer Token
      })
    };
  }

  public getclients() {
    return this.http.get(`${this.host}/clients`, this.getHeaders());
  }

  public searchclients(motcle: String) {
    return this.http.get(`${this.host}/clients/search?motcle=${motcle}`, this.getHeaders());
  }

  public ajouterclients(client: any) {
    return this.http.post(`${this.host}/clients`, client, this.getHeaders());
  }

  public getclientbyid(id: number): Observable<any> {
    return this.http.get(`${this.host}/clients/${id}`, this.getHeaders());
  }

  public updateclient(id: number, client: any): Observable<any> {
    return this.http.put(`${this.host}/clients/${id}`, client, this.getHeaders());
  }

  public deleteclient(id: number): Observable<any> {
    return this.http.delete(`${this.host}/clients/${id}`, this.getHeaders());
  }


  public getcomptesbyClient(clientId: number): Observable<any> {
    return this.http.get(`${this.host}/clients/${clientId}/comptes`, this.getHeaders());
  }
}
