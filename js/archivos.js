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
}


/* DIBUJA LA TABLA */
document.addEventListener("DOMContentLoaded", function() {
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
function openTimePicker(button) {
    const timeInput = document.createElement('input');
    timeInput.type = 'text'; 
    timeInput.className = 'time-input'; 

    /
    button.parentNode.insertBefore(timeInput, button.nextSibling);


    flatpickr(timeInput, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        onChange: function(selectedDates, dateStr) {
            const selectedTimeDisplay = button.previousElementSibling; 
            selectedTimeDisplay.textContent = dateStr; 
            timeInput.remove(); 
        }
    });

    timeInput.focus(); 
}

window.onload = mostrarTodasLasMaterias;

/* Crea el html para que aparezca la materia */
function mostrarTodasLasMaterias() {
    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    const tabla = document.getElementById("tablaMaterias");
    tabla.innerHTML = ""; /*Borra lo que había antes*/

    materias.forEach(m => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50";

        tr.innerHTML = `
            <td class="lineasTabla">${m.codigo || ""}</td>
            <td class="lineasTabla">${m.nombre}</td>
            <td class="lineasTabla">
                <div class="dias-selector">
                    <span class="dias" onclick="mostrarSelector(this)">${m.dias.length ? m.dias.join(" - ") : "Elegir días"}</span>
                    <div class="dias-checkboxes" style="display: none;">
                        ${["LUN", "MAR", "MIE", "JUE", "VIE", "SAB"].map(dia =>
                            `<label><input type="checkbox" value="${dia}" ${m.dias.includes(dia) ? "checked" : ""}> ${dia}</label>`).join("")}
                        <button onclick="guardarDias(this)">Guardar</button>
                    </div>
                </div>
            </td>
            <td class="lineasTabla">
                <input type="text" class="input-profesor" value="${m.profesor}" onblur="actualizarMateria(this, '${m.nombre}', 'profesor')">
            </td>
            <td class="lineasTabla">
                <div class="flex items-center">
                    <span class="selected-time mr-2 text-gray-600">${m.horario}</span>
                    <button onclick="openTimePicker(this)" class="time-picker-btn bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">
                        <i class="fas fa-clock"></i>
                    </button>
                </div>
            </td>
            <td class="lineasTabla">
                <select class="estado-select" onchange="actualizarMateria(this, '${m.nombre}', 'estado')">
                    <option value="sin-hacer" ${m.estado === "sin-hacer" ? "selected" : ""}>Sin hacer</option>
                    <option value="en-curso" ${m.estado === "en-curso" ? "selected" : ""}>En curso</option>
                    <option value="completada" ${m.estado === "completada" ? "selected" : ""}>Completada</option>
                    
                </select>
            </td>
        `;

        tabla.appendChild(tr);
    });
}


