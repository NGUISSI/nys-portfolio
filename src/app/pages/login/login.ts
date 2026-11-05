
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  motDePasse = '';
  afficherMotDePasse = false;
  messageErreur = '';
  chargement = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  
  seConnecter(): void {
    this.messageErreur = '';

    if (!this.email.trim() || !this.motDePasse) {
      this.messageErreur =
        'Veuillez renseigner votre adresse e-mail et votre mot de passe.';
      return;
    }

    if (this.chargement) {
      return;
    }

    this.chargement = true;
    console.log('[LOGIN] Méthode appelée');

    this.authService.connecter(this.email, this.motDePasse).subscribe({
      next: (reponse) => {
        console.log('[LOGIN] Réponse du serveur :', reponse);
        this.motDePasse = '';
        void this.router.navigate(['/admin']);
      },
      error: (erreur) => {
        console.error('[LOGIN] Erreur HTTP :', erreur);

        this.messageErreur =
          `Erreur HTTP ${erreur.status || 0} : ${
            erreur.error?.message || erreur.message || 'Erreur inconnue'
          }`;

        this.chargement = false;
      },
      complete: () => {
        this.chargement = false;
      }
    });
  }

}
