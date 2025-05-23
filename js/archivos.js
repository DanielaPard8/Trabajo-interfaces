// --- FUNCIONES AUXILIARES (Si son exclusivas de este archivo, no necesitan export) ---

function mostrarSelector(elemento) {
    const contenedor = elemento.closest(".dias-selector");
    const selector = contenedor.querySelector(".dias-checkboxes");
    selector.style.display = "block";
    elemento.style.display = "none";
}

function guardarDias(boton) {
    const contenedor = boton.closest(".dias-selector");
    const checkboxes = contenedor.querySelectorAll("input[type=checkbox]:checked");
    const dias = Array.from(checkboxes).map(cb => cb.value);

    contenedor.querySelector(".dias").innerText = dias.length ? dias.join(" - ") : "Elegir días";
    contenedor.querySelector(".dias").style.display = "inline";
    contenedor.querySelector(".dias-checkboxes").style.display = "none";

    /*Guardar en localStorage*/
    const fila = boton.closest("tr");
    const nombreMateria = fila.children[1].innerText.trim();
    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    const materia = materias.find(m => m.nombre === nombreMateria);
    if (materia) {
        materia.dias = dias;
        localStorage.setItem("materias", JSON.stringify(materias));
    }
    /* Re-dibujar la tabla después de guardar días */
    mostrarTodasLasMaterias();
}

<<<<<<< HEAD

/* DIBUJA LA TABLA */
document.addEventListener("DOMContentLoaded", function () {
    const selects = document.querySelectorAll(".estado-select");

    selects.forEach(select => {
        select.addEventListener("change", function () {
            const fila = this.closest("tr");
            const celdaMateria = fila.children[1];
            celdaMateria.classList.remove("materia-en-curso", "materia-completada");

            if (this.value === "en-curso") {
                celdaMateria.classList.add("materia-en-curso");
            } else if (this.value === "completada") {
                celdaMateria.classList.add("materia-completada");
            }
        });
    });
});

/* Reloj timepicker */
=======
>>>>>>> 68452f81a754ff92782c660643ac3ed0f92f1c00
function openTimePicker(button) {
    const timeInput = document.createElement('input');
    timeInput.type = 'text';
    timeInput.className = 'time-input';
<<<<<<< HEAD
=======

>>>>>>> 68452f81a754ff92782c660643ac3ed0f92f1c00
    button.parentNode.insertBefore(timeInput, button.nextSibling);

    flatpickr(timeInput, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
<<<<<<< HEAD
        onChange: function (selectedDates, dateStr) {
            const selectedTimeDisplay = button.previousElementSibling;
            selectedTimeDisplay.textContent = dateStr;
            timeInput.remove();
=======
        onChange: function(selectedDates, dateStr) {
            const selectedTimeDisplay = button.previousElementSibling;
            selectedTimeDisplay.textContent = dateStr;
            timeInput.remove();

            /*Guardar en localStorage el horario*/
            const fila = button.closest("tr");
            const nombreMateria = fila.children[1].innerText.trim();
            const materias = JSON.parse(localStorage.getItem("materias")) || [];
            const materia = materias.find(m => m.nombre === nombreMateria);
            if (materia) {
                materia.horario = dateStr;
                localStorage.setItem("materias", JSON.stringify(materias));
            }
>>>>>>> 68452f81a754ff92782c660643ac3ed0f92f1c00
        }
    });

    timeInput.focus();
}

function actualizarMateria(elemento, nombreMateria, campo) {
    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    const materia = materias.find(m => m.nombre === nombreMateria);
    if (!materia) return;

    if (campo === "profesor") {
        materia.profesor = elemento.value.trim();
    } else if (campo === "estado") {
        materia.estado = elemento.value;
        // Si el estado cambia, también puedes querer actualizar la clase de la celda de la materia
        const fila = elemento.closest("tr");
        const celdaMateria = fila.children[1];
        celdaMateria.classList.remove("materia-en-curso", "materia-completada");
        if (elemento.value === "en-curso") {
            celdaMateria.classList.add("materia-en-curso");
        } else if (elemento.value === "completada") {
            celdaMateria.classList.add("materia-completada");
        }
    }

    localStorage.setItem("materias", JSON.stringify(materias));
}


//* FUNCION EXPORTADA *//
export function mostrarTodasLasMaterias() {
    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    const tabla = document.getElementById("tablaMaterias");
    if (!tabla) {
        console.error("Error: No se encontró el elemento con ID 'tablaMaterias'. Asegúrate de que tu HTML tenga <table id='tablaMaterias'>.");
        return;
    }
    tabla.innerHTML = ""; /*Borra lo que había antes*/

    materias.forEach(m => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50";

        tr.innerHTML = `
            <td class="lineasTabla">${m.codigo || ""}</td>
            <td class="lineasTabla ${m.estado === 'en-curso' ? 'materia-en-curso' : ''} ${m.estado === 'completada' ? 'materia-completada' : ''}">${m.nombre}</td>
            <td class="lineasTabla">
                <div class="dias-selector">
                    <span class="dias">${m.dias.length ? m.dias.join(" - ") : "Elegir días"}</span>
                    <div class="dias-checkboxes" style="display: none;">
                        ${["LUN", "MAR", "MIE", "JUE", "VIE", "SAB"].map(dia =>
<<<<<<< HEAD
            `<label><input type="checkbox" value="${dia}" ${m.dias.includes(dia) ? "checked" : ""}> ${dia}</label>`).join("")}
                        <button onclick="guardarDias(this)">Guardar</button>
=======
                            `<label><input type="checkbox" value="${dia}" ${m.dias.includes(dia) ? "checked" : ""}> ${dia}</label>`).join("")}
                        <button class="btn-guardar-dias">Guardar</button>
>>>>>>> 68452f81a754ff92782c660643ac3ed0f92f1c00
                    </div>
                </div>
            </td>
            <td class="lineasTabla">
                <input type="text" class="input-profesor" value="${m.profesor}">
            </td>
            <td class="lineasTabla">
                <div class="flex items-center">
                    <span class="selected-time mr-2 text-gray-600">${m.horario}</span>
                    <button class="time-picker-btn bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">
                        <i class="fas fa-clock"></i>
                    </button>
                </div>
            </td>
<<<<<<< HEAD
           <td class="lineasTabla">
    <div class="archivo-uploader">
        <label class="archivo-label">
            <i class="fas fa-upload"></i> Subir
            <input type="file" class="archivo-input" onchange="manejarArchivo(this, '${m.nombre}')">
        </label>
        ${m.archivo ? `<div class="archivo-nombre">${m.archivo.nombre}</div>` : ''}
         </div>
        </td>
        <td class="lineasTabla">
         <select class="estado-select" onchange="actualizarMateria(this, '${m.nombre}', 'estado')">

=======
            <td class="lineasTabla">
                <select class="estado-select">
>>>>>>> 68452f81a754ff92782c660643ac3ed0f92f1c00
                    <option value="sin-hacer" ${m.estado === "sin-hacer" ? "selected" : ""}>Sin hacer</option>
                    <option value="en-curso" ${m.estado === "en-curso" ? "selected" : ""}>En curso</option>
                    <option value="completada" ${m.estado === "completada" ? "selected" : ""}>Completada</option>
                </select>
            </td>
        `;

        tabla.appendChild(tr);

        // --- ADJUNTAR EVENT LISTENERS DESPUÉS DE QUE EL TR ESTÁ EN EL DOM ---
        // Acciones para la fila recién creada (tr)
        const spanDias = tr.querySelector(".dias");
        if (spanDias) {
            spanDias.addEventListener("click", () => mostrarSelector(spanDias));
        }

        const btnGuardarDias = tr.querySelector(".btn-guardar-dias");
        if (btnGuardarDias) {
            btnGuardarDias.addEventListener("click", () => guardarDias(btnGuardarDias));
        }

        const inputProfesor = tr.querySelector(".input-profesor");
        if (inputProfesor) {
            inputProfesor.addEventListener("blur", () => actualizarMateria(inputProfesor, m.nombre, 'profesor'));
        }

        const btnTimePicker = tr.querySelector(".time-picker-btn");
        if (btnTimePicker) {
            btnTimePicker.addEventListener("click", () => openTimePicker(btnTimePicker));
        }

        const selectEstado = tr.querySelector(".estado-select");
        if (selectEstado) {
            selectEstado.addEventListener("change", () => actualizarMateria(selectEstado, m.nombre, 'estado'));
        }
    });
}

<<<<<<< HEAD
/*Agregar archivo*/
function manejarArchivo(input, nombreMateria) {
    const archivo = input.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = function (e) {
        const base64 = e.target.result;
        const materias = JSON.parse(localStorage.getItem("materias")) || [];
        const materia = materias.find(m => m.nombre === nombreMateria);
        if (materia) {
            materia.archivo = {
                nombre: archivo.name,
                contenido: base64
            };
            localStorage.setItem("materias", JSON.stringify(materias));
            alert(`Archivo "${archivo.name}" guardado para la materia "${nombreMateria}"`);
        }
    };
    lector.readAsDataURL(archivo);
}


=======
// --- INICIALIZACIÓN (llamada a la función principal al cargar el DOM) ---
document.addEventListener("DOMContentLoaded", function() {
    
    mostrarTodasLasMaterias();


});
>>>>>>> 68452f81a754ff92782c660643ac3ed0f92f1c00


