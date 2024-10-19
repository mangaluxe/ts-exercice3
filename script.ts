// Pour compiler tous les fichiers .ts en .js, placez dans le répertoire où il y a le html qui appelle le js, puis tapez ligne de code : tsc -w

interface Contact {
    firstname: string;
    lastname: string;
    dateOfBirth: string;
    email: string;
    phone: string;
}


const result = document.getElementById("result") as HTMLElement;
const formAddContact = document.getElementById("form-add-contact") as HTMLFormElement;
let editIndex: number | null = null; // Pour mémoriser l'indice du contact en cours d'édition


/**
 * Initialiser une liste de contacts dans localStorage (si la liste est vide) (facultatif)
 */
function iniContacts(): void {
    const contactList = getContactList(); // Récupérer éventuellement la liste existante
    if (contactList.length === 0) { // Si la liste est vide, on ajoute quelques contacts par défaut
        const initialList: Contact[] = [
            { firstname: "Mario", lastname: "Mario", dateOfBirth: "1991-05-01", email: "mario@gmail.com", phone: "0660355312" },
            { firstname: "Luigi", lastname: "Mario", dateOfBirth: "1992-10-05", email: "luigi@yahoo.fr", phone: "0601101212" },
            { firstname: "Megaman", lastname: "Rockman", dateOfBirth: "1994-12-10", email: "megaman@laposte.net", phone: "0770123456" }
        ];

        setContactList(initialList); // Sauvegarde dans localStorage
    }
}


// ----- Read -----

/**
 * Récupérer la liste des contacts depuis localStorage
 */
function getContactList(): Contact[] {
    const storedContacts = localStorage.getItem('contactList');
    return storedContacts ? JSON.parse(storedContacts) : []; // Si storedContacts existe, on le parse en objet JavaScript. Sinon, on retourne un tableau vide
}


/**
 * Afficher la liste de contacts
 */
function showContact(): void {
    const contactList = getContactList();
    if (result) {
        result.innerHTML = ''; // Efface l'ancienne liste sinon dédouble
    }

    for (let i = 0; i < contactList.length; i++) {
        const c = contactList[i];
        result.innerHTML += `
            <li>
                <div class="e">${c.firstname} ${c.lastname}</div>
                <div class="e">${new Date(c.dateOfBirth).toLocaleDateString()}</div>
                <div class="e">${c.email}</div>
                <div class="e">${c.phone}</div>
                <div class="e">
                    <button class="mini-btn btn-warning openmodal" data-id="${i}">Editer</button>
                </div>
                <div class="e">
                    <button class="mini-btn btn-danger" onclick="removeContact(${i})">Supprimer</button>
                </div>
            </li>`;
    }

    attachEditEvent(); // Ajout de l'événement après la mise à jour du DOM, sinon il n'y a pas les écouteurs d'évènement
}


/**
 * Attacher les événements de clic sur les boutons d'édition
 */
function attachEditEvent(): void {
    const openmodal = document.querySelectorAll(".openmodal");

    // --- Boucle for ---

    for (let i = 0; i < openmodal.length; i++) {
        openmodal[i].addEventListener("click", function (event) {
            event.stopPropagation(); // Empêche la propagation de l'événement pour éviter d'ouvrir la modal par erreur
            editContact(this as HTMLElement);

            body.classList.add("modal-active");

            document.getElementById("info-id")!.innerText = (this as HTMLElement).getAttribute("data-id")!;                
        });
    }

    // --- Boucle forEach ---

    // openmodal.forEach((element) => {
    //     element.addEventListener("click", function (e) {
    //         e.stopPropagation(); // Empêche la propagation de l'événement

    //         editContact(element as HTMLElement);

    //         body.classList.add("modal-active");

    //         document.getElementById("info-id")!.innerText = (element as HTMLElement).getAttribute("data-id")!; // L'opérateur de non-null assertion (!) indique que "info-id" et "data-id" ne sont pas null ou undefined
    //     });
    // });

    // --- ---
}


// ----- Create -----

/**
 * Sauvegarder la liste des contacts dans localStorage
 */
function setContactList(contactList: Contact[]): void {
    localStorage.setItem('contactList', JSON.stringify(contactList));
}

// Envoi de formulaire quand l'utilisateur ajoute :
if (formAddContact) {
    formAddContact.addEventListener("submit", function (e) {
        e.preventDefault();

        const firstnameInput = document.querySelector('input[name="firstname"]') as HTMLInputElement;
        const lastnameInput = document.querySelector('input[name="lastname"]') as HTMLInputElement;
        const dateOfBirthInput = document.querySelector('input[name="dateOfBirth"]') as HTMLInputElement;
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;

        // Validation de formulaire
        if (!firstnameInput.value || !lastnameInput.value || !dateOfBirthInput.value || !emailInput.value || !phoneInput.value) {
            console.error("Un ou plusieurs champs manquants.");
            return;
        }

        // --- ---

        // const firstname = firstnameInput.value;
        // const lastname = lastnameInput.value;
        // const dateOfBirth = dateOfBirthInput.value;
        // const email = emailInput.value;
        // const phone = phoneInput.value;

        // const contact = { firstname, lastname, dateOfBirth, email, phone };

        // --- 2e méthode, en créant un objet : ---

        const contact: Contact = {
            firstname: firstnameInput.value,
            lastname: lastnameInput.value,
            dateOfBirth: dateOfBirthInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        };

        // --- ---

        const contactList = getContactList();

        if (editIndex !== null) { // Update
            contactList[editIndex] = contact;
            editIndex = null;
        }
        else { // Nouveau contact
            contactList.push(contact);
        }

        setContactList(contactList);
        showContact();

        formAddContact.reset();
    });
}


// ----- Update -----

/**
 * Editer contact
 */
function editContact(button: HTMLElement): void {   
    const index = Number(button.getAttribute('data-id'));
    const contactList = getContactList();
    const contact = contactList[index];

    if (contact) {
        const firstnameField = formEditContact.querySelector('input[name="firstname"]') as HTMLInputElement;
        const lastnameField = formEditContact.querySelector('input[name="lastname"]') as HTMLInputElement;
        const dateOfBirthField = formEditContact.querySelector('input[name="dateOfBirth"]') as HTMLInputElement;
        const emailField = formEditContact.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneField = formEditContact.querySelector('input[name="phone"]') as HTMLInputElement;

        if (!firstnameField || !lastnameField || !dateOfBirthField || !emailField || !phoneField) { // Validation de formulaire
            return;
        }
        firstnameField.value = contact.firstname;
        lastnameField.value = contact.lastname;
        dateOfBirthField.value = contact.dateOfBirth;
        emailField.value = contact.email;
        phoneField.value = contact.phone;

        editIndex = index; // Stocker l'index du contact en cours d'édition
        if (!body.classList.contains("modal-active")) {
            body.classList.add("modal-active"); // Ouvrir la modale
        }
    }
}


const formEditContact = document.getElementById('form-edit-contact') as HTMLFormElement;
// Envoi de formulaire quand l'utilisateur édite :
formEditContact.addEventListener("submit", function (e) {
    e.preventDefault();
    const firstnameInput = formEditContact.querySelector('input[name="firstname"]') as HTMLInputElement;
    const lastnameInput = formEditContact.querySelector('input[name="lastname"]') as HTMLInputElement;
    const dateOfBirthInput = formEditContact.querySelector('input[name="dateOfBirth"]') as HTMLInputElement;
    const emailInput = formEditContact.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = formEditContact.querySelector('input[name="phone"]') as HTMLInputElement;

    if (!firstnameInput || !lastnameInput || !dateOfBirthInput || !emailInput || !phoneInput) { // Validation de formulaire
        return;
    }

    // --- 1er méthode, sans créer d'objet ---

    const firstname = firstnameInput.value;
    const lastname = lastnameInput.value;
    const dateOfBirth = dateOfBirthInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;

    const contact = { firstname, lastname, dateOfBirth, email, phone };
    
    // --- 2e méthode, en créant un objet : ---

    // const contact: Contact = {
    //     firstname: firstnameInput.value,
    //     lastname: lastnameInput.value,
    //     dateOfBirth: dateOfBirthInput.value,
    //     email: emailInput.value,
    //     phone: phoneInput.value
    // };

    // --- ---

    const contactList = getContactList();

    if (editIndex !== null) { // Update le contact
        contactList[editIndex] = contact;
        editIndex = null; // Reset l'index d'édition
    }
    else {
        return;
    }

    setContactList(contactList);
    showContact();

    formEditContact.reset();
    body.classList.remove("modal-active");
});


// ----- Delete -----

/**
 * Supprimer un contact
 */
function removeContact(index: number): void {
    const contactList = getContactList();
    contactList.splice(index, 1);
    setContactList(contactList);
    showContact();
}

// ----- -----

iniContacts(); // Ajouter les contacts initiaux
showContact(); // Afficher la liste des contacts


// ----- Fermer modal -----

const body = document.querySelector("body") as HTMLBodyElement;
const editFormOverlay = document.querySelector(".edit-form-overlay");
const closeEditModal = document.querySelector(".close-edit-modal");

if (editFormOverlay) {

    // ----- Au clic sur bouton fermer : -----
    closeEditModal.addEventListener("click", function () {
        body.classList.remove("modal-active");
    });


    // ----- Fermer en cliquant partout ailleurs : -----
    body.addEventListener("click", function (e) {
        if (e.target === editFormOverlay) {
            body.classList.remove("modal-active");
        }
    });

}