connect2Server();

let tabs = document.querySelectorAll('.tab');
let contents = document.querySelectorAll('.tab-content');
let form = document.getElementById("modoform");
let lista = document.getElementById("modos");
let condicion = document.getElementById("condicion");
let condicionesExtra = document.getElementById("extrastuff");

// perfil

let containerPerfilView = document.getElementById("perfilView");
let containerPerfilEdit = document.getElementById("perfilEdit");

let botonEditar = document.getElementById("btnEditar");
let botonGuardar = document.getElementById("guardarPerfil");
let botonCancelar = document.getElementById("cancelarEditar");

let inputNombre = document.getElementById("inputNombre");
let inputCumple = document.getElementById("inputCumple");
let inputSobre = document.getElementById("inputSobre");

let usuarioLogueado = localStorage.getItem("usuarioLogueado");

if (usuarioLogueado) {
  let usuario = JSON.parse(usuarioLogueado);

  postEvent("obtenerUsuario", usuario, function(data) {

    let saludo = document.getElementById("saludo");
    let userID = document.getElementById("userid");
    let nombreUsuario = document.getElementById("nombreusuario");
    let nacimiento = document.getElementById("nacimiento");
    let sobre = document.getElementById("sobre");

    if (data.nombre) {
      saludo.textContent = "¡Hola, " + data.nombre + "!";
      nombreUsuario.textContent = data.nombre;
    } else {
      saludo.textContent = "¡Hola!";
      nombreUsuario.textContent = "Sin nombre";
    }

    // cumple
    if (data.cumple) {
      nacimiento.textContent = data.cumple;
    } else {
      nacimiento.textContent = "No disponible";
    }

    // sobre
    if (data.sobre) {
      sobre.textContent = data.sobre;
    } else {
      sobre.textContent = "Sin descripción";
    }

    // id
    if (data.id) {
      userID.textContent = data.id;
    } else {
      userID.textContent = "sin id";
    }

    // editar
    botonEditar.addEventListener("click", function () {
      
      if (data.nombre) {
        inputNombre.value = data.nombre;
      } else {
        inputNombre.value = "";
      }

      if (data.cumple) {
        inputCumple.value = data.cumple;
      } else {
        inputCumple.value = "";
      }

      if (data.sobre) {
        inputSobre.value = data.sobre;
      } else {
        inputSobre.value = "";
      }

      // mostrar editor y ocultar normal
      if (containerPerfilView) {
        containerPerfilView.style.display = "none";
      }
      if (containerPerfilEdit) {
        containerPerfilEdit.style.display = "block";
      }
    });

    botonCancelar.addEventListener("click", function () {
      if (containerPerfilEdit) {
        containerPerfilEdit.style.display = "none";
      }
      if (containerPerfilView) {
        containerPerfilView.style.display = "flex";
      }
    });

    // --- guardar ---
    botonGuardar.addEventListener("click", function () {
      let nuevoNombre = inputNombre.value.trim();
      let nuevoCumple = inputCumple.value;
      let nuevoSobre = inputSobre.value.trim();

     
      let datosActualizados = {
        id: data.id,
        nombre: nuevoNombre,
        cumple: nuevoCumple,
        sobre: nuevoSobre
      };

      postEvent("actualizarUsuario", datosActualizados, function (data) {
        let actualizado = null;
        if (data && typeof data === "object") {
          actualizado = data;
        } else {
          actualizado = datosActualizados;
        }

        if (actualizado.nombre) {
          document.getElementById("nombreusuario").textContent = actualizado.nombre;
          document.getElementById("saludo").textContent = "¡Hola, " + actualizado.nombre + "!";
        } else {
          document.getElementById("nombreusuario").textContent = "Sin nombre";
          document.getElementById("saludo").textContent = "¡Hola!";
        }

        if (actualizado.cumple) {
          document.getElementById("nacimiento").textContent = actualizado.cumple;
        } else {
          document.getElementById("nacimiento").textContent = "No disponible";
        }

        if (actualizado.sobre) {
          document.getElementById("sobre").textContent = actualizado.sobre;
        } else {
          document.getElementById("sobre").textContent = "Sin descripción";
        }

        // guardar en localStorage (mantener objeto usuario)
        data.nombre = actualizado.nombre;
        data.cumple = actualizado.cumple;
        data.sobre = actualizado.sobre;
        localStorage.setItem("usuarioLogueado", JSON.stringify(data));

        if (containerPerfilEdit) {
          containerPerfilEdit.style.display = "none";
        }
        if (containerPerfilView) {
          containerPerfilView.style.display = "flex";
        }
      });
    });

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

// el coso este desplegable
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

let modosGuardados = [];
let modoActualIndex = 0;

// Mostrar campos extra según tipo
condicion.addEventListener("change", () => {
  condicionesExtra.innerHTML = "";
  if (condicion.value === "hora") {
    condicionesExtra.innerHTML = `
      <label>Desde: <input type="time" id="desdeHora"></label>
      <label>Hasta: <input type="time" id="hastaHora"></label>
    `;
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
  }

  let accionesHTML = `
    <h3>Acciones</h3>
    <label>Persiana:
      <select id="percy">
        <option value="nada">Ninguna</option>
        <option value="abrir">Abrir</option>
        <option value="cerrar">Cerrar</option>
      </select>
    </label>
    <label>Ventilador:
      <select id="venti">
        <option value="nada">Ninguna</option>
        <option value="prender">Prender</option>
        <option value="apagar">Apagar</option>
      </select>
    </label>
    <label>Luces rojas:
      <select id="rojo">
        <option value="nada">Ninguna</option>
        <option value="prender">Prender</option>
        <option value="apagar">Apagar</option>
      </select>
    </label>
    <label>Luces azules:
      <input type="range" id="azul" min="0" max="5" step="1" value="0">
    </label>
  `;
  let actionDiv = document.createElement("div");
  actionDiv.id = "acciones";
  actionDiv.innerHTML = accionesHTML;
  condicionesExtra.appendChild(actionDiv);
});

// Crear modo
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
  }

  let acciones = {
    persiana: document.getElementById("percy").value,
    ventilador: document.getElementById("venti").value,
    lucesrojas: document.getElementById("rojo").value,
    lucesazules: parseInt(document.getElementById("azul").value)
  };

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
  crearModo(nombre, tipo);
});

// Cargar modos
function cargarModos() {
  getEvent("obtenerModos", (data) => {
    let modosArray = typeof data === "string" ? JSON.parse(data) : data;
    modosGuardados = modosArray;

    mostrarModos();
  });
}

cargarModos();

// Carrusel
let modoActualDiv = document.getElementById("modoActual");
let prevBtn = document.getElementById("prevModo");
let nextBtn = document.getElementById("nextModo");

function mostrarModos() {
  if (modosGuardados.length === 0) {
    modoActualDiv.textContent = "No hay modos";
    return;
  }
  modoActualDiv.textContent = modosGuardados[modoActualIndex].nombre;
}

prevBtn.addEventListener("click", () => {
  if (modosGuardados.length === 0) return;
  modoActualIndex = (modoActualIndex - 1 + modosGuardados.length) % modosGuardados.length;
  mostrarModos();
});

nextBtn.addEventListener("click", () => {
  if (modosGuardados.length === 0) return;
  modoActualIndex = (modoActualIndex + 1) % modosGuardados.length;
  mostrarModos();
});

// Botón seleccionar modo
document.getElementById("btnSeleccionar").addEventListener("click", () => {
  if (modosGuardados.length === 0) return;
  activarModo(modosGuardados[modoActualIndex]);
});

// Activar modo
function activarModo(modo) {
  if (!modo || !modo.acciones) return;
  let a = modo.acciones;

  // Actualizar frontend
  if (a.persiana === "abrir") actualizarPersiana(1);
  else if (a.persiana === "cerrar") actualizarPersiana(0);

  if (a.ventilador === "prender") actualizarVentilador(1);
  else if (a.ventilador === "apagar") actualizarVentilador(0);

  if (a.lucesrojas === "prender") actualizarLuces(1,1);
  else if (a.lucesrojas === "apagar") actualizarLuces(1,0);

  if (typeof a.lucesazules === "number") actualizarLuces(2, a.lucesazules);

  // Preparar datos backend
  let accionesBackend = {
    persiana: a.persiana === "abrir" ? 1 : a.persiana === "cerrar" ? 0 : null,
    ventilador: a.ventilador === "prender" ? 1 : a.ventilador === "apagar" ? 0 : null,
    lucesrojas: a.lucesrojas === "prender" ? 1 : a.lucesrojas === "apagar" ? 0 : null,
    lucesazules: a.lucesazules
  };

  postEvent("ejecutarModo", accionesBackend, (data) => {
    console.log("Modo activado:", modo.nombre, accionesBackend);
  });
}

// Verificación automática
function verificarModos() {
  getEvent("obtenerModos", (modos) => {
    if (typeof modos === "string") {
      try { modos = JSON.parse(modos); } catch { modos = []; }
    }
    if (!Array.isArray(modos)) return;

    let ahora = new Date();
    let horaActual = ahora.getHours().toString().padStart(2,"0")+":"+ahora.getMinutes().toString().padStart(2,"0");
    let diaHoy = ahora.getDay() === 0 ? 7 : ahora.getDay();

    modos.forEach(modo => {
      let c = modo.condiciones;
      if (!c) return;

      let activar = false;
      if (c.tipo === "hora" && horaActual >= c.desde && horaActual <= c.hasta) activar = true;
      if (c.tipo === "dia" && parseInt(c.dia) === diaHoy) activar = true;

      if (activar) activarModo(modo);
    });
  });
}
setInterval(verificarModos, 60000);
verificarModos();

// Botón manual
document.getElementById("btnEjecutar")?.addEventListener("click", () => {
  let acciones = {
    persiana: document.getElementById("percy").value,
    ventilador: document.getElementById("venti").value,
    lucesrojas: document.getElementById("rojo").value,
    lucesazules: parseInt(document.getElementById("azul").value)
  };
  activarModo({ acciones: acciones, nombre: "Manual" });
});


//musica

let audio = document.getElementById("audio");
let titulo = document.getElementById("titulo");
let genero = document.getElementById("genero");

let botonplay = document.getElementById("btnplay");
let botonanterior = document.getElementById("btnanterior");
let botonsaltear = document.getElementById("btnsaltear");
let repeatBtn = document.getElementById("repeat");
let repeatIcon = document.getElementById("repeatIcon");
let muteBtn = document.getElementById("mute");
let shuffleBtn = document.getElementById("shuffle");
let shuffleIcon = document.getElementById("shuffleIcon");

let progreso = document.getElementById("progreso");
let progresoThumb = document.getElementById("progresoThumb");

let current = 0;

let songs = [
  { titulo: "Canción 1", genero: "Pop", file: "../musica/track1.mp3" },
  { titulo: "Canción 2", genero: "Rock", file: "../musica/track2.mp3" },
  { titulo: "Canción 3", genero: "Jazz", file: "../musica/track3.mp3" }
];

function cargarCancion(index) {
  let song = songs[index];
  titulo.textContent = song.titulo;
  genero.textContent = song.genero;
  audio.src = song.file;
  audio.currentTime = 0;
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

let repetir = false;

repeatBtn.addEventListener("click", function () {
  if (repetir === false) {
    repetir = true;
    repeatIcon.style.filter = "brightness(2)";
  } else {
    repetir = false;
    repeatIcon.style.filter = "brightness(1)";
  }
});


muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  if (audio.muted) {
    muteBtn.querySelector("img").src = "../imagenes/muteado.png";
  } else {
    muteBtn.querySelector("img").src = "../imagenes/mute.png";
  }
});

let shuffle = false;

shuffleBtn.addEventListener("click", function () {
  if (shuffle === false) {
    shuffle = true;
    shuffleIcon.style.filter = "brightness(2)";
  } else {
    shuffle = false;
    shuffleIcon.style.filter = "brightness(1)";
  }
});

audio.addEventListener("timeupdate", () => {
  let porcentaje = (audio.currentTime / audio.duration) * 100;
  progreso.style.width = porcentaje + "%";
  progresoThumb.style.left = porcentaje + "%";
});

function nextSong() {
  if (shuffle) {
    // canción aleatoria distinta a la actual
    let newIndex;

    // evitar repetir la misma canción
    if (songs.length > 1) {
      do {
        newIndex = Math.floor(Math.random() * songs.length);
      } while (newIndex === current);
      current = newIndex;
    }
  } else {
    current = (current + 1) % songs.length;
  }

  cargarCancion(current);
  audio.play();
}

botonsaltear.addEventListener("click", () => {
  nextSong();
  updatePlayIcon();
});

audio.addEventListener("ended", () => {
  if (repetir) {
    audio.currentTime = 0;
    audio.play();
    return;
  }

  nextSong();
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

let estado = document.getElementById("estado"); 

subscribeRealTimeEvent("estado", (data) => {
  console.log("Actualización desde hardware:", data);

  // Percy-anna(entienden el chiste?)
  if (data.persiana !== undefined) {
    actualizarPersiana(data.persiana);
  }

  // helicopter helicopter
  if (data.ventilador !== undefined) {
    actualizarVentilador(data.ventilador);
  }

  // RED LIGHT
  if (data.lucesrojas !== undefined) {
    actualizarLuces(1, data.lucesrojas);
  }

  //luces azules
  if (data.lucesazules !== undefined) {
    actualizarLuces(2, data.lucesazules);
  }

  // lo que me dijo Fran que haga con if status y lalala
  if (data.status && data.status.on) {
    estado.innerText = "prendido";
  }
});

//el sensor de temperatura que todavia no se donde va

let temp = document.getElementById("temperatura");

subscribeRealTimeEvent("temperatura", (data) => {
  // Fran debería mandar algo como { value: 23.5 }
  console.log("Temperatura:", data);
  temp.innerText = `${data.value}°C`;
});