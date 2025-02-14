// Seleccionamos los elementos del formulario y los inputs
const form = document.getElementById("survey-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const numberInput = document.getElementById("number");
const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');

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
  const formGroup = input.closest(".form-group"); // Encontramos el contenedor del campo
  let error = formGroup.querySelector(".error-message"); // Buscamos un mensaje de error existente

  // Si no existe el mensaje de error, lo creamos
  if (!error) {
    error = document.createElement("small");
    error.className = "error-message";
    error.style.color = "red";
    formGroup.appendChild(error); // Añadimos el mensaje de error al contenedor
  }

  error.textContent = message; // Asignamos el mensaje de error
  input.style.borderColor = "red"; // Cambiamos el borde del campo a rojo
}

// Función para limpiar el mensaje de error y restaurar el borde del campo
function clearError(input) {
  const formGroup = input.closest(".form-group");
  const error = formGroup.querySelector(".error-message");
  if (error) {
    error.remove(); // Eliminamos el mensaje de error
  }

  input.style.borderColor = ""; // Restauramos el borde original
}

// Escuchamos el evento 'blur' (cuando el campo pierde el foco) para validar los campos
form.addEventListener(
  "blur",
  function (event) {
    const input = event.target;
    if (
      input.tagName === "INPUT" ||
      input.tagName === "TEXTAREA" ||
      input.tagName === "SELECT"
    ) {
      validateField(input); // Validamos el campo cuando pierde el foco
    }
  },
  true
);

// Función que valida un campo específico según su id
function validateField(input) {
  if (input.id === "name") {
    const nameValue = input.value.trim();
    if (nameValue === "") {
      showError(input, "Name is required");
    } else if (nameValue.length < 3) {
      showError(input, "Name must be at least 3 characters");
    } else if (!validateName(nameValue)) {
      showError(input, "Name cannot contain numbers");
    } else if (/\s{2,}/.test(input.value)) {
      showError(input, "Name cannot have multiple consecutive spaces");
    } else {
      clearError(input); // Si todo es correcto, limpiamos el error
    }
  } else if (input.id === "email") {
    if (!validateEmail(input.value)) {
      showError(input, "Enter a valid email address (example@exmp.com)");
    } else if (/\s{1,}/.test(input.value)) {
      showError(input, "Email cannot have spaces");
    } else {
      clearError(input); // Si todo es correcto, limpiamos el error
    }
  } else if (input.id === "number") {
    const trimmedvalue = input.value.trim();
    const age = Number(trimmedvalue);
    if (trimmedvalue === "") {
      showError(input, "Age is required");
    } else if (isNaN(age) || age < 18 || age > 99) {
      showError(input, "Age must be between 18 and 99");
    } else {
      clearError(input); // Si todo es correcto, limpiamos el error
    }
  }
}

// Definimos los inputs y la lista de usuarios
const inputs = [nameInput, emailInput, numberInput];
let users = [];

// Cuando la página se carga, obtenemos los usuarios almacenados en localStorage
window.addEventListener("load", function () {
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    users = JSON.parse(storedUsers); // Parseamos los usuarios guardados en localStorage
  }
});

checkboxInputs.forEach((checkbox) => {
  const isChecked = localStorage.getItem("checkbox.id") === "true";
  checkbox.checked = isChecked;
});

// Variables para el popup
const submitButton = document.getElementById("submitButton");
const succesMessage = document.getElementById("successMessage");
const closePopupButton = document.getElementById("closePopupButton");
const popupText = document.getElementById("popupText");

// Función para capitalizar la primera letra del nombre
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

submitButton.addEventListener("click", function (e) {
    e.preventDefault();
  
    inputs.forEach((input) => {
      validateField(input);
    });
  
    const selectedServices = Array.from(checkboxInputs)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  
    const referralInput = document.querySelector('input[name="referral"]:checked');
    
    if (!referralInput) {
      showError(referralInput, 'Please select a referral source');
      return;
    }
    const selectedReferral = referralInput.value;
  
    // Validar campos requeridos
    const isValidName = validateName(nameInput.value.trim());
    const isValidEmail = validateEmail(emailInput.value.trim());
    const ageValue = numberInput.value.trim();
    const isValidAge = ageValue !== "" && !isNaN(ageValue) && ageValue >= 18 && ageValue <= 99;
  
    if (!isValidName || !isValidEmail || !isValidAge) return;
  
    // Simular petición fetch
    new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve() : reject(); // 50% de éxito
      }, 1000);
    })
    .then(() => {
      popupText.textContent = "✅ Pedido procesado con éxito!";
    })
    .catch(() => {
      popupText.textContent = "⚠️ Error simulado - Guardando localmente";
    })
    .finally(() => {
      // Guardar en localStorage siempre
      const cartItem = {
        user: capitalizeFirstLetter(nameInput.value.trim()),
        email: emailInput.value.trim(),
        age: ageValue,
        services: selectedServices,
        referral: selectedReferral,
        date: new Date().toLocaleString()
      };
      
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
  
      // Mostrar popup y limpiar formulario
      succesMessage.style.display = "block";
      submitButton.disabled = true;
  
      setTimeout(() => {
        form.reset();
        inputs.forEach(input => {
          clearError(input);
          input.style.borderColor = "";
        });
        succesMessage.style.display = "none";
        submitButton.disabled = false;
      }, 3000);
    });
  });
  
  // Función para cerrar el popup (se mantiene igual)
  function closePopup() {
    succesMessage.style.display = "none";
    submitButton.disabled = false;
  }
  
  closePopupButton.addEventListener("click", closePopup);
