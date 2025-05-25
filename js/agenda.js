const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentDate = new Date();

const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = domingo
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();

    const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    monthYearElement.textContent = monthYearString;

    let datesHTML = '';

    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        datesHTML += `<div class="borderDate"><div class="date inactive"></div></div>`;
    }

    const examenes = JSON.parse(localStorage.getItem('examenes')) || {};

    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const dateString = date.toISOString().split('T')[0]; // yyyy-mm-dd
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        const tieneExamen = examenes[dateString] ? 'tiene-examen' : '';
        datesHTML += `<div class="borderDate"><div class="date ${activeClass} ${tieneExamen}" data-fecha="${dateString}">${i}</div></div>`;
    }

    datesElement.innerHTML = datesHTML;

    /*Evento de click A LA FECHA*/
    document.querySelectorAll('.date:not(.inactive)').forEach(el => {
        el.addEventListener('click', (e) => {
            const fecha = e.target.getAttribute('data-fecha');
            abrirFormularioExamen(fecha);
        });
    });
};

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
    mostrarExamenesDelMes();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
    mostrarExamenesDelMes();
});

updateCalendar();
mostrarExamenesDelMes();

function abrirFormularioExamen(fecha) {
    const modal = document.getElementById('examenModal');
    document.getElementById('fechaExamenTexto').textContent = `Fecha: ${fecha}`;
    modal.style.display = 'block';

    document.getElementById('guardarExamen').onclick = () => {
        const materia = document.getElementById('materiaExamen').value;
        const hora = document.getElementById('horaExamen').value;
        const temas = document.getElementById('temasExamen').value;

       const nuevoExamen = { materia, hora, temas, hecho: false, nota: null };
        const examenes = JSON.parse(localStorage.getItem('examenes')) || {};

        if (!examenes[fecha]) {
            examenes[fecha] = [];
        }

        examenes[fecha].push(nuevoExamen);
        localStorage.setItem('examenes', JSON.stringify(examenes));

        modal.style.display = 'none';
        document.getElementById('materiaExamen').value = '';
        document.getElementById('horaExamen').value = '';
        document.getElementById('temasExamen').value = '';

        updateCalendar(); 
        mostrarExamenesDelMes();
    };
}

function mostrarExamenesDelMes() {
    const examenes = JSON.parse(localStorage.getItem('examenes')) || {};
    const examenesDelMes = document.getElementById('examenesDelMes');
    examenesDelMes.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    let hayExamenes = false;

    Object.keys(examenes).forEach(fecha => {
        if (fecha.startsWith(`${year}-${month}`)) {
            hayExamenes = true;
            examenes[fecha].forEach((examen, index) => {
                const div = document.createElement('div');
                div.classList.add('examen-item');

                let estadoHTML = '';
                if (examen.hecho) {
                    const aprobado = examen.nota >= 4 ? 'Aprobado' : 'Desaprobado';
                    estadoHTML = `<p><strong>Nota:</strong> ${examen.nota} (${aprobado})</p>`;
                } else {
                    estadoHTML = `<button class="marcarHechoBtn" data-fecha="${fecha}" data-index="${index}">Marcar como hecho</button>`;
                }

                div.innerHTML = `
                    <strong>${fecha}</strong><br>
                    <strong>${examen.materia}</strong> a las ${examen.hora}<br>
                    Temas: ${examen.temas}<br>
                    ${estadoHTML}
                    <button class="borrarExamenBtn" data-fecha="${fecha}" data-index="${index}">X</button>
                    <hr>
                `;

                examenesDelMes.appendChild(div);
            });
        }
    });

    if (!hayExamenes) {
        examenesDelMes.innerHTML = '<p>No hay exámenes este mes.</p>';
    }

    // Listeners después de renderizar HTML
    document.querySelectorAll('.borrarExamenBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fecha = e.target.getAttribute('data-fecha');
            const index = e.target.getAttribute('data-index');
            eliminarExamen(fecha, index);
        });
    });

    document.querySelectorAll('.marcarHechoBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fecha = e.target.getAttribute('data-fecha');
            const index = e.target.getAttribute('data-index');
            marcarExamenComoHecho(fecha, index);
        });
    });
}

function marcarExamenComoHecho(fecha, index) {
    const examenes = JSON.parse(localStorage.getItem('examenes')) || {};
    const examen = examenes[fecha][index];

    const notaStr = prompt("Ingrese la nota del examen:");
    const nota = parseFloat(notaStr);

    if (isNaN(nota) || nota < 0 || nota > 10) {
        alert("Nota inválida. Ingrese un número entre 0 y 10.");
        return;
    }

    examen.hecho = true;
    examen.nota = nota;

    localStorage.setItem('examenes', JSON.stringify(examenes));
    mostrarExamenesDelMes();
    updateCalendar();
}

function eliminarExamen(fecha, index) {
    const examenes = JSON.parse(localStorage.getItem('examenes')) || {};

    if (examenes[fecha]) {
        examenes[fecha].splice(index, 1); // Borra por índice

        if (examenes[fecha].length === 0) {
            delete examenes[fecha]; // Si no queda ninguno, borra la fecha
        }

        localStorage.setItem('examenes', JSON.stringify(examenes));
        updateCalendar();
        mostrarExamenesDelMes();
    }
}
