
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Projet {
  id?: number;
  titre: string;
  categorie: string;
  description: string;
  technologies: string;
  numero: string;
  details: string;
  fonctionnalites: string[];
  github: string;
}

interface ProjetApi {
  id: number;
  titre: string;
  categorie: string;
  description: string;
  technologies: string;
  details: string;
  fonctionnalites: string | null;
  github: string | null;
}

interface CsrfResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private readonly apiUrl = '/api/admin/projets';
  private readonly csrfUrl = '/api/auth/csrf';

  constructor(private http: HttpClient) {}

  obtenirProjets(): Observable<Projet[]> {
    return this.http.get<ProjetApi[]>(this.apiUrl).pipe(
      map(projets =>
        projets.map(projet => this.convertirProjet(projet))
      )
    );
  }

  ajouterProjet(projet: Projet): Observable<Projet> {
    return this.avecCsrf(headers =>
      this.http.post<ProjetApi>(
        this.apiUrl,
        this.preparerProjet(projet),
        { headers }
      )
    ).pipe(
      map(projetEnregistre =>
        this.convertirProjet(projetEnregistre)
      )
    );
  }

  modifierProjet(
    id: number,
    projet: Projet
  ): Observable<Projet> {
    return this.avecCsrf(headers =>
      this.http.put<ProjetApi>(
        `${this.apiUrl}/${id}`,
        this.preparerProjet(projet),
        { headers }
      )
    ).pipe(
      map(projetModifie =>
        this.convertirProjet(projetModifie)
      )
    );
  }

  supprimerProjet(id: number): Observable<void> {
    return this.avecCsrf(headers =>
      this.http.delete<void>(
        `${this.apiUrl}/${id}`,
        { headers }
      )
    );
  }

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

  private convertirProjet(projet: ProjetApi): Projet {
    return {
      id: projet.id,
      numero: String(projet.id).padStart(2, '0'),
      titre: projet.titre,
      categorie: projet.categorie ?? '',
      description: projet.description ?? '',
      technologies: projet.technologies ?? '',
      details: projet.details ?? '',
      fonctionnalites: projet.fonctionnalites
        ? projet.fonctionnalites.split(';').filter(Boolean)
        : [],
      github: projet.github ?? ''
    };
  }

  private preparerProjet(
    projet: Projet
  ): Omit<ProjetApi, 'id'> {
    return {
      titre: projet.titre,
      categorie: projet.categorie,
      description: projet.description,
      technologies: projet.technologies,
      details: projet.details,
      fonctionnalites: projet.fonctionnalites.join(';'),
      github: projet.github || null
    };
  }
}
