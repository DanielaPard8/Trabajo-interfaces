     // Detectamos el tipo de documento seleccionado y trabajamos en el.
     const tipoDocumento = document.getElementById("tipoDocumento");
     const numeroDocumentoInput = document.getElementById("numeroDocumento");
     const numeroDocumentoVisible = document.querySelector(".form__field--doc");
     const numeroDoc = numeroDocumentoInput.value.trim();
     const labelDoc = document.querySelector(".form__label--doc");
     let isValid = true;
 
     tipoDocumento.addEventListener("change", () => {
        const tipo = tipoDocumento.value;
    
        numeroDocumentoInput.value = "";
        numeroDocumentoInput.classList.remove("input-error");
        const errorDiv = document.getElementById("error-numeroDocumento");
        if (errorDiv) errorDiv.textContent = "";
    
        // Mostrar el campo según el tipo
        numeroDocumentoVisible.style.display = tipo ? "flex" : "none";
        switch(tipo) {
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
    
    // Validar número de documento solo cuando el campo pierde el foco
    numeroDocumentoInput.addEventListener("blur", () => {
        const tipo = tipoDocumento.value;
        const numeroDoc = numeroDocumentoInput.value.trim();
    
        // Limpiar errores anteriores
        numeroDocumentoInput.classList.remove("input-error");
        const errorDiv = document.getElementById("error-numeroDocumento");
        if (errorDiv) errorDiv.textContent = "";
    
        if (!numeroDoc) return; // No mostrar error si el campo está vacío
    
        switch (tipo) {
            case "dni":
                if (!/^\d{7,8}$/.test(numeroDoc)) {
                    mostrarError(numeroDocumentoInput, "El DNI debe tener 7 u 8 dígitos.");
                }
                break;
            case "le":
            case "lc":
                if (!/^\d{7}$/.test(numeroDoc)) {
                    mostrarError(numeroDocumentoInput, "La libreta debe tener exactamente 7 dígitos.");
                }
                break;
            case "pasaporte":
                if (!/^[A-Z]{1}\d{6,7}$/.test(numeroDoc)) {
                    mostrarError(numeroDocumentoInput, "El pasaporte debe empezar con una letra seguida de 6 a 8 números.");
                }
                break;
        }
    });

    //Validar que se introduzca una fecha de nacimiento valida.
    const fechaNacimiento = document.getElementById("fecha");
    const hoy = new Date();
    const yyyy = String(hoy.getFullYear());
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const fechaMaxima = `${yyyy}-${mm}-${dd}`;
    fechaNacimiento.max = fechaMaxima
    
    
    const form = document.querySelector(".form");

    // Interceptamos el formulario para validar los datos
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Limpiamos errores previos si los hay
        const inputs = form.querySelectorAll("input");
        inputs.forEach(input => {
            input.classList.remove("input-error");
            const errorDiv = document.getElementById(`error-${input.id}`);
            if (errorDiv) errorDiv.textContent = "";
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
            if (input.id === "email") validarEmail(input);
        });

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

        // Si todo está bien, guarda y redirige al inicio
        if (isValid) {
            const usuario = {
                nombre: document.getElementById("nombre").value.trim(),
                apellido: document.getElementById("apellido").value.trim(),
                usuario: document.getElementById("usuario").value.trim(),
                email: document.getElementById("email").value.trim(),
                contraseña: contraseña // no guardar asi
            };

            localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
            window.location.href = "Inicio_usuario.html";
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
        }
    }

