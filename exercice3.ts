// ==================== Exercice 3 TypScript ====================

// class Contact {
//     firstname: string;
//     lastname: string;
//     dateOfBirth: Date;
//     email: string;
//     phone: string;

//     constructor(firstname: string, lastname: string, dateOfBirth: string, email: string, phone: string) {
//         this.firstname = firstname;
//         this.lastname = lastname;
//         this.dateOfBirth = new Date(dateOfBirth);
//         this.email = email;
//         this.phone = phone;
//     }
// }


const result = document.getElementById("result") as HTMLElement;
const formContact = document.getElementById("formContact") as HTMLFormElement;

let editIndex: number | null = null; // Pour edit


type Contact = {
    firstname: string;
    lastname: string;
    dateOfBirth: string;
    email: string;
    phone: string;
};


/**
 * Initialiser les contacts dans localStorage si la liste est vide
 */
function iniContacts(): void {
    const contactList = getContactList(); // Récupérer la liste existante

    if (contactList.length === 0) { // Si la liste est vide, on ajoute les contacts par défaut
        const defaultContacts: Contact[] = [
            { firstname: "Mario", lastname: "Mario", dateOfBirth: "01/05/1991", email: "mario@gmail.com", phone: "0660355312" },
            { firstname: "Luigi", lastname: "Mario", dateOfBirth: "05/10/1992", email: "luigi@yahoo.fr", phone: "0601101212" },
            { firstname: "Megaman", lastname: "Rockman", dateOfBirth: "10/12/1994", email: "megamann@laposte.net", phone: "+(33)6 12 12 12 12" }
        ];
        contactList.push(...defaultContacts);
        setContactList(contactList); // Sauvegarde dans localStorage
    }
}

// ----- Read -----

/**
 * Récupérer la liste des contacts depuis localStorage
 */
function getContactList(): Contact[] {
    const storedContacts = localStorage.getItem('contactList');
    return storedContacts ? JSON.parse(storedContacts) : [];
}


// ----- Create -----

/**
 * Sauvegarder la liste des contacts dans localStorage
 */
function setContactList(contactList: Contact[]): void {
    localStorage.setItem('contactList', JSON.stringify(contactList));
}


/**
 * Ajouter un contact
 */
function addContact(): void {
    const contactList: Contact[] = getContactList();
    if (result) {
        result.innerHTML = ''; // Efface l'ancienne liste sinon dédouble
    }

    for (let i = 0; i < contactList.length; i++) {
        const c = contactList[i];
        result.innerHTML += `
            <tr>
                <td>${c.firstname}</td>
                <td>${c.lastname}</td>
                <td>${new Date(c.dateOfBirth).toDateString()}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td><button class="btn btn-warning">Editer</button></td>
                <td><button class="btn btn-danger" onclick="removeContact(${i})">Supprimer</button></td>
            </tr>`;
    }
}


if (formContact) {
    formContact.addEventListener("submit", function (e: Event) {
        e.preventDefault();

        const firstnameInput = document.querySelector('input[name="firstname"]') as HTMLInputElement;
        const lastnameInput = document.querySelector('input[name="lastname"]') as HTMLInputElement;
        const dateOfBirthInput = document.querySelector('input[name="dateOfBirth"]') as HTMLInputElement;
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;

        if (!firstnameInput || !lastnameInput || !dateOfBirthInput || !emailInput || !phoneInput) {
            console.error("Un ou plusieurs champs manquants.");
            return;
        }

        const firstname: string = firstnameInput.value;
        const lastname: string = lastnameInput.value;
        const dateOfBirth: string = dateOfBirthInput.value;
        const email: string = emailInput.value;
        const phone: string = phoneInput.value;

        if (!firstname || !lastname || !dateOfBirth || !email || !phone) {
            return;
        }

        const contact: Contact = { firstname, lastname, dateOfBirth, email, phone };
        const contactList: Contact[] = getContactList();


        if (editIndex !== null) { // Update
            contactList[editIndex] = contact;
            editIndex = null;
        }
        else { // Nouveau contact
            contactList.push(contact);
        }

        setContactList(contactList);

        addContact();
        formContact.reset();
    });
}


// ----- Update -----

/**
 * Editer contact
 * @param index 
 */
function editContact(index: number): void {
    const contactList: Contact[] = getContactList();
    const contact = contactList[index];

    if (contact) {
        (document.querySelector('input[name="firstname"]') as HTMLInputElement).value = contact.firstname;
        (document.querySelector('input[name="lastname"]') as HTMLInputElement).value = contact.lastname;
        (document.querySelector('input[name="dateOfBirth"]') as HTMLInputElement).value = contact.dateOfBirth;
        (document.querySelector('input[name="email"]') as HTMLInputElement).value = contact.email;
        (document.querySelector('input[name="phone"]') as HTMLInputElement).value = contact.phone;
        editIndex = index;
    }
}

// ----- Delete -----

/**
 * Supprimer un contact
 */
function removeContact(index: number): void {
    let contactList: Contact[] = getContactList();
    contactList.splice(index, 1);
    setContactList(contactList);
    addContact();
}


// ----- -----

iniContacts(); // Ajouter les contacts initiaux
addContact(); // Afficher la liste des contacts
