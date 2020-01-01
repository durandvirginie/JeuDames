"use strict";
import {Damier} from "./Damier.js";
import {Prise} from "./Action.js";
import {CASE_VIDE,DAME_BLANC, DAME_NOIR, PION_BLANC, PION_NOIR} from "./Constantes.js";

const PLUS_INFINI = Number.POSITIVE_INFINITY, MOINS_INFINI = Number.NEGATIVE_INFINITY;

export class Etat extends Damier {
    constructor(damier, heuristique) {
        super(damier);
        this.genereActionsPossibles();
        this.meilleuresActions = [];
        this.heuristique = heuristique;
    }

    annulerAction(a) {
        if (a instanceof Prise) {
            if (a.dame) {
                for (let i = 0; i < a.cases.length; i += 2) {
                    let pion = a.pionsAdverses[i / 2]
                    this.grille[a.cases[i].ligne][a.cases[i].colonne] = pion;
                    switch (pion) {
                        case PION_NOIR:
                            this.nombrePionsNoirs++;
                            break;
                        case PION_BLANC:
                            this.nombrePionsBlancs++;
                            break;
                        case DAME_NOIR:
                            this.nombreDamesNoirs++;
                            break;
                        case DAME_BLANC:
                            this.nombreDamesBlancs++;
                            break;
                    }
                }
            } else {
                let prec = a.caseDepart;
                for (let i = 0; i < a.cases.length; i++) {
                    let l = prec.ligne < a.cases[i].ligne ? prec.ligne + 1 : prec.ligne - 1,
                        c = prec.colonne < a.cases[i].colonne ? prec.colonne + 1 : prec.colonne - 1;
                    this.grille[l][c] = a.pionsAdverses[i];
                    switch (this.grille[l][c]) {
                        case PION_NOIR:
                            this.nombrePionsNoirs++;
                            break;
                        case PION_BLANC:
                            this.nombrePionsBlancs++;
                            break;
                        case DAME_NOIR:
                            this.nombreDamesNoirs++;
                            break;
                        case DAME_BLANC:
                            this.nombreDamesBlancs++;
                            break;
                    }
                    prec = a.cases[i];
                }
            }
        }
        this.grille[a.ligneDepart()][a.colonneDepart()] = this.grille[a.ligneArrivee()][a.colonneArrivee()];
        this.grille[a.ligneArrivee()][a.colonneArrivee()] = CASE_VIDE;
        this.tourBlanc = !this.tourBlanc;
    }

    realiserAction(a) {
        if (a instanceof Prise) {
            a.pionsAdverses = [];
            if (a.dame) {
                for (let i = 0; i < a.cases.length; i += 2) {
                    a.pionsAdverses.push(this.grille[a.cases[i].ligne][a.cases[i].colonne]);
                }
            } else {
                let prec = a.caseDepart;
                for (let i = 0; i < a.cases.length; i++) {
                    let l = prec.ligne < a.cases[i].ligne ? prec.ligne + 1 : prec.ligne - 1,
                        c = prec.colonne < a.cases[i].colonne ? prec.colonne + 1 : prec.colonne - 1;
                    a.pionsAdverses.push(this.grille[l][c]);
                    prec = a.cases[i];
                }
            }
        }
        super.realiserAction(a);
    }

    rechercheMeilleurCoup(profondeur) {
        this.valeur = MOINS_INFINI;
        let alpha = MOINS_INFINI, beta = PLUS_INFINI;
        for (let i = 0; i < this.actionsPossibles.length; i++) {
            let actionCourante = this.actionsPossibles[i];
            this.realiserAction(actionCourante);
            let valeurFils = this.minimumAlphaBeta(profondeur - 1, alpha, beta);
            this.annulerAction(actionCourante);
            if (valeurFils > this.valeur) {
                this.meilleuresActions = [];
                this.valeur = valeurFils;
            }
            if (valeurFils === this.valeur)
                this.meilleuresActions.push(actionCourante);
            if (alpha < this.valeur)
                alpha = this.valeur;
            console.log(this.valeur);
        }
        return this.meilleuresActions[Math.floor(Math.random() * this.meilleuresActions.length)];
    }

    minimumAlphaBeta(profondeur, alpha, beta) {
        let actionsCourantes = this.renvoitActionsPossibles();
        if (this.partieFinie(actionsCourantes)) {
            return this.heuristique.gagne(this, actionsCourantes) ? PLUS_INFINI : MOINS_INFINI;
        } else if (profondeur === 0)
            return this.heuristique.evalue(this);
        else {
            let valeur = PLUS_INFINI;
            for (let i = 0; i < actionsCourantes.length; i++) {
                let actionCourante = actionsCourantes[i];
                this.realiserAction(actionCourante);
                let valeurFils = this.maximumAlphaBeta(profondeur - 1, alpha, beta);
                this.annulerAction(actionCourante);
                if (valeurFils < valeur)
                    valeur = valeurFils;
                if (alpha >= valeur)
                    return valeur;
                if (beta > valeur)
                    beta = valeur;
            }
            return valeur;
        }
    }

    maximumAlphaBeta(profondeur, alpha, beta) {
        let actionsCourantes = this.renvoitActionsPossibles();
        if (this.partieFinie()) {
            return this.heuristique.gagne(this, actionsCourantes) ? PLUS_INFINI : MOINS_INFINI;
        } else if (profondeur === 0)
            return this.heuristique.evalue(this);
        else {
            let valeur = MOINS_INFINI;
            for (let i = 0; i < actionsCourantes.length; i++) {
                let actionCourante = actionsCourantes[i];
                this.realiserAction(actionCourante);
                let valeurFils = this.minimumAlphaBeta(profondeur - 1, alpha, beta);
                this.annulerAction(actionCourante);
                if (valeurFils > valeur)
                    valeur = valeurFils;
                if (beta <= valeur)
                    return valeur;
                if (alpha < valeur)
                    alpha = valeur;
            }
            return valeur;
        }
    }

}