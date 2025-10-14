connect2Server();

const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');
const form = document.getElementById("modoform");
const lista = document.getElementById("modos");
const condiciones = document.getElementById("condicion");
const condicionesExtra = document.getElementById("extrastuff");
const estado = document.getElementById("estado"); // Asegúrate de que este elemento exista

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    contents.forEach(c => c.classList.remove('active'));
    const tabId = tab.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

function actualizarReloj() {
  const ahora = new Date();
  const opciones = { hour: '2-digit', minute: '2-digit', hour12: true };
  const opcionesFecha = { day: '2-digit', month: '2-digit', year: 'numeric' };

  const hora = ahora.toLocaleTimeString('es-AR', opciones);
  const fecha = ahora.toLocaleDateString('es-AR', opcionesFecha);

  document.getElementById("reloj").innerText = `${fecha} - ${hora}`;
}

setInterval(actualizarReloj, 10000);
actualizarReloj();

condiciones.addEventListener("change", () => {
  condicionesExtra.innerHTML = "";
  if (condiciones.value === "hora") {
    const desde = document.createElement("label");
    desde.innerHTML = `Desde: <input type="time" id="horaDesde">`;
    const hasta = document.createElement("label");
    hasta.innerHTML = `Hasta: <input type="time" id="horaHasta">`;
    condicionesExtra.appendChild(desde);
    condicionesExtra.appendChild(hasta);
  } else if (condiciones.value === "dia") {
    condicionesExtra.innerHTML = `
      <label>Día:
        <select id="diaSemana">
          <option value="1">Lunes</option>
          <option value="2">Martes</option>
          <option value="3">Miércoles</option>
          <option value="4">Jueves</option>
          <option value="5">Viernes</option>
          <option value="6">Sábado</option>
          <option value="7">Domingo</option>
        </select>
      </label>
    `;
  } else if (condiciones.value === "luz") {
    condicionesExtra.innerHTML = `
      <label>
        Nivel de luz:
        <select id="nivelLuz">
          <option value="oscuro">Oscuro</option>
          <option value="claro">Claro</option>
        </select>
      </label>
    `;
  }
});

function crearModo(nombre, tipo) {
  let condiciones = {};

  if (tipo === "hora") {
    condiciones = {
      tipo: "hora",
      desde: document.getElementById("horaDesde").value,
      hasta: document.getElementById("horaHasta").value
    };
  } else if (tipo === "dia") {
    condiciones = {
      tipo: "dia",
      dia: document.getElementById("diaSemana").value
    };
  } else if (tipo === "luz") {
    condiciones = {
      tipo: "luz",
      nivel: document.getElementById("nivelLuz").value
    };
  }

  postEvent("crearModo", { nombre, condiciones }, (respuesta) => {
    console.log("Modo guardado:", respuesta);
    cargarModos();
  });

  form.reset();
  condicionesExtra.innerHTML = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombreModo").value;
  const tipo = condiciones.value;

  if (!nombre || !tipo) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  crearModo(nombre, tipo);
});

function botonApretado(status) {
  if (status.on) {
    estado.innerText = "prendido";
  } else {
    receive("boton", botonApretado);
  }
}