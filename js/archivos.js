document.addEventListener("DOMContentLoaded", function () {
  const tabla = document.querySelector("#tablaMateriasArchivos tbody"); ////FUNCION PROXIMA AGREGAR MATERIAS QUE DECIDA EL USUARIO. ASUMIMOS UNA TABLA
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
