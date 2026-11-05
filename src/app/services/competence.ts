
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

export interface Competence {
  id: number;
  nom: string;
  categorie: string;
  niveau: string;
}

export type NouvelleCompetence = Omit<Competence, 'id'>;

interface CsrfResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  private readonly apiUrl = '/api/admin/competences';
  private readonly csrfUrl = '/api/auth/csrf';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les compétences
  obtenirCompetences(): Observable<Competence[]> {
    return this.http.get<Competence[]>(this.apiUrl);
  }

  // Ajouter une compétence
  ajouterCompetence(
    competence: NouvelleCompetence
  ): Observable<Competence> {
    return this.avecCsrf(headers =>
      this.http.post<Competence>(
        this.apiUrl,
        competence,
        { headers }
      )
    );
  }

  // Modifier une compétence
  modifierCompetence(
    id: number,
    competence: NouvelleCompetence
  ): Observable<Competence> {
    return this.avecCsrf(headers =>
      this.http.put<Competence>(
        `${this.apiUrl}/${id}`,
        competence,
        { headers }
      )
    );
  }

  // Supprimer une compétence
  supprimerCompetence(id: number): Observable<void> {
    return this.avecCsrf(headers =>
      this.http.delete<void>(
        `${this.apiUrl}/${id}`,
        { headers }
      )
    );
  }

  // Obtenir un nouveau jeton CSRF avant chaque modification
  private avecCsrf<T>(
    action: (headers: HttpHeaders) => Observable<T>
  ): Observable<T> {
    return this.http.get<CsrfResponse>(this.csrfUrl).pipe(
      switchMap(csrf => {
        const headers = new HttpHeaders({
          'X-XSRF-TOKEN': csrf.token
        });

        return action(headers);
      })
    );
  }
}
