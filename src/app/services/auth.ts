
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  tap
} from 'rxjs/operators';

export interface AuthResponse {
  message: string;
  email: string;
  role: string;
}

interface CsrfResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private connecte = false;
  private readonly apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  estConnecte(): boolean {
    return this.connecte;
  }

  verifierSession(): Observable<boolean> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/me`).pipe(
      map(() => {
        this.connecte = true;
        return true;
      }),
      catchError(() => {
        this.connecte = false;
        return of(false);
      })
    );
  }

  connecter(email: string, motDePasse: string): Observable<AuthResponse> {
    return this.http.get<CsrfResponse>(`${this.apiUrl}/csrf`).pipe(
      switchMap((csrf) => {
        const headers = new HttpHeaders({
          'X-XSRF-TOKEN': csrf.token
        });

        return this.http.post<AuthResponse>(
          `${this.apiUrl}/login`,
          {
            email: email.trim(),
            motDePasse
          },
          { headers }
        );
      }),
      tap(() => {
        this.connecte = true;
      }),
      catchError((erreur) => {
        this.connecte = false;
        return throwError(() => erreur);
      })
    );
  }

  deconnecter(): Observable<void> {
    return this.http.get<CsrfResponse>(`${this.apiUrl}/csrf`).pipe(
      switchMap((csrf) => {
        const headers = new HttpHeaders({
          'X-XSRF-TOKEN': csrf.token
        });

        return this.http.post<{ message: string }>(
          `${this.apiUrl}/logout`,
          {},
          { headers }
        );
      }),
      tap(() => {
        this.connecte = false;
      }),
      map(() => undefined),
      catchError((erreur) => {
        this.connecte = false;
        return throwError(() => erreur);
      })
    );
  }
}
