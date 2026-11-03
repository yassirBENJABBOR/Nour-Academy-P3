import {eleves,groupes} from "./data.js";

const listeEleves = document.querySelector("#liste-eleves");
const compteur = document.querySelector("#compteur");

const lignes = eleves.map(function (eleve) {
    
    return creerLigne(eleve);
});
    listeEleves.append(...lignes);


compteur.textContent = `${eleves.length} élèves`;


function creerLigne(eleve) {

    const ligne = document.createElement("li");
    ligne.dataset.id = eleve.id;
    ligne.classList.add("rounded-2xl","border","border-line","bg-card","p-3");

    const conteneur = document.createElement("div");
    conteneur.classList.add("flex","flex-col","gap-3","lg:flex-row","lg:items-center");

    const boutonFiche = document.createElement("button");
    boutonFiche.type = "button";
    boutonFiche.classList.add("btn-fiche","flex","min-h-11","flex-1","items-center","gap-3","text-left");

    const avatar = document.createElement("span");
    avatar.classList.add("grid","size-10","shrink-0","place-items-center","rounded-full","bg-brand-soft","text-sm","font-semibold","text-brand");
    avatar.textContent = (
        eleve.prenom.charAt(0) + eleve.nom.charAt(0)
    ).toUpperCase();

    const informations = document.createElement("span");

    informations.classList.add("min-w-0", "flex-1");

    const nomEleve = document.createElement("span");
    nomEleve.classList.add("block", "truncate", "font-medium");
    nomEleve.textContent = `${eleve.prenom} ${eleve.nom}`;

    const absences = document.createElement("span");
    absences.classList.add("block", "text-sm", "text-muted");
    absences.textContent = eleve.absences === 1
        ? "1 absence"
        : `${eleve.absences} ${eleve.absences === 0 ? "absence" : "absences"}`;

    if (eleve.absences >= 3) {

        ligne.classList.add("alerte");

        avatar.classList.remove("bg-brand-soft", "text-brand");
        avatar.classList.add("bg-alert", "text-white");

        const badgeAlerte = document.createElement("span");

        badgeAlerte.classList.add("badge","ml-1","whitespace-nowrap","rounded-full","bg-alert","px-2","py-0.5","text-xs","font-medium","text-white");
        badgeAlerte.textContent = "Prévenir les parents";
        absences.append(badgeAlerte);
    }

    const moyenne = document.createElement("span");

    moyenne.classList.add("font-serif", "text-xl");

    moyenne.textContent = eleve.notes.length === 0
        ? "—"
        : `${calculerMoyenne(eleve.notes)} / 20`;


    informations.append(nomEleve, absences);

    boutonFiche.append(avatar, informations, moyenne);

    const actions = document.createElement("div");
    actions.classList.add("flex", "gap-2");

    const boutonAbsent = document.createElement("button");
    boutonAbsent.type = "button";
    boutonAbsent.textContent = "Absent";
    boutonAbsent.classList.add("btn-absent","h-11","rounded-full","border","border-line","px-3","sm:px-4","text-sm","font-medium","hover:bg-paper");

    const labelNote = document.createElement("label");
    labelNote.classList.add("flex-1");

    const texteCache = document.createElement("span");
    texteCache.classList.add("sr-only");
    texteCache.textContent = "Note sur 20";

    const inputNote = document.createElement("input");
    inputNote.type = "number";
    inputNote.min = "0";
    inputNote.max = "20";
    inputNote.step = "0.5";
    inputNote.placeholder = "Note";

    inputNote.classList.add("h-11","w-full","rounded-full","border","border-line","bg-paper","px-4","text-sm","lg:w-24");
    labelNote.append(texteCache, inputNote);

    const boutonNote = document.createElement("button");
    boutonNote.type = "button";
    boutonNote.textContent = "Ajouter la note";

    boutonNote.classList.add("btn-note","h-11","rounded-full","bg-ink","px-3","sm:px-4","text-sm","font-medium","text-white","hover:bg-brand");

    actions.append(boutonAbsent, labelNote, boutonNote);

    const message = document.createElement("p");

    message.classList.add("message","mt-2","text-xs","text-alert");

    message.textContent = "La note doit être un nombre entre 0 et 20.";
    message.hidden = true;

    conteneur.append(boutonFiche, actions);

    ligne.append(conteneur, message);

    return ligne;
}

function calculerMoyenne(notes) {

    if (notes.length === 0) {
        return "—";
    }

    const somme = notes.reduce(function(total, note) {
        return total + note;
    }, 0);

    return (somme / notes.length).toFixed(2);
}


const filtreGroupe = document.querySelector("#filtre-groupe");

groupes.forEach(function (groupe) {

    const option = document.createElement("option");
    option.value = groupe.id;
    option.textContent = groupe.nom;
    filtreGroupe.append(option);
});


filtreGroupe.addEventListener("change", function () {

    const groupeSelectionne = filtreGroupe.value;
    const elevesFiltres = eleves.filter(function (eleve) {

        return groupeSelectionne === "" ||
            String(eleve.groupeId) === groupeSelectionne;

    });
    listeEleves.replaceChildren();

    const lignes = elevesFiltres.map(function (eleve) {
        return creerLigne(eleve);
    });

    listeEleves.append(...lignes);

    compteur.textContent = `${elevesFiltres.length} élèves`;
});


const recherche = document.querySelector("#recherche");
const tri = document.querySelector("#tri");


function afficherEleves() {

    const groupeSelectionne = filtreGroupe.value;
    const motRecherche = recherche.value.toLowerCase();

    const elevesFiltres = eleves.filter(function (eleve) {

        return (groupeSelectionne === "" ||
            String(eleve.groupeId) === groupeSelectionne)
            &&
            (eleve.prenom + " " + eleve.nom).toLowerCase().includes(motRecherche);
        
    });
    listeEleves.replaceChildren();

    const lignes = elevesFiltres.map(function (eleve) {
        return creerLigne(eleve);
    });

    listeEleves.append(...lignes);

    compteur.textContent = `${elevesFiltres.length} élèves`;
   
        aucunResultat.hidden = elevesFiltres.length > 0;

}

filtreGroupe.addEventListener("change", afficherEleves);
recherche.addEventListener("input", afficherEleves);
tri.addEventListener("change", afficherEleves);
