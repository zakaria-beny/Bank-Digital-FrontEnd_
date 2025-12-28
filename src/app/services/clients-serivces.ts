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

  public searchclients(motcle: string, page: number = 0, size: number = 10) {
    return this.http.get(
      `${this.host}/clients/search?motcle=${motcle}&page=${page}&size=${size}`,
      this.getHeaders()
    );
  }


  public ajouterclients(client: any) {
    return this.http.post(`${this.host}/clients`, client, this.getHeaders());
  }

  public getclientbyid(id: string): Observable<any> {
    return this.http.get(`${this.host}/clients/${id}`, this.getHeaders());
  }

  public updateclient(id: string, client: any): Observable<any> {
    return this.http.put(`${this.host}/clients/${id}`, client, this.getHeaders());
  }

  public deleteclient(id: string): Observable<any> {
    return this.http.delete(`${this.host}/clients/${id}`, this.getHeaders());
  }


  public getcomptesbyClient(clientId: string): Observable<any> {
    return this.http.get(`${this.host}/clients/${clientId}/comptes`, this.getHeaders());
  }
}
