/*SELECCION DE DIAS*/
function mostrarSelector(elemento) {
    const contenedor = elemento.closest(".dias-selector");
    const selector = contenedor.querySelector(".dias-checkboxes");
    selector.style.display = "block";
    elemento.style.display = "none";
}
        
function guardarDias(boton) {
    const contenedor = boton.closest(".dias-selector");
    const checkboxes = contenedor.querySelectorAll("input[type=checkbox]:checked");
    const dias = Array.from(checkboxes).map(cb => cb.value).join(" - ");
        
    contenedor.querySelector(".dias").innerText = dias || "Elegir días";
    contenedor.querySelector(".dias").style.display = "inline";
    contenedor.querySelector(".dias-checkboxes").style.display = "none";
}

/*DIBUJA LA TABLA*/
document.addEventListener("DOMContentLoaded", function() {
const selects = document.querySelectorAll(".estado-select");

    selects.forEach(select => {
        select.addEventListener("change", function () {
            const fila = this.closest("tr");
            const celdaMateria = fila.children[1];
            celdaMateria.classList.remove("materia-en-curso", "materia-completada");
                
            if(this.value === "en-curso"){
                celdaMateria.classList.add("materia-en-curso");
            }else if(this.value === "completada"){
                celdaMateria.classList.add("materia-completada");
            }
                
        }
        );
    });
});
/*RELOJ*/
function openTimePicker(button) {
    
const timeInput = document.createElement('input');
timeInput.type = 'text'; 
timeInput.className = 'time-input'; 
    
// Insert
button.parentNode.insertBefore(timeInput, button.nextSibling);
    
// Inicializa
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
/*document.addEventListener("DOMContentLoaded", function () {
  const tabla = document.querySelector("#tablaMateriasArchivos tbody"); // asumimos que hay una tabla

  let materias = JSON.parse(localStorage.getItem("materias")) || [];

  materias.forEach(materia => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
          <td>${materia}</td>
          <td>
              <div class="dropdown">
                  <button class="dropbtn">Ver archivos</button>
                  <button class="dropbtn">Subir archivo</button>
                  <div class="dropdown-content"></div>
              </div>
          </td>
      `;
      tabla.appendChild(fila);
  });

  // Después de agregar las filas dinámicamente correr el archivo
  inicializarDropdowns(); 
});

function inicializarDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
      const materiaId = dropdown.closest("tr").querySelector("td").innerText;

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.style.display = "none";
      fileInput.multiple = true;
      dropdown.appendChild(fileInput);

      const botones = dropdown.querySelectorAll(".dropbtn");
      const verArchivosBtn = botones[0];
      const subirBtn = botones[1];
      const archivosContainer = dropdown.querySelector(".dropdown-content");

      verArchivosBtn.addEventListener("click", () => {
          if (archivosContainer.style.display === "block") {
              archivosContainer.style.display = "none";
          } else {
              mostrarArchivos(materiaId, archivosContainer);
              archivosContainer.style.display = "block";
          }
      });

      subirBtn.addEventListener("click", () => fileInput.click());

      fileInput.addEventListener("change", () => {
          const archivos = fileInput.files;
          if (archivos.length > 0) {
              let archivosGuardados = JSON.parse(localStorage.getItem(materiaId)) || [];
              for (let archivo of archivos) {
                  archivosGuardados.push(archivo.name);
              }
              localStorage.setItem(materiaId, JSON.stringify(archivosGuardados));
              mostrarArchivos(materiaId, archivosContainer);
              archivosContainer.style.display = "block";
              fileInput.value = "";
          }
      });
  });
}

function mostrarArchivos(materiaId, contenedor) {
  const archivosGuardados = JSON.parse(localStorage.getItem(materiaId)) || [];

  contenedor.innerHTML = "";
  archivosGuardados.forEach((archivo) => {
      const a = document.createElement("a");
      a.textContent = archivo;
      a.href = "#";
      contenedor.appendChild(a);
  });
}
*/