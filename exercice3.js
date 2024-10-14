// ==================== Exercice 3 TypScript ====================
const result = document.getElementById("result");
const formContact = document.getElementById("formContact");
let editIndex = null; // Pour mémoriser l'indice du contact en cours d'édition
/**
 * Initialiser les contacts dans localStorage si la liste est vide
 */
function iniContacts() {
    const contactList = getContactList();
    if (contactList.length === 0) {
        const defaultContacts = [
            { firstname: "Mario", lastname: "Mario", dateOfBirth: "1991-05-01", email: "mario@gmail.com", phone: "0660355312" },
            { firstname: "Luigi", lastname: "Mario", dateOfBirth: "1992-10-05", email: "luigi@yahoo.fr", phone: "0601101212" },
            { firstname: "Megaman", lastname: "Rockman", dateOfBirth: "1994-12-10", email: "megaman@laposte.net", phone: "0770123456" }
        ];
        setContactList(defaultContacts);
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
        result.innerHTML = '';
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
    attachEditEvent(); // Ajout de l'événement après la mise à jour du DOM
}
/**
 * Attacher les événements de clic sur les boutons d'édition
 */
function attachEditEvent() {
    const openmodal = document.querySelectorAll(".openmodal");
    openmodal.forEach((btn) => {
        btn.addEventListener("click", function () {
            editContact(this);
            body.classList.add("modal-active");
            document.getElementById("info-id").innerText = this.getAttribute("data-id");
        });
    });
}
formContact.addEventListener("submit", function (e) {
    e.preventDefault();
    const firstnameInput = formContact.querySelector('input[name="firstname"]');
    const lastnameInput = formContact.querySelector('input[name="lastname"]');
    const dateOfBirthInput = formContact.querySelector('input[name="dateOfBirth"]');
    const emailInput = formContact.querySelector('input[name="email"]');
    const phoneInput = formContact.querySelector('input[name="phone"]');
    const contact = {
        firstname: firstnameInput.value,
        lastname: lastnameInput.value,
        dateOfBirth: dateOfBirthInput.value,
        email: emailInput.value,
        phone: phoneInput.value
    };
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
// ----- Update -----
const formContact2 = document.getElementById('formContact2');
formContact2.addEventListener("submit", function (e) {
    e.preventDefault();
    const firstnameInput = formContact2.querySelector('input[name="firstname"]');
    const lastnameInput = formContact2.querySelector('input[name="lastname"]');
    const dateOfBirthInput = formContact2.querySelector('input[name="dateOfBirth"]');
    const emailInput = formContact2.querySelector('input[name="email"]');
    const phoneInput = formContact2.querySelector('input[name="phone"]');
    const contact = {
        firstname: firstnameInput.value,
        lastname: lastnameInput.value,
        dateOfBirth: dateOfBirthInput.value,
        email: emailInput.value,
        phone: phoneInput.value
    };
    const contactList = getContactList();
    if (editIndex !== null) {
        contactList[editIndex] = contact;
        editIndex = null;
    }
    setContactList(contactList);
    addContact();
    formContact2.reset();
    body.classList.remove("modal-active");
});
/**
 * Editer contact
 * @param index
 */
function editContact(button) {
    const index = Number(button.getAttribute('data-id'));
    const contactList = getContactList();
    const contact = contactList[index];
    if (contact) {
        const firstnameField = formContact2.querySelector('input[name="firstname"]');
        const lastnameField = formContact2.querySelector('input[name="lastname"]');
        const dateOfBirthField = formContact2.querySelector('input[name="dateOfBirth"]');
        const emailField = formContact2.querySelector('input[name="email"]');
        const phoneField = formContact2.querySelector('input[name="phone"]');
        firstnameField.value = contact.firstname;
        lastnameField.value = contact.lastname;
        dateOfBirthField.value = contact.dateOfBirth;
        emailField.value = contact.email;
        phoneField.value = contact.phone;
        editIndex = index; // Stocker l'index du contact en cours d'édition
    }
}
// ----- Delete -----
/**
 * Supprimer un contact
 */
function removeContact(index) {
    const contactList = getContactList();
    contactList.splice(index, 1);
    setContactList(contactList);
    addContact();
}
// ----- -----
iniContacts(); // Ajouter les contacts initiaux
addContact(); // Afficher la liste des contacts
// ----- Fermer modal -----
const body = document.querySelector("body");
const closemodal = document.querySelectorAll(".closemodal");
closemodal.forEach(function (el) {
    el.addEventListener("click", function () {
        body.classList.remove("modal-active");
    });
});
