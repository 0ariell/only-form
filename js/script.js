// Seleccionamos los elementos del formulario y los inputs
const form = document.getElementById('survey-form')
const nameInput = document.getElementById('name')
const emailInput = document.getElementById('email')
const numberInput = document.getElementById('number')

// Función para validar el correo electrónico usando una expresión regular
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para un correo válido
    return regex.test(email); // Retorna true si el correo es válido
}

// Función para validar el nombre (solo letras y espacios)
function validateName(name) {
    const regex = /^[A-Za-z\s]+$/; // Asegura que solo se ingresen letras y espacios
    return regex.test(name); // Retorna true si el nombre es válido
}

// Función para mostrar un mensaje de error cuando el campo no cumple con las condiciones
function showError(input, message) {
    const formGroup = input.closest('.form-group'); // Encontramos el contenedor del campo
    let error = formGroup.querySelector('.error-message'); // Buscamos un mensaje de error existente

    // Si no existe el mensaje de error, lo creamos
    if (!error) {
        error = document.createElement('small');
        error.className = 'error-message';
        error.style.color = 'red';
        formGroup.appendChild(error); // Añadimos el mensaje de error al contenedor
    }

    error.textContent = message; // Asignamos el mensaje de error
    input.style.borderColor = 'red'; // Cambiamos el borde del campo a rojo
}

// Función para limpiar el mensaje de error y restaurar el borde del campo
function clearError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    if (error) {
        error.remove(); // Eliminamos el mensaje de error
    }

    input.style.borderColor = ''; // Restauramos el borde original
}

// Escuchamos el evento 'blur' (cuando el campo pierde el foco) para validar los campos
form.addEventListener('blur', function (event) {
    const input = event.target;
    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
        validateField(input); // Validamos el campo cuando pierde el foco
    }
}, true);

// Función que valida un campo específico según su id
function validateField(input) {
    if (input.id === 'name') {
        const nameValue = input.value.trim();
        if (nameValue === '') {
            showError(input, 'Name is required');
        } else if (nameValue.length < 3) {
            showError(input, 'Name must be at least 3 characters');
        } else if (!validateName(nameValue)) {
            showError(input, 'Name cannot contain numbers');
        } else if (/\s{2,}/.test(input.value)) {
            showError(input, 'Name cannot have multiple consecutive spaces');
        } else {
            clearError(input); // Si todo es correcto, limpiamos el error
        }
    } else if (input.id === 'email') {
        if (!validateEmail(input.value)) {
            showError(input, 'Enter a valid email address (example@exmp.com)');
        } else if (/\s{1,}/.test(input.value)) {
            showError(input, 'Email cannot have spaces');
        } else {
            clearError(input); // Si todo es correcto, limpiamos el error
        }
    } else if (input.id === 'number') {
        const trimmedvalue = input.value.trim();
        const age = Number(trimmedvalue);
        if (trimmedvalue === '') {
            showError(input, 'Age is required');
        } else if (isNaN(age) || age < 18 || age > 99) {
            showError(input, 'Age must be between 18 and 99');
        } else {
            clearError(input); // Si todo es correcto, limpiamos el error
        }
    }
}

// Definimos los inputs y la lista de usuarios
const inputs = [nameInput, emailInput, numberInput];
let users = [];

// Cuando la página se carga, obtenemos los usuarios almacenados en localStorage
window.addEventListener('load', function () {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers); // Parseamos los usuarios guardados en localStorage
    }
});

// Variables para el popup
const submitButton = document.getElementById('submitButton');
const succesMessage = document.getElementById('successMessage');
const closePopupButton = document.getElementById('closePopupButton');
const popupText = document.getElementById('popupText');

// Función para capitalizar la primera letra del nombre
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Evento al hacer clic en el botón de enviar
submitButton.addEventListener('click', function (e) {
    e.preventDefault(); // Prevenimos que el formulario se envíe

    inputs.forEach(input => {
        validateField(input)
})

    // Validamos los campos antes de proceder
    const isValidName = validateName(nameInput.value.trim());
    const isValidEmail = validateEmail(emailInput.value.trim());
    const isValidAge = !isNaN(numberInput.value.trim()) && numberInput.value.trim() !== '' && Number(numberInput.value.trim()) >= 18 && Number(numberInput.value.trim()) <= 99;

    if (!isValidName || !isValidEmail || !isValidAge) {
        return; // Si algún campo no es válido, no hacemos nada
    }

    // Si todo es válido, almacenamos los datos del usuario
    const userData = {
        name: capitalizeFirstLetter(nameInput.value.trim()),
        email: emailInput.value.trim(),
        age: numberInput.value.trim()
    };

    users.push(userData); // Añadimos el usuario al array de usuarios
    localStorage.setItem('users', JSON.stringify(users)); // Guardamos los usuarios en localStorage

    popupText.textContent = `Thank you for registering, ${userData.name}`; // Mensaje d e éxito
    succesMessage.style.display = 'block'; // Mostramos el popup de éxito

    // Limpiamos los campos del formulario
    nameInput.value = '';
    emailInput.value = '';
    numberInput.value = '';
    submitButton.disabled = true; // Deshabilitamos el botón de enviar para evitar enviar el formulario nuevamente
});

// Función para cerrar el popup
function closePopup() {
    closePopupButton.focus(); // Enfocamos el botón de cerrar
    succesMessage.style.display = 'none'; // Ocultamos el mensaje de éxito
    submitButton.disabled = false; // Habilitamos nuevamente el botón de enviar
}

// Evento al hacer clic en el botón de cerrar el popup
closePopupButton.addEventListener('click', closePopup);
