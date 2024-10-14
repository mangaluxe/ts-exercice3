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
const result = document.getElementById("result");
const formContact = document.getElementById("formContact");
let editIndex = null; // Pour edit
/**
 * Initialiser les contacts dans localStorage si la liste est vide
 */
function iniContacts() {
    const contactList = getContactList(); // Récupérer la liste existante
    if (contactList.length === 0) { // Si la liste est vide, on ajoute les contacts par défaut
        const defaultContacts = [
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
function getContactList() {
    const storedContacts = localStorage.getItem('contactList');
    return storedContacts ? JSON.parse(storedContacts) : [];
}
// ----- Create -----
/**
 * Sauvegarder la liste des contacts dans localStorage
 */
function setContactList(contactList) {
    localStorage.setItem('contactList', JSON.stringify(contactList));
}
/**
 * Ajouter un contact
 */
function addContact() {
    const contactList = getContactList();
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
    formContact.addEventListener("submit", function (e) {
        e.preventDefault();
        const firstnameInput = document.querySelector('input[name="firstname"]');
        const lastnameInput = document.querySelector('input[name="lastname"]');
        const dateOfBirthInput = document.querySelector('input[name="dateOfBirth"]');
        const emailInput = document.querySelector('input[name="email"]');
        const phoneInput = document.querySelector('input[name="phone"]');
        if (!firstnameInput || !lastnameInput || !dateOfBirthInput || !emailInput || !phoneInput) {
            console.error("Un ou plusieurs champs manquants.");
            return;
        }
        const firstname = firstnameInput.value;
        const lastname = lastnameInput.value;
        const dateOfBirth = dateOfBirthInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        if (!firstname || !lastname || !dateOfBirth || !email || !phone) {
            return;
        }
        const contact = { firstname, lastname, dateOfBirth, email, phone };
        const contactList = getContactList();
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
function editContact(index) {
    const contactList = getContactList();
    const contact = contactList[index];
    if (contact) {
        document.querySelector('input[name="firstname"]').value = contact.firstname;
        document.querySelector('input[name="lastname"]').value = contact.lastname;
        document.querySelector('input[name="dateOfBirth"]').value = contact.dateOfBirth;
        document.querySelector('input[name="email"]').value = contact.email;
        document.querySelector('input[name="phone"]').value = contact.phone;
        editIndex = index;
    }
}
// ----- Delete -----
/**
 * Supprimer un contact
 */
function removeContact(index) {
    let contactList = getContactList();
    contactList.splice(index, 1);
    setContactList(contactList);
    addContact();
}
// ----- -----
iniContacts(); // Ajouter les contacts initiaux
addContact(); // Afficher la liste des contacts
