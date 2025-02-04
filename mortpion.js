class Joueur {
    constructor(numero) {
        this.numero = numero;
        this.score = 0;
    }

    incrementerScore() {
        this.score++;
    }
}

class Case {
    constructor(ligne, colonne) {
        this.ligne = ligne;
        this.colonne = colonne;
        this.valeur = 0;
    }
}

class Plateau {
    constructor() {
        this.cases = [];
        for (let ligne = 0; ligne < 3; ligne++) {
            const ligneCases = [];
            for (let colonne = 0; colonne < 3; colonne++) {
                ligneCases.push(new Case(ligne, colonne));
            }
            this.cases.push(ligneCases);
        }
    }

    reset() {
        for (let ligne of this.cases) {
            for (let uneCase of ligne) {
                uneCase.valeur = 0;
            }
        }
    }

    jouerCase(indice, joueur) {
        const ligne = Math.floor(indice / 3);
        const colonne = indice % 3;
        if (this.cases[ligne][colonne].valeur === 0) {
            this.cases[ligne][colonne].valeur = joueur.numero;
            return true;
        }
        return false;
    }

    verifierVictoire() {
        const c = this.cases;
        const lignes = [
            [c[0][0].valeur, c[0][1].valeur, c[0][2].valeur],
            [c[1][0].valeur, c[1][1].valeur, c[1][2].valeur],
            [c[2][0].valeur, c[2][1].valeur, c[2][2].valeur],
            [c[0][0].valeur, c[1][0].valeur, c[2][0].valeur],
            [c[0][1].valeur, c[1][1].valeur, c[2][1].valeur],
            [c[0][2].valeur, c[1][2].valeur, c[2][2].valeur],
            [c[0][0].valeur, c[1][1].valeur, c[2][2].valeur],
            [c[0][2].valeur, c[1][1].valeur, c[2][0].valeur],
        ];

        for (let ligneTab of lignes) {
            if (ligneTab[0] > 0 && ligneTab[0] === ligneTab[1] && ligneTab[1] === ligneTab[2]) {
                return true;
            }
        }

        if (c.flat().every((uneCase) => uneCase.valeur !== 0)) {
            return null;
        }

        return false;
    }
}

class Game {
    constructor() {
        this.joueur1 = new Joueur(1);
        this.joueur2 = new Joueur(2);
        this.plateau = new Plateau();

        // par défaut, le joueur 1 commence
        this.joueurEnCours = this.joueur1;

        this.drawCount = 0;

        this.plateauCellules = [...document.getElementsByClassName("case")];

        this.joueur_affichage = document.getElementById("joueur");
        this.joueur1Score_affichage = document.getElementById("score1");
        this.joueur2Score_affichage = document.getElementById("score2");
        this.drawScore_affichage = document.getElementById("scoreNul");

        this.plateauCellules.forEach((cellule, indice) => {
            cellule.addEventListener("click", () => this.handleCellClick(indice, cellule));
        });
    }

    reinitGame() {
        this.plateau.reset();
        this.plateauCellules.forEach(cellule => cellule.textContent = "");
        this.joueurEnCours = this.joueur1;
        this.joueur_affichage.textContent = "1";
    }

    miseAJourCellule(elementCase) {
        elementCase.textContent = this.joueurEnCours.numero === 1 ? "X" : "0";
    }

    declarationVictoire() {
        alert("Le joueur " + this.joueurEnCours.numero + " remporte la partie.");
        this.joueurEnCours.incrementerScore();
        this.rafraichirScores();
        this.reinitGame();
    }

    declarationNul() {
        alert("Match nul.");
        this.drawCount++;
        this.drawScore_affichage.textContent = this.drawCount;
        this.reinitGame();
    }

    switchTurn() {
        this.joueurEnCours = this.joueurEnCours === this.joueur1 ? this.joueur2 : this.joueur1;
        this.joueur_affichage.textContent = this.joueurEnCours.numero;
    }

    processGameResult(resultat) {
        if (resultat === true) {
            this.declarationVictoire();
        } else if (resultat === null) {
            this.declarationNul();
        } else {
            this.switchTurn();
        }
    }

    handleCellClick(indice, elementCase) {
        if (this.plateau.jouerCase(indice, this.joueurEnCours)) {
            this.miseAJourCellule(elementCase);
            const resultat = this.plateau.verifierVictoire();
            this.processGameResult(resultat);
        }
    }

    rafraichirScores() {
        this.joueur1Score_affichage.textContent = this.joueur1.score;
        this.joueur2Score_affichage.textContent = this.joueur2.score;
    }
}

// Initialisation et lancement du jeu Mortpion
const game = new Game();