//Manejamos el navbar para que se oculte al bajar y se muestre al subir.
let lastScrollY = window.scrollY;
const brandNav = document.querySelector(".brand-nav");
brandNav.classList.remove("brand-nav-hidden");
window.addEventListener("scroll", () => {
    let currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
        brandNav.classList.add("brand-nav-hidden");
    } else {
        brandNav.classList.remove("brand-nav-hidden");
    }
    lastScrollY = currentScrollY;
});

// Detectamos el tipo de documento seleccionado y trabajamos en el.
const tipoDocumento = document.getElementById("tipoDocumento");
const numeroDocumentoInput = document.getElementById("numeroDocumento");
const numeroDocumentoVisible = document.querySelector(".form__field--doc");
const labelDoc = document.querySelector(".form__label--doc");

tipoDocumento.addEventListener("change", () => {
    const tipo = tipoDocumento.value;
    numeroDocumentoInput.value = "";
    numeroDocumentoInput.classList.remove("input-error");
    const errorDiv = document.getElementById("error-numeroDocumento");
    if (errorDiv) errorDiv.textContent = "";

    // Mostrar el campo según el tipo
    numeroDocumentoVisible.style.display = tipo ? "flex" : "none";
    switch (tipo) {
        case "dni":
            labelDoc.textContent = "Numero de DNI"
            break;
        case "lc":
        case "le":
            labelDoc.textContent = "Numero de libreta"
            break;
        case "pasaporte":
            labelDoc.textContent = "Pasaporte"
    }
});


//Validar que se introduzca una fecha de nacimiento valida.
const fechaNacimiento = document.getElementById("fecha");
const hoy = new Date();
const yyyy = String(hoy.getFullYear());
const mm = String(hoy.getMonth() + 1).padStart(2, '0');
const dd = String(hoy.getDate()).padStart(2, '0');
const fechaMaxima = `${yyyy}-${mm}-${dd}`;
fechaNacimiento.max = fechaMaxima;

//Se hace uso de la API Georef con el fin de que el usuario pueda ingresar su localidad.
const localidadInput = document.getElementById("localidad");
const datalist = document.getElementById("sugerencias-localidades");
const patternReset = /[áéíóúÁÉÍÓÚ]/g
localidadInput.addEventListener("input", () => {
    const valor = localidadInput.value.trim();
    //Si el usuario escribo mas de 3 palabras, se empieza a hacer la busqueda.
    if (valor.length >= 3) {
        //Se hace una solictud get.
        fetch(`https://apis.datos.gob.ar/georef/api/localidades?nombre=${valor}&provincia=Buenos Aires&max=10`)
            .then(res => res.json())
            .then(data => {
                //Borra sugerencias anteriores.
                datalist.innerHTML = "";
                //Filtra las localidades segun la categoria de "entidad" que es la mas comun cuando se selecciona una localidad.
                const localidades = data.localidades.filter(l => l.categoria === "Entidad");
                //Recorre las localidades encontradas
                localidades.forEach(loc => {
                    const option = document.createElement("option");
                    //El option creado tendra como valor el nombre de la localidad y el nombre de la provincia (ya que varia el nombre, por ej: "merlo, buenos aires", "caballito, ciudad autonoma de buenos aires").
                    option.value = (`${loc.nombre.replace(patternReset, (letra) => {
                        const reemplazos = {
                             'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u'
                        };
                        return reemplazos[letra] || letra;
                    })}, ${loc.provincia.nombre}`);
                    datalist.appendChild(option);
                });
            })
            //En caso de un error.
            .catch(error => {
                console.error("Error al obtener localidades: ", error);
                datalist.innerHTML = "";
                const option = document.createElement("option");
                option.value = "Error al cargar localidades";
                datalist.appendChild(option);
            });
    }
});


const form = document.getElementById("form");

// Interceptamos el formulario para validar los datos
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    let isValid = true;

    // Limpiamos errores previos si los hay
    const fields = document.querySelectorAll(".form__input, .form__select");
    fields.forEach(field => {
        field.addEventListener("input", () => {
            field.classList.remove("input-error");
            const errorDiv = document.getElementById(`error-${field.id}`);
            if (errorDiv) errorDiv.textContent = "";
        });
    });

    // Validación de datos
    const camposObligatorios = [
        "nombre", "apellido", "tipoDocumento", "numeroDocumento", "fecha", "telefono", "sexo",
        "identidadGenero", "situacionFamiliar", "hijos", "padre", "madre", "familiares", "calle",
        "numero", "localidad", "codigoPostal", "usuario", "email", "contraseña", "repetirContraseña"
    ];

    camposObligatorios.forEach(id => {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
            mostrarError(input, "Este campo es obligatorio.");
            isValid = false;
        }
        //Si es un email lo valida.
        if (input.id === "email") {
            if (validarEmail(input) === false) {
                isValid = false;
            }
        }
    });

    //Validar Numero de documento segun el tipo.
    if (!validarNumeroDocumento()) isValid = false;

    //Validar Numero de telefono.
    if (!validarNumeroTelefono()) isValid = false;


    const contraseñaInput = document.getElementById("contraseña");
    const repetirContraseñaInput = document.getElementById("repetirContraseña");
    const contraseña = contraseñaInput.value;
    const repetirContraseña = repetirContraseñaInput.value;

    const erroresContraseña = validarContraseñaFuerte(contraseña);
    if (erroresContraseña.length > 0) {
        mostrarError(contraseñaInput, erroresContraseña.map(e => `• ${e}`).join("<br>"));
        isValid = false;
    }

    if (contraseña && repetirContraseña && contraseña !== repetirContraseña) {
        mostrarError(repetirContraseñaInput, "Las contraseñas no coinciden.");
        isValid = false;
    }

    //Mostrar ventana modal que indica que el registro fue un exito.
    const modal = document.getElementById("modalConfirmacion");
    const cerrarModal = document.getElementById("cerrarModal");


    if (isValid) {
        const modalContent = document.querySelector(".modal__content");
        //Quitamos las clases actuales para volver a ejecutar la animacion solo si fue ejecutada anteriormente.
        modalContent.classList.remove("modal__content-animation-closed", "modal__content-animation-opened");
        //Recalcula los estilos aplicados a modalContent para que el navegador los vuelva a ejecutar para la animacion.
        void modalContent.offsetWidth;
        modalContent.classList.add("modal__content-animation-opened");
        modal.style.display = "flex";
    }

    //Cerrar el modal
    cerrarModal.addEventListener("click", () => {
        const modalContent = document.querySelector(".modal__content");
        modalContent.classList.remove("modal__content-animation-opened");
        modalContent.classList.add("modal__content-animation-closed");

        modalContent.addEventListener("animationend", function anonima() {
            modal.style.display = "none";
            modalContent.classList.remove("modal__content-animation-closed");
            modalContent.removeEventListener("animationend", anonima);
        });
        //Una vez cerrada la ventana modal redirige a la pagina indicada.
        //localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
        //window.location.href = "Inicio_usuario.html";
    });

        // Si todo está bien, se envia el formulario al servidor
        if (isValid) {
            //Recogemos los datos del formulario.
            const formData = new FormData(form);

            //Convertimos los datos del formulario en un objeto.
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            //Enviamos los datos al servidor.

            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject), //Enviamos los datos como JSON.
                });

                const result = await response.json();
                console.log("Respuesta del servidor:", result);

                //Manejamos la respuesta del servidor.
                //En caso de exito.
                if(response.ok) {
                    alert("Formulario enviado con exito.");
                } else {
                    alert("Error al enviar el formulario.");
                }
            } catch (error) {
                console.error("Errror al enviar el formulario: ", error);
                alert("Hubo un error en la conexión");
            } 
        }


});

// Funciones auxiliares
function mostrarError(input, mensaje) {
    input.classList.add("input-error");
    const errorDiv = document.getElementById(`error-${input.id}`);
    if (errorDiv) errorDiv.innerHTML = mensaje;
}

function validarContraseñaFuerte(contraseña) {
    const requisitos = [
        { regex: /.{8,}/, mensaje: "Debe tener al menos 8 caracteres." },
        { regex: /[A-Z]/, mensaje: "Debe contener al menos una letra mayúscula." },
        { regex: /[a-z]/, mensaje: "Debe contener al menos una letra minúscula." },
        { regex: /[0-9]/, mensaje: "Debe contener al menos un número." },
        { regex: /[^A-Za-z0-9]/, mensaje: "Debe contener al menos un símbolo especial." }
    ];

    return requisitos
        .filter(req => !req.regex.test(contraseña))
        .map(req => req.mensaje);
}

function validarEmail(emailInput) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        mostrarError(emailInput, "El email no es válido.");
        return false;
    }
}

function validarNumeroDocumento() {
    // Limpiar errores anteriores
    numeroDocumentoInput.classList.remove("input-error");
    const errorDiv = document.getElementById("error-numeroDocumento");
    if (errorDiv) errorDiv.textContent = "";
    const numeroDoc = numeroDocumentoInput.value.trim();
    const tipo = tipoDocumento.value;

    if (!numeroDoc) return; // No mostrar error si el campo está vacío

    switch (tipo) {
        case "dni":
            if (!/^\d{7,8}$/.test(numeroDoc)) {
                mostrarError(numeroDocumentoInput, "El DNI debe tener 7 u 8 dígitos.");
                return false;
            }
            break;
        case "le":
        case "lc":
            if (!/^\d{7}$/.test(numeroDoc)) {
                mostrarError(numeroDocumentoInput, "La libreta debe tener exactamente 7 dígitos.");
                return false;
            }

            break;
        case "pasaporte":
            if (!/^[A-Z]{1}\d{6,7}$/.test(numeroDoc)) {
                mostrarError(numeroDocumentoInput, "El pasaporte debe empezar con una letra seguida de 6 a 8 números.");
                return false;
            }
            break;
    }
    return true;
}

function validarNumeroTelefono() {
    const numTelefonoInput = document.getElementById("telefono");
    const telefono = numTelefonoInput.value.trim();
    if (!/^11\d{8}$/.test(telefono)) {
        mostrarError(numTelefonoInput, "El numero ingresado no es valido. ");
        return false;
    }
    return true;
}

