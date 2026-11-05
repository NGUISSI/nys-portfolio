import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ProjetService, Projet } from '../../services/projet';
import { FormsModule } from '@angular/forms';
import { CompetenceService, Competence, NouvelleCompetence } from '../../services/competence';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  modeEdition = false;
  numeroProjetModifie: number | null = null;

    
  modifierProjet(projet: Projet): void {
    if (projet.id === undefined) {
      alert('Identifiant du projet introuvable.');
      return;
    }

    this.modeEdition = true;
    this.numeroProjetModifie = projet.id;
    this.formulaireOuvert = true;

    this.nouveauProjet = {
      titre: projet.titre,
      categorie: projet.categorie,
      description: projet.description,
      technologies: projet.technologies,
      details: projet.details,
      fonctionnalitesTexte: projet.fonctionnalites.join('\n'),
      github: projet.github
    };
  }



enregistrerModification(): void {
  if (this.numeroProjetModifie === null) {
    return;
  }

  const titre = this.nouveauProjet.titre.trim();
  const categorie = this.nouveauProjet.categorie.trim();
  const description = this.nouveauProjet.description.trim();
  const technologies = this.nouveauProjet.technologies.trim();

  if (!titre || !categorie || !description || !technologies) {
    alert('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  const projetModifie: Projet = {
    id: this.numeroProjetModifie,
    titre,
    categorie,
    description,
    technologies,
    numero: String(this.numeroProjetModifie).padStart(2, '0'),
    details: this.nouveauProjet.details.trim() || description,
    fonctionnalites: this.nouveauProjet.fonctionnalitesTexte
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean),
    github: this.nouveauProjet.github.trim()
  };

  this.projetService.modifierProjet(
    this.numeroProjetModifie,
    projetModifie
  ).subscribe({
    next: () => {
      alert('Le projet a été modifié avec succès.');
      this.chargerProjets();
      this.annulerFormulaire();
    },
    error: (erreur) => {
      console.error('Erreur lors de la modification du projet :', erreur);
      alert('Impossible de modifier le projet.');
    }
  });
}


  projets: Projet[] = [];
  competences: Competence[] = [];

  formulaireCompetenceOuvert = false;
  modeEditionCompetence = false;
  idCompetenceModifie: number | null = null;

  nouvelleCompetence = {
    nom: '',
    categorie: '',
    niveau: 'Débutant'
  };

  constructor(
  private projetService: ProjetService,
  private competenceService: CompetenceService,
  private authService: AuthService,
  private router: Router
) {}

  ngOnInit(): void {
    this.chargerProjets();
    this.chargerCompetences();
  }

  
chargerProjets(): void {
  this.projetService.obtenirProjets().subscribe({
    next: (projets) => {
      this.projets = projets;
    },
    error: (erreur) => {
      console.error(
        'Erreur lors du chargement des projets :',
        erreur
      );
      alert('Impossible de charger les projets depuis le serveur.');
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
      alert(
        'Impossible de charger les compétences depuis le serveur.'
      );
    }
  });
}


  
supprimerProjet(numero: string): void {
  const confirmation = confirm(
    'Voulez-vous vraiment supprimer ce projet ?'
  );

  if (!confirmation) {
    return;
  }

  const projet = this.projets.find(p => p.numero === numero);

  if (projet?.id === undefined) {
    alert('Identifiant du projet introuvable.');
    return;
  }

  this.projetService.supprimerProjet(projet.id).subscribe({
    next: () => {
      this.projets = this.projets.filter(p => p.id !== projet.id);
      alert('Le projet a été supprimé.');
    },
    error: (erreur) => {
      console.error('Erreur lors de la suppression du projet :', erreur);
      alert('Impossible de supprimer le projet.');
    }
  });
}


  
  formulaireOuvert = false;

  nouveauProjet = {
    titre: '',
    categorie: '',
    description: '',
    technologies: '',
    details: '',
    fonctionnalitesTexte: '',
    github: ''
  };

  ouvrirFormulaire(): void {
    this.formulaireOuvert = true;
  }

  annulerFormulaire(): void {

    this.modeEdition = false;
    this.numeroProjetModifie = null;

    this.formulaireOuvert = false;

    this.nouveauProjet = {
      titre: '',
      categorie: '',
      description: '',
      technologies: '',
      details: '',
      fonctionnalitesTexte: '',
      github: ''
    };
  }

  
ajouterProjet(): void {
  const titre = this.nouveauProjet.titre.trim();
  const categorie = this.nouveauProjet.categorie.trim();
  const description = this.nouveauProjet.description.trim();
  const technologies = this.nouveauProjet.technologies.trim();
  const details = this.nouveauProjet.details.trim();

  if (!titre || !categorie || !description || !technologies) {
    alert('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  const projet: Projet = {
    titre,
    categorie,
    description,
    technologies,
    numero: '',
    details: details || description,
    fonctionnalites: this.nouveauProjet.fonctionnalitesTexte
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean),
    github: this.nouveauProjet.github.trim()
  };

  this.projetService.ajouterProjet(projet).subscribe({
    next: () => {
      alert('Le projet a été ajouté avec succès.');
      this.chargerProjets();
      this.annulerFormulaire();
    },
    error: (erreur) => {
      console.error('Erreur lors de l’ajout du projet :', erreur);
      alert('Impossible d’ajouter le projet.');
    }
  });
}


  
ouvrirFormulaireCompetence(): void {
  this.formulaireCompetenceOuvert = true;
  this.modeEditionCompetence = false;
  this.idCompetenceModifie = null;

  this.nouvelleCompetence = {
    nom: '',
    categorie: '',
    niveau: 'Débutant'
  };
}

modifierCompetence(competence: Competence): void {
  this.modeEditionCompetence = true;
  this.idCompetenceModifie = competence.id;
  this.formulaireCompetenceOuvert = true;

  this.nouvelleCompetence = {
    nom: competence.nom,
    categorie: competence.categorie,
    niveau: competence.niveau
  };
}


enregistrerCompetence(): void {
  const nom = this.nouvelleCompetence.nom.trim();
  const categorie = this.nouvelleCompetence.categorie.trim();
  const niveau = this.nouvelleCompetence.niveau.trim();

  if (!nom || !categorie || !niveau) {
    alert('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  const competence: NouvelleCompetence = {
    nom,
    categorie,
    niveau
  };

  if (this.modeEditionCompetence) {
    if (this.idCompetenceModifie === null) {
      return;
    }

    this.competenceService.modifierCompetence(
      this.idCompetenceModifie,
      competence
    ).subscribe({
      next: () => {
        alert('La compétence a été modifiée avec succès.');
        this.chargerCompetences();
        this.annulerFormulaireCompetence();
      },
      error: (erreur) => {
        console.error('Erreur de modification :', erreur);
        alert('Impossible de modifier la compétence.');
      }
    });
  } else {
    this.competenceService.ajouterCompetence(
      competence
    ).subscribe({
      next: () => {
        alert('La compétence a été ajoutée avec succès.');
        this.chargerCompetences();
        this.annulerFormulaireCompetence();
      },
      error: (erreur) => {
        console.error('Erreur lors de l’ajout :', erreur);
        alert('Impossible d’ajouter la compétence.');
      }
    });
  }
}

supprimerCompetence(id: number): void {
  const confirmation = confirm(
    'Voulez-vous vraiment supprimer cette compétence ?'
  );

  if (!confirmation) {
    return;
  }

  this.competenceService.supprimerCompetence(id).subscribe({
    next: () => {
      this.competences = this.competences.filter(
        competence => competence.id !== id
      );
      alert('La compétence a été supprimée.');
    },
    error: (erreur) => {
      console.error('Erreur de suppression :', erreur);
      alert('Impossible de supprimer la compétence.');
    }
  });
}


annulerFormulaireCompetence(): void {
  this.formulaireCompetenceOuvert = false;
  this.modeEditionCompetence = false;
  this.idCompetenceModifie = null;

  this.nouvelleCompetence = {
    nom: '',
    categorie: '',
    niveau: 'Débutant'
  };
}

deconnecter(): void {
  this.authService.deconnecter().subscribe({
    next: () => {
      void this.router.navigate(['/login']);
    },
    error: (erreur) => {
      console.error('Erreur lors de la déconnexion :', erreur);
      alert(
        'La déconnexion a rencontré un problème. Réessaie.'
      );
    }
  });
}


}

