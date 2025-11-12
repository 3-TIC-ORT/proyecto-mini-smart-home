connect2Server();

let tabs = document.querySelectorAll('.tab');
let contents = document.querySelectorAll('.tab-content');
let form = document.getElementById("modoform");
let lista = document.getElementById("modos");
let condicion = document.getElementById("condicion");
let condicionesExtra = document.getElementById("extrastuff");
let estado = document.getElementById("estado"); // Asegúrate de que este elemento exista

let usuarioLogueado = localStorage.getItem("usuarioLogueado");

if (usuarioLogueado) {
  console.log("Sesión activa para:", usuarioLogueado);

  let usuario = JSON.parse(usuarioLogueado);

  getEvent("obtenerUsuario", function() {

    //me perdi, me estrese, ya no se que hacer con mi vida.

    let saludo = document.getElementById("saludo");
    let nombreUsuario = document.getElementById("nombreusuario");
    let nacimiento = document.getElementById("nacimiento");
    let sobre = document.getElementById("sobre");

    saludo.textContent = `¡Hola, ${usuario.nombre || "Usuario"}!`;
    nombreUsuario.textContent = usuario.nombre || "Sin nombre";
    nacimiento.textContent = usuario.cumple || "No disponible";
    sobre.textContent = usuario.sobre || "Sin descripción";
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    contents.forEach(c => c.classList.remove('active'));
    let tabId = tab.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

let conf = document.querySelector(".settings");
let iconMenu = document.querySelector(".icon-menu");
let casita = document.getElementById("casita");
let modooscuro = document.getElementById("modooscuro");
let logout = document.getElementById("logout");

// Toggle desplegable
conf.addEventListener("click", () => {
  iconMenu.classList.toggle("active");
});

casita.addEventListener("click", () => {
  location.href = "../pantalla_principal/princi.html"
})

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

//los modosssss

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
  let action = document.createElement("div");
  action.id = "acciones";
  action.innerHTML = `
    <h3>Acciones</h3>

    <label>
      Persiana:
      <select id="percy">
        <option value="nada">Ninguna</option>
        <option value="abrir">Abrir</option>
        <option value="cerrar">Cerrar</option>
      </select>
    </label>

    <label>
      Ventilador:
      <select id="venti">
        <option value="nada">Ninguna</option>
        <option value="prender">Prender</option>
        <option value="apagar">Apagar</option>
      </select>
    </label>

    <label>
      Luces rojas:
      <select id="rojo">
        <option value="nada">Ninguna</option>
        <option value="prender">Prender</option>
        <option value="apagar">Apagar</option>
      </select>
    </label>

    <label>
      Luces azules:
      <input type="range" id="azul" min="0" max="5" step="1" value="0">
    </label>
  `;

  condicionesExtra.appendChild(action);
});

function crearModo(nombre, tipo) {
  let condiciones = {};

  if (tipo === "hora") {
    condiciones = {
      tipo: "hora",
      desde: document.getElementById("desdeHora").value,
      hasta: document.getElementById("hastaHora").value
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

  let acciones = {
    persiana: document.getElementById("percy").value,
    ventilador: document.getElementById("venti").value,
    lucesrojas: document.getElementById("rojo").value,
    lucesazules: parseInt(document.getElementById("azul").value)
  };

  console.log("Se envía al backend:", { nombre, condiciones, acciones });

  postEvent("crearModo", { nombre, condiciones, acciones }, (respuesta) => {
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

  let acciones = {
    persiana: document.getElementById("percy").value,
    ventilador: document.getElementById("venti").value,
    lucesrojas: document.getElementById("rojo").value,
    lucesazules: parseInt(document.getElementById("azul").value)
  };

  crearModo(nombre, tipo, acciones);
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
        let li = document.createElement("li");
        let tipoCond = modo.condiciones ? modo.condiciones.tipo : "sin condiciones";
        li.textContent = `${modo.nombre || "sin nombre"} (${tipoCond})`;
        lista.appendChild(li);
      });
    });
  }
cargarModos();

let botonEjecutar = document.getElementById("btnEjecutar");

botonEjecutar.addEventListener("click", () => {
  // Obtenemos los valores actuales del formulario
  let acciones = {
    persiana: document.getElementById("percy").value,
    ventilador: document.getElementById("venti").value,
    lucesrojas: document.getElementById("rojo").value,
    lucesazules: parseInt(document.getElementById("azul").value)
  };

  console.log("Ejecutando modo con:", acciones);

  // Enviamos las acciones al backend
postEvent("ejecutarModo", {
  persiana: acciones.persiana,
  ventilador: acciones.ventilador,
  lucesrojas: acciones.lucesrojas,
  lucesazules: acciones.lucesazules
}, (data) => {

  if (acciones.persiana === 1) actualizarPersiana(1);
  if (acciones.persiana === 0) actualizarPersiana(0);

  if (acciones.ventilador === 1) actualizarVentilador(true);
  if (acciones.ventilador === 0) actualizarVentilador(false);

  if (acciones.lucesrojas === 1) actualizarLucesRojas(true);
  if (acciones.lucesrojas === 0) actualizarLucesRojas(false);

  if (acciones.lucesazules >=0 && acciones.lucesazules >=5) {
    actualizarLucesAzules(acciones.lucesazules);
  }

  if (data && data.ok) {
    console.log("Modo ejecutado correctamente");
  } else if (data && data.error) {
    console.error("Error al ejecutar modo:", data.error);
  }
});

});

function activarModo(modo) {
  let a = modo.acciones;
  if (!a) return;

  if (a.persiana === "abrir") {
    actualizarPersiana(1);
  } 
  if (a.persiana === "cerrar") {
    actualizarPersiana(0);
  } 

  if (a.ventilador === "prender") {
    actualizarVentilador(true);
  } 
  if (a.ventilador === "apagar") {
    actualizarVentilador(false);
  } 

  if (a.lucesrojas === "prender") {
    actualizarLucesRojas(true);
  } 
  if (a.lucesrojas === "apagar") {
    actualizarLucesRojas(false);
  } 

  if (typeof a.lucesazules === "number") {
    actualizarLucesAzules(a.lucesazules);
  }

  postEvent("ejecutarModo", a, function(data){
    console.log("Modo activado:", modo.nombre);
  });
}

//musica

let audio = document.getElementById("audio");
let titulo = document.getElementById("titulo");
let genero = document.getElementById("genero");
let botonplay = document.getElementById("btnplay");
let botonanterior = document.getElementById("btnanterior");
let botonsaltear = document.getElementById("btnsaltear");
let playicono = document.getElementById("playicono");
let progreso = document.getElementById("progreso");
let progresoThumb = document.getElementById("progresoThumb");

let current = 0;

let songs = [
  { titulo: "Canción 1", genero: "Pop", file: "../musica/track1.mp3" },
  { titulo: "Canción 2", genero: "Rock", file: "../musica/track2.mp3" },
  { titulo: "Canción 3", genero: "Jazz", file: "../musica/track3.mp3" },
  { titulo: "Demo", genero: "Test", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
];

function cargarCancion(index) {
  let song = songs[index];
  titulo.textContent = song.titulo;
  genero.textContent = song.genero;
  audio.src = song.file;
}

function updatePlayIcon() {
  if (audio.paused) {
    playicono.src = "../imagenes/playicono.png";
  } else {
    playicono.src = "../imagenes/pausa.png";
  }
}

botonplay.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  updatePlayIcon();
});

botonanterior.addEventListener("click", () => {
  current = (current - 1 + songs.length) % songs.length;
  cargarCancion(current);
  audio.play();
  updatePlayIcon();
});

botonsaltear.addEventListener("click", () => {
  current = (current + 1) % songs.length;
  cargarCancion(current);
  audio.play();
  updatePlayIcon();
});

audio.addEventListener("timeupdate", () => {
  let porcentaje = (audio.currentTime / audio.duration) * 100;
  progreso.style.width = porcentaje + "%";
  progresoThumb.style.left = porcentaje + "%";
});

audio.addEventListener("ended", () => {
  current = (current + 1) % songs.length;
  cargarCancion(current);
  audio.play();
});

cargarCancion(current);

//CONTROLLLLLLLL
// persiana

let botonAbrirPersiana = document.getElementById("abrir");
let botonCerrarPersiana = document.getElementById("cerrar");
let persiana = document.getElementById("persiana");

function actualizarPersiana(estado) {
  if (estado > 0) {
    persiana.src = "../imagenes/openpercy.png";
  } else {
    persiana.src = "../imagenes/persianacerrada.png";
  }
}

botonAbrirPersiana.addEventListener("click", () => {
  actualizarPersiana(1);
  postEvent("controlPersiana", { estado: 1 }, function (res) {
    console.log("Backend respondió (persiana abrir):", res);
  });
});

botonCerrarPersiana.addEventListener("click", () => {
  actualizarPersiana(0);
  postEvent("controlPersiana", { estado: 0 }, function (res) {
    console.log("Backend respondió (persiana cerrar):", res);
  });
});

actualizarPersiana(0);

// ventilador

let botonPrenderVentilador = document.getElementById("helicopterhelicopter");
let botonApagarVentilador = document.getElementById("nogira");
let ventilador = document.getElementById("ventilador");

function actualizarVentilador(estado) {
  if (estado > 0) {
    ventilador.classList.add("girando");
  } else {
    ventilador.classList.remove("girando");
  }
}

botonPrenderVentilador.addEventListener("click", () => {
  actualizarVentilador(1);
  postEvent("controlVentilador", { estado: 1 }, function (res) {
    console.log("Backend respondió (ventilador prender):", res);
  });
});

botonApagarVentilador.addEventListener("click", () => {
  actualizarVentilador(0);
  postEvent("controlVentilador", { estado: 0 }, function (res) {
    console.log("Backend respondió (ventilador apagar):", res);
  });
});

actualizarVentilador(0);

//  luces
// fila 1
let botonPrender = document.getElementById("prender");
let botonApagar = document.getElementById("apagar");
let potter = document.getElementById("intensidad2");
let luces = document.querySelectorAll(".luces");


function actualizarLuces(fila, intensidad) {
  luces.forEach((luz, i) => {
    let bomb = luz.querySelector("img")
    if (fila === 1 && i < 4) {
      if (intensidad > 0) {
        bomb.src = "../imagenes/rojoprendido.png";
        luz.classList.add("prendidas-rojas");
      } else {
        bomb.src = "../imagenes/rojoapagado.png";
        luz.classList.remove("prendidas-rojas");
      }
    }
    if (fila === 2 && i >= 4) {
      if (intensidad > 0) {
        bomb.src = "../imagenes/azulprendido.png";
        luz.classList.add("prendidas-azules");
      } else {
        bomb.src = "../imagenes/azulapagado.png";
        luz.classList.remove("prendidas-azules");
      }
    }
  });
}

botonPrender.addEventListener('click', () => {
  actualizarLuces(1, 1); // mostrar como encendidas
  postEvent('controlLucesLEDr', { fila: 1, intensidad: 1 }, (res) => {
    console.log('Backend respondió fila1 (prender):', res);
  });
});

botonApagar.addEventListener('click', () => {
  actualizarLuces(1, 0); // mostrar como apagadas
  postEvent('controlLucesLEDr', { fila: 1, intensidad: 0 }, (res) => {
    console.log('Backend respondió fila1 (apagar):', res);
  });
});

potter.addEventListener('input', () => {
  let valor = parseInt(potter.value);
  actualizarLuces(2, valor);
  postEvent('controlLucesLEDa', { fila: 2, intensidad: valor }, (res) => {
    console.log('Backend respondió fila2:', res);
  });
});

actualizarLuces(1, 0);
actualizarLuces(2, parseInt(potter.value));