function toggleForm() {
  const form = document.getElementById("materiaForm");
  form.style.display = form.style.display === "none" || form.style.display === "" ? "block" : "none";
}

function toggleCamposEstado() {
  const estado = document.getElementById("estado").value;
  document.getElementById("regularizacionGroup").classList.add("hidden");
  document.getElementById("notaGroup").classList.add("hidden");

  if (estado === "regular") {
    document.getElementById("regularizacionGroup").classList.remove("hidden");
  } else if (estado === "final") {
    document.getElementById("notaGroup").classList.remove("hidden");
  }
}

let notasFinales = [];

function agregarMateria() {
  const materia = obtenerValor("materia");
  const estado = obtenerValor("estado");
  const fecha = obtenerValor("fecha");
  const nota = obtenerValor("nota");

  if (!materia || !estado) {
    alert("Completá materia y estado.");
    return;
  }

  const nuevaMateria = crearMateriaObjeto(materia, estado, fecha, nota);
  guardarMateriaLocalStorage(nuevaMateria);

  if (estado === "en curso") {
    mostrarMateriaEnPantalla(materia, estado, "Materia en curso");
  } else if (estado === "regular") {
    if (!fecha) return alert("Ingresá la fecha de regularización.");
    const fechaFinal = new Date(fecha);
    fechaFinal.setFullYear(fechaFinal.getFullYear() + 2);
    const detalle = `Regular (vence: ${fechaFinal.toLocaleDateString()})`;
    mostrarMateriaEnPantalla(materia, estado, detalle);
  } else if (estado === "final") {
    if (!nota) return alert("Ingresá la nota del final.");
    const detalle = `Final aprobado con nota: ${nota}`;
    mostrarMateriaEnPantalla(materia, estado, detalle);
    notasFinales.push(parseFloat(nota));
    calcularPromedio();
  }

  mostrarTodasLasMaterias();
  limpiarFormulario();
  window.location.href = "archivos.html";
}

function obtenerValor(id) {
  return document.getElementById(id).value.trim();
}

function limpiarFormulario() {
  ["materia", "estado", "fecha", "nota"].forEach(id => document.getElementById(id).value = "");
  toggleCamposEstado();
}

function crearMateriaObjeto(nombre, estado, fecha, nota) {
  return {
    codigo: "",
    nombre,
    profesor: "",
    dias: [],
    horario: "-",
    estado,
    fecha: fecha || null,
    nota: nota || null,
    archivos: []
  };
}

function guardarMateriaLocalStorage(materiaObj) {
  const materias = JSON.parse(localStorage.getItem("materias")) || [];
  if (!materias.some(m => m.nombre === materiaObj.nombre)) {
    materias.push(materiaObj);
    localStorage.setItem("materias", JSON.stringify(materias));
  }
}

function mostrarMateriaEnPantalla(materia, estado, detalle) {
  const contenedor =
    estado === "en curso"
      ? document.getElementById("cursoContainer")
      : estado === "regular"
      ? document.getElementById("regularesContainer")
      : document.getElementById("finalesContainer");

  const div = document.createElement("div");
  div.className = "materia-item";
  div.innerHTML = `
    <span><strong>${materia}:</strong> ${detalle}</span>
    <button class="delete-btn" onclick="eliminar(this, '${estado}'${
      estado === "final" ? ", " + materia.nota : ""
    })">Borrar</button>`;
  contenedor.appendChild(div);
}

function calcularPromedio() {
  const promedio = notasFinales.reduce((a, b) => a + b, 0) / notasFinales.length;
  const container = document.getElementById("promedioContainer");
  container.textContent = `Promedio de finales aprobados: ${promedio.toFixed(2)}`;
}

function eliminar(btn, tipo, nota = null) {
  const item = btn.parentElement;
  item.remove();
  if (tipo === "final" && nota !== null) {
    notasFinales = notasFinales.filter(n => n !== parseFloat(nota));
    calcularPromedio();
  }
}

function mostrarTodasLasMaterias() {
  // Esta función puede usarse para renderizar desde el localStorage si hacés que "archivos.html" use lo guardado.
}

function actualizarMateria(elemento, nombreMateria, campo) {
  const materias = JSON.parse(localStorage.getItem("materias")) || [];
  const materia = materias.find(m => m.nombre === nombreMateria);
  if (!materia) return;

  if (campo === "profesor") {
    materia.profesor = elemento.value.trim();
  } else if (campo === "estado") {
    materia.estado = elemento.value;
  }

  localStorage.setItem("materias", JSON.stringify(materias));
}
