class Contact {
    constructor(name, phone, image) {
        this.name = name;
        this.phone = phone;
        this.image = image || "imagenPredeterminada.jpg";
    }

    getInfo() {
        return `${this.name} - ${this.phone}`;
    }
}

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const imageInput = document.getElementById("image");
const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");
const contactList = document.getElementById("contactList");

let contacts = [];

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const image = imageInput.value.trim();

    let valid = true;

    if (name === "") {
        nameError.textContent = "El nombre es obligatorio.";
        valid = false;
    } else if(name.length > 50) {
        nameError.textContent = "El nombre es demasiado largo.";
        valid = false;
    } else {
        nameError.textContent = "";
    }

    const phonePattern = /^[0-9]+$/;
    const isPhoneRepeated = contacts.some(contact => contact.phone === phone);

    if (phone === "") {
        phoneError.textContent = "El teléfono es obligatorio.";
    } else if (!phonePattern.test(phone) || phone.length != 9) {
        phoneError.textContent = "El teléfono debe contener nueve números.";
        valid = false;
    } else if (isPhoneRepeated) {
        phoneError.textContent = "El teléfono ya está registrado en otro contacto.";
        valid = false;
    } else {
        phoneError.textContent = "";
    }

    if (valid) {
        addContact(new Contact(name, phone, image));
        contactForm.reset();
    }
});

function addContact(contact) {
    contacts.push(contact);

    const li = document.createElement("li");
    li.className = "contact-item";
    li.dataset.index = contacts.length - 1;

    const img = document.createElement("img");
    img.src = contact.image;
    img.className = "contact-image";
    img.onerror = () => {
        img.src = "imagenPredeterminada.jpg";
    };
    li.appendChild(img);

    const contactInfo = document.createElement("span");
    contactInfo.textContent = contact.getInfo();
    li.appendChild(contactInfo);

    const upBtn = document.createElement("button");
    const prevLi = li.previousElementSibling;
    upBtn.textContent = "↑";
    upBtn.className = "move-btn up-btn";
    upBtn.onclick = () => moveContactUp(li);
    li.appendChild(upBtn);

    const downBtn = document.createElement("button");
    const nextLi = li.nextElementSibling;
    downBtn.textContent = "↓";
    downBtn.className = "move-btn down-btn";
    downBtn.onclick = () => moveContactDown(li);
    li.appendChild(downBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.onclick = () => deleteContact(contact, li);

    li.appendChild(deleteBtn);
    contactList.appendChild(li);

    updateButtons();
}

function deleteContact(contact, li) {
    contacts = contacts.filter(c => c !== contact);
    contactList.removeChild(li);
}

function moveContactUp(li) {
    const prevLi = li.previousElementSibling;
    if (prevLi) {
        contactList.insertBefore(li, prevLi);

        const currentIndex = parseInt(li.dataset.index);
        const prevIndex = parseInt(prevLi.dataset.index);
        swapContacts(currentIndex, prevIndex);

        updateButtons();
    }
}

function moveContactDown(li) {
    const nextLi = li.nextElementSibling;
    if (nextLi) {
        contactList.insertBefore(nextLi, li);

        const currentIndex = parseInt(li.dataset.index);
        const nextIndex = parseInt(nextLi.dataset.index);
        swapContacts(currentIndex, nextIndex);

        updateButtons();
    }
}

function swapContacts(index1, index2) {
    [contacts[index1], contacts[index2]] = [contacts[index2], contacts[index1]];

    Array.from(contactList.children).forEach((child, index) => {
        child.dataset.index = index;
    });
}

function updateButtons() {
    const items = Array.from(contactList.children);
    items.forEach((item, index) => {
        const upButton = item.querySelector(".up-btn");
        const downButton = item.querySelector(".down-btn");

        if (index === 0) {
            upButton.disabled = true;
        } else {
            upButton.disabled = false;
        }

        if (index === items.length - 1) {
            downButton.disabled = true;
        } else {
            downButton.disabled = false;
        }
    });
}