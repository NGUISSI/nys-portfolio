
import { Component, HostListener, OnInit } from '@angular/core';
import { ProjetService, Projet } from '../../services/projet';
import {
  CompetenceService,
  Competence
} from '../../services/competence';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-portfolio',
  styleUrl: './portfolio.css',
  templateUrl: './portfolio.html',
})
export class Portfolio implements OnInit {

  constructor(
    private projetService: ProjetService,
    private competenceService: CompetenceService
  ) {}

  menuOuvert = false;
  projetSelectionne: Projet | null = null;

  nom = 'NYS';
  titre = 'Développeur de solutions numériques';

  presentation =
    'Je conçois des applications web modernes et des solutions numériques adaptées aux besoins des entreprises.';

  competences: Competence[] = [];
  realisations: Projet[] = [];

  ngOnInit(): void {
    this.chargerProjets();
    this.chargerCompetences();
  }

  
chargerProjets(): void {
  this.projetService.obtenirProjets().subscribe({
    next: (projets) => {
      this.realisations = projets;
    },
    error: (erreur) => {
      console.error(
        'Erreur lors du chargement des projets :',
        erreur
      );
    }
  });
}



  chargerCompetences(): void {
    this.competenceService.obtenirCompetences().subscribe({
      next: (competences) => {
        this.competences = competences;
      },
      error: (erreur) => {
        console.error(
          'Erreur lors du chargement des compétences :',
          erreur
        );
      }
    });
  }

  voirProjet(projet: Projet): void {
    this.projetSelectionne = projet;
  }

  fermerProjet(): void {
    this.projetSelectionne = null;
  }

  @HostListener('document:keydown.escape')
  fermerAvecEchap(): void {
    if (this.projetSelectionne !== null) {
      this.fermerProjet();
    }
  }
}
