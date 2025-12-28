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

  public getcomptes(page?: number, size?: number): Observable<any> {
    const url =
      page === undefined || size === undefined ? this.baseUrl : `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get(url, this.getHeaders());
  }

  public searchcomptes(motcle: string, page?: number, size?: number): Observable<any> {
    const url =
      page === undefined || size === undefined
        ? `${this.baseUrl}/search?motcle=${motcle}`
        : `${this.baseUrl}/search?motcle=${motcle}&page=${page}&size=${size}`;
    return this.http.get(url, this.getHeaders());
  }

  public ajoutercompte(compte: any): Observable<any> {
    return this.http.post(this.baseUrl, compte, this.getHeaders());
  }

  public getcomptebyid(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  public updatecompte(id: string, compte: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, compte, this.getHeaders());
  }

  public deletecompte(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  public getoperations(compteId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${compteId}/operations`, this.getHeaders());
  }

  public credit(compteId: string, montant: number, description: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${compteId}/credit`,
      { montant, description },
      this.getHeaders()
    );
  }

  public debit(compteId: string, montant: number, description: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${compteId}/debit`,
      { montant, description },
      this.getHeaders()
    );
  }

  public transfer(sourceId: string, destId: string, montant: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${sourceId}/transfer`,
      { compteDestination: destId, montant },
      this.getHeaders()
    );
  }



}
