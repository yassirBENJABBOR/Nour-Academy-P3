import {eleves,groupes} from "./data.js";

const listeEleves = document.querySelector("#liste-eleves");
const compteur = document.querySelector("#compteur");

const groupeInitial = groupes[0].id;

const elevesGroupe = eleves.filter(function (eleve) {
    return eleve.groupeId === groupeInitial;
});

console.log(elevesGroupe);
console.log(elevesGroupe.length);

function creerLigne(eleve) {

    const ligne = document.createElement("li");
    ligne.classList.add("rounded-2xl","border","border-line","bg-card","p-4");
    const nomEleve = document.createElement("p");
    nomEleve.textContent = `${eleve.prenom} ${eleve.nom}`;

    const absences = document.createElement("p");
    absences.textContent = `Absences : ${eleve.absences}`;

    const moyenne = document.createElement("p");
    moyenne.textContent = `${calculerMoyenne(eleve.notes)} / 20`;

    

    ligne.append(nomEleve, absences, moyenne);

    if (eleve.absences >= 3) {
    ligne.classList.add("alerte");
    const badgeAlerte = document.createElement("span");
    badgeAlerte.textContent = "Prévenir les parents";
    ligne.append(badgeAlerte);
    }
    return ligne;

}

const lignes=elevesGroupe.map(function(eleve){
    return creerLigne(eleve)
})
listeEleves.append(...lignes);

compteur.textContent = `${elevesGroupe.length} élèves`;

function calculerMoyenne(notes) {

    if (notes.length === 0) {
        return "—";
    }

    const somme = notes.reduce(function(total, note) {
        return total + note;
    }, 0);

    return (somme / notes.length).toFixed(2);
}