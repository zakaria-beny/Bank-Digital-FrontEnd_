import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComptesServices {
  private baseUrl = 'http://localhost:8080/accounts';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }

  public getcomptes(): Observable<any> {
    return this.http.get(this.baseUrl, this.getHeaders());
  }

  public searchcomptes(motcle: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search?motcle=${motcle}`, this.getHeaders());
  }

  public ajoutercompte(compte: any): Observable<any> {
    return this.http.post(this.baseUrl, compte, this.getHeaders());
  }

  public getcomptebyid(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  public updatecompte(id: number, compte: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, compte, this.getHeaders());
  }

  public deletecompte(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  public getoperations(compteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${compteId}/operations`, this.getHeaders());
  }

  public credit(compteId: number, montant: number, description: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${compteId}/credit`,
      { montant, description },
      this.getHeaders()
    );
  }

  public debit(compteId: number, montant: number, description: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${compteId}/debit`,
      { montant, description },
      this.getHeaders()
    );
  }

  public transfer(sourceId: number, destId: number, montant: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${sourceId}/transfer`,
      { compteDestination: destId, montant },
      this.getHeaders()
    );
  }



}
