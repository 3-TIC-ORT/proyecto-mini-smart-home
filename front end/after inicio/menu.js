connect2Server();

let tabs = document.querySelectorAll('.tab');
let contents = document.querySelectorAll('.tab-content');
let form = document.getElementById("modoform");
let lista = document.getElementById("modos");
let condicion = document.getElementById("condicion");
let condicionesExtra = document.getElementById("extrastuff");
let estado = document.getElementById("estado"); // Asegúrate de que este elemento exista

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    contents.forEach(c => c.classList.remove('active'));
    let tabId = tab.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

function actualizarReloj() {
  let ahora = new Date();
  let opciones = { hour: '2-digit', minute: '2-digit', hour12: true };
  let opcionesFecha = { day: '2-digit', month: '2-digit', year: 'numeric' };

  let hora = ahora.toLocaleTimeString('es-AR', opciones);
  let fecha = ahora.toLocaleDateString('es-AR', opcionesFecha);

  document.getElementById("reloj").innerText = `${fecha} - ${hora}`;
}

setInterval(actualizarReloj, 10000);
actualizarReloj();

condicion.addEventListener("change", () => {
  condicionesExtra.innerHTML = "";
  if (condicion.value === "hora") {
    let desde = document.createElement("label");
    desde.innerHTML = `Desde: <input type="time" id="desdeHora">`;
    let hasta = document.createElement("label");
    hasta.innerHTML = `Hasta: <input type="time" id="hastaHora">`;
    condicionesExtra.appendChild(desde);
    condicionesExtra.appendChild(hasta);
  } else if (condicion.value === "dia") {
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
  } else if (condicion.value === "luz") {
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
    
    let desdeHora = document.getElementById("desdeHora").value;
    let hastaHora = document.getElementById("hastaHora").value;
    
    condiciones = {
      tipo: "hora",
      desde: desdeHora,
      hasta: hastaHora
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
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let nombre = document.getElementById("nombre").value;
  let tipo = condicion.value;

  if (!nombre || !tipo) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  crearModo(nombre, tipo);
});

function cargarModos() {
    getEvent("obtenerModos", (data) => {
      console.log("Modos recibidos:", data);
  
      if (!lista) return;
  
      lista.innerHTML = "";
  
      // parsear si viene como string
      let modosArray = data;
      if (typeof data === "string") {
        try {
          modosArray = JSON.parse(data);
        } catch (err) {
          console.error("Error parseando data de obtenerModos:", err);
          modosArray = [];
        }
      }
  
      if (!Array.isArray(modosArray) || modosArray.length === 0) {
        lista.innerHTML = "<li>No hay modos guardados.</li>";
        return;
      }
  
      modosArray.forEach((modo) => {
        const li = document.createElement("li");
        const tipoCond = modo.condiciones ? modo.condiciones.tipo : "sin condiciones";
        li.textContent = `${modo.nombre || "sin nombre"} (${tipoCond})`;
        lista.appendChild(li);
      });
    });
  }
cargarModos();

function botonApretado(status) {
  if (status.on) {
    estado.innerText = "prendido";
  } else {
    receive("boton", botonApretado);
  }
}