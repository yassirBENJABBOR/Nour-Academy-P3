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

    inputNote.classList.add("input-note","h-11","w-full","rounded-full","border","border-line","bg-paper","px-4","text-sm","lg:w-24");
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

const aucunResultat = document.querySelector("#aucun-resultat");

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



listeEleves.addEventListener("click", function (event) {

    const boutonAbsent = event.target.closest(".btn-absent")
    
    if (boutonAbsent) {
        const ligne = boutonAbsent.closest("li");
        const id = ligne.dataset.id;
        const eleve = eleves.find(function (item) {
            return String(item.id) === id;
        });
        console.log(eleve);
        eleve.absences += 1;
        ligne.replaceWith(creerLigne(eleve));
    }

    const boutonNote = event.target.closest(".btn-note")
    if (boutonNote){
        const ligne = boutonNote.closest("li")
        const id =ligne.dataset.id
        const eleve= eleves.find(function(item){
            return String(item.id) === id;
        })


        const noteinput = ligne.querySelector(".input-note")
    const valeurNote = noteinput.value;
        const note = Number(valeurNote);
        if (valeurNote === "") {
            alert("Veuillez saisir une note");
        }else if (note < 0 || note > 20) {
            alert("La note doit être entre 0 et 20");
        }else {
            eleve.notes.push(note);
            ligne.replaceWith(creerLigne(eleve));
            console.log(eleve.notes);
            
        }

    }

});




const regexNom = /^[A-Za-zÀ-ÿ\s-]{2,}$/;
const prenomMsg = document.querySelector("#prenom-msg");
const prenomInput = document.querySelector("#prenom");

const prenomChamp = prenomInput.closest(".champ");

prenomInput.addEventListener("input", function () {
    if (prenomInput.value.trim() === "") {
        prenomMsg.textContent = "Veuillez remplir le prénom.";
        prenomMsg.classList.remove("hidden");

        prenomChamp.classList.add("erreur");
        prenomChamp.classList.remove("valide");

        prenomInput.classList.remove("border-ok");
        prenomInput.classList.add("border-alert");
    } else if (!regexNom.test(prenomInput.value)) {
        prenomMsg.textContent = "2 caractères minimum : lettres, espaces ou tirets.";
        prenomMsg.classList.remove("hidden");
        prenomChamp.classList.add("erreur");
        prenomChamp.classList.remove("valide");

        prenomInput.classList.remove("border-ok");
        prenomInput.classList.add("border-alert");
    } else {
        prenomMsg.textContent = "Prénom valide.";
        prenomMsg.classList.remove("hidden");
        prenomChamp.classList.add("valide");
        prenomChamp.classList.remove("erreur");

        prenomInput.classList.remove("border-alert");
        prenomInput.classList.add("border-ok");
    }
    
});

const nomInput = document.querySelector("#nom");
const nomMsg = document.querySelector("#nom-msg");
const nomChamp = nomInput.closest(".champ");
nomInput.addEventListener("input", function () {

    if (nomInput.value.trim() === "") {

        nomMsg.textContent = "Veuillez remplir le nom.";
        nomMsg.classList.remove("hidden");
        nomChamp.classList.add("erreur");
        nomChamp.classList.remove("valide");

        nomInput.classList.remove("border-ok");
        nomInput.classList.add("border-alert");
    } else if (!regexNom.test(nomInput.value)) {
        nomMsg.textContent = "2 caractères minimum : lettres, espaces ou tirets.";

        nomChamp.classList.add("erreur");
        nomChamp.classList.remove("valide");
        nomMsg.classList.remove("hidden");

        nomInput.classList.remove("border-ok");
        nomInput.classList.add("border-alert");
    } else {
        nomMsg.textContent = "Nom valide.";
        nomMsg.classList.remove("hidden");
        nomChamp.classList.add("valide");
        nomChamp.classList.remove("erreur");

        nomInput.classList.remove("border-alert");
        nomInput.classList.add("border-ok");
    }
});


const emailInput = document.querySelector("#email");
const emailMsg = document.querySelector("#email-msg");
const emailChamp = emailInput.closest(".champ");

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailInput.addEventListener("input", function () {
    if (emailInput.value.trim() === "") {
        emailMsg.textContent = "Veuillez remplir l'email.";
        emailChamp.classList.add("erreur");
        emailChamp.classList.remove("valide");
        emailMsg.classList.remove("hidden");


        emailInput.classList.remove("border-ok");
        emailInput.classList.add("border-alert");

    } else if (!regexEmail.test(emailInput.value)) {
        emailMsg.textContent = "Email invalide.";
        emailMsg.classList.remove("hidden");
        emailChamp.classList.add("erreur");
        emailChamp.classList.remove("valide");

        emailInput.classList.remove("border-ok");
        emailInput.classList.add("border-alert");

    } else {
        emailMsg.textContent = "Email valide.";
        emailChamp.classList.add("valide");
        emailChamp.classList.remove("erreur");
        emailMsg.classList.remove("hidden");

        emailInput.classList.remove("border-alert");
        emailInput.classList.add("border-ok");

    }
});


const telephoneInput = document.querySelector("#telephone");
const telephoneMsg = document.querySelector("#telephone-msg");
const telephoneChamp = telephoneInput.closest(".champ");

const regexTelephone = /^(06|07)[0-9]{8}$|^\+212[67][0-9]{8}$/;

telephoneInput.addEventListener("input", function () {
    if (telephoneInput.value.trim() === "") {
        telephoneMsg.textContent = "Veuillez remplir le téléphone.";
        telephoneMsg.classList.remove("hidden");
        telephoneChamp.classList.add("erreur");
        telephoneChamp.classList.remove("valide");

        telephoneInput.classList.remove("border-ok");
        telephoneInput.classList.add("border-alert");

    } else if (!regexTelephone.test(telephoneInput.value.trim())) {
        telephoneMsg.textContent = "Numéro marocain invalide.";

        telephoneChamp.classList.add("erreur");
        telephoneChamp.classList.remove("valide");
        telephoneMsg.classList.remove("hidden");
        telephoneInput.classList.remove("border-ok");
        telephoneInput.classList.add("border-alert");

    } else {
        telephoneMsg.textContent = "Téléphone valide.";

        telephoneChamp.classList.add("valide");
        telephoneChamp.classList.remove("erreur");
        telephoneMsg.classList.remove("hidden");
        telephoneInput.classList.remove("border-alert");
        telephoneInput.classList.add("border-ok");
    }
});

const codeInput = document.querySelector("#code");
const codeMsg = document.querySelector("#code-msg");
const codeChamp = codeInput.closest(".champ");
const codeForce = document.querySelector("#code-force");
const regexCode = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;


codeInput.addEventListener("input", function () {
    if (codeInput.value.trim() === "") {
        codeMsg.textContent = "Veuillez remplir le code.";

        codeChamp.classList.add("erreur");
        codeMsg.classList.remove("hidden");
        codeChamp.classList.remove("valide");
        codeInput.classList.remove("border-ok");
        codeInput.classList.add("border-alert");

    } else if (!regexCode.test(codeInput.value)) {
        codeMsg.textContent = "8 caractères min., 1 majuscule, 1 chiffre, 1 caractère spécial.";
        codeChamp.classList.add("erreur");
        codeChamp.classList.remove("valide");
        codeMsg.classList.remove("hidden");

        codeInput.classList.remove("border-ok");
        codeInput.classList.add("border-alert");

    } else {
        codeMsg.textContent = "Code valide.";
        codeMsg.classList.remove("hidden");

        codeChamp.classList.add("valide");
        codeChamp.classList.remove("erreur");
        codeInput.classList.remove("border-alert");
        codeInput.classList.add("border-ok");
    }
        
    let force = 0;

    if (codeInput.value.length >= 8) force++;
    if (/[A-Z]/.test(codeInput.value)) force++;
    if (/[0-9]/.test(codeInput.value)) force++;
    if (/[^A-Za-z0-9]/.test(codeInput.value)) force++;

    codeForce.value = force;
        
});


const toggleCode = document.querySelector("#toggle-code");

toggleCode.addEventListener("click", function () {

    if (codeInput.type === "password") {
        codeInput.type = "text";
        toggleCode.textContent = "🙈";
    } else {
        codeInput.type = "password";
        toggleCode.textContent = "👁️";
    }

});

const groupeInput = document.querySelector("#groupe");
const groupeMsg = document.querySelector("#groupe-msg");
const groupeChamp = groupeInput.closest(".champ");

groupes.forEach(function (groupe) {
    const option = document.createElement("option");

    option.value = groupe.id;
    option.textContent = groupe.nom;

    groupeInput.append(option);
});

groupeInput.addEventListener("change", function () {
    if (groupeInput.value === "") {
        groupeMsg.textContent = "Veuillez choisir un groupe.";
        groupeChamp.classList.add("erreur");
        groupeChamp.classList.remove("valide");
        groupeMsg.classList.remove("hidden");

        groupeInput.classList.add("border-alert");
        groupeInput.classList.remove("border-ok");
    } else {
        groupeMsg.textContent = "Groupe valide.";
        groupeChamp.classList.add("valide");
        groupeChamp.classList.remove("erreur");
        groupeInput.classList.add("border-ok");
        groupeInput.classList.remove("border-alert");
        groupeMsg.classList.remove("hidden");

    }
});

const formEleve = document.querySelector("#form-eleve");
const formSucces = document.querySelector("#form-succes");
const formErreur = document.querySelector("#form-erreur");

function formulaireValide() {
    const champsValides = [
        regexNom.test(prenomInput.value.trim()),
        regexNom.test(nomInput.value.trim()),
        groupeInput.value !== "",
        regexEmail.test(emailInput.value.trim()),
        regexTelephone.test(telephoneInput.value.trim()),
        regexCode.test(codeInput.value)
    ];

    return champsValides.every(function (valide) {
        return valide === true;
    });
}

formEleve.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!formulaireValide()) {
        if (!regexNom.test(prenomInput.value.trim())) {
            prenomInput.focus();
        prenomMsg.textContent = "Veuillez remplir le prénom.";
        prenomMsg.classList.remove("hidden");
    
        prenomChamp.classList.add("erreur");
        prenomChamp.classList.remove("valide");
        prenomInput.classList.remove("border-ok");
        prenomInput.classList.add("border-alert");


        } else if (!regexNom.test(nomInput.value.trim())) {
            nomInput.focus();
        nomMsg.textContent = "Veuillez remplir le nom.";
        nomMsg.classList.remove("hidden");
        nomChamp.classList.add("erreur");
        nomChamp.classList.remove("valide");

        nomInput.classList.remove("border-ok");
        nomInput.classList.add("border-alert");


        } else if (groupeInput.value === "") {
            groupeInput.focus();
            groupeMsg.textContent = "Veuillez choisir un groupe.";
        groupeChamp.classList.add("erreur");
        groupeChamp.classList.remove("valide");
        groupeMsg.classList.remove("hidden");

        groupeInput.classList.add("border-alert");
        groupeInput.classList.remove("border-ok");


        } else if (!regexEmail.test(emailInput.value.trim())) {
            emailInput.focus();
            emailMsg.textContent = "Veuillez remplir l'email.";
        emailChamp.classList.add("erreur");
        emailChamp.classList.remove("valide");
        emailMsg.classList.remove("hidden");


        emailInput.classList.remove("border-ok");
        emailInput.classList.add("border-alert");
        } else if (!regexTelephone.test(telephoneInput.value.trim())) {
            telephoneInput.focus();
            telephoneMsg.textContent = "Veuillez remplir le téléphone.";
        telephoneMsg.classList.remove("hidden");
        telephoneChamp.classList.add("erreur");
        telephoneChamp.classList.remove("valide");

        telephoneInput.classList.remove("border-ok");
        telephoneInput.classList.add("border-alert");

        } else if (!regexCode.test(codeInput.value)) {
            codeInput.focus();
            codeMsg.textContent = "Veuillez remplir le code.";

        codeChamp.classList.add("erreur");
        codeMsg.classList.remove("hidden");
        codeChamp.classList.remove("valide");
        codeInput.classList.remove("border-ok");
        codeInput.classList.add("border-alert");

        }

        return;
    }
    const doublon = eleves.some(function (eleve) {
        return (
            eleve.prenom.trim().toLowerCase() === prenomInput.value.trim().toLowerCase() &&
            eleve.nom.trim().toLowerCase() === nomInput.value.trim().toLowerCase() &&
            eleve.groupeId === Number(groupeInput.value)
        );
    });

    if (doublon) {
        formErreur.textContent = "Cet élève existe déjà dans ce groupe.";
        formErreur.hidden = false;
        formSucces.hidden = true;        return;
    }
    console.log("Tous les champs sont valides !");

    const nouvelEleve = {
        id: Date.now(),
        prenom: prenomInput.value.trim(),
        nom: nomInput.value.trim(),
        groupeId: Number(groupeInput.value),
        email: emailInput.value.trim(),
        telephone: telephoneInput.value.trim(),
        absences: 0,
        notes: []
    };

    eleves.push(nouvelEleve);

    formSucces.hidden = false;
    formErreur.hidden = true;   

    formEleve.reset();
    afficherEleves();

});