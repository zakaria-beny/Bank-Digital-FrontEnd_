import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ClientsSerivces {
  constructor(private http: HttpClient) {}

  public getclients() {
    return this.http.get("http://localhost:8080/clients");
  }

  public searchclients(motcle: String) {
    return this.http.get("http://localhost:8080/clients/search?motcle=" + motcle);
  }

  public ajouterclients(client: any) {
    return this.http.post("http://localhost:8080/clients", client);
  }

  public getclientbyid(id: number): Observable<any> {
    return this.http.get("http://localhost:8080/clients/" + id);
  }

  public updateclient(id: number, client: any): Observable<any> {
    return this.http.put("http://localhost:8080/clients/" + id, client);
  }

  public deleteclient(id: number): Observable<any> {
    return this.http.delete("http://localhost:8080/clients/" + id);
  }

  public getcomptesbyClient(clientId: number): Observable<any> {
    return this.http.get("http://localhost:8080/clients/" + clientId + "/comptes");
  }

}
